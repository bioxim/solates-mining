import { useState } from "react";
import MinerLeaderboard from "../components/leaderboard/MinerLeaderboard";
import StakerLeaderboard from "../components/leaderboard/StakerLeaderboard";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"miners" | "stakers">("miners");

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">
        Leaderboard 🏆
      </h1>

      <div className="flex justify-center mb-10">
        <div className="flex bg-[var(--card)]/50 rounded-xl backdrop-blur-sm border border-[var(--card)]">
          <button
            onClick={() => setActiveTab("miners")}
            className={`px-6 py-2 rounded-xl transition-all ${
              activeTab === "miners"
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text)] hover:bg-[var(--card)]/40"
            }`}
          >
            Miners
          </button>
          <button
            onClick={() => setActiveTab("stakers")}
            className={`px-6 py-2 rounded-xl transition-all ${
              activeTab === "stakers"
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text)] hover:bg-[var(--card)]/40"
            }`}
          >
            Stakers
          </button>
        </div>
      </div>

      {activeTab === "miners" ? <MinerLeaderboard /> : <StakerLeaderboard />}
    </div>
  );
}
