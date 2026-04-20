import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap, Heart, Sparkles, Target, Trophy } from 'lucide-react';
import { Difficulty } from '@/types/quiz';

interface SetupScreenProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  onStart: () => void;
  onShowLeaderboard: () => void;
}

const difficultyConfig: Record<Difficulty, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  easy: { label: 'Easy', color: 'text-success', icon: <Sparkles className="h-4 w-4" />, description: 'Great for beginners' },
  medium: { label: 'Medium', color: 'text-warning', icon: <Target className="h-4 w-4" />, description: 'A balanced challenge' },
  hard: { label: 'Hard', color: 'text-destructive', icon: <Trophy className="h-4 w-4" />, description: 'For true experts' },
};

const SetupScreen: React.FC<SetupScreenProps> = ({
  playerName,
  setPlayerName,
  topic,
  setTopic,
  questionCount,
  setQuestionCount,
  difficulty,
  setDifficulty,
  onStart,
}) => {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-hidden flex items-center justify-center p-4">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Floating brain icon */}
        <div className="flex justify-center mb-6 animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
            <div className="relative bg-card border border-border rounded-2xl p-4 glow-primary">
              <Brain className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold font-display text-gradient mb-2">Quiz Master</h1>
          <p className="text-muted-foreground">AI-powered quizzes on any topic</p>
        </div>

        {/* Main card */}
        <div className="glass-strong rounded-2xl p-6 space-y-5 animate-slide-in-bottom">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Quiz Topic</label>
            <Input
              placeholder="e.g., Space, History, Science..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Number of Questions</label>
            <Select
              value={questionCount.toString()}
              onValueChange={(value) => setQuestionCount(parseInt(value))}
            >
              <SelectTrigger className="bg-muted/50 border-border/50 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(difficultyConfig) as Difficulty[]).map((d) => {
                const config = difficultyConfig[d];
                const isActive = difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`relative rounded-xl p-3 text-center transition-all duration-300 border ${
                      isActive
                        ? 'bg-primary/15 border-primary/50 scale-[1.02]'
                        : 'bg-muted/30 border-border/30 hover:border-border/60 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`flex justify-center mb-1 ${isActive ? config.color : 'text-muted-foreground'}`}>
                      {config.icon}
                    </div>
                    <div className={`text-sm font-semibold font-display ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {config.label}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-1">
              {difficultyConfig[difficulty].description}
            </p>
          </div>

          {/* Lives display */}
          <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <Heart key={i} className="h-5 w-5 text-destructive animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} fill="hsl(var(--destructive))" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground/70">3 lives — don't lose them!</span>
          </div>

          {/* Start button */}
          <Button 
            onClick={onStart}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl glow-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            disabled={!topic.trim() || !playerName.trim()}
          >
            <Zap className="mr-2 h-5 w-5" />
            Generate Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
