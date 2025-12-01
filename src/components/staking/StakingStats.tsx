type StakingStatsProps = {
  totalStakers: number;
  totalStaked: number;
  averageAPY: number;
  userRank: string;
  rankMultiplier: number;
};

export default function StakingStats({
  totalStakers,
  totalStaked,
  averageAPY,
  userRank,
  rankMultiplier,
}: StakingStatsProps) {
  return (
    <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Stakers */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col">
          <span className="text-sm text-white/60">Total Stakers</span>
          <span className="text-2xl font-semibold text-white mt-1">
            {totalStakers}
          </span>
        </div>

        {/* Total OLA Staked */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col">
          <span className="text-sm text-white/60">Total OLA Staked</span>
          <span className="text-2xl font-semibold text-white mt-1">
            {totalStaked.toLocaleString()} OLA
          </span>
        </div>

        {/* Average APY */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col">
          <span className="text-sm text-white/60">Average APY</span>
          <span className="text-2xl font-semibold text-green-300 mt-1">
            {averageAPY}%
          </span>
        </div>

        {/* User Rank */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col">
          <span className="text-sm text-white/60">Your Rank</span>
          <span className="text-xl font-semibold text-white mt-1">
            {userRank}
          </span>
          <span className="text-sm text-cyan-300 mt-1">
            Multiplier: x{rankMultiplier}
          </span>
        </div>

      </div>
    </div>
  );
}
