import { supabase } from '@/lib/supabase/client';

export async function createPriceAlert(
  userId: string,
  itemId: string,
  targetPrice: number
) {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert([
      {
        user_id: userId,
        item_id: itemId,
        target_price: targetPrice,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating price alert:', error);
    throw error;
  }

  return data;
}

export async function getPriceHistory(itemId: string) {
  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('item_id', itemId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }

  return data.map(record => ({
    date: record.created_at,
    price: record.price,
  }));
}

export async function updateItemPrice(
  itemId: string,
  newPrice: number,
  isOnSale: boolean = false
) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .update({
      price: newPrice,
      is_on_sale: isOnSale,
      sale_price: isOnSale ? newPrice : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating item price:', error);
    throw error;
  }

  // Record price history
  const { error: historyError } = await supabase
    .from('price_history')
    .insert([
      {
        item_id: itemId,
        price: newPrice,
        is_sale_price: isOnSale,
      },
    ]);

  if (historyError) {
    console.error('Error recording price history:', historyError);
    throw historyError;
  }

  return data;
}