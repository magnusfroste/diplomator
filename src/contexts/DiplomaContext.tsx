
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

const EMPTY_FIELDS: DiplomaFields = { recipientName: '', degree: '', field: '', institution: '', date: '' };

export const DiplomaProvider = ({ children }: { children: ReactNode }) => {
  const [diplomaHtml, setDiplomaHtml] = useState('');
  const [diplomaCss, setDiplomaCss] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [signingRecipientName, setSigningRecipientName] = useState('');
  const [signingInstitutionName, setSigningInstitutionName] = useState('');
  const [diplomaFormat, setDiplomaFormat] = useState<'portrait' | 'landscape'>('portrait');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [diplomaFields, setDiplomaFields] = useState<DiplomaFields>(EMPTY_FIELDS);
  const [messages, setMessages] = useState<Message[]>([]);

  // ── Refs: always-fresh values for async operations ──
  const htmlRef = useRef(diplomaHtml);
  const cssRef = useRef(diplomaCss);
  const formatRef = useRef(diplomaFormat);
  const messagesRef = useRef(messages);
  const sessionIdRef = useRef(currentSessionId);
  const isResettingRef = useRef(false);
  const wasGenerating = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { htmlRef.current = diplomaHtml; }, [diplomaHtml]);
  useEffect(() => { cssRef.current = diplomaCss; }, [diplomaCss]);
  useEffect(() => { formatRef.current = diplomaFormat; }, [diplomaFormat]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { sessionIdRef.current = currentSessionId; }, [currentSessionId]);

  // ── Save session (reads from refs, no stale closures) ──
  const saveSession = useCallback(async (title?: string) => {
    if (isResettingRef.current) return; // Guard: don't save during reset

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const html = htmlRef.current;
    const css = cssRef.current;
    const format = formatRef.current;
    const msgs = JSON.parse(JSON.stringify(messagesRef.current));
    const sessionId = sessionIdRef.current;

    if (sessionId) {
      await supabase
        .from('diploma_sessions')
        .update({
          diploma_html: html,
          diploma_css: css,
          diploma_format: format,
          messages: msgs,
          title: title || 'Untitled Diploma',
        })
        .eq('id', sessionId);
    } else {
      const { data } = await supabase
        .from('diploma_sessions')
        .insert({
          diploma_html: html,
          diploma_css: css,
          diploma_format: format,
          messages: msgs,
          title: title || 'Untitled Diploma',
          user_id: user.id,
        })
        .select('id')
        .single();
      if (data) setCurrentSessionId(data.id);
    }
  }, []); // No deps needed — reads from refs

  // ── Auto-save after generation completes ──
  useEffect(() => {
    if (isGenerating) {
      wasGenerating.current = true;
      return;
    }
    if (wasGenerating.current && htmlRef.current) {
      wasGenerating.current = false;
      const userMessages = messagesRef.current.filter(m => m.isUser);
      const lastUserMsg = userMessages[userMessages.length - 1]?.content || '';
      const autoTitle = lastUserMsg.slice(0, 50) || 'Untitled Diploma';
      saveSession(autoTitle);
    }
  }, [isGenerating, saveSession]);

  // ── Reset session (guarded) ──
  const resetSession = useCallback(() => {
    isResettingRef.current = true;
    setCurrentSessionId(null);
    setDiplomaHtml('');
    setDiplomaCss('');
    setDiplomaFormat('portrait');
    setDiplomaFields(EMPTY_FIELDS);
    setMessages([]);
    // Allow saves again after React flushes the reset
    requestAnimationFrame(() => { isResettingRef.current = false; });
  }, []);

  // ── Load session ──
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
