
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Signed from "./pages/Signed";
import Diploma from "./pages/Diploma";
import DiplomaEmbed from "./pages/DiplomaEmbed";
import TestDiploma from "./pages/TestDiploma";
import Verify from "./pages/Verify";
import AdminDashboard from "./pages/AdminDashboard";
import HealthCheck from "./pages/HealthCheck";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
