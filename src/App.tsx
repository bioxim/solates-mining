import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Main from "./pages/General";
import Leaderboard from "./pages/Leaderboard";
import Quests from "./pages/Quests";
import Staking from "./pages/Staking";
import MiningRoom from "./pages/MinigRoom";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* main area */}
        <main className="flex-1">
          <Routes>
            {/* Public / landing home*/}
            <Route path="/" element={<Home />} />
            
            {/* Protected section */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }></Route>

            {/* Rutas "internas" que usan Layout (sidebar fijo + contenido a la derecha) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Main />} />
              <Route path="/mining-room" element={<MiningRoom />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>

            {/* fallback opcional */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
