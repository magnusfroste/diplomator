
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiplomaManager } from '@/components/DiplomaManager';

const Signed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Brand */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Diplomator</h1>
              <p className="text-sm text-gray-600">My Signed Diplomas</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/app')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>

        {/* Diploma Manager */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <DiplomaManager />
        </div>
      </div>
    </div>
  );
};

export default Signed;
