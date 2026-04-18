export type Section = 'home' | 'dashboard' | 'test' | 'results';

export type TestType = 'verbal' | 'nonverbal' | 'academic';

export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface AnsweredQuestion {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
  topic: string;
}

export interface TestConfig {
  type: TestType;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  topics: string[];
  description: string;
  badge: string;
  difficulty: string;
  estimatedTime: string;
}

export interface TestResults {
  testType: TestType;
  testTitle: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
  percentage: number;
  passed: boolean;
  answeredQuestions: AnsweredQuestion[];
  topicBreakdown: Record<string, { correct: number; total: number }>;
}
