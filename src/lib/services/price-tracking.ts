import { getCurrentPrice } from './retailers';
import { updateItemPrice } from '@/lib/db/sales';
import { useToast } from '@/hooks/use-toast';

export async function checkPriceUpdates(itemId: string, productUrl: string, currentPrice: number) {
  if (!productUrl) return null;

  try {
    const newPrice = await getCurrentPrice(productUrl);
    
    if (newPrice && newPrice < currentPrice) {
      // Update item in database with new price
      await updateItemPrice(itemId, newPrice, true);

      return {
        isOnSale: true,
        newPrice,
        priceReduction: currentPrice - newPrice
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking price updates:', error);
    return null;
  }
}

export async function startPriceTracking(items: Array<{ id: string; productUrl: string; price: number }>) {
  const { toast } = useToast();

  for (const item of items) {
    if (!item.productUrl) continue;

    try {
      const result = await checkPriceUpdates(item.id, item.productUrl, item.price);
      
      if (result) {
        toast({
          title: 'Price Drop Alert! 🎉',
          description: `Price dropped by $${result.priceReduction.toFixed(2)}! New price: $${result.newPrice.toFixed(2)}`,
        });
      }
    } catch (error) {
      console.error(`Error checking price for item ${item.id}:`, error);
    }
  }
}