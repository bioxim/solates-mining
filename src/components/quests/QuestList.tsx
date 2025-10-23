import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import QuestCard from "./QuestCard";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  stage: string;
  contentUrl?: string;
  completedBy?: string[];
}

interface QuestListProps {
  userId: string;
}

export default function QuestList({ userId }: QuestListProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  useEffect(() => {
    const fetchQuests = async () => {
      const q = query(collection(db, "quests"), where("stage", "==", "bonus"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Quest));
      setQuests(data);
    };
    fetchQuests();
  }, []);

  if (selectedQuest) {
    return (
      <QuestCard
        {...selectedQuest}
        completed={selectedQuest.completedBy?.includes(userId) ?? false}
        userId={userId}
        onBack={() => setSelectedQuest(null)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {quests.map((quest) => {
        const isCompleted = quest.completedBy?.includes(userId);
        return (
          <motion.div
            key={quest.id}
            onClick={() => setSelectedQuest(quest)}
            whileHover={{ scale: isCompleted ? 1 : 1.03 }}
            className={`relative cursor-pointer p-4 rounded-xl border transition duration-200 backdrop-blur-sm ${
              isCompleted
                ? "border-green-500/60 bg-green-500/10 text-green-200"
                : "border-[var(--primary)]/30 bg-[var(--card)]/40 hover:bg-[var(--card)]/70"
            }`}
          >
            {isCompleted && (
              <div className="absolute top-3 right-3 text-green-400 animate-pulse">
                <CheckCircle size={22} />
              </div>
            )}
            <h3
              className={`text-lg font-semibold mb-1 ${
                isCompleted ? "text-green-300" : "text-[var(--primary)]"
              }`}
            >
              {quest.title}
            </h3>
            <p
              className={`text-sm mb-2 ${
                isCompleted ? "opacity-60" : "opacity-80"
              }`}
            >
              {quest.description}
            </p>
            <span
              className={`text-xs ${
                isCompleted ? "opacity-60" : "opacity-70"
              }`}
            >
              Reward: {quest.reward} XP
            </span>
          </motion.div>
        );
      })}

      {quests.length === 0 && (
        <p className="col-span-full text-center opacity-60">
          No bonus quests found.
        </p>
      )}
    </motion.div>
  );
}
