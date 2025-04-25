import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { apiRequest } from "@/lib/queryClient";

export default function OrderSummary() {
  const [, navigate] = useLocation();
  const { 
    customerInfo, 
    orderItems, 
    calculateSubtotal, 
    calculateVAT, 
    calculateTotal,
    resetOrder
  } = useOrder();
  const { toast } = useToast();
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Redirect if order items are not set
  useEffect(() => {
    if (orderItems.length === 0) {
      navigate("/product-selection");
    }
  }, [orderItems, navigate]);

  // Mutation for submitting order
  const orderMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          storeName: customerInfo.storeName,
          customerName: customerInfo.customerName || null,
          deliveryDate: customerInfo.deliveryDate,
          totalAmount: calculateTotal(),
          vatAmount: calculateVAT(),
          items: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal
          }))
        })
      });
    },
    onSuccess: () => {
      setOrderCompleted(true);
      toast({
        title: "Ordine confermato",
        description: "La tua ordinazione è stata inviata con successo!",
      });
    },
    onError: (error) => {
      console.error("Error submitting order:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova tra poco.",
        variant: "destructive",
      });
    }
  });

  const handleSubmitOrder = () => {
    orderMutation.mutate();
  };

  const handleNewOrder = () => {
    resetOrder();
    navigate("/");
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-green-600 text-white rounded-t-lg text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
            <CardTitle className="text-xl font-bold">Ordine Confermato!</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 text-center">
            <p className="mb-4">
              La tua ordinazione è stata inviata con successo.
              Riceverai presto una email di conferma.
            </p>
            
            <Button 
              onClick={handleNewOrder}
              className="bg-amber-600 hover:bg-amber-700 w-full mt-4"
            >
              Crea un nuovo ordine
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/product-selection")}
              disabled={orderMutation.isPending}
            >
              <ChevronLeft size={16} />
              Torna ai Prodotti
            </Button>
            
            <div className="text-right">
              <h2 className="font-semibold">{customerInfo.storeName}</h2>
              <p className="text-sm text-gray-500">
                Consegna: {format(new Date(customerInfo.deliveryDate), "d MMMM yyyy", { locale: it })}
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">Riepilogo Ordine</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Informazioni Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Nome Negozio</p>
                      <p className="font-medium">{customerInfo.storeName}</p>
                    </div>
                    {customerInfo.customerName && (
                      <div>
                        <p className="text-gray-500">Ordinato da</p>
                        <p className="font-medium">{customerInfo.customerName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">Data di Consegna</p>
                      <p className="font-medium">
                        {format(new Date(customerInfo.deliveryDate), "EEEE d MMMM yyyy", { locale: it })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Prodotti Ordinati</h3>
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div 
                        key={item.productId} 
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-6 md:col-span-7">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} pz x € {item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="col-span-6 md:col-span-5 text-right">
                          <p className="font-bold">€ {item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Subtotale</p>
                    <p className="font-medium">€ {calculateSubtotal().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <p>IVA (10%)</p>
                    <p>€ {calculateVAT().toFixed(2)}</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <p>Totale</p>
                    <p>€ {calculateTotal().toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-6 border-t">
              <Button 
                onClick={handleSubmitOrder}
                disabled={orderMutation.isPending}
                className="w-full md:w-auto bg-amber-600 hover:bg-amber-700"
              >
                {orderMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  "Conferma Ordine"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}