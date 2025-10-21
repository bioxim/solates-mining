import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import logo from "../assets/logo-tr.png";
import LoginButton from "./LoginButton";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  // 🌓 Inicializar tema al montar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 🪄 Cambiar tema manualmente
  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[var(--card)] text-[var(--text-primary) shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo + nombre (enlazado al sitio principal) */}
        <a
          href="https://solates.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <img src={logo} alt="Solates logo" className="h-11 w-11" />
          <span className="text-2xl font-bold tracking-wide">Solates</span>
        </a>

        {/* Links de navegación */}
        <nav className="hidden sm:flex gap-8 font-medium">
          <a
            href="https://solates.vercel.app/airdrop"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80 transition"
          >
            Airdrop
          </a>
          <a
            href="https://solates.vercel.app/leaderboard"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80 transition"
          >
            Leaderboard
          </a>
        </nav>

        {/* Botones a la derecha */}
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
