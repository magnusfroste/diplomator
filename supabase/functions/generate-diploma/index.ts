import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const scrapeWebsiteData = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DiplomaBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    return {
      title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '',
      metaDescription: html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '',
      colors: extractColors(html),
      fonts: extractFonts(html),
      brandName: extractBrandName(html, url),
      themeColor: html.match(/<meta[^>]*name="theme-color"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '',
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    return null;
  }
};

const extractColors = (html: string) => {
  const colors = new Set<string>();
  const matches = html.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/g);
  if (matches) matches.slice(0, 10).forEach(c => colors.add(c));
  return Array.from(colors);
};

const extractFonts = (html: string) => {
  const fonts = new Set<string>();
  const matches = html.matchAll(/font-family\s*:\s*([^;]+)/gi);
  for (const match of matches) {
    const f = match[1].replace(/['"]/g, '').split(',')[0].trim();
    if (f && f !== 'inherit') fonts.add(f);
  }
  return Array.from(fonts).slice(0, 5);
};

const extractBrandName = (html: string, url: string) => {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
  const domain = new URL(url).hostname.replace('www.', '');
  const siteName = html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '';
  return siteName || title.split(/[-|–—]/)[0].trim() || domain.split('.')[0];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, requestType, imageData, url, currentHtml, currentCss, userFullName, isGuest } = await req.json();

    // Auth check - allow guests without auth
    if (!isGuest) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace('Bearer ', '');
      const { error } = await supabase.auth.getClaims(token);
      if (error) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not found');
    }

    let systemPrompt = `You are an expert diploma designer. Your task is to create beautiful, professional diplomas based on user requirements. 

ABSOLUTELY FORBIDDEN - NEVER INCLUDE ANY OF THESE:
- QR codes of any kind (SVG, canvas, image, or text placeholders)
- QR code containers, divs, or sections
- Any element with "QR" text or placeholders

IMPORTANT: Never use <img> tags or reference external image files. Use only CSS to create all visual elements including seals, decorative borders, and emblems.

SIGNATURE SECTION: Always include a professional signature section with:
- A signature line (using CSS border-bottom)
- The text "Mr Diploma" in handwriting style (use Dancing Script font or similar cursive font)
- Style it professionally with handwriting styling: font-family: 'Dancing Script', cursive; font-weight: 700; transform: rotate(-2deg); display: inline-block;

CSS SHAPE CREATION GUIDELINES:
- For hearts: Use the ::before and ::after pseudo-elements with border-radius
- Make shapes prominent with good contrast and adequate sizing
- Use proper CSS transforms for animations

MODIFICATIONS: Users can request adjustments to their diplomas after creation.

Always respond with:
1. A friendly message explaining what you've created or modified
2. Complete HTML code for the diploma
3. Complete CSS code for styling

Format your response like this:
MESSAGE: [Your friendly explanation]
HTML: [Complete HTML code]
CSS: [Complete CSS code]

Make diplomas that are:
- Professional and elegant
- Print-ready (8.5x11 or A4 size)
- Use classic fonts like Georgia, Times New Roman, or serif fonts
- Include CSS-based decorative elements
- NEVER include any QR code elements
- ALWAYS include a signature section with "Mr Diploma" in handwriting style`;

    let requestBody;

    if (requestType === 'image') {
      systemPrompt = `You are an expert diploma designer. Analyze the uploaded image and create a diploma design inspired by its style, colors, layout, and aesthetic elements.

ABSOLUTELY FORBIDDEN: QR codes of any kind.
IMPORTANT: Never use <img> tags. Use only CSS for all visual elements.
SIGNATURE: Always include "Mr Diploma" signature with Dancing Script font.

Format your response:
MESSAGE: [Explanation]
HTML: [Complete HTML code]
CSS: [Complete CSS code]`;

      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: 'Please analyze this image and create a diploma design inspired by its style. Use only CSS for all visual elements. Include a "Mr Diploma" signature.' },
            { type: 'image', source: { type: 'base64', media_type: imageData.type, data: imageData.data } }
          ]
        }]
      };
    } else if (requestType === 'url') {
      const websiteData = await scrapeWebsiteData(url);
      let websiteInfo = '';
      if (websiteData) {
        websiteInfo = `\n\nSCRAPED WEBSITE DATA:\n- Brand: ${websiteData.brandName}\n- Title: ${websiteData.title}\n- Colors: ${websiteData.colors.join(', ')}\n- Fonts: ${websiteData.fonts.join(', ')}\n- Theme Color: ${websiteData.themeColor}`;
      }

      systemPrompt = `You are an expert diploma designer. Create a diploma reflecting the website's branding.${websiteInfo}

FORBIDDEN: QR codes. No <img> tags. Include "Mr Diploma" signature with Dancing Script font.

Format: MESSAGE: [...] HTML: [...] CSS: [...]`;

      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Create a diploma based on: ${url}. No QR codes. Include "Mr Diploma" signature.` }]
      };
    } else {
      const userMessages = messages.filter((msg: any) => msg.role !== 'system');
      if (currentHtml && currentCss) {
        systemPrompt += `\n\nITERATION MODE: Modifying existing diploma.\n\nCURRENT HTML:\n${currentHtml}\n\nCURRENT CSS:\n${currentCss}\n\nMake only the specific changes requested.`;
      }
      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: userMessages
      };
    }

    console.log('Making request to Anthropic API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.content[0].text;

    const messagePart = responseText.match(/MESSAGE:\s*(.*?)(?=HTML:|$)/s)?.[1]?.trim() || "I've created a diploma for you!";
    const htmlPart = responseText.match(/HTML:\s*(.*?)(?=CSS:|$)/s)?.[1]?.trim() || '';
    const cssPart = responseText.match(/CSS:\s*(.*?)$/s)?.[1]?.trim() || '';

    return new Response(JSON.stringify({ message: messagePart, html: htmlPart, css: cssPart }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-diploma function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      message: 'Sorry, I encountered an error while generating your diploma. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
