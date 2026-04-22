import { LuArrowUpRight } from "react-icons/lu";
import { StatCardData } from "@/lib/constants";

interface StatCardProps {
  data: StatCardData;
}

const cardBase =
  "relative bg-surface border border-border rounded-xl p-4 hover:border-accent transition-all duration-200 flex flex-col items-center text-center gap-1.5";

export default function StatCard({ data }: StatCardProps) {
  const content = (
    <>
      {data.isExternal && (
        <LuArrowUpRight
          className="absolute top-2 right-2 text-text-muted group-hover:text-accent transition-colors duration-200"
          size={14}
        />
      )}
      <span className="text-2xl">{data.icon}</span>
      <span className="text-text-muted text-xs uppercase tracking-wider">
        {data.label}
      </span>
      <span className="text-text-primary font-bold text-sm font-[family-name:var(--font-geist-mono)]">
        {data.value}
      </span>
    </>
  );

  if (data.href) {
    return (
      <a
        href={data.href}
        target={data.isExternal ? "_blank" : undefined}
        rel={data.isExternal ? "noopener noreferrer" : undefined}
        className={`${cardBase} group cursor-pointer hover:scale-[1.02]`}
      >
        {content}
      </a>
    );
  }

  return <div className={cardBase}>{content}</div>;
}
