
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  // New fields for blockchain signing
  signingRecipientName: string;
  setSigningRecipientName: (name: string) => void;
  signingInstitutionName: string;
  setSigningInstitutionName: (name: string) => void;
  // New field for diploma format
  diplomaFormat: 'portrait' | 'landscape';
  setDiplomaFormat: (format: 'portrait' | 'landscape') => void;
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
  const [diplomaFormat, setDiplomaFormat] = useState<'portrait' | 'landscape'>('landscape');
  const [diplomaFields, setDiplomaFields] = useState<DiplomaFields>({
    recipientName: '',
    degree: '',
    field: '',
    institution: '',
    date: ''
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m here to help you create beautiful diplomas. You can either Chat, Upload an image for inspiration, provide a website URL or try the Magic! What would you like to create today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);

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
      setDiplomaFormat
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
