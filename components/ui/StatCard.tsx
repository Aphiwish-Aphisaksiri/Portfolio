import { StatCardData } from "@/lib/constants";

interface StatCardProps {
  data: StatCardData;
}

export default function StatCard({ data }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:border-accent transition-all duration-200 flex flex-col items-center text-center gap-1.5">
      <span className="text-2xl">{data.icon}</span>
      <span className="text-text-muted text-xs uppercase tracking-wider">
        {data.label}
      </span>
      <span className="text-text-primary font-bold text-sm font-[family-name:var(--font-geist-mono)]">
        {data.value}
      </span>
    </div>
  );
}
