import { useState, useEffect } from "react";
import { loginWithGoogle, logout, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState<number | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("solates_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      fetchXp(parsed.uid);
    }
  }, []);

  async function fetchXp(uid: string) {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setXp(data.xp ?? 0);

        // 🔹 Redirect if user already has enough XP
        if (data.xp >= 500) {
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

  async function handleLogin() {
    try {
      const u = await loginWithGoogle();
      const userData = {
        name: u.displayName,
        email: u.email,
        uid: u.uid,
      };
      setUser(userData);
      localStorage.setItem("solates_user", JSON.stringify(userData));

      // Obtener XP directamente desde Firestore
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      let userXp = 0;
      if (snap.exists()) {
        userXp = snap.data().xp ?? 0;
      }
      setXp(userXp);

      toast.success(`Welcome ${u.displayName}`);

      // 🔹 Redirigir si tiene suficiente XP
      if (userXp >= 500) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  }


  async function handleLogout() {
    await logout();
    setUser(null);
    setXp(null);
    localStorage.removeItem("solates_user");
    toast("Session closed");
    navigate("/"); // redirect to Home
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
              onClick={() => toast("You need at least 500 XP to access the Mining Room 💎")}
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
