import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { simulateTransactions } from "./simulateTransactions";


export async function simulateTokenomics() {
  const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const TOTAL_SUPPLY = 10_000_000_000;
  const TREASURY_CORE = TOTAL_SUPPLY * 0.07;

  const minted = Math.floor(rand(50_000_000, 150_000_000));
  const activeUsers = Math.floor(rand(1000, 50000));
  const stakingLocked = Math.floor(rand(20_000_000, 80_000_000));

  const tokenPrice = rand(0.00008, 0.0004);
  const fdv = TOTAL_SUPPLY * tokenPrice;

  const variableTreasury = Math.floor(rand(1_000_000, 10_000_000));

  const distribution = {
    treasuryCore: TREASURY_CORE,
    treasuryLive: variableTreasury,
    minersRewards: minted,
    stakingPool: stakingLocked,
  };

  // CORRECCIÓN AQUÍ: Usamos 2 segmentos (Colección -> Documento)
  // Esto guardará la data en el documento con ID 'live' dentro de la colección 'tokenomics'
  const ref = doc(db, "tokenomics", "live");

  await setDoc(ref, {
    updatedAt: Date.now(),
    totalSupply: TOTAL_SUPPLY,
    activeUsers,
    minted,
    stakingLocked,
    fdv,
    tokenPrice,
    distribution,
  });

  console.log("✔ Tokenomics updated");

  await simulateTransactions();  

  return true;
}