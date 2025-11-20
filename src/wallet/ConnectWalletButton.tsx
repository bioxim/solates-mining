import { useWallet } from "./useWallet";
import { Wallet } from "lucide-react";

export default function ConnectWalletButton() {
  const { connected, connect, disconnect, error } = useWallet();

  return (
    <div className="px-4 mb-6 mt-auto flex flex-col gap-2">
      <button
        onClick={connected ? disconnect : connect}
        className="flex items-center justify-center gap-2 px-4 py-3 
                   bg-[#3b3b5a] hover:bg-[#2a2a3a] transition rounded-lg text-sm"
      >
        <Wallet size={18} />
        {connected ? "Disconnect" : "Connect Wallet"}
      </button>

      {error && (
        <p className="text-red-400 text-xs text-center mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
