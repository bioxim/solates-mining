import { motion } from "framer-motion";
import { useState } from "react";

import StakingStats from "../components/staking/StakingStats";
import StakingTiers from "../components/staking/StakingTiers";
import StakingPosition from "../components/staking/StakingPosition";
import StakeModal from "../components/staking/StakeModal";

export default function Staking() {
  const [modalOpen, setModalOpen] = useState(false);

  // 👉 Valores simulados (luego vendrán de Firestore/Context)
  const userRank = "Explorer";
  const userBalanceMock = 1000; // Ejemplo de balance
  const currentApyMock = 2.0;   // Ejemplo de APY para el rango actual

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-b from-[#0a0a0a] to-[#121212] text-white overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[var(--primary)] mb-10 text-center"
      >
        Staking Room
      </motion.h1>

      {/* 🔹 Stats generales */}
      <StakingStats
        totalStakers={128}
        totalStaked={45000}
        averageAPY={2.8}
        userRank={userRank}
        rankMultiplier={1.0}
      />

      {/* 🔹 Tiers: Lista de tarjetas */}
      <StakingTiers
        userRank={userRank}
        onStake={() => setModalOpen(true)}
      />

      <StakingPosition
        userRank={userRank}
        userStaked={0}      // simulado por ahora
        totalStaked={45000} // el mismo valor que estás pasando a StakingStats
        apy={2.0}           // según tier del usuario
      />




      {/* 🔹 Modal: Ahora con las props requeridas */}
      {modalOpen && (
        <StakeModal 
            onClose={() => setModalOpen(false)} 
            userBalance={userBalanceMock}
            apy={currentApyMock}
            tierName={userRank}
        />
      )}

    </div>
  );
}