import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Wallet } from "lucide-react"; // ícono minimalista

export default function WelcomeCard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("solates_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      fetchXp(parsed.uid);
    }
  }, []);

  async function fetchXp(uid: string) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setXp(snap.data().xp ?? 0);
    }
  }

  const level = Math.floor(xp / 500) + 1;
  const progress = Math.min((xp % 500) / 5, 100);

  // Simulación de wallet (por ahora)
  const walletAddress =
    user?.wallet || "7syT9aP7KJXGv2RkU1XbxN4dV1q3WgNqP7YHQf45sdfg";

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 5)}...${addr.slice(-4)}` : "No wallet linked";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center gap-10 w-full rounded-3xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-lg shadow-lg p-8 overflow-hidden hover:bg-[var(--card)]/60 transition"
    >
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 via-transparent to-[var(--primary-dark)]/10 blur-3xl pointer-events-none" />

      {/* Avatar */}
      <div className="flex-shrink-0 relative z-10">
        <img
          src={user?.photoURL || "https://api.dicebear.com/7.x/thumbs/svg?seed=solates"}
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-[var(--primary)] shadow-md"
        />
      </div>

      {/* Info principal */}
      <div className="flex flex-col flex-grow relative z-10">
        <h2 className="text-3xl font-bold text-[var(--primary)] mb-1">
          {user?.name || "Guest User"}
        </h2>

        {/* Wallet */}
        <div className="flex items-center gap-2 text-sm text-[var(--text)] opacity-80 mb-4">
          <Wallet size={16} className="text-[var(--primary)]" />
          <span>{shortenAddress(walletAddress)}</span>
        </div>

        {/* Barra XP */}
        <div className="relative w-full bg-white/10 rounded-full h-4 mb-2 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm opacity-80">
          <span>XP: {xp}</span>
          <span>Level {level}</span>
        </div>
      </div>
    </motion.div>
  );
}
