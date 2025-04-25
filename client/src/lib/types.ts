export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface KnowledgeBase {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  categoryId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: number;
  customerName: string;
  customerEmail: string;
  message: string;
  status: string;
  assignedTo?: number;
  responseId?: number;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  userId: number;
  action: string;
  resourceType: string;
  resourceId: number;
  details: any;
  createdAt: string;
}

export interface Stats {
  id: number;
  date: string;
  inquiriesToday: number;
  autoResponseRate: number;
  pendingInquiries: number;
  kbArticles: number;
}
