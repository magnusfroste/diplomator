
import { Message } from '@/contexts/DiplomaContext';
import { supabase } from '@/integrations/supabase/client';

interface DiplomaResponse {
  message: string;
  html?: string;
  css?: string;
}

const callDiplomaFunction = async (payload: any): Promise<DiplomaResponse> => {
  console.log('Calling diploma generation function...');
  
  const { data, error } = await supabase.functions.invoke('generate-diploma', {
    body: payload
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(`Function call failed: ${error.message}`);
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const generateDiploma = async (userMessage: string, conversationHistory: Message[]): Promise<DiplomaResponse> => {
  const messages = [
    ...conversationHistory.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await callDiplomaFunction({
      messages,
      requestType: 'chat'
    });
    
    return response;
  } catch (error) {
    console.error('Error calling diploma generation function:', error);
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

  try {
    const response = await callDiplomaFunction({
      requestType: 'image',
      imageData: {
        type: imageFile.type,
        data: base64Image.split(',')[1]
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error generating diploma from image:', error);
    throw error;
  }
};

export const generateDiplomaFromUrl = async (url: string): Promise<DiplomaResponse> => {
  try {
    const response = await callDiplomaFunction({
      requestType: 'url',
      url
    });
    
    return response;
  } catch (error) {
    console.error('Error generating diploma from URL:', error);
    throw error;
  }
};

// Remove the old utility functions since we're now using Supabase
export const isApiKeySet = (): boolean => {
  return true; // Always true since we're using Supabase secrets
};

export const setApiKey = (apiKey: string): void => {
  // No-op since we're using Supabase secrets
  console.log('API key management is now handled by Supabase');
};
