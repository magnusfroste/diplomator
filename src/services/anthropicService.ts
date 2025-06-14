
import { Message } from '@/contexts/DiplomaContext';

interface DiplomaResponse {
  message: string;
  html?: string;
  css?: string;
}

// Note: In production, you should use Supabase Edge Functions to securely handle API keys
const ANTHROPIC_API_KEY = localStorage.getItem('anthropic_api_key') || '';

const callAnthropicAPI = async (messages: any[]): Promise<string> => {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not found. Please set it in the settings.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: messages
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

export const generateDiploma = async (userMessage: string, conversationHistory: Message[]): Promise<DiplomaResponse> => {
  const systemPrompt = `You are an expert diploma designer. Your task is to create beautiful, professional diplomas based on user requirements. 

  Always respond with:
  1. A friendly message explaining what you've created
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
  - Include decorative elements like borders, seals, ribbons
  - Have proper hierarchy for text elements`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await callAnthropicAPI(messages);
    
    // Parse the response to extract MESSAGE, HTML, and CSS
    const messagePart = response.match(/MESSAGE:\s*(.*?)(?=HTML:|$)/s)?.[1]?.trim() || 'I\'ve created a diploma for you!';
    const htmlPart = response.match(/HTML:\s*(.*?)(?=CSS:|$)/s)?.[1]?.trim() || '';
    const cssPart = response.match(/CSS:\s*(.*?)$/s)?.[1]?.trim() || '';

    return {
      message: messagePart,
      html: htmlPart,
      css: cssPart
    };
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw error;
  }
};

export const generateDiplomaFromImage = async (imageFile: File): Promise<DiplomaResponse> => {
  // Convert image to base64 for API
  const base64Image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const systemPrompt = `You are an expert diploma designer. Analyze the uploaded image and create a diploma design inspired by its style, colors, layout, and aesthetic elements.

  Format your response like this:
  MESSAGE: [Explanation of how you used the image as inspiration]
  HTML: [Complete HTML code]
  CSS: [Complete CSS code]`;

  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Please analyze this image and create a diploma design inspired by its style, colors, and layout elements.'
        },
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: imageFile.type,
            data: base64Image.split(',')[1]
          }
        }
      ]
    }
  ];

  try {
    const response = await callAnthropicAPI(messages);
    
    const messagePart = response.match(/MESSAGE:\s*(.*?)(?=HTML:|$)/s)?.[1]?.trim() || 'I\'ve created a diploma inspired by your image!';
    const htmlPart = response.match(/HTML:\s*(.*?)(?=CSS:|$)/s)?.[1]?.trim() || '';
    const cssPart = response.match(/CSS:\s*(.*?)$/s)?.[1]?.trim() || '';

    return {
      message: messagePart,
      html: htmlPart,
      css: cssPart
    };
  } catch (error) {
    console.error('Error generating diploma from image:', error);
    throw error;
  }
};

export const generateDiplomaFromUrl = async (url: string): Promise<DiplomaResponse> => {
  // Note: In a real implementation, you'd need a backend service to scrape the URL
  // For now, we'll simulate this by asking Claude to create a diploma based on the URL concept
  
  const systemPrompt = `You are an expert diploma designer. The user has provided a website URL. Create a diploma design that would be appropriate for or inspired by this type of website/organization.

  Format your response like this:
  MESSAGE: [Explanation of the diploma you created based on the URL]
  HTML: [Complete HTML code]
  CSS: [Complete CSS code]`;

  const messages = [
    {
      role: 'user',
      content: `Please create a diploma design that would be appropriate for or inspired by this website: ${url}. Consider what type of organization this might be and create a suitable diploma design.`
    }
  ];

  try {
    const response = await callAnthropicAPI(messages);
    
    const messagePart = response.match(/MESSAGE:\s*(.*?)(?=HTML:|$)/s)?.[1]?.trim() || 'I\'ve created a diploma inspired by the website!';
    const htmlPart = response.match(/HTML:\s*(.*?)(?=CSS:|$)/s)?.[1]?.trim() || '';
    const cssPart = response.match(/CSS:\s*(.*?)$/s)?.[1]?.trim() || '';

    return {
      message: messagePart,
      html: htmlPart,
      css: cssPart
    };
  } catch (error) {
    console.error('Error generating diploma from URL:', error);
    throw error;
  }
};

// Utility function to check if API key is set
export const isApiKeySet = (): boolean => {
  return !!localStorage.getItem('anthropic_api_key');
};

// Utility function to set API key
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('anthropic_api_key', apiKey);
};
