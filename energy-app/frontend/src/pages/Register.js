import React, { useState } from "react";

const API = "https://energy-app-8yvb.onrender.com";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${API}/register?email=${email}&password=${password}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Register failed");
      }

      setMessage("Cont creat cu succes!");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Se creează..." : "Register"}
        </button>

        <p>
          Ai deja cont? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}