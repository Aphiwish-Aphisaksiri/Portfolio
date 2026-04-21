import Image from "next/image";
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

      {/* Icon grid — flexbox for centering trailing items, max 4 per row */}
      <div className="flex flex-wrap justify-center gap-4 max-w-[304px] mx-auto">
        {category.skills.map((skill) => (
          <div
            key={skill.name}
            className="flex flex-col items-center gap-1.5 group w-16"
          >
            {skill.customIcon ? (
              <span className="inline-flex items-center justify-center w-[24px] h-[24px]">
                <Image
                  src={skill.customIcon}
                  alt={skill.name}
                  width={24}
                  height={24}
                  className={`w-auto h-auto max-w-full max-h-full group-hover:scale-110 transition-transform duration-200 ${skill.darkIcon ? "invert" : ""}`}
                />
              </span>
            ) : (
              <i
                className={`${skill.icon} ${skill.darkIcon ? "text-text-primary" : "colored"} text-2xl group-hover:scale-110 transition-transform duration-200`}
              />
            )}
            <span className="text-text-muted text-[10px] text-center leading-tight h-[2.5em] flex items-center justify-center">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
