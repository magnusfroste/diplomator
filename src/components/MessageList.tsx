
import React, { useEffect, useRef } from 'react';
import { useDiploma } from '@/contexts/DiplomaContext';

export const MessageList = () => {
  const { messages, isGenerating } = useDiploma();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const AnthropicIcon = () => (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <img 
          src="/lovable-uploads/044b9806-cef9-4478-ad0e-3eb21af8622f.png" 
          alt="Anthropic" 
          className="w-6 h-6 object-contain"
        />
        <span className="text-xs text-muted-foreground font-medium">Anthropic</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          {!message.isUser && <AnthropicIcon />}
          
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-card-foreground border border-border'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      
      {isGenerating && (
        <div className="flex gap-3 justify-start">
          <AnthropicIcon />
          <div className="bg-card text-card-foreground border border-border rounded-2xl px-4 py-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
