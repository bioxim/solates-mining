// src/components/liquid/StakeSummary.tsx
import { motion } from "framer-motion";

export default function StakeSummary({
  tvl,
  apy,
  stakers,
}: {
  tvl: number | null;
  apy: number | null;
  stakers: number | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        flex flex-wrap justify-around items-center text-center gap-6
        rounded-2xl
        bg-[#0f1020]/60
        border border-purple-500/30 
        p-8 shadow-[0_0_25px_rgba(168,85,247,0.15)]
      "
    >
      <SummaryItem label="TVL" value={tvl ? `$${tvl.toLocaleString()}` : "—"} />
      <SummaryItem label="APY" value={apy ? `${apy}%` : "—"} />
      <SummaryItem
        label="Stakers"
        value={stakers ? stakers.toLocaleString() : "—"}
      />
    </motion.div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-lg text-purple-400 font-semibold mb-1">{label}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
