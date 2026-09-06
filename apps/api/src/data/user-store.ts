import fs from 'fs';
import path from 'path';

export interface UserProgressData {
  name: string;
  username: string;
  role: string;
  level: number;
  xp: number;
  rankTitle: string;
  completedMissions: string[];
  completedObjectives: Record<string, number[]>; // missionId -> objectiveIds[]
  queriesExecuted: number;
  unlockedHints: Record<string, number[]>; // missionId -> unlockedLevels[]
  unlockedSideQuests: Record<string, string[]>;
  badges: string[];
  queryHistory: {
    id: string;
    missionId: string;
    missionTitle: string;
    sql: string;
    executionTimeMs: number;
    rowCount: number;
    status: 'SUCCESS' | 'ERROR';
    score?: number;
    timestamp: string;
  }[];
}

const DEFAULT_USER_PROGRESS: UserProgressData = {
  name: 'Jhon Moreno',
  username: 'Jhonmoreno000',
  role: 'Database Engineering Trainee',
  level: 1,
  xp: 0,
  rankTitle: 'Level 1 Trainee',
  completedMissions: [],
  completedObjectives: {},
  queriesExecuted: 0,
  unlockedHints: {},
  unlockedSideQuests: {},
  badges: [],
  queryHistory: []
};

export class UserStore {
  private static filePath = path.resolve(process.cwd(), 'apps/api/data/user-progress.json');

  private static ensureDataDir() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public static get(): UserProgressData {
    this.ensureDataDir();
    if (!fs.existsSync(this.filePath)) {
      this.save(DEFAULT_USER_PROGRESS);
      return { ...DEFAULT_USER_PROGRESS };
    }
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return { ...DEFAULT_USER_PROGRESS };
    }
  }

  public static save(data: UserProgressData): void {
    this.ensureDataDir();
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  public static recordQuery(entry: {
    missionId: string;
    missionTitle: string;
    sql: string;
    executionTimeMs: number;
    rowCount: number;
    status: 'SUCCESS' | 'ERROR';
    score?: number;
  }): UserProgressData {
    const data = this.get();
    data.queriesExecuted += 1;
    data.queryHistory.unshift({
      id: 'q-' + Date.now(),
      ...entry,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });
    if (data.queryHistory.length > 50) {
      data.queryHistory = data.queryHistory.slice(0, 50);
    }
    this.save(data);
    return data;
  }

  public static completeObjective(missionId: string, objectiveId: number): { data: UserProgressData; newlyCompleted: boolean; xpAwarded: number } {
    const data = this.get();
    if (!data.completedObjectives[missionId]) {
      data.completedObjectives[missionId] = [];
    }
    if (!data.completedObjectives[missionId].includes(objectiveId)) {
      data.completedObjectives[missionId].push(objectiveId);
      data.xp += 50;
      // Level check
      data.level = Math.floor(data.xp / 300) + 1;
      this.updateRankTitle(data);
      this.save(data);
      return { data, newlyCompleted: true, xpAwarded: 50 };
    }
    return { data, newlyCompleted: false, xpAwarded: 0 };
  }

  public static completeMission(missionId: string): { data: UserProgressData; newlyCompleted: boolean; xpAwarded: number } {
    const data = this.get();
    if (!data.completedMissions.includes(missionId)) {
      data.completedMissions.push(missionId);
      data.xp += 500;
      data.level = Math.floor(data.xp / 300) + 1;
      this.updateRankTitle(data);
      if (!data.badges.includes('Incident Master: #' + missionId)) {
        data.badges.push('Incident Master: #' + missionId);
      }
      this.save(data);
      return { data, newlyCompleted: true, xpAwarded: 500 };
    }
    return { data, newlyCompleted: false, xpAwarded: 0 };
  }

  public static unlockHint(missionId: string, level: number): UserProgressData {
    const data = this.get();
    if (!data.unlockedHints[missionId]) {
      data.unlockedHints[missionId] = [];
    }
    if (!data.unlockedHints[missionId].includes(level)) {
      data.unlockedHints[missionId].push(level);
      data.xp += 25; // Bonus for passing quiz
      data.level = Math.floor(data.xp / 300) + 1;
      this.updateRankTitle(data);
      this.save(data);
    }
    return data;
  }

  public static reset(): UserProgressData {
    const fresh = { ...DEFAULT_USER_PROGRESS };
    this.save(fresh);
    return fresh;
  }

  private static updateRankTitle(data: UserProgressData) {
    if (data.level >= 5) data.rankTitle = 'Principal Database Architect';
    else if (data.level >= 4) data.rankTitle = 'Senior Data Infrastructure Engineer';
    else if (data.level >= 3) data.rankTitle = 'Mid-Level Database Engineer';
    else if (data.level >= 2) data.rankTitle = 'Junior Database Developer';
    else data.rankTitle = 'Level 1 Trainee';
  }
}
