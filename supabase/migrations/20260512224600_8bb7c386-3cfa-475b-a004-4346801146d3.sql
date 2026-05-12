-- 1. profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 2. updated_at trigger fn (shared)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. add user_id to scores & quizzes
ALTER TABLE public.scores ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.quizzes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX scores_user_id_idx ON public.scores(user_id);
CREATE INDEX scores_quiz_id_idx ON public.scores(quiz_id);
CREATE INDEX quizzes_user_id_idx ON public.quizzes(user_id);

-- 5. tighten RLS on scores
DROP POLICY IF EXISTS "Anyone can insert scores" ON public.scores;
DROP POLICY IF EXISTS "Anyone can view scores" ON public.scores;

CREATE POLICY "Authenticated can view scores"
  ON public.scores FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users insert own scores"
  ON public.scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 6. tighten RLS on quizzes
DROP POLICY IF EXISTS "Anyone can insert quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Anyone can view quizzes" ON public.quizzes;

CREATE POLICY "Authenticated can view quizzes"
  ON public.quizzes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users insert own quizzes"
  ON public.quizzes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 7. tighten RLS on questions (insert only if parent quiz belongs to user)
DROP POLICY IF EXISTS "Anyone can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;

CREATE POLICY "Authenticated can view questions"
  ON public.questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users insert questions for own quizzes"
  ON public.questions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quizzes q
    WHERE q.id = quiz_id AND q.user_id = auth.uid()
  ));

-- 8. FK so PostgREST can embed profiles from scores
ALTER TABLE public.scores
  ADD CONSTRAINT scores_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.scores
  ADD CONSTRAINT scores_quiz_id_quizzes_fkey
  FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE SET NULL;