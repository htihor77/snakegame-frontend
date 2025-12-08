/**
 * CHANGELOG:
 * - Migrated from OTP to email/password authentication
 * - Integrated signup and login APIs
 * - Enhanced error handling and validation
 * - Improved UI/UX for form inputs and buttons
 */

import React, { useState } from "react";
import { signup, login } from "./api";

export default function AuthPopup({ onClose, onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validate and update name (max 20 chars, allow spaces)
  function handleNameChange(e) {
    let value = e.target.value;
    value = value.slice(0, 20);
    setName(value);

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      setNameError("");
    } else if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
    } else if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
      setNameError("Only letters, spaces, hyphens, and apostrophes allowed");
    } else if (/\s{2,}/.test(trimmed)) {
      setNameError("No multiple consecutive spaces");
    } else {
      setNameError("");
    }
  }

  // Validate password (minimum 4 chars)
  function handlePasswordChange(e) {
    let value = e.target.value;
    setPassword(value);

    if (value.length === 0) {
      setPasswordError("");
    } else if (value.length < 4) {
      setPasswordError("Password must be at least 4 characters");
    } else {
      setPasswordError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate email
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }

      // Validate password
      if (!password || password.length < 4) {
        setError("Password must be at least 4 characters");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        // Validate name for signup
        const trimmedName = name.trim();

        if (!trimmedName) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }

        if (trimmedName.length < 2 || trimmedName.length > 20) {
          setError("Name must be 2-20 characters");
          setLoading(false);
          return;
        }

        if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
          setError("Name can only contain letters, spaces, hyphens, and apostrophes");
          setLoading(false);
          return;
        }

        if (/\s{2,}/.test(trimmedName)) {
          setError("Name cannot have multiple consecutive spaces");
          setLoading(false);
          return;
        }

        // Call signup API
        console.log("[AUTH] Signing up:", { email, name: trimmedName });
        const response = await signup(email, password, trimmedName);

        if (response.success) {
          console.log("[AUTH] Signup successful");
          onAuth(response.token, response.email, response.name);
        } else {
          throw new Error(response.error || "Signup failed");
        }
      } else {
        // Call login API
        console.log("[AUTH] Logging in:", email);
        const response = await login(email, password);

        if (response.success) {
          console.log("[AUTH] Login successful");
          onAuth(response.token, response.email, response.name);
        } else {
          throw new Error(response.error || "Login failed");
        }
      }
    } catch (err) {
      console.error("[AUTH] Error:", err);

      if (err.message.includes("Connection failed")) {
        setError("❌ Backend not running!\n\nPlease start: node index.js");
      } else if (err.message.includes("timeout")) {
        setError("⏱️ Request timeout. Server is slow.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("❌ Network error. Check http://localhost:3001");
      } else if (err.message.includes("already exists")) {
        setError("⚠️ User already exists. Please login or use different email.");
      } else if (err.message.includes("Invalid email or password")) {
        setError("⚠️ Invalid email or password");
      } else {
        setError("⚠️ " + (err.message || "Authentication failed"));
      }
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0d2818 0%, #1a4d2e 100%)",
          border: "2px solid #4ade80",
          borderRadius: "16px",
          padding: "40px",
          width: "90%",
          maxWidth: "420px",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(74, 222, 128, 0.2)",
          animation: "slideUp 0.4s ease",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h2
            style={{
              color: "#4ade80",
              margin: "0 0 10px 0",
              fontSize: "28px",
            }}
          >
            🐍 Snake Game
          </h2>
          <p
            style={{
              color: "#96f7c8",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Play, Compete & Conquer the Leaderboard
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 25,
            borderBottom: "2px solid #1a4d2e",
          }}
        >
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setName("");
              setNameError("");
              setPassword("");
              setPasswordError("");
            }}
            style={{
              flex: 1,
              padding: "12px",
              background: mode === "login" ? "#4ade80" : "transparent",
              color: mode === "login" ? "#000" : "#96f7c8",
              border: "none",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              transition: "all 0.3s",
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError("");
              setNameError("");
              setPassword("");
              setPasswordError("");
            }}
            style={{
              flex: 1,
              padding: "12px",
              background: mode === "signup" ? "#4ade80" : "transparent",
              color: mode === "signup" ? "#000" : "#96f7c8",
              border: "none",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              transition: "all 0.3s",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field (Signup only) */}
          {mode === "signup" && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label
                  style={{
                    display: "block",
                    color: "#96f7c8",
                    marginBottom: 8,
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Full Name
                </label>
                <span
                  style={{
                    fontSize: "12px",
                    color: name.length > 15 ? "#ff9800" : "#96f7c8",
                    fontWeight: "bold",
                  }}
                >
                  {name.length}/20
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g., Rohith P or Harish Kumar"
                maxLength="20"
                autoComplete="name"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#051410",
                  border: nameError ? "2px solid #ff6b6b" : "2px solid #4ade80",
                  borderRadius: "8px",
                  color: "#96f7c8",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  transition: "all 0.3s",
                }}
                onFocus={(e) => {
                  if (!nameError) {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.boxShadow = "0 0 10px rgba(74, 222, 128, 0.3)";
                  }
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              {nameError && (
                <p
                  style={{
                    color: "#ff6b6b",
                    fontSize: "12px",
                    margin: "6px 0 0 0",
                    fontWeight: "bold",
                  }}
                >
                  ⚠️ {nameError}
                </p>
              )}
              {!nameError && name.trim().length > 0 && (
                <p
                  style={{
                    color: "#4ade80",
                    fontSize: "12px",
                    margin: "6px 0 0 0",
                  }}
                >
                  ✓ Name accepted: "{name.trim()}"
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                color: "#96f7c8",
                marginBottom: 8,
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#051410",
                border: "2px solid #4ade80",
                borderRadius: "8px",
                color: "#96f7c8",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#22c55e";
                e.target.style.boxShadow = "0 0 10px rgba(74, 222, 128, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#4ade80";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label
                style={{
                  display: "block",
                  color: "#96f7c8",
                  marginBottom: 8,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Password
              </label>
              <span
                style={{
                  fontSize: "12px",
                  color: password.length > 0 && password.length < 4 ? "#ff9800" : "#96f7c8",
                  fontWeight: "bold",
                }}
              >
                {password.length}/min 4
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Minimum 4 characters"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#051410",
                border: passwordError ? "2px solid #ff6b6b" : "2px solid #4ade80",
                borderRadius: "8px",
                color: "#96f7c8",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                if (!passwordError) {
                  e.target.style.borderColor = "#22c55e";
                  e.target.style.boxShadow = "0 0 10px rgba(74, 222, 128, 0.3)";
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
            {passwordError && (
              <p
                style={{
                  color: "#ff6b6b",
                  fontSize: "12px",
                  margin: "6px 0 0 0",
                  fontWeight: "bold",
                }}
              >
                ⚠️ {passwordError}
              </p>
            )}
            {!passwordError && password.length >= 4 && (
              <p
                style={{
                  color: "#4ade80",
                  fontSize: "12px",
                  margin: "6px 0 0 0",
                }}
              >
                ✓ Password valid
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#ff6b6b",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: 15,
                fontSize: "13px",
                fontWeight: "bold",
                animation: "slideDown 0.3s ease",
                lineHeight: "1.4",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              !email ||
              !password ||
              password.length < 4 ||
              (mode === "signup" && (nameError || !name.trim()))
            }
            style={{
              width: "100%",
              padding: "12px",
              background:
                loading ||
                !email ||
                !password ||
                password.length < 4 ||
                (mode === "signup" && (nameError || !name.trim()))
                  ? "#888"
                  : "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor:
                loading ||
                !email ||
                !password ||
                password.length < 4 ||
                (mode === "signup" && (nameError || !name.trim()))
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "bold",
              fontSize: "15px",
              boxShadow: "0 4px 15px rgba(74, 222, 128, 0.4)",
              transition: "all 0.3s",
              marginBottom: 15,
            }}
            onMouseEnter={(e) => {
              if (
                !loading &&
                email &&
                password &&
                password.length >= 4 &&
                !(mode === "signup" && (nameError || !name.trim()))
              ) {
                e.target.style.boxShadow = "0 6px 25px rgba(74, 222, 128, 0.6)";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 4px 15px rgba(74, 222, 128, 0.4)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {loading
              ? `${mode === "login" ? "Logging in" : "Creating account"}...`
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            background: "transparent",
            color: "#96f7c8",
            border: "2px solid #96f7c8",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#1a4d2e";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
          }}
        >
          Cancel
        </button>

        {/* Info Text */}
        <p
          style={{
            textAlign: "center",
            color: "#4ade80",
            fontSize: "12px",
            marginTop: 15,
            marginBottom: 0,
          }}
        >
          🔒 Secure • Password Protected • Simple Login
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
