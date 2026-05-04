import React, { useEffect, useState } from "react";
import { getConsumptions } from "../api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getConsumptions(token);

        console.log("API response:", res);

        // FOARTE IMPORTANT
        if (Array.isArray(res)) {
          setData(res);
        } else if (res.data && Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error(err);
        setData([]);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {data.length === 0 ? (
        <p>Nu ai date</p>
      ) : (
        data.map((item, index) => (
          <div key={index}>
            {item.tip} - {item.valoare}
          </div>
        ))
      )}
    </div>
  );
}