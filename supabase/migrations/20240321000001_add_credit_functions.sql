CREATE OR REPLACE FUNCTION public.increment_credits(p_user_id uuid, p_amount integer)
RETURNS integer
LANGUAGE plpgsql
SET search_path = ''
AS $$
declare
  current_credits integer;
begin
  -- Get current credits
  select credits into current_credits
  from public.credits
  where user_id = p_user_id;

  -- If no record exists, create one with initial credits
  if current_credits is null then
    insert into public.credits (user_id, credits)
    values (p_user_id, 5 + p_amount)
    returning credits into current_credits;
  else
    -- Update existing credits
    update public.credits
    set credits = credits + p_amount
    where user_id = p_user_id
    returning credits into current_credits;
  end if;

  return current_credits;
end;
$$;