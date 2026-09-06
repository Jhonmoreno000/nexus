export interface TableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
}

export interface SchemaTable {
  name: string;
  columns: TableColumn[];
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  success: boolean;
  error?: string;
  executionPlan?: string[];
}

export interface EvaluationResult {
  passed: boolean;
  totalScore: number;
  breakdown: {
    correctness: number;
    logic: number;
    robustness: number;
    performance: number;
    readability: number;
    security: number;
  };
  testCases: {
    name: string;
    passed: boolean;
    feedback: string;
  }[];
  explanation: string;
}

export interface TutorHint {
  diagnosis: string;
  hintLevel: number;
  hint: string;
  concept: string;
  nextQuestion: string;
  codeSnippet?: string;
}
