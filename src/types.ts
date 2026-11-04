export type CraftCategory = 
  | 'Leather' 
  | 'Copper & Brass' 
  | 'Ceramics & Zellige' 
  | 'Textiles & Carpets' 
  | 'Cedar Wood' 
  | 'Spices & Natural Cosmetics' 
  | 'Jewelry & Antiques';

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string;
  image_type: 'product' | 'thumbnail' | 'gallery';
}

export interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number; // in MAD (Moroccan Dirham)
  seller_id: number;
  souk_id: number;
  category: CraftCategory;
  stock: number;
  low_stock_threshold: number;
  sku: string;
  images: ProductImage[];
  featured?: boolean;
}

export interface Seller {
  id: number;
  name: string;
  artisan_title_en: string;
  artisan_title_ar: string;
  contact_info: string; // WhatsApp / Phone
  souk_id: number;
  profile_image: string;
  workshop_location: string;
  bio_en: string;
  bio_ar: string;
  years_active: number;
  verified: boolean;
  rating: number;
}

export interface Souk {
  id: number;
  name_en: string;
  name_ar: string;
  category: string;
  location: string;
  city_name_en: string;
  city_name_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
  artisan_count?: number;
}

export interface SaleEvent {
  id: string;
  product_id: number;
  product_name_en: string;
  product_name_ar: string;
  seller_id: number;
  seller_name: string;
  souk_id: number;
  souk_name: string;
  quantity: number;
  unit_price: number;
  total_mad: number;
  timestamp: string;
  customer_name: string;
  customer_country: string;
  payment_method: 'Cash in Souk' | 'Direct Transfer' | 'WhatsApp Order' | 'International Card';
}

export interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  product_id?: number;
  message: string;
  created_at: string;
  status: 'new' | 'replied' | 'archived';
}

export interface AppUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'moderator' | 'artisan';
  active: boolean;
  seller_id?: number;
}

export interface AnalyticsSummary {
  totalRevenueMAD: number;
  todaySalesMAD: number;
  totalUnitsSold: number;
  totalStockRemaining: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeArtisansCount: number;
  activeProductsCount: number;
  topSellingCategories: { category: string; revenue: number; units: number }[];
  topSellers: { seller_id: number; seller_name: string; revenue: number; units: number }[];
  soukBreakdown: { souk_name: string; revenue: number; percentage: number }[];
  recentHourlyTrend: { time: string; revenue: number }[];
}
