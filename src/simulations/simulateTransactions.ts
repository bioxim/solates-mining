// src/simulations/simulateTransactions.ts
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// Tipos disponibles
const TX_TYPES = ["stake", "unstake", "mine", "reward", "treasury", "system"];
const TOKENS = ["OLA", "USDC", "SOL"];

// Helpers
const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export async function simulateTransactions() {
  const txCount = Math.floor(rand(3, 8)); // entre 3 y 8 txs

  // Colección real usada en tu front
  const txRef = collection(db, "transactions", "live", "recent");

  for (let i = 0; i < txCount; i++) {

    // Siempre generamos un timestamp válido
    const ts = Date.now();
    const iso = new Date(ts).toISOString();

    await addDoc(txRef, {
      type: TX_TYPES[Math.floor(Math.random() * TX_TYPES.length)],
      token: TOKENS[Math.floor(Math.random() * TOKENS.length)],
      amount: Number(rand(10, 500).toFixed(2)),

      // 🔥 SIEMPRE válidos
      timestamp: ts,
      dateISO: iso,

      // Random wallets (fake)
      from: "wallet_" + Math.random().toString(36).slice(2, 10),
      to: "wallet_" + Math.random().toString(36).slice(2, 10),
    });
  }

  console.log(`✔ Simulated ${txCount} transactions`);
}
