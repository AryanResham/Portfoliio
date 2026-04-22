import { experiences } from "../data/siteData";
import SectionHead from "./SectionHead";

export default function Experience() {
  return (
    <section id="experience">
      <SectionHead
        num="03 / Experience"
        title="Two internships. "
        accent="Both taught me more than I expected."
        aside="One in design-to-code. One in enterprise automation. Both made me a better engineer."
      />

      <div className="exp">
        {experiences.map((exp) => (
          <div key={exp.company} className="exp-item">
            <div className="exp-when">{exp.period}</div>
            <div className="exp-body">
              <div className="role">{exp.role}</div>
              <div className="company">{exp.company}</div>
              <ul className="pts">
                {exp.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
            <div className="exp-tag">{exp.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
