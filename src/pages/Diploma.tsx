
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Award, ExternalLink, Shield, Calendar, QrCode, Share, Code, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { EmbedGenerator } from '@/components/EmbedGenerator';
import { toast } from 'sonner';

const Diploma = () => {
  const { diplomaId } = useParams();
  const [diplomaData, setDiplomaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (diplomaId) {
      fetchDiplomaData();
    }
  }, [diplomaId]);

  const fetchDiplomaData = async () => {
    try {
      const { data, error } = await supabase
        .from('signed_diplomas')
        .select('*')
        .eq('blockchain_id', diplomaId)
        .maybeSingle();

      if (error) {
        setError(`Database error: ${error.message}`);
        return;
      }

      if (!data) {
        setError('Diploma not found');
        return;
      }

      setDiplomaData(data);
    } catch (err) {
      setError('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyVerificationUrl = async () => {
    if (!diplomaData) return;
    
    const verificationUrl = `${window.location.origin}/verify/${diplomaData.blockchain_id}`;
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      toast.success('Verification URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const copyDiplomaUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Diploma URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mb-4 inline-block">
            <Award className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-lg font-medium">Loading diploma...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mb-4 inline-block">
              <Award className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-red-600">Diploma Not Found</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const verificationUrl = `${window.location.origin}/verify/${diplomaData.blockchain_id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Diplomator</h1>
              <p className="text-sm text-gray-600">Verified Digital Diploma</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Blockchain Verified
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(diplomaData.verification_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Diploma Info */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Recipient:</span>
                <p className="text-gray-900">{diplomaData.recipient_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Institution:</span>
                <p className="text-gray-900">{diplomaData.institution_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">Issued:</span>
                <p className="text-gray-900">{new Date(diplomaData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Tabs for Diploma, Verification, and Embed */}
          <Tabs defaultValue="diploma" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="diploma">
                <Award className="w-4 h-4 mr-2" />
                Diploma
              </TabsTrigger>
              <TabsTrigger value="verification">
                <QrCode className="w-4 h-4 mr-2" />
                Verification
              </TabsTrigger>
              <TabsTrigger value="embed">
                <Code className="w-4 h-4 mr-2" />
                Embed
              </TabsTrigger>
              <TabsTrigger value="share">
                <Share className="w-4 h-4 mr-2" />
                Share
              </TabsTrigger>
            </TabsList>

            {/* Diploma Display */}
            <TabsContent value="diploma">
              <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: `<style>${diplomaData.diploma_css}</style>${diplomaData.diploma_html}` 
                  }}
                />
              </div>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Code Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      QR Code Verification
                    </CardTitle>
                    <CardDescription>
                      Scan to verify diploma authenticity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="flex justify-center">
                      <QRCodeGenerator 
                        value={verificationUrl}
                        size={200}
                        level="M"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Scan with any QR code reader to verify
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyVerificationUrl}
                          className="flex-1"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy URL
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(verificationUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Blockchain Details
                    </CardTitle>
                    <CardDescription>
                      Immutable record on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Diploma ID:</span>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                          {diplomaData.blockchain_id}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Content Hash:</span>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                          {diplomaData.content_hash}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Diplomator Seal:</span>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                          {diplomaData.diplomator_seal}
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">Verified Authentic</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        This diploma has been cryptographically signed and stored on the blockchain
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Embed Tab */}
            <TabsContent value="embed">
              <EmbedGenerator diplomaId={diplomaData.blockchain_id} />
            </TabsContent>

            {/* Share Tab */}
            <TabsContent value="share">
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share className="w-5 h-5" />
                      Share This Diploma
                    </CardTitle>
                    <CardDescription>
                      Share the verified diploma with others
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Diploma URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={window.location.href}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 border rounded-md"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyDiplomaUrl}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Verification URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={verificationUrl}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 border rounded-md"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyVerificationUrl}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>📄 <strong>Diploma URL:</strong> Direct link to view the diploma</p>
                      <p>🔍 <strong>Verification URL:</strong> Link to verify authenticity</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Diploma;
