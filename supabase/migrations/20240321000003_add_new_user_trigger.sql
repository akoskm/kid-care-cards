-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create credits record with initial credits
  insert into public.credits (user_id, credits)
  values (new.id, 5);

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();