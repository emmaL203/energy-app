import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddConsumption from "./pages/AddConsumption";
import Stats from "./pages/Stats";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/add" element={<AddConsumption />} />

        <Route path="/stats" element={<Stats />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;