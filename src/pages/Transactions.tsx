/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Transactions.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface TxData {
  id: string;
  type: string;
  amount: number;
  token: string;
  dateISO: string;
  timestamp: number;
  from?: string;
  to?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TxData[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [filterType, setFilterType] = useState("");
  const [filterToken, setFilterToken] = useState("");

  const baseRef = collection(db, "transactions", "live", "recent");

  // ============================
  // 🔥 Primera carga
  // ============================
  useEffect(() => {
    const q = query(baseRef, orderBy("timestamp", "desc"), limit(20));

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const last = snap.docs[snap.docs.length - 1];
        setLastVisible(last);

        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            dateISO:
              data.dateISO ||
              new Date(data.timestamp || Date.now()).toISOString(),
          } as TxData;
        });

        setTransactions(list);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ============================
  // 🔥 Cargar más (scroll)
  // ============================
  const loadMore = () => {
    if (!lastVisible || loadingMore) return;

    setLoadingMore(true);

    const q = query(
      baseRef,
      orderBy("timestamp", "desc"),
      startAfter(lastVisible),
      limit(20)
    );

    onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const last = snap.docs[snap.docs.length - 1];
        setLastVisible(last);

        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            dateISO:
              data.dateISO ||
              new Date(data.timestamp || Date.now()).toISOString(),
          } as TxData;
        });

        setTransactions((prev) => [...prev, ...list]);
      }

      setLoadingMore(false);
    });
  };

  // ============================
  // 🔍 Filtros simples
  // ============================
  const filtered = transactions.filter((tx) => {
    return (
      (filterType ? tx.type === filterType : true) &&
      (filterToken ? tx.token === filterToken : true)
    );
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 w-full"
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/dashboard"
          className="text-[var(--primary)] hover:opacity-80 transition"
        >
          <ArrowLeft size={22} />
        </Link>

        <h1 className="text-2xl font-bold text-[var(--primary)]">
          Back to Dashboard
        </h1>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
        >
          <option value="">Type: All</option>
          <option value="stake">Stake</option>
          <option value="unstake">Unstake</option>
          <option value="mine">Mine</option>
          <option value="reward">Reward</option>
          <option value="treasury">Treasury</option>
          <option value="system">System</option>
        </select>

        <select
          value={filterToken}
          onChange={(e) => setFilterToken(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
        >
          <option value="">Token: All</option>
          <option value="OLA">OLA</option>
          <option value="USDC">USDC</option>
          <option value="SOL">SOL</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="opacity-70 text-sm">Loading transactions...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <p className="opacity-50 text-sm">No transactions found.</p>
      )}

      {/* LISTA */}
      <div className="space-y-3 mt-4">
        {filtered.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition cursor-default"
          >
            <div>
              <p className="text-sm font-semibold capitalize text-[var(--text)]">
                {tx.type}
              </p>

              <p className="text-xs opacity-50">
                {tx.from} → {tx.to}
              </p>
            </div>

            <span className="text-sm opacity-80">
              {tx.amount} {tx.token}
            </span>

            <span className="text-xs opacity-50">{formatDate(tx.dateISO)}</span>
          </motion.div>
        ))}
      </div>

      {/* BOTÓN CARGAR MÁS */}
      <div className="mt-6 flex justify-center">
        {!loadingMore && lastVisible && (
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-[var(--primary)] rounded-xl text-white text-sm hover:opacity-80 transition"
          >
            Load more
          </button>
        )}

        {loadingMore && (
          <p className="text-sm opacity-60">Loading...</p>
        )}
      </div>
    </motion.div>
  );
}
