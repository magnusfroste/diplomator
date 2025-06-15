
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

MODIFICATIONS: Users can request adjustments to their diplomas after creation. Be ready to:
- Add or modify text, colors, fonts, and layouts
- Add CSS animations (like floating elements, rotating seals, fade-ins, hover effects)
- Move elements around or resize them
- Change decorative elements or add new ones
- Create interactive effects using CSS :hover, :focus, or keyframe animations
- Modify the overall style, theme, or visual hierarchy

ITERATION MODE: If existing HTML and CSS are provided, you are modifying an existing diploma. Make only the requested changes while preserving the overall design and structure. Focus on the specific modification requested.

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
      systemPrompt = `You are an expert diploma designer. The user has provided a website URL. Create a diploma design that would be appropriate for or inspired by this type of website/organization.

IMPORTANT: Never use <img> tags or reference external image files. Use only CSS to create all visual elements including seals, decorative borders, and emblems.

MODIFICATIONS: Users can request adjustments after creation. Be ready to add animations, move elements, change colors, fonts, or any other modifications they request.

Format your response like this:
MESSAGE: [Explanation of the diploma you created based on the URL]
HTML: [Complete HTML code]
CSS: [Complete CSS code]

Use CSS to create decorative elements instead of referencing image files.`;

      requestBody = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Please create a diploma design that would be appropriate for or inspired by this website: ${url}. Consider what type of organization this might be and create a suitable diploma design using only CSS for visual elements.`
          }
        ]
      };
    } else {
      // Regular chat - filter out any system messages and use them as the system prompt
      const userMessages = messages.filter(msg => msg.role !== 'system');
      
      // If we have existing diploma content, include it in the context
      if (currentHtml && currentCss) {
        const modificationPrompt = `
CURRENT DIPLOMA CONTENT:
HTML:
${currentHtml}

CSS:
${currentCss}

Please modify the above diploma based on the user's request. Make only the specific changes requested while preserving the overall design.`;
        
        userMessages.unshift({
          role: 'assistant',
          content: modificationPrompt
        });
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
