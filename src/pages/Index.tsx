
import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { UserHeader } from "@/components/UserHeader";
import { DiplomaProvider } from "@/contexts/DiplomaContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ApiKeySettings } from "@/components/ApiKeySettings";
import { BlockchainMenu } from "@/components/BlockchainMenu";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  return (
    <ThemeProvider>
      <DiplomaProvider>
        <div className="h-screen flex flex-col bg-background">
          {/* Header */}
          <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">Diplomator</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <BlockchainMenu />
                <ApiKeySettings />
                <UserHeader />
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <ResizablePanelGroup direction="horizontal" className="w-full h-full">
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
        </div>
      </DiplomaProvider>
    </ThemeProvider>
  );
};

export default Index;
