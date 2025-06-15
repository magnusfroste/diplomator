
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface EmbedGeneratorProps {
  diplomaId: string;
}

export const EmbedGenerator = ({ diplomaId }: EmbedGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState('400x300');

  const embedUrl = `${window.location.origin}/embed/${diplomaId}`;
  
  const sizeOptions = {
    '400x300': { width: 400, height: 300, label: 'Small (400×300)' },
    '600x450': { width: 600, height: 450, label: 'Medium (600×450)' },
    '800x600': { width: 800, height: 600, label: 'Large (800×600)' },
    'responsive': { width: '100%', height: 400, label: 'Responsive' }
  };

  const generateEmbedCode = () => {
    const size = sizeOptions[selectedSize as keyof typeof sizeOptions];
    const width = typeof size.width === 'number' ? `${size.width}px` : size.width;
    const height = `${size.height}px`;

    return `<!-- Diplomator Embed -->
<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}"
  frameborder="0" 
  scrolling="no"
  style="border: 1px solid #e2e8f0; border-radius: 8px; max-width: 100%;"
  title="Verified Diploma">
</iframe>
<!-- End Diplomator Embed -->`;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      toast.success('Embed code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy embed code');
    }
  };

  const openPreview = () => {
    window.open(embedUrl, '_blank', 'width=800,height=600');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Embed This Diploma
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add this diploma to your portfolio, website, or LinkedIn profile
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Size Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Choose Size</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(sizeOptions).map(([key, option]) => (
              <Button
                key={key}
                variant={selectedSize === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSize(key)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Preview</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={openPreview}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in new window
            </Button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-hidden">
            <div 
              style={{
                width: selectedSize === 'responsive' ? '100%' : `${sizeOptions[selectedSize as keyof typeof sizeOptions].width}px`,
                height: `${Math.min(sizeOptions[selectedSize as keyof typeof sizeOptions].height, 200)}px`,
                maxWidth: '100%'
              }}
            >
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '4px',
                  transform: selectedSize !== 'responsive' ? 'scale(0.5)' : 'none',
                  transformOrigin: 'top left',
                  width: selectedSize !== 'responsive' ? '200%' : '100%',
                  height: selectedSize !== 'responsive' ? '200%' : '100%'
                }}
                title="Diploma Preview"
              />
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div>
          <label className="text-sm font-medium mb-2 block">Embed Code</label>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
              {generateEmbedCode()}
            </pre>
            <Button
              size="sm"
              className="absolute top-2 right-2"
              onClick={copyEmbedCode}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-1">How to use:</h4>
          <ol className="text-xs text-blue-800 space-y-1">
            <li>1. Copy the embed code above</li>
            <li>2. Paste it into your website's HTML</li>
            <li>3. The diploma will display with a link to the full verification page</li>
          </ol>
        </div>

        {/* Features */}
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">✅ Responsive design</p>
          <p className="mb-1">✅ Verified badge included</p>
          <p className="mb-1">✅ Links to full diploma page</p>
          <p>✅ No additional dependencies</p>
        </div>
      </CardContent>
    </Card>
  );
};
