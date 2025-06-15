
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiplomaManager } from '@/components/DiplomaManager';

const Signed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/app')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to App
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Signed Diplomas</h1>
          <p className="text-gray-600">Manage and view all your blockchain-verified diplomas</p>
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
