

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to extract website content and styling information
const scrapeWebsiteData = async (url: string) => {
  try {
    console.log(`Fetching website data from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DiplomaBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract useful information from the HTML
    const extractedData = {
      title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '',
      metaDescription: html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '',
      favicon: html.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i)?.[1] || '',
      colors: extractColors(html),
      fonts: extractFonts(html),
      brandName: extractBrandName(html, url),
      themeColor: html.match(/<meta[^>]*name="theme-color"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '',
    };

    console.log('Extracted website data:', extractedData);
    return extractedData;
  } catch (error) {
    console.error('Error scraping website:', error);
    return null;
  }
};

// Extract color information from CSS and styles
const extractColors = (html: string) => {
  const colors = new Set<string>();
  
  // Look for color values in style attributes and CSS
  const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/g;
  const matches = html.match(colorRegex);
  
  if (matches) {
    matches.slice(0, 10).forEach(color => colors.add(color)); // Limit to first 10 colors
  }
  
  return Array.from(colors);
};

// Extract font information
const extractFonts = (html: string) => {
  const fonts = new Set<string>();
  
  // Look for font-family declarations
  const fontRegex = /font-family\s*:\s*([^;]+)/gi;
  const matches = html.matchAll(fontRegex);
  
  for (const match of matches) {
    const fontFamily = match[1].replace(/['"]/g, '').split(',')[0].trim();
    if (fontFamily && fontFamily !== 'inherit') {
      fonts.add(fontFamily);
    }
  }
  
  return Array.from(fonts).slice(0, 5); // Limit to first 5 fonts
};

// Extract brand name from various sources
const extractBrandName = (html: string, url: string) => {
  // Try to extract from title
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
  
  // Try to extract from URL domain
  const domain = new URL(url).hostname.replace('www.', '');
  
  // Try to extract from meta property og:site_name
  const siteName = html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '';
  
  return siteName || title.split(/[-|–—]/)[0].trim() || domain.split('.')[0];
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, requestType, imageData, url, currentHtml, currentCss } = await req.json();
    
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    
    if (!ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not found');
    }

    let systemPrompt = `You are an expert diploma designer. Your task is to create beautiful, professional diplomas based on user requirements. 

IMPORTANT: Never use <img> tags or reference external image files. Use only CSS to create all visual elements including seals, decorative borders, and emblems.

CSS SHAPE CREATION GUIDELINES:
- For hearts: Use the ::before and ::after pseudo-elements with border-radius to create proper heart shapes
- Hearts should use transform: rotate(-45deg) on the main element, then position ::before and ::after with border-radius: 50% 50% 0 0
- Make shapes prominent with good contrast and adequate sizing
- Use proper CSS transforms for animations (translateY, scale, rotate)
- Ensure animated elements have smooth transitions with easing functions

MODIFICATIONS: Users can request adjustments to their diplomas after creation. Be ready to:
- Add or modify text, colors, fonts, and layouts
- Add CSS animations (like floating elements, rotating seals, fade-ins, hover effects)
- Move elements around or resize them
- Change decorative elements or add new ones
- Create interactive effects using CSS :hover, :focus, or keyframe animations
- Modify the overall style, theme, or visual hierarchy

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
- Include proper spacing and layout
- Use appropriate colors (often gold, navy, maroon)
- Include CSS-based decorative elements like borders, seals made with CSS shapes, ribbons using CSS
- Have proper hierarchy for text elements
- Create seals and emblems using CSS circles, borders, and text only
- Use CSS gradients, shadows, and transforms for visual appeal
- Never include <img> tags or src attributes pointing to image files
- Be easily modifiable for user adjustments and animations`;

    let requestBody;

    if (requestType === 'image') {
      systemPrompt = `You are an expert diploma designer. Analyze the uploaded image and create a diploma design inspired by its style, colors, layout, and aesthetic elements.

IMPORTANT: Never use <img> tags or reference external image files. Use only CSS to create all visual elements including seals, decorative borders, and emblems.

MODIFICATIONS: Users can request adjustments after creation. Be ready to add animations, move elements, change colors, fonts, or any other modifications they request.

Format your response like this:
MESSAGE: [Explanation of how you used the image as inspiration]
HTML: [Complete HTML code]
CSS: [Complete CSS code]

Create CSS-based decorative elements inspired by the image instead of referencing external files.`;

      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this image and create a diploma design inspired by its style, colors, and layout elements. Use only CSS for all visual elements - no image files.'
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: imageData.type,
                  data: imageData.data
                }
              }
            ]
          }
        ]
      };
    } else if (requestType === 'url') {
      // Scrape the website data
      const websiteData = await scrapeWebsiteData(url);
      
      let websiteInfo = '';
      if (websiteData) {
        websiteInfo = `

SCRAPED WEBSITE DATA:
- Brand/Company Name: ${websiteData.brandName}
- Page Title: ${websiteData.title}
- Meta Description: ${websiteData.metaDescription}
- Extracted Colors: ${websiteData.colors.join(', ')}
- Fonts Found: ${websiteData.fonts.join(', ')}
- Theme Color: ${websiteData.themeColor}

Use this actual website data to create an authentic diploma design that reflects the real brand colors, fonts, and style.`;
      }

      systemPrompt = `You are an expert diploma designer. The user has provided a website URL and I have scraped the actual content from that website. Create a diploma design that authentically reflects the website's actual branding, colors, and design elements.${websiteInfo}

BRAND-SPECIFIC GUIDELINES:
- For Telia (telia.se): Use their distinctive purple/magenta color palette (#990AE3, #FF6B35), modern Nordic design, clean typography
- For telecommunications companies: Use colors associated with connectivity, technology, and innovation
- For educational institutions: Use traditional academic colors and formal layouts
- For corporate brands: Use the extracted colors and fonts from the actual website data above

IMPORTANT: Never use <img> tags or reference external image files. Use only CSS to create all visual elements including seals, decorative borders, and emblems.

MODIFICATIONS: Users can request adjustments after creation. Be ready to add animations, move elements, change colors, fonts, or any other modifications they request.

Format your response like this:
MESSAGE: [Explanation of the diploma you created based on the actual website data]
HTML: [Complete HTML code]
CSS: [Complete CSS code]

Use CSS to create decorative elements that reflect the organization's actual brand identity from the scraped data.`;

      const userMessage = websiteData 
        ? `Please create a diploma design based on the actual website data I scraped from: ${url}. Use the real brand colors, fonts, and styling information I extracted from the live website to create an authentic diploma that reflects their actual visual identity.`
        : `Please create a diploma design inspired by this website: ${url}. I couldn't scrape the website data, so please use your knowledge about this brand to create an appropriate diploma design.`;

      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      };
    } else {
      // Regular chat - filter out any system messages and use them as the system prompt
      const userMessages = messages.filter(msg => msg.role !== 'system');
      
      if (currentHtml && currentCss) {
        systemPrompt += `

ITERATION MODE: You are modifying an existing diploma. Here is the current diploma content:

CURRENT HTML:
${currentHtml}

CURRENT CSS:
${currentCss}

Please modify the above diploma based on the user's request. Make only the specific changes requested while preserving the overall design and structure. Keep the same layout, fonts, and styling unless specifically asked to change them.

SPECIAL FOCUS FOR SHAPE IMPROVEMENTS:
- If modifying hearts or other CSS shapes, ensure they are well-formed and visually clear
- Hearts should use proper CSS techniques: main element with transform: rotate(-45deg), ::before and ::after positioned with border-radius: 50% 50% 0 0
- Make sure shapes have adequate size, contrast, and are positioned properly
- Use smooth animations with appropriate easing functions`;
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
    console.log('Anthropic API response received');
    
    const responseText = data.content[0].text;
    
    // Parse the response to extract MESSAGE, HTML, and CSS
    const messagePart = responseText.match(/MESSAGE:\s*(.*?)(?=HTML:|$)/s)?.[1]?.trim() || 'I\'ve created a diploma for you!';
    const htmlPart = responseText.match(/HTML:\s*(.*?)(?=CSS:|$)/s)?.[1]?.trim() || '';
    const cssPart = responseText.match(/CSS:\s*(.*?)$/s)?.[1]?.trim() || '';

    return new Response(JSON.stringify({
      message: messagePart,
      html: htmlPart,
      css: cssPart
    }), {
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

