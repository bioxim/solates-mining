import { motion } from "framer-motion";

interface ActivateSlotModalProps {
  onClose: () => void;
}

export default function ActivateSlotModal({ onClose }: ActivateSlotModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--primary)] shadow-lg text-center max-w-sm w-full"
      >
        <h2 className="text-xl font-bold mb-3 text-[var(--primary)]">
          Activate Mining Spot
        </h2>
        <p className="text-sm opacity-80 mb-6">
          Activating this spot costs <strong>1 USDC</strong>.  
          It will start generating <strong>0.00001 $OLA</strong> per day.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:opacity-90 text-white text-sm font-semibold transition"
          >
            Confirm Activation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
