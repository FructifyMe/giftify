-- Create price_history table
create table if not exists price_history (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references wishlist_items(id) on delete cascade,
  price decimal(10,2) not null,
  is_sale_price boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create price_alerts table
create table if not exists price_alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  item_id uuid references wishlist_items(id) on delete cascade,
  target_price decimal(10,2) not null,
  is_triggered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table price_history enable row level security;
alter table price_alerts enable row level security;

-- Price history policies
create policy "Price history is viewable by everyone"
  on price_history for select
  using (true);

-- Price alerts policies
create policy "Users can view their own price alerts"
  on price_alerts for select
  using (auth.uid() = user_id);

create policy "Users can create their own price alerts"
  on price_alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own price alerts"
  on price_alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own price alerts"
  on price_alerts for delete
  using (auth.uid() = user_id);