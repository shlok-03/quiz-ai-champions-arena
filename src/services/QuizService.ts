import { Question, Difficulty } from '@/types/quiz';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface GeneratedQuiz {
  quizId: string | null;
  questions: Question[];
}

async function persistQuiz(
  topic: string,
  difficulty: Difficulty,
  playerName: string,
  questions: Question[],
): Promise<string | null> {
  try {
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        topic,
        difficulty,
        player_name: playerName,
        question_count: questions.length,
      })
      .select('id')
      .single();

    if (quizError || !quiz) {
      console.error('Failed to save quiz:', quizError);
      return null;
    }

    const rows = questions.map((q, i) => ({
      quiz_id: quiz.id,
      question_index: i,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation ?? null,
    }));

    const { error: questionsError } = await supabase.from('questions').insert(rows);
    if (questionsError) {
      console.error('Failed to save questions:', questionsError);
    }

    return quiz.id;
  } catch (err) {
    console.error('Unexpected error saving quiz:', err);
    return null;
  }
}

export async function generateQuestions(
  topic: string,
  questionCount: number,
  difficulty: Difficulty = 'medium',
  playerName = '',
): Promise<GeneratedQuiz> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { topic, questionCount, difficulty },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to generate questions');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    const questions: Question[] = data.questions;

    if (!questions || questions.length === 0) {
      throw new Error('No questions generated');
    }

    for (const q of questions) {
      if (!q.options || q.options.length !== 4) {
        throw new Error('Invalid question format received');
      }
    }

    const quizId = await persistQuiz(topic, difficulty, playerName, questions);

    toast.success(`Generated ${questions.length} questions about ${topic}!`);
    return { quizId, questions };
  } catch (error) {
    console.error('Error generating questions:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to generate questions');
    throw error;
  }
}

export interface SavedQuiz {
  id: string;
  topic: string;
  difficulty: string;
  question_count: number;
  created_at: string;
}

export async function getQuizzesByPlayer(playerName: string): Promise<SavedQuiz[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, topic, difficulty, question_count, created_at')
    .eq('player_name', playerName)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch quizzes:', error);
    return [];
  }
  return (data ?? []) as SavedQuiz[];
}

export async function saveQuizScore(params: {
  quizId: string | null;
  playerName: string;
  topic: string;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  credits: number;
  livesRemaining: number;
}) {
  const { error } = await supabase.from('scores').insert({
    quiz_id: params.quizId,
    player_name: params.playerName,
    topic: params.topic,
    difficulty: params.difficulty,
    score: params.score,
    total_questions: params.totalQuestions,
    credits: params.credits,
    lives_remaining: params.livesRemaining,
  });
  if (error) console.error('Failed to save score:', error);
}
