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

        // 🔥 FIX IMPORTANT
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Nu e array:", result);
          setData([]); // fallback
        }

      } catch (err) {
        console.error(err);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Consumuri</h2>

      {data.length === 0 ? (
        <p>Nu ai consumuri încă</p>
      ) : (
        data.map((item) => (
          <div key={item.id}>
            {item.tip} - {item.valoare}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;