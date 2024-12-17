import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AuthForm } from './AuthForm';

interface AuthModalProps {
  trigger?: React.ReactNode;
}

export function AuthModal({ trigger }: AuthModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button>Sign In</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Giftify</DialogTitle>
          <DialogDescription>
            Sign in to manage your wishlists and track prices.
          </DialogDescription>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}