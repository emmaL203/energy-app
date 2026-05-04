import React, { useEffect, useState } from "react";

const API = "https://energy-app-8yvb.onrender.com";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/consumptions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await res.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          setData([]);
        }

      } catch {
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      {data.length === 0 ? (
        <p>Nu ai consumuri</p>
      ) : (
        data.map((c) => (
          <div key={c.id}>
            {c.tip} - {c.valoare}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;