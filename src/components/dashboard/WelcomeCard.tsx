/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Wallet } from "lucide-react";

export default function WelcomeCard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. leer usuario logueado guardado por tu login
    const saved = localStorage.getItem("solates_user");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    fetchUserFromFirebase(parsed.uid);
  }, []);

  async function fetchUserFromFirebase(uid: string) {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data());
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full p-8 rounded-3xl bg-[var(--card)]/40 animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full p-8 rounded-3xl bg-[var(--card)]/40 text-red-400">
        No user profile found.
      </div>
    );
  }

  // datos reales de Firebase
  const { displayName, avatarUrl, xp, wallet } = userData;

  // Cálculo real del nivel
  const level = Math.floor((xp ?? 0) / 500) + 1;

  // Porcentaje real de progreso hacia el próximo nivel
  const progress = Math.min(((xp ?? 0) % 500) / 5, 100);

  // Shorten wallet
  const shorten = (addr: string) =>
    addr ? `${addr.slice(0, 5)}...${addr.slice(-4)}` : "No wallet linked";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center gap-10 w-full rounded-3xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-lg shadow-lg p-8 overflow-hidden hover:bg-[var(--card)]/60 transition"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 via-transparent to-[var(--primary-dark)]/10 blur-3xl pointer-events-none" />

      {/* Avatar */}
      <div className="flex-shrink-0 relative z-10">
        <img
          src={avatarUrl || "https://api.dicebear.com/7.x/thumbs/svg?seed=solates"}
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-[var(--primary)] shadow-md object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow relative z-10">
        <h2 className="text-3xl font-bold text-[var(--primary)] mb-1">
          {displayName || "Guest User"}
        </h2>

        {/* Wallet */}
        <div className="flex items-center gap-2 text-sm text-[var(--text)] opacity-80 mb-4">
          <Wallet size={16} className="text-[var(--primary)]" />
          <span>{shorten(wallet)}</span>
        </div>

        {/* Barra XP */}
        <div className="relative w-full bg-white/10 rounded-full h-4 mb-2 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm opacity-80">
          <span>XP: {xp ?? 0}</span>
          <span>Level {level}</span>
        </div>
      </div>
    </motion.div>
  );
}
