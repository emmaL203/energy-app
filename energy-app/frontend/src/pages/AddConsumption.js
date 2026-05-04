import { useState } from "react";
import { API_URL } from "../api";

function AddConsumption() {
  const [valoare, setValoare] = useState("");
  const [tip, setTip] = useState("electricitate");
  const [data, setData] = useState("");

  const add = async () => {
    await fetch(
      `${API_URL}/add-consumption?valoare=${valoare}&tip=${tip}&data=${data}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Adăugat!");
  };

  return (
    <div className="container">
      <h2>Adaugă consum</h2>

      <input placeholder="Valoare" onChange={e => setValoare(e.target.value)} />

      <select onChange={e => setTip(e.target.value)}>
        <option value="electricitate">Electricitate</option>
        <option value="gaz">Gaz</option>
      </select>

      <input type="date" onChange={e => setData(e.target.value)} />

      <button onClick={add}>Adaugă</button>
    </div>
  );
}

export default AddConsumption;