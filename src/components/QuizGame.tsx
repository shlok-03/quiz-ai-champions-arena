import React, { useState } from 'react';
import { toast } from 'sonner';
import { Star, Heart } from 'lucide-react';

import SetupScreen from './quiz/SetupScreen';
import LoadingScreen from './quiz/LoadingScreen';
import PlayingScreen from './quiz/PlayingScreen';
import TrophyDisplay from './TrophyDisplay';
import { generateQuestions } from '@/services/QuizService';
import { QuizState } from '@/types/quiz';

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

  const handleStartQuiz = async () => {
    if (!quiz.topic.trim() || !quiz.playerName.trim()) {
      toast.error('Please enter both your name and a topic!');
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

    if (newLives <= 0) {
      setTimeout(() => {
        setQuiz(prev => ({ ...prev, gamePhase: 'finished' }));
      }, 1500);
      return;
    }

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
          onPrevious={() => setQuiz(prev => ({ ...prev, currentQuestion: Math.max(0, prev.currentQuestion - 1) }))}
          onNext={() => setQuiz(prev => ({ ...prev, currentQuestion: Math.min(prev.questions.length - 1, prev.currentQuestion + 1) }))}
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
