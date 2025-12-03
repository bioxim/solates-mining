/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Pickaxe, Zap, Coins } from "lucide-react";
import { useTokenomics } from "../../hooks/useTokenomics";

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === undefined || target === null) return;

    let start = 0;
    const increment = target / (duration / 16);

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(Number(start.toFixed(2)));
    }, 16);

    return () => clearInterval(interval);
  }, [target]);

  return count;
}

export default function TokenStats() {
  const { data, loading } = useTokenomics();

  const minedReal = data?.minted ?? 0;
  const stakedReal = data?.stakingLocked ?? 0;
  const miningSpeedReal = minedReal / 30;

  const mined = useCountUp(minedReal);
  const miningSpeed = useCountUp(miningSpeedReal);
  const staked = useCountUp(stakedReal);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

      {/* Total mined */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-md shadow-lg p-6 text-center"
      >
        <Pickaxe className="text-[var(--primary)] mb-2" size={28} />
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          {loading ? "..." : `${mined.toFixed(2)} OLA`}
        </h2>
        <p className="text-sm opacity-70 mt-1">Total Fees</p>
      </motion.div>

      {/* Mining speed */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-md shadow-lg p-6 text-center"
      >
        <Zap className="text-[var(--primary)] mb-2" size={28} />
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          {loading ? "..." : `${miningSpeed.toFixed(2)} OLA/day`}
        </h2>
        <p className="text-sm opacity-70 mt-1">Total Buys</p>
      </motion.div>

      {/* Total staked */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-md shadow-lg p-6 text-center"
      >
        <Coins className="text-[var(--primary)] mb-2" size={28} />
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          {loading ? "..." : `${staked.toFixed(2)} OLA`}
        </h2>
        <p className="text-sm opacity-70 mt-1">Total Staked</p>
      </motion.div>

      {/* Bonus Quest */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-[var(--card)] bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary-dark)]/20 backdrop-blur-md shadow-lg p-6 text-center cursor-pointer"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[var(--primary)] text-xl font-semibold mb-2"
        >
          🎯 Bonus Quest
        </motion.div>
        <p className="text-sm opacity-80">Complete bonus quests to gain more XP!</p>
      </motion.div>
    </div>
  );
}
