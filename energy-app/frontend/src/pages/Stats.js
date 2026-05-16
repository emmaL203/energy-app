import { useEffect, useState } from "react";
import { API_URL } from "../api";

function Stats() {

  const [stats, setStats] = useState(null);
  const [consumptions, setConsumptions] = useState([]);

  useEffect(() => {

    loadStats();
    loadConsumptions();

  }, []);

  const loadStats = async () => {

    try {

      const res = await fetch(
        `${API_URL}/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setStats(data);

    } catch (err) {

      console.log(err);

    }
  };

  const loadConsumptions = async () => {

    try {

      const res = await fetch(
        `${API_URL}/consumptions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setConsumptions(data);

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <div className="container">

      <div className="consumption-card">

        <div className="left-side">

          <h1>Statistici consum</h1>

          <p>
            Vezi evoluția consumului tău lunar.
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
              >

                <strong>
                  {c.tip}
                </strong>

                <p>
                  {c.valoare}
                </p>

                <p>
                  {c.data}
                </p>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Stats;