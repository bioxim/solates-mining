/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

export function useTransactions(limitCount = 8) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const ref = query(
      collection(db, "transactions", "live", "recent"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const unsub = onSnapshot(ref, (snap) => {
      const list: any[] = snap.docs.map((doc) => {
        const raw = doc.data();

        // Validación robusta
        const ts =
          typeof raw.timestamp === "number" && !isNaN(raw.timestamp)
            ? raw.timestamp
            : Date.now();

        // ISO seguro
        const iso =
          typeof raw.dateISO === "string" && !isNaN(Date.parse(raw.dateISO))
            ? raw.dateISO
            : new Date(ts).toISOString();

        return {
          id: doc.id,
          ...raw,
          timestamp: ts,
          dateISO: iso,
        };
      });

      setData(list);
    });

    return () => unsub();
  }, [limitCount]);

  return data;
}
