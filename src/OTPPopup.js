import React, { useState, useRef, useEffect } from "react";
import { verifyOTP } from "./api";

export default function OTPPopup({ email, onVerified, userName = "" }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOTP(email, otpCode);
      if (response.token && response.user) {
        onVerified(response.token, response.user.name);
      }
    } catch (err) {
      setError(err.message || "Invalid OTP");
    }

    setLoading(false);
  }

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
        zIndex: 1001,
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0d2818 0%, #1a4d2e 100%)",
          border: "2px solid #4ade80",
          borderRadius: "16px",
          padding: "40px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(74, 222, 128, 0.2)",
          textAlign: "center",
          animation: "slideUp 0.4s ease",
        }}
      >
        <h2 style={{ color: "#4ade80", margin: "0 0 10px 0", fontSize: "24px" }}>
          Verify OTP
        </h2>
        <p style={{ color: "#96f7c8", margin: "0 0 25px 0", fontSize: "13px" }}>
          Code sent to <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP Input Fields */}
          <div style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 20,
          }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => inputRefs.current[i] = el}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                maxLength="1"
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  background: "#051410",
                  border: `2px solid ${digit ? "#4ade80" : "#4ade80"}`,
                  borderRadius: "8px",
                  color: "#4ade80",
                  transition: "all 0.3s",
                  cursor: "text",
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
            ))}
          </div>

          {/* Timer */}
          <p style={{
            color: timer <= 60 ? "#ff6b6b" : "#96f7c8",
            fontSize: "13px",
            marginBottom: 15,
            fontWeight: "bold",
          }}>
            ⏱️ {formatTimer(timer)}
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: "#ff6b6b",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: 15,
              fontSize: "13px",
              fontWeight: "bold",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            style={{
              width: "100%",
              padding: "12px",
              background: loading || otp.join("").length !== 6 ? "#888" : "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "15px",
              boxShadow: "0 4px 15px rgba(74, 222, 128, 0.4)",
              transition: "all 0.3s",
            }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p style={{ color: "#4ade80", fontSize: "12px", marginTop: 15, marginBottom: 0 }}>
          🔒 Secure Authentication • Data encrypted
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
      `}</style>
    </div>
  );
}
