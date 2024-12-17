import { Users, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InviteDialog } from './InviteDialog';
import type { GiftGroup } from '@/lib/db/groups';
import { formatDistanceToNow } from 'date-fns';

interface GroupCardProps {
  group: GiftGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{group.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {group.description && (
          <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>Created {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}</span>
          </div>
          <InviteDialog groupId={group.id}>
            <Button size="sm" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </InviteDialog>
        </div>
      </CardContent>
    </Card>
  );
}