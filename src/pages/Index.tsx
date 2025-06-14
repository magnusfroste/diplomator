
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { DiplomaProvider } from "@/contexts/DiplomaContext";
import { ApiKeySettings } from "@/components/ApiKeySettings";

const Index = () => {
  return (
    <DiplomaProvider>
      <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
        <ApiKeySettings />
        
        {/* Chat Panel */}
        <div className="w-1/2 border-r border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <ChatPanel />
        </div>
        
        {/* Preview Panel */}
        <div className="w-1/2 bg-gradient-to-br from-slate-100 via-blue-100 to-purple-100">
          <PreviewPanel />
        </div>
      </div>
    </DiplomaProvider>
  );
};

export default Index;
