import { useState } from "react";
import { useLocation } from "wouter";
import { useOrder } from "@/context/OrderContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  storeName: z.string().min(2, {
    message: "Il nome del negozio deve contenere almeno 2 caratteri",
  }),
  customerName: z.string().optional(),
  deliveryDate: z.date({
    required_error: "Seleziona una data di consegna",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CustomerInfo() {
  const [, navigate] = useLocation();
  const { customerInfo, setCustomerInfo } = useOrder();
  const { toast } = useToast();
  const [isDateOpen, setIsDateOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: customerInfo.storeName || "",
      customerName: customerInfo.customerName || "",
      deliveryDate: customerInfo.deliveryDate || new Date(),
    },
  });

  const onSubmit = (data: FormValues) => {
    setCustomerInfo({
      storeName: data.storeName,
      customerName: data.customerName,
      deliveryDate: data.deliveryDate,
    });
    
    toast({
      title: "Informazioni salvate",
      description: "Procediamo con la selezione dei prodotti",
    });
    
    navigate("/product-selection");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">Ordinazione Prodotti da Forno</CardTitle>
          <CardDescription className="text-amber-100">
            Inserisci i dati del tuo negozio
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome del Punto Vendita*</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il nome del negozio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome di chi effettua l'ordine (opzionale)</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il tuo nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data di Consegna*</FormLabel>
                    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "EEEE d MMMM yyyy", { locale: it })
                            ) : (
                              <span>Seleziona una data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsDateOpen(false);
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  Avanti
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-gray-500">
            * Campi obbligatori
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}