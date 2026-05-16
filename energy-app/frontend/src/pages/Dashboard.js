import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (

    <div className="container">

      <div className="consumption-card">

        {/* LEFT */}

        <div className="left-side">

          <h1>Energy Tracker</h1>

          <p>
            Monitorizează consumul de electricitate
            și gaz într-un mod modern și intuitiv.
          </p>

          <div className="limit-box">

            Controlează mai eficient
            consumul lunar și urmărește
            statisticile în timp real.

          </div>

        </div>

        {/* RIGHT */}

        <div className="right-side">

          <h2
            style={{
              fontSize: "42px",
              marginBottom: "20px",
            }}
          >
            Dashboard
          </h2>

          <p
            style={{
              marginBottom: "40px",
              color: "#b8b8d1",
              fontSize: "18px",
            }}
          >
            Alege ce dorești să faci.
          </p>

          <div
            style={{
              display: "grid",
              gap: "25px",
            }}
          >

            <button
              className="submit-btn"
              onClick={() => navigate("/add")}
            >
              ➕ Adaugă consum
            </button>

            <button
              className="submit-btn"
              onClick={() => navigate("/stats")}
            >
              📊 Vezi statistici
            </button>

            <button
              className="submit-btn"
              onClick={logout}
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;