/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";


interface Step {
  icon: string;
  title: string;
  desc: string;
}

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
    if (snap.exists()) {
      setXp(snap.data().xp ?? 0);
    }
  }

  // Auto-redirect ONLY if you are currently on "/"
  useEffect(() => {
    const isOnHome = location.pathname === "/";

    if (isOnHome && user && xp >= 500) {
      navigate("/dashboard");
    }
  }, [user, xp, location.pathname, navigate]);

  if (location.pathname !== "/") return null;

  const steps: Step[] = [
    { icon: "🎯", title: "Quests", desc: "Complete missions and earn real XP." },
    { icon: "💎", title: "XP", desc: "Accumulate points that represent your growth." },
    { icon: "🚪", title: "Mining Room", desc: "Unlock access to the $OLA mining arena." },
    { icon: "⚡", title: "Production", desc: "Activate slots and start generating $OLA." },
    { icon: "📈", title: "Staking", desc: "Multiply your earnings with steady staking." },
    { icon: "🏆", title: "Leaderboard", desc: "Compete with others for exclusive rewards." },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold mb-3 text-[var(--primary)]">
          Welcome to Solates
        </h1>
        <p className="opacity-80 max-w-xl mx-auto">
          Build your path to crypto independence. Start with quests, earn XP, and unlock
          access to the <strong>Mining Room</strong> where your $OLA journey begins.
        </p>
      </motion.div>

      {/* 🔄 Main visual circuit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative p-4 rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-sm shadow-sm text-center"
          >
            <div className="text-4xl mb-2">{step.icon}</div>
            <div className="font-semibold text-lg mb-1">{step.title}</div>
            <div className="text-sm opacity-70">{step.desc}</div>
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute right-[-16px] top-1/2 transform -translate-y-1/2 text-[var(--primary)]">
                →
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 🔘 CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-10"
      >
        {user ? (
          xp >= 500 ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition"
            >
              Go to Dashboard
            </button>
          ) : (
            <p className="text-sm opacity-80">
              You still need {500 - xp} XP to unlock the Mining Room 🚀
            </p>
          )
        ) : (
          <motion.p
            className="text-lg font-semibold opacity-90"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1], color: ["#facc15", "#f472b6", "#38bdf8", "#facc15"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a
              href="https://solates.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--primary)]"
            >
              Click here to start your journey 💫
            </a>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
