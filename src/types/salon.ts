export interface SalonSettings {
  salonName: string;
  heroTagline: string;
  heroDescription: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  instagramUrl: string;
  googleMapsUrl: string;
  hoursMonSat: string;
  hoursSun: string;
  googleRating: string;
  googleReviewsCount: string;
  logoType: 'image' | 'typography';
  logoUrl: string;
  announcement: string;
  adminEmail: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export interface SalonService {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  price: string; // e.g. "Sur demande", "À partir de 150 DH", "Sur demande"
  duration?: string;
  isPopular?: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'tous' | 'coiffure' | 'ongles' | 'pedicure' | 'soins' | 'salon';
  categoryLabel: string;
  imageUrl: string;
  description?: string;
  order: number;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  rating: number; // 5
  text: string;
  date: string;
  serviceTag?: string;
  isFeatured?: boolean;
}

export interface BookingRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
