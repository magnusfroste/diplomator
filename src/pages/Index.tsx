
import { DiplomaProvider } from "@/contexts/DiplomaContext";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { BlockchainMenu } from "@/components/BlockchainMenu";
import { UserHeader } from "@/components/UserHeader";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <DiplomaProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Diploma Generator
              </h1>
              <BlockchainMenu />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserHeader />
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-120px)]">
            {/* Left Panel - Chat Only */}
            <div className="space-y-4">
              <ChatPanel />
            </div>

            {/* Right Panel - Preview with Sign */}
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
              <PreviewPanel />
            </div>
          </div>
        </div>
      </div>
    </DiplomaProvider>
  );
};

export default Index;
