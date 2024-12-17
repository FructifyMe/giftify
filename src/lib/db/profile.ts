import { supabase } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    avatarUrl: data.avatar_url,
    notifications: data.notifications,
    visibility: data.visibility,
  } as UserProfile;
}

export async function searchProfiles(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
    .eq('visibility', 'public')
    .limit(10);

  if (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }

  return data.map(profile => ({
    id: profile.id,
    username: profile.username,
    email: profile.email,
    avatarUrl: profile.avatar_url,
    notifications: profile.notifications,
    visibility: profile.visibility,
  })) as UserProfile[];
}