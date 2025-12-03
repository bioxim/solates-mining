import { useState, useEffect } from "react";
import { Sun, Moon, ChevronDown, Crown, Newspaper, Users } from "lucide-react";
import logo from "../../assets/logo-tr.png";
import LoginButton from "./LoginButton";

export default function Navbar({ xp = 0 }) {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Inicializar tema
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[var(--card)] text-[var(--text)] shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* LOGO */}
        <a
          href="https://solates.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <img src={logo} alt="Solates logo" className="h-11 w-11" />
          <span className="text-2xl font-bold tracking-wide">
            Solates DEFI Platform
          </span>
        </a>

        {/* NAV LINKS */}
        <nav className="hidden sm:flex items-center gap-8 font-medium">

          {/* =============== CRYPTO HUB DROPDOWN =============== */}
          <div
            className="relative group h-full flex items-center"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`flex items-center gap-1 transition-colors ${
                dropdownOpen ? "text-[var(--primary)]" : "hover:text-[var(--primary)]"
              }`}
            >
              Crypto Hub
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* DROPDOWN */}
            <div
              className={`absolute top-full left-0 pt-4 w-60 transition-all duration-200 origin-top-left
                ${
                  dropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }
              `}
            >
              <div className="bg-[var(--card)] border border-[var(--border)]/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl p-2 flex flex-col gap-1">

                {/* HOME (nuevo ítem reemplazando Solates Platform) */}
                <a
                  href="https://solates.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 transition-colors"
                >
                  <span>Home</span>
                </a>

                {/* EXCLUSIVE ZONE (solo si XP >= 500) */}
                {xp >= 500 && (
                  <div className="mb-2 pb-2 border-b border-gray-700/30">
                    <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--primary)] font-bold opacity-80">
                      Exclusive
                    </div>

                    <a
                      href="https://solates-mining.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--primary)]/10 text-[var(--primary)] transition-colors group/item"
                    >
                      <Crown size={16} />
                      <span>Ola Hall</span>
                    </a>
                  </div>
                )}

                {/* CRYPTO NEWS - Soon */}
                <div className="relative group/disabled cursor-not-allowed opacity-60 hover:opacity-70 transition-opacity">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm pointer-events-none"
                  >
                    <Newspaper size={16} />
                    <span>Crypto News</span>
                  </a>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600/30">
                    Soon
                  </span>
                </div>

                {/* COMMUNITY - Soon */}
                <div className="relative group/disabled cursor-not-allowed opacity-60 hover:opacity-70 transition-opacity">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm pointer-events-none"
                  >
                    <Users size={16} />
                    <span>Community</span>
                  </a>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600/30">
                    Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* DERECHO: toggle + login */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <LoginButton />
        </div>
      </div>
    </header>
  );
}
