export interface SiteContent {
  section: string;
  key: string;
  value: string;
}

export interface ContentMap {
  [section: string]: { [key: string]: string };
}

export interface Offer {
  id: string;
  sort_order: number;
  duration: string;
  description: string;
  price: string;
  price_note: string;
  is_featured: boolean;
}

export interface OfferExtra {
  id: string;
  sort_order: number;
  label: string;
  title: string;
  description: string;
  price: string;
  price_note: string;
}

export interface MethodStep {
  id: string;
  sort_order: number;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  sort_order: number;
  quote: string;
  author: string;
  role: string;
  avatar_url?: string | null;
  date_label?: string | null;
  rating?: number | null;
}

export interface FaqItem {
  id: string;
  sort_order: number;
  question: string;
  answer: string;
}
