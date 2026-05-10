ALTER TABLE public.quizzes ADD COLUMN player_name TEXT;
CREATE INDEX IF NOT EXISTS idx_quizzes_player_name ON public.quizzes(player_name);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_at ON public.quizzes(created_at DESC);