export function getRankInfo(xp: number) {
  if (xp >= 2000)
    return { rank: "Diamond Pioneer 💎", multiplier: 2.0, apy: 4.0 };

  if (xp >= 1500)
    return { rank: "Innovator", multiplier: 1.5, apy: 3.0 };

  if (xp >= 1000)
    return { rank: "DeFi Learner", multiplier: 1.25, apy: 2.5 };

  if (xp >= 500)
    return { rank: "Trader", multiplier: 1.1, apy: 2.2 };

  return { rank: "Explorer", multiplier: 1.0, apy: 2.0 };
}
