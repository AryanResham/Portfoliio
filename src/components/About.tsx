import { aboutParagraphs, aboutCards } from "../data/siteData";
import AccentText from "./AccentText";
import SectionHead from "./SectionHead";

export default function About() {
  return (
    <section id="about">
      <SectionHead
        num="02 / About"
        title="The short version, "
        accent="honest."
        aside="A few paragraphs in place of a bio-blurb. Feels more true."
      />

      <div className="about">
        <div>
          {aboutParagraphs.map((text, i) => (
            <p key={i}>
              <AccentText text={text} />
            </p>
          ))}
        </div>

        <div className="about-side">
          {aboutCards.map((card) => (
            <div
              key={card.label}
              className={`about-card ${card.big ? "big" : ""}`}
            >
              <span className="lbl">{card.label}</span>
              <span className="val">{card.value}</span>
              {card.extra && (
                <span className="text-[var(--ink-dim)] text-[0.85rem]">
                  {card.extra}
                </span>
              )}
              {card.sub && <small>{card.sub}</small>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
