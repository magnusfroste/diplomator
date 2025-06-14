
import React, { useState, useRef } from 'react';
import { Send, Upload, Link, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDiploma } from '@/contexts/DiplomaContext';
import { generateDiploma } from '@/services/anthropicService';
import { MessageList } from '@/components/MessageList';
import { FileUpload } from '@/components/FileUpload';
import { URLInput } from '@/components/URLInput';

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

    const userMessage = {
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
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (response.html) {
        setDiplomaHtml(response.html);
      }
      if (response.css) {
        setDiplomaCss(response.css);
      }
    } catch (error) {
      console.error('Error generating diploma:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while generating your diploma. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
      <div className="p-6 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Diploma Designer</h1>
            <p className="text-sm text-slate-600">Create beautiful diplomas with AI</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chat')}
            className="h-8"
          >
            <Send className="w-4 h-4 mr-1" />
            Chat
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('upload')}
            className="h-8"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <Button
            variant={activeTab === 'url' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('url')}
            className="h-8"
          >
            <Link className="w-4 h-4 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'chat' && (
          <>
            <MessageList />
            <div className="p-4 border-t border-slate-200/50 bg-white/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe the diploma you want to create..."
                  className="resize-none"
                  rows={3}
                  disabled={isGenerating}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isGenerating}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'upload' && <FileUpload />}
        {activeTab === 'url' && <URLInput />}
      </div>
    </div>
  );
};
