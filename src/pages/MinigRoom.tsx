import { motion } from "framer-motion";
import MiningStats from "../components/mining/MiningStats";
import SlotCard from "../components/mining/SlotCard";
import ActivateSlotModal from "../components/mining/ActivateSlotModal";
import { useState } from "react";

export default function MiningRoom() {
  const [modalOpen, setModalOpen] = useState(false);

  const slots = [
    { id: 1, active: true, power: "x1", mined: 0.0000001 },
    { id: 2, active: true, power: "x2", mined: 0.0000002 },
    { id: 3, active: true, power: "x5", mined: 0.0000005 },
    { id: 4, active: false, power: null, mined: 0 },
    { id: 5, active: false, power: null, mined: 0 },
  ];

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-b from-[#0a0a0a] to-[#121212] text-white overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[var(--primary)] mb-10 text-center"
      >
        Mining Room
      </motion.h1>

      <MiningStats />

      {/* 🔹 Grilla 3 + 2 */}
      <div className="mt-12 mb-12 flex flex-col items-center gap-8">
        {/* Fila superior (3 slots) */}
        <div className="flex flex-wrap justify-center gap-8">
          {slots.slice(0, 3).map((slot) => (
            <SlotCard key={slot.id} slot={slot} onActivate={() => setModalOpen(true)} />
          ))}
        </div>

        {/* Fila inferior (2 slots) */}
        <div className="flex flex-wrap justify-center gap-8">
          {slots.slice(3, 5).map((slot) => (
            <SlotCard key={slot.id} slot={slot} onActivate={() => setModalOpen(true)} />
          ))}
        </div>
      </div>

      {modalOpen && <ActivateSlotModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
