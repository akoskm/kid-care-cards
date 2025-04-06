-- Create function to safely increment credits
create or replace function increment_credits(user_id uuid, amount integer)
returns integer as $$
declare
  current_credits integer;
begin
  -- Get current credits
  select credits into current_credits
  from public.credits
  where user_id = $1;

  -- If no record exists, create one with initial credits
  if current_credits is null then
    insert into public.credits (user_id, credits)
    values ($1, 5 + $2)
    returning credits into current_credits;
  else
    -- Update existing credits
    update public.credits
    set credits = credits + $2
    where user_id = $1
    returning credits into current_credits;
  end if;

  return current_credits;
end;
$$ language plpgsql security definer;