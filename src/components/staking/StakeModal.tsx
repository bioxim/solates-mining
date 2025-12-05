import { useState } from "react";
import { motion } from "framer-motion";

interface StakeModalProps {
  onClose: () => void;
  onConfirm: (amount: number) => void; // NUEVO
  userBalance: number;
  apy: number;
  tierName: string;
}

export default function StakeModal({
  onClose,
  onConfirm,
  userBalance,
  apy,
  tierName,
}: StakeModalProps) {
  const [amount, setAmount] = useState("");

  const numericAmount = Number(amount);
  const estimatedYearly = numericAmount * (apy / 100);

  const confirmDisabled =
    numericAmount <= 0 || numericAmount > userBalance || Number.isNaN(numericAmount);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Stake $OLA — {tierName} Tier
        </h2>

        <p className="text-gray-300 text-center mb-4">
          Your balance:{" "}
          <span className="text-[var(--primary)]">{userBalance} OLA</span>
        </p>

        <div className="mb-6">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white"
            placeholder="Enter amount to stake"
          />

          {numericAmount > 0 && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <p className="text-gray-300 text-sm">
                APY: <span className="text-[var(--primary)]">{apy}%</span>
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Estimated yearly rewards:
                <span className="text-[var(--primary)] ml-2">
                  {estimatedYearly.toFixed(2)} OLA
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onConfirm(numericAmount)}
            disabled={confirmDisabled}
            className="w-full py-3 rounded-xl font-semibold bg-[var(--primary)] text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Stake
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-gray-400 hover:text-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
