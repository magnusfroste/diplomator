import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Home, 
  Clock,
  Building,
  Hash,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';

const Diploma = () => {
  const { diplomaId } = useParams();
  const navigate = useNavigate();
  const [diplomaData, setDiplomaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    console.log('=== DIPLOMA COMPONENT MOUNTED ===');
    console.log('diplomaId from params:', diplomaId);
    console.log('Full URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    
    if (diplomaId) {
      fetchDiplomaData();
    } else {
      console.error('No diplomaId found in URL parameters');
      setIsLoading(false);
    }
  }, [diplomaId]);

  const fetchDiplomaData = async () => {
    try {
      console.log('=== DIPLOMA FETCH DEBUG ===');
      console.log('Fetching diploma with ID:', diplomaId);
      
      // Use the same query pattern as the Verify page
      const { data, error } = await supabase
        .from('signed_diplomas')
        .select('*')
        .eq('blockchain_id', diplomaId)
        .maybeSingle();

      console.log('Supabase query result:', { data, error });
      console.log('Query was: SELECT * FROM signed_diplomas WHERE blockchain_id =', diplomaId);

      if (error) {
        console.error('Supabase error details:', error);
        toast.error('Error loading diploma: ' + error.message);
        return;
      }

      if (!data) {
        console.error('No diploma found with blockchain_id:', diplomaId);
        console.log('This means the query returned no results');
        
        // Let's also try to get all diplomas to see what's in the database
        const { data: allDiplomas, error: allError } = await supabase
          .from('signed_diplomas')
          .select('blockchain_id, recipient_name')
          .limit(10);
        
        console.log('All diplomas in database (first 10):', allDiplomas);
        if (allError) {
          console.error('Error fetching all diplomas:', allError);
        }
        
        toast.error('Diploma not found');
        return;
      }

      console.log('SUCCESS: Diploma data found:', data);
      setDiplomaData(data);
    } catch (error) {
      console.error('Unexpected error fetching diploma:', error);
      toast.error('Error loading diploma');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!diplomaData) return;
    
    setIsGeneratingPDF(true);
    try {
      const verificationUrl = `${window.location.origin}/verify/${diplomaData.blockchain_id}`;
      
      // Create a temporary div with the diploma content + verification elements
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="width: 800px; height: 600px; padding: 40px; background: white; position: relative;">
          <style>${diplomaData.diploma_css}</style>
          ${diplomaData.diploma_html}
          <div style="position: absolute; bottom: 20px; right: 20px; background: #2563eb; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">🛡️</span>
            Verified by Diplomator
          </div>
          <div style="position: absolute; bottom: 20px; left: 20px; text-align: center;">
            <div style="background: white; padding: 8px; border-radius: 8px; border: 2px solid #e5e7eb; margin-bottom: 8px;">
              <div id="qr-code-container" style="width: 80px; height: 80px;"></div>
            </div>
            <div style="font-size: 10px; color: #666; font-family: monospace; word-break: break-all; max-width: 96px;">
              ${diplomaData.blockchain_id}
            </div>
          </div>
        </div>
      `;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Generate QR code for the verification URL and insert it
      const qrContainer = tempDiv.querySelector('#qr-code-container');
      if (qrContainer) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 80;
        canvas.height = 80;
        
        // Simple QR code placeholder (in a real implementation, you'd use a QR library)
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 80, 80);
        ctx.fillStyle = '#fff';
        ctx.fillRect(10, 10, 60, 60);
        ctx.fillStyle = '#000';
        ctx.font = '8px monospace';
        ctx.fillText('QR', 35, 45);
        
        qrContainer.appendChild(canvas);
      }

      // Convert to canvas
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
        width: 800,
        height: 600,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`diploma_${diplomaData.recipient_name.replace(/\s+/g, '_')}.pdf`);

      // Clean up
      document.body.removeChild(tempDiv);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Diploma link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const openVerificationPage = () => {
    window.open(`/verify/${diplomaId}`, '_blank');
  };

  const getPreviewContent = () => {
    if (!diplomaData) return '';
    
    const verificationUrl = `${window.location.origin}/verify/${diplomaData.blockchain_id}`;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${diplomaData.recipient_name} - Diploma</title>
        <style>
          ${diplomaData.diploma_css}
          .verification-section {
            position: fixed;
            bottom: 20px;
            left: 20px;
            text-align: center;
            z-index: 1000;
          }
          .qr-container {
            background: white;
            padding: 8px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            margin-bottom: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .diploma-id {
            font-size: 10px;
            color: #666;
            font-family: monospace;
            word-break: break-all;
            max-width: 96px;
            background: white;
            padding: 4px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        ${diplomaData.diploma_html}
        <div class="verification-section">
          <div class="qr-container">
            <div id="qr-code-placeholder" style="width: 80px; height: 80px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666;">QR</div>
          </div>
          <div class="diploma-id">${diplomaData.blockchain_id}</div>
        </div>
        <script>
          // This would be where we'd inject the actual QR code
          // For now, we'll use a placeholder
        </script>
      </body>
      </html>
    `;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-lg text-gray-600">Loading diploma...</p>
          <p className="text-sm text-gray-500 mt-2">Diploma ID: {diplomaId}</p>
          <p className="text-xs text-gray-400 mt-1">Route params working: {diplomaId ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  if (!diplomaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Diploma Not Found</h1>
          <p className="text-gray-600 mb-2">The requested diploma could not be found.</p>
          <p className="text-sm text-gray-500 mb-4">Searched for ID: {diplomaId}</p>
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Back to Diplomator
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Diplomator
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                {diplomaData.recipient_name}'s Diploma
              </h1>
            </div>
            
            {/* Verified Badge */}
            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
              <Shield className="w-3 h-3 mr-1" />
              Verified by Diplomator
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diploma Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-lg">
                    <iframe
                      srcDoc={getPreviewContent()}
                      className="w-full h-96 lg:h-[600px] border-0"
                      title="Diploma"
                    />
                  </div>
                  
                  {/* Verification Elements Overlay */}
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-blue-600 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified by Diplomator
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 text-center">
                    <div className="bg-white p-2 rounded-lg border-2 border-gray-200 shadow-lg mb-2">
                      <QRCodeGenerator 
                        value={`${window.location.origin}/verify/${diplomaData.blockchain_id}`}
                        size={80}
                      />
                    </div>
                    <div className="text-xs text-gray-600 font-mono bg-white px-2 py-1 rounded border max-w-24 break-all">
                      {diplomaData.blockchain_id}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Verification Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Blockchain Verified</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Signed: {new Date(diplomaData.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>{diplomaData.institution_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-xs break-all">
                      {diplomaData.blockchain_id}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold mb-4">Actions</h3>
                
                <Button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </Button>

                <Button
                  variant="outline"
                  onClick={copyShareLink}
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy Share Link
                </Button>

                <Button
                  variant="outline"
                  onClick={openVerificationPage}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verify Authenticity
                </Button>
              </CardContent>
            </Card>

            {/* About Verification */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">About This Diploma</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This diploma has been cryptographically signed and stored on the blockchain 
                  by Diplomator, ensuring its authenticity and preventing tampering.
                </p>
                <p className="text-xs text-muted-foreground">
                  💡 Scan the QR code or use the Diploma ID to verify authenticity anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diploma;
