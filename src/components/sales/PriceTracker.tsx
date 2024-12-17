import { useEffect, useState } from 'react';
import { startPriceTracking } from '@/lib/services/price-tracking';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';

export function PriceTracker() {
  const { items } = useWishlist();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const trackPrices = async () => {
      if (isChecking || !items.length) return;
      
      setIsChecking(true);
      try {
        await startPriceTracking(
          items.map(item => ({
            id: item.id,
            productUrl: item.productUrl,
            price: item.price
          }))
        );
      } catch (error) {
        console.error('Error tracking prices:', error);
        toast({
          title: 'Error',
          description: 'Failed to check prices. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsChecking(false);
      }
    };

    // Check prices every 30 minutes
    trackPrices();
    const interval = setInterval(trackPrices, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [items, isChecking]);

  return null;
}