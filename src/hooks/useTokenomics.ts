/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useTokenomics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ref = doc(db, "tokenomics/live/current");
    const unsub = onSnapshot(ref, (snap) => {
      setData(snap.data());
    });

    return () => unsub();
  }, []);

  return data;
}
