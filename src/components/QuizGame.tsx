
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import QuestionCard from './QuestionCard';
import TrophyDisplay from './TrophyDisplay';
import { Trophy, Star, Brain, Zap, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizState {
  topic: string;
  questionCount: number;
  questions: Question[];
  currentQuestion: number;
  score: number;
  credits: number;
  gamePhase: 'setup' | 'loading' | 'playing' | 'finished';
  playerName: string;
  answers: number[];
  lives: number;
  showExplanationModal: boolean;
  currentExplanation: string;
}

const QuizGame = () => {
  const [quiz, setQuiz] = useState<QuizState>({
    topic: '',
    questionCount: 5,
    questions: [],
    currentQuestion: 0,
    score: 0,
    credits: 0,
    gamePhase: 'setup',
    playerName: '',
    answers: [],
    lives: 3,
    showExplanationModal: false,
    currentExplanation: ''
  });

  const generateQuestions = async () => {
    if (!quiz.topic.trim() || !quiz.playerName.trim()) {
      toast.error('Please enter both your name and a topic!');
      return;
    }

    setQuiz(prev => ({ ...prev, gamePhase: 'loading' }));
    
    try {
      // Attempt to generate questions with OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a quiz generator. Create multiple choice questions based on the topic provided."
            },
            {
              role: "user",
              content: `Generate ${quiz.questionCount} multiple choice questions about "${quiz.topic}". 
                Format the response as a JSON array with each question having: 
                id (number), question (string), 
                options (array of 4 strings), 
                correctAnswer (index number 0-3 indicating which option is correct), 
                explanation (string explaining why the answer is correct)`
            }
          ],
          response_format: { type: "json_object" }
        })
      }).catch(error => {
        console.error("Error fetching from OpenAI:", error);
        throw new Error("Failed to connect to AI service");
      });

      if (!response || !response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      let generatedQuestions: Question[] = [];
      
      try {
        // Try to parse the AI response
        generatedQuestions = JSON.parse(data.choices[0].message.content).questions;
      } catch (e) {
        console.error("Error parsing AI response:", e);
        throw new Error("Invalid response from AI service");
      }

      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("No questions generated");
      }

      setQuiz(prev => ({
        ...prev,
        questions: generatedQuestions,
        gamePhase: 'playing',
        answers: new Array(quiz.questionCount).fill(-1),
        lives: 3
      }));

      toast.success(`Generated ${quiz.questionCount} questions about ${quiz.topic}!`);
    } catch (error) {
      console.error("Error generating questions:", error);
      
      // Fallback to sample questions if API fails
      const sampleQuestions: Question[] = [
        {
          id: 1,
          question: `What is a key characteristic of ${quiz.topic}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'This is the correct answer because it represents the fundamental aspect of the topic.'
        },
        {
          id: 2,
          question: `Which of these is most related to ${quiz.topic}?`,
          options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
          correctAnswer: 1,
          explanation: 'This choice has the strongest historical and conceptual connection to the topic.'
        },
        {
          id: 3,
          question: `What best describes ${quiz.topic}?`,
          options: ['Description A', 'Description B', 'Description C', 'Description D'],
          correctAnswer: 2,
          explanation: 'This description captures the essential nature of the topic most accurately.'
        },
        {
          id: 4,
          question: `In the context of ${quiz.topic}, which is true?`,
          options: ['Statement 1', 'Statement 2', 'Statement 3', 'Statement 4'],
          correctAnswer: 0,
          explanation: 'This statement aligns with the established facts about the topic.'
        },
        {
          id: 5,
          question: `What is an important aspect of ${quiz.topic}?`,
          options: ['Aspect A', 'Aspect B', 'Aspect C', 'Aspect D'],
          correctAnswer: 3,
          explanation: 'This aspect is crucial to understanding the full scope of the topic.'
        },
        {
          id: 6,
          question: `How does ${quiz.topic} relate to modern society?`,
          options: ['Relationship 1', 'Relationship 2', 'Relationship 3', 'Relationship 4'],
          correctAnswer: 1,
          explanation: 'This relationship illustrates how the topic influences contemporary life.'
        },
        {
          id: 7,
          question: `What is a common misconception about ${quiz.topic}?`,
          options: ['Misconception A', 'Misconception B', 'Misconception C', 'Misconception D'],
          correctAnswer: 2,
          explanation: 'This is a widely held but incorrect belief about the topic.'
        },
        {
          id: 8,
          question: `Which factor most influences ${quiz.topic}?`,
          options: ['Factor 1', 'Factor 2', 'Factor 3', 'Factor 4'],
          correctAnswer: 0,
          explanation: 'This factor has been shown to have the greatest impact on the development of the topic.'
        },
        {
          id: 9,
          question: `What is the primary purpose of ${quiz.topic}?`,
          options: ['Purpose A', 'Purpose B', 'Purpose C', 'Purpose D'],
          correctAnswer: 3,
          explanation: 'This purpose represents the main reason for the existence or development of the topic.'
        },
        {
          id: 10,
          question: `How has ${quiz.topic} evolved over time?`,
          options: ['Evolution 1', 'Evolution 2', 'Evolution 3', 'Evolution 4'],
          correctAnswer: 1,
          explanation: 'This evolutionary path most accurately represents the historical development of the topic.'
        }
      ];

      const selectedQuestions = sampleQuestions.slice(0, quiz.questionCount);
      
      setQuiz(prev => ({
        ...prev,
        questions: selectedQuestions,
        gamePhase: 'playing',
        answers: new Array(quiz.questionCount).fill(-1),
        lives: 3
      }));

      toast.success(`Generated ${quiz.questionCount} questions about ${quiz.topic}!`);
      toast.error('Using sample questions - AI service unavailable', { duration: 3000 });
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQ = quiz.questions[quiz.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    const newAnswers = [...quiz.answers];
    newAnswers[quiz.currentQuestion] = answerIndex;
    
    const newScore = isCorrect ? quiz.score + 1 : quiz.score;
    const newCredits = isCorrect ? quiz.credits + 10 : quiz.credits;
    const newLives = isCorrect ? quiz.lives : quiz.lives - 1;
    
    // Show explanation for wrong answers
    if (!isCorrect && currentQ.explanation) {
      setQuiz(prev => ({
        ...prev,
        showExplanationModal: true,
        currentExplanation: currentQ.explanation || "No explanation available."
      }));
    }

    if (isCorrect) {
      toast.success('Correct! +10 credits', {
        icon: <Star className="text-yellow-500" />
      });
    } else {
      toast.error(`Incorrect answer. ${newLives} ${newLives === 1 ? 'life' : 'lives'} remaining.`, {
        icon: <Heart className="text-red-500" />
      });
    }

    setQuiz(prev => ({
      ...prev,
      score: newScore,
      credits: newCredits,
      answers: newAnswers,
      lives: newLives
    }));

    // Check for game over
    if (newLives <= 0) {
      setTimeout(() => {
        setQuiz(prev => ({ ...prev, gamePhase: 'finished' }));
      }, 1500);
      return;
    }

    // Move to next question or finish
    setTimeout(() => {
      if (quiz.currentQuestion + 1 < quiz.questions.length) {
        setQuiz(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
      } else {
        setQuiz(prev => ({ ...prev, gamePhase: 'finished' }));
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuiz({
      topic: '',
      questionCount: 5,
      questions: [],
      currentQuestion: 0,
      score: 0,
      credits: 0,
      gamePhase: 'setup',
      playerName: '',
      answers: [],
      lives: 3,
      showExplanationModal: false,
      currentExplanation: ''
    });
  };

  const closeExplanationModal = () => {
    setQuiz(prev => ({
      ...prev,
      showExplanationModal: false
    }));
  };

  if (quiz.gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Quiz Master</CardTitle>
            <p className="text-gray-600">Create your personalized quiz!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={quiz.playerName}
                onChange={(e) => setQuiz(prev => ({ ...prev, playerName: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Topic</label>
              <Input
                placeholder="e.g., Space, History, Science..."
                value={quiz.topic}
                onChange={(e) => setQuiz(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
              <Select
                value={quiz.questionCount.toString()}
                onValueChange={(value) => setQuiz(prev => ({ ...prev, questionCount: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-center text-gray-700 py-2">
              <div className="flex items-center justify-center space-x-1">
                <Heart className="h-5 w-5 text-red-500" fill="red" />
                <Heart className="h-5 w-5 text-red-500" fill="red" />
                <Heart className="h-5 w-5 text-red-500" fill="red" />
                <span className="ml-2 font-medium">3 lives</span>
              </div>
              <p className="text-sm mt-1">You lose a life for each wrong answer!</p>
            </div>

            <Button 
              onClick={generateQuestions}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              disabled={!quiz.topic.trim() || !quiz.playerName.trim()}
            >
              <Zap className="mr-2 h-4 w-4" />
              Generate Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quiz.gamePhase === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Questions...</h3>
            <p className="text-gray-600">AI is creating {quiz.questionCount} questions about {quiz.topic}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quiz.gamePhase === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 flex justify-between items-center text-white">
            <div>
              <h2 className="text-xl font-bold">{quiz.topic} Quiz</h2>
              <p className="text-white/80">Question {quiz.currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">{quiz.credits} Credits</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart 
                      key={i}
                      className={`h-5 w-5 ${i < quiz.lives ? 'text-red-500' : 'text-gray-400'}`}
                      fill={i < quiz.lives ? 'red' : 'none'}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  Score: {quiz.score}/{quiz.questions.length}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((quiz.currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <QuestionCard
            question={quiz.questions[quiz.currentQuestion]}
            onAnswer={handleAnswer}
            questionNumber={quiz.currentQuestion + 1}
          />

          {/* Explanation Dialog */}
          <Dialog open={quiz.showExplanationModal} onOpenChange={closeExplanationModal}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Explanation</DialogTitle>
                <DialogDescription>
                  {quiz.currentExplanation}
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
  }

  if (quiz.gamePhase === 'finished') {
    const isPerfectScore = quiz.score === quiz.questions.length;
    const isGameOver = quiz.lives <= 0;
    
    return (
      <TrophyDisplay
        playerName={quiz.playerName}
        score={quiz.score}
        totalQuestions={quiz.questions.length}
        credits={quiz.credits}
        topic={quiz.topic}
        isPerfectScore={isPerfectScore}
        onPlayAgain={resetQuiz}
        isGameOver={isGameOver}
        lives={quiz.lives}
      />
    );
  }

  return null;
};

export default QuizGame;
