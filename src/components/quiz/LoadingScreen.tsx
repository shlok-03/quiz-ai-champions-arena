import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  topic: string;
  questionCount: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ topic, questionCount }) => {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-hidden flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-primary/15 blur-[120px] animate-pulse-glow" />

      <div className="text-center relative z-10 animate-fade-in">
        {/* Spinning brain */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
          <div className="relative bg-card border border-border rounded-2xl p-6 glow-primary">
            <Brain className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <div className="absolute -inset-4 border border-primary/20 rounded-3xl animate-spin-slow" />
          <div className="absolute -inset-8 border border-accent/10 rounded-[2rem] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
        </div>

        <h3 className="text-2xl font-bold font-display text-gradient mb-3">Generating Questions...</h3>
        <p className="text-muted-foreground mb-6">
          AI is crafting {questionCount} questions about <span className="text-primary font-medium">{topic}</span>
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>This usually takes a few seconds</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
