
import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import HealthCheck from "./pages/HealthCheck";

const Auth = lazy(() => import("./pages/Auth"));
const Index = lazy(() => import("./pages/Index"));
const Profile = lazy(() => import("./pages/Profile"));
const Signed = lazy(() => import("./pages/Signed"));
const Diploma = lazy(() => import("./pages/Diploma"));
const DiplomaEmbed = lazy(() => import("./pages/DiplomaEmbed"));
const TestDiploma = lazy(() => import("./pages/TestDiploma"));
const Verify = lazy(() => import("./pages/Verify"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "system-ui" }}>
    Laddar...
  </div>
);

const App = () => {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes("Failed to fetch dynamically imported module")) {
        console.warn("Dynamic import failed, reloading in 2s...", event.reason);
        event.preventDefault();
        setTimeout(() => window.location.reload(), 2000);
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/health" element={<HealthCheck />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/app" element={<Index />} />
                <Route path="/demo" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/signed" element={<Signed />} />
                <Route path="/diploma/:diplomaId" element={<Diploma />} />
                <Route path="/embed/:diplomaId" element={<DiplomaEmbed />} />
                <Route path="/testdiploma/:diplomaId" element={<TestDiploma />} />
                <Route path="/verify/:diplomaId?" element={<Verify />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
