import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)]">
        {/* Navbar ocupa todo el ancho */}
        <Navbar />

        {/* Main content: fondo ocupa todo, contenido centrado */}
        <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/airdrop" element={<div className="p-6">Airdrop page (coming soon)</div>} />
              <Route path="/leaderboard" element={<div className="p-6">Leaderboard page (coming soon)</div>} />
              // Private routes
              <Route path="/dashboard" 
              element={<div className="p-6 text-[var(--text)]">Hello, welcome to your Solates dashboard 👋</div>} 
              />

            </Routes>
        </main>

        {/* Footer ocupa todo el ancho */}
        <Footer />
      </div>
    </Router>
  );
}
