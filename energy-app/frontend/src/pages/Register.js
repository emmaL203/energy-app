import React, { useState } from "react";
import { registerUser } from "../api";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    setMsg("");

    try {
      const data = await registerUser(email, password);

      if (data.detail) {
        setMsg(data.detail);
        return;
      }

      setMsg("Cont creat! Mergi la login.");
    } catch {
      setMsg("Eroare server");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        {msg && <p>{msg}</p>}

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleRegister}>Register</button>

        <p>
          Ai cont? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;