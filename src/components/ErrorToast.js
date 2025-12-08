/**
 * CHANGELOG:
 * - New component for displaying non-blocking error/warning toasts
 * - Auto-dismiss after 5 seconds
 * - Accessible and responsive
 */

import React, { useState, useEffect } from "react";

export default function ErrorToast({ message, type = "error", onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [message, onDismiss]);

  if (!visible || !message) return null;

  const bgColor = type === "error" ? "#ff6b6b" : type === "warning" ? "#ffa500" : "#4ade80";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: bgColor,
        color: type === "warning" ? "#000" : "white",
        padding: "16px 24px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        fontSize: "14px",
        fontWeight: "500",
        zIndex: 9999,
        animation: "slideInUp 0.3s ease",
        maxWidth: "90vw",
      }}
      role="alert"
      aria-live="polite"
    >
      {message}
      <button
        onClick={() => setVisible(false)}
        style={{
          marginLeft: 12,
          background: "transparent",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>
  );
}
