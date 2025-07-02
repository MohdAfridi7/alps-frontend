import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import AdminPanel from "./pages/adminPanel";
import ClientPanel from "./pages/clientPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/adminDashboard" element={<AdminPanel/>} />
        <Route path="/clientDashboard" element={<ClientPanel/>} />
      </Routes>
    </Router>
  );
}

export default App;
