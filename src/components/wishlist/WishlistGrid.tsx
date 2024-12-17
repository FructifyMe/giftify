import { Gift } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { WishlistCard } from './WishlistCard';
import { AddWishlistDialog } from './AddWishlistDialog';
import { EmptyState } from '@/components/ui/empty-state';
import { WishlistSkeleton } from './WishlistSkeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';

interface WishlistGridProps {
  userId?: string;
}

export function WishlistGrid({ userId }: WishlistGridProps) {
  const { items, isLoading, error, claim } = useWishlist();
  const { toast } = useToast();
  const currentUser = useAuthStore((state) => state.user);
  const isOwnWishlist = !userId || userId === currentUser?.id;

  const handleClaim = async (itemId: string) => {
    try {
      await claim(itemId);
      toast({
        title: 'Success',
        description: 'Item has been claimed successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <WishlistSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Gift}
        title="Error loading wishlist"
        description="There was an error loading your wishlist. Please try again later."
        className="h-[50vh]"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isOwnWishlist && <AddWishlistDialog />}
      {items.map((item) => (
        <WishlistCard 
          key={item.id} 
          item={item} 
          onClaim={() => handleClaim(item.id)}
        />
      ))}
      {items.length === 0 && (
        <div className="col-span-full">
          <EmptyState
            icon={Gift}
            title="No items found"
            description={isOwnWishlist ? "Start by adding items to your wishlist" : "This user hasn't added any items yet"}
            className="h-[300px]"
          />
        </div>
      )}
    </div>
  );
}