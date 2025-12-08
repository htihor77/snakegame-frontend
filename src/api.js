/**
 * CHANGELOG:
 * - Updated API_BASE to port 3001 (matching backend)
 * - Fixed endpoint paths to match backend routes
 * - Added better error logging with endpoint info
 * - Added response validation
 */

//const API_BASE =`https://snakegame-backend-g24u.vercel.app`;

const API_BASE = "https://snakegame-backend-vert.vercel.app";


console.log("API base (client):", (window.process && window.process.env && window.process.env.REACT_APP_API_URL) || process.env.REACT_APP_API_URL || typeof API_BASE !== "undefined" && API_BASE);


// Helper function to handle fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`[FETCH] ${options.method || "GET"} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[FETCH] ✅ Success:`, data);
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`[FETCH] ❌ Failed:`, err);
    
    if (err.name === "AbortError") {
      throw new Error("Request timeout - server not responding");
    }
    throw err;
  }
}

/**
 * Signup with email, password, and name
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<Object>}
 */
export async function signup(email, password, name) {
  try {
    if (!email || !password || !name) {
      throw new Error("Email, password, and name required");
    }

    console.log("[SIGNUP] Creating account:", email);

    const response = await fetchWithTimeout(
      `${API_BASE}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      },
      10000
    );

    if (!response.success) {
      throw new Error(response.error || "Signup failed");
    }

    console.log("[SIGNUP] ✅ Account created:", email);
    return response;
  } catch (err) {
    console.error("[SIGNUP] Error:", err);
    
    if (err.message.includes("Failed to fetch")) {
      throw new Error(
        `Connection failed - Backend not reachable at ${API_BASE}`
      );
    }
    throw err;
  }
}

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function login(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email and password required");
    }

    console.log("[LOGIN] Logging in:", email);

    const response = await fetchWithTimeout(
      `${API_BASE}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
      10000
    );

    if (!response.success) {
      throw new Error(response.error || "Login failed");
    }

    console.log("[LOGIN] ✅ Login successful:", email);
    return response;
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    
    if (err.message.includes("Failed to fetch")) {
      throw new Error(
        `Connection failed - Backend not reachable at ${API_BASE}`
      );
    }
    throw err;
  }
}

/**
 * Submit score to leaderboard
 * @param {string} token
 * @param {number} score
 * @param {number} level - game level (default 1)
 * @param {string} mode - game mode (default "classic")
 * @returns {Promise<Object>}
 */
export async function submitScore(token, score, level = 1, mode = "classic") {
  try {
    if (!token || typeof score !== "number" || score <= 0) {
      throw new Error("Token and valid score (> 0) required");
    }

    console.log("[SCORE] Submitting:", { score, level, mode, token: token.slice(0, 10) + "..." });

    const response = await fetchWithTimeout(
      `${API_BASE}/scores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, score, level, mode }),
      },
      8000
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to submit score");
    }

    console.log("[SCORE] ✅ Score submitted with ID:", response.id);
    return response;
  } catch (err) {
    console.error("[SCORE] Error:", err);
    throw err;
  }
}

/**
 * Get top scores leaderboard
 * @param {number} level - optional level filter
 * @returns {Promise<Array>}
 */
export async function getTopScores(level = 1) {
  try {
    console.log("[LEADERBOARD] Fetching top scores for level:", level);

    const response = await fetchWithTimeout(
      `${API_BASE}/scores/top?level=${level}`,
      {},
      8000
    );

    let scores = [];
    if (response.success && Array.isArray(response.data)) {
      scores = response.data;
    } else if (Array.isArray(response)) {
      scores = response;
    }

    console.log("[LEADERBOARD] ✅ Loaded", scores.length, "scores");
    return scores;
  } catch (err) {
    console.error("[LEADERBOARD] Error:", err);
    return [];
  }
}

/**
 * Request OTP for login/signup
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function requestOTP(email) {
  try {
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email format");
    }

    console.log(`[OTP] Requesting OTP for:`, email);

    const response = await fetchWithTimeout(
      `${API_BASE}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
      10000
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to send OTP");
    }

    console.log("[OTP] ✅ OTP sent to:", email);
    return response;
  } catch (err) {
    console.error("[OTP] Error:", err);
    throw err;
  }
}

/**
 * Verify OTP and get authentication token
 * @param {string} email
 * @param {string} otp
 * @param {string} name - optional, for signup
 * @returns {Promise<Object>}
 */
export async function verifyOTP(email, otp, name = null) {
  try {
    if (!email || !otp) {
      throw new Error("Email and OTP required");
    }

    if (otp.length !== 4 || isNaN(otp)) {
      throw new Error("OTP must be 4 digits");
    }

    console.log("[VERIFY] Verifying OTP for:", email);

    const response = await fetchWithTimeout(
      `${API_BASE}/auth/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, name }),
      },
      10000
    );

    if (!response.success || !response.token) {
      throw new Error(response.error || "OTP verification failed");
    }

    console.log("[VERIFY] ✅ OTP verified for:", email);
    
    return {
      token: response.token,
      user: {
        name: response.name || "Player",
        email: response.email || email,
      },
    };
  } catch (err) {
    console.error("[VERIFY] Error:", err);
    throw err;
  }
}
