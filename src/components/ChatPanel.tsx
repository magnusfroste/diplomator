
import React, { useState, useRef } from 'react';
import { Upload, Link, Sparkles, Info, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDiploma } from '@/contexts/DiplomaContext';
import { generateDiploma } from '@/services/anthropicService';
import { MessageList } from '@/components/MessageList';
import { FileUpload } from '@/components/FileUpload';
import { URLInput } from '@/components/URLInput';
import { MagicDiploma } from '@/components/MagicDiploma';
import { Message } from '@/contexts/DiplomaContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ChatMessage } from '@/services/anthropicService';

export const ChatPanel = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'upload' | 'url' | 'magic'>('chat');
  const [showGuidelines, setShowGuidelines] = useState(false);
  
  const { 
    messages, 
    setMessages, 
    isGenerating, 
    setIsGenerating,
    diplomaHtml,
    diplomaCss,
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
      // Convert messages to the format expected by the service
      const chatMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // Add the current message
      chatMessages.push({
        role: 'user' as const,
        content: message
      });

      // Pass current diploma content for iteration
      const response = await generateDiploma({
        messages: chatMessages,
        requestType: 'text',
        currentHtml: diplomaHtml || undefined,
        currentCss: diplomaCss || undefined
      });
      
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
        {/* Guidelines Section */}
        <Collapsible open={showGuidelines} onOpenChange={setShowGuidelines}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mb-3 h-8 text-xs justify-start"
            >
              <Info className="w-3 h-3 mr-2" />
              Design Guidelines & Tips
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mb-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-2">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">✅ Works Great:</h4>
                <ul className="text-blue-800 space-y-1 list-disc list-inside ml-2">
                  <li>Text styling, fonts, and layouts</li>
                  <li>Color gradients and backgrounds</li>
                  <li>Borders, shadows, and simple decorations</li>
                  <li>Basic animations (fade, slide, pulse)</li>
                  <li>Geometric shapes (circles, squares, triangles)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-900 mb-1">⚠️ May Need Refinement:</h4>
                <ul className="text-amber-800 space-y-1 list-disc list-inside ml-2">
                  <li>Complex shapes (hearts, stars, logos)</li>
                  <li>Intricate positioning and alignment</li>
                  <li>Complex animations with multiple elements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">💡 Tips for Best Results:</h4>
                <ul className="text-green-800 space-y-1 list-disc list-inside ml-2">
                  <li>Be specific about colors, fonts, and layout</li>
                  <li>Request one feature at a time for complex elements</li>
                  <li>Use "make it more elegant" for refinements</li>
                  <li>Ask for "simpler" versions if shapes don't look right</li>
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

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
          <Button
            variant={activeTab === 'magic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('magic')}
            className="h-7 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Magic
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
        {activeTab === 'magic' && <MagicDiploma />}
      </div>
    </div>
  );
};
