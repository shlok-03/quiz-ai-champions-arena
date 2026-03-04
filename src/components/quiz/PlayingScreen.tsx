
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Heart } from 'lucide-react';
import QuestionCard from '../QuestionCard';
import { Question } from '@/types/quiz';

interface PlayingScreenProps {
  topic: string;
  questions: Question[];
  currentQuestion: number;
  credits: number;
  lives: number;
  score: number;
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
  showExplanationModal,
  currentExplanation,
  onAnswer,
  closeExplanationModal,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold">{topic} Quiz</h2>
            <p className="text-white/80">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">{credits} Credits</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart 
                    key={i}
                    className={`h-5 w-5 ${i < lives ? 'text-red-500' : 'text-gray-400'}`}
                    fill={i < lives ? 'red' : 'none'}
                  />
                ))}
              </div>
              <div className="text-sm">
                Score: {score}/{questions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <QuestionCard
          question={questions[currentQuestion]}
          onAnswer={onAnswer}
          questionNumber={currentQuestion + 1}
        />

        {/* Explanation Dialog */}
        <Dialog open={showExplanationModal} onOpenChange={closeExplanationModal}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Explanation</DialogTitle>
              <DialogDescription>
                {currentExplanation}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={closeExplanationModal}>Got it</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PlayingScreen;
