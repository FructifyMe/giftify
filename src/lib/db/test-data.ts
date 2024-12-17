import { supabase } from '@/lib/supabase/client';
import type { WishlistItem } from '@/types';

export async function createTestUser(email: string, password: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Error creating test user:', authError);
    throw authError;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      username: email.split('@')[0],
      visibility: 'public',
    })
    .eq('id', authData.user?.id);

  if (profileError) {
    console.error('Error updating profile:', profileError);
    throw profileError;
  }

  return authData.user;
}

export async function createTestWishlistItem(userId: string, item: Partial<WishlistItem>) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .insert([
      {
        user_id: userId,
        title: item.title || 'Test Item',
        description: item.description || 'Test Description',
        price: item.price || 99.99,
        image_url: item.imageUrl || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop',
        product_url: item.productUrl || 'https://www.amazon.com/dp/B07ZPKBL9V',
        is_claimed: item.isClaimed || false,
        is_on_sale: item.isOnSale || false,
        sale_price: item.salePrice || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating test wishlist item:', error);
    throw error;
  }

  return data;
}