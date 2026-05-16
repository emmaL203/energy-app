import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";


function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

  setError("");
  setLoading(true);

  try {

    const res = await fetch(
      "https://energy-app-8yvb.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      }
    );

    const data = await res.json();

    console.log(data);

    if (!data.access_token) {
      setError(data.detail || "Login failed");
      setLoading(false);
      return;
    }

    localStorage.setItem(
      "token",
      data.access_token
    );

    onLogin();

   navigate("/dashboard");

  } catch (err) {

    console.log(err);

    setError("Serverul nu raspunde");

  }

  setLoading(false);
};

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Se conecteaza...</p>}

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleLogin}>
          {loading ? "Se conecteaza..." : "Login"}
        </button>

        <p>
          Nu ai cont?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Creeaza cont
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;