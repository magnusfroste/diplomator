
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, Calendar, User, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignedDiploma {
  id: string;
  blockchain_id: string;
  recipient_name: string;
  institution_name: string;
  verification_url: string;
  created_at: string;
}

export const DiplomaManager = () => {
  const { data: signedDiplomas, isLoading, error } = useQuery({
    queryKey: ['signed-diplomas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signed_diplomas')
        .select('id, blockchain_id, recipient_name, institution_name, verification_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SignedDiploma[];
    },
  });

  const copyVerificationUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Verification URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const copyDiplomaId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('Diploma ID copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy Diploma ID');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading signed diplomas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-600">Failed to load signed diplomas</div>
      </div>
    );
  }

  if (!signedDiplomas || signedDiplomas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="text-muted-foreground mb-2">No signed diplomas yet</div>
        <p className="text-sm text-muted-foreground">
          Create and sign your first diploma to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {signedDiplomas.map((diploma) => (
          <Card key={diploma.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  {diploma.recipient_name}
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Institution:</span>
                  <span className="text-muted-foreground">{diploma.institution_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Signed:</span>
                  <span className="text-muted-foreground">
                    {new Date(diploma.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Diploma ID
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono truncate">
                      {diploma.blockchain_id}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyDiplomaId(diploma.blockchain_id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Verification URL
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono truncate">
                      {diploma.verification_url}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyVerificationUrl(diploma.verification_url)}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
