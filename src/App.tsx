
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TradingBasics from "./pages/TradingBasics";
import Catalog from "./pages/Catalog";
import BotsGuide from "./pages/BotsGuide";
import BotBuilder from "./pages/BotBuilder";
import PracticeCase from "./pages/PracticeCase";
import Legends from "./pages/Legends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/trading-basics" element={<TradingBasics />} />
          <Route path="/bots-guide" element={<BotsGuide />} />
          <Route path="/bot-builder" element={<BotBuilder />} />
          <Route path="/practice" element={<PracticeCase />} />
          <Route path="/legends" element={<Legends />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;