import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Heart, Lightbulb, Timer } from 'lucide-react';
import QuestionCard from '../QuestionCard';
import { Question, Difficulty } from '@/types/quiz';

const TIME_PER_DIFFICULTY: Record<Difficulty, number> = {
  easy: 40,
  medium: 30,
  hard: 20,
};

interface PlayingScreenProps {
  topic: string;
  questions: Question[];
  currentQuestion: number;
  credits: number;
  lives: number;
  score: number;
  difficulty: Difficulty;
  showExplanationModal: boolean;
  currentExplanation: string;
  onAnswer: (answerIndex: number) => void;
  closeExplanationModal: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const PlayingScreen: React.FC<PlayingScreenProps> = ({
  topic,
  questions,
  currentQuestion,
  credits,
  lives,
  score,
  difficulty,
  showExplanationModal,
  currentExplanation,
  onAnswer,
  closeExplanationModal,
  onPrevious,
  onNext,
}) => {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const totalTime = TIME_PER_DIFFICULTY[difficulty];
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const expiredRef = useRef(false);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(totalTime);
    expiredRef.current = false;
  }, [currentQuestion, totalTime]);

  // Pause when explanation modal is open
  useEffect(() => {
    if (showExplanationModal) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [showExplanationModal, currentQuestion]);

  // Trigger timeout once
  useEffect(() => {
    if (timeLeft === 0 && !expiredRef.current && !showExplanationModal) {
      expiredRef.current = true;
      onAnswer(-1);
    }
  }, [timeLeft, showExplanationModal, onAnswer]);

  const timerPct = (timeLeft / totalTime) * 100;
  const timerColor =
    timerPct > 50 ? 'text-success' : timerPct > 25 ? 'text-warning' : 'text-destructive';


  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-hidden p-4">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-accent/8 blur-[100px]" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Progress Header */}
        <div className="glass-strong rounded-2xl p-4 mb-5 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold font-display text-gradient">{topic} Quiz</h2>
              <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5 ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
                <Timer className={`h-4 w-4 ${timerColor}`} />
                <span className={`text-sm font-semibold tabular-nums ${timerColor}`}>{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-sm font-semibold text-foreground">{credits}</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart 
                    key={i}
                    className={`h-4 w-4 transition-all duration-300 ${i < lives ? 'text-destructive scale-100' : 'text-muted-foreground/30 scale-75'}`}
                    fill={i < lives ? 'hsl(var(--destructive))' : 'none'}
                  />
                ))}
              </div>
              <div className="text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5">
                {score}/{questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-muted/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
              }}
            />
          </div>
        </div>

        <QuestionCard
          question={questions[currentQuestion]}
          onAnswer={onAnswer}
          questionNumber={currentQuestion + 1}
          onPrevious={onPrevious}
          onNext={onNext}
          hasPrevious={currentQuestion > 0}
          hasNext={currentQuestion < questions.length - 1}
        />

        {/* Explanation Dialog */}
        <Dialog open={showExplanationModal} onOpenChange={closeExplanationModal}>
          <DialogContent className="glass-strong border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-foreground">
                <Lightbulb className="h-5 w-5 text-warning" />
                Explanation
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base leading-relaxed mt-2">
                {currentExplanation}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={closeExplanationModal} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Got it
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PlayingScreen;
