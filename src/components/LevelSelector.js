/**
 * CHANGELOG:
 * - New component for level selection
 * - Displays all available levels with descriptions
 * - Allows switching at any time
 * - Persists selection to localStorage
 */

import React, { useState } from "react";
import { getAllLevels } from "../LevelManager";

export default function LevelSelector({ currentLevel, onLevelChange, levelConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const levels = getAllLevels();

  if (!levels || levels.length === 0) {
    console.warn("LevelSelector: no levels available");
    return null;
  }

  const handleLevelSelect = (levelId) => {
    onLevelChange?.(levelId);
    localStorage.setItem("snake_selectedLevel", levelId.toString());
    setIsOpen(false);
  };

 // const currentLevelName = levelConfig?.name || "Unknown";

 const currentLevelName =levelConfig?.name || `Level ${currentLevel}`;


  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "10px 16px",
          background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.boxShadow = "0 4px 12px rgba(74, 222, 128, 0.4)")}
        onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
      >
        🎮 Level: {currentLevelName}
        <span style={{ fontSize: "12px" }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 8,
            background: "#0d2818",
            border: "2px solid #4ade80",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
            minWidth: 280,
            zIndex: 100,
            animation: "slideDown 0.2s ease",
          }}
        >
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level.id)}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                background: currentLevel === level.id ? "#4ade80" : "transparent",
                color: currentLevel === level.id ? "#000" : "#96f7c8",
                border: "none",
                borderBottom: level.id < levels.length ? "1px solid #1a4d2e" : "none",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = currentLevel === level.id ? "#4ade80" : "#1a4d2e";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = currentLevel === level.id ? "#4ade80" : "transparent";
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                Level {level.id}: {level.name}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                {level.description}
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
