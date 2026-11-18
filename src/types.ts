export type PortfolioCategory =
  | 'Bridal Mehndi'
  | 'Portrait Mehndi'
  | 'Arabic Mehndi'
  | 'Engagement Mehndi'
  | 'Custom Mehndi Designs';

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'Bridal Mehndi',
  'Portrait Mehndi',
  'Arabic Mehndi',
  'Engagement Mehndi',
  'Custom Mehndi Designs',
];

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  caption: string;
  featured: boolean;
  sortOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ServiceItem {
  id: string;
  title: string;
  summary: string;
  duration: string;
  startingPrice: string;
  imageUrl: string;
  highlights: string[];
  active: boolean;
  sortOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  customerName: string;
  phone: string;
  serviceId: string;
  serviceTitle: string;
  eventDate: string;
  eventLocation: string;
  preferredTime: string;
  requirements: string;
  status: BookingStatus;
  adminNotes: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SiteProfile {
  artistName: string;
  studioLocation: string;
  artistBio: string;
  artistImageUrl: string;
  whatsappNumber: string;
  instagramHandle: string;
  seeded: boolean;
  updatedAt?: unknown;
}

export const FIELD_LIMITS = {
  customerNameMin: 2,
  customerNameMax: 80,
  phoneMin: 8,
  phoneMax: 20,
  eventLocationMin: 2,
  eventLocationMax: 160,
  requirementsMax: 600,
  adminNotesMax: 400,
  titleMin: 2,
  titleMax: 100,
  captionMax: 240,
  summaryMin: 10,
  summaryMax: 320,
  imageUrlMax: 500000,
} as const;
