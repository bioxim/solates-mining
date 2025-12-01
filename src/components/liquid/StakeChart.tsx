import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

/**
 * StakeChart.tsx
 * Interactive chart with tabs: APY | TVL | Price | Share Price
 * Mock data for visualization; replace with real series when available.
 */

type SeriesPoint = {
  date: string; // label for X axis
  apy: number;
  tvl: number;
  price: number;
  sharePrice: number;
};

const mockSeries: SeriesPoint[] = [
  { date: "Oct 01", apy: 5.0, tvl: 1.0, price: 0.5, sharePrice: 1.0 },
  { date: "Oct 04", apy: 5.1, tvl: 1.05, price: 0.52, sharePrice: 1.002 },
  { date: "Oct 07", apy: 5.2, tvl: 1.15, price: 0.56, sharePrice: 1.007 },
  { date: "Oct 10", apy: 5.1, tvl: 1.12, price: 0.55, sharePrice: 1.006 },
  { date: "Oct 13", apy: 5.3, tvl: 1.25, price: 0.6, sharePrice: 1.01 },
  { date: "Oct 16", apy: 5.25, tvl: 1.28, price: 0.61, sharePrice: 1.015 },
  { date: "Oct 19", apy: 5.4, tvl: 1.35, price: 0.65, sharePrice: 1.02 },
  { date: "Oct 22", apy: 5.3, tvl: 1.4, price: 0.68, sharePrice: 1.03 },
];

export default function StakeChart() {
  const [tab, setTab] = useState<"apy" | "tvl" | "price" | "share">("apy");

  const getKey = () => {
    switch (tab) {
      case "apy":
        return { dataKey: "apy", unit: "%", label: "APY (%)", color: "#60A5FA" };
      case "tvl":
        return { dataKey: "tvl", unit: "M", label: "TVL (M $)", color: "#34D399" };
      case "price":
        return { dataKey: "price", unit: "$", label: "Price ($)", color: "#A78BFA" };
      case "share":
        return { dataKey: "sharePrice", unit: "stOLA", label: "Share Price (stOLA)", color: "#FBBF24" };
    }
  };

  const current = getKey();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full rounded-2xl border border-[var(--card)] bg-[var(--card)]/50 backdrop-blur-md shadow-lg p-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-[var(--primary)]">Staking Metrics</h3>

        <div className="flex gap-2 items-center">
          <div className="hidden sm:flex text-sm opacity-70 mr-2">View:</div>
          <div className="flex gap-2 bg-[var(--card)]/20 rounded-full p-1">
            <button
              onClick={() => setTab("apy")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${tab === "apy" ? "bg-[var(--primary)] text-black" : "text-[var(--text)]/80 hover:bg-white/5"}`}
            >
              APY
            </button>
            <button
              onClick={() => setTab("tvl")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${tab === "tvl" ? "bg-[var(--primary)] text-black" : "text-[var(--text)]/80 hover:bg-white/5"}`}
            >
              TVL
            </button>
            <button
              onClick={() => setTab("price")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${tab === "price" ? "bg-[var(--primary)] text-black" : "text-[var(--text)]/80 hover:bg-white/5"}`}
            >
              Price
            </button>
            <button
              onClick={() => setTab("share")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${tab === "share" ? "bg-[var(--primary)] text-black" : "text-[var(--text)]/80 hover:bg-white/5"}`}
            >
              Share price
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockSeries}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{ background: "rgba(10,10,12,0.95)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}
              itemStyle={{ color: current.color }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => {
                // Format tooltip value depending on tab
                if (tab === "apy") return `${value.toFixed(2)} %`;
                if (tab === "tvl") return `${value.toFixed(2)} M`;
                if (tab === "price") return `$ ${value.toFixed(2)}`;
                return `${value.toFixed(4)} stOLA`;
              }}
            />
            <Line
              type="monotone"
              dataKey={current.dataKey}
              stroke={current.color}
              strokeWidth={2.2}
              dot={{ r: 3, fill: current.color }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-[var(--text)]/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="text-xs opacity-70">{current.label}</div>
          {/* Show the latest value */}
          <div className="text-lg font-semibold" style={{ color: current.color }}>
            {(() => {
              const last = mockSeries[mockSeries.length - 1][current.dataKey as keyof SeriesPoint] as number;
              if (tab === "apy") return `${last.toFixed(2)} %`;
              if (tab === "tvl") return `${last.toFixed(2)} M`;
              if (tab === "price") return `$ ${last.toFixed(2)}`;
              return `${last.toFixed(4)} stOLA`;
            })()}
          </div>
        </div>

        <div className="text-sm opacity-70">
          Tip: Toggle the tabs to inspect APY, TVL, Price and Share Price.
        </div>
      </div>
    </motion.div>
  );
}
