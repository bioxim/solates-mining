import { useState, useEffect } from "react"; // Agregamos useEffect
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Info } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore"; // Importamos listener
import { db } from "../../firebase"; // Asegúrate que la ruta sea correcta
import { simulateTokenomics } from "../../simulations/simulateTokenomics";

// Definimos la forma de los datos que vienen de Firebase para TypeScript
interface TokenomicsData {
  totalSupply: number;
  fdv: number;
  distribution: {
    treasuryCore: number;
    minersRewards: number;
    stakingPool: number;
    treasuryLive: number;
  };
}

export default function TopStatsBar() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Estado para los datos "en vivo"
  // Iniciamos con null para saber cuando aún no ha cargado
  const [data, setData] = useState<TokenomicsData | null>(null);

  // ---------------------------
  // 1. LISTENER EN TIEMPO REAL
  // ---------------------------
  useEffect(() => {
    // Escuchamos el documento 'live' dentro de 'tokenomics'
    const unsub = onSnapshot(doc(db, "tokenomics", "live"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as TokenomicsData);
      } else {
        console.log("No data found, run simulation first!");
      }
    });

    // Limpiamos la suscripción cuando el componente se desmonta
    return () => unsub();
  }, []);

  // ---------------------------
  // 2. PREPARAR DATOS (Fallback si es null)
  // ---------------------------
  
  // Si 'data' existe (vino de firebase) usamos eso, sino usamos 0 o valores default
  const totalSupply = data?.totalSupply || 0;
  const fdv = data?.fdv || 0;

  // Mapeamos la distribución que guardaste en la simulación
  // Nota: OPERATIONS_SPENT no lo simulamos, así que lo dejamos fijo por ahora
  const operationsSpent = 350_000_000; 
  
  const protocolReserve = data?.distribution.treasuryCore || 0;
  const distributedRewards = data?.distribution.minersRewards || 0;
  
  // Calculamos el treasury balance basado en lo que llega
  // O usamos el valor directo 'treasuryLive' que simulaste
  const treasuryBalance = data?.distribution.treasuryLive || 0;

  const chartData = [
    { name: "Protocol Reserve (7%)", value: protocolReserve, color: "#5E17EB" },
    { name: "Distributed Rewards", value: distributedRewards, color: "#00C49F" },
    { name: "Operations & Expenses", value: operationsSpent, color: "#FFBB28" },
    { name: "Treasury Balance", value: treasuryBalance, color: "#FF8042" },
  ];

  const formatNumber = (n: number) =>
    Intl.NumberFormat("en-US").format(Math.floor(n));

  return (
    <>
      {/* SIMULATION BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={async () => {
            try {
              setLoading(true);
              await simulateTokenomics();
              // No necesitamos recargar nada manual, onSnapshot lo hará por nosotros
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          }}
          className="px-4 py-2 bg-[var(--primary)] text-black font-bold rounded-lg hover:opacity-80 transition"
        >
          {loading ? "Simulating..." : "Simulate New Data"}
        </button>
      </div>

      {/* TOP BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Supply */}
        <motion.div
          // Key ayuda a React a reiniciar la animación si el valor cambia
          key={`supply-${totalSupply}`} 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-[var(--card)]/50 border border-[var(--card)] shadow"
        >
          <p className="text-sm text-gray-400">Total $OLA Emitted</p>
          <h2 className="text-2xl font-bold text-[var(--primary)] mt-1">
            {formatNumber(totalSupply)}
          </h2>
        </motion.div>

        {/* Treasury Balance */}
        <motion.div
           key={`treasury-${treasuryBalance}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-[var(--card)]/50 border border-[var(--card)] shadow flex flex-col"
        >
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Treasury Balance</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-[var(--primary)] hover:opacity-80 transition"
            >
              <Info size={18} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-[var(--primary)] mt-1">
            {formatNumber(treasuryBalance)} OLA
          </h2>
        </motion.div>

        {/* FDV */}
        <motion.div
           key={`fdv-${fdv}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-[var(--card)]/50 border border-[var(--card)] shadow"
        >
          <p className="text-sm text-gray-400">FDV (Fully Diluted Value)</p>
          <h2 className="text-2xl font-bold text-[var(--primary)] mt-1">
            ${formatNumber(fdv)}
          </h2>
        </motion.div>
      </div>

      {/* MODAL (PieChart usa chartData dinámico ahora) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[var(--card)] p-6 rounded-2xl w-[90%] max-w-xl shadow-xl border border-[var(--primary)]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-[var(--primary)] mb-4">
                Treasury Distribution (Live)
              </h2>

              <div className="flex justify-center mb-5">
                <PieChart width={280} height={280}>
                  <Pie
                    data={chartData}
                    cx={140}
                    cy={140}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      formatNumber(value as number) + " OLA",
                      name,
                    ]}
                  />
                </PieChart>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {chartData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full py-2 rounded-lg bg-[var(--primary)] text-black font-bold hover:opacity-90 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}