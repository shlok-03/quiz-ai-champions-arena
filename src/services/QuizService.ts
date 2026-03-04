import { Question } from '@/types/quiz';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export async function generateQuestions(topic: string, questionCount: number): Promise<Question[]> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: { topic, questionCount },
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to generate questions");
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    const questions: Question[] = data.questions;

    if (!questions || questions.length === 0) {
      throw new Error("No questions generated");
    }

    // Validate each question has 4 options
    for (const q of questions) {
      if (!q.options || q.options.length !== 4) {
        throw new Error("Invalid question format received");
      }
    }

    toast.success(`Generated ${questions.length} questions about ${topic}!`);
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    toast.error(error instanceof Error ? error.message : 'Failed to generate questions');
    throw error;
  }
}
