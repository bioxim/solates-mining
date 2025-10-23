import { motion } from "framer-motion";

export default function StakeSummary() {
  const summary = [
    { label: "TVL", value: "$1.23M" },
    { label: "APY", value: "5.25%" },
    { label: "Stakers", value: "3.247K" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap justify-around items-center text-center gap-6 rounded-2xl bg-[var(--card)]/50 border border-[var(--primary)]/30 p-6 shadow-md"
    >
      {summary.map((item, i) => (
        <div key={i}>
          <h3 className="text-lg text-[var(--primary)] font-semibold mb-1">
            {item.label}
          </h3>
          <p className="text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </motion.div>
  );
}
