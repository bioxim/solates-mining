import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { motion } from "framer-motion";
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
      {quests.map((quest) => (
        <div
          key={quest.id}
          onClick={() => setSelectedQuest(quest)}
          className="cursor-pointer p-4 bg-[var(--card)]/40 border border-[var(--primary)]/30 rounded-xl hover:bg-[var(--card)]/70 transition"
        >
          <h3 className="text-lg font-semibold text-[var(--primary)] mb-1">
            {quest.title}
          </h3>
          <p className="text-sm opacity-80 mb-2">{quest.description}</p>
          <span className="text-xs opacity-70">
            Reward: {quest.reward} XP
          </span>
        </div>
      ))}

      {quests.length === 0 && (
        <p className="col-span-full text-center opacity-60">No bonus quests found.</p>
      )}
    </motion.div>
  );
}
