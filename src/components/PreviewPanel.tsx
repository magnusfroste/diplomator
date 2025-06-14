
import React, { useRef } from 'react';
import { Download, Code, Eye, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiploma } from '@/contexts/DiplomaContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PreviewPanel = () => {
  const { diplomaHtml, diplomaCss } = useDiploma();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getPreviewContent = () => {
    if (!diplomaHtml && !diplomaCss) {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Diploma Preview</title>
          <style>
            body {
              margin: 0;
              padding: 40px;
              font-family: 'Georgia', serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .placeholder {
              background: white;
              padding: 60px;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 600px;
              border: 8px solid #f8f9fa;
            }
            .placeholder h1 {
              color: #2d3748;
              margin-bottom: 20px;
              font-size: 28px;
            }
            .placeholder p {
              color: #718096;
              font-size: 16px;
              line-height: 1.6;
            }
            .sparkle {
              font-size: 48px;
              margin-bottom: 20px;
              opacity: 0.7;
            }
          </style>
        </head>
        <body>
          <div class="placeholder">
            <div class="sparkle">✨</div>
            <h1>Your diploma will appear here</h1>
            <p>Start by describing the diploma you want to create, uploading an image for inspiration, or entering a website URL to scrape design elements.</p>
          </div>
        </body>
        </html>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diploma Preview</title>
        <style>${diplomaCss}</style>
      </head>
      <body>
        ${diplomaHtml}
      </body>
      </html>
    `;
  };

  const handleDownload = () => {
    const content = getPreviewContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diploma.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleFullscreen}>
              <Maximize className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-slate-50">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <TabsList className="w-fit mx-4 mt-4">
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="w-4 h-4 mr-1" />
              Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 p-4 m-0">
            <div className="h-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-lg">
              <iframe
                ref={iframeRef}
                srcDoc={getPreviewContent()}
                className="w-full h-full border-0"
                title="Diploma Preview"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="flex-1 p-4 m-0">
            <div className="h-full bg-slate-900 rounded-lg overflow-hidden">
              <pre className="h-full overflow-auto p-4 text-sm text-green-400 font-mono">
                <code>{diplomaHtml || diplomaCss ? getPreviewContent() : '// Your generated code will appear here'}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
