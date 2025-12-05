// src/utils/staking.ts

import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// -------------------------------
// HELPERS
// -------------------------------
export function apyToPerSecond(apyPercent: number) {
  const annual = apyPercent / 100;
  const secsPerYear = 365 * 24 * 3600;
  return annual / secsPerYear;
}

export function calcYieldSince(
  staked: number,
  apyPercent: number,
  lastYieldAtMs: number,
  nowMs = Date.now()
) {
  if (!staked || staked <= 0) return 0;
  const perSec = apyToPerSecond(apyPercent);
  const seconds = Math.max(0, Math.floor((nowMs - lastYieldAtMs) / 1000));
  return staked * perSec * seconds;
}

// -------------------------------
// 🔥 STAKE OLA — NUEVA VERSIÓN 100% WALLET
// -------------------------------
export async function stakeOLA(
  walletAddress: string,
  amount: number,
  tierMeta: { tier: string; apy: number; multiplier: number }
) {
  if (!walletAddress) throw new Error("Missing wallet address");

  const stakeRef = doc(db, "wallets", walletAddress, "staking", "main");
  const balanceRef = doc(db, "wallets", walletAddress, "balances", "OLA");
  const globalRef = doc(db, "economy", "state");

  await runTransaction(db, async (tx) => {
    const [stakeSnap, balanceSnap, globalSnap] = await Promise.all([
      tx.get(stakeRef),
      tx.get(balanceRef),
      tx.get(globalRef),
    ]);

    const now = Date.now();

    // -------------------------------
    // 1. VALIDAR BALANCE
    // -------------------------------
    const balance = balanceSnap.exists() ? balanceSnap.data().amount || 0 : 0;
    if (balance < amount) throw new Error("Insufficient OLA balance");

    // -------------------------------
    // 2. ACTUALIZAR STAKE
    // -------------------------------
    if (!stakeSnap.exists()) {
      tx.set(stakeRef, {
        amount,
        tier: tierMeta.tier,
        apy: tierMeta.apy,
        multiplier: tierMeta.multiplier,
        depositedAt: now,
        lastYieldAt: now,
        rewardsAccrued: 0,
        totalClaimed: 0,
        updatedAt: now,
      });
    } else {
      const d = stakeSnap.data();

      const pending = calcYieldSince(
        d.amount || 0,
        d.apy || tierMeta.apy,
        d.lastYieldAt || now,
        now
      );

      tx.update(stakeRef, {
        amount: (d.amount || 0) + amount,
        apy: tierMeta.apy,
        multiplier: tierMeta.multiplier,
        lastYieldAt: now,
        rewardsAccrued: (d.rewardsAccrued || 0) + pending,
        updatedAt: now,
      });
    }

    // -------------------------------
    // 3. DESCONTAR BALANCE EN WALLET
    // -------------------------------
    tx.set(
      balanceRef,
      { amount: balance - amount, updatedAt: now },
      { merge: true }
    );

    // -------------------------------
    // 4. ACTUALIZAR POOL GLOBAL
    // -------------------------------
    const currentPool = globalSnap.exists()
      ? globalSnap.data().stakingPool || 0
      : 0;

    tx.set(
      globalRef,
      {
        stakingPool: currentPool + amount,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });
}

// -------------------------------
// 🔥 UNSTAKE OLA — NUEVA VERSIÓN WALLET
// -------------------------------
export async function unstakeOLA(walletAddress: string, amount: number) {
  if (!walletAddress) throw new Error("Missing wallet address");

  const stakeRef = doc(db, "wallets", walletAddress, "staking", "main");
  const balanceRef = doc(db, "wallets", walletAddress, "balances", "OLA");
  const globalRef = doc(db, "economy", "state");

  return await runTransaction(db, async (tx) => {
    const [stakeSnap, balanceSnap, globalSnap] = await Promise.all([
      tx.get(stakeRef),
      tx.get(balanceRef),
      tx.get(globalRef),
    ]);

    if (!stakeSnap.exists()) throw new Error("No staking position found");

    const now = Date.now();
    const d = stakeSnap.data();

    const staked = d.amount || 0;
    if (amount > staked) throw new Error("Unstake amount exceeds staked amount");

    // Recalculate yields
    const pending = calcYieldSince(
      staked,
      d.apy || 0,
      d.lastYieldAt || now,
      now
    );

    const totalRewards = (d.rewardsAccrued || 0) + pending;

    const newStaked = staked - amount;

    // -------------------------------
    // 1. UPDATE STAKING POSITION
    // -------------------------------
    tx.update(stakeRef, {
      amount: newStaked,
      rewardsAccrued: 0,
      lastYieldAt: now,
      updatedAt: now,
      totalClaimed: (d.totalClaimed || 0) + totalRewards,
    });

    // -------------------------------
    // 2. CREDIT OLA BACK TO WALLET
    // -------------------------------
    const balance = balanceSnap.exists() ? balanceSnap.data().amount || 0 : 0;

    tx.set(
      balanceRef,
      {
        amount: balance + amount + totalRewards,
        updatedAt: now,
      },
      { merge: true }
    );

    // -------------------------------
    // 3. UPDATE GLOBAL POOL
    // -------------------------------
    const currentPool = globalSnap.exists()
      ? globalSnap.data().stakingPool || 0
      : 0;

    tx.set(
      globalRef,
      {
        stakingPool: Math.max(0, currentPool - amount),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return {
      withdrawn: amount,
      rewardsPaid: totalRewards,
      remainingStaked: newStaked,
    };
  });
}

// ===============================
// 💧 FAUCET (SOLO PARA DESARROLLO)
// ===============================
export async function mintDevTokens(userId: string, amount: number) {
  const balanceRef = doc(db, "wallets", userId, "balances", "OLA");
  
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(balanceRef);
    const current = snap.exists() ? snap.data().amount || 0 : 0;
    
    tx.set(balanceRef, {
      amount: current + amount,
      updatedAt: Date.now()
    }, { merge: true });
  });
}
