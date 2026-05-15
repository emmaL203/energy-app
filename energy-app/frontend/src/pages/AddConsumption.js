import { useState } from "react";
import { API_URL } from "../api";

function AddConsumption() {
  const [valoare, setValoare] = useState("");
  const [tip, setTip] = useState("electricitate");
  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // LIMITE CONSUM
  const LIMITA_ELECTRICITATE = 300;
  const LIMITA_GAZ = 150;

  const add = async () => {
    setMsg("");

    if (!valoare || !data) {
      setMsg("Completează toate câmpurile");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/add-consumption?valoare=${valoare}&tip=${tip}&data=${data}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const dataRes = await res.json();

      if (dataRes.detail) {
        setMsg(dataRes.detail);
        return;
      }

      setMsg("Consum adăugat cu succes!");

      // POPUP LIMITĂ
      if (
        (tip === "electricitate" &&
          Number(valoare) > LIMITA_ELECTRICITATE) ||
        (tip === "gaz" && Number(valoare) > LIMITA_GAZ)
      ) {
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 4000);
      }

      setValoare("");
      setData("");
    } catch {
      setMsg("Eroare server");
    }
  };

  return (
    <div className="container">
      {/* POPUP ALERTĂ */}
      {showPopup && (
        <div className="popup-warning">
          ⚠️ Ai depășit limita recomandată de consum la{" "}
          {tip === "electricitate" ? "electricitate" : "gaz"}!
        </div>
      )}

      <div className="consumption-card">
        {/* LEFT SIDE */}
        <div className="left-panel">
          <h1>
            {tip === "electricitate"
              ? "Consum Electricitate"
              : "Consum Gaz"}
          </h1>

          <p>
            Monitorizează consumul și primește alerte când depășești
            limitele recomandate.
          </p>

          <div className="limit-box">
            Limită recomandată:
            <strong>
              {" "}
              {tip === "electricitate"
                ? `${LIMITA_ELECTRICITATE} kWh`
                : `${LIMITA_GAZ} m³`}
            </strong>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          {/* SWITCH */}
          <div className="switch-container">
            <button
              className={
                tip === "electricitate"
                  ? "switch-btn active-electric"
                  : "switch-btn"
              }
              onClick={() => setTip("electricitate")}
            >
              ⚡ Electricitate
            </button>

            <button
              className={
                tip === "gaz"
                  ? "switch-btn active-gaz"
                  : "switch-btn"
              }
              onClick={() => setTip("gaz")}
            >
              🔥 Gaz
            </button>
          </div>

          {msg && <p className="message">{msg}</p>}

          {/* INPUT VALOARE */}
          <div className="input-group">
            <input
              type="number"
              placeholder={`Consum în ${
                tip === "electricitate" ? "kWh" : "m³"
              }`}
              value={valoare}
              onChange={(e) => setValoare(e.target.value)}
            />

            <span className="unit">
              {tip === "electricitate" ? "kWh" : "m³"}
            </span>
          </div>

          {/* DATĂ */}
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          {/* BUTTON */}
          <button className="add-btn" onClick={add}>
            Adaugă consum
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddConsumption;