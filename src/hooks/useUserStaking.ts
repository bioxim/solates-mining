/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useUserStaking.tsx
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { calcYieldSince } from "../utils/staking";

export default function useUserStaking() {
  const [data, setData] = useState<any>(null);
  const [liveYield, setLiveYield] = useState<number>(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "userStaking", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setData(d);
      } else {
        setData(null);
      }
    });

    return () => unsub();
  }, []);

  // live tick para que la UI aumente en tiempo real
  useEffect(() => {
    if (!data) {
      setLiveYield(0);
      return;
    }
    const t = setInterval(() => {
      const now = Date.now();
      const pending = calcYieldSince(data.staked || 0, data.apy || 0, data.lastYieldAt || now, now);
      setLiveYield((data.rewardsAccrued || 0) + pending);
    }, 1000);

    return () => clearInterval(t);
  }, [data]);

  return { staking: data, liveYield };
}
