import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import type { WishlistItem } from '@/types';
import { getWishlistItems, createWishlistItem, updateWishlistItem } from '@/lib/db/wishlist';

export function useWishlist() {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchItems() {
      setIsLoading(true);
      try {
        const { data, error } = await getWishlistItems(user.id);
        if (error) throw error;
        setItems(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching wishlist items:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, [user]);

  const create = async (item: Omit<WishlistItem, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await createWishlistItem({
      ...item,
      userId: user.id,
    });

    if (error) throw error;
    setItems((prev) => [data, ...prev]);
    return data;
  };

  const claim = async (itemId: string) => {
    const { data, error } = await updateWishlistItem(itemId, { isClaimed: true });
    if (error) throw error;
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? data : item))
    );
    return data;
  };

  return {
    items,
    isLoading,
    error,
    create,
    claim,
  };
}