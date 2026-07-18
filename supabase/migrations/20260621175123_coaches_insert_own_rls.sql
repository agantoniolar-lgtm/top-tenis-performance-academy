CREATE POLICY "coaches_insert_own"
  ON coaches FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
