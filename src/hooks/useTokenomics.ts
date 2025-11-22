/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useTokenomics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 📌 ESTA ES LA RUTA ACTUAL QUE USÁS EN simulateTokenomics()
    const ref = doc(db, "tokenomics", "live");

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { data, loading };
}
