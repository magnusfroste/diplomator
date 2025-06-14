
import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDiploma } from '@/contexts/DiplomaContext';
import { generateDiplomaFromUrl } from '@/services/anthropicService';

export const URLInput = () => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const { 
    setMessages, 
    messages, 
    setIsGenerating, 
    isGenerating,
    setDiplomaHtml,
    setDiplomaCss 
  } = useDiploma();

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl === '') {
      setIsValidUrl(true);
    } else {
      setIsValidUrl(validateUrl(newUrl));
    }
  };

  const handleScrapeUrl = async () => {
    if (!url || !isValidUrl || isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await generateDiplomaFromUrl(url);
      
      const aiMessage = {
        id: Date.now().toString(),
        content: `I've analyzed the website and extracted design elements to create your diploma. ${response.message}`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages([...messages, aiMessage]);
      
      if (response.html) {
        setDiplomaHtml(response.html);
      }
      if (response.css) {
        setDiplomaCss(response.css);
      }
    } catch (error) {
      console.error('Error scraping URL:', error);
      const errorMessage = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error while analyzing the website. Please check the URL and try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages([...messages, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScrapeUrl();
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Website Scraper</h3>
        <p className="text-sm text-slate-600">Enter a website URL to extract design elements and create a diploma</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="url"
            value={url}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com"
            className={`pl-10 ${!isValidUrl ? 'border-red-300 focus:border-red-500' : ''}`}
            disabled={isGenerating}
          />
        </div>
        
        {!isValidUrl && url && (
          <p className="text-sm text-red-600">Please enter a valid URL</p>
        )}

        <Button 
          onClick={handleScrapeUrl}
          disabled={!url || !isValidUrl || isGenerating}
          className="w-full"
        >
          <Search className="w-4 h-4 mr-2" />
          {isGenerating ? 'Analyzing Website...' : 'Scrape & Generate Diploma'}
        </Button>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• I'll visit the website and analyze its design</li>
            <li>• Extract colors, fonts, and layout patterns</li>
            <li>• Create a diploma inspired by the site's aesthetics</li>
            <li>• Generate both HTML and CSS for your diploma</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
