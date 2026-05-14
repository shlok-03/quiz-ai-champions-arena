import { createClient } from '@supabase/supabase-js';

// External Supabase project — used ONLY for the `quiz_results` table.
// All other data (auth, quizzes, scores, profiles) continues to use the
// Lovable Cloud client at `@/integrations/supabase/client`.
const EXTERNAL_SUPABASE_URL = 'https://sbzsrkgmiuoyfpdtwzty.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNienNya2dtaXVveWZwZHR3enR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNzA2OTcsImV4cCI6MjA5Mzk0NjY5N30.2pkebXTi2wbjY44IrvUAB8-Y4Cg61jBmhFyfoKSacjc';

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface QuizResultRow {
  id?: string;
  player_name: string;
  score: number;
  total_questions: number;
  category: string;
  created_at?: string;
}

export async function insertQuizResult(row: Omit<QuizResultRow, 'id' | 'created_at'>) {
  const { error } = await externalSupabase.from('quiz_results').insert(row);
  if (error) {
    console.error('Failed to insert quiz_results:', error);
    throw error;
  }
}

export async function fetchQuizResults(limit = 100): Promise<QuizResultRow[]> {
  const { data, error } = await externalSupabase
    .from('quiz_results')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Failed to fetch quiz_results:', error);
    throw error;
  }
  return (data ?? []) as QuizResultRow[];
}

export async function updateQuizResult(
  id: string,
  updates: Partial<Pick<QuizResultRow, 'player_name' | 'score' | 'category'>>
) {
  const { error } = await externalSupabase.from('quiz_results').update(updates).eq('id', id);
  if (error) {
    console.error('Failed to update quiz_results:', error);
    throw error;
  }
}

export async function deleteQuizResult(id: string) {
  const { error } = await externalSupabase.from('quiz_results').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete quiz_results:', error);
    throw error;
  }
}
