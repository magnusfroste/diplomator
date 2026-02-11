
import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DiplomaFields {
  recipientName: string;
  degree: string;
  field: string;
  institution: string;
  date: string;
}

interface DiplomaContextType {
  diplomaHtml: string;
  setDiplomaHtml: (html: string) => void;
  diplomaCss: string;
  setDiplomaCss: (css: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  diplomaFields: DiplomaFields;
  setDiplomaFields: (fields: DiplomaFields) => void;
  signingRecipientName: string;
  setSigningRecipientName: (name: string) => void;
  signingInstitutionName: string;
  setSigningInstitutionName: (name: string) => void;
  diplomaFormat: 'portrait' | 'landscape';
  setDiplomaFormat: (format: 'portrait' | 'landscape') => void;
  // Session management
  currentSessionId: string | null;
  loadSession: (id: string) => Promise<void>;
  saveSession: (title?: string) => Promise<void>;
  resetSession: () => void;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const DiplomaContext = createContext<DiplomaContextType | undefined>(undefined);

export const DiplomaProvider = ({ children }: { children: ReactNode }) => {
  const [diplomaHtml, setDiplomaHtml] = useState('');
  const [diplomaCss, setDiplomaCss] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [signingRecipientName, setSigningRecipientName] = useState('');
  const [signingInstitutionName, setSigningInstitutionName] = useState('');
  const [diplomaFormat, setDiplomaFormat] = useState<'portrait' | 'landscape'>('portrait');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [diplomaFields, setDiplomaFields] = useState<DiplomaFields>({
    recipientName: '',
    degree: '',
    field: '',
    institution: '',
    date: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const wasGenerating = useRef(false);

  // Auto-save after generation completes
  useEffect(() => {
    if (isGenerating) {
      wasGenerating.current = true;
      return;
    }
    if (wasGenerating.current && diplomaHtml) {
      wasGenerating.current = false;
      // Generate title from first user message or diploma content
      const userMessages = messages.filter(m => m.isUser);
      const lastUserMsg = userMessages[userMessages.length - 1]?.content || '';
      const autoTitle = lastUserMsg.slice(0, 50) || 'Untitled Diploma';
      saveSession(autoTitle);
    }
  }, [isGenerating]);

  const resetSession = useCallback(() => {
    setCurrentSessionId(null);
    setDiplomaHtml('');
    setDiplomaCss('');
    setDiplomaFormat('portrait');
    setDiplomaFields({ recipientName: '', degree: '', field: '', institution: '', date: '' });
    setMessages([]);
  }, []);

  const loadSession = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('diploma_sessions')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return;

    setCurrentSessionId(data.id);
    setDiplomaHtml(data.diploma_html);
    setDiplomaCss(data.diploma_css);
    setDiplomaFormat((data.diploma_format as 'portrait' | 'landscape') || 'portrait');

    // Restore messages from JSON
    const savedMessages = data.messages as unknown;
    if (Array.isArray(savedMessages) && savedMessages.length > 0) {
      setMessages(savedMessages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })));
    } else {
      setMessages([]);
    }
  }, []);

  const saveSession = useCallback(async (title?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const messagesJson = JSON.parse(JSON.stringify(messages));

    if (currentSessionId) {
      await supabase
        .from('diploma_sessions')
        .update({
          diploma_html: diplomaHtml,
          diploma_css: diplomaCss,
          diploma_format: diplomaFormat,
          messages: messagesJson,
          title: title || 'Untitled Diploma',
        })
        .eq('id', currentSessionId);
    } else {
      const { data } = await supabase
        .from('diploma_sessions')
        .insert({
          diploma_html: diplomaHtml,
          diploma_css: diplomaCss,
          diploma_format: diplomaFormat,
          messages: messagesJson,
          title: title || 'Untitled Diploma',
          user_id: user.id,
        })
        .select('id')
        .single();
      if (data) setCurrentSessionId(data.id);
    }
  }, [currentSessionId, diplomaHtml, diplomaCss, diplomaFormat, messages]);

  return (
    <DiplomaContext.Provider value={{
      diplomaHtml,
      setDiplomaHtml,
      diplomaCss,
      setDiplomaCss,
      isGenerating,
      setIsGenerating,
      messages,
      setMessages,
      diplomaFields,
      setDiplomaFields,
      signingRecipientName,
      setSigningRecipientName,
      signingInstitutionName,
      setSigningInstitutionName,
      diplomaFormat,
      setDiplomaFormat,
      currentSessionId,
      loadSession,
      saveSession,
      resetSession,
    }}>
      {children}
    </DiplomaContext.Provider>
  );
};

export const useDiploma = () => {
  const context = useContext(DiplomaContext);
  if (context === undefined) {
    throw new Error('useDiploma must be used within a DiplomaProvider');
  }
  return context;
};

export type { Message, DiplomaFields };
