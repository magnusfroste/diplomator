
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DiplomaContextType {
  diplomaHtml: string;
  setDiplomaHtml: (html: string) => void;
  diplomaCss: string;
  setDiplomaCss: (css: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m here to help you create beautiful diplomas. You can either upload an image for inspiration or provide a website URL to scrape design elements from. What would you like to create today?',
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
      setMessages
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

export type { Message };
