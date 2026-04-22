import { profile } from "../data/siteData";
import Terminal from "./Terminal";
import AccentText from "./AccentText";

export default function Hero() {
  const lines = profile.tagline.split("\n");

  return (
    <header className="hero-grid">
      <div>
        <div className="kicker">
          <span className="dot" />
          {profile.location}
        </div>

        <h1 className="font-sans font-normal text-[clamp(2.4rem,7vw,6.2rem)] leading-[0.96] tracking-[-0.045em] max-w-[14ch] text-balance m-0">
          {lines.map((line, i) => (
            <span key={i}>
              <AccentText text={line} />
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p className="text-[1.05rem] text-[var(--ink-2)] max-w-[48ch] leading-[1.65] my-[clamp(22px,3vw,32px)]">
          {profile.lede}
        </p>

        <div className="cta-row">
          <a href="#work" className="primary">
            See my work <span className="arr">→</span>
          </a>
          <a href={profile.resumeUrl} target="_blank" className="ghost">
            Resume.pdf ↓
          </a>
        </div>
      </div>

      <Terminal />
    </header>
  );
}
