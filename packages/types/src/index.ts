
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Objective {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface MissionManifest {
  id: string;
  incidentNumber: number;
  title: string;
  domain: string;
  difficulty: DifficultyLevel;
  database: string;
  timeRemainingSeconds: number;
  context: string;
  objectives: Objective[];
  relatedTables: string[];
  skills: string[];
}

export interface QueryExecutionResult {
  success: boolean;
  query: string;
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  executionPlan?: string[];
}

export interface EvaluationScorecard {
  correctness: number; // e.g. 40%
  logic: number;       // e.g. 20%
  robustness: number;  // e.g. 15%
  performance: number; // e.g. 10%
  readability: number; // e.g. 10%
  security: number;    // e.g. 5%
  totalScore: number;
  passed: boolean;
  testCases: {
    name: string;
    passed: boolean;
    feedback: string;
  }[];
  explanation: string;
}

export interface TutorHint {
  level: number;
  title: string;
  concept: string;
  hint: string;
  nextQuestion?: string;
  codeSnippet?: string;
}

export interface SkillProgress {
  skillId: string;
  name: string;
  percentage: number;
  level: string;
  icon: string;
}
