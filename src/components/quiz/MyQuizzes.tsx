import React, { useEffect, useState } from 'react';
import { History, Loader2 } from 'lucide-react';
import { getQuizzesByPlayer, SavedQuiz } from '@/services/QuizService';

interface MyQuizzesProps {
  playerName: string;
  onSelect?: (quiz: SavedQuiz) => void;
}

const difficultyColor: Record<string, string> = {
  easy: 'text-success',
  medium: 'text-warning',
  hard: 'text-destructive',
};

const MyQuizzes: React.FC<MyQuizzesProps> = ({ playerName, onSelect }) => {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const name = playerName.trim();
    if (!name) {
      setQuizzes([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getQuizzesByPlayer(name)
      .then((data) => {
        if (!cancelled) setQuizzes(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [playerName]);

  if (!playerName.trim()) return null;

  return (
    <div className="glass-strong rounded-2xl p-5 mt-5 animate-slide-in-bottom">
      <div className="flex items-center gap-2 mb-3">
        <History className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold font-display text-foreground/90">
          My Quizzes
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : quizzes.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No quizzes yet. Generate your first one!
        </p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {quizzes.map((q) => (
            <li
              key={q.id}
              className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-2 hover:bg-muted/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{q.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {q.question_count} questions ·{' '}
                  <span className={difficultyColor[q.difficulty] ?? ''}>{q.difficulty}</span>
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground ml-3 whitespace-nowrap">
                {new Date(q.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyQuizzes;
