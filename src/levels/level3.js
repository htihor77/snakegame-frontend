export const LEVEL_3 = {
  id: 3,
  name: "Wrapping World",
  description: "Walls wrap around - stay focused!",
  boardSize: 24,
  cellSize: 16,
  baseTick: 90,
  speedMultiplier: 1.4,
  foodScore: 20,
  theme: {
    background: "#0a0a1a",
    snakeHead: "#00ffff",
    snakeBody: "#0099ff",
    food: "#ff00ff",
    grid: "#001a33",
    border: "#00ffff",
  },
  features: {
    wrap: true,
    obstacles: true,
    multipleFoods: true,
    speedBoost: false,
  },
  difficulty: 3,
  maxLevel: false,
  obstacles: [
    [6, 8], [6, 15], [12, 5], [12, 18], [18, 8], [18, 15]
  ],
};
