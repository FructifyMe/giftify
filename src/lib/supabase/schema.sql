-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
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

-- Create wishlist_items table
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

-- Create events table
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- Create RLS policies
alter table profiles enable row level security;
alter table wishlist_items enable row level security;
alter table events enable row level security;
alter table gift_groups enable row level security;
alter table gift_group_members enable row level security;

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

-- Events policies
create policy "Events are viewable by everyone"
  on events for select
  using (true);

create policy "Users can insert their own events"
  on events for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own events"
  on events for update
  using (auth.uid() = user_id);

create policy "Users can delete their own events"
  on events for delete
  using (auth.uid() = user_id);

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
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();