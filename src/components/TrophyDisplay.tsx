import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw, Award, Heart, Skull, Sparkles } from 'lucide-react';

interface TrophyDisplayProps {
  playerName: string;
  score: number;
  totalQuestions: number;
  credits: number;
  topic: string;
  isPerfectScore: boolean;
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
  isGameOver?: boolean;
  lives: number;
}

const TrophyDisplay: React.FC<TrophyDisplayProps> = ({
  playerName,
  score,
  totalQuestions,
  credits,
  topic,
  isPerfectScore,
  onPlayAgain,
  isGameOver = false,
  lives = 0
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getPerformanceMessage = () => {
    if (isGameOver) return "Game Over!";
    if (isPerfectScore) return "Perfect Score!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    return "Keep Practicing!";
  };

  const getGlowClass = () => {
    if (isGameOver) return "glow-destructive";
    if (isPerfectScore) return "glow-accent";
    return "glow-primary";
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-hidden flex items-center justify-center p-4">
      {/* Ambient glow */}
      {isPerfectScore && !isGameOver && (
        <>
          <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[20%] right-[30%] w-[300px] h-[300px] rounded-full bg-primary/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </>
      )}
      {isGameOver && (
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-destructive/10 blur-[120px] animate-pulse-glow" />
      )}

      <div className="w-full max-w-lg relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`relative animate-bounce-in`}>
            <div className={`absolute inset-0 rounded-full blur-xl ${isGameOver ? 'bg-destructive/30' : isPerfectScore ? 'bg-accent/30' : 'bg-primary/30'}`} />
            <div className={`relative bg-card border border-border rounded-2xl p-5 ${getGlowClass()}`}>
              {isGameOver ? (
                <Skull className="h-12 w-12 text-destructive" />
              ) : isPerfectScore ? (
                <Trophy className="h-12 w-12 text-accent animate-float" />
              ) : (
                <Award className="h-12 w-12 text-primary" />
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl font-bold font-display text-foreground mb-1">
            {isGameOver ? "Better luck next time" : "Congratulations"}, {playerName}!
          </h1>
          <p className={`text-xl font-semibold font-display ${
            isGameOver ? 'text-destructive' : isPerfectScore ? 'text-gradient' : 'text-primary'
          }`}>
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Stats card */}
        <div className="glass-strong rounded-2xl p-6 mb-6 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-foreground">{score}/{totalQuestions}</div>
              <div className="text-xs text-muted-foreground mt-1">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-foreground">{percentage}%</div>
              <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart 
                    key={i}
                    className={`h-5 w-5 ${i < lives ? 'text-destructive' : 'text-muted-foreground/30'}`}
                    fill={i < lives ? 'hsl(var(--destructive))' : 'none'}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Lives</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 py-3 border-t border-border/50">
            <Star className="h-5 w-5 text-warning" />
            <span className="text-base font-semibold text-foreground">{credits} Credits Earned</span>
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-2">
            Topic: <span className="text-primary font-medium">{topic}</span>
          </div>
        </div>

        {/* Messages */}
        {isPerfectScore && !isGameOver && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-center gap-2 text-accent font-medium">
              <Sparkles className="h-4 w-4" />
              Perfect score bonus! You've mastered {topic}!
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-destructive font-medium">
              You ran out of lives! Try again with a different strategy.
            </p>
          </div>
        )}

        {/* Play again */}
        <Button
          onClick={onPlayAgain}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl glow-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-slide-in-bottom"
          style={{ animationDelay: '0.6s' }}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default TrophyDisplay;
