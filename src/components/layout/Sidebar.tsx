import { Home, Cpu, Target, DollarSign, Trophy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "General", icon: <Home size={20} />, href: "/" },
    { name: "Mining Room", icon: <Cpu size={20} />, href: "/mining-room" },
    { name: "Quests", icon: <Target size={20} />, href: "/quests" },
    { name: "Staking", icon: <DollarSign size={20} />, href: "/staking" },
    { name: "Leaderboard", icon: <Trophy size={20} />, href: "/leaderboard" },
  ];

  return (
    // NOTE: top-16 = reservar 64px para el Navbar fijo. Ajusta si tu navbar es otra altura.
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-60 bg-[#1f1f2e] shadow-lg text-white flex flex-col">
      <div className="px-6 py-6 text-2xl font-bold border-b border-[#2a2a3a]">
        Solates Menu
      </div>
      <nav className="flex flex-col mt-4 gap-2 px-2">
        {links.map((link) => {
          const active = location.pathname === link.href;
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.href)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition 
                ${active ? "bg-[#3b3b5a]" : "hover:bg-[#2a2a3a]"}
              `}
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
