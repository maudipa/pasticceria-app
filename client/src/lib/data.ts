import { Category, FAQ, KnowledgeBase, User } from "./types";

export const defaultUser: User = {
  id: 1,
  username: "admin",
  name: "Sarah Johnson",
  email: "sarah@eventassist.com",
  role: "admin",
  createdAt: new Date().toISOString(),
};

export const defaultCategories: Category[] = [
  { id: 1, name: "Ticket Information" },
  { id: 2, name: "Venue Details" },
  { id: 3, name: "Event Schedule" },
  { id: 4, name: "Refunds" },
  { id: 5, name: "Accessibility" },
];

export const defaultFaqs: FAQ[] = [
  {
    id: 1,
    question: "Is there parking available at the venue?",
    answer: "Yes, there is parking available at the venue. The main parking lot is located on the north side of the building, and additional parking can be found across the street.",
    categoryId: 2,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    question: "What time do doors open for the event?",
    answer: "Doors open at 6:30 PM. We recommend arriving at least 30 minutes early to allow time for security checks and finding your seats.",
    categoryId: 3,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    question: "How can I request a refund?",
    answer: "Refunds can be requested up to 48 hours before the event through your ticket purchase account. After that time, refunds are not available except in special circumstances.",
    categoryId: 4,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    question: "Are there accessible seating options?",
    answer: "Yes, we offer accessible seating options. Please contact us at access@eventassist.com with your specific requirements, and we'll arrange appropriate accommodations.",
    categoryId: 5,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const defaultKnowledgeBase: KnowledgeBase[] = [
  {
    id: 1,
    title: "VIP Check-in Procedures",
    content: "VIP attendees should arrive at the designated VIP entrance located on the west side of the venue. Please have your VIP ticket and ID ready for verification. VIP check-in opens 90 minutes before the main doors.",
    categoryId: 1,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Venue Map and Facilities",
    content: "The venue offers multiple seating sections, concessions, restrooms, and first aid stations. Refer to the venue map in the app for exact locations. All facilities are clearly marked and accessible.",
    categoryId: 2,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
