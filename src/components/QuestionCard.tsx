import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, questionNumber, onPrevious, onNext, hasPrevious, hasNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(answerIndex);
    }, 1000);
  };

  const handleClearSelection = () => {
    if (showResult) return; // Don't allow clearing after submission
    setSelectedAnswer(null);
  };

  const getButtonStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200';
    }

    if (index === question.correctAnswer) {
      return 'bg-green-500 text-white border-green-500';
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-red-500 text-white border-red-500';
    }

    return 'bg-gray-100 text-gray-500 border-gray-200';
  };

  const getIcon = (index: number) => {
    if (!showResult) return null;
    
    if (index === question.correctAnswer) {
      return <CheckCircle className="h-5 w-5 ml-2" />;
    }
    
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return <XCircle className="h-5 w-5 ml-2" />;
    }
    
    return null;
  };

  return (
    <Card className="w-full bg-white shadow-xl animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Question {questionNumber}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
          {question.question}
        </h3>
        
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`p-4 h-auto text-left justify-start transition-all duration-300 ${getButtonStyle(index)}`}
              onClick={() => handleAnswerClick(index)}
              disabled={showResult}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex-1">{option}</span>
                {getIcon(index)}
              </div>
            </Button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onPrevious} 
            disabled={!hasPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleClearSelection} 
            disabled={selectedAnswer === null || showResult}
            className="flex items-center gap-2"
          >
            <Eraser size={16} />
            Clear
          </Button>
          <Button 
            variant="outline" 
            onClick={onNext} 
            disabled={!hasNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>

        {showResult && selectedAnswer !== null && selectedAnswer !== question.correctAnswer && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
            <p className="text-sm text-blue-800">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
