import { useEffect, useState } from "react";
import { getConsumptions } from "../api";

function Stats() {

  const [consumptions, setConsumptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Nu esti logat");
          return;
        }

        const data = await getConsumptions(token);

        if (!Array.isArray(data)) {
          setError(data.detail || "Eroare");
          return;
        }

        setConsumptions(data);

      } catch {

        setError("Server error");

      }
    };

    fetchData();

  }, []);

  const totalElectricitate = consumptions
    .filter(c => c.tip === "electricitate")
    .reduce((acc, c) => acc + c.valoare, 0);

  const totalGaz = consumptions
    .filter(c => c.tip === "gaz")
    .reduce((acc, c) => acc + c.valoare, 0);

  return (

    <div className="container">

      <div className="card">

        <h1>Statistici consum</h1>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <div className="stats-box">

          <h3>Total electricitate</h3>
          <p>{totalElectricitate} kWh</p>

        </div>

        <div className="stats-box">

          <h3>Total gaz</h3>
          <p>{totalGaz} m³</p>

        </div>

        <h2>Consumuri adăugate</h2>

        {consumptions.length === 0 ? (

          <p>Nu există consumuri.</p>

        ) : (

          consumptions.map((c) => (

            <div
              key={c.id}
              className="consumption-item"
            >

              <p>
                <strong>Tip:</strong> {c.tip}
              </p>

              <p>
                <strong>Consum:</strong> {c.valoare}
              </p>

              <p>
                <strong>Data:</strong> {c.data}
              </p>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default Stats;