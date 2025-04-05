-- Create dictation_usage table
create table dictation_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  usage_count integer default 0,
  usage_limit integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create subscriptions table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_type text check (subscription_type in ('monthly', 'annual')),
  status text check (status in ('active', 'canceled', 'past_due')),
  trial_start_date timestamp with time zone,
  trial_end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_dictation_usage_updated_at
  before update on dictation_usage
  for each row
  execute function update_updated_at_column();

create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row
  execute function update_updated_at_column();

-- Create RLS policies
alter table dictation_usage enable row level security;
alter table subscriptions enable row level security;

create policy "Users can view their own dictation usage"
  on dictation_usage for select
  using (auth.uid() = user_id);

create policy "Users can view their own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- Create function to initialize user data
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create dictation usage record
  insert into public.dictation_usage (user_id)
  values (new.id);

  -- Create subscription record with trial
  insert into public.subscriptions (
    user_id,
    trial_start_date,
    trial_end_date
  )
  values (
    new.id,
    now(),
    now() + interval '14 days'
  );

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();