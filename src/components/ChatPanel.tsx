
import React, { useState, useRef } from 'react';
import { Upload, Link, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDiploma } from '@/contexts/DiplomaContext';
import { generateDiploma } from '@/services/anthropicService';
import { MessageList } from '@/components/MessageList';
import { FileUpload } from '@/components/FileUpload';
import { URLInput } from '@/components/URLInput';
import { Message } from '@/contexts/DiplomaContext';

export const ChatPanel = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'url'>('chat');
  const { 
    messages, 
    setMessages, 
    isGenerating, 
    setIsGenerating,
    setDiplomaHtml,
    setDiplomaCss 
  } = useDiploma();

  const handleSendMessage = async () => {
    if (!message.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setMessage('');
    setIsGenerating(true);

    try {
      const response = await generateDiploma(message, messages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date()
      };

      setMessages((prev: Message[]) => [...prev, aiMessage]);
      
      if (response.html) {
        setDiplomaHtml(response.html);
      }
      if (response.css) {
        setDiplomaCss(response.css);
      }
    } catch (error) {
      console.error('Error generating diploma:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while generating your diploma. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Diploma Designer</h1>
            <p className="text-xs text-slate-600">Create beautiful diplomas with AI</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chat')}
            className="h-7 text-xs"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Chat
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('upload')}
            className="h-7 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
          <Button
            variant={activeTab === 'url' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('url')}
            className="h-7 text-xs"
          >
            <Link className="w-3 h-3 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'chat' && (
          <>
            <MessageList />
            <div className="p-3 border-t border-slate-200/50 bg-white/90 backdrop-blur-sm">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the diploma you want to create... (Press Enter to send)"
                className="resize-none min-h-[60px]"
                rows={2}
                disabled={isGenerating}
              />
            </div>
          </>
        )}
        
        {activeTab === 'upload' && <FileUpload />}
        {activeTab === 'url' && <URLInput />}
      </div>
    </div>
  );
};
