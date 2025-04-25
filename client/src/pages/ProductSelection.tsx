import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function ProductSelection() {
  const [, navigate] = useLocation();
  const { customerInfo, orderItems, addOrderItem, updateOrderItem, calculateSubtotal } = useOrder();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Redirect if customer info is not set
  useEffect(() => {
    if (!customerInfo.storeName || !customerInfo.deliveryDate) {
      navigate("/");
    }
  }, [customerInfo, navigate]);

  // Fetch products from API
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products'],
  });

  // Initialize quantities from existing order items
  useEffect(() => {
    if (orderItems.length > 0) {
      const initialQuantities: { [key: number]: number } = {};
      orderItems.forEach(item => {
        initialQuantities[item.productId] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [orderItems]);

  const handleQuantityChange = (productId: number, value: string) => {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 0) return;
    
    setQuantities({
      ...quantities,
      [productId]: quantity,
    });
  };

  const incrementQuantity = (productId: number) => {
    const currentQuantity = quantities[productId] || 0;
    setQuantities({
      ...quantities,
      [productId]: currentQuantity + 1,
    });
  };

  const decrementQuantity = (productId: number) => {
    const currentQuantity = quantities[productId] || 0;
    if (currentQuantity === 0) return;
    
    setQuantities({
      ...quantities,
      [productId]: currentQuantity - 1,
    });
  };

  const handleAddToOrder = (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity <= 0) return;
    
    addOrderItem({
      productId: product.id,
      product,
      quantity,
      unitPrice: product.price,
      subtotal: product.price * quantity,
    });
    
    toast({
      title: "Prodotto aggiunto",
      description: `${quantity} x ${product.name} aggiunto all'ordine`,
    });
  };

  const handleNext = () => {
    // Check if there are any products in the order
    if (orderItems.length === 0) {
      toast({
        title: "Nessun prodotto selezionato",
        description: "Seleziona almeno un prodotto per procedere",
        variant: "destructive",
      });
      return;
    }
    
    navigate("/order-summary");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <ChevronLeft size={16} />
              Indietro
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
              <CardTitle className="text-xl font-bold flex justify-between items-center">
                <span>Seleziona i Prodotti</span>
                {orderItems.length > 0 && (
                  <Badge className="bg-white text-amber-800 hover:bg-amber-100">
                    {orderItems.reduce((acc, item) => acc + item.quantity, 0)} prodotti
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Si è verificato un errore nel caricamento dei prodotti.
                </div>
              ) : (
                <div className="grid gap-4">
                  {products?.map((product: Product) => (
                    <div 
                      key={product.id} 
                      className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-center"
                    >
                      <div className="md:col-span-3">
                        <h3 className="font-medium text-lg">{product.name}</h3>
                        <p className="text-gray-500 text-sm">{product.description}</p>
                      </div>
                      
                      <div className="md:col-span-1 font-bold text-lg">
                        € {product.price.toFixed(2)}
                      </div>
                      
                      <div className="md:col-span-2 flex gap-2 items-center">
                        <div className="flex items-center">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => decrementQuantity(product.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={quantities[product.id] || 0}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => incrementQuantity(product.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          type="button" 
                          className="bg-amber-600 hover:bg-amber-700 font-medium"
                          disabled={(quantities[product.id] || 0) === 0}
                          onClick={() => handleAddToOrder(product)}
                        >
                          Aggiungi
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between py-6 border-t">
              <div className="text-lg font-medium">
                Totale Parziale: <span className="font-bold">€ {calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={handleNext}
                className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                disabled={orderItems.length === 0}
              >
                Procedi al riepilogo
                <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
          
          {orderItems.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-amber-600" />
                  <div>
                    <span className="font-medium">
                      {orderItems.reduce((acc, item) => acc + item.quantity, 0)} prodotti
                    </span>
                    <span className="text-gray-500 mx-2">|</span>
                    <span className="font-bold">€ {calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleNext}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Procedi
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}