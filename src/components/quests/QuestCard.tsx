import { useState } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { ArrowLeft } from "lucide-react";

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  contentUrl?: string;
  reward: number;
  completed: boolean;
  userId: string;
  onBack: () => void;
}

export default function QuestCard({
  id,
  title,
  description,
  contentUrl,
  reward,
  completed,
  userId,
  onBack,
}: QuestCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (isCompleted) return;
    setLoading(true);
    try {
      // 🔹 Actualiza XP del usuario
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { xp: increment(reward) });

      // 🔹 Marca la quest como completada por este usuario
      const questRef = doc(db, "quests", id);
      await updateDoc(questRef, { completedBy: arrayUnion(userId) });

      setIsCompleted(true);
    } catch (err) {
      console.error("Error completing quest:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6 rounded-2xl bg-[var(--card)]/50 border border-[var(--primary)] shadow-lg text-[var(--text)]"
    >
      <button
        onClick={onBack}
        className="flex items-center text-sm mb-4 text-[var(--primary)] hover:opacity-80"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Quests
      </button>

      <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">{title}</h2>
      <p className="opacity-80 mb-4">{description}</p>

      {contentUrl && (
        <div className="mb-4 aspect-video rounded-xl overflow-hidden shadow-md">
          <iframe
            src={contentUrl.replace("watch?v=", "embed/")}
            title={title}
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}

      {/* Quiz placeholder */}
      <div className="mb-6 p-4 rounded-lg bg-black/20 border border-white/10 text-sm opacity-80">
        <p>Quiz section coming soon 🧠</p>
      </div>

      <button
        disabled={isCompleted || loading}
        onClick={handleComplete}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          isCompleted
            ? "bg-green-600 cursor-default"
            : "bg-[var(--primary)] hover:opacity-90"
        } text-white`}
      >
        {isCompleted ? "Completed ✅" : loading ? "Processing..." : `Complete (+${reward} XP)`}
      </button>
    </motion.div>
  );
}
