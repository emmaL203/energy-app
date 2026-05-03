import { Link } from "react-router-dom";

function Navbar({ onLogout }) {
  return (
    <div className="navbar">
      <div>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/add">Adaugă</Link> |{" "}
        <Link to="/stats">Stats</Link>
      </div>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Navbar;