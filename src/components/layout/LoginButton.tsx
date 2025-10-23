import { useState, useEffect } from "react";
import { loginWithGoogle, logout, db, getUserAfterRedirect } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState<number | null>(null);

  // ✅ Recupera usuario tras login con redirect o localStorage
  useEffect(() => {
    const initUser = async () => {
      try {
        // 🔹 Si viene de redirect (Vercel)
        const redirectUser = await getUserAfterRedirect();
        if (redirectUser) {
          const userData = {
            name: redirectUser.displayName,
            email: redirectUser.email,
            uid: redirectUser.uid,
          };
          setUser(userData);
          localStorage.setItem("solates_user", JSON.stringify(userData));
          await fetchXp(userData.uid);
          toast.success(`Welcome ${redirectUser.displayName}`);
          return;
        }

        // 🔹 Si ya estaba logueado localmente
        const saved = localStorage.getItem("solates_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          await fetchXp(parsed.uid);
        }
      } catch (err) {
        console.error("Login redirect recovery failed:", err);
      }
    };
    initUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Fetch XP y redirige si ya puede entrar
  async function fetchXp(uid: string) {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const currentXp = data.xp ?? 0;
        setXp(currentXp);

        if (currentXp >= 500) {
          navigate("/dashboard");
        }
      } else {
        setXp(0);
      }
    } catch (err) {
      console.error("Error fetching XP:", err);
      setXp(0);
    }
  }

  // ✅ Login (usa redirect, funciona en Vercel)
  async function handleLogin() {
    try {
      await loginWithGoogle();
      toast("Redirecting to Google Login...");
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  }

  // 🔹 Logout
  async function handleLogout() {
    await logout();
    setUser(null);
    setXp(null);
    localStorage.removeItem("solates_user");
    toast("Session closed");
    navigate("/");
  }

  const canAccessMining = xp !== null && xp >= 500;

  return (
    <>
      <Toaster position="top-center" />
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{user.name}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm transition"
          >
            Logout
          </button>

          {!canAccessMining && (
            <button
              onClick={() =>
                toast("You need at least 500 XP to access the Mining Room 💎")
              }
              className="px-3 py-1 rounded-lg bg-[var(--primary-dark)] hover:bg-[var(--primary)] text-white text-sm transition"
            >
              Mining Locked
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 rounded-lg bg-[var(--primary-dark)] hover:bg-[var(--primary)] text-white font-semibold text-sm transition"
        >
          Login with Google
        </button>
      )}
    </>
  );
}
