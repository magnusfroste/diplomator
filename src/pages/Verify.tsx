
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search, 
  Home, 
  Clock,
  Building,
  Hash,
  User,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DiplomaRecord {
  blockchain_id: string;
  recipient_name: string;
  institution_name: string;
  diploma_html: string;
  diploma_css: string;
  content_hash: string;
  signature: string;
  diplomator_seal: string;
  created_at: string;
}

const Verify = () => {
  const { diplomaId: urlDiplomaId } = useParams();
  const navigate = useNavigate();
  const [diplomaId, setDiplomaId] = useState(urlDiplomaId || '');
  const [recipientName, setRecipientName] = useState('');
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

  const createWebCryptoHashLocal = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleVerification = async () => {
    if (!diplomaId.trim()) {
      toast.error('Please enter a diploma ID');
      return;
    }

    if (!recipientName.trim()) {
      toast.error('Please enter the recipient name');
      return;
    }

    setIsVerifying(true);
    const issues: string[] = [];

    try {
      console.log('=== VERIFICATION DEBUG ===');
      console.log('Diploma ID:', diplomaId);
      console.log('Recipient Name:', recipientName);

      // Fetch diploma from database
      const { data: diplomaData, error } = await supabase
        .from('signed_diplomas')
        .select('*')
        .eq('blockchain_id', diplomaId.trim())
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        issues.push(`Database error: ${error.message}`);
        setVerificationResult({ isValid: false, issues });
        toast.error('Error accessing diploma database');
        return;
      }

      if (!diplomaData) {
        issues.push('Diploma not found on blockchain');
        setVerificationResult({ isValid: false, issues });
        toast.error('Diploma not found');
        return;
      }

      console.log('Found diploma data:', {
        blockchain_id: diplomaData.blockchain_id,
        recipient_name: diplomaData.recipient_name,
        institution_name: diplomaData.institution_name,
        html_length: diplomaData.diploma_html.length,
        css_length: diplomaData.diploma_css.length
      });

      // Verify recipient name matches
      if (diplomaData.recipient_name.toLowerCase() !== recipientName.trim().toLowerCase()) {
        issues.push('Recipient name does not match diploma record');
      }

      // Verify content hash
      const currentContentHash = await createWebCryptoHashLocal(diplomaData.diploma_html + diplomaData.diploma_css);
      console.log('Content hash verification:', {
        stored: diplomaData.content_hash,
        calculated: currentContentHash,
        matches: currentContentHash === diplomaData.content_hash
      });
      
      if (currentContentHash !== diplomaData.content_hash) {
        issues.push('Diploma content has been tampered with');
      }

      // Verify Diplomator signature
      const DIPLOMATOR_PRIVATE_KEY = 'diplomator_secure_key_2024';
      const signatureData = `${diplomaData.content_hash}:${diplomaData.recipient_name}:${DIPLOMATOR_PRIVATE_KEY}`;
      const expectedSignature = await createWebCryptoHashLocal(signatureData);
      
      console.log('Signature verification:', {
        stored: diplomaData.signature,
        calculated: expectedSignature,
        matches: expectedSignature === diplomaData.signature
      });
      
      if (expectedSignature !== diplomaData.signature) {
        issues.push('Invalid Diplomator signature');
      }

      const isValid = issues.length === 0;
      setVerificationResult({ 
        isValid, 
        record: diplomaData, 
        issues 
      });

      if (isValid) {
        toast.success('Diploma verification successful! ✅');
        // Redirect to the authentic diploma page after a short delay
        setTimeout(() => {
          navigate(`/diploma/${diplomaId}`);
        }, 2000);
      } else {
        toast.error('Diploma verification failed! ❌');
      }

    } catch (error) {
      console.error('Error verifying diploma:', error);
      toast.error('An unexpected error occurred during verification');
      setVerificationResult({ 
        isValid: false, 
        issues: ['An unexpected error occurred during verification'] 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const viewAuthenticDiploma = () => {
    if (verificationResult?.record) {
      navigate(`/diploma/${verificationResult.record.blockchain_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="max-w-2xl mx-auto">
          {/* Verification Form */}
          <Card>
            <CardHeader>
              <CardTitle>Verify Diploma</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the diploma ID and recipient name to verify authenticity
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
                <p className="text-xs text-muted-foreground mt-1">
                  Find this ID on the original diploma document
                </p>
              </div>

              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's full name exactly as shown on diploma"
                  disabled={isVerifying}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must match exactly with the name on the diploma
                </p>
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
                    <>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>Recipient: {verificationResult.record.recipient_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span>Institution: {verificationResult.record.institution_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Signed: {new Date(verificationResult.record.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-xs">Hash: {verificationResult.record.content_hash.substring(0, 16)}...</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-green-800 mb-3">
                          Redirecting to authentic diploma in 2 seconds...
                        </p>
                        <Button
                          onClick={viewAuthenticDiploma}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Authentic Diploma Now
                        </Button>
                      </div>
                    </>
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
                <h3 className="font-semibold mb-2">Authentic Content</h3>
                <p className="text-sm text-muted-foreground">
                  Upon successful verification, you'll be redirected to view the exact diploma content as it was originally signed.
                </p>
              </div>
              <div className="text-center">
                <Hash className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Content Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  Each diploma's content is cryptographically hashed, making any tampering immediately detectable.
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Immutable Record</h3>
                <p className="text-sm text-muted-foreground">
                  Records are stored securely, making them tamper-proof and permanently verifiable.
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
