/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (snap.exists()) setXp(snap.data().xp ?? 0);
  }

  useEffect(() => {
    if (location.pathname === "/" && user && xp >= 500) {
      navigate("/dashboard");
    }
  }, [user, xp, location.pathname, navigate]);

  if (location.pathname !== "/") return null;

  const features = [
    {
      icon: "⚡",
      title: "Skill-Based Progression",
      desc: "Complete quests, learn crypto fundamentals, and level up through real XP growth."
    },
    {
      icon: "💠",
      title: "Earn & Evolve",
      desc: "Unlock the Solates ecosystem, where your actions generate on-chain value."
    },
    {
      icon: "🔒",
      title: "Exclusive Access",
      desc: "Reach 500 XP to enter the core: staking, production, rewards and OLA growth."
    },
    {
      icon: "🚀",
      title: "Your Crypto Path",
      desc: "A long-term progression game designed to build real financial momentum."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-[#0d0f1a] text-white">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-2xl"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-br from-[var(--primary)] to-[#7dd3fc] bg-clip-text text-transparent">
          Solates
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          A progression-based crypto platform where you <strong>learn</strong>, 
          <strong>earn</strong> and <strong>unlock financial tools</strong> as you evolve.
        </p>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl w-full">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <div className="text-lg font-semibold mb-1">{f.title}</div>
            <p className="text-sm opacity-70">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        {user ? (
          xp >= 500 ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-semibold hover:opacity-90 transition"
            >
              Enter Dashboard
            </button>
          ) : (
            <p className="text-sm opacity-80">
              You need <strong>{500 - xp} XP</strong> more to unlock the Core Experience 🔓
            </p>
          )
        ) : (
          <motion.p
            className="text-lg font-semibold opacity-90"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a
              href="https://solates.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--primary)]"
            >
              Start your journey
            </a>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
