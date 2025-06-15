
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Award, ExternalLink, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Diploma = () => {
  const { diplomaId } = useParams();
  const [diplomaData, setDiplomaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      {/* Diploma Content */}
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

          {/* Diploma Display */}
          <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: `<style>${diplomaData.diploma_css}</style>${diplomaData.diploma_html}` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diploma;
