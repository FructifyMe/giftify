import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SalesBadgeProps {
  originalPrice: number;
  salePrice: number;
  className?: string;
}

export function SalesBadge({ originalPrice, salePrice, className }: SalesBadgeProps) {
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  return (
    <Badge variant="destructive" className={cn('animate-pulse', className)}>
      <Tag className="h-3 w-3 mr-1" />
      {discount}% OFF
    </Badge>
  );
}