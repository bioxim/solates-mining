import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function TransactionHistory() {
  const transactions = [
    { id: 1, type: "Buy", amount: "25.00 OLA", date: "2025-10-18" },
    { id: 2, type: "Stake", amount: "10.00 OLA", date: "2025-10-19" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-md shadow-lg p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--primary)]">
          Recent Transactions
        </h2>
        <button className="flex items-center gap-2 text-sm text-[var(--primary)] hover:opacity-80 transition">
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-3 hover:bg-white/10 transition"
          >
            <span className="text-sm font-semibold text-[var(--text)]">{tx.type}</span>
            <span className="text-sm opacity-80">{tx.amount}</span>
            <span className="text-xs opacity-50">{tx.date}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
