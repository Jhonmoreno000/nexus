const fs = require('fs');
const path = require('path');

function write(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data, 'utf8');
}

write('package.json', JSON.stringify({
  "name": "nexus-monorepo",
  "version": "1.0.0",
  "private": true,
  "description": "NEXUS — Database Engineering Simulator",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present"
  },
  "keywords": ["sql", "simulator", "database", "postgres", "monaco", "education"],
  "author": "NEXUS Engineering Team",
  "license": "MIT"
}, null, 2));

write('packages/types/package.json', JSON.stringify({
  "name": "@nexus/types",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc"
  }
}, null, 2));

write('packages/types/src/index.ts', `
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
`);

console.log('Root package and @nexus/types created successfully.');
