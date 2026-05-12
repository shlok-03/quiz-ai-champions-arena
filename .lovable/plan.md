## Goal
Add real user accounts so each score is tied to a verified user, then build a leaderboard page that joins `scores` + `quizzes` + the signed-in user's email, sorted by score descending.

## 1. Authentication
- Add **email/password** signup & login, plus **Google** sign-in (Lovable Cloud managed).
- New `/auth` page with sign in / sign up tabs.
- Auth state managed via `onAuthStateChange` + `getSession` in a `useAuth` hook.
- Quiz flow gated: unauthenticated users on `/` are redirected to `/auth`.
- Header gets a "Sign out" button + shows the user's email.
- Email auto-confirm **enabled** so testing is frictionless (can be turned off later).

## 2. Database changes
- New `profiles` table: `id` (PK = auth user id), `email`, `display_name`, timestamps.
  - Trigger on `auth.users` insert auto-creates a profile row (copies email).
  - RLS: anyone authenticated can read profiles (needed so leaderboard can show others' emails); only the owner can update their own.
- Add `user_id uuid` to `scores` (nullable for backfill, but new inserts require it).
- Add `user_id uuid` to `quizzes` (nullable, new inserts populated from session).
- RLS rewrite:
  - `scores`: insert only if `auth.uid() = user_id`; select open to authenticated users (leaderboard is shared).
  - `quizzes` / `questions`: insert only if `auth.uid() = user_id` (questions via parent quiz check); select open to authenticated.
  - `leaderboard` table is no longer used — leaderboard now reads from `scores`. Keep table but stop writing to it (or drop later).

## 3. Code changes
- `src/hooks/useAuth.tsx` — session + user, loading state.
- `src/pages/Auth.tsx` — login/signup forms (email + Google button).
- `src/components/ProtectedRoute.tsx` — wraps `/` and `/leaderboard`.
- `src/services/QuizService.ts` — pass `user.id` into `quizzes` insert and `scores` insert; remove the parallel `saveScore` to `leaderboard`.
- `src/pages/Leaderboard.tsx` — new route `/leaderboard`. Fetches:
  ```
  scores
    .select('id, score, total_questions, credits, difficulty, created_at,
             quizzes(topic), profiles(email, display_name)')
    .order('score', { ascending: false })
  ```
  Renders a table with: rank, email, quiz topic, score, difficulty, credits, date.
- Update `App.tsx` routes: `/auth`, `/`, `/leaderboard`.
- Replace existing in-game `Leaderboard` component link to navigate to `/leaderboard`.

## Out of scope
- Roles / admin.
- Editing or deleting old anonymous rows (they'll just have `user_id = null` and won't show an email).
- Password reset page (can add later).

## Order of execution
1. Run DB migration (profiles + trigger + user_id columns + RLS rewrite).
2. Enable Google social auth + auto-confirm email.
3. Build auth hook, Auth page, protected route, header sign-out.
4. Update QuizService to write `user_id`.
5. Build new Leaderboard page with the join.
6. Verify end-to-end by signing up, playing a quiz, and viewing the leaderboard.
