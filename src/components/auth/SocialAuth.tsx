import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signInWithProvider } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export function SocialAuth() {
  const { toast } = useToast();

  const handleGithubSignIn = async () => {
    try {
      const { error } = await signInWithProvider('github');
      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGithubSignIn}>
      <Github className="mr-2 h-4 w-4" />
      Github
    </Button>
  );
}