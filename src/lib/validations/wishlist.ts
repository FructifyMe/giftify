import * as z from 'zod';

export const wishlistItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  price: z.string().min(1, 'Price is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  productUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type WishlistFormData = z.infer<typeof wishlistItemSchema>;