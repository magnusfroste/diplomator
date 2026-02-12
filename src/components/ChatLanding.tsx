import React, { useState, useCallback } from 'react';
import { Upload, Link, Wand2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useGeneration } from '@/hooks/useGeneration';
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

interface ChatLandingProps {
  isGuest?: boolean;
  guestAccess?: {
    remainingGenerations: number;
    canGenerate: boolean;
    incrementUsage: () => void;
    maxGenerations: number;
  };
}

export const ChatLanding = ({ isGuest, guestAccess }: ChatLandingProps) => {
  const [message, setMessage] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [urlOpen, setUrlOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

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
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-10 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">What diploma would you like to create?</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Describe your vision, upload an image, paste a URL, or let the magic decide.</p>
        </div>

        <div className="relative bg-card border border-border rounded-2xl shadow-lg shadow-black/20">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the diploma you want to create..."
            className="border-0 shadow-none focus-visible:ring-0 resize-none min-h-[120px] rounded-2xl pb-14 bg-transparent text-foreground placeholder:text-muted-foreground"
            rows={4}
            disabled={isGenerating}
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" disabled={isGenerating}>
                    <Upload className="w-4 h-4" />
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
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </DialogContent>
              </Dialog>

              <Popover open={urlOpen} onOpenChange={setUrlOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" disabled={isGenerating}>
                    <Link className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
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
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                onClick={generateRandomPrompt}
                disabled={isGenerating}
              >
                <Wand2 className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isGenerating}
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isGenerating && (
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
            <span className="text-sm text-muted-foreground ml-2">Generating your diploma...</span>
          </div>
        )}
      </div>
    </div>
  );
};
