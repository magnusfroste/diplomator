
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
    // Get user's full name from profiles table
    let userFullName = request.userFullName;
    if (!userFullName) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch name from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        
        if (profileData?.name) {
          userFullName = profileData.name;
        } else {
          // Fallback to auth metadata if profile name doesn't exist
          if (user.user_metadata?.name) {
            userFullName = user.user_metadata.name;
          } else if (user.user_metadata?.full_name) {
            userFullName = user.user_metadata.full_name;
          } else {
            // Use email prefix as final fallback
            userFullName = user.email?.split('@')[0] || 'User';
          }
        }
      } else {
        userFullName = 'User';
      }
    }

    console.log('Using userFullName for signature:', userFullName);

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

export const generateDiplomaFromImage = async (imageFile: File): Promise<DiplomaGenerationResponse> => {
  try {
    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    const imageData = {
      type: imageFile.type,
      data: base64Data
    };

    return await generateDiploma({
      messages: [],
      requestType: 'image',
      imageData
    });
  } catch (error) {
    console.error('Error generating diploma from image:', error);
    throw error;
  }
};

export const generateDiplomaFromUrl = async (url: string): Promise<DiplomaGenerationResponse> => {
  try {
    return await generateDiploma({
      messages: [],
      requestType: 'url',
      url
    });
  } catch (error) {
    console.error('Error generating diploma from URL:', error);
    throw error;
  }
};
