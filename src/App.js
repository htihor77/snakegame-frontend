
// import React, { useState } from "react";

// import SnakeGame from "./SnakeGame";

// export default function App(){

//   const [showInstructions, setShowInstructions] = useState(false);
//   return (
//     <div className="app">
//       <div className="header">
//         <div className="title">
         
        

//           <div style={{
//   display: "flex",
//   gap: "10px",
//   alignItems: "center"
// }}>
//   <h1 style={{ margin: 0 }}>Snake — Nokia-style</h1>
//   <p>Touch, swipe or use arrow keys. Double-tap to pause.</p>
//   <button
//     onClick={() => setShowInstructions(true)}
//     style={{
//       background: "transparent",
//       border: "1px solid #4ade80",
//       borderRadius: "4px",
//       color: "#4ade80",
//       padding: "2px 6px",
//       fontSize: "10px",
//       cursor: "pointer"
//     }}
//   >
//     Instructions
//   </button>
// </div>
//         </div>
//         <div className="controls">
//           <span className="small">Made with Love</span>
//         </div>
//       </div>

//       <SnakeGame />


//       {showInstructions && (
//   <div style={styles.modalOverlay}>
//     <div style={styles.modal}>
      
//       <h2 style={{color:"#4ade80", marginBottom:10}}>📘 How to Play</h2>

// <p style={{color:"#96f7c8", fontSize:"13px", lineHeight:"18px"}}>
//   Your goal is simple: eat as much food as possible without hitting walls,
//   yourself, or obstacles.
// </p>

// <h3 style={{color:"#4ade80", fontSize:"14px", marginTop:12}}>🎮 Controls</h3>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   Desktop: Use Arrow Keys ↑ ↓ ← →  
//   Space = Pause / Resume  
// </p>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   Mobile: Swipe OR tap the on–screen direction arrows
// </p>

// <h3 style={{color:"#4ade80", fontSize:"14px", marginTop:12}}>⭐ Level Progression</h3>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   You must eat enough food to level up.  
//   Each level becomes faster and adds more obstacles.
// </p>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   Levels unlock automatically. Try to reach Level 5!
// </p>

// <h3 style={{color:"#4ade80", fontSize:"14px", marginTop:12}}>🏆 Leaderboard Rules</h3>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   You must Sign In to save scores.
// </p>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   Only your highest score per level is counted.
// </p>

// <h3 style={{color:"#4ade80", fontSize:"14px", marginTop:12}}>⛔ Obstacles</h3>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   Watch out! Levels include rocks and walls. Touching any obstacle ends the game instantly.
// </p>

// <h3 style={{color:"#4ade80", fontSize:"14px", marginTop:12}}>⏸ Pause</h3>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   Pause anytime: Press Space or tap the Play/Pause button
// </p>

// <h3 style={{color:"#4ade80", fontSize:"14px", marginTop:12}}>🚪 Exit</h3>
// <p style={{color:"#96f7c8", fontSize:"13px"}}>
//   You can exit anytime using the menu button. Your score will be submitted automatically if signed in.
// </p>

// <h3 style={{color:"#4ade80", fontSize:"14px", marginTop:12}}>💡 Tips</h3>
// <ul style={{textAlign:"left", paddingLeft:20, color:"#96f7c8", fontSize:"13px", lineHeight:"18px"}}>
//   <li>Try to control speed by moving smaller steps</li>
//   <li>Use walls for turning tricks</li>
//   <li>Focus on corners only when required</li>
//   <li>Avoid tight zig-zags</li>
//   <li>Plan food pickups strategically</li>
// </ul>


//       <button onClick={() => setShowInstructions(false)}
//               style={{ ...styles.btnPrimary, marginTop: 20 }}>
//         Close
//       </button>

//     </div>
//   </div>
// )}
//       <footer style={{marginTop:20, textAlign:"center"}} className="small">Tip: Press Space to toggle pause on desktop</footer>
//     </div>
//   );
// }


// src/App.js
import React, { useState } from "react";
import SnakeGame from "./SnakeGame";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(74,222,128,0.06)",
  },
  titleRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  instructionsBtn: {
    background: "transparent",
    border: "1px solid #4ade80",
    borderRadius: "4px",
    color: "#4ade80",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#0d2818",
    border: "2px solid #4ade80",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "420px",
    textAlign: "left",
    color: "#96f7c8",
  },
  btnPrimary: {
    marginTop: 20,
    width: "100%",
    background: "#4ade80",
    color: "#000",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
  },
  small: {
    color: "#9ca3af",
    fontSize: "13px",
  },
};

export default function App() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="app" style={{ minHeight: "100vh", background: "#07110b" }}>
      <div className="header" style={styles.header}>
        <div className="title" style={styles.titleRow}>
          <div>
            <h1 style={{ margin: 0, color: "#d1fae5" }}>Snake — Nokia-style</h1>
            <p style={{ margin: 0, color: "#96f7c8", fontSize: 13 }}>
              Touch, swipe or use arrow keys. Double-tap to pause.
            </p>
          </div>

          <button
            onClick={() => setShowInstructions(true)}
            style={styles.instructionsBtn}
            aria-label="Open Instructions"
          >
            Instructions
          </button>
        </div>

        <div className="controls">
          <span style={styles.small}>Made with Love</span>
        </div>
      </div>

      <SnakeGame />

      {/* Instructions Modal */}
      {showInstructions && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={{ color: "#4ade80", marginTop: 0 }}>📘 How to Play</h2>

            <p style={{ fontSize: 13, lineHeight: "18px" }}>
              Your goal is simple: eat as much food as possible without hitting walls,
              yourself, or obstacles.
            </p>

            <h3 style={{ color: "#4ade80", marginTop: 12, marginBottom: 6 }}>🎮 Controls</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              <strong>Desktop:</strong> Arrow Keys ↑ ↓ ← → &nbsp; &nbsp; <strong>Space</strong> = Pause / Resume
            </p>
            <p style={{ fontSize: 13, marginTop: 6 }}>
              <strong>Mobile:</strong> Swipe OR tap the on-screen direction arrows
            </p>

            <h3 style={{ color: "#4ade80", marginTop: 12, marginBottom: 6 }}>⭐ Level Progression</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              Eat food to increase score. Eat enough food to level up — each level can be faster and contain more obstacles.
            </p>

            <h3 style={{ color: "#4ade80", marginTop: 12, marginBottom: 6 }}>🏆 Leaderboard Rules</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              Sign in to save scores. The app saves your best score per level.
            </p>

            <h3 style={{ color: "#4ade80", marginTop: 12, marginBottom: 6 }}>⛔ Obstacles</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              Avoid rocks and walls—touching them ends the game immediately.
            </p>

            <h3 style={{ color: "#4ade80", marginTop: 12, marginBottom: 6 }}>⏸ Pause</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              Press <strong>Space</strong> or tap the Play/Pause button.
            </p>

            <h3 style={{ color: "#4ade80", marginTop: 12, marginBottom: 6 }}>🚪 Exit</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              Use the menu to exit. If signed in, your best score will be submitted automatically.
            </p>

            <h3 style={{ color: "#4ade80", marginTop: 12, marginBottom: 6 }}>💡 Tips</h3>
            <ul style={{ paddingLeft: 18, marginTop: 6, color: "#96f7c8" }}>
              <li>Move in small controlled steps to avoid sudden collisions</li>
              <li>Use walls for turning tricks</li>
              <li>Plan food pickups to avoid trapping yourself</li>
            </ul>

            <button
              onClick={() => setShowInstructions(false)}
              style={styles.btnPrimary}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer style={{ marginTop: 20, textAlign: "center" }} className="small">
        <span style={styles.small}>Tip: Press Space to toggle pause on desktop</span>
      </footer>
    </div>
  );
}

