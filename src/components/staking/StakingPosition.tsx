import { motion } from "framer-motion";

interface StakingPositionProps {
  userRank: string;
  userStaked: number;       // amount of OLA user is staking
  totalStaked: number;      // total OLA staked globally
  apy: number;              // APY based on tier
}

export default function StakingPosition({
  userRank,
  userStaked,
  totalStaked,
  apy,
}: StakingPositionProps) {
  const percent =
    totalStaked > 0 ? ((userStaked / totalStaked) * 100).toFixed(2) : "0.00";

  const dailyGain =
    userStaked > 0 ? ((userStaked * apy) / 100 / 365).toFixed(4) : "0.0000";

  const outperform =
    userStaked > 0
      ? Math.min(99, Math.floor((userStaked / (totalStaked / 2)) * 50))
      : 0;

  const hasStake = userStaked > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        mt-12 p-6 rounded-xl border border-white/10 bg-white/[0.06]
        backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,200,0.1)]
      "
    >
      <h2 className="text-2xl font-bold text-teal-300 mb-3">
        Your Staking Position
      </h2>

      {/* Estado vacío */}
      {!hasStake && (
        <div className="text-center text-white/70 py-6">
          <p className="text-lg">You haven’t staked any $OLA yet.</p>

          <p className="text-sm mt-1 text-white/50">
            Your Tier APY is <span className="text-teal-300 font-semibold">{apy}%</span>.
          </p>

          <button
            className="
              mt-6 px-6 py-2 rounded-lg font-semibold 
              bg-teal-400/20 text-teal-300 border border-teal-400 
              hover:bg-teal-400/30 transition
            "
          >
            Stake $OLA
          </button>
        </div>
      )}

      {/* Estado con stake */}
      {hasStake && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-black/20 border border-white/10">
              <p className="text-xs text-white/60">Your Rank</p>
              <p className="text-lg font-semibold text-white">{userRank}</p>
            </div>

            <div className="p-4 rounded-lg bg-black/20 border border-white/10">
              <p className="text-xs text-white/60">Staked OLA</p>
              <p className="text-lg font-semibold text-white">
                {userStaked.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/20 border border-white/10">
              <p className="text-xs text-white/60">% of Pool</p>
              <p className="text-lg font-semibold text-teal-300">{percent}%</p>
            </div>

            <div className="p-4 rounded-lg bg-black/20 border border-white/10">
              <p className="text-xs text-white/60">Daily Gain</p>
              <p className="text-lg font-semibold text-teal-300">{dailyGain} OLA</p>
            </div>

            <div className="p-4 rounded-lg bg-black/20 border border-white/10">
              <p className="text-xs text-white/60">APY</p>
              <p className="text-lg font-semibold text-teal-300">{apy}%</p>
            </div>
          </div>

          <p className="mt-6 text-center text-white/70">
            You are outperforming {outperform}% of all stakers.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              className="
                px-6 py-2 rounded-lg font-semibold 
                bg-teal-400/20 text-teal-300 border border-teal-400 
                hover:bg-teal-400/30 transition
              "
            >
              Stake more $OLA
            </button>

            <button
              className="
                px-6 py-2 rounded-lg font-semibold 
                bg-red-400/20 text-red-300 border border-red-400 
                hover:bg-red-400/30 transition
              "
            >
              Unstake
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
