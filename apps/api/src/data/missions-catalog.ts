export * from './missions/types.js';
import { MissionDefinition } from './missions/types.js';
import { mission1021 } from './missions/mission-1021.js';
import { mission1140 } from './missions/mission-1140.js';
import { mission1280 } from './missions/mission-1280.js';
import { mission1842 } from './missions/mission-1842.js';
import { mission1930 } from './missions/mission-1930.js';
import { mission2045 } from './missions/mission-2045.js';

export const MISSIONS_CATALOG: Record<string, MissionDefinition> = {
  '1021': mission1021,
  '1140': mission1140,
  '1280': mission1280,
  '1842': mission1842,
  '1930': mission1930,
  '2045': mission2045
};
