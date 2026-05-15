import { useState } from "react";
import { API_URL } from "../api";

function AddConsumption() {
  const [valoare, setValoare] = useState("");
  const [tip, setTip] = useState("electricitate");
  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");

  const LIMITA_ELECTRICITATE = 300;
  const LIMITA_GAZ = 150;

  const add = async () => {
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

      // ALERTĂ LIMITĂ
      if (
        tip === "electricitate" &&
        Number(valoare) > LIMITA_ELECTRICITATE
      ) {
        alert("⚠️ Ai depășit limita recomandată la electricitate!");
      }

      if (
        tip === "gaz" &&
        Number(valoare) > LIMITA_GAZ
      ) {
        alert("⚠️ Ai depășit limita recomandată la gaz!");
      }

      setValoare("");
      setData("");
    } catch {
      setMsg("Eroare server");
    }
  };

  return (
    <div className="container">
      <div className="consumption-card">
        <h2>Adaugă consum</h2>

        {msg && <p>{msg}</p>}

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

        <button className="add-btn" onClick={add}>
          Adaugă
        </button>
      </div>
    </div>
  );
}

export default AddConsumption;