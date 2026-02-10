
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>Laddar...</div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
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
            <Route path="/health" element={<HealthCheck />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
