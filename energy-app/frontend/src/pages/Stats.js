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
      .then(res => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="container">
      <h2>Statistici</h2>

      <p>Total: {stats.total_consum}</p>
      <p>Electricitate: {stats.electricitate}</p>
      <p>Gaz: {stats.gaz}</p>
    </div>
  );
}

export default Stats;