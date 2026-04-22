import { skillGroups } from "../data/siteData";
import SectionHead from "./SectionHead";

export default function Stack() {
  return (
    <section id="stack">
      <SectionHead
        num="04 / Stack"
        title="What I actually "
        accent="reach for."
        aside="Not an exhaustive list — just the tools I'm shipping with this year."
      />

      <div className="skills">
        {skillGroups.map((group) => (
          <div key={group.category} className="skill-grp">
            <h4>{group.category}</h4>
            <div className="tags">
              {group.skills.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
