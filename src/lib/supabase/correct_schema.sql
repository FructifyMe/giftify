-- Create gift_groups table
create table if not exists gift_groups (
  id uuid default uuid_generate_v4() primary key,
  created_by uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create group_members table
create table if not exists group_members (
  group_id uuid references gift_groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, user_id)
);

-- Create group_invites table
create table if not exists group_invites (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references gift_groups on delete cascade not null,
  email text not null,
  role text check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table gift_groups enable row level security;
alter table group_members enable row level security;
alter table group_invites enable row level security;

-- Drop existing policies
drop policy if exists "Users can view groups they are members of" on gift_groups;
drop policy if exists "Users can create groups" on gift_groups;
drop policy if exists "Group admins can update their groups" on gift_groups;
drop policy if exists "Group admins can delete their groups" on gift_groups;
drop policy if exists "Users can view group members" on group_members;
drop policy if exists "Group admins can manage members" on group_members;
drop policy if exists "Users can view invites for their email" on group_invites;
drop policy if exists "Group admins can manage invites" on group_invites;

-- Gift groups policies
create policy "Users can view groups they are members of"
  on gift_groups for select
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = gift_groups.id
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
      where group_members.group_id = gift_groups.id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

create policy "Group admins can delete their groups"
  on gift_groups for delete
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = gift_groups.id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

-- Group members policies
create policy "Users can view group members"
  on group_members for select
  using (
    exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id
      and gm.user_id = auth.uid()
    )
  );

create policy "Group admins can manage members"
  on group_members for all
  using (
    exists (
      select 1 from group_members group_members_1
      where group_members_1.group_id = group_members_1.group_id
      and group_members_1.user_id = auth.uid()
      and group_members_1.role = 'admin'
    )
  );

-- Group invites policies
create policy "Users can view invites for their email"
  on group_invites for select
  using (
    email = (
      select email from auth.users where id = auth.uid()
    )::text
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
