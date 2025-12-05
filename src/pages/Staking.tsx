/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import StakingStats from "../components/staking/StakingStats";
import StakingTiers from "../components/staking/StakingTiers";
import StakingPosition from "../components/staking/StakingPosition";
import StakeModal from "../components/staking/StakeModal";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useWallet } from "../wallet/useWallet";

import { getRankInfo } from "../utils/getRankInfo";
import { stakeOLA, unstakeOLA, mintDevTokens } from "../utils/staking";

export default function Staking() {
  const [modalOpen, setModalOpen] = useState(false);

  const { user, loading } = useCurrentUser();
  const { address: walletAddress, connected } = useWallet();

  // Balance real leído desde Firebase
  const [realBalance, setRealBalance] = useState(0);

  // Escuchar la wallet del usuario (NO uid)
  useEffect(() => {
    if (!walletAddress) return;

    const unsub = onSnapshot(
      doc(db, "wallets", walletAddress, "balances", "OLA"),
      (snap) => {
        setRealBalance(snap.exists() ? snap.data().amount : 0);
      }
    );

    return () => unsub();
  }, [walletAddress]);

  if (loading) return <div className="text-center p-10 text-white/60">Loading App...</div>;
  if (!user) return <div className="text-center p-10 text-red-400">Please login.</div>;
  if (!connected || !walletAddress)
    return <div className="text-center p-10 text-orange-400">Please connect your wallet.</div>;

  const { rank, multiplier } = getRankInfo(user.xp || 0);
  const apy = 2.0 * multiplier;

  // HANDLERS
  const handleConfirmStake = async (amount: number) => {
    try {
      await stakeOLA(walletAddress, amount, { tier: rank, multiplier, apy });
      setModalOpen(false);
    } catch (err: any) {
      console.error("Staking error:", err);
      alert(err.message);
    }
  };

  const handleUnstake = async (amount: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      await unstakeOLA(walletAddress, amount);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMint = async () => {
    await mintDevTokens(walletAddress, 1000);
    alert("Minted 1000 OLA for testing.");
  };

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-b from-[#0a0a0a] to-[#121212] text-white overflow-hidden">

      {/* Dev Tools */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleMint}
          className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20"
        >
          🛠 Mint 1000 OLA (Test)
        </button>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[var(--primary)] mb-10 text-center"
      >
        Staking Room
      </motion.h1>

      <StakingStats
        totalStakers={128}
        totalStaked={45000}
        averageAPY={2.8}
        userRank={rank}
        rankMultiplier={multiplier}
      />

      <StakingPosition
        apy={apy}
        onStake={() => setModalOpen(true)}
        onUnstake={handleUnstake}
        walletAddress={walletAddress}      />

      <div className="mt-12 opacity-80 hover:opacity-100 transition">
        <StakingTiers userRank={rank} onStake={() => setModalOpen(true)} />
      </div>

      {modalOpen && (
        <StakeModal
          onClose={() => setModalOpen(false)}
          userBalance={realBalance}
          apy={apy}
          tierName={rank}
          onConfirm={handleConfirmStake}
        />
      )}
    </div>
  );
}
