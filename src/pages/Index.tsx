
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { DiplomaProvider } from "@/contexts/DiplomaContext";
import { ApiKeySettings } from "@/components/ApiKeySettings";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  return (
    <DiplomaProvider>
      <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
        <ApiKeySettings />
        
        <ResizablePanelGroup direction="horizontal" className="w-full">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
            <div className="h-full border-r border-slate-200/50 bg-white/80 backdrop-blur-sm">
              <ChatPanel />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Preview Panel */}
          <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
            <div className="h-full bg-gradient-to-br from-slate-100 via-blue-100 to-purple-100">
              <PreviewPanel />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </DiplomaProvider>
  );
};

export default Index;
