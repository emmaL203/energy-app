import React from "react";

function Navbar({ onLogout }) {
  return (
    <div style={{ padding: 10, background: "#222", color: "white" }}>
      <a href="/" style={{ marginRight: 10 }}>Dashboard</a>
      <a href="/add" style={{ marginRight: 10 }}>Add</a>
      <a href="/stats" style={{ marginRight: 10 }}>Stats</a>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Navbar;