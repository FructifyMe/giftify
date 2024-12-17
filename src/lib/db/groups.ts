import { supabase } from '@/lib/supabase/client';
import { nanoid } from 'nanoid';

export interface GiftGroup {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
}

export interface GroupMember {
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface GroupInvite {
  id: string;
  groupId: string;
  email: string;
  inviteCode: string;
  expiresAt: string;
  createdAt: string;
}

export async function createGroup(name: string, description?: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('gift_groups')
    .insert({
      name,
      description,
      created_by: user.user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Add creator as admin
  await supabase.from('group_members').insert({
    group_id: data.id,
    user_id: user.user.id,
    role: 'admin',
  });

  return data;
}

export async function getUserGroups() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('group_members')
    .select(`
      group_id,
      role,
      gift_groups (
        id,
        name,
        description,
        created_by,
        created_at
      )
    `)
    .eq('user_id', user.user.id);

  if (error) throw error;
  return data;
}

export async function inviteToGroup(groupId: string, email: string) {
  const inviteCode = nanoid(12);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('group_invites')
    .insert({
      group_id: groupId,
      email,
      invite_code: inviteCode,
      expires_at: expiresAt.toISOString(),
      created_by: user.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acceptInvite(inviteCode: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  // Get and validate invite
  const { data: invite, error: inviteError } = await supabase
    .from('group_invites')
    .select('*')
    .eq('invite_code', inviteCode)
    .single();

  if (inviteError || !invite) throw new Error('Invalid invite code');
  if (new Date(invite.expires_at) < new Date()) throw new Error('Invite expired');

  // Add user to group
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({
      group_id: invite.group_id,
      user_id: user.user.id,
      role: 'member',
    });

  if (memberError) throw memberError;

  // Delete used invite
  await supabase
    .from('group_invites')
    .delete()
    .eq('id', invite.id);

  return true;
}