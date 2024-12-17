import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const priceAlertSchema = z.object({
  targetPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
});

type PriceAlertFormData = z.infer<typeof priceAlertSchema>;

interface PriceAlertProps {
  itemId: string;
  currentPrice: number;
}

export function PriceAlert({ itemId, currentPrice }: PriceAlertProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PriceAlertFormData>({
    resolver: zodResolver(priceAlertSchema),
    defaultValues: {
      targetPrice: currentPrice.toString(),
    },
  });

  const onSubmit = async (data: PriceAlertFormData) => {
    try {
      // TODO: Implement price alert creation in the database
      toast({
        title: 'Price Alert Set',
        description: `We'll notify you when the price drops below $${data.targetPrice}`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set price alert',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Set Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
          <DialogDescription>
            We'll notify you when the price drops below your target price.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="targetPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Set Alert</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}