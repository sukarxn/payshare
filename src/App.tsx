
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  // <QueryClientProvider client={queryClient}>
  //   <AuthProvider>
  //     <TooltipProvider>
  //       <Toaster />
  //       <Sonner />
  //       <BrowserRouter>
  //         <Routes>
  //           <Route path="/" element={<Index />} />
  //           <Route path="*" element={<NotFound />} />
  //         </Routes>
  //       </BrowserRouter>
  //     </TooltipProvider>
  //   </AuthProvider>
  // </QueryClientProvider>
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  </div>
);

export default App;
