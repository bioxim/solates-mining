import { motion } from "framer-motion";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import TokenStats from "../components/dashboard/TokenStats";
import CountdownTGE from "../components/dashboard/CountdownTGE";
import TransactionHistory from "../components/dashboard/TransactionHistory";
import TopStatsBar from "../components/dashboard/TopStatsBar";
import TreasuryChart from "../components/dashboard/TreasuryChart";

export default function General() {
  return (
    <div className="min-h-screen w-full p-8 text-[var(--text)] bg-[var(--bg)] overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-[var(--primary)] mb-8"
      >

        {/* FDV and $OLA Mined */}
        <TopStatsBar />

        Dashboard Overview
      </motion.h1>

      {/* WelcomeCard full width */}
      <div className="mb-8 mt-4">
        <WelcomeCard />
      </div>

      <div className="mb-8">
        <TokenStats />
      </div>

      <div className="mb-8">
        <TransactionHistory />
      </div>

      <div className="mb-8">
        <CountdownTGE />
      </div>

      <div className="mb-12">
        <TreasuryChart />
      </div>

    </div>
  );
}
