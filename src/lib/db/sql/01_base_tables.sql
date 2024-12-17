-- Enable UUID extension
create extension if not exists "uuid-ossp";

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