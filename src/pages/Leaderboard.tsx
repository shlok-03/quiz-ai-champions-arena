import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, ArrowLeft, Crown, Medal, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Row {
  id: string;
  score: number;
  total_questions: number;
  credits: number;
  difficulty: string;
  created_at: string;
  topic: string;
  email: string | null;
  display_name: string | null;
}

const difficultyColor = (d: string) =>
  d === 'easy' ? 'text-green-400' : d === 'hard' ? 'text-red-400' : 'text-yellow-400';

const rankIcon = (i: number) => {
  if (i === 0) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (i === 1) return <Medal className="h-5 w-5 text-gray-300" />;
  if (i === 2) return <Award className="h-5 w-5 text-amber-600" />;
  return <span className="text-muted-foreground text-sm font-mono w-5 text-center">{i + 1}</span>;
};

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          id, score, total_questions, credits, difficulty, created_at,
          quizzes ( topic ),
          profiles ( email, display_name )
        `)
        .order('score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows(
          (data ?? []).map((r: any) => ({
            id: r.id,
            score: r.score,
            total_questions: r.total_questions,
            credits: r.credits,
            difficulty: r.difficulty,
            created_at: r.created_at,
            topic: r.quizzes?.topic ?? '—',
            email: r.profiles?.email ?? null,
            display_name: r.profiles?.display_name ?? null,
          }))
        );
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" />

      <div className="w-full max-w-4xl relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <Trophy className="h-8 w-8 text-accent animate-float" />
          <h1 className="text-3xl font-bold font-display text-foreground">Leaderboard</h1>
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-6 animate-slide-in-bottom overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading scores…
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No scores yet. Be the first!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-12 text-muted-foreground">#</TableHead>
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Quiz</TableHead>
                  <TableHead className="text-center text-muted-foreground">Score</TableHead>
                  <TableHead className="text-center text-muted-foreground">Difficulty</TableHead>
                  <TableHead className="text-right text-muted-foreground">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={r.id} className="border-border/30 hover:bg-primary/5">
                    <TableCell className="py-3">{rankIcon(i)}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex flex-col">
                        <span>{r.display_name ?? r.email ?? 'Anonymous'}</span>
                        {r.email && r.display_name && (
                          <span className="text-xs text-muted-foreground">{r.email}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-primary">{r.topic}</TableCell>
                    <TableCell className="text-center font-bold text-foreground">
                      {r.score}/{r.total_questions}
                    </TableCell>
                    <TableCell className={`text-center capitalize font-medium ${difficultyColor(r.difficulty)}`}>
                      {r.difficulty}
                    </TableCell>
                    <TableCell className="text-right text-warning font-semibold">{r.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Button onClick={() => navigate('/')} variant="outline" className="w-full h-12 rounded-xl">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Quiz
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardPage;
