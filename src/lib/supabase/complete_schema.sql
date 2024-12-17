-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (if not exists)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  email text unique not null,
  avatar_url text,
  notifications boolean default true,
  visibility text check (visibility in ('public', 'private', 'friends')) default 'public',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create wishlist_items table (if not exists)
create table if not exists wishlist_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  product_url text,
  is_claimed boolean default false,
  is_on_sale boolean default false,
  sale_price decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create gift_groups table (if not exists)
create table if not exists gift_groups (
  id uuid default uuid_generate_v4() primary key,
  created_by uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create group_members table (if not exists)
create table if not exists group_members (
  group_id uuid references gift_groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, user_id)
);

-- Create group_invites table (if not exists)
create table if not exists group_invites (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references gift_groups on delete cascade not null,
  email text not null,
  role text check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table wishlist_items enable row level security;
alter table gift_groups enable row level security;
alter table group_members enable row level security;
alter table group_invites enable row level security;

-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

drop policy if exists "Wishlist items are viewable by everyone" on wishlist_items;
drop policy if exists "Users can insert their own wishlist items" on wishlist_items;
drop policy if exists "Users can update their own wishlist items" on wishlist_items;
drop policy if exists "Users can delete their own wishlist items" on wishlist_items;

drop policy if exists "Users can view groups they are members of" on gift_groups;
drop policy if exists "Users can create groups" on gift_groups;
drop policy if exists "Group admins can update their groups" on gift_groups;
drop policy if exists "Group admins can delete their groups" on gift_groups;

drop policy if exists "Users can view group members" on group_members;
drop policy if exists "Group admins can manage members" on group_members;

drop policy if exists "Users can view invites for their email" on group_invites;
drop policy if exists "Group admins can manage invites" on group_invites;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (visibility = 'public');

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Wishlist items policies
create policy "Wishlist items are viewable by everyone"
  on wishlist_items for select
  using (true);

create policy "Users can insert their own wishlist items"
  on wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own wishlist items"
  on wishlist_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own wishlist items"
  on wishlist_items for delete
  using (auth.uid() = user_id);

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
      where group_members_1.group_id = group_members.group_id
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

-- Function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user profiles
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
