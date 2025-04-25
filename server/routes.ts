import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import { z } from "zod";
import sgMail from '@sendgrid/mail';

// Email settings
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'orders@bakery.com';
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const products = await storage.listProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  app.post('/api/products', async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid product data', errors: error.errors });
      }
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  });

  // Orders
  app.get('/api/orders', async (req: Request, res: Response) => {
    try {
      const orders = await storage.listOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const orderWithItems = await storage.getOrderWithItems(id);
      
      if (!orderWithItems) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(orderWithItems);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Failed to fetch order' });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const orderItems = req.body.items || [];
      
      if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ message: 'Order must include at least one item' });
      }

      // Create order
      const order = await storage.createOrder(orderData);
      
      // Create order items
      const savedItems = [];
      for (const item of orderItems) {
        const orderItem = {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        };
        
        const savedItem = await storage.createOrderItem(orderItem);
        savedItems.push(savedItem);
      }
      
      // Send email notification if SendGrid API key is available
      if (process.env.SENDGRID_API_KEY) {
        try {
          const orderWithItems = await storage.getOrderWithItems(order.id);
          await sendOrderConfirmationEmail(orderWithItems);
        } catch (emailError) {
          console.error('Failed to send order confirmation email:', emailError);
        }
      }
      
      res.status(201).json({
        order,
        items: savedItems
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid order data', errors: error.errors });
      }
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  });

  app.patch('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const updatedOrder = await storage.updateOrder(id, req.body);
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Failed to update order' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to send order confirmation email
async function sendOrderConfirmationEmail(orderData: any) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid API key not configured. Email would be sent here.');
    return;
  }

  const { order, items } = orderData;
  
  // Format items for email
  const itemsList = items.map((item: any) => {
    return `${item.product.name} - ${item.quantity} pcs x €${item.unitPrice.toFixed(2)} = €${item.subtotal.toFixed(2)}`;
  }).join('\n');
  
  // Format date
  const deliveryDate = new Date(order.deliveryDate).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  const msg = {
    to: NOTIFICATION_EMAIL,
    from: 'noreply@bakeryapp.com',
    subject: `Nuovo ordine da ${order.storeName}`,
    text: `
    Dettagli Ordine #${order.id}
    
    Negozio: ${order.storeName}
    Data di consegna: ${deliveryDate}
    ${order.customerName ? 'Ordine effettuato da: ' + order.customerName : ''}
    
    PRODOTTI ORDINATI:
    ${itemsList}
    
    Subtotale: €${(order.totalAmount - order.vatAmount).toFixed(2)}
    IVA (10%): €${order.vatAmount.toFixed(2)}
    TOTALE: €${order.totalAmount.toFixed(2)}
    
    Stato dell'ordine: ${order.status}
    `,
    html: `
    <h2>Dettagli Ordine #${order.id}</h2>
    <p><strong>Negozio:</strong> ${order.storeName}</p>
    <p><strong>Data di consegna:</strong> ${deliveryDate}</p>
    ${order.customerName ? '<p><strong>Ordine effettuato da:</strong> ' + order.customerName + '</p>' : ''}
    
    <h3>PRODOTTI ORDINATI:</h3>
    <ul>
      ${items.map((item: any) => `
        <li>${item.product.name} - ${item.quantity} pcs x €${item.unitPrice.toFixed(2)} = €${item.subtotal.toFixed(2)}</li>
      `).join('')}
    </ul>
    
    <p><strong>Subtotale:</strong> €${(order.totalAmount - order.vatAmount).toFixed(2)}</p>
    <p><strong>IVA (10%):</strong> €${order.vatAmount.toFixed(2)}</p>
    <p><strong>TOTALE:</strong> €${order.totalAmount.toFixed(2)}</p>
    
    <p><strong>Stato dell'ordine:</strong> ${order.status}</p>
    `
  };

  await sgMail.send(msg);
}
