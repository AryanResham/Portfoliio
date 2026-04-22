import { contactLinks } from "../data/siteData";

export default function Contact() {
  return (
    <section id="contact">
      <div className="contact">
        <div className="no font-mono text-[0.74rem] text-[var(--accent)] tracking-[0.12em] uppercase mb-2.5">
          06 / Let's talk
        </div>
        <h2>
          Got a thing that needs <span className="accent">building?</span>
          <br />
          I'm listening.
        </h2>
        <p className="sub">
          Best reached via email. I usually reply within a day. Slower on
          weekends, faster at 2am for some reason.
        </p>
        <div className="contact-links">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              <span>{link.value}</span>
              <span className="lbl">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
