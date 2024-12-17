import { supabase } from './supabase';
import type { WishlistItem } from '@/types';

export async function createWishlistItem(item: Omit<WishlistItem, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .insert([{ ...item, created_at: new Date().toISOString() }])
    .select()
    .single();

  return { data, error };
}

export async function getWishlistItems(userId: string) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function updateWishlistItem(id: string, updates: Partial<WishlistItem>) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteWishlistItem(id: string) {
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', id);

  return { error };
}