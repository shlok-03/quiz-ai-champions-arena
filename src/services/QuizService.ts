import { Question, Difficulty } from '@/types/quiz';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface GeneratedQuiz {
  quizId: string;
  questions: Question[];
}

async function persistQuiz(
  topic: string,
  difficulty: Difficulty,
  questions: Question[],
): Promise<string | null> {
  try {
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        topic,
        difficulty,
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
      return quiz.id;
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
): Promise<Question[]> {
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

    // Persist the generated quiz + questions (non-blocking for the UX)
    persistQuiz(topic, difficulty, questions).then((quizId) => {
      if (quizId) console.log('Quiz saved with id:', quizId);
    });

    toast.success(`Generated ${questions.length} questions about ${topic}!`);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to generate questions');
    throw error;
  }
}
