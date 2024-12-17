-- Events table to store gift-giving occasions
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  group_id uuid references gift_groups(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table events enable row level security;

-- Users can view events they created or are part of via group membership
create policy "Users can view their own events and events in their groups"
  on events for select
  using (
    auth.uid() = created_by
    or
    group_id in (
      select gift_groups.id
      from gift_groups
      inner join group_members on group_members.group_id = gift_groups.id
      where group_members.user_id = auth.uid()
    )
  );

-- Users can create events
create policy "Users can create events"
  on events for insert
  with check (auth.uid() = created_by);

-- Users can update their own events
create policy "Users can update their own events"
  on events for update
  using (auth.uid() = created_by);

-- Users can delete their own events
create policy "Users can delete their own events"
  on events for delete
  using (auth.uid() = created_by);
