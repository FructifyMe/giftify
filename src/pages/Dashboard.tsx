import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Calendar, Tag, Users } from 'lucide-react';
import { WishlistGrid } from '@/components/wishlist/WishlistGrid';
import { WishlistHeader } from '@/components/wishlist/WishlistHeader';
import { SalesTracker } from '@/components/sales/SalesTracker';
import { GroupList } from '@/components/groups/GroupList';
import { getProfile } from '@/lib/db/profile';
import { useAuthStore } from '@/store/auth';

export function Dashboard() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleRoute = async () => {
      const path = window.location.pathname;
      const match = path.match(/\/wishlist\/(.+)/);
      
      if (match) {
        const userId = match[1];
        try {
          const profile = await getProfile(userId);
          setCurrentUserId(userId);
          setCurrentUsername(profile.username || null);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setCurrentUserId(user?.id || null);
          setCurrentUsername(null);
        }
      } else {
        setCurrentUserId(user?.id || null);
        setCurrentUsername(null);
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [user]);

  return (
    <div className="container mx-auto px-4 pt-20 pb-8">
      <Tabs defaultValue="wishlists" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="wishlists" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Wishlists</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Sales</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wishlists">
          <WishlistHeader userId={currentUserId || undefined} username={currentUsername || undefined} />
          <WishlistGrid userId={currentUserId || undefined} />
        </TabsContent>

        <TabsContent value="groups">
          <GroupList />
        </TabsContent>

        <TabsContent value="events">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="text-gray-600">Event management features are under development.</p>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <SalesTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}