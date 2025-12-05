/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

interface StakingPositionProps {
  walletAddress: string;  // 🔥 Ahora recibimos la WALLET real
  apy: number;
  onStake: () => void;
  onUnstake: (amount: number) => void;
}

export default function StakingPosition({
  walletAddress,
  apy,
  onStake,
  onUnstake,
}: StakingPositionProps) {
  const [loading, setLoading] = useState(true);
  const [stakingData, setStakingData] = useState<any>(null);
  const [olaBalance, setOlaBalance] = useState(0);

  // -----------------------------------------------------
  // 🔥 Lectura en tiempo real usando LA WALLET REAL
  // -----------------------------------------------------
  useEffect(() => {
    if (!walletAddress) return;

    setLoading(true);

    // 1. Balance
    const balanceUnsub = onSnapshot(
      doc(db, "wallets", walletAddress, "balances", "OLA"),
      (snap) => {
        setOlaBalance(snap.exists() ? snap.data().amount : 0);
      }
    );

    // 2. Staking
    const stakingUnsub = onSnapshot(
      doc(db, "wallets", walletAddress, "staking", "main"),
      (snap) => {
        setStakingData(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      (err) => {
        console.error("Error reading staking:", err);
        setLoading(false);
      }
    );

    return () => {
      balanceUnsub();
      stakingUnsub();
    };
  }, [walletAddress]);

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------

  if (loading) {
    return (
      <div className="mt-8 p-6 border border-white/10 bg-white/5 rounded-xl animate-pulse text-center text-white/50">
        Syncing wallet data...
      </div>
    );
  }

  // === Sin staking activo ===
  if (!stakingData || stakingData.amount <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 border border-white/10 bg-white/5 rounded-xl text-center"
      >
        <h2 className="text-xl font-bold text-teal-300">No Active Stake</h2>
        <p className="text-white/60 mt-2 mb-4">
          You currently have no OLA staked.
        </p>

        <div className="text-sm text-gray-400 mb-6">
          Wallet Balance:{" "}
          <span className="text-white font-mono">
            {olaBalance.toFixed(2)} OLA
          </span>
        </div>

        <button
          onClick={onStake}
          className="px-6 py-2 rounded-lg font-semibold 
            bg-teal-400/20 text-teal-300 border border-teal-400 
            hover:bg-teal-400/30 transition shadow-[0_0_15px_rgba(45,212,191,0.2)]"
        >
          Stake OLA
        </button>
      </motion.div>
    );
  }

  const stakedAmount = stakingData.amount || 0;
  const rewards = stakingData.rewardsAccrued || 0;
  const total = stakedAmount + rewards;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 p-6 rounded-xl border border-white/10 bg-white/[0.06]"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal-300">Staking Position</h2>
          <p className="text-xs text-white/50">Real-time DB sync</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Wallet Balance</p>
          <p className="text-lg font-mono text-white">
            {olaBalance.toFixed(2)} OLA
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Stat label="Principal" value={`${stakedAmount.toFixed(2)}`} sub="OLA" />
        <Stat label="Rewards" value={`${rewards.toFixed(4)}`} sub="OLA" />
        <Stat label="Total Value" value={`${total.toFixed(2)}`} sub="OLA" />
        <Stat label="Current APY" value={`${apy}%`} sub="Fixed" />
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={onStake}
          className="px-6 py-2 rounded-lg font-semibold 
                   bg-teal-400/20 text-teal-300 border border-teal-400 
                   hover:bg-teal-400/30 transition"
        >
          Add Stake
        </button>

        <button
          onClick={() => onUnstake(stakedAmount)}
          className="px-6 py-2 rounded-lg font-semibold 
                   bg-red-400/20 text-red-300 border border-red-400 
                   hover:bg-red-400/30 transition"
        >
          Unstake All
        </button>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-black/20 border border-white/10">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      <p className="text-lg font-bold text-white tracking-wide">
        {value}{" "}
        <span className="text-xs font-normal text-white/40">{sub}</span>
      </p>
    </div>
  );
}
