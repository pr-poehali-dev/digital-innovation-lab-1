
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TradingBasics from "./pages/TradingBasics";
import Catalog from "./pages/Catalog";
import BotsGuide from "./pages/BotsGuide";
import Legends from "./pages/Legends";
import PracticeCase from "./pages/PracticeCase";
import BotBuilder from "./pages/BotBuilder";
import BotLanding from "./pages/BotLanding";
import Payment from "./pages/Payment";
import ThankYou from "./pages/ThankYou";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AccessGate from "./components/AccessGate";
import PromoPopup from "./components/PromoPopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PromoPopup />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/bots-guide" element={<BotsGuide />} />
          <Route path="/legends" element={<Legends />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/trading-basics" element={<TradingBasics />} />
          <Route path="/practice" element={<AccessGate><PracticeCase /></AccessGate>} />
          <Route path="/bot-builder" element={<AccessGate><BotBuilder /></AccessGate>} />
          <Route path="/bot-landing" element={<BotLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;