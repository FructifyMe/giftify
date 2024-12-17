-- Enable RLS
alter table gift_groups enable row level security;
alter table group_members enable row level security;
alter table group_invites enable row level security;