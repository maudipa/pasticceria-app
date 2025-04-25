import {
  products, orders, orderItems,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Products
  getProduct(id: number): Promise<Product | undefined>;
  listProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  
  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  listOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined>;
  getOrderWithItems(orderId: number): Promise<{ order: Order, items: (OrderItem & { product: Product })[] } | undefined>;
  
  // Order Items
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async listProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const now = new Date();
    const [newProduct] = await db.insert(products)
      .values({
        ...product,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const now = new Date();
    const [updatedProduct] = await db.update(products)
      .set({
        ...updates,
        updatedAt: now
      })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async listOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const now = new Date();
    const [newOrder] = await db.insert(orders)
      .values({
        ...order,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined> {
    const now = new Date();
    const [updatedOrder] = await db.update(orders)
      .set({
        ...updates,
        updatedAt: now
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrderWithItems(orderId: number): Promise<{ order: Order, items: (OrderItem & { product: Product })[] } | undefined> {
    const order = await this.getOrder(orderId);
    if (!order) return undefined;

    const items = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await this.getProduct(item.productId);
        return { ...item, product: product! };
      })
    );

    return {
      order,
      items: itemsWithProducts
    };
  }

  // Order Items
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems)
      .values(orderItem)
      .returning();
    return newOrderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }
}

// Initialize database with sample products if needed
async function initializeProducts() {
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length === 0) {
    const sampleProducts = [
      {
        name: "Pane Casereccio",
        description: "Pane rustico tradizionale fatto a mano",
        price: 3.50,
        imageUrl: "/images/pane-casereccio.jpg"
      },
      {
        name: "Focaccia Genovese",
        description: "Focaccia morbida con olio e sale marino",
        price: 4.00,
        imageUrl: "/images/focaccia.jpg"
      },
      {
        name: "Panettone Tradizionale",
        description: "Dolce lievitato con uvetta e canditi",
        price: 18.50,
        imageUrl: "/images/panettone.jpg"
      },
      {
        name: "Cornetto Vuoto",
        description: "Cornetto soffice e fragrante",
        price: 1.20,
        imageUrl: "/images/cornetto.jpg"
      },
      {
        name: "Pane di Segale",
        description: "Pane integrale di segale con semi vari",
        price: 4.20,
        imageUrl: "/images/pane-segale.jpg"
      }
    ];
    
    for (const product of sampleProducts) {
      await db.insert(products).values({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
}

// Initialize the database
initializeProducts().catch(console.error);

export const storage = new DatabaseStorage();
