
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CheckCircle, Copy, ExternalLink, QrCode } from 'lucide-react';
import { useDiploma } from '@/contexts/DiplomaContext';
import { signDiplomaToBlockchain, createVerificationUrl, DiplomaRecord } from '@/services/blockchainService';
import { QRCodeGenerator } from './QRCodeGenerator';
import { toast } from 'sonner';

export const BlockchainSigner = () => {
  const { diplomaHtml, diplomaCss } = useDiploma();
  const [recipientName, setRecipientName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [isSigningTx, setIsSigningTx] = useState(false);
  const [signedRecord, setSignedRecord] = useState<DiplomaRecord | null>(null);
  const [verificationUrl, setVerificationUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleSignToBlockchain = async () => {
    if (!recipientName.trim() || !institutionName.trim()) {
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
        recipientName.trim(),
        institutionName.trim()
      );
      
      setSignedRecord(record);
      const url = createVerificationUrl(record.id);
      setVerificationUrl(url);
      
      toast.success('Diploma successfully signed and stored on blockchain!');
    } catch (error) {
      console.error('Error signing diploma:', error);
      toast.error('Failed to sign diploma to blockchain');
    } finally {
      setIsSigningTx(false);
    }
  };

  const copyVerificationUrl = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      toast.success('Verification URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const copyDiplomaId = async () => {
    if (signedRecord) {
      try {
        await navigator.clipboard.writeText(signedRecord.id);
        toast.success('Diploma ID copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy Diploma ID');
      }
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
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Name</Label>
              <Input
                id="recipient"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient's full name"
                disabled={isSigningTx}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution Name</Label>
              <Input
                id="institution"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Enter institution name"
                disabled={isSigningTx}
              />
            </div>

            <Button
              onClick={handleSignToBlockchain}
              disabled={!hasContent || isSigningTx || !recipientName.trim() || !institutionName.trim()}
              className="w-full"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isSigningTx ? 'Signing to Blockchain...' : 'Sign & Store on Blockchain'}
            </Button>

            {!hasContent && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                ⚠️ Create a diploma first before signing to blockchain
              </p>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Blockchain Verified!</h4>
              </div>
              <p className="text-sm text-green-800">
                Your diploma has been cryptographically signed and stored on the blockchain.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">DIPLOMA ID</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono">
                    {signedRecord.id}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyDiplomaId}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">VERIFICATION URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono truncate">
                    {verificationUrl}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyVerificationUrl}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowQR(!showQR)}
                  >
                    <QrCode className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {showQR && (
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <QRCodeGenerator value={verificationUrl} size={120} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">TIMESTAMP</Label>
                  <p className="font-mono">{new Date(signedRecord.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">INSTITUTION</Label>
                  <p className="truncate">{signedRecord.institutionInfo}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(verificationUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Verification Page
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setSignedRecord(null);
                setVerificationUrl('');
                setRecipientName('');
                setInstitutionName('');
                setShowQR(false);
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
