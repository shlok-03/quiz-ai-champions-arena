import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Star, Heart } from 'lucide-react';

import SetupScreen from './quiz/SetupScreen';
import LoadingScreen from './quiz/LoadingScreen';
import PlayingScreen from './quiz/PlayingScreen';
import TrophyDisplay from './TrophyDisplay';
import { generateQuestions, saveQuizScore } from '@/services/QuizService';
import { insertQuizResult } from '@/integrations/external-supabase';
import { QuizState } from '@/types/quiz';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const QuizGame = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizState>({
    topic: '',
    questionCount: 5,
    difficulty: 'medium',
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

  useEffect(() => {
    if (user && !quiz.playerName) {
      const meta = (user.user_metadata as any)?.display_name as string | undefined;
      setQuiz(prev => ({ ...prev, playerName: meta || user.email?.split('@')[0] || '' }));
    }
  }, [user]);

  const handleStartQuiz = async () => {
    if (!quiz.topic.trim() || !quiz.playerName.trim()) {
      toast.error('Please enter both your name and a topic!');
      return;
    }

    setQuiz(prev => ({ ...prev, gamePhase: 'loading' }));
    
    try {
      const { quizId, questions } = await generateQuestions(quiz.topic, quiz.questionCount, quiz.difficulty, quiz.playerName);
      setCurrentQuizId(quizId);

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

  const handleFinish = (finalScore: number, finalCredits: number, finalLives: number) => {
    saveQuizScore({
      quizId: currentQuizId,
      playerName: quiz.playerName,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      score: finalScore,
      totalQuestions: quiz.questions.length,
      credits: finalCredits,
      livesRemaining: finalLives,
    }).catch(() => {});

    insertQuizResult({
      player_name: quiz.playerName,
      score: finalScore,
      total_questions: quiz.questions.length,
      category: quiz.topic,
    }).catch((err) => {
      console.error('External quiz_results insert failed:', err);
    });

    setQuiz(prev => ({ ...prev, score: finalScore, credits: finalCredits, lives: finalLives, gamePhase: 'finished' }));
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
      toast.success('Correct! +10 credits', { icon: <Star className="text-yellow-500" /> });
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
      setTimeout(() => handleFinish(newScore, newCredits, newLives), 1500);
      return;
    }

    setTimeout(() => {
      if (quiz.currentQuestion + 1 < quiz.questions.length) {
        setQuiz(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
      } else {
        handleFinish(newScore, newCredits, newLives);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuiz(prev => ({
      topic: '',
      questionCount: 5,
      difficulty: 'medium',
      questions: [],
      currentQuestion: 0,
      score: 0,
      credits: 0,
      gamePhase: 'setup',
      playerName: prev.playerName,
      answers: [],
      lives: 3,
      showExplanationModal: false,
      currentExplanation: ''
    }));
  };

  const goToLeaderboard = () => navigate('/leaderboard');

  const SignOutButton = () => (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
      {user && <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>}
      <Button size="sm" variant="outline" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-1" /> Sign out
      </Button>
    </div>
  );

  switch (quiz.gamePhase) {
    case 'setup':
      return (
        <div className="relative">
          <SignOutButton />
          <SetupScreen
            playerName={quiz.playerName}
            setPlayerName={(playerName) => setQuiz(prev => ({ ...prev, playerName }))}
            topic={quiz.topic}
            setTopic={(topic) => setQuiz(prev => ({ ...prev, topic }))}
            questionCount={quiz.questionCount}
            setQuestionCount={(questionCount) => setQuiz(prev => ({ ...prev, questionCount }))}
            difficulty={quiz.difficulty}
            setDifficulty={(difficulty) => setQuiz(prev => ({ ...prev, difficulty }))}
            onStart={handleStartQuiz}
            onShowLeaderboard={goToLeaderboard}
          />
        </div>
      );
    case 'loading':
      return <LoadingScreen topic={quiz.topic} questionCount={quiz.questionCount} />;
    case 'playing':
      return (
        <PlayingScreen
          topic={quiz.topic}
          questions={quiz.questions}
          currentQuestion={quiz.currentQuestion}
          credits={quiz.credits}
          lives={quiz.lives}
          score={quiz.score}
          difficulty={quiz.difficulty}
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
          onShowLeaderboard={goToLeaderboard}
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
