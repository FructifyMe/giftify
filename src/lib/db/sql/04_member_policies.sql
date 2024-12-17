-- Group members policies
create policy "Users can view members of their groups"
  on group_members for select
  using (
    exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id
      and gm.user_id = auth.uid()
    )
  );

create policy "Group admins can add members"
  on group_members for insert
  with check (
    exists (
      select 1 from group_members
      where group_members.group_id = new.group_id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
    or 
    exists (
      select 1 from group_invites
      where group_invites.group_id = new.group_id
      and group_invites.email = (
        select email from auth.users where id = auth.uid()
      )
      and group_invites.expires_at > now()
    )
  );

create policy "Group admins can update members"
  on group_members for update
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = group_id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

create policy "Group admins can remove members"
  on group_members for delete
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = group_id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );