import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiplomaManager } from '@/components/DiplomaManager';

const Signed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/15 border border-primary/20 p-2 rounded-lg">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Signed Diplomas</h1>
              <p className="text-sm text-muted-foreground">Manage your blockchain-verified credentials</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => navigate('/app')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </div>

        {/* Diploma Manager */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <DiplomaManager />
        </div>
      </div>
    </div>
  );
};

export default Signed;
