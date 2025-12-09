// SnakeGame.js — FINAL VERSION (Part 1/4)
// Includes: Auth popup + OTP popup + Direction Buttons + Leaderboard + Game

import React, { useEffect, useRef, useState, useCallback } from "react";
import { submitScore, getTopScores } from "./api";
import AuthPopup from "./AuthPopup";
import TouchControls from "./components/TouchControls";
import LevelSelector from "./components/LevelSelector";
import ErrorToast from "./components/ErrorToast";
import { getLevelConfig, getTotalLevels } from "./LevelManager";
import {
  calculateNextHead,
  checkSelfCollision,
  checkObstacleCollision,
  checkFoodCollision,
  generateRandomPosition,
  isValidDirectionChange,
} from "./utils/gameLogic";

export default function SnakeGame() {
  // ===== REFS =====
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const accRef = useRef(0);
  const tickRef = useRef(120);
  const dirRef = useRef([0, 1]);

  // ===== STATE =====
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState("error");
  const [snake, setSnake] = useState([[12, 10], [12, 11], [12, 12]]);
  const [food, setFood] = useState(null);
  const [foodPopAnimation, setFoodPopAnimation] = useState(false);
const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelConfig, setLevelConfig] = useState(() => getLevelConfig(1));
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpDelay, setLevelUpDelay] = useState(null);
  const [readyToStart, setReadyToStart] = useState(false);

  // ===== AUTH STATE =====
  const [token, setToken] = useState(localStorage.getItem("snake_token") || null);
  const [userName, setUserName] = useState(localStorage.getItem("snake_name") || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("snake_email") || null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(!token); // Show welcome only once

  // ===== LEADERBOARD STATE =====
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===== RESPONSIVE STATE =====
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const isMobile = screenSize.width < 768;

  // ===== EFFECTS =====

 
  useEffect(() => {
  loadLeaderboard(currentLevel);
}, [currentLevel]);


  useEffect(() => {
    function handleResize() {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pause when any popup opens
  // useEffect(() => {
  //   if ((showWelcomePopup || showAuthPopup || sidebarOpen) && running && !gameOver) {
  //     setWasRunning(true);
  //     setRunning(false);
  //   }
  // }, [showWelcomePopup, showAuthPopup, sidebarOpen, running, gameOver]);

  // // Resume when all popups close
  // useEffect(() => {
  //   if (!showWelcomePopup && !showAuthPopup && !sidebarOpen && wasRunning && !gameOver) {
  //     setRunning(true);
  //     setWasRunning(false);
  //   }
  // }, [showWelcomePopup, showAuthPopup, sidebarOpen, wasRunning, gameOver]);

  useEffect(() => {
  if ((showWelcomePopup || showAuthPopup || sidebarOpen) && running) {
    setRunning(false);
  }
}, [showWelcomePopup, showAuthPopup, sidebarOpen, running]);

  // Game over automatically pauses
  useEffect(() => {
    if (gameOver && running) {
      setRunning(false);
    }
  }, [gameOver, running]);

  useEffect(() => {
    if (!levelConfig?.foodScore) return;
    const levelThreshold = currentLevel * 5;
    const foodsEaten = levelScore / levelConfig.foodScore;

    if (foodsEaten >= levelThreshold && currentLevel < getTotalLevels()) {
      setShowLevelUp(true);
      setRunning(false);
      setReadyToStart(false);
      const timeout = setTimeout(() => {
        setCurrentLevel((c) => c + 1);
        setShowLevelUp(false);
      }, 3000);
      setLevelUpDelay(timeout);
    }
  }, [levelScore, currentLevel, levelConfig]);

  useEffect(() => {
    try {
      const config = getLevelConfig(currentLevel);
      if (!config) throw new Error(`Invalid level: ${currentLevel}`);
      setLevelConfig(config);

      dirRef.current = [0, 1];
      tickRef.current = config.baseTick || 120;

      const boardSize = config.boardSize || 20;
      const initSnake = [[Math.floor(boardSize / 2), Math.floor(boardSize / 2) - 1]];
      setSnake(initSnake);

      const snakeSet = new Set([`${initSnake[0][0]},${initSnake[0][1]}`]);
      if (Array.isArray(config.obstacles)) {
        config.obstacles.forEach((obs) => snakeSet.add(`${obs[0]},${obs[1]}`));
      }

      const newFood = generateRandomPosition(boardSize, snakeSet);
      setFood(newFood || [1, 1]);

      setScore(0);
      setLevelScore(0);
      setRunning(false);
      setReadyToStart(false);
      setGameOver(false);
      setShowLevelUp(false);
    } catch (err) {
      console.error("Error updating level:", err);
      setError(`Failed to load level: ${err.message}`);
      setErrorType("error");
    }
  }, [currentLevel]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowUp" && isValidDirectionChange(dirRef.current, [-1, 0])) {
        dirRef.current = [-1, 0];
      }
      if (e.key === "ArrowDown" && isValidDirectionChange(dirRef.current, [1, 0])) {
        dirRef.current = [1, 0];
      }
      if (e.key === "ArrowLeft" && isValidDirectionChange(dirRef.current, [0, -1])) {
        dirRef.current = [0, -1];
      }
      if (e.key === "ArrowRight" && isValidDirectionChange(dirRef.current, [0, 1])) {
        dirRef.current = [0, 1];
      }
      if (e.key === " ") {
        e.preventDefault();
        setRunning((r) => !r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ===== FUNCTIONS =====

 async function loadLeaderboard(level = currentLevel) {
  setLoadingBoard(true);
  try {
    const data = await getTopScores(level);
    setLeaderboard(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }
  setLoadingBoard(false);
}

  function handleWelcomePlayForFun() {
    setShowWelcomePopup(false);
    setRunning(true);
    setReadyToStart(true);
  }

  function handleWelcomeSignIn() {
    setShowAuthPopup(true);
    setShowWelcomePopup(false);
  }

  function handleAuthSuccess(token, email, name) {
    setToken(token);
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem("snake_token", token);
    localStorage.setItem("snake_name", name);
    localStorage.setItem("snake_email", email);
    setShowAuthPopup(false);
    setShowWelcomePopup(false);
  }

  function logoutUser() {
    setToken(null);
    setUserName(null);
    setUserEmail(null);
    localStorage.removeItem("snake_token");
    localStorage.removeItem("snake_name");
    localStorage.removeItem("snake_email");
    setSidebarOpen(false);
    setShowWelcomePopup(true);
  }

  async function submitScoreToLeaderboard() {
    if (!token || score <= 0) return;
    try {
      const result = await submitScore(token, score, currentLevel, "classic");
      if (result.updated) {
        setError("✅ New best score!");
        setErrorType("success");
      } else {
        // setError(`⚠️ Keep going! Best: ${result.bestScore}`);
        setErrorType("warning");
      }
   await loadLeaderboard(currentLevel);

    } catch (err) {
      console.error("[GAME] Score submission error:", err);
    }
  }

  const exitGame = () => {
  if (window.confirm("Are you sure you want to leave the game?")) {
    window.location.href = "/";
  }
};


  const step = useCallback(() => {
    try {
      setSnake((prev) => {
        if (!prev || prev.length === 0 || !levelConfig) return prev;

        const head = prev[prev.length - 1];
        const { head: newHead, collision: boundaryCollision } = calculateNextHead(
          head,
          dirRef.current,
          levelConfig.boardSize || 20,
          levelConfig.features?.wrap || false
        );

        if (boundaryCollision || checkSelfCollision(newHead, prev)) {
          endGame();
          return prev;
        }

        if (levelConfig.features?.obstacles && levelConfig.obstacles) {
          if (checkObstacleCollision(newHead, levelConfig.obstacles)) {
            endGame();
            return prev;
          }
        }

        const newSnake = [...prev, newHead];
        const ate = checkFoodCollision(newHead, food);

        if (!ate) {
          newSnake.shift();
        } else {
          const newLevelScore = levelScore + (levelConfig.foodScore || 10);
          setLevelScore(newLevelScore);
          setScore((s) => s + (levelConfig.foodScore || 10));
          setFoodPopAnimation(true);
          setTimeout(() => setFoodPopAnimation(false), 200);

          const snakeSet = new Set(newSnake.map((p) => `${p[0]},${p[1]}`));
          if (levelConfig.obstacles) {
            levelConfig.obstacles.forEach((obs) => snakeSet.add(`${obs[0]},${obs[1]}`));
          }

          const newFood = generateRandomPosition(levelConfig.boardSize || 20, snakeSet);
          if (newFood) setFood(newFood);
        }

        return newSnake;
      });
    } catch (err) {
      console.error("Error in game step:", err);
    }
  }, [levelConfig, food, levelScore]);

  function endGame() {
    setRunning(false);
    setGameOver(true);
    submitScoreToLeaderboard();
  }

  function restart() {
    if (levelUpDelay) clearTimeout(levelUpDelay);

    setGameOver(false);
    setRunning(false);
    setScore(0);
    setLevelScore(0);
    setCurrentLevel(1);
    setShowLevelUp(false);
    setReadyToStart(false);
    
    dirRef.current = [0, 1];
    accRef.current = 0;
    lastRef.current = 0;

    const boardSize = 20;
    const initSnake = [[Math.floor(boardSize / 2), Math.floor(boardSize / 2) - 1]];
    setSnake(initSnake);
    setFood([1, 1]);
  }

  function startLevel() {
    setReadyToStart(true);
    setRunning(true);
  }

  useEffect(() => {
    function loop(ts) {
      if (!lastRef.current) lastRef.current = ts;

      const dt = ts - lastRef.current;
      lastRef.current = ts;

      if (running && !gameOver) {
        accRef.current += dt;
        while (accRef.current >= tickRef.current) {
          step();
          accRef.current -= tickRef.current;
        }
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, gameOver, step, levelConfig, snake, food]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cellSize = levelConfig?.cellSize || 20;
    const boardSize = levelConfig?.boardSize || 20;
    const size = boardSize * cellSize;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    ctx.scale(dpr, dpr);

    const bg = "#0a0f0d";
    const gridColor = "#1a2620";
    const snakeHeadColor = "#00ffa5";
    const snakeBodyColor = "#4ade80";
    const foodColor = "#ff6b9d";
    const borderColor = "#4ade80";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= boardSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    if (levelConfig?.features?.obstacles && levelConfig.obstacles) {
      ctx.fillStyle = "rgba(255, 100, 100, 0.3)";
      levelConfig.obstacles.forEach((obs) => {
        const x = obs[1] * cellSize;
        const y = obs[0] * cellSize;
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
      });
    }

    if (Array.isArray(snake)) {
      snake.forEach((p, i) => {
        const x = p[1] * cellSize;
        const y = p[0] * cellSize;
        ctx.fillStyle = i === snake.length - 1 ? snakeHeadColor : snakeBodyColor;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        
        if (i === snake.length - 1) {
          ctx.shadowColor = snakeHeadColor;
          ctx.shadowBlur = 12;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          ctx.shadowBlur = 0;
        }
      });
    }

    if (food && Array.isArray(food)) {
      const fx = food[1] * cellSize;
      const fy = food[0] * cellSize;
      const scale = foodPopAnimation ? 1.3 : 1;
      const radius = (cellSize / 2.5) * scale;
      
      ctx.fillStyle = foodColor;
      ctx.shadowColor = foodColor;
      ctx.shadowBlur = foodPopAnimation ? 20 : 10;
      ctx.beginPath();
      ctx.arc(fx + cellSize / 2, fy + cellSize / 2, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
  }, [levelConfig, snake, food, foodPopAnimation]);

  return (
    <div style={styles.container}>
      {error && (
        <ErrorToast
          message={error}
          type={errorType}
          onDismiss={() => setError(null)}
        />
      )}

      {/* SIDEBAR TOGGLE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          ...styles.sidebarToggle,
          transform: sidebarOpen ? "translateY(-50%) scale(1.1)" : "translateY(-50%)",
        }}
        title={sidebarOpen ? "Close" : "Menu"}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>



      {/* SIDEBAR */}
      <div style={{
        ...styles.sidebar,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      }}>

        <button
  style={{ marginTop: 20, background: "#ff5555" }}
  onClick={exitGame}
>
  Exit Game
</button>
        <div style={styles.sidebarHeader}>
          <h2 style={{ color: "#4ade80", margin: "0 0 5px 0", fontSize: "18px" }}>🐍</h2>
          <p style={{ color: "#96f7c8", fontSize: "11px", margin: 0 }}>Snake Game</p>
        </div>

        {/* USER SECTION - Dynamic based on login */}
        <div style={styles.userSection}>
          {token ? (
            <div>
              <p style={{ color: "#96f7c8", fontSize: "11px", margin: "0 0 3px 0" }}>👤 Profile</p>
              <p style={{ color: "#4ade80", fontSize: "12px", fontWeight: "bold", margin: 0 }}>
                {userName}
              </p>
              <p style={{ color: "#96f7c8", fontSize: "9px", margin: "3px 0 8px 0", wordBreak: "break-all" }}>
                {userEmail}
              </p>
              <button
                onClick={logoutUser}
                style={styles.logoutBtn}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: "#96f7c8", fontSize: "11px", margin: "0 0 8px 0" }}>Not signed in</p>
              <button
                onClick={() => {
                  setShowAuthPopup(true);
                  setSidebarOpen(false);
                }}
                style={styles.signInBtn}
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* LEADERBOARD - Only if logged in */}
        {/* {token && (
          <div style={styles.leaderboardSection}>
            <div style={styles.leaderboardHeader}>
              <h3 style={{ color: "#4ade80", margin: 0, fontSize: "13px" }}>🏆</h3>
              <button
  onClick={() => loadLeaderboard(currentLevel)}
  style={styles.refreshBtn}
>
  {loadingBoard ? "..." : "⟳"}
</button>

            </div>

            {loadingBoard ? (
              <p style={{ textAlign: "center", color: "#96f7c8", fontSize: "11px" }}>Loading…</p>
            ) : leaderboard.length === 0 ? (
              <p style={{ color: "#96f7c8", fontSize: "11px" }}>No scores yet</p>
            ) : (
              <div style={styles.leaderboardList}>
                {leaderboard.slice(0, 10).map((score, i) => {
                  const rank = score.rank || (i + 1);
                  const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "•";
                  
                  return (
                    <div key={i} style={styles.leaderboardCard(rank)}>
                      <div style={styles.leaderboardRow}>
                        <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: "11px" }}>
                          {medalEmoji}
                        </span>
                        <span style={{ color: "#96f7c8", fontSize: "10px", flex: 1 }}>
                          {score.name}
                        </span>
                        <span style={{ color: "#00ffa5", fontWeight: "bold", fontSize: "11px" }}>
                          {score.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )} */}


        {/* LEADERBOARD - Only if logged in */}
{token && (
  <div style={styles.leaderboardSection}>
    <div style={styles.leaderboardHeader}>
      <h3 style={{ color: "#4ade80", margin: 0, fontSize: "13px" }}>
        🏆 Level {currentLevel}
      </h3>
      <button
        onClick={() => loadLeaderboard(currentLevel)}
        style={styles.refreshBtn}
      >
        {loadingBoard ? "..." : "⟳"}
      </button>
    </div>

    {loadingBoard ? (
      <p style={{ textAlign: "center", color: "#96f7c8", fontSize: "11px" }}>Loading…</p>
    ) : leaderboard.length === 0 ? (
      <p style={{ color: "#96f7c8", fontSize: "11px" }}>No scores yet</p>
    ) : (
      <div style={styles.leaderboardList}>
        {leaderboard.slice(0, 10).map((score, i) => {
          const rank = score.rank || (i + 1);
          const medalEmoji =
            rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "•";

          return (
            <div key={i} style={styles.leaderboardCard(rank)}>
              <div style={styles.leaderboardRow}>
                <span style={{ color: "#4ade80", fontWeight: "bold", fontSize: "11px" }}>
                  {medalEmoji}
                </span>

                <span style={{ color: "#96f7c8", fontSize: "10px", flex: 1 }}>
                  {score.name}
                </span>

                {/* 👇 NEW: show level */}
                <span style={{ color: "#a5b4fc", fontSize: "10px", marginRight: 6 }}>
                  L{score.level ?? currentLevel}
                </span>

                <span style={{ color: "#00ffa5", fontWeight: "bold", fontSize: "11px" }}>
                  {score.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

      </div>

      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={styles.overlay}
        />
      )}

      {/* MAIN GAME AREA */}
      <div style={{
        ...styles.gameArea,
        marginLeft: sidebarOpen && !isMobile ? "280px" : "0",
      }}>
        {/* CONTROLS */}
        <div style={styles.controlsTop}>
          <button onClick={() => setRunning((r) => !r)} style={styles.btnPrimary}>
            {running ? "⏸" : "▶"}
          </button>
          <button onClick={restart} style={styles.btnDanger}>
            🔄
          </button>
          <LevelSelector currentLevel={currentLevel} onLevelChange={setCurrentLevel} />
          {/* {!isMobile && <LevelSelector currentLevel={currentLevel} onLevelChange={setCurrentLevel} levelConfig={levelConfig} />} */}
        </div>

        {/* CANVAS */}
        <div style={styles.canvasContainer}>
          <canvas ref={canvasRef} style={styles.canvas} />
          <div style={styles.hud}>
            <div style={styles.hudItem}>
              <p style={styles.hudLabel}>LEVEL</p>
              <p style={styles.hudValue}>{currentLevel}</p>
            </div>
            <div style={{ width: "1px", background: "rgba(74, 222, 128, 0.2)" }} />
            <div style={styles.hudItem}>
              <p style={styles.hudLabel}>SCORE</p>
              <p style={styles.hudValue}>{score}</p>
            </div>
          </div>
        </div>

        {/* TOUCH CONTROLS */}
        <TouchControls
          canvasRef={canvasRef}
          onDirection={(dir) => {
            if (isValidDirectionChange(dirRef.current, dir)) {
              dirRef.current = dir;
            }
          }}
        />

        {/* WELCOME POPUP */}
        {showWelcomePopup && !token && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={{ color: "#4ade80", fontSize: "32px", margin: 0 }}>🐍</h2>
              <p style={{ color: "#96f7c8", fontSize: "14px", margin: "12px 0", fontWeight: "600" }}>
                Welcome to Snake Game
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={handleWelcomePlayForFun} style={styles.btnPrimary}>
                  Play for Fun
                </button>
                <button onClick={handleWelcomeSignIn} style={{ ...styles.btnPrimary, background: "linear-gradient(135deg, #00ffa5 0%, #4ade80 100%)" }}>
                  Sign In to Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* READY TO START */}
        {!gameOver && !running && !showLevelUp && !readyToStart && currentLevel > 0 && !showWelcomePopup && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={{ color: "#4ade80", fontSize: "32px", margin: 0 }}>🎮</h2>
              <p style={{ color: "#4ade80", fontSize: "18px", margin: "8px 0 0 0", fontWeight: "bold" }}>
                LEVEL {currentLevel}
              </p>
              <p style={{ color: "#96f7c8", fontSize: "12px", margin: "5px 0 15px 0" }}>
                Catch {currentLevel * 5} foods
              </p>
              <button onClick={startLevel} style={{ ...styles.btnPrimary, width: "100%" }}>
                Start Playing
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER */}
        {gameOver && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={{ color: "#ff8a80", margin: 0, fontSize: "28px" }}>GAME OVER</h2>
              <p style={{ color: "#d6f7cf", margin: "8px 0", fontSize: "13px" }}>
                Level {currentLevel} • {score} pts
              </p>
              {token ? (
                <button onClick={restart} style={{ ...styles.btnPrimary, marginTop: "12px", width: "100%" }}>
                  Play Again
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                  <button onClick={() => setShowAuthPopup(true)} style={{ ...styles.btnPrimary, width: "100%" }}>
                    Sign In to Save
                  </button>
                  <button onClick={restart} style={{ ...styles.btnDanger, width: "100%" }}>
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEVEL UP */}
        {showLevelUp && (
          <div style={styles.modalOverlay}>
            <div style={{...styles.modal, animation: "pulse 0.6s ease-in-out"}}>
              <h2 style={{ color: "#4ade80", fontSize: "32px", margin: 0 }}>⭐</h2>
              <p style={{ color: "#4ade80", fontSize: "18px", margin: "8px 0 0 0", fontWeight: "bold" }}>
                LEVEL UP!
              </p>
              <p style={{ color: "#96f7c8", fontSize: "12px", margin: "5px 0 0 0" }}>
                Get ready for Level {currentLevel + 1}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AUTH POPUP */}
      {showAuthPopup && (
        <AuthPopup
          onClose={() => setShowAuthPopup(false)}
          onAuth={handleAuthSuccess}
        />
      )}

      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0;  background: #0a0f0d; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// ===== STYLES =====
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#0a0f0d",
    overflowX: "hidden",
  overflowY: "auto",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  sidebarToggle: {
    position: "fixed",
    left: 0,
    top: "50%",
    width: "40px",
    height: "55px",
    background: "linear-gradient(135deg, #4ade80 0%, #00ffa5 100%)",
    border: "none",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 4px 15px rgba(74, 222, 128, 0.3)",
    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "280px",
    height: "100vh",
    background: "linear-gradient(135deg, rgba(13, 40, 24, 0.98) 0%, rgba(26, 77, 46, 0.98) 100%)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(74, 222, 128, 0.15)",
    boxShadow: "4px 0 30px rgba(0, 0, 0, 0.4)",
    transform: "translateX(-100%)",
    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    zIndex: 99,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid rgba(74, 222, 128, 0.1)",
    background: "rgba(74, 222, 128, 0.05)",
  },
  userSection: {
    padding: "12px",
    borderBottom: "1px solid rgba(74, 222, 128, 0.1)",
  },
  signInBtn: {
    width: "100%",
    padding: "9px",
    background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 12px rgba(74, 222, 128, 0.25)",
  },
  logoutBtn: {
    width: "100%",
    marginTop: "8px",
    padding: "8px",
    background: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "11px",
    transition: "all 0.2s ease",
  },
  leaderboardSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    overflowY: "auto",
  },
  leaderboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  refreshBtn: {
    background: "#4ade80",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  leaderboardList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  leaderboardCard: (rank) => ({
    padding: "8px",
    background: rank <= 3 
      ? rank === 1 ? "rgba(255, 215, 0, 0.1)" : rank === 2 ? "rgba(192, 192, 192, 0.1)" : "rgba(205, 127, 50, 0.1)"
      : "rgba(74, 222, 128, 0.05)",
    border: "1px solid rgba(74, 222, 128, 0.15)",
    borderLeft: rank <= 3 
      ? rank === 1 ? "3px solid #ffd700" : rank === 2 ? "3px solid #c0c0c0" : "3px solid #cd7f32"
      : "3px solid #4ade80",
    borderRadius: "5px",
    transition: "all 0.2s ease",
  }),
  leaderboardRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "6px",
  },
  overlay: {
    position: "fixed",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    zIndex: 98,
    animation: "fadeIn 0.2s ease",
  },
  gameArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    transition: "margin-left 0.3s ease",
    gap: "12px",
  },
  controlsTop: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "9px 14px",
    background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
  },
  btnDanger: {
    padding: "9px 14px",
    background: "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
  },
  canvasContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  canvas: {
  background: "#0a0f0d",
  borderRadius: "10px",
  border: "2px solid #4ade80",
  boxShadow: "0 0 25px rgba(74, 222, 128, 0.25), inset 0 0 10px rgba(74, 222, 128, 0.03)",
  maxWidth: "100%",
  maxHeight: "65vh",   // ✅ don’t let canvas be taller than ~65% of screen
  height: "auto",
  display: "block",
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
},

  hud: {
    display: "flex",
    gap: "16px",
    padding: "10px 18px",
    background: "linear-gradient(135deg, rgba(74, 222, 128, 0.08) 0%, rgba(0, 255, 165, 0.04) 100%)",
    border: "1px solid rgba(74, 222, 128, 0.15)",
    borderRadius: "8px",
    textAlign: "center",
  },
  hudItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hudLabel: {
    color: "#96f7c8",
    fontSize: "10px",
    margin: 0,
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  hudValue: {
    color: "#00ffa5",
    fontSize: "16px",
    fontWeight: "700",
    margin: "4px 0 0 0",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease",
  },
  modal: {
    padding: "24px",
    background: "linear-gradient(135deg, rgba(13, 40, 24, 0.98) 0%, rgba(26, 77, 46, 0.98) 100%)",
    border: "2px solid #4ade80",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 0 40px rgba(74, 222, 128, 0.2)",
    backdropFilter: "blur(10px)",
    maxWidth: "280px",
    animation: "slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};




