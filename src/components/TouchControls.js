/**
 * CHANGELOG:
 * - New component for unified touch/pointer/mouse controls
 * - Supports swipe detection with debounce
 * - On-screen D-pad for mobile
 * - Graceful fallback for unsupported events
 */

import React, { useEffect, useRef, useState } from "react";

export default function TouchControls({ onDirection, canvasRef }) {
  const pointerStartRef = useRef(null);
  const lastDirectionChangeRef = useRef(0);
  const DEBOUNCE_MS = 50; // Prevent rapid direction changes
  const SWIPE_THRESHOLD = 30; // pixels

  useEffect(() => {
    if (!canvasRef?.current) {
      console.warn("TouchControls: canvasRef not available");
      return;
    }

    const canvas = canvasRef.current;
    let isTouching = false;

    // Unified pointer event handler (preferred: handles mouse, touch, stylus)
    function handlePointerDown(e) {
      if (e.pointerType !== "mouse") {
        e.preventDefault?.();
      }
      pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      isTouching = true;
    }

    function handlePointerUp(e) {
      if (!pointerStartRef.current || !isTouching) return;
      isTouching = false;

      const start = pointerStartRef.current;
      const end = { x: e.clientX, y: e.clientY };
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      const now = Date.now();

      // Debounce
      if (now - lastDirectionChangeRef.current < DEBOUNCE_MS) {
        pointerStartRef.current = null;
        return;
      }

      // Only register significant swipes
      if (dist < SWIPE_THRESHOLD) {
        pointerStartRef.current = null;
        return;
      }

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Horizontal swipe
      if (absDx > absDy) {
        if (dx > 0) {
          onDirection?.([0, 1]); // Right
        } else {
          onDirection?.([0, -1]); // Left
        }
        lastDirectionChangeRef.current = now;
      }
      // Vertical swipe
      else if (absDy > absDx) {
        if (dy > 0) {
          onDirection?.([1, 0]); // Down
        } else {
          onDirection?.([-1, 0]); // Up
        }
        lastDirectionChangeRef.current = now;
      }

      pointerStartRef.current = null;
    }

    // Attach listeners
    canvas.addEventListener("pointerdown", handlePointerDown, { passive: true });
    canvas.addEventListener("pointerup", handlePointerUp, { passive: true });

    // Fallback for browsers without pointer events
    if (!window.PointerEvent) {
      canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
      canvas.addEventListener("touchend", (e) =>
        handlePointerUp({ ...e, clientX: e.changedTouches?.[0]?.clientX || 0, clientY: e.changedTouches?.[0]?.clientY || 0 })
      );
    }

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      if (!window.PointerEvent) {
        canvas.removeEventListener("touchstart", handlePointerDown);
        canvas.removeEventListener("touchend", handlePointerUp);
      }
    };
  }, [canvasRef, onDirection]);

  // On-screen D-pad
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        gap: 12,
      }}
      aria-label="Direction controls"
    >
      {/* Up Button */}
      <button
        onPointerDown={() => onDirection?.([-1, 0])}
        onTouchStart={() => onDirection?.([-1, 0])}
        style={{
          width: 48,
          height: 48,
          background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          fontSize: "20px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        ↑
      </button>

      {/* Container for Left/Right */}
      <div style={{ display: "flex", gap: 12 }}>
        {/* Left Button */}
        <button
          onPointerDown={() => onDirection?.([0, -1])}
          onTouchStart={() => onDirection?.([0, -1])}
          style={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          ←
        </button>

        {/* Right Button */}
        <button
          onPointerDown={() => onDirection?.([0, 1])}
          onTouchStart={() => onDirection?.([0, 1])}
          style={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          →
        </button>
      </div>

      {/* Down Button */}
      <button
        onPointerDown={() => onDirection?.([1, 0])}
        onTouchStart={() => onDirection?.([1, 0])}
        style={{
          width: 48,
          height: 48,
          background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          fontSize: "20px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        ↓
      </button>
    </div>
  );
}
