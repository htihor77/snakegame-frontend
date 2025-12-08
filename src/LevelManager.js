import { LEVEL_1 } from "./levels/level1";
import { LEVEL_2 } from "./levels/level2";
import { LEVEL_3 } from "./levels/level3";
import { LEVEL_4 } from "./levels/level4";
import { LEVEL_5 } from "./levels/level5";

const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];

export function getLevelConfig(levelId) {
  const level = LEVELS.find((l) => l.id === levelId);
  return level || LEVEL_1;
}

export function getNextLevel(currentLevelId) {
  const currentLevel = getLevelConfig(currentLevelId);
  if (currentLevel.maxLevel) return currentLevel;
  const nextId = Math.min(currentLevelId + 1, 5);
  return getLevelConfig(nextId);
}

export function getTotalLevels() {
  return 4;
}

export function getAllLevels() {
  return LEVELS;
}
