import React from "react";
import SnakeGame from "./SnakeGame";

export default function App(){
  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <h1>Snake — Nokia-style</h1>
          <p>Touch, swipe or use arrow keys. Double-tap to pause.</p>
        </div>
        <div className="controls">
          <span className="small">Made with Love</span>
        </div>
      </div>

      <SnakeGame />
      <footer style={{marginTop:20, textAlign:"center"}} className="small">Tip: Press Space to toggle pause on desktop</footer>
    </div>
  );
}
