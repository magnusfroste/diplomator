
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DiplomaGenerationRequest {
  messages: ChatMessage[];
  requestType?: 'text' | 'image' | 'url';
  imageData?: {
    type: string;
    data: string;
  };
  url?: string;
  currentHtml?: string;
  currentCss?: string;
  userFullName?: string;
}

export interface DiplomaGenerationResponse {
  message: string;
  html: string;
  css: string;
}

export const generateDiploma = async (request: DiplomaGenerationRequest): Promise<DiplomaGenerationResponse> => {
  try {
    // Get user's full name from auth metadata
    let userFullName = request.userFullName;
    if (!userFullName) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        userFullName = user.user_metadata.name;
      } else if (user?.user_metadata?.full_name) {
        userFullName = user.user_metadata.full_name;
      } else {
        userFullName = 'Diplomator Demo';
      }
    }

    const response = await supabase.functions.invoke('generate-diploma', {
      body: {
        ...request,
        userFullName
      }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  } catch (error) {
    console.error('Error calling generate-diploma function:', error);
    throw error;
  }
};
