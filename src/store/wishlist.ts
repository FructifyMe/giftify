import { create } from 'zustand';
import type { WishlistItem } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: Error | null;
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));