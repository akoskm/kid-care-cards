-- Generate salts for existing users
do $$
declare
  user_record record;
begin
  for user_record in select id from auth.users
  where not exists (select 1 from user_salts where user_id = id)
  loop
    insert into user_salts (user_id, salt)
    values (user_record.id, encode(extensions.gen_random_bytes(32), 'hex'));
  end loop;
end $$;