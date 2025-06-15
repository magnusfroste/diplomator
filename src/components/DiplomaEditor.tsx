
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useDiploma } from '@/contexts/DiplomaContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export const DiplomaEditor = () => {
  const { 
    diplomaFields, 
    setDiplomaFields, 
    diplomaHtml, 
    diplomaCss,
    setDiplomaHtml,
    setDiplomaCss 
  } = useDiploma();

  const [userFullName, setUserFullName] = useState<string>('');

  useEffect(() => {
    // Get the user's full name for the signature
    const getUserFullName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // First try to get name from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        
        if (profileData?.name) {
          setUserFullName(profileData.name);
        } else {
          // Fallback to auth metadata or email prefix
          const fallbackName = user.user_metadata?.name || 
                              user.user_metadata?.full_name || 
                              user.email?.split('@')[0] || 
                              'User';
          setUserFullName(fallbackName);
        }
      }
    };

    getUserFullName();
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    const newFields = { ...diplomaFields, [field]: value };
    setDiplomaFields(newFields);
    
    // If we have existing HTML, update it with the new fields
    if (diplomaHtml) {
      updateDiplomaWithFields(newFields);
    } else {
      // If no HTML exists, generate a basic template with the fields
      generateTemplateWithFields(newFields);
    }
  };

  const updateDiplomaWithFields = (fields: any) => {
    let updatedHtml = diplomaHtml;
    
    // Replace placeholders or specific text patterns
    Object.entries(fields).forEach(([key, value]) => {
      const patterns = {
        recipientName: [/\[NAME\]/gi, /John Doe/gi, /Student Name/gi, /Magnus Froste/gi],
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

    // Ensure the signature section shows the user's name - with more comprehensive patterns
    if (userFullName) {
      // Replace various signature name patterns
      updatedHtml = updatedHtml.replace(/Diplomator Demo/gi, userFullName);
      updatedHtml = updatedHtml.replace(/\${userFullName \|\| 'Diplomator Demo'}/gi, userFullName);
      updatedHtml = updatedHtml.replace(/Authorized Signature/gi, userFullName);
      updatedHtml = updatedHtml.replace(/<div class="signature-name">[^<]*<\/div>/gi, `<div class="signature-name">${userFullName}</div>`);
      updatedHtml = updatedHtml.replace(/class="signature-name">[^<]*</gi, `class="signature-name">${userFullName}<`);
    }
    
    setDiplomaHtml(updatedHtml);
  };

  const generateTemplateWithFields = (fields: any) => {
    const template = `
      <div class="diploma-container">
        <div class="diploma-content">
          <h1 class="diploma-title">Certificate of Achievement</h1>
          <div class="diploma-text">
            <p>This is to certify that</p>
            <h2 class="recipient-name">${fields.recipientName || 'Your Name Here'}</h2>
            <p>has successfully completed the requirements for</p>
            <h3 class="degree-title">${fields.degree || 'Your Degree'}</h3>
            <p>in</p>
            <h4 class="field-of-study">${fields.field || 'Field of Study'}</h4>
            <p>at</p>
            <h3 class="institution-name">${fields.institution || 'Institution Name'}</h3>
            <p>on this</p>
            <div class="date">${fields.date || new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="signature-section">
            <div class="signature-line"></div>
            <div class="signature-name">${userFullName || 'Authorized Signature'}</div>
            <div class="signature-title">Authorized Signature</div>
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
      
      .signature-section {
        margin-top: 40px;
        text-align: center;
        padding-top: 30px;
      }
      
      .signature-line {
        width: 300px;
        height: 2px;
        background: #2c3e50;
        margin: 0 auto 10px auto;
      }
      
      .signature-name {
        font-size: 1.1rem;
        color: #2c3e50;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .signature-title {
        font-size: 0.9rem;
        color: #7f8c8d;
        font-style: italic;
      }
    `;
    
    setDiplomaHtml(template);
    setDiplomaCss(css);
  };

  const generateTemplate = () => {
    generateTemplateWithFields(diplomaFields);
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
              placeholder="Enter recipient name"
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

          <div className="space-y-2">
            <Label>Authorized Signature</Label>
            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
              <p><strong>Signatory:</strong> {userFullName || 'Loading...'}</p>
              <p className="text-xs mt-1">This will be the authorized signature on your diploma. To change this, update your profile name.</p>
            </div>
          </div>
          
          <div className="pt-4">
            {!diplomaHtml && (
              <Button onClick={generateTemplate} className="w-full mb-2">
                Generate Diploma Template
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              💡 Tip: Start typing in any field above and a diploma will automatically appear in the preview!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
