import { useEffect, useState } from "react";
import API_URL from "../api";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/consumptions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="container">
      <h2>Consumuri</h2>

      {data.map(c => (
        <p key={c.id}>
          {c.tip} - {c.valoare} - {c.data}
        </p>
      ))}
    </div>
  );
}

export default Dashboard;