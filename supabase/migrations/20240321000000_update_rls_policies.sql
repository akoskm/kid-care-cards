-- Update RLS policies for symptoms and solutions tables

-- Drop existing policies
drop policy if exists "Users can view their own symptoms" on symptoms;
drop policy if exists "Users can insert their own symptoms" on symptoms;
drop policy if exists "Users can update their own symptoms" on symptoms;
drop policy if exists "Users can delete their own symptoms" on symptoms;

drop policy if exists "Users can view their own solutions" on solutions;
drop policy if exists "Users can insert their own solutions" on solutions;
drop policy if exists "Users can update their own solutions" on solutions;
drop policy if exists "Users can delete their own solutions" on solutions;

-- Create new simplified policies for symptoms
create policy "Users can view their own symptoms"
  on symptoms for select
  using (auth.uid() = user_id);

create policy "Users can insert their own symptoms"
  on symptoms for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own symptoms"
  on symptoms for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own symptoms"
  on symptoms for delete
  using (auth.uid() = user_id);

-- Create new simplified policies for solutions
create policy "Users can view their own solutions"
  on solutions for select
  using (
    EXISTS (
      SELECT 1 FROM symptoms
      WHERE symptoms.id = solutions.symptom_id
      AND symptoms.user_id = auth.uid()
    )
  );

create policy "Users can insert their own solutions"
  on solutions for insert
  with check (
    EXISTS (
      SELECT 1 FROM symptoms
      WHERE symptoms.id = solutions.symptom_id
      AND symptoms.user_id = auth.uid()
    )
  );

create policy "Users can update their own solutions"
  on solutions for update
  using (
    EXISTS (
      SELECT 1 FROM symptoms
      WHERE symptoms.id = solutions.symptom_id
      AND symptoms.user_id = auth.uid()
    )
  )
  with check (
    EXISTS (
      SELECT 1 FROM symptoms
      WHERE symptoms.id = solutions.symptom_id
      AND symptoms.user_id = auth.uid()
    )
  );

create policy "Users can delete their own solutions"
  on solutions for delete
  using (
    EXISTS (
      SELECT 1 FROM symptoms
      WHERE symptoms.id = solutions.symptom_id
      AND symptoms.user_id = auth.uid()
    )
  );

-- Add update policy for subscriptions
create policy "Users can update their own subscription"
  on subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);