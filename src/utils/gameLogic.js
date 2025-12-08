/**
 * CHANGELOG:
 * - Extracted core game logic from SnakeGame component
 * - Added defensive null/undefined checks
 * - Exported testable functions for collision, movement, and level application
 * - Added JSDoc comments for clarity
 */

/**
 * Calculate next head position
 * @param {number[]} currentHead - [row, col]
 * @param {number[]} direction - [dRow, dCol]
 * @param {number} boardSize - grid size
 * @param {boolean} wrap - wrap around edges
 * @returns {{head: number[], collision: boolean}} new head or collision flag
 */
export function calculateNextHead(currentHead, direction, boardSize, wrap) {
  if (!currentHead || !direction || !boardSize) {
    console.warn("calculateNextHead: missing params", { currentHead, direction, boardSize });
    return { head: currentHead, collision: false };
  }

  const [row, col] = currentHead;
  const [dRow, dCol] = direction;
  let newRow = row + dRow;
  let newCol = col + dCol;

  if (wrap) {
    newRow = (newRow + boardSize) % boardSize;
    newCol = (newCol + boardSize) % boardSize;
  } else {
    if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
      return { head: currentHead, collision: true };
    }
  }

  return { head: [newRow, newCol], collision: false };
}

/**
 * Check if head collides with snake body
 * @param {number[]} head - [row, col]
 * @param {number[][]} snake - array of segments
 * @returns {boolean}
 */
export function checkSelfCollision(head, snake) {
  if (!head || !Array.isArray(snake) || snake.length === 0) return false;
  const key = `${head[0]},${head[1]}`;
  return snake.slice(0, -1).some((seg) => `${seg[0]},${seg[1]}` === key);
}

/**
 * Check if head collides with obstacles
 * @param {number[]} head - [row, col]
 * @param {number[][]} obstacles - array of obstacle positions
 * @returns {boolean}
 */
export function checkObstacleCollision(head, obstacles) {
  if (!head || !Array.isArray(obstacles)) return false;
  return obstacles.some((obs) => obs[0] === head[0] && obs[1] === head[1]);
}

/**
 * Check if head eats food
 * @param {number[]} head - [row, col]
 * @param {number[]} food - [row, col] or null
 * @returns {boolean}
 */
export function checkFoodCollision(head, food) {
  if (!head || !food) return false;
  return head[0] === food[0] && head[1] === food[1];
}

/**
 * Generate random position avoiding exclusions
 * @param {number} boardSize
 * @param {Set<string>} excludedPositions - keys like "0,0"
 * @param {number} maxAttempts - fail-safe
 * @returns {number[] | null}
 */
export function generateRandomPosition(boardSize, excludedPositions, maxAttempts = 100) {
  if (!boardSize) return null;
  const excluded = excludedPositions || new Set();

  for (let i = 0; i < maxAttempts; i++) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    const key = `${row},${col}`;
    if (!excluded.has(key)) {
      return [row, col];
    }
  }
  console.warn("generateRandomPosition: exhausted attempts, returning null");
  return null;
}

/**
 * Apply level settings to game state
 * @param {Object} levelConfig
 * @returns {Object} normalized level settings
 */
export function applyLevelSettings(levelConfig) {
  if (!levelConfig) {
    console.warn("applyLevelSettings: missing levelConfig, using defaults");
    return {
      boardSize: 20,
      cellSize: 20,
      baseTick: 150,
      foodScore: 10,
      theme: {},
      features: {},
      obstacles: [],
    };
  }

  return {
    boardSize: levelConfig.boardSize || 20,
    cellSize: levelConfig.cellSize || 20,
    baseTick: levelConfig.baseTick || 150,
    foodScore: levelConfig.foodScore || 10,
    theme: levelConfig.theme || {},
    features: levelConfig.features || {},
    obstacles: Array.isArray(levelConfig.obstacles) ? levelConfig.obstacles : [],
  };
}

/**
 * Validate direction change (prevent 180° instant reversals)
 * @param {number[]} currentDir
 * @param {number[]} newDir
 * @returns {boolean}
 */
export function isValidDirectionChange(currentDir, newDir) {
  if (!currentDir || !newDir) return false;
  // Prevent moving directly backward
  return !(currentDir[0] === -newDir[0] && currentDir[1] === -newDir[1]);
}

// Test helper exports (for Jest/test frameworks)
export const GameLogicTests = {
  calculateNextHead,
  checkSelfCollision,
  checkObstacleCollision,
  checkFoodCollision,
  generateRandomPosition,
  applyLevelSettings,
  isValidDirectionChange,
};
