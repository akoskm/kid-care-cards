create or replace function public.decrement_credits(p_user_id uuid)
returns integer
language plpgsql
set search_path = ''
as $$
declare
    current_credits integer;
begin
    -- Get current credits
    select credits into current_credits
    from public.credits
    where user_id = p_user_id;

  -- If no record exists or no credits, return 0
    if current_credits is null or current_credits <= 0 then
        return 0;
    end if;

  -- Update credits
    update public.credits
    set credits = credits - 1
    where user_id = p_user_id
    returning credits into current_credits;

    return current_credits;
end;
$$;