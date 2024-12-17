import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tag } from 'lucide-react';

interface SaleNotificationProps {
  itemTitle: string;
  originalPrice: number;
  salePrice: number;
}

export function SaleNotification({ itemTitle, originalPrice, salePrice }: SaleNotificationProps) {
  const { toast } = useToast();
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  useEffect(() => {
    toast({
      title: 'Price Drop Alert! 🎉',
      description: (
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4" />
          <span>
            {itemTitle} is now {discount}% off! 
            <br />
            New price: ${salePrice} (was ${originalPrice})
          </span>
        </div>
      ),
    });
  }, []);

  return null;
}