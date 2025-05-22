
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw, Award, Heart, AlertTriangle } from 'lucide-react';

interface TrophyDisplayProps {
  playerName: string;
  score: number;
  totalQuestions: number;
  credits: number;
  topic: string;
  isPerfectScore: boolean;
  onPlayAgain: () => void;
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
    if (isPerfectScore) return "Perfect Score! Outstanding!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    return "Keep Practicing!";
  };

  const getPerformanceColor = () => {
    if (isGameOver) return "text-red-500";
    if (isPerfectScore) return "text-yellow-500";
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-blue-500";
    return "text-orange-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-8 text-center">
          {isPerfectScore && !isGameOver && (
            <div className="mb-6 animate-scale-in">
              <Trophy className="h-24 w-24 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full inline-block font-bold text-lg shadow-lg">
                🏆 WINNER 🏆
              </div>
            </div>
          )}
          
          {isGameOver && (
            <div className="mb-6 animate-scale-in">
              <AlertTriangle className="h-24 w-24 text-red-500 mx-auto mb-4 animate-pulse" />
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full inline-block font-bold text-lg shadow-lg">
                ❌ GAME OVER ❌
              </div>
            </div>
          )}
          
          {!isPerfectScore && !isGameOver && (
            <div className="mb-6">
              <Award className={`h-16 w-16 mx-auto mb-4 ${getPerformanceColor()}`} />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isGameOver ? "Better luck next time" : "Congratulations"}, {playerName}!
          </h1>
          
          <p className={`text-xl font-semibold mb-6 ${getPerformanceColor()}`}>
            {getPerformanceMessage()}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{score}/{totalQuestions}</div>
                <div className="text-sm text-gray-600">Questions Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart 
                      key={i}
                      className={`h-5 w-5 ${i < lives ? 'text-red-500' : 'text-gray-400'}`}
                      fill={i < lives ? 'red' : 'none'}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">Lives Remaining</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-4 border-t">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold text-gray-800">
                {credits} Credits Earned
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              Topic: <span className="font-medium">{topic}</span>
            </div>
          </div>

          {isPerfectScore && !isGameOver && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                🎉 Perfect score bonus! You've mastered {topic}!
              </p>
            </div>
          )}

          {isGameOver && (
            <div className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">
                You ran out of lives! Try again with a different topic.
              </p>
            </div>
          )}

          <Button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrophyDisplay;
