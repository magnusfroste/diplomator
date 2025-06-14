
import React, { useState } from 'react';
import { Key, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { isApiKeySet, setApiKey } from '@/services/anthropicService';
import { useToast } from '@/hooks/use-toast';

export const ApiKeySettings = () => {
  const [apiKey, setApiKeyState] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Anthropic API key has been saved locally.",
      });
      setIsOpen(false);
      setApiKeyState('');
    }
  };

  const hasApiKey = isApiKeySet();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={`fixed top-4 right-4 z-50 ${hasApiKey ? 'text-green-600' : 'text-orange-600'}`}
        >
          <Key className="w-4 h-4 mr-1" />
          {hasApiKey ? 'API Key Set' : 'Set API Key'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Anthropic API Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-3">
              Enter your Anthropic API key to enable diploma generation. Your key is stored locally in your browser.
            </p>
            <Input
              type="password"
              placeholder="sk-ant-api03-..."
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="mb-3"
            />
            <Button onClick={handleSaveApiKey} className="w-full">
              Save API Key
            </Button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Get your API key:</strong> Visit{' '}
              <a 
                href="https://console.anthropic.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                console.anthropic.com
              </a>{' '}
              to create an account and get your API key.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
