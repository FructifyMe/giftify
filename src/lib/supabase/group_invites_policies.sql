-- First, ensure the group_members table has the role column
alter table group_members add column if not exists role text not null default 'member';

-- Drop existing policies
drop policy if exists "Users can view invites for their email" on group_invites;
drop policy if exists "Group admins can manage invites" on group_invites;
drop policy if exists "Group creators can create invites" on group_invites;
drop policy if exists "Allow insert for authenticated users" on group_invites;

-- Enable RLS
alter table group_invites enable row level security;

-- Policy for creating invites (group admins only)
create policy "Allow group admins to create invites"
on group_invites for insert
with check (
  exists (
    select 1 from group_members
    where group_members.group_id = group_invites.group_id
    and group_members.user_id = auth.uid()
    and group_members.role = 'admin'
  )
);

-- Policy for viewing invites
create policy "Allow viewing own invites"
on group_invites for select
using (
  created_by = auth.uid() or
  email = (
    select email from auth.users 
    where auth.users.id = auth.uid()
  )
);

-- Policy for deleting invites
create policy "Allow deleting own invites"
on group_invites for delete
using (created_by = auth.uid());

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on group_invites to authenticated;
grant all on group_members to authenticated;
grant all on gift_groups to authenticated;

-- Update existing group creators to be admins
update group_members
set role = 'admin'
where user_id in (
  select created_by from gift_groups
  where gift_groups.id = group_members.group_id
);
