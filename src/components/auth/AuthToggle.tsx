interface AuthToggleProps {
  isSignUp: boolean;
  onToggle: () => void;
}

export function AuthToggle({ isSignUp, onToggle }: AuthToggleProps) {
  return (
    <p className="text-center text-sm">
      {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
      <button
        type="button"
        onClick={onToggle}
        className="font-semibold text-primary hover:underline"
      >
        {isSignUp ? 'Sign in' : 'Create one'}
      </button>
    </p>
  );
}