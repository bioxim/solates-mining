/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Liquid.tsx

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useWallet } from "../wallet/useWallet";
import StakeSummary from "../components/liquid/StakeSummary";
import StakeChart from "../components/liquid/StakeChart";
import StakeCard from "../components/liquid/StakeCard";

const AnyStakeCard: any = StakeCard;

export default function Liquid() {
  const { address, connected } = useWallet();

  const [tvl, setTvl] = useState<number | null>(null);
  const [apy, setApy] = useState<number | null>(null);
  const [sharePrice, setSharePrice] = useState<number | null>(null);

  const [ola, setOla] = useState<number>(0);
  const [stOla, setStOla] = useState<number>(0);

  // 📌 Leer datos globales del stake líquido
  useEffect(() => {
    const ref = doc(db, "economy", "liquidStake");
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const d = snap.data();
      setTvl(d.tvl ?? 0);
      setApy(d.apy ?? 0);
      setSharePrice(d.sharePrice ?? 1);
    });

    return () => unsub();
  }, []);

  // 📌 Leer balances reales de la wallet
  useEffect(() => {
    if (!connected || !address) return;

    const unsub1 = onSnapshot(
      doc(db, "wallets", address, "balances", "OLA"),
      (snap) => setOla(snap.exists() ? snap.data().amount ?? 0 : 0)
    );

    const unsub2 = onSnapshot(
      doc(db, "wallets", address, "balances", "stOLA"),
      (snap) => setStOla(snap.exists() ? snap.data().amount ?? 0 : 0)
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [address, connected]);

  return (
    <div className="min-h-screen p-8 bg-[var(--bg)] text-[var(--text)] mb-12">

      <h1 className="text-3xl font-bold text-[var(--primary)] mb-6 text-center">
        Liquid Stake stOLA
      </h1>

      <div className="max-w-6xl mx-auto grid gap-6">

        <StakeSummary tvl={tvl} apy={apy} stakers={null} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StakeChart />
          </div>
            <AnyStakeCard
              connected={connected}
              address={address || ""}
              userOla={ola}
              userStOla={stOla}
              apy={apy ?? 0}
              sharePrice={sharePrice ?? 1}
            />
              sharePrice={sharePrice ?? 1}
           
          </div>
        </div>
      </div>
  );
}
