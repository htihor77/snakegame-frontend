import React from "react";

export default function DirectionButtons({ onDir }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="dir-btn" onClick={() => onDir([-1, 0])}>▲</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 5 }}>
        <button className="dir-btn" onClick={() => onDir([0, -1])}>◀</button>
        <button className="dir-btn" onClick={() => onDir([0, 1])}>▶</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <button className="dir-btn" onClick={() => onDir([1, 0])}>▼</button>
      </div>
    </div>
  );
}
