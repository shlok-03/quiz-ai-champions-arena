import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import SetupScreen from './quiz/SetupScreen';
import LoadingScreen from './quiz/LoadingScreen';
import PlayingScreen from './quiz/PlayingScreen';
import TrophyDisplay from './TrophyDisplay';
import { generateQuestions, isApiKeySet, setOpenAIApiKey } from '@/services/QuizService';
import { QuizState } from '@/types/quiz';

const QuizGame = () => {
  const [showApiKeyForm, setShowApiKeyForm] = useState(!isApiKeySet());
  const [apiKey, setApiKey] = useState('');
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

  // Check if API key is set on component mount
  useEffect(() => {
    setShowApiKeyForm(!isApiKeySet());
  }, []);

  const handleApiKeySave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    setOpenAIApiKey(apiKey);
    setShowApiKeyForm(false);
  };

  const handleStartQuiz = async () => {
    if (!quiz.topic.trim() || !quiz.playerName.trim()) {
      toast.error('Please enter both your name and a topic!');
      return;
    }

    if (!isApiKeySet()) {
      setShowApiKeyForm(true);
      return;
    }

    setQuiz(prev => ({ ...prev, gamePhase: 'loading' }));
    
    try {
      const questions = await generateQuestions(quiz.topic, quiz.questionCount);
      
      setQuiz(prev => ({
        ...prev,
        questions,
        gamePhase: 'playing',
        answers: new Array(quiz.questionCount).fill(-1),
        lives: 3
      }));
    } catch (error) {
      toast.error('Failed to generate questions. Please try again.');
      setQuiz(prev => ({ ...prev, gamePhase: 'setup' }));
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

  const setPlayerName = (name: string) => {
    setQuiz(prev => ({ ...prev, playerName: name }));
  };

  const setTopic = (topic: string) => {
    setQuiz(prev => ({ ...prev, topic }));
  };

  const setQuestionCount = (count: number) => {
    setQuiz(prev => ({ ...prev, questionCount: count }));
  };

  if (showApiKeyForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">OpenAI API Key Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              To generate quiz questions, please enter your OpenAI API key. 
              Your key will be stored locally in your browser.
            </p>
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">OpenAI's website</a>
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowApiKeyForm(false)}>
              Use Sample Questions
            </Button>
            <Button onClick={handleApiKeySave}>
              Save API Key
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  switch (quiz.gamePhase) {
    case 'setup':
      return (
        <SetupScreen
          playerName={quiz.playerName}
          setPlayerName={(playerName) => setQuiz(prev => ({ ...prev, playerName }))}
          topic={quiz.topic}
          setTopic={(topic) => setQuiz(prev => ({ ...prev, topic }))}
          questionCount={quiz.questionCount}
          setQuestionCount={(questionCount) => setQuiz(prev => ({ ...prev, questionCount }))}
          onStart={handleStartQuiz}
        />
      );
    case 'loading':
      return (
        <LoadingScreen
          topic={quiz.topic}
          questionCount={quiz.questionCount}
        />
      );
    case 'playing':
      return (
        <PlayingScreen
          topic={quiz.topic}
          questions={quiz.questions}
          currentQuestion={quiz.currentQuestion}
          credits={quiz.credits}
          lives={quiz.lives}
          score={quiz.score}
          showExplanationModal={quiz.showExplanationModal}
          currentExplanation={quiz.currentExplanation}
          onAnswer={handleAnswer}
          closeExplanationModal={() => setQuiz(prev => ({ ...prev, showExplanationModal: false }))}
        />
      );
    case 'finished': {
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
    default:
      return null;
  }
};

export default QuizGame;
