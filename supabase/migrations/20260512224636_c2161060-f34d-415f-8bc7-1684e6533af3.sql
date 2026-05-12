DROP POLICY IF EXISTS "Anyone can insert scores" ON public.leaderboard;
CREATE POLICY "Authenticated insert leaderboard"
  ON public.leaderboard FOR INSERT TO authenticated WITH CHECK (true);