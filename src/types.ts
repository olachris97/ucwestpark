export type EventCategory =
  | "Concerts"
  | "Sports"
  | "Festivals"
  | "Theatre & Shows"
  | "Comedy"
  | "Family Events"
  | "Other Events";

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  date: string; // ISO date
  time: string;
  venue: string;
  address: string;
  city: string; // "City, ST" — US only
  country: string; // "USA"
  startingPrice: number | null; // null => "Request Pricing"
  ticketsAvailable: number; // 0 => "Request Pricing" / sold out
  status: "on-sale" | "limited" | "request";
  featured: boolean;
}

export type RequestStatus = "Pending" | "Contacted" | "Confirmed" | "Closed" | "Cancelled";

export interface TicketRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  location: string;
  ticketQuantity: number;
  seatPreference: "any" | "best" | "specific";
  seatDetails?: string;
  budget: string;
  ticketType?: string;
  notes: string;
  status: RequestStatus;
  createdAt: string;
  kind: "ticket";
}

export interface CustomEventRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventName: string;
  artist: string;
  category: string;
  eventDate: string;
  city: string;
  venue: string;
  ticketQuantity: number;
  seatPreference: string;
  budget: string;
  flexibility: "flexible" | "somewhat" | "specific";
  notes: string;
  status: RequestStatus;
  createdAt: string;
  kind: "custom-event";
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  kind: "contact";
}

export type AnyRequest = TicketRequest | CustomEventRequest | ContactMessage;
