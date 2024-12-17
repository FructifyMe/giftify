-- Group invites policies
create policy "Users can view invites for their email"
  on group_invites for select
  using (
    email = (
      select email from auth.users
      where auth.users.id = auth.uid()
    )
  );

create policy "Group admins can manage invites"
  on group_invites for all
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = group_invites.group_id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );