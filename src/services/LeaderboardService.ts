import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  total_questions: number;
  topic: string;
  difficulty: string;
  credits: number;
  created_at: string;
}

export async function saveScore(entry: Omit<LeaderboardEntry, 'id' | 'created_at'>) {
  const { error } = await supabase.from('leaderboard').insert(entry);
  if (error) {
    console.error('Failed to save score:', error);
    throw error;
  }
}

export async function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch leaderboard:', error);
    throw error;
  }
  return (data ?? []) as LeaderboardEntry[];
}
