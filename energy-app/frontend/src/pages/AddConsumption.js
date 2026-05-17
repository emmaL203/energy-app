import { useState } from "react";
import { API_URL } from "../api";

function AddConsumption() {

  const [valoare, setValoare] = useState("");
  const [tip, setTip] = useState("electricitate");

  const [luna, setLuna] = useState("");
  const [an, setAn] = useState("");

  const [msg, setMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const LIMITA_ELECTRICITATE = 300;
  const LIMITA_GAZ = 150;

  const add = async () => {

    setMsg("");

    if (!valoare || !luna || !an) {

      setMsg("Completează toate câmpurile");
      return;
    }

    try {

      const dataCompleta =
        `${an}-${luna}-01`;

      const res = await fetch(
        `${API_URL}/add-consumption?valoare=${valoare}&tip=${tip}&data=${dataCompleta}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const dataRes = await res.json();

      if (dataRes.detail) {

        setMsg(dataRes.detail);
        return;
      }

      setMsg("Consum adăugat cu succes!");

      if (
        (
          tip === "electricitate" &&
          Number(valoare) > LIMITA_ELECTRICITATE
        )
        ||
        (
          tip === "gaz" &&
          Number(valoare) > LIMITA_GAZ
        )
      ) {

        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 4000);
      }

      setValoare("");
      setLuna("");
      setAn("");

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

      <div className="consumption-card">

        {/* LEFT */}

        <div className="left-side">

          <h1>

            {tip === "electricitate"
              ? "Electricitate"
              : "Gaz"}

          </h1>

          <p>

            Monitorizează consumul lunar și primește
            notificări când depășești limita recomandată.

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

        <div className="right-side">

          <div className="switch-wrapper">

            <button
              className={
                tip === "electricitate"
                  ? "switch active"
                  : "switch"
              }
              onClick={() =>
                setTip("electricitate")
              }
            >
              ⚡ Electricitate
            </button>

            <button
              className={
                tip === "gaz"
                  ? "switch active"
                  : "switch"
              }
              onClick={() =>
                setTip("gaz")
              }
            >
              🔥 Gaz
            </button>

          </div>

          {msg && (

            <div className="message">

              {msg}

            </div>

          )}

          <div className="form-area">

            <input
              className="input-modern"
              type="number"
              placeholder={`Consum în ${
                tip === "electricitate"
                  ? "kWh"
                  : "m³"
              }`}
              value={valoare}
              onChange={(e) =>
                setValoare(e.target.value)
              }
            />

            <select
              className="input-modern"
              value={luna}
              onChange={(e) =>
                setLuna(e.target.value)
              }
            >

              <option value="">
                Selectează luna
              </option>

              <option value="01">Ianuarie</option>
              <option value="02">Februarie</option>
              <option value="03">Martie</option>
              <option value="04">Aprilie</option>
              <option value="05">Mai</option>
              <option value="06">Iunie</option>
              <option value="07">Iulie</option>
              <option value="08">August</option>
              <option value="09">Septembrie</option>
              <option value="10">Octombrie</option>
              <option value="11">Noiembrie</option>
              <option value="12">Decembrie</option>

            </select>

            <input
              className="input-modern"
              type="number"
              placeholder="2026"
              value={an}
              onChange={(e) =>
                setAn(e.target.value)
              }
            />

          </div>

          <button
            className="submit-btn"
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