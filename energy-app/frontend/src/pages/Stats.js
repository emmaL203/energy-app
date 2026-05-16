import { useEffect, useState } from "react";
import { API_URL } from "../api";

function Stats() {

  const [stats, setStats] = useState(null);

  const [consumptions, setConsumptions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const token = localStorage.getItem("token");

      // dacă nu există token
      if (!token) {
        setLoading(false);
        return;
      }

      // STATS
      const statsRes = await fetch(
        `${API_URL}/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statsData = await statsRes.json();

      // dacă token invalid
      if (statsData.detail) {

        localStorage.clear();

        window.location.href = "/";

        return;
      }

      setStats(statsData);

      // CONSUMPTIONS
      const consumRes = await fetch(
        `${API_URL}/consumptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const consumData = await consumRes.json();

      // protecție .map()
      if (Array.isArray(consumData)) {
        setConsumptions(consumData);
      } else {
        setConsumptions([]);
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (

    <div className="container">

      <div className="consumption-card">

        {/* LEFT */}

        <div className="left-side">

          <h1>Statistici</h1>

          <p>
            Vezi consumul total și istoricul
            consumurilor adăugate.
          </p>

          {stats && (

            <div>

              <div className="limit-box">
                Total consum:
                <strong>
                  {" "}
                  {stats.total_consum}
                </strong>
              </div>

              <div className="limit-box">
                Electricitate:
                <strong>
                  {" "}
                  {stats.electricitate}
                </strong>
              </div>

              <div className="limit-box">
                Gaz:
                <strong>
                  {" "}
                  {stats.gaz}
                </strong>
              </div>

            </div>

          )}

        </div>

        {/* RIGHT */}

        <div className="right-side">

          <h2>
            Consumuri adăugate
          </h2>

          {consumptions.length === 0 ? (

            <p>
              Nu există consumuri.
            </p>

          ) : (

            consumptions.map((c) => (

              <div
                key={c.id}
                className="consumption-item"
                style={{
                  marginBottom: "20px",
                  padding: "20px",
                  borderRadius: "18px",
                  background: "#151933",
                  border: "1px solid #2c315e"
                }}
              >

                <h3>
                  {c.tip === "electricitate"
                    ? "⚡ Electricitate"
                    : "🔥 Gaz"}
                </h3>

                <p>
                  Consum:
                  <strong>
                    {" "}
                    {c.valoare}
                  </strong>
                </p>

                {c.luna && (
                  <p>
                    Luna:
                    <strong>
                      {" "}
                      {c.luna}/{c.an}
                    </strong>
                  </p>
                )}

                {c.data && (
                  <p>
                    Data:
                    <strong>
                      {" "}
                      {c.data}
                    </strong>
                  </p>
                )}

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Stats;