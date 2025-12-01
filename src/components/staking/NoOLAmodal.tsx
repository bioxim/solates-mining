import { motion } from "framer-motion";

interface NoOLAmodalProps {
  onClose: () => void;
}

export default function NoOLAmodal({ onClose }: NoOLAmodalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          You don't have $OLA yet
        </h2>

        <p className="text-gray-300 text-center mb-8">
          To stake and earn rewards, you need to hold some $OLA in your wallet.
        </p>

        <div className="flex flex-col gap-4">
          <a
            href="https://app.uniswap.org/swap?outputCurrency=YOUR_OLA_TOKEN_ADDRESS"
            target="_blank"
            className="w-full py-3 text-center rounded-xl font-semibold bg-[var(--primary)] text-black hover:opacity-90 transition"
          >
            Buy $OLA
          </a>

          <button
            className="w-full py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
          >
            How to buy?
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-gray-400 hover:text-gray-200 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
