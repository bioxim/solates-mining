import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from "recharts";
import { motion } from "framer-motion";
import { useTokenomics } from "../../hooks/useTokenomics";

export default function TreasuryChart() {
  const { data } = useTokenomics();

  // Datos reales Firestore
  const currentFDV = data?.fdv ?? 0;
  const currentPrice = data?.tokenPrice ?? 0;
  const TOTAL_SUPPLY = data?.totalSupply ?? 10_000_000_000;

  // Preparamos FDVs simulados (millones)
  const fdvValues = [5, 25, 50, 75, 100, 150, 200, 250];

  // 1. CAMBIO: Usamos un valor numérico puro para el eje X
  const chartData = fdvValues.map((fdv) => {
    const fdvValue = fdv * 1_000_000;
    return {
      fdvInMillions: fdv, // Guardamos el 5, 25, etc. numérico
      price: Number((fdvValue / TOTAL_SUPPLY).toFixed(8)),
    };
  });

  // 2. CAMBIO: Calculamos el valor X real como número (ej: 12.5)
  const currentFDVInMillions = currentFDV / 1_000_000;
  const realPrice = Number(currentPrice.toFixed(8));

  // Mínimo visual para evitar colapso inferior
  const visualPrice = realPrice < 0.000001 ? 0.000001 : realPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-2xl border border-[var(--card)] bg-[var(--card)]/50 backdrop-blur-md shadow-lg p-6 mt-8"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--primary)]">
          $OLA Value Projection
        </h2>

        <span className="text-sm px-3 py-1 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)] text-[var(--primary)]">
          $OLA Price: ${realPrice}
        </span>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />

            {/* 3. CAMBIO: Eje X numérico con formateo visual */}
            <XAxis 
              dataKey="fdvInMillions" 
              type="number" // Importante: permite interpolar valores intermedios
              domain={['dataMin', 'dataMax']} 
              tickFormatter={(value) => `$${value}M`} // Aquí ponemos el texto bonito
              stroke="rgba(255,255,255,0.5)" 
            />

            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tickFormatter={(v) => `$${v}`}
              width={70}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(20,20,20,0.9)",
                border: "1px solid var(--primary)",
                borderRadius: "8px",
              }}
              // Ajustamos el formatter para que el tooltip se vea bien
              formatter={(value) => [`$${value}`, "Price"]}
              labelFormatter={(label) => `FDV: $${label}M`}
              labelStyle={{ color: "var(--primary)" }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--primary)" }}
              activeDot={{ r: 6 }}
            />

            {/* 4. CAMBIO: Ahora ReferenceDot recibe el número exacto en X */}
            <ReferenceDot
              x={currentFDVInMillions} // Ej: 12.4 (se ubicará entre 5 y 25 automáticamente)
              y={visualPrice}
              r={7}
              fill="#00baff"
              stroke="white"
              strokeWidth={2}
              // Usamos alwaysShow para forzar que se vea si está cerca de los bordes
              ifOverflow="extendDomain" 
              label={{
                position: "top",
                value: "Current",
                fill: "#00baff",
                fontSize: 12,
                fontWeight: "bold"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-sm mt-4 text-[var(--text)]/60">
        Real-time $OLA value compared to projected price curve.
      </p>
    </motion.div>
  );
}