import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import Main from "./pages/Main";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* main area */}
        <main className="flex-1">
          <Routes>
            {/* Public / landing home — sin sidebar */}
            <Route path="/" element={<Home />} />

            {/* Rutas "internas" que usan Layout (sidebar fijo + contenido a la derecha) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Main />} />
              <Route path="/mining-room" element={<div className="p-6">Mining Room (coming soon)</div>} />
              <Route path="/quests" element={<div className="p-6">Quests (coming soon)</div>} />
              <Route path="/staking" element={<div className="p-6">Staking (coming soon)</div>} />
              <Route path="/leaderboard" element={<div className="p-6">Leaderboard (coming soon)</div>} />
            </Route>

            {/* fallback opcional */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
