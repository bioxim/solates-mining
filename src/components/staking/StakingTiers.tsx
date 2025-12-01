import StakingTierCard from "./StakingTierCard";

const TIERS = [
  { rank: "Explorer", multiplier: 1.0, apy: 2.0 },
  { rank: "Trader", multiplier: 1.1, apy: 2.2 },
  { rank: "DeFi Learner", multiplier: 1.25, apy: 2.5 },
  { rank: "Innovator", multiplier: 1.5, apy: 3.0 },
  { rank: "Diamond Pioneer 💎", multiplier: 2.0, apy: 4.0 },
];

interface StakingTiersProps {
  userRank: string;
  onStake: () => void;
}

export default function StakingTiers({ userRank, onStake }: StakingTiersProps) {
  // Mock data (Simulando datos de Firebase)
  const mockStakerCounts = [120, 90, 65, 40, 12];
  const mockStakedTotals = [15000, 22000, 28000, 32000, 55000];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {TIERS.map((tier, i) => (
        <StakingTierCard
          key={tier.rank}
          rank={tier.rank}
          multiplier={tier.multiplier}
          apy={tier.apy}
          stakerCount={mockStakerCounts[i]}
          totalStaked={mockStakedTotals[i]}
          isUserRank={tier.rank === userRank}
          onStake={onStake}
        />
      ))}
    </div>
  );
}