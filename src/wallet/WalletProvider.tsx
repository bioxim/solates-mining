/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, type ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

type WalletContextType = {
  address: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    try {
      setError(null);

      const provider = (window as any).solana;
      if (!provider) {
        setError("Phantom wallet not found. Please install it.");
        return;
      }

      // 1) Conectar Phantom
      const resp = await provider.connect();
      const phantomAddress = resp.publicKey.toString();

      // 2) Verificar usuario logueado
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to link a wallet.");
        provider.disconnect();
        return;
      }

      // 3) Buscar en Firestore la wallet REAL
      const walletRef = doc(db, "wallets", phantomAddress);
      const walletSnap = await getDoc(walletRef);

      if (!walletSnap.exists()) {
        setError("This wallet is not linked to any account.");
        provider.disconnect();
        return;
      }

      const walletData = walletSnap.data();

      // 4) Validar propietario
      if (walletData.userId !== user.uid) {
        setError("This wallet belongs to a different user.");
        provider.disconnect();
        return;
      }

      // 5) Todo OK → conectar la wallet
      setAddress(phantomAddress);

    } catch (err) {
      console.error("Wallet connection error:", err);
      setError("Failed to connect wallet.");
    }
  }

  function disconnect() {
    const provider = (window as any).solana;
    provider?.disconnect?.();
    setAddress(null);
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        connected: !!address,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used inside WalletProvider");
  return ctx;
}
