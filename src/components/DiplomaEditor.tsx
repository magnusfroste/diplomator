
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useDiploma } from '@/contexts/DiplomaContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DiplomaEditor = () => {
  const { 
    diplomaFields, 
    setDiplomaFields, 
    diplomaHtml, 
    diplomaCss,
    setDiplomaHtml 
  } = useDiploma();

  const handleFieldChange = (field: string, value: string) => {
    const newFields = { ...diplomaFields, [field]: value };
    setDiplomaFields(newFields);
    updateDiplomaWithFields(newFields);
  };

  const updateDiplomaWithFields = (fields: any) => {
    if (!diplomaHtml) return;
    
    let updatedHtml = diplomaHtml;
    
    // Replace placeholders or specific text patterns
    Object.entries(fields).forEach(([key, value]) => {
      const patterns = {
        recipientName: [/\[NAME\]/gi, /John Doe/gi, /Student Name/gi],
        degree: [/\[DEGREE\]/gi, /Bachelor of Arts/gi, /Degree Title/gi],
        institution: [/\[INSTITUTION\]/gi, /University Name/gi, /Institution Name/gi],
        date: [/\[DATE\]/gi, /\d{4}-\d{2}-\d{2}/gi, /Date/gi],
        field: [/\[FIELD\]/gi, /Field of Study/gi]
      };
      
      const fieldPatterns = patterns[key as keyof typeof patterns] || [];
      fieldPatterns.forEach(pattern => {
        updatedHtml = updatedHtml.replace(pattern, value as string);
      });
    });
    
    setDiplomaHtml(updatedHtml);
  };

  const generateTemplate = () => {
    const template = `
      <div class="diploma-container">
        <div class="diploma-content">
          <h1 class="diploma-title">Certificate of Achievement</h1>
          <div class="diploma-text">
            <p>This is to certify that</p>
            <h2 class="recipient-name">${diplomaFields.recipientName || '[NAME]'}</h2>
            <p>has successfully completed the requirements for</p>
            <h3 class="degree-title">${diplomaFields.degree || '[DEGREE]'}</h3>
            <p>in</p>
            <h4 class="field-of-study">${diplomaFields.field || '[FIELD]'}</h4>
            <p>at</p>
            <h3 class="institution-name">${diplomaFields.institution || '[INSTITUTION]'}</h3>
            <p>on this</p>
            <div class="date">${diplomaFields.date || '[DATE]'}</div>
          </div>
        </div>
      </div>
    `;
    
    const css = `
      .diploma-container {
        width: 100%;
        max-width: 800px;
        margin: 40px auto;
        padding: 60px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border: 8px solid #2c3e50;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        font-family: 'Georgia', serif;
        text-align: center;
      }
      
      .diploma-content {
        background: white;
        padding: 40px;
        border-radius: 15px;
        border: 3px solid #34495e;
        position: relative;
      }
      
      .diploma-title {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 30px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      
      .diploma-text p {
        font-size: 1.1rem;
        color: #34495e;
        margin: 10px 0;
        line-height: 1.6;
      }
      
      .recipient-name {
        font-size: 2.2rem;
        color: #e74c3c;
        margin: 20px 0;
        font-weight: bold;
        text-decoration: underline;
        text-decoration-color: #3498db;
      }
      
      .degree-title {
        font-size: 1.8rem;
        color: #2980b9;
        margin: 15px 0;
        font-weight: bold;
      }
      
      .field-of-study {
        font-size: 1.4rem;
        color: #27ae60;
        margin: 15px 0;
        font-style: italic;
      }
      
      .institution-name {
        font-size: 1.6rem;
        color: #8e44ad;
        margin: 15px 0;
        font-weight: bold;
      }
      
      .date {
        font-size: 1.2rem;
        color: #e67e22;
        margin-top: 30px;
        font-weight: bold;
        border-top: 2px solid #bdc3c7;
        padding-top: 20px;
      }
    `;
    
    setDiplomaHtml(template);
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Edit Diploma Content</CardTitle>
          <p className="text-sm text-muted-foreground">
            Modify the fields below to customize your diploma. Changes will appear instantly in the preview.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              value={diplomaFields.recipientName || ''}
              onChange={(e) => handleFieldChange('recipientName', e.target.value)}
              placeholder="Magnus Froste"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="degree">Degree/Certificate Title</Label>
            <Input
              id="degree"
              value={diplomaFields.degree || ''}
              onChange={(e) => handleFieldChange('degree', e.target.value)}
              placeholder="Bachelor of Science"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="field">Field of Study</Label>
            <Input
              id="field"
              value={diplomaFields.field || ''}
              onChange={(e) => handleFieldChange('field', e.target.value)}
              placeholder="Computer Science"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Institution Name</Label>
            <Input
              id="institution"
              value={diplomaFields.institution || ''}
              onChange={(e) => handleFieldChange('institution', e.target.value)}
              placeholder="University of Technology"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={diplomaFields.date || ''}
              onChange={(e) => handleFieldChange('date', e.target.value)}
            />
          </div>
          
          <div className="pt-4">
            {!diplomaHtml && (
              <Button onClick={generateTemplate} className="w-full mb-2">
                Generate Diploma Template
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              💡 Tip: Use AI chat to create the initial design, then use this editor to customize the content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
