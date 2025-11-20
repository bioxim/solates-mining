import { useWalletContext } from "./WalletProvider";

export function useWallet() {
  const { address, connected, connect, disconnect, error } = useWalletContext();

  return {
    address,
    connected,
    connect,
    disconnect,
    error,
  };
}
