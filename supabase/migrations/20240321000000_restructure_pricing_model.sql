-- Drop usage_count and usage_limit columns and rename table to credits
alter table dictation_usage
drop column usage_count,
drop column usage_limit;

alter table dictation_usage
rename to credits;

-- Update handle_new_user function to give free initial credits
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create credits record with initial credits
  insert into public.credits (user_id, credits)
  values (new.id, 5);

  return new;
end;
$$ language plpgsql security definer;

-- Drop subscription-related tables and triggers
drop trigger if exists update_subscriptions_updated_at on subscriptions;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists subscriptions;