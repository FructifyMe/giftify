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

  try {
    // First, create the group
    const { data: groupData, error: groupError } = await supabase
      .from('gift_groups')
      .insert({
        name,
        description,
        created_by: user.user.id,
      })
      .select()
      .single();

    if (groupError) {
      console.error('Error creating group:', groupError);
      throw new Error(groupError.message);
    }

    if (!groupData) {
      throw new Error('Failed to create group');
    }

    // Then, add the creator as an admin member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupData.id,
        user_id: user.user.id,
        role: 'admin',
      });

    if (memberError) {
      console.error('Error adding group member:', memberError);
      // Try to clean up the group if member creation fails
      await supabase.from('gift_groups').delete().eq('id', groupData.id);
      throw new Error(memberError.message);
    }

    return {
      id: groupData.id,
      name: groupData.name,
      description: groupData.description,
      createdBy: groupData.created_by,
      createdAt: groupData.created_at,
    };
  } catch (error) {
    console.error('Error in createGroup:', error);
    throw error;
  }
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
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  // First get the group name
  const { data: group } = await supabase
    .from('gift_groups')
    .select('name')
    .eq('id', groupId)
    .single();

  if (!group) throw new Error('Group not found');

  // Create the invite record
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

  // Send the email via Edge Function
  const { error: emailError } = await supabase.functions.invoke('send-group-invite', {
    body: {
      email,
      groupName: group.name,
      inviteCode
    }
  });

  if (emailError) {
    console.error('Error sending invite email:', emailError);
    // Optionally delete the invite if email fails
    await supabase
      .from('group_invites')
      .delete()
      .eq('id', data.id);
    throw new Error('Failed to send invite email');
  }

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