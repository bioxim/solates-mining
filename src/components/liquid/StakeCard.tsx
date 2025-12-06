/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { liquidStake, liquidUnstake } from "../../utils/liquid";
import { useWallet } from "../../wallet/useWallet";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function StakeCard() {
  const { address, connected } = useWallet();

  const [userStaked, setUserStaked] = useState<number | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");

  const [sharePrice, setSharePrice] = useState<number>(1);
  const [stOlaBalance, setStOlaBalance] = useState<number>(0);

  const APY = 5.25; // puedes hacerlo dinámico

  // -----------------------------
  // 1) Cargar economy (sharePrice)
  // -----------------------------
  useEffect(() => {
    const ref = doc(db, "economy", "liquidStake");

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setSharePrice(d.sharePrice ?? 1);
      }
    });

    return () => unsub();
  }, []);

  // -----------------------------
  // 2) Cargar balance real de stOLA
  // -----------------------------
  useEffect(() => {
    if (!connected || !address) return;

    const ref = doc(db, "wallets", address, "balances", "stOLA");

    const unsub = onSnapshot(ref, (snap) => {
      setStOlaBalance(snap.exists() ? snap.data().amount ?? 0 : 0);
    });

    return () => unsub();
  }, [connected, address]);

  // -----------------------------
  // 3) Fake data for rank (mock)
  // -----------------------------
  useEffect(() => {
    // mock simple
    setUserStaked(42.5);
    setUserRank(128);
  }, []);

  const parsedStake = parseFloat(amount || "0");
  const parsedRedeem = parseFloat(redeemAmount || "0");

  const yearlyReward = (parsedStake * APY) / 100;
  const expectedStOLA = parsedStake > 0 ? parsedStake / sharePrice : 0;
  const expectedRedeemOLA = parsedRedeem > 0 ? parsedRedeem * sharePrice : 0;

  // -----------------------------
  // Handler STAKE
  // -----------------------------
  async function handleStake() {
    if (!connected || !address) {
      alert("Connect your wallet first.");
      return;
    }
    if (parsedStake <= 0) return;

    try {
      await liquidStake(address, parsedStake);
      setAmount("");
    } catch (e: any) {
      alert(e.message);
    }
  }

  // -----------------------------
  // Handler REDEEM
  // -----------------------------
  async function handleRedeem() {
    if (!connected || !address) {
      alert("Connect your wallet first.");
      return;
    }
    if (parsedRedeem <= 0) return;
    if (parsedRedeem > stOlaBalance) {
      alert("You don't have enough stOLA.");
      return;
    }

    try {
      await liquidUnstake(address, parsedRedeem);
      setRedeemAmount("");
    } catch (e: any) {
      alert(e.message);
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="p-6 rounded-2xl bg-[#090b15]/70 border border-[var(--primary)]/30 backdrop-blur-xl shadow-xl max-w-md mx-auto text-white"
    >
      <h2 className="text-xl font-bold text-[var(--primary)] mb-4 text-center">
        Stake $OLA → Receive stOLA
      </h2>

      {/* USER DATA */}
      <div className="mb-6 text-center">
        <div className="text-sm opacity-70">Your staked</div>
        <div className="text-2xl font-semibold mt-1">
          {userStaked !== null ? `${userStaked} OLA` : "—"}
        </div>
        <div className="text-xs opacity-60 mt-1">
          Rank #{userRank ?? "—"} among stakers
        </div>
      </div>

      {/* ------------ STAKE SECTION ------------ */}
      <div className="mb-6">
        <label className="text-sm opacity-80">Amount to stake</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full mt-2 px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-[var(--primary)] transition text-right"
        />
      </div>

      <div className="flex justify-between text-sm opacity-80 mb-3">
        <div>APY</div>
        <div className="font-semibold">{APY}%</div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm opacity-70">Estimated yearly reward</div>
        <div className="text-lg font-semibold text-[var(--primary)]">
          {yearlyReward.toFixed(3)} OLA
        </div>
      </div>

      {parsedStake > 0 && (
        <div className="text-xs text-right opacity-70 mb-4">
          You will receive{" "}
          <span className="text-[var(--primary)] font-semibold">
            {expectedStOLA.toFixed(4)} stOLA
          </span>
        </div>
      )}

      <button
        disabled={parsedStake <= 0}
        onClick={handleStake}
        className="w-full py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 transition text-black font-semibold mb-10"
      >
        Stake now
      </button>

      {/* ------------ REDEEM SECTION ------------ */}
      <h3 className="text-lg font-bold text-[var(--primary)] mb-2">
        Redeem stOLA → OLA
      </h3>

      <div className="text-sm opacity-70 mb-2">
        Your stOLA balance:{" "}
        <span className="font-mono text-white">{stOlaBalance.toFixed(4)}</span>
      </div>

      <div className="mb-4">
        <input
          type="number"
          value={redeemAmount}
          onChange={(e) => setRedeemAmount(e.target.value)}
          placeholder="0.0"
          className="w-full mt-2 px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-[var(--primary)] transition text-right"
        />
      </div>

      {parsedRedeem > 0 && (
        <div className="text-xs text-right opacity-70 mb-4">
          You will redeem{" "}
          <span className="text-[var(--primary)] font-semibold">
            {expectedRedeemOLA.toFixed(4)} OLA
          </span>
        </div>
      )}

      <button
        disabled={parsedRedeem <= 0}
        onClick={handleRedeem}
        className="w-full py-3 rounded-xl bg-[#ff4d6d]/80 hover:bg-[#ff4d6d] transition text-white font-semibold"
      >
        Redeem now
      </button>

      <p className="text-xs mt-3 opacity-60 text-center">
        When you stake you receive <strong>stOLA</strong>.  
        Share price increases over time as rewards accrue.
      </p>
    </motion.div>
  );
}
