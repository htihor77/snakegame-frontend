export const LEVEL_4 = {
  id: 4,
  name: "Chaos Mode",
  description: "Multiple foods, obstacles everywhere!",
  boardSize: 26,
  cellSize: 15,
  baseTick: 90,
  speedMultiplier: 1.6,
  foodScore: 25,
  theme: {
    background: "#2a0a0a",
    snakeHead: "#ff1493",
    snakeBody: "#ff69b4",
    food: "#32ff7e",
    grid: "#440044",
    border: "#ff1493",
  },
  features: {
    wrap: true,
    obstacles: true,
    multipleFoods: true,
    speedBoost: true,
  },
  difficulty: 4,
  maxLevel: false,
  obstacles: [
    [5, 5], [5, 10], [5, 20], [12, 8], [12, 18], [19, 5], [19, 15], [19, 23]
  ],
};
