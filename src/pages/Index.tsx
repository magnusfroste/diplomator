
import { useState, useEffect } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { DiplomaProvider } from "@/contexts/DiplomaContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BlockchainMenu } from "@/components/BlockchainMenu";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Award } from "lucide-react";
import { useGuestAccess } from "@/hooks/useGuestAccess";
import { GuestBanner } from "@/components/GuestBanner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = location.pathname === '/demo';
  const guestAccess = useGuestAccess();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session && !isDemo) {
        navigate('/auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (!session && !isDemo) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, isDemo]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return null;
  }

  const isGuest = !user && isDemo;

  return (
    <ThemeProvider>
      <DiplomaProvider>
        <SidebarProvider>
          <div className="h-screen flex w-full">
            {/* Sidebar - only for logged-in users */}
            {!isGuest && (
              <AppSidebar
                userEmail={user?.email || ''}
                userName={user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              />
            )}

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Guest Banner */}
              {isGuest && <GuestBanner remainingGenerations={guestAccess.remainingGenerations} maxGenerations={guestAccess.maxGenerations} />}

              {/* Header */}
              <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    {!isGuest && <SidebarTrigger />}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-foreground">Diplomator</h1>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!isGuest && <BlockchainMenu />}
                    {isGuest && (
                      <a href="/auth" className="text-sm font-medium text-primary hover:underline">
                        Create account →
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 min-h-0">
                <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                  <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                    <div className="h-full border-r border-border bg-background">
                      <ChatPanel isGuest={isGuest} guestAccess={isGuest ? guestAccess : undefined} />
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle />
                  
                  <ResizablePanel defaultSize={70} minSize={50} maxSize={80}>
                    <div className="h-full bg-muted/50">
                      <PreviewPanel />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </DiplomaProvider>
    </ThemeProvider>
  );
};

export default Index;
