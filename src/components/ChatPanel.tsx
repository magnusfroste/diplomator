import React, { useState, useCallback } from 'react';
import { Upload, Link, Wand2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useDiploma } from '@/contexts/DiplomaContext';
import { useGeneration } from '@/hooks/useGeneration';
import { MessageList } from '@/components/MessageList';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';

const stunningDiplomaPrompts = [
  "Create an elegant royal diploma with gold embossed borders, deep burgundy background, ornate baroque decorations, and calligraphy-style fonts for a Master of Fine Arts degree",
  "Design a modern minimalist diploma with clean geometric lines, soft gradients in blue and white, contemporary typography, and subtle shadow effects for a Bachelor of Computer Science",
  "Generate a vintage-style diploma with aged parchment texture, sepia tones, decorative Victorian flourishes, ornate frame borders, and classic serif fonts for a Doctor of Philosophy",
  "Create a luxurious certificate with marble texture background, gold leaf accents, art deco patterns, elegant script fonts, and sophisticated color palette for a Master of Business Administration",
  "Design a nature-inspired diploma with forest green colors, botanical illustrations, organic flowing lines, earth-tone gradients, and handwritten-style fonts for an Environmental Science degree",
];

interface ChatPanelProps {
  isGuest?: boolean;
  guestAccess?: {
    remainingGenerations: number;
    canGenerate: boolean;
    incrementUsage: () => void;
    maxGenerations: number;
  };
}

export const ChatPanel = ({ isGuest, guestAccess }: ChatPanelProps) => {
  const [message, setMessage] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [urlOpen, setUrlOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { diplomaHtml } = useDiploma();
  const { isGenerating, generateFromText, generateFromImage, generateFromUrl } = useGeneration(isGuest, guestAccess);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setUploadOpen(false);
      generateFromImage(file);
    }
  }, [generateFromImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: false,
  });

  const handleUrlSubmit = async () => {
    setUrlOpen(false);
    await generateFromUrl(urlValue);
    setUrlValue('');
  };

  const handleSendMessage = async () => {
    const text = message;
    setMessage('');
    await generateFromText(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateRandomPrompt = () => {
    setMessage(stunningDiplomaPrompts[Math.floor(Math.random() * stunningDiplomaPrompts.length)]);
  };

  return (
    <div className="h-full flex flex-col">
      <MessageList />

      <div className="p-3 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="relative bg-card border border-border rounded-xl transition-colors focus-within:border-primary/30">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe changes or a new diploma..."
            className="border-0 shadow-none focus-visible:ring-0 resize-none min-h-[60px] rounded-xl pb-10 bg-transparent text-foreground placeholder:text-muted-foreground"
            rows={3}
            disabled={isGenerating}
          />
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {!diplomaHtml && (
                <>
                  <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" disabled={isGenerating}>
                        <Upload className="w-3.5 h-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Upload Image</DialogTitle>
                      </DialogHeader>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Drop an image here, or click to select</p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Popover open={urlOpen} onOpenChange={setUrlOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" disabled={isGenerating}>
                        <Link className="w-3.5 h-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72" align="start">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Website URL</p>
                        <div className="flex gap-2">
                          <Input
                            value={urlValue}
                            onChange={(e) => setUrlValue(e.target.value)}
                            placeholder="https://example.com"
                            className="text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                          />
                          <Button size="sm" onClick={handleUrlSubmit} disabled={!urlValue.trim()}>Go</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={generateRandomPrompt}
                    disabled={isGenerating}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isGenerating}
              size="sm"
              className="h-7 w-7 p-0 rounded-full bg-primary hover:bg-primary/90 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
