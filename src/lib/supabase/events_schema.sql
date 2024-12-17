-- Events table schema documentation
/*
Table: events
Columns:
  id uuid default uuid_generate_v4() primary key,
  created_by uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  group_id uuid references gift_groups(id) on delete cascade

Related Tables:
- gift_groups: Events can be associated with a group via group_id
- group_events: Links events to groups
- group_event_participants: Tracks participants for group events

Security:
- Row Level Security (RLS) is enabled
- Policies:
  1. Users can view events they created or are part of via group membership
  2. Users can create events
  3. Users can update their own events
  4. Users can delete their own events
*/
