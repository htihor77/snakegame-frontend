export const LEVEL_5 = {
  id: 5,
  name: "Impossible",
  description: "Can you survive?",
  boardSize: 28,
  cellSize: 14,
  baseTick: 50,
  speedMultiplier: 2,
  foodScore: 50,
  theme: {
    background: "#1a0000",
    snakeHead: "#ffff00",
    snakeBody: "#ff0000",
    food: "#00ff00",
    grid: "#660000",
    border: "#ff0000",
  },
  features: {
    wrap: true,
    obstacles: true,
    multipleFoods: true,
    speedBoost: true,
  },
  difficulty: 5,
  maxLevel: true,
  obstacles: [
    [4, 4], [4, 10], [4, 20], [4, 26],
    [11, 6], [11, 15], [11, 24],
    [18, 4], [18, 12], [18, 22],
    [26, 8], [26, 18]
  ],
};
