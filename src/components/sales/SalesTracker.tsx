import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getAmazonPrice, extractAmazonAsin } from '@/lib/services/retailers/amazon';
import { useWishlist } from '@/hooks/use-wishlist';
import { updateWishlistItem } from '@/lib/db/wishlist';

export function SalesTracker() {
  const { items } = useWishlist();
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [priceDrops, setPriceDrops] = useState<Array<{
    title: string;
    originalPrice: number;
    currentPrice: number;
  }>>([]);
  const { toast } = useToast();

  const checkPrices = useCallback(async () => {
    if (!items.length || isChecking) return;
    setIsChecking(true);
    const drops = [];

    for (const item of items) {
      if (!item.productUrl) continue;

      try {
        const asin = extractAmazonAsin(item.productUrl);
        if (!asin) continue;

        const currentPrice = await getAmazonPrice(asin);
        if (!currentPrice) continue;

        // Only process if we found a lower price
        if (currentPrice < item.price) {
          await updateWishlistItem(item.id, {
            ...item,
            isOnSale: true,
            salePrice: currentPrice
          });

          drops.push({
            title: item.title,
            originalPrice: item.price,
            currentPrice
          });

          // Show toast for price drop
          toast({
            title: 'Price Drop Alert! 🎉',
            description: `${item.title} price dropped from $${item.price} to $${currentPrice}!`,
          });
          
          // Break the loop after finding a price drop
          break;
        }
      } catch (error) {
        console.error(`Error checking price for ${item.title}:`, error);
      }
    }
    
    setPriceDrops(drops);
    setLastChecked(new Date());
    setIsChecking(false);
  }, [items, isChecking, toast]);

  // Only check prices on manual refresh
  const handleRefresh = () => {
    if (!isChecking) {
      checkPrices();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Price Tracking
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Prices
          </Button>
        </CardHeader>
        <CardContent>
          {isChecking ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Checking current prices...</span>
            </div>
          ) : priceDrops.length > 0 ? (
            <div className="space-y-4">
              {priceDrops.map((drop, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium">{drop.title}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-sm line-through text-muted-foreground">
                        ${drop.originalPrice.toFixed(2)}
                      </span>
                      <TrendingDown className="h-4 w-4 mx-2 text-destructive" />
                      <span className="text-lg font-bold text-destructive">
                        ${drop.currentPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Badge variant="destructive">
                    {Math.round(((drop.originalPrice - drop.currentPrice) / drop.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-2">
                Click "Check Prices" to scan your wishlist items for price drops.
              </p>
              {lastChecked && (
                <p className="text-xs text-muted-foreground">
                  Last checked: {lastChecked.toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}