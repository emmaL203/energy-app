import { useState } from "react";
import { API_URL } from "../api";

function AddConsumption() {

  const [valoare, setValoare] = useState("");
  const [tip, setTip] = useState("electricitate");

  const [luna, setLuna] = useState("");
  const [an, setAn] = useState("");

  const [msg, setMsg] = useState("");

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
        tip === "electricitate" &&
        Number(valoare) > LIMITA_ELECTRICITATE
      ) {

        alert(
          "Ai depășit limita recomandată la electricitate!"
        );
      }

      if (
        tip === "gaz" &&
        Number(valoare) > LIMITA_GAZ
      ) {

        alert(
          "Ai depășit limita recomandată la gaz!"
        );
      }

      setValoare("");
      setLuna("");
      setAn("");

    } catch (err) {

      console.log(err);

      setMsg("Eroare server");
    }
  };

  return (

    <div className="container">

      <div className="card">

        <h1>

          {tip === "electricitate"
            ? "Electricitate"
            : "Gaz"}

        </h1>

        <p>

          Monitorizează consumul lunar și primește
          notificări când depășești limita recomandată.

        </p>

        <p>

          Limită recomandată:

          <strong>

            {" "}

            {tip === "electricitate"
              ? `${LIMITA_ELECTRICITATE} kWh`
              : `${LIMITA_GAZ} m³`}

          </strong>

        </p>

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
          <p className="message">
            {msg}
          </p>
        )}

        <div className="form-area">

          <input
            className="input-modern"
            type="number"
            placeholder="Consum"
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
  );
}

export default AddConsumption;