import StakeSummary from "../components/liquid/StakeSummary";
import StakeChart from "../components/liquid/StakeChart";
import StakeCard from "../components/liquid/StakeCard";

export default function Liquid() {
  return (
    <div className="min-h-screen p-8 bg-[var(--bg)] text-[var(--text)] mb-12">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-6 text-center">Stake $OLA</h1>

      <div className="max-w-6xl mx-auto grid gap-6">
        <StakeSummary />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StakeChart />
          </div>
          <div>
            <StakeCard />
          </div>
        </div>
      </div>
    </div>
  );
}
