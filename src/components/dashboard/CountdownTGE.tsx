import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function CountdownTGE() {
  // Fecha objetivo (ejemplo: 15 de noviembre de 2026)
  const targetDate = new Date("2026-11-15T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, mins, secs });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-3xl border border-[var(--card)] bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary-dark)]/20 backdrop-blur-md shadow-lg p-8 flex flex-col items-center justify-center text-center mt-8"
    >
      <Rocket size={36} className="text-[var(--primary)] mb-4 animate-pulse" />
      <h2 className="text-2xl font-bold mb-2 text-[var(--primary)]">
        Token Generation Event Countdown
      </h2>

      <div className="flex gap-6 mt-4 text-lg font-semibold">
        <div className="flex flex-col items-center">
          <span className="text-4xl text-[var(--primary)]">{timeLeft.days}</span>
          <span className="opacity-60 text-sm">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl text-[var(--primary)]">{timeLeft.hours}</span>
          <span className="opacity-60 text-sm">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl text-[var(--primary)]">{timeLeft.mins}</span>
          <span className="opacity-60 text-sm">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl text-[var(--primary)]">{timeLeft.secs}</span>
          <span className="opacity-60 text-sm">Seconds</span>
        </div>
      </div>

      <p className="opacity-70 text-sm mt-6">
        Stay tuned for the official $OLA Token Generation Event launch 🚀
      </p>
    </motion.div>
  );
}
