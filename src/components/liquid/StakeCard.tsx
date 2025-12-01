import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Enhanced StakeCard:
 * - shows user stake balance
 * - shows user rank in stakers (mock)
 * - shows APY (mock/configurable)
 * - staking input + estimated reward
 *
 * Replace mock fetches with real calls to Firestore / on-chain when ready.
 */

export default function StakeCard() {
  // mock user info — replace with real user data
  const [userStake, setUserStake] = useState<number | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const APY = 5.0; // % annual, can be dynamic

  // simulate fetching user data (replace with real fetch)
  useEffect(() => {
    // mock: assume user has 42.5 OLA staked and rank 128
    setTimeout(() => {
      setUserStake(42.5);
      setUserRank(128);
    }, 300);
  }, []);

  const parsed = parseFloat(amount || "0");
  const yearlyReward = (parsed * APY) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="p-6 rounded-2xl bg-[var(--card)]/40 border border-[var(--primary)]/30 backdrop-blur-md shadow-lg max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold text-[var(--primary)] mb-2 text-center">Stake $OLA</h2>

      <div className="mb-4 text-center">
        <div className="text-sm opacity-70">Your staked</div>
        <div className="text-2xl font-semibold mt-1">{userStake !== null ? `${userStake} OLA` : "—"}</div>
        <div className="text-xs opacity-60 mt-1">Rank #{userRank ?? "—"} in stakers</div>
      </div>

      <div className="mb-3">
        <label className="text-sm opacity-80">Amount to stake</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full mt-2 px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-[var(--primary)] transition text-right"
        />
      </div>

      <div className="flex justify-between text-sm opacity-80 mb-3">
        <div>APY</div>
        <div className="font-semibold">{APY}%</div>
      </div>

      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="text-sm opacity-70">Estimated reward / year</div>
        <div className="text-lg font-semibold text-[var(--primary)]">
          {yearlyReward.toFixed(3)} OLA
        </div>
      </div>

      <button
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 transition text-black font-semibold"
      >
        Stake now
      </button>

      <p className="text-xs mt-3 opacity-60 text-center">
        When you stake you receive <strong>stOLA</strong>. Share price increases over time as rewards accrue.
      </p>
    </motion.div>
  );
}
