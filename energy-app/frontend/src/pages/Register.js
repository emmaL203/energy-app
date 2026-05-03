import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    await fetch(`${API_URL}/register?email=${email}&password=${password}`, {
      method: "POST",
    });

    alert("Cont creat!");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button onClick={handleRegister}>Register</button>

      <p>
        Ai cont? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;