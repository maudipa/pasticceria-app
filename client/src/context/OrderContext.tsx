import { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface OrderItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface CustomerInfo {
  storeName: string;
  customerName?: string;
  deliveryDate: Date;
}

interface OrderContextType {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  orderItems: OrderItem[];
  addOrderItem: (item: OrderItem) => void;
  updateOrderItem: (productId: number, quantity: number) => void;
  removeOrderItem: (productId: number) => void;
  calculateSubtotal: () => number;
  calculateVAT: () => number;
  calculateTotal: () => number;
  resetOrder: () => void;
}

const defaultCustomerInfo: CustomerInfo = {
  storeName: '',
  customerName: '',
  deliveryDate: new Date()
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(defaultCustomerInfo);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addOrderItem = (item: OrderItem) => {
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.productId === item.productId
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + item.quantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          subtotal: newQuantity * existingItem.unitPrice
        };
        
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  const updateOrderItem = (productId: number, quantity: number) => {
    setOrderItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity,
            subtotal: quantity * item.unitPrice
          };
        }
        return item;
      });
    });
  };

  const removeOrderItem = (productId: number) => {
    setOrderItems((prevItems) => 
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.1; // 10% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const resetOrder = () => {
    setCustomerInfo(defaultCustomerInfo);
    setOrderItems([]);
  };

  return (
    <OrderContext.Provider
      value={{
        customerInfo,
        setCustomerInfo,
        orderItems,
        addOrderItem,
        updateOrderItem,
        removeOrderItem,
        calculateSubtotal,
        calculateVAT,
        calculateTotal,
        resetOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}