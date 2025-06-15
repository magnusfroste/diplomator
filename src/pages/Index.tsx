
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { DiplomaProvider } from "@/contexts/DiplomaContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ApiKeySettings } from "@/components/ApiKeySettings";
import { BlockchainMenu } from "@/components/BlockchainMenu";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  return (
    <ThemeProvider>
      <DiplomaProvider>
        <div className="h-screen flex bg-background relative">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            <BlockchainMenu />
            <ApiKeySettings />
          </div>
          
          <ResizablePanelGroup direction="horizontal" className="w-full">
            {/* Chat Panel */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <div className="h-full border-r border-border bg-background">
                <ChatPanel />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Preview Panel */}
            <ResizablePanel defaultSize={70} minSize={50} maxSize={80}>
              <div className="h-full bg-muted/50">
                <PreviewPanel />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DiplomaProvider>
    </ThemeProvider>
  );
};

export default Index;
