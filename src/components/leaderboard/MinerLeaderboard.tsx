import { motion } from "framer-motion";

const miners = [
  { rank: 1, avatar: "🧑‍🚀", address: "0x1234...abcd", daily: 1250 },
  { rank: 2, avatar: "🧙‍♂️", address: "0x5678...efgh", daily: 1100 },
  { rank: 3, avatar: "🧑‍🌾", address: "0x90ab...ijkl", daily: 970 },
  { rank: 4, avatar: "🦸‍♂️", address: "0xaaaa...bbbb", daily: 800 },
  { rank: 5, avatar: "👩‍🔬", address: "0xcccc...dddd", daily: 750 },
];

export default function MinerLeaderboard() {
  return (
    <div className="flex flex-col items-center">
      {/* 🥇 Top 5 destacados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 w-full max-w-6xl">
        {miners.map((miner) => (
          <motion.div
            key={miner.rank}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: miner.rank * 0.05 }}
            className="p-4 rounded-2xl bg-[var(--card)]/60 border border-[var(--card)] text-center backdrop-blur-sm"
          >
            <div className="text-3xl mb-2">{miner.avatar}</div>
            <div className="font-semibold text-lg">#{miner.rank}</div>
            <div className="text-sm opacity-70">{miner.address}</div>
            <div className="mt-2 text-[var(--primary)] font-bold">
              {miner.daily} OLA / day
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📋 Tabla general paginada (mock) */}
      <div className="w-full max-w-4xl bg-[var(--card)]/40 border border-[var(--card)] rounded-xl p-4 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-[var(--primary)]">
            <tr>
              <th className="text-left py-2">Rank</th>
              <th className="text-left py-2">Avatar</th>
              <th className="text-left py-2">Address</th>
              <th className="text-right py-2">OLA / day</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 100 }, (_, i) => (
              <tr
                key={i}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-2">#{i + 1}</td>
                <td>🧑‍🚀</td>
                <td>0x{i.toString().padStart(4, "0")}...abcd</td>
                <td className="text-right">{(1000 - i * 5).toFixed(0)} OLA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
