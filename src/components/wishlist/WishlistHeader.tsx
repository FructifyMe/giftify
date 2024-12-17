import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/hooks/use-navigate';
import { searchProfiles } from '@/lib/db/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface WishlistHeaderProps {
  userId?: string;
  username?: string;
}

export function WishlistHeader({ userId, username }: WishlistHeaderProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; username: string; email: string }>>([]);
  const navigate = useNavigate();

  const handleSearch = async (value: string) => {
    if (value.length < 2) return;
    try {
      const results = await searchProfiles(value);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSelectUser = (userId: string) => {
    setOpen(false);
    navigate(`/wishlist/${userId}`);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">
          {username ? `${username}'s Wishlist` : 'My Wishlist'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[250px] justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search users...
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="end">
            <Command>
              <CommandInput 
                placeholder="Type a username..." 
                onValueChange={handleSearch}
              />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.username}
                      onSelect={() => handleSelectUser(user.id)}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>
                          {user.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.username}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}