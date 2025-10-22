import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, type User } from "firebase/auth";
import QuestList from "../components/quests/QuestList";

export default function Quests() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--text)]">
        Loading quests...
      </div>
    );

  return (
    <div className="p-8 text-[var(--text)] bg-[var(--bg)] min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-[var(--primary)] mb-6"
      >
        Bonus Quests
      </motion.h1>

      <p className="mb-6 opacity-80 max-w-2xl">
        Complete these bonus quests to earn <strong>extra XP</strong> and unlock new features.
      </p>

      {user ? (
        <QuestList userId={user.uid} />
      ) : (
        <p className="opacity-70 text-sm">
          Please log in to view your quests.
        </p>
      )}
    </div>
  );
}
