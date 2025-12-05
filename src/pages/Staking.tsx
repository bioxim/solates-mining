/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Staking.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Asegúrate de importar db

import StakingStats from "../components/staking/StakingStats";
import StakingTiers from "../components/staking/StakingTiers";
import StakingPosition from "../components/staking/StakingPosition";
import StakeModal from "../components/staking/StakeModal";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { getRankInfo } from "../utils/getRankInfo";
import { stakeOLA, unstakeOLA, mintDevTokens } from "../utils/staking"; // Importamos mintDevTokens

export default function Staking() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, loading } = useCurrentUser();
  
  // Estado local para el balance REAL leído de Firebase
  const [realBalance, setRealBalance] = useState(0);

  // Escuchar el balance real en tiempo real
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, "wallets", user.uid, "balances", "OLA"), (doc) => {
        setRealBalance(doc.exists() ? doc.data().amount : 0);
    });
    return () => unsub();
  }, [user?.uid]);

  if (loading) return <div className="text-center p-10 text-white/60">Loading App...</div>;
  if (!user) return <div className="text-center p-10 text-red-400">Please login.</div>;

  const { rank, multiplier } = getRankInfo(user.xp || 0);
  const apy = 2.0 * multiplier;

  // --- HANDLERS ---

  const handleConfirmStake = async (amount: number) => {
    try {
      console.log(`🔥 Staking ${amount} OLA...`);
      await stakeOLA(user.uid, amount, { tier: rank, multiplier, apy });
      setModalOpen(false);
      // No necesitamos alertas, la UI se actualizará sola gracias a onSnapshot en StakingPosition
    } catch (err: any) {
      console.error("❌ Error staking:", err);
      alert(err.message || "Error staking tokens");
    }
  };

  const handleUnstake = async (amount: number) => {
    if(!confirm("Are you sure you want to unstake all?")) return;
    try {
      await unstakeOLA(user.uid, amount);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMint = async () => {
    await mintDevTokens(user.uid, 1000);
    alert("✅ +1000 OLA añadidos a tu wallet DB para pruebas.");
  };

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-b from-[#0a0a0a] to-[#121212] text-white overflow-hidden">
      
      {/* --- DEV TOOLS (Eliminar en producción) --- */}
      <div className="flex justify-center mb-8">
        <button onClick={handleMint} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20">
          🛠 Mint 1000 OLA (Test)
        </button>
      </div>
      {/* ------------------------------------------ */}

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

      {/* Pasamos el userId directamente para evitar errores de hooks */}
      <StakingPosition
        userId={user.uid}
        apy={apy}
        onStake={() => setModalOpen(true)}
        onUnstake={handleUnstake}
      />
      
      {/* Tiers Informativos */}
      <div className="mt-12 opacity-80 hover:opacity-100 transition">
        <StakingTiers userRank={rank} onStake={() => setModalOpen(true)} />
      </div>

      {modalOpen && (
        <StakeModal
          onClose={() => setModalOpen(false)}
          userBalance={realBalance} // <--- Pasamos el balance REAL, no el placeholder
          apy={apy}
          tierName={rank}
          onConfirm={handleConfirmStake}
        />
      )}
    </div>
  );
}