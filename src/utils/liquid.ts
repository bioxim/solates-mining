// src/utils/liquid.ts
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const ECON_REF = doc(db, "economy", "liquidStake");

// ==========================================
// Helpers
// ==========================================
async function readBalance(address: string, token: string) {
  const ref = doc(db, "wallets", address, "balances", token);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { amount: 0, ref };

  const data = snap.data();
  return { amount: data.amount ?? 0, ref };
}

// ==========================================
// LIQUID STAKE  (burn OLA → mint stOLA)
// ==========================================
export async function liquidStake(address: string, amount: number) {
  if (!address) throw new Error("Missing wallet address");
  if (amount <= 0) throw new Error("Invalid amount");

  // Read OLA balance
  const { amount: olaBal, ref: olaRef } = await readBalance(address, "OLA");
  if (olaBal < amount) throw new Error("Not enough OLA");

  // Read stOLA balance
  const { amount: stBal, ref: stRef } = await readBalance(address, "stOLA");

  // Read economy share price
  const econSnap = await getDoc(ECON_REF);
  const { sharePrice = 1, tvl = 0 } = econSnap.exists() ? econSnap.data() : {};

  const mintedStOLA = amount / sharePrice;

  // Burn OLA
  await setDoc(olaRef, { amount: olaBal - amount }, { merge: true });

  // Mint stOLA
  await setDoc(
    stRef,
    { amount: stBal + mintedStOLA },
    { merge: true }
  );

  // Update TVL
  await updateDoc(ECON_REF, { tvl: increment(amount) });

  return {
    stakedOLA: amount,
    mintedStOLA,
    newSharePrice: sharePrice,
    newTVL: tvl + amount,
  };
}

// ==========================================
// UNSTAKE → redeem stOLA → return OLA
// ==========================================
export async function liquidUnstake(address: string, amountSt: number) {
  if (!address) throw new Error("Missing wallet address");
  if (amountSt <= 0) throw new Error("Invalid amount");

  // Read balances
  const { amount: stBal, ref: stRef } = await readBalance(address, "stOLA");
  if (stBal < amountSt) throw new Error("Not enough stOLA");

  const { amount: olaBal, ref: olaRef } = await readBalance(address, "OLA");

  // Economy
  const econSnap = await getDoc(ECON_REF);
  const { sharePrice = 1, tvl = 0 } = econSnap.exists() ? econSnap.data() : {};

  const returnedOLA = amountSt * sharePrice;

  // Burn stOLA
  await setDoc(
    stRef,
    { amount: stBal - amountSt },
    { merge: true }
  );

  // Mint OLA
  await setDoc(
    olaRef,
    { amount: olaBal + returnedOLA },
    { merge: true }
  );

  // Reduce TVL
  await updateDoc(ECON_REF, { tvl: increment(-returnedOLA) });

  return {
    burnedStOLA: amountSt,
    returnedOLA,
    newSharePrice: sharePrice,
    newTVL: tvl - returnedOLA,
  };
}
