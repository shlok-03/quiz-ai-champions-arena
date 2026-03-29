export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizState {
  topic: string;
  questionCount: number;
  difficulty: Difficulty;
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
