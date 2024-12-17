-- Create gift_groups table
create table if not exists gift_groups (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create gift_group_members table
create table if not exists gift_group_members (
  group_id uuid references gift_groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, user_id)
);

-- Enable RLS for new tables
alter table gift_groups enable row level security;
alter table gift_group_members enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Gift groups are viewable by their members" on gift_groups;
drop policy if exists "Users can create gift groups" on gift_groups;
drop policy if exists "Only creators can update their gift groups" on gift_groups;
drop policy if exists "Only creators can delete their gift groups" on gift_groups;
drop policy if exists "Group members are viewable by group members" on gift_group_members;
drop policy if exists "Group creators can manage members" on gift_group_members;

-- Gift groups policies
create policy "Gift groups are viewable by their members"
  on gift_groups for select
  using (
    exists (
      select 1 from gift_group_members
      where gift_group_members.group_id = gift_groups.id
      and gift_group_members.user_id = auth.uid()
    )
    or creator_id = auth.uid()
  );

create policy "Users can create gift groups"
  on gift_groups for insert
  with check (auth.uid() = creator_id);

create policy "Only creators can update their gift groups"
  on gift_groups for update
  using (auth.uid() = creator_id);

create policy "Only creators can delete their gift groups"
  on gift_groups for delete
  using (auth.uid() = creator_id);

-- Gift group members policies
create policy "Group members are viewable by group members"
  on gift_group_members for select
  using (
    exists (
      select 1 from gift_group_members as gm
      where gm.group_id = gift_group_members.group_id
      and gm.user_id = auth.uid()
    )
  );

create policy "Group creators can manage members"
  on gift_group_members for all
  using (
    exists (
      select 1 from gift_groups
      where gift_groups.id = gift_group_members.group_id
      and gift_groups.creator_id = auth.uid()
    )
  );
