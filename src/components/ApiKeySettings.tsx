
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ApiKeySettings = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="fixed top-4 right-4 z-50 text-green-600 cursor-default"
      disabled
    >
      <CheckCircle className="w-4 h-4 mr-1" />
      Connected to Supabase
    </Button>
  );
};
