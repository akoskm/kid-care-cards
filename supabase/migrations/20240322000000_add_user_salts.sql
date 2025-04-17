-- Create user_salts table
create table user_salts (
  user_id uuid references auth.users(id) primary key,
  salt text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table user_salts enable row level security;

-- Create RLS policies
create policy "Users can view their own salt"
  on user_salts for select
  using (auth.uid() = user_id);

-- Modify handle_new_user function to include salt generation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
SET search_path = public, pg_catalog
as $$
declare
  new_salt text;
begin
  -- Generate a random salt
  new_salt := encode(extensions.gen_random_bytes(32), 'hex');

  -- Create user_salts record
  insert into public.user_salts (user_id, salt)
  values (new.id, new_salt);

  -- Create credits record with initial credits
  insert into public.credits (user_id, credits)
  values (new.id, 5);

  return new;
end;
$$ security definer;