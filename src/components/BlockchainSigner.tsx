
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useDiploma } from '@/contexts/DiplomaContext';
import { signDiplomaToBlockchain, createDiplomaUrl, DiplomaRecord } from '@/services/blockchainService';
import { toast } from 'sonner';

export const BlockchainSigner = () => {
  const { 
    diplomaHtml, 
    diplomaCss,
    signingRecipientName,
    setSigningRecipientName,
    signingInstitutionName,
    setSigningInstitutionName
  } = useDiploma();
  
  const [isSigningTx, setIsSigningTx] = useState(false);
  const [signedRecord, setSignedRecord] = useState<DiplomaRecord | null>(null);
  const [diplomaUrl, setDiplomaUrl] = useState('');

  const handleSignToBlockchain = async () => {
    if (!signingRecipientName.trim() || !signingInstitutionName.trim()) {
      toast.error('Please fill in both recipient and institution names');
      return;
    }

    if (!diplomaHtml || !diplomaCss) {
      toast.error('No diploma content to sign. Please create a diploma first.');
      return;
    }

    setIsSigningTx(true);

    try {
      const record = await signDiplomaToBlockchain(
        diplomaHtml,
        diplomaCss,
        signingRecipientName.trim(),
        signingInstitutionName.trim()
      );
      
      setSignedRecord(record);
      const directUrl = createDiplomaUrl(record.id);
      setDiplomaUrl(directUrl);
      
      toast.success('Diploma successfully signed and stored on blockchain!');
    } catch (error) {
      console.error('Signing error:', error);
      toast.error('Failed to sign diploma to blockchain: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSigningTx(false);
    }
  };

  const hasContent = diplomaHtml && diplomaCss;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Blockchain Verification
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign your diploma to the blockchain for tamper-proof verification
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!signedRecord ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Name</Label>
                <Input
                  id="recipient"
                  value={signingRecipientName}
                  onChange={(e) => setSigningRecipientName(e.target.value)}
                  placeholder="Enter recipient's full name"
                  disabled={isSigningTx}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution Name</Label>
                <Input
                  id="institution"
                  value={signingInstitutionName}
                  onChange={(e) => setSigningInstitutionName(e.target.value)}
                  placeholder="Enter institution name"
                  disabled={isSigningTx}
                />
              </div>
            </div>

            <Button
              onClick={handleSignToBlockchain}
              disabled={!hasContent || isSigningTx || !signingRecipientName.trim() || !signingInstitutionName.trim()}
              className="w-full"
            >
              {isSigningTx ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing to Blockchain...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign & Store on Blockchain
                </>
              )}
            </Button>

            {!hasContent && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  ⚠️ Create a diploma first before signing to blockchain
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Successfully Signed!</h4>
              </div>
              <p className="text-sm text-green-800">
                Your diploma has been cryptographically signed and stored on the blockchain.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">DIPLOMA ID</Label>
                <div className="text-sm bg-muted px-3 py-2 rounded font-mono mt-1">
                  {signedRecord.id}
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">TIMESTAMP</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(signedRecord.timestamp).toLocaleString()}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(diplomaUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Signed Diploma
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setSignedRecord(null);
                setDiplomaUrl('');
                setSigningRecipientName('');
                setSigningInstitutionName('');
              }}
            >
              Sign Another Diploma
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
