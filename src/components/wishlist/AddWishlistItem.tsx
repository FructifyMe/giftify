import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WishlistForm } from './WishlistForm';

export function AddWishlistItem() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full h-[300px] border-dashed hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          <Plus className="h-6 w-6 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Wishlist Item</DialogTitle>
          <DialogDescription>
            Add a new item to your wishlist. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <WishlistForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}