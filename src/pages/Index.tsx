
import { useState, useEffect } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { UserHeader } from "@/components/UserHeader";
import { DiplomaProvider } from "@/contexts/DiplomaContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BlockchainMenu } from "@/components/BlockchainMenu";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Award } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <ThemeProvider>
      <DiplomaProvider>
        <div className="h-screen flex flex-col bg-background">
          {/* Header */}
          <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Diplomator</h1>
                  <p className="text-xs text-muted-foreground">AI-Powered Diploma Designer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <BlockchainMenu />
                <UserHeader 
                  userEmail={user.email || 'Unknown'} 
                  userName={user.user_metadata?.name || user.email?.split('@')[0] || 'User'} 
                />
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
