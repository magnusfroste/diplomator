
import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import HealthCheck from "./pages/HealthCheck";

function lazyRetry(importFn: () => Promise<any>, retries = 3, delay = 1500): Promise<any> {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error: Error) => {
        if (retries > 0) {
          console.warn(`Lazy import failed, retrying (${retries} left)...`);
          setTimeout(() => {
            lazyRetry(importFn, retries - 1, delay).then(resolve, reject);
          }, delay);
        } else {
          reject(error);
        }
      });
  });
}

const Auth = lazy(() => lazyRetry(() => import("./pages/Auth")));
const Index = lazy(() => lazyRetry(() => import("./pages/Index")));
const Profile = lazy(() => lazyRetry(() => import("./pages/Profile")));
const Signed = lazy(() => lazyRetry(() => import("./pages/Signed")));
const Diploma = lazy(() => lazyRetry(() => import("./pages/Diploma")));
const DiplomaEmbed = lazy(() => lazyRetry(() => import("./pages/DiplomaEmbed")));
const TestDiploma = lazy(() => lazyRetry(() => import("./pages/TestDiploma")));
const Verify = lazy(() => lazyRetry(() => import("./pages/Verify")));
const AdminDashboard = lazy(() => lazyRetry(() => import("./pages/AdminDashboard")));
const DSLExplorer = lazy(() => lazyRetry(() => import("./pages/DSLExplorer")));

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
                <Route path="/admin/dsl" element={<DSLExplorer />} />
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
