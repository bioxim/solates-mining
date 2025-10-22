import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function TreasuryChart() {
  // Mock data — se calculará dinámicamente después
  const fdvValues = [5, 25, 50, 75, 100, 150, 200, 250]; // millones de FDV
  const userTokens = 1000; // cantidad de $OLA simulada

  const data = fdvValues.map((fdv) => ({
    fdv: `$${fdv}M`,
    value: ((fdv * 1_000_000 * 0.000001) * userTokens).toFixed(2), // fórmula simulada
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-2xl border border-[var(--card)] bg-[var(--card)]/50 backdrop-blur-md shadow-lg p-6 mt-8"
    >
      <h2 className="text-xl font-bold mb-6 text-[var(--primary)] text-center">
        $OLA Value Projection
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="fdv" stroke="rgba(255,255,255,0.5)" />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tickFormatter={(v) => `$${v}`}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(20,20,20,0.9)",
                border: "1px solid var(--primary)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--primary)" }}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              formatter={(value, _name) => [`$${value}`, "Value"]}
              labelFormatter={(fdv) => `FDV: ${fdv}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "var(--primary)" }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-sm mt-4 text-[var(--text)]/60">
        Simulated relationship between FDV and projected $OLA portfolio value.
      </p>
    </motion.div>
  );
}
