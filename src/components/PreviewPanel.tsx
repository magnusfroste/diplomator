
import React, { useRef, useState, useEffect } from 'react';
import { Download, Code, Eye, Maximize, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiploma } from '@/contexts/DiplomaContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SyntaxHighlightedEditor } from '@/components/SyntaxHighlightedEditor';

export const PreviewPanel = () => {
  const { diplomaHtml, diplomaCss, setDiplomaHtml, setDiplomaCss } = useDiploma();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Local state for editing
  const [editableHtml, setEditableHtml] = useState(diplomaHtml || '');
  const [editableCss, setEditableCss] = useState(diplomaCss || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update local state when context changes (from AI generation)
  useEffect(() => {
    setEditableHtml(diplomaHtml || '');
    setEditableCss(diplomaCss || '');
    setHasUnsavedChanges(false);
  }, [diplomaHtml, diplomaCss]);

  // Check for unsaved changes
  useEffect(() => {
    const htmlChanged = editableHtml !== (diplomaHtml || '');
    const cssChanged = editableCss !== (diplomaCss || '');
    setHasUnsavedChanges(htmlChanged || cssChanged);
  }, [editableHtml, editableCss, diplomaHtml, diplomaCss]);

  const handleSave = () => {
    setDiplomaHtml(editableHtml);
    setDiplomaCss(editableCss);
    setHasUnsavedChanges(false);
  };

  const handleDiscard = () => {
    setEditableHtml(diplomaHtml || '');
    setEditableCss(diplomaCss || '');
    setHasUnsavedChanges(false);
  };

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
      <div className="flex-1 bg-slate-50 flex flex-col">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <TabsList className="w-fit mx-4 mt-4">
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html">
              <Code className="w-4 h-4 mr-1" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="css">
              <Code className="w-4 h-4 mr-1" />
              CSS
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
          
          <TabsContent value="html" className="flex-1 p-4 m-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Unsaved Changes Bar */}
              {hasUnsavedChanges && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-amber-800 font-medium">
                    You have unsaved changes
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDiscard}
                      className="h-8 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {/* HTML Editor */}
              <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-sm font-medium text-slate-700">HTML Structure</h3>
                </div>
                <div className="h-full p-4 overflow-hidden">
                  <SyntaxHighlightedEditor
                    value={editableHtml}
                    onChange={setEditableHtml}
                    language="html"
                    placeholder="HTML content will appear here..."
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="css" className="flex-1 p-4 m-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Unsaved Changes Bar */}
              {hasUnsavedChanges && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-amber-800 font-medium">
                    You have unsaved changes
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDiscard}
                      className="h-8 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {/* CSS Editor */}
              <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-sm font-medium text-slate-700">CSS Styles</h3>
                </div>
                <div className="h-full p-4 overflow-hidden">
                  <SyntaxHighlightedEditor
                    value={editableCss}
                    onChange={setEditableCss}
                    language="css"
                    placeholder="CSS styles will appear here..."
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
