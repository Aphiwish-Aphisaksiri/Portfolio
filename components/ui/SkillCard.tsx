import { SkillCategory } from "@/lib/constants";

interface SkillCardProps {
  category: SkillCategory;
}

export default function SkillCard({ category }: SkillCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent transition-all duration-200">
      {/* Category title */}
      <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
        <span className="text-xl">{category.emoji}</span>
        {category.title}
      </h3>

      {/* Icon grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {category.skills.map((skill) => (
          <div
            key={skill.name}
            className="flex flex-col items-center gap-1.5 group"
          >
            <i
              className={`${skill.icon} colored text-2xl group-hover:scale-110 transition-transform duration-200`}
            />
            <span className="text-text-muted text-[10px] text-center leading-tight">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
