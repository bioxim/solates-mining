import { motion } from "framer-motion";

interface SlotCardProps {
  slot: {
    id: number;
    active: boolean;
    power: string | null;
    mined: number;
  };
  onActivate: () => void;
}

export default function SlotCard({ slot, onActivate }: SlotCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: slot.id * 0.1 }}
      className={`relative p-6 rounded-2xl w-64 h-64 flex flex-col items-center justify-center border overflow-hidden 
        ${
          slot.active
            ? "bg-[var(--card)]/40 border-[var(--primary)] shadow-[0_0_20px_rgba(0,255,200,0.2)]"
            : "bg-white/5 border-white/10"
        } backdrop-blur-md`}
    >
      {/* 🔹 Pulso de energía */}
      {slot.active && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-[var(--primary)]/10 blur-xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="absolute top-3 right-4 text-xs opacity-60">Slot #{slot.id}</div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {slot.active ? (
          <>
            <div className="text-4xl mb-3 animate-pulse">⚡</div>
            <div className="text-lg font-semibold">{slot.power}</div>
            <div className="text-sm opacity-70 mb-3">
              {slot.mined.toFixed(7)} $OLA/day
            </div>
            <button className="px-4 py-1 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition">
              Upgrade
            </button>
          </>
        ) : (
          <>
            <div className="text-3xl mb-2 opacity-70">🔒</div>
            <p className="text-sm opacity-70 mb-4">Inactive Slot</p>
            <button
              onClick={onActivate}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Activate (1 USDC)
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
