-- Gift Groups policies
create policy "Users can view groups they are members of"
  on gift_groups for select
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = id
      and group_members.user_id = auth.uid()
    )
  );

create policy "Users can create groups"
  on gift_groups for insert
  with check (auth.uid() = created_by);

create policy "Group admins can update their groups"
  on gift_groups for update
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

create policy "Group admins can delete their groups"
  on gift_groups for delete
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );