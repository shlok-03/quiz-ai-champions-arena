import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, ArrowLeft, Crown, Medal, Award } from 'lucide-react';
import { fetchQuizResults, QuizResultRow } from '@/integrations/external-supabase';

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-300" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground text-sm font-mono w-5 text-center">{index + 1}</span>;
  };

  const getDifficultyColor = (d: string) => {
    if (d === 'easy') return 'text-green-400';
    if (d === 'hard') return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <Trophy className="h-8 w-8 text-accent animate-float" />
          <h1 className="text-3xl font-bold font-display text-foreground">Leaderboard</h1>
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-6 animate-slide-in-bottom">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading scores...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No scores yet. Be the first!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-12 text-muted-foreground">#</TableHead>
                  <TableHead className="text-muted-foreground">Player</TableHead>
                  <TableHead className="text-muted-foreground">Topic</TableHead>
                  <TableHead className="text-center text-muted-foreground">Score</TableHead>
                  <TableHead className="text-center text-muted-foreground">Difficulty</TableHead>
                  <TableHead className="text-right text-muted-foreground">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, i) => (
                  <TableRow key={entry.id} className="border-border/30 hover:bg-primary/5">
                    <TableCell className="py-3">{getRankIcon(i)}</TableCell>
                    <TableCell className="font-semibold text-foreground">{entry.player_name}</TableCell>
                    <TableCell className="text-primary">{entry.topic}</TableCell>
                    <TableCell className="text-center font-bold text-foreground">
                      {entry.score}/{entry.total_questions}
                    </TableCell>
                    <TableCell className={`text-center capitalize font-medium ${getDifficultyColor(entry.difficulty)}`}>
                      {entry.difficulty}
                    </TableCell>
                    <TableCell className="text-right text-warning font-semibold">{entry.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 rounded-xl border-border/50 text-foreground hover:bg-primary/10 font-semibold animate-slide-in-bottom"
          style={{ animationDelay: '0.2s' }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Quiz
        </Button>
      </div>
    </div>
  );
};

export default Leaderboard;
