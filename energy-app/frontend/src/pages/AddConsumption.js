import { useState } from "react";
import { API_URL } from "../api";

function AddConsumption() {

  const [valoare, setValoare] = useState("");
  const [tip, setTip] = useState("electricitate");

  // LUNA + AN
  const [luna, setLuna] = useState("");
  const [an, setAn] = useState(new Date().getFullYear());

  const [msg, setMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const LIMITA_ELECTRICITATE = 300;
  const LIMITA_GAZ = 150;

  const add = async () => {

    setMsg("");

    // VALIDARE
    if (!valoare || !luna || !an) {
      setMsg("Completează toate câmpurile");
      return;
    }

    try {

      const res = await fetch(
        `${API_URL}/add-consumption?valoare=${valoare}&tip=${tip}&luna=${luna}&an=${an}`,
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
        (tip === "electricitate" &&
          Number(valoare) > LIMITA_ELECTRICITATE)
        ||
        (tip === "gaz" &&
          Number(valoare) > LIMITA_GAZ)
      ) {

        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 4000);
      }

      // RESET
      setValoare("");
      setLuna("");

    } catch {

      setMsg("Eroare server");

    }
  };

  return (

    <div className="container">

      {showPopup && (
        <div className="popup-warning">
          ⚠️ Ai depășit limita recomandată pentru {tip}!
        </div>
      )}

      <div className="consumption-wrapper">

        {/* LEFT */}

        <div className="left-panel">

          <h1>
            {tip === "electricitate"
              ? "Electricitate"
              : "Gaz"}
          </h1>

          <p>
            Monitorizează consumul lunar și primește notificări
            când depășești limita recomandată.
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

        {/* RIGHT */}

        <div className="right-panel">

          {/* SWITCH */}

          <div className="switch-container">

            <button
              className={
                tip === "electricitate"
                  ? "switch-btn active"
                  : "switch-btn"
              }
              onClick={() => setTip("electricitate")}
            >
              ⚡ Electricitate
            </button>

            <button
              className={
                tip === "gaz"
                  ? "switch-btn active"
                  : "switch-btn"
              }
              onClick={() => setTip("gaz")}
            >
              🔥 Gaz
            </button>

          </div>

          {/* MESSAGE */}

          {msg && (
            <div className="message">
              {msg}
            </div>
          )}

          {/* FORM */}

          <div className="form-grid">

            {/* CONSUM */}

            <input
              className="input-box"
              type="number"
              placeholder={`Consum în ${
                tip === "electricitate"
                  ? "kWh"
                  : "m³"
              }`}
              value={valoare}
              onChange={(e) => setValoare(e.target.value)}
            />

            {/* LUNA */}

            <select
              className="input-box"
              value={luna}
              onChange={(e) => setLuna(e.target.value)}
            >

              <option value="">
                Selectează luna
              </option>

              <option value="1">Ianuarie</option>
              <option value="2">Februarie</option>
              <option value="3">Martie</option>
              <option value="4">Aprilie</option>
              <option value="5">Mai</option>
              <option value="6">Iunie</option>
              <option value="7">Iulie</option>
              <option value="8">August</option>
              <option value="9">Septembrie</option>
              <option value="10">Octombrie</option>
              <option value="11">Noiembrie</option>
              <option value="12">Decembrie</option>

            </select>

            {/* AN */}

            <input
              className="input-box"
              type="number"
              placeholder="An"
              value={an}
              onChange={(e) => setAn(e.target.value)}
            />

          </div>

          {/* BUTTON */}

          <button
            className="add-btn"
            onClick={add}
          >
            Adaugă consum
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddConsumption;