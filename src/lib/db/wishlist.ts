import { supabase } from '@/lib/supabase/client';
import type { WishlistItem } from '@/types';

export async function getWishlistItems(userId: string) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist items:', error);
    return { error };
  }

  const items = data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    price: item.price,
    imageUrl: item.image_url || '',
    productUrl: item.product_url || '',
    isClaimed: item.is_claimed,
    isOnSale: item.is_on_sale,
    salePrice: item.sale_price,
    userId: item.user_id,
    createdAt: item.created_at,
  }));

  return { data: items };
}

export async function createWishlistItem(item: Omit<WishlistItem, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .insert([{
      user_id: item.userId,
      title: item.title,
      description: item.description,
      price: item.price,
      image_url: item.imageUrl,
      product_url: item.productUrl,
      is_claimed: item.isClaimed,
      is_on_sale: item.isOnSale,
      sale_price: item.salePrice,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating wishlist item:', error);
    return { error };
  }

  return {
    data: {
      id: data.id,
      title: data.title,
      description: data.description || '',
      price: data.price,
      imageUrl: data.image_url || '',
      productUrl: data.product_url || '',
      isClaimed: data.is_claimed,
      isOnSale: data.is_on_sale,
      salePrice: data.sale_price,
      userId: data.user_id,
      createdAt: data.created_at,
    } as WishlistItem,
  };
}

export async function updateWishlistItem(id: string, updates: Partial<WishlistItem>) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .update({
      title: updates.title,
      description: updates.description,
      price: updates.price,
      image_url: updates.imageUrl,
      product_url: updates.productUrl,
      is_claimed: updates.isClaimed,
      is_on_sale: updates.isOnSale,
      sale_price: updates.salePrice,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating wishlist item:', error);
    return { error };
  }

  return {
    data: {
      id: data.id,
      title: data.title,
      description: data.description || '',
      price: data.price,
      imageUrl: data.image_url || '',
      productUrl: data.product_url || '',
      isClaimed: data.is_claimed,
      isOnSale: data.is_on_sale,
      salePrice: data.sale_price,
      userId: data.user_id,
      createdAt: data.created_at,
    } as WishlistItem,
  };
}