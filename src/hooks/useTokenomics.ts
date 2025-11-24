/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useTokenomics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "tokenomics", "live");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const raw = snap.data();

          const safeData = {
            totalSupply: raw.totalSupply ?? 0,
            activeUsers: raw.activeUsers ?? 0,

            // ESTOS DOS SON CLAVE 🔥🔥🔥
            minted: raw.minted ?? 0,
            stakingLocked: raw.stakingLocked ?? 0,

            fdv: raw.fdv ?? 0,
            tokenPrice: raw.tokenPrice ?? 0,

            distribution: {
              treasuryCore: raw.distribution?.treasuryCore ?? 0,
              treasuryLive: raw.distribution?.treasuryLive ?? 0,
              minersRewards: raw.distribution?.minersRewards ?? 0,
              stakingPool: raw.distribution?.stakingPool ?? 0,
            },

            updatedAt: raw.updatedAt ?? null,
          };

          setData(safeData);
        }

        setLoading(false);
      },
      (err) => {
        console.error("🔥 Error loading tokenomics:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { data, loading };
}
