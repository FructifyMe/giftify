import { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserGroups } from '@/lib/db/groups';
import { CreateGroupDialog } from './CreateGroupDialog';
import { GroupCard } from './GroupCard';
import type { GiftGroup } from '@/lib/db/groups';

export function GroupList() {
  const [groups, setGroups] = useState<GiftGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getUserGroups();
        setGroups(data.map(item => ({
          id: item.gift_groups.id,
          name: item.gift_groups.name,
          description: item.gift_groups.description,
          createdBy: item.gift_groups.created_by,
          createdAt: item.gift_groups.created_at,
        })));
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Gift Groups
            </CardTitle>
            <CreateGroupDialog onGroupCreated={(group) => setGroups(prev => [...prev, group])} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading groups...</div>
          ) : groups.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create a group to share wishlists with family and friends.
              </p>
              <CreateGroupDialog
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Group
                  </Button>
                }
                onGroupCreated={(group) => setGroups([group])}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}