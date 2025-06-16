
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Copy, Calendar, User, Building2, FileText, Clock, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignedDiploma {
  id: string;
  blockchain_id: string;
  recipient_name: string;
  institution_name: string;
  verification_url: string;
  diploma_url: string;
  created_at: string;
}

export const DiplomaManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: signedDiplomas, isLoading, error } = useQuery({
    queryKey: ['signed-diplomas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signed_diplomas')
        .select('id, blockchain_id, recipient_name, institution_name, verification_url, diploma_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SignedDiploma[];
    },
  });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error(`Failed to copy ${type}`);
    }
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Filter diplomas based on search term
  const filteredDiplomas = signedDiplomas?.filter((diploma) =>
    diploma.recipient_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by recipient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          {filteredDiplomas.length} diploma{filteredDiplomas.length !== 1 ? 's' : ''} found
          {filteredDiplomas.length !== signedDiplomas.length && ` (${signedDiplomas.length} total)`}
        </div>
      )}

      {/* No Search Results */}
      {searchTerm && filteredDiplomas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-muted-foreground mb-2">No diplomas found</div>
          <p className="text-sm text-muted-foreground">
            Try searching with a different recipient name.
          </p>
        </div>
      )}

      {/* Diploma Cards */}
      <div className="grid gap-4">
        {filteredDiplomas.map((diploma) => {
          const { date, time } = formatDate(diploma.created_at);
          
          return (
            <Card key={diploma.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      {diploma.recipient_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Created {date} at {time}</span>
                      </div>
                    </div>
                  </div>
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
                    <span className="text-muted-foreground">{date}</span>
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
                        onClick={() => copyToClipboard(diploma.blockchain_id, 'Diploma ID')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Diploma URL
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono truncate">
                        {diploma.diploma_url}
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(diploma.diploma_url, 'Diploma URL')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openUrl(diploma.diploma_url)}
                      >
                        <FileText className="w-3 h-3" />
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
                        onClick={() => copyToClipboard(diploma.verification_url, 'Verification URL')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openUrl(diploma.verification_url)}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
