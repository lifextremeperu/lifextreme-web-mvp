export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  image: string;
  type: 'tour' | 'product' | 'retreat';
  quantity: number;
}

export interface Tour {
  id: number;
  title: string;
  location: string;
  department: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category?: 'adventure' | 'mistico' | 'cultural';
  tag?: string;
  tagColor?: string;
  difficulty?: string;
  difficultyColor?: string;
  duration?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  department?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  isRental?: boolean;
  rentalPrice?: string;
  category?: string;
  stock?: number;
}

export interface RetreatHouse {
  id: number;
  title: string;
  location: string;
  department: string;
  pricePerNight: number;
  capacity: number;
  bedrooms: number;
  rating: number;
  image: string;
  amenities: string[];
  description: string;
}

export interface Guide {
  id: number;
  name: string;
  location: string;
  department: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  languages: string[];
  certifications?: string[];
  specialties: { name: string; color: string }[];
}

export interface VRExperience {
  id: number;
  title: string;
  department: string; // Added department
  category: '360' | 'Interactive' | 'Drone'; // Added category
  description: string;
  duration: string;
  image: string;
  views?: number; // Added mock view count
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  role: 'user' | 'operator' | 'guide' | 'lodging';
  status: string;
  phone?: string;
  location?: string;
  bio?: string;

  // User Fields
  interests?: string[];

  // Operator/Lodging Fields
  businessName?: string;
  ruc?: string;
  website?: string;
  address?: string;

  // Guide Fields
  yearsExperience?: number;
  languages?: string[];
  certifications?: string[];

  // Lodging Specific
  amenities?: string[];
  lodgingType?: 'Hotel' | 'Hostel' | 'Lodge' | 'Glamping';
}

export interface Booking {
  id: string;
  tourTitle: string;
  date: string;
  status: 'Confirmado' | 'Pendiente' | 'Completado';
  price: number;
  image: string;
}