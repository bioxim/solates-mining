/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Home,
  Cpu,
  Target,
  DollarSign,
  Trophy,
  Wallet,
  ChevronDown,
  ChevronRight,
  BarChart2,
  Flame,
  Calculator,
  Layers,
  Lock,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useWallet } from "../../wallet/useWallet"; // <-- IMPORTANTE

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { connected, address, connect, disconnect, error } = useWallet(); // <-- ESTADO REAL

  const [showUtilities, setShowUtilities] = useState(true);

  const mainLinks = [
    { name: "General", href: "/dashboard", icon: <Home size={18} />, soon: false },
  ];

  const utilitiesLinks = [
    { name: "Staking", href: "/staking", icon: <DollarSign size={18} />, soon: false },
    { name: "Liquid Staking", href: "/liquid-staking", icon: <Cpu size={18} />, soon: false },
    { name: "Solnake", href: "", icon: <Flame size={18} />, soon: true },
    { name: "Lending", href: "", icon: <Lock size={18} />, soon: true },
    { name: "Liquidity Pools", href: "", icon: <Layers size={18} />, soon: true },
    { name: "Calculator", href: "", icon: <Calculator size={18} />, soon: true },
  ];

  const extraLinks = [
    { name: "Market", href: "", icon: <BarChart2 size={18} />, soon: true },
    { name: "Quests", href: "/quests", icon: <Target size={18} />, soon: false },
    { name: "Leaderboard", href: "/leaderboard", icon: <Trophy size={18} />, soon: false },
  ];

  const linkBaseStyle =
    "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition";

  const renderLink = (link: any) => {
    const active = location.pathname === link.href;

    if (link.soon) {
      return (
        <div
          key={link.name}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm rounded-lg bg-[#1f1f2e]
                     text-gray-600 opacity-60 cursor-not-allowed border border-[#2a2a3a]"
        >
          {link.icon}
          <span>{link.name}</span>
          <span className="ml-auto text-[10px] px-2 py-0.5 bg-[#2a2a3a] rounded-full uppercase">
            soon
          </span>
        </div>
      );
    }

    return (
      <button
        key={link.name}
        onClick={() => navigate(link.href)}
        className={`${linkBaseStyle} ${active ? "bg-[#3b3b5a]" : "hover:bg-[#2a2a3a]"}`}
      >
        {link.icon}
        <span>{link.name}</span>
      </button>
    );
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#1f1f2e] shadow-lg text-white flex flex-col">
      <div className="px-6 py-6 text-2xl font-bold border-b border-[#2a2a3a]">
        Solates Menu
      </div>

      <nav className="flex flex-col mt-4 gap-4 px-2 overflow-y-auto">

        {/* GENERAL */}
        <div>
          <p className="px-4 text-xs text-gray-400 uppercase tracking-wider mb-2">General</p>
          {mainLinks.map(renderLink)}
        </div>

        {/* UTILITIES */}
        <div className="mt-2">
          <div
            className="flex items-center justify-between px-4 cursor-pointer text-xs text-gray-400 uppercase tracking-wider"
            onClick={() => setShowUtilities(!showUtilities)}
          >
            <span>OLA Utilities</span>
            {showUtilities ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showUtilities ? "max-h-[400px] opacity-100" : "max-h-0 opacity-20"
            }`}
          >
            <div className="mt-2 flex flex-col gap-2">
              {utilitiesLinks.map(renderLink)}
            </div>
          </div>
        </div>

        {/* MARKET + QUESTS + LEADERBOARD */}
        <div className="mt-2">
          {extraLinks.map(renderLink)}
        </div>
      </nav>

      {/* WALLET BUTTON */}
      <div className="mt-auto p-4 border-t border-[#2a2a3a]">
        <button
          onClick={connected ? disconnect : connect}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold 
                     ${connected ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          <Wallet size={18} />
          {connected ? "Disconnect Wallet" : "Connect Wallet"}
        </button>

        {/* Mostrar la wallet conectada */}
        {connected && (
          <p className="text-gray-400 text-xs mt-2 break-all text-center">
            {address}
          </p>
        )}

        {/* Mostrar mensaje de error */}
        {error && (
          <div className="relative flex justify-center mt-2 group">
            <span className="text-red-500 text-xs cursor-pointer">⚠ Wallet Mismatch Error</span>

            <div
              className="absolute bottom-6 bg-[#2a2a3a] text-gray-200 text-xs p-2 rounded-lg shadow-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none 
                        whitespace-normal break-all max-w-[200px]"
            >
              {error}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
