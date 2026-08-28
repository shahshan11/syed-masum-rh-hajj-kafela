export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  durationDays: number;
  category: string;
  isFeatured: boolean;
  maxGroupSize: number;
  availableSeats: number;
  featuredImage?: string;
  includedServices?: string[];
  excludedServices?: string[];
}

export interface SpecialOffer {
  id: string;
  title: string;
  discountPercentage: number;
  code: string;
  validUntil: string;
  tourId?: string;
}

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  userEmail: string;
  tourTitle: string;
  bookingDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}