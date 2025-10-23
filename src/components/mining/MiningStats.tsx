import { motion } from "framer-motion";

export default function MiningStats() {
  const stats = [
    { label: "Mined Today", value: "0.0000005 $OLA" },
    { label: "Total Mined", value: "1.204 $OLA" },
    { label: "Avg. Power", value: "x3.4" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-center gap-6 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-md"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center px-6 py-2 min-w-[160px]"
        >
          <span className="text-sm opacity-70">{stat.label}</span>
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="text-2xl font-bold text-[var(--primary)]"
          >
            {stat.value}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}
