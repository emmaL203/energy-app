import React, { useState } from "react";
import { registerUser } from "../api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    setMsg("");

    // ✅ validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMsg("Introdu un email valid");
      return;
    }

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

        {msg && (
          <p
            style={{
              color: msg.includes("creat") ? "green" : "red",
            }}
          >
            {msg}
          </p>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p>
          Ai cont? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;