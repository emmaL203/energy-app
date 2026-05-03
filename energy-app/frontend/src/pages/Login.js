import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${email}&password=${password}`,
    });

    const data = await res.json();

    localStorage.setItem("token", data.access_token);
    onLogin();
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>

      <p>
        Nu ai cont? <Link to="/register">Creează cont</Link>
      </p>
    </div>
  );
}

export default Login;