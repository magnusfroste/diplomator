
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search, 
  Home, 
  Clock,
  Building,
  Hash,
  User
} from 'lucide-react';
import { verifyDiplomaFromBlockchain, DiplomaRecord } from '@/services/blockchainService';
import { toast } from 'sonner';

const Verify = () => {
  const { diplomaId: urlDiplomaId } = useParams();
  const navigate = useNavigate();
  const [diplomaId, setDiplomaId] = useState(urlDiplomaId || '');
  const [recipientName, setRecipientName] = useState('');
  const [diplomaHtml, setDiplomaHtml] = useState('');
  const [diplomaCss, setDiplomaCss] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    record?: DiplomaRecord;
    issues: string[];
  } | null>(null);

  useEffect(() => {
    if (urlDiplomaId) {
      setDiplomaId(urlDiplomaId);
    }
  }, [urlDiplomaId]);

  const handleVerification = async () => {
    if (!diplomaId.trim()) {
      toast.error('Please enter a diploma ID');
      return;
    }

    if (!recipientName.trim()) {
      toast.error('Please enter the recipient name');
      return;
    }

    if (!diplomaHtml.trim() || !diplomaCss.trim()) {
      toast.error('Please provide both HTML and CSS content');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyDiplomaFromBlockchain(
        diplomaId.trim(),
        diplomaHtml.trim(),
        diplomaCss.trim(),
        recipientName.trim()
      );
      
      setVerificationResult(result);
      
      if (result.isValid) {
        toast.success('Diploma verification successful! ✅');
      } else {
        toast.error('Diploma verification failed! ❌');
      }
    } catch (error) {
      console.error('Error verifying diploma:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const getPreviewContent = () => {
    if (!diplomaHtml || !diplomaCss) return '';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diploma Verification Preview</title>
        <style>${diplomaCss}</style>
      </head>
      <body>
        ${diplomaHtml}
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Diploma Verification</h1>
          </div>
          <p className="text-lg text-gray-600">
            Verify the authenticity of blockchain-signed diplomas
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mt-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Diplomator
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Form */}
          <Card>
            <CardHeader>
              <CardTitle>Verify Diploma</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the diploma details to verify its authenticity
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="diplomaId">Diploma ID</Label>
                <Input
                  id="diplomaId"
                  value={diplomaId}
                  onChange={(e) => setDiplomaId(e.target.value)}
                  placeholder="DIP_xxxxx_xxxxxx"
                  disabled={isVerifying}
                />
              </div>

              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's full name"
                  disabled={isVerifying}
                />
              </div>

              <div>
                <Label htmlFor="diplomaHtml">Diploma HTML</Label>
                <Textarea
                  id="diplomaHtml"
                  value={diplomaHtml}
                  onChange={(e) => setDiplomaHtml(e.target.value)}
                  placeholder="Paste the diploma HTML content here..."
                  className="h-32 font-mono text-sm"
                  disabled={isVerifying}
                />
              </div>

              <div>
                <Label htmlFor="diplomaCss">Diploma CSS</Label>
                <Textarea
                  id="diplomaCss"
                  value={diplomaCss}
                  onChange={(e) => setDiplomaCss(e.target.value)}
                  placeholder="Paste the diploma CSS content here..."
                  className="h-32 font-mono text-sm"
                  disabled={isVerifying}
                />
              </div>

              <Button
                onClick={handleVerification}
                disabled={isVerifying}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                {isVerifying ? 'Verifying...' : 'Verify on Blockchain'}
              </Button>

              {/* Verification Result */}
              {verificationResult && (
                <div className={`p-4 rounded-lg border ${
                  verificationResult.isValid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {verificationResult.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <h4 className={`font-medium ${
                      verificationResult.isValid ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {verificationResult.isValid ? 'Verification Successful' : 'Verification Failed'}
                    </h4>
                  </div>

                  {verificationResult.isValid && verificationResult.record && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Signed: {new Date(verificationResult.record.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span>Institution: {verificationResult.record.institutionInfo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs">Hash: {verificationResult.record.contentHash.substring(0, 16)}...</span>
                      </div>
                    </div>
                  )}

                  {!verificationResult.isValid && verificationResult.issues.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-red-900 mb-1">Issues found:</p>
                      <ul className="list-disc list-inside text-sm text-red-800">
                        {verificationResult.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Diploma Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preview of the diploma being verified
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-white rounded-lg border border-slate-200 overflow-hidden">
                {diplomaHtml && diplomaCss ? (
                  <iframe
                    srcDoc={getPreviewContent()}
                    className="w-full h-full border-0"
                    title="Diploma Preview"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Enter diploma content to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How Blockchain Verification Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Cryptographic Signing</h3>
                <p className="text-sm text-muted-foreground">
                  Each diploma is signed with Diplomator's private key, creating a unique digital signature.
                </p>
              </div>
              <div className="text-center">
                <Hash className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Content Hashing</h3>
                <p className="text-sm text-muted-foreground">
                  The diploma content is hashed, so any modification will be detected during verification.
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Immutable Record</h3>
                <p className="text-sm text-muted-foreground">
                  Records are stored on blockchain, making them tamper-proof and permanently verifiable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verify;
