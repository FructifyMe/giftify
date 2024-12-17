-- Create gift_groups table
create table if not exists gift_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create group_members table
create table if not exists group_members (
  group_id uuid references gift_groups on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('admin', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, user_id)
);

-- Create group_invites table
create table if not exists group_invites (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references gift_groups on delete cascade,
  email text not null,
  invite_code text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users on delete cascade not null
);

-- Enable RLS
alter table gift_groups enable row level security;
alter table group_members enable row level security;
alter table group_invites enable row level security;

-- RLS Policies
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

-- Group members policies (Fixed)
create policy "Users can view members of their groups"
  on group_members for select
  using (
    auth.uid() in (
      select user_id from group_members as gm
      where gm.group_id = group_members.group_id
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
      where group_members.group_id = group_members.group_id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

create policy "Group admins can remove members"
  on group_members for delete
  using (
    exists (
      select 1 from group_members
      where group_members.group_id = group_members.group_id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

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