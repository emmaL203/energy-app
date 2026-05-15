import { useEffect, useState } from "react";
import { API_URL } from "../api";

function Stats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="container">
      <div className="stats-card">
        <h2 className="stats-title">📊 Statistici Consum</h2>

        <div className="stats-grid">
          <div className="stat-box">
            <h3>Total</h3>
            <p>{stats.total_consum || 0}</p>
          </div>

          <div className="stat-box">
            <h3>⚡ Electricitate</h3>
            <p>{stats.electricitate || 0}</p>
          </div>

          <div className="stat-box">
            <h3>🔥 Gaz</h3>
            <p>{stats.gaz || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;