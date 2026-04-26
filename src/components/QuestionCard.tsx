import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eraser, ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '@/types/quiz';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  questionNumber: number;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  disabled?: boolean;
}

const optionLabels = ['A', 'B', 'C', 'D'];

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, questionNumber, onPrevious, onNext, hasPrevious, hasNext, disabled = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  React.useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [question.id]);

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult || disabled) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setTimeout(() => {
      onAnswer(answerIndex);
    }, 1200);
  };

  const handleClearSelection = () => {
    if (showResult) return;
    setSelectedAnswer(null);
  };

  const getButtonStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? 'bg-primary/15 border-primary/50 text-foreground ring-1 ring-primary/30'
        : 'bg-muted/30 border-border/30 text-foreground hover:bg-muted/60 hover:border-border/60';
    }
    if (index === question.correctAnswer) {
      return 'bg-success/15 border-success/50 text-foreground glow-success';
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-destructive/15 border-destructive/50 text-foreground glow-destructive';
    }
    return 'bg-muted/20 border-border/20 text-muted-foreground';
  };

  const getIcon = (index: number) => {
    if (!showResult) return null;
    if (index === question.correctAnswer) {
      return <CheckCircle className="h-5 w-5 text-success shrink-0" />;
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return <XCircle className="h-5 w-5 text-destructive shrink-0" />;
    }
    return null;
  };

  return (
    <div className="glass-strong rounded-2xl p-6 animate-fade-in-up">
      {/* Question */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Question {questionNumber}</span>
        <h3 className="text-xl font-display font-semibold text-foreground mt-2 leading-relaxed">
          {question.question}
        </h3>
      </div>
      
      {/* Options */}
      <div className="grid gap-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-4 rounded-xl text-left transition-all duration-300 border flex items-center gap-3 ${getButtonStyle(index)} ${showResult || disabled ? '' : 'active:scale-[0.98]'} ${disabled && !showResult ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleAnswerClick(index)}
            disabled={showResult || disabled}
          >
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
              selectedAnswer === index && !showResult ? 'bg-primary text-primary-foreground' :
              showResult && index === question.correctAnswer ? 'bg-success text-success-foreground' :
              showResult && selectedAnswer === index ? 'bg-destructive text-destructive-foreground' :
              'bg-muted/50 text-muted-foreground'
            }`}>
              {optionLabels[index]}
            </span>
            <span className="flex-1 text-sm font-medium">{option}</span>
            {getIcon(index)}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={onPrevious} 
          disabled={!hasPrevious}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleClearSelection} 
          disabled={selectedAnswer === null || showResult}
          className="text-muted-foreground hover:text-foreground"
        >
          <Eraser size={16} className="mr-1" />
          Clear
        </Button>
        <Button 
          variant="ghost" 
          onClick={onNext} 
          disabled={!hasNext}
          className="text-muted-foreground hover:text-foreground"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      {/* Inline explanation */}
      {showResult && selectedAnswer !== null && selectedAnswer !== question.correctAnswer && question.explanation && (
        <div className="mt-5 p-4 rounded-xl bg-secondary/10 border border-secondary/20 animate-fade-in">
          <p className="text-sm text-foreground/80">
            <strong className="text-secondary">Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
