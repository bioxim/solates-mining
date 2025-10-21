import { useState, useEffect } from "react";

export default function LoginButton() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    // 🔹 Cargar estado inicial
    const savedUser = localStorage.getItem("solates_user_name");
    setLogged(!!savedUser);

    // 🔹 Escuchar cambios de login entre pestañas o componentes
    const handleStorageChange = () => {
      setLogged(!!localStorage.getItem("solates_user_name"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleLogin = () => {
    if (logged) {
      localStorage.removeItem("solates_user_name");
      setLogged(false);
    } else {
      localStorage.setItem("solates_user_name", "DemoUser");
      setLogged(true);
    }
  };

  return (
    <button
      onClick={toggleLogin}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
        logged
          ? "bg-white/20 text-white hover:bg-white/30"
          : "bg-[var(--primary-dark)] text-white hover:bg-[var(--primary)]"
      }`}
    >
      {logged ? "Logout" : "Login"}
    </button>
  );
}
