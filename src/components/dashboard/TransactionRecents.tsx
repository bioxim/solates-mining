import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface TxData {
  id: string;
  type: string;
  amount: number;
  token: string;
  dateISO: string;
  timestamp: number;
}

export default function TransactionRecents() {
  const [transactions, setTransactions] = useState<TxData[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "transactions", "live", "recent"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const raw = d.data();

        // 🔥 Validación fuerte
        const ts =
          typeof raw.timestamp === "number" && !isNaN(raw.timestamp)
            ? raw.timestamp
            : Date.now();

        const iso =
          typeof raw.dateISO === "string" &&
          !isNaN(Date.parse(raw.dateISO))
            ? raw.dateISO
            : new Date(ts).toISOString();

        return {
          id: d.id,
          ...raw,
          timestamp: ts,
          dateISO: iso,
        } as TxData;
      });

      setTransactions(list);
    });

    return () => unsub();
  }, []);

  // 📅 Fecha + Hora con estilo Web3
  const formatDateTime = (iso: string) => {
    const d = new Date(iso);

    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(",", " —");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-[var(--card)] bg-[var(--card)]/40 backdrop-blur-md shadow-lg p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--primary)]">
          Recent Transactions
        </h2>

        <Link
          to="/transactions"
          className="flex items-center gap-2 text-sm text-[var(--primary)] hover:opacity-80 transition"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 && (
          <p className="text-sm opacity-50">No transactions yet.</p>
        )}

        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-3 hover:bg-white/10 transition"
          >
            <span className="text-sm font-semibold text-[var(--text)] capitalize">
              {tx.type}
            </span>

            <span className="text-sm opacity-80">
              {tx.amount} {tx.token}
            </span>

            <span className="text-xs opacity-50">
              {formatDateTime(tx.dateISO)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
