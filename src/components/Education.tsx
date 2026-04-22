import { education } from "../data/siteData";
import SectionHead from "./SectionHead";

export default function Education() {
  return (
    <section id="education">
      <SectionHead
        num="05 / Education"
        title="School, but "
        accent="the short version."
      />

      <div className="edu">
        <div>
          <h3>{education.school}</h3>
          <div className="deg">{education.degree}</div>
          <div className="when">{education.period}</div>
          <div className="courses">
            {education.courses.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
        <div className="edu-cgpa">
          <div className="big">{education.cgpa}</div>
          <div className="lbl">CGPA · out of 10</div>
        </div>
      </div>
    </section>
  );
}
