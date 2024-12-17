import { Gift, Calendar, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';

const features = [
  {
    icon: Gift,
    title: 'Wishlist Management',
    description: 'Create and manage your wishlists with ease. Add items, track prices, and share with friends and family.',
  },
  {
    icon: Calendar,
    title: 'Event Planning',
    description: 'Organize special occasions and celebrations. Keep track of important dates and manage gift preferences.',
  },
  {
    icon: Tag,
    title: 'Deal Tracking',
    description: 'Never miss a sale on your wishlist items. Get notified when prices drop on your favorite products.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 animate-float">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Welcome to Giftify</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Make Gift-Giving 
              <span className="block mt-2">
                Simple & Delightful
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Create, manage, and share wishlists for any occasion. Track prices, organize events,
              and make every celebration special.
            </p>
            <AuthModal trigger={
              <Button size="lg" className="text-lg px-8 gradient-primary hover:opacity-90 transition-all duration-300 animate-glow">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            } />
          </div>

          {/* Feature Preview Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-40 -bottom-1" />
            <img
              src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=2400&auto=format&fit=crop&q=80"
              alt="Gift Registry Preview"
              className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full object-cover animate-float"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-secondary opacity-5" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need for Perfect Gift-Giving
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-effect p-8 rounded-2xl hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Gift Registry?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who make gift-giving a breeze with our platform.
          </p>
          <AuthModal trigger={
            <Button size="lg" className="text-lg px-8 gradient-secondary hover:opacity-90 transition-all duration-300">
              Create Your Registry
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          } />
        </div>
      </section>
    </div>
  );
}