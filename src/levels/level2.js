export const LEVEL_2 = {
  id: 2,
  name: "Speed Runner",
  description: "Faster and trickier",
  boardSize: 22,
  cellSize: 18,
  baseTick: 110,
  speedMultiplier: 1.2,
  foodScore: 15,
  theme: {
    background: "#1a0a0a",
    snakeHead: "#ffff00",
    snakeBody: "#ff9800",
    food: "#00ff00",
    grid: "#332200",
    border: "#ff9800",
  },
  features: {
    wrap: false,
    obstacles: true,
    multipleFoods: false,
    speedBoost: true,
  },
  difficulty: 2,
  maxLevel: false,
  obstacles: [
    [5, 5], [5, 16], [10, 11], [15, 5], [15, 16]
  ],
};
