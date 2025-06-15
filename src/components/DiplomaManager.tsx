
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Calendar, User, Building, Hash, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QRCodeGenerator } from './QRCodeGenerator';

interface SignedDiploma {
  id: string;
  blockchain_id: string;
  recipient_name: string;
  institution_name: string;
  verification_url: string;
  created_at: string;
  content_hash: string;
}

export const DiplomaManager = () => {
  const [diplomas, setDiplomas] = useState<SignedDiploma[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDiploma, setExpandedDiploma] = useState<string | null>(null);

  useEffect(() => {
    fetchSignedDiplomas();
  }, []);

  const fetchSignedDiplomas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('signed_diplomas')
        .select('id, blockchain_id, recipient_name, institution_name, verification_url, created_at, content_hash')
        .eq('issuer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching diplomas:', error);
        toast.error('Failed to load diplomas');
        return;
      }

      setDiplomas(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load diplomas');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const toggleExpanded = (diplomaId: string) => {
    setExpandedDiploma(expandedDiploma === diplomaId ? null : diplomaId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading your diplomas...</div>
        </CardContent>
      </Card>
    );
  }

  if (diplomas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Signed Diplomas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Diplomas you've signed and issued will appear here
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No diplomas signed yet</p>
            <p className="text-sm">Create and sign your first diploma to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Your Signed Diplomas ({diplomas.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage and share the diplomas you've issued
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {diplomas.map((diploma) => (
          <div key={diploma.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{diploma.recipient_name}</span>
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span>{diploma.institution_name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(diploma.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleExpanded(diploma.id)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            {expandedDiploma === diploma.id && (
              <div className="border-t pt-3 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">DIPLOMA ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono">
                      {diploma.blockchain_id}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(diploma.blockchain_id, 'Diploma ID')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">VERIFICATION URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono truncate">
                      {diploma.verification_url}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(diploma.verification_url, 'Verification URL')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(diploma.verification_url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">CONTENT HASH</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono text-xs">
                      {diploma.content_hash}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(diploma.content_hash, 'Content Hash')}
                    >
                      <Hash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center p-4 bg-muted rounded-lg">
                  <QRCodeGenerator value={diploma.verification_url} size={100} />
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
