import { projects } from "../data/siteData";
import SectionHead, { ProjectViz } from "./SectionHead";

export default function Projects() {
  return (
    <section id="work">
      <SectionHead
        num="01 / Selected work"
        title="Three things I've built that I'm still proud of."
        accent="And more on GitHub."
        aside='Small projects, honest descriptions. No "revolutionary" anything. Just things that work.'
      />

      <div className="projects">
        {projects.map((p) => (
          <article
            key={p.slug}
            className="proj"
            data-size={p.size ?? ""}
          >
            {p.size === "lg" && p.viz && (
              <div className="p-viz">
                <ProjectViz viz={p.viz} />
              </div>
            )}

            <div className={p.size === "lg" ? "p-body" : ""}>
              <div className="p-head">
                <span className="p-num">
                  {p.num} → {p.slug}
                </span>
                <span className="p-status">{p.status}</span>
              </div>

              <h3 className="p-title">
                {p.title}
                <span className="accent">{p.titleAccent}</span>
              </h3>
              <div className="p-sub">{p.subtitle}</div>

              {p.size !== "lg" && p.viz && (
                <div className="p-viz">
                  <ProjectViz viz={p.viz} />
                </div>
              )}

              <p className="p-desc">{p.description}</p>

              <div className="p-stack">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
