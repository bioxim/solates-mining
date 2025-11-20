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

      // 1) Conectar phantom
      const resp = await provider.connect();
      const phantomAddress = resp.publicKey.toString();

      // 2) Verificar usuario logueado
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to link a wallet.");
        provider.disconnect();
        return;
      }

      // 3) Buscar en Firestore el usuario y su wallet guardada
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("User not found in database.");
        provider.disconnect();
        return;
      }

      const savedWallet = snap.get("wallet");

      // 4) Validar si coincide
      if (savedWallet && savedWallet !== phantomAddress) {
        setError(
          `Invalid wallet. Expected ${savedWallet}, but detected ${phantomAddress}.`
        );
        provider.disconnect();
        return;
      }

      // 5) Todo OK → conectar
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
