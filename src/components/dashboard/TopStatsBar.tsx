import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Función para animar conteo
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16); // cada frame (aprox. 60fps)
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(Number(start.toFixed(1)));
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);

  return count;
}

export default function TopStatsBar() {
  // Mock data
  const fdv = useCountUp(1.2); // en millones
  const mined = useCountUp(125.3); // en miles

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8"
    >
      {/* FDV */}
      <div className="flex flex-col justify-center rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-md p-6 shadow-lg hover:bg-[var(--card)]/60 transition text-center">
        <motion.h2
          key={fdv}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold text-[var(--primary)]"
        >
          {fdv.toFixed(1)}M
        </motion.h2>
        <p className="text-sm opacity-70 mt-1">FDV (Fully Diluted Value)</p>
      </div>

      {/* $OLA Mined */}
      <div className="flex flex-col justify-center rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-md p-6 shadow-lg hover:bg-[var(--card)]/60 transition text-center">
        <motion.h2
          key={mined}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold text-[var(--primary-dark)]"
        >
          {mined.toFixed(1)}K
        </motion.h2>
        <p className="text-sm opacity-70 mt-1">Total $OLA Mined</p>
      </div>
    </motion.div>
  );
}
