import { WishlistItem } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, ExternalLink, ImageOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { SalesBadge } from '@/components/sales/SalesBadge';
import { PriceAlert } from '@/components/sales/PriceAlert';

interface WishlistCardProps {
  item: WishlistItem;
  onClaim?: (id: string) => void;
}

export function WishlistCard({ item, onClaim }: WishlistCardProps) {
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.id === item.userId;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop';
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{item.title}</span>
          {item.isOnSale && item.salePrice && (
            <SalesBadge
              originalPrice={item.price}
              salePrice={item.salePrice}
              className="ml-2"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              onError={handleImageError}
              className="rounded-lg object-cover w-full h-full"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">
              ${item.isOnSale && item.salePrice ? item.salePrice : item.price}
            </span>
            {item.isOnSale && item.salePrice && (
              <span className="text-sm text-gray-500 line-through">
                ${item.price}
              </span>
            )}
          </div>
          {!isOwner && (
            <PriceAlert
              itemId={item.id}
              currentPrice={item.isOnSale && item.salePrice ? item.salePrice : item.price}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isOwner && (
          <Button
            variant={item.isClaimed ? "secondary" : "default"}
            disabled={item.isClaimed}
            onClick={() => onClaim?.(item.id)}
            className="flex-1 mr-2"
          >
            <Gift className="h-4 w-4 mr-2" />
            {item.isClaimed ? 'Claimed' : 'Claim Gift'}
          </Button>
        )}
        {item.productUrl && (
          <Button variant="outline" size="icon" asChild>
            <a href={item.productUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}