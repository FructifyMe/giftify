export interface WishlistItem {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  productUrl: string;
  isClaimed: boolean;
  isOnSale: boolean;
  salePrice?: number;
  createdAt: string;
  userId: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  userId: string;
  wishlists: WishlistItem[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  notifications: boolean;
  visibility: 'public' | 'private' | 'friends';
}