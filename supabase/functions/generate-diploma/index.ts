import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ── Scraping helpers ──

const scrapeWebsiteData = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DiplomaBot/1.0)', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    return {
      title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '',
      colors: extractColors(html),
      fonts: extractFonts(html),
      brandName: extractBrandName(html, url),
      themeColor: html.match(/<meta[^>]*name="theme-color"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '',
    };
  } catch (e) { console.error('Scrape error:', e); return null; }
};

const extractColors = (html: string) => {
  const m = html.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|hsl\([^)]+\)/g);
  return m ? [...new Set(m)].slice(0, 10) : [];
};
const extractFonts = (html: string) => {
  const fonts = new Set<string>();
  for (const m of html.matchAll(/font-family\s*:\s*([^;]+)/gi)) {
    const f = m[1].replace(/['"]/g, '').split(',')[0].trim();
    if (f && f !== 'inherit') fonts.add(f);
  }
  return [...fonts].slice(0, 5);
};
const extractBrandName = (html: string, url: string) => {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
  const siteName = html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '';
  return siteName || title.split(/[-|–—]/)[0].trim() || new URL(url).hostname.replace('www.', '').split('.')[0];
};

// ── System prompt ──

const BASE_SYSTEM_PROMPT = `You are an expert diploma designer. Create beautiful, professional diplomas.

FORBIDDEN: QR codes, <img> tags, external image files.
Use only CSS for all visual elements (seals, borders, emblems).

SIGNATURE: Always include "Mr Diploma" signature with Dancing Script font, handwriting styling.

Format response as:
MESSAGE: [explanation]
HTML: [complete HTML]
CSS: [complete CSS]

Requirements: Professional, print-ready, classic fonts, CSS decorative elements.`;

// ── Provider adapters ──

interface AIResponse { text: string }

async function callAnthropic(systemPrompt: string, messages: any[], model: string, imageData?: any): Promise<AIResponse> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const body: any = {
    model,
    max_tokens: 4000,
    system: systemPrompt,
    messages,
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return { text: data.content[0].text };
}

async function callOpenAI(systemPrompt: string, messages: any[], model: string, imageData?: any): Promise<AIResponse> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const openaiMessages: any[] = [{ role: 'system', content: systemPrompt }];

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      // Handle image content
      const parts: any[] = [];
      for (const part of msg.content) {
        if (part.type === 'text') {
          parts.push({ type: 'text', text: part.text });
        } else if (part.type === 'image') {
          parts.push({ type: 'image_url', image_url: { url: `data:${part.source.media_type};base64,${part.source.data}` } });
        }
      }
      openaiMessages.push({ role: msg.role, content: parts });
    } else {
      openaiMessages.push({ role: msg.role, content: msg.content });
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, max_tokens: 4000, messages: openaiMessages }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return { text: data.choices[0].message.content };
}

async function callGemini(systemPrompt: string, messages: any[], model: string, imageData?: any): Promise<AIResponse> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const contents: any[] = [];

  // Add system instruction as first user message context
  const allParts: any[] = [];

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const part of msg.content) {
        if (part.type === 'text') {
          allParts.push({ text: part.text });
        } else if (part.type === 'image') {
          allParts.push({ inline_data: { mime_type: part.source.media_type, data: part.source.data } });
        }
      }
    } else {
      allParts.push({ text: msg.content });
    }
  }

  contents.push({ role: 'user', parts: allParts });

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 4000 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || '' };
}

// ── Main handler ──

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, requestType, imageData, url, currentHtml, currentCss, userFullName, isGuest } = await req.json();

    // Auth check
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    if (!isGuest) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
      const token = authHeader.replace('Bearer ', '');
      const { error } = await supabase.auth.getClaims(token);
      if (error) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Fetch active provider from app_settings
    const { data: settingData } = await supabaseAdmin.from('app_settings').select('value').eq('key', 'ai_provider').single();
    const providerConfig = settingData?.value as { provider: string; model: string } || { provider: 'anthropic', model: 'claude-sonnet-4-20250514' };
    const { provider, model } = providerConfig;

    console.log(`Using AI provider: ${provider}, model: ${model}`);

    // Build system prompt
    let systemPrompt = BASE_SYSTEM_PROMPT;

    // Build messages for the AI
    let aiMessages: any[];

    if (requestType === 'image') {
      systemPrompt = `${BASE_SYSTEM_PROMPT}\n\nAnalyze the uploaded image and create a diploma inspired by its style.`;
      aiMessages = [{
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this image and create a diploma design inspired by its style. Use only CSS. Include "Mr Diploma" signature.' },
          { type: 'image', source: { type: 'base64', media_type: imageData.type, data: imageData.data } }
        ]
      }];
    } else if (requestType === 'url') {
      const websiteData = await scrapeWebsiteData(url);
      if (websiteData) {
        systemPrompt += `\n\nWEBSITE DATA:\n- Brand: ${websiteData.brandName}\n- Colors: ${websiteData.colors.join(', ')}\n- Fonts: ${websiteData.fonts.join(', ')}\n- Theme: ${websiteData.themeColor}`;
      }
      systemPrompt += `\n\nCreate a diploma reflecting the website's branding.`;
      aiMessages = [{ role: 'user', content: `Create a diploma based on: ${url}. No QR codes. Include "Mr Diploma" signature.` }];
    } else {
      const userMessages = (messages || []).filter((msg: any) => msg.role !== 'system');
      if (currentHtml && currentCss) {
        systemPrompt += `\n\nITERATION MODE: Modifying existing diploma.\nCURRENT HTML:\n${currentHtml}\nCURRENT CSS:\n${currentCss}\nMake only the specific changes requested.`;
      }
      aiMessages = userMessages;
    }

    // Call the selected provider
    let result: AIResponse;
    switch (provider) {
      case 'openai':
        result = await callOpenAI(systemPrompt, aiMessages, model);
        break;
      case 'gemini':
        result = await callGemini(systemPrompt, aiMessages, model);
        break;
      case 'anthropic':
      default:
        result = await callAnthropic(systemPrompt, aiMessages, model);
        break;
    }

    // Parse response
    const responseText = result.text;
    const messagePart = responseText.match(/MESSAGE:\s*(.*?)(?=HTML:|$)/s)?.[1]?.trim() || "I've created a diploma for you!";
    const htmlPart = responseText.match(/HTML:\s*(.*?)(?=CSS:|$)/s)?.[1]?.trim() || '';
    const cssPart = responseText.match(/CSS:\s*(.*?)$/s)?.[1]?.trim() || '';

    return new Response(JSON.stringify({ message: messagePart, html: htmlPart, css: cssPart, provider, model }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-diploma:', error);
    return new Response(JSON.stringify({
      error: error.message,
      message: 'Sorry, an error occurred while generating your diploma. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
