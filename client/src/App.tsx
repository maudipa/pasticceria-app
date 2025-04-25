import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CustomerInfo from "@/pages/CustomerInfo";
import ProductSelection from "@/pages/ProductSelection";
import OrderSummary from "@/pages/OrderSummary";
import { OrderProvider } from "@/context/OrderContext";

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/">
        <CustomerInfo />
      </Route>
      <Route path="/product-selection">
        <ProductSelection />
      </Route>
      <Route path="/order-summary">
        <OrderSummary />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrderProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </OrderProvider>
    </QueryClientProvider>
  );
}

export default App;
