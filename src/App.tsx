import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "@/components/app-layout";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Trips from "./pages/Trips.tsx";
import PackageBookings from "./pages/PackageBookings.tsx";
import HotelBookings from "./pages/HotelBookings.tsx";
import Leads from "./pages/Leads.tsx";
import Customers from "./pages/Customers.tsx";
import Orders from "./pages/Orders.tsx";
import Tasks from "./pages/Tasks.tsx";
import Accounting from "./pages/Accounting.tsx";
import Services from "./pages/Services.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/package-bookings" element={<PackageBookings />} />
              <Route path="/hotel-bookings" element={<HotelBookings />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/services" element={<Services />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
