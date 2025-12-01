interface StakingTierCardProps {
  rank: string;
  multiplier: number;
  apy: number;
  stakerCount: number;
  totalStaked: number;
  isUserRank: boolean;
  onStake: () => void;
}

export default function StakingTierCard({
  rank,
  multiplier,
  apy,
  stakerCount,
  totalStaked,
  isUserRank,
  onStake,
}: StakingTierCardProps) {
  return (
    <div
      className={`relative p-6 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
        isUserRank
          ? "bg-white/10 border-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-[1.02]"
          : "bg-white/5 border-white/10 opacity-80 hover:opacity-100"
      }`}
    >
      {/* Contenido Superior */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-xl font-bold ${isUserRank ? "text-white" : "text-gray-300"}`}>
              {rank}
            </h3>
            <p className="text-sm text-gray-500">Multiplier: x{multiplier}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${isUserRank ? "text-[var(--primary)]" : "text-gray-400"}`}>
              {apy}%
            </p>
            <p className="text-xs text-gray-500">APY</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Staked:</span>
            <span className="text-gray-300">${totalStaked.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Stakers:</span>
            <span className="text-gray-300">{stakerCount}</span>
          </div>
        </div>
      </div>

      {/* Acción o Leyenda */}
      <div className="mt-auto">
        {isUserRank ? (
          <button
            onClick={onStake}
            className="w-full py-2 rounded-lg font-bold transition-all bg-[var(--primary)] text-black hover:opacity-90 hover:shadow-[0_0_10px_rgba(var(--primary),0.4)]"
          >
            Stake Now
          </button>
        ) : (
          <div className="w-full py-2 text-center border border-dashed border-white/10 rounded-lg bg-black/20">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              You need more points to rank up
            </p>
          </div>
        )}
      </div>
    </div>
  );
}