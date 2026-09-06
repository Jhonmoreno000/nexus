export interface Objective {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  prompt: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
}

export interface SideQuest {
  id: string;
  title: string;
  description: string;
  targetSqlSnippet: string;
  hintLevelUnlocked: number;
}

export interface MissionDefinition {
  id: string;
  incidentNumber: number;
  title: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  timeRemainingSeconds: number;
  context: string;
  objectives: Objective[];
  relatedTables: string[];
  initialQuery: string;
  schemaSql: string;
  seedSql: string;
  schemaTables: {
    name: string;
    columns: { name: string; type: string; isPk?: boolean; isFk?: boolean; fkRef?: string }[];
  }[];
  hints: Record<number, { hint: string; concept: string; nextQuestion: string; codeSnippet?: string }>;
  quizQuestions: QuizQuestion[];
  sideQuests: SideQuest[];
  evaluator: (sql: string, rows: any[]) => {
    passed: boolean;
    totalScore: number;
    breakdown: { correctness: number; logic: number; robustness: number; performance: number; readability: number; security: number };
    testCases: { name: string; passed: boolean; feedback: string }[];
    explanation: string;
  };
}
