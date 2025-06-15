
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiploma } from '@/contexts/DiplomaContext';
import { Save, X } from 'lucide-react';
import { MonacoEditor } from '@/components/MonacoEditor';

export const CodeEditor = () => {
  const { diplomaHtml, diplomaCss, setDiplomaHtml, setDiplomaCss } = useDiploma();
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

  return (
    <div className="h-full p-4 overflow-y-auto">
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
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">HTML</CardTitle>
          <p className="text-sm text-muted-foreground">
            Edit the HTML structure of your diploma
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] border border-slate-200 rounded-lg overflow-hidden">
            <MonacoEditor
              value={editableHtml}
              onChange={setEditableHtml}
              language="html"
              placeholder="HTML content will appear here..."
            />
          </div>
        </CardContent>
      </Card>

      {/* CSS Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CSS</CardTitle>
          <p className="text-sm text-muted-foreground">
            Edit the styling of your diploma
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] border border-slate-200 rounded-lg overflow-hidden">
            <MonacoEditor
              value={editableCss}
              onChange={setEditableCss}
              language="css"
              placeholder="CSS styles will appear here..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
