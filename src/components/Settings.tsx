
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Key, Layout } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [diplomaFormat, setDiplomaFormat] = useState<'portrait' | 'landscape'>('landscape');

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load saved diploma format from localStorage
    const savedFormat = localStorage.getItem('diplomaFormat') as 'portrait' | 'landscape';
    if (savedFormat) {
      setDiplomaFormat(savedFormat);
    }
  }, []);

  const handleApiKeySave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('anthropic_api_key', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your Anthropic API key has been saved locally.",
      });
    } else {
      localStorage.removeItem('anthropic_api_key');
      toast({
        title: "API Key Removed",
        description: "Your Anthropic API key has been removed.",
      });
    }
  };

  const handleFormatChange = (format: 'portrait' | 'landscape') => {
    setDiplomaFormat(format);
    localStorage.setItem('diplomaFormat', format);
    toast({
      title: "Format Updated",
      description: `Diploma format set to ${format}`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your application preferences and API settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* API Key Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure your Anthropic API key for AI-powered diploma generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Anthropic API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Anthropic API key"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
              <Button onClick={handleApiKeySave}>
                Save API Key
              </Button>
            </CardContent>
          </Card>

          {/* Diploma Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Diploma Settings
              </CardTitle>
              <CardDescription>
                Configure your diploma generation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Diploma Format</Label>
                <div className="flex gap-2">
                  <Toggle
                    pressed={diplomaFormat === 'landscape'}
                    onPressedChange={() => handleFormatChange('landscape')}
                    className="flex-1 justify-center"
                  >
                    Landscape
                  </Toggle>
                  <Toggle
                    pressed={diplomaFormat === 'portrait'}
                    onPressedChange={() => handleFormatChange('portrait')}
                    className="flex-1 justify-center"
                  >
                    Portrait
                  </Toggle>
                </div>
                <p className="text-sm text-gray-600">
                  Current format: <span className="font-medium capitalize">{diplomaFormat}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
