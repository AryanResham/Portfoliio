import { profile, navLinks } from "../data/siteData";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useActiveSection } from "../hooks/useActiveSection";

export default function Navbar() {
  const [pfpOpen, setPfpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const hrefs = useMemo(() => navLinks.map((l) => l.href), []);
  const active = useActiveSection(hrefs);

  const pillsRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  const updateIndicator = useCallback(() => {
    if (!pillsRef.current || !active) return;
    const container = pillsRef.current;
    const link = container.querySelector<HTMLAnchorElement>(
      `a[href="${active}"]`
    );
    if (!link) return;
    const cRect = container.getBoundingClientRect();
    const lRect = link.getBoundingClientRect();
    setIndicator({
      left: lRect.left - cRect.left,
      width: lRect.width,
    });
    setReady(true);
  }, [active]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <nav
      id="nav"
      className="site-nav sticky top-0 z-50 backdrop-blur-md backdrop-saturate-[1.2]"
      style={{ background: "color-mix(in oklab, var(--bg), transparent 20%)" }}
    >
      <div className="nav-shell">
        <div className="flex items-center justify-between py-5">
          <div
            className="relative flex items-center gap-2.5 font-medium text-[0.95rem]"
            onMouseEnter={() => setPfpOpen(true)}
            onMouseLeave={() => setPfpOpen(false)}
          >
            <span
              className="sig"
              onClick={(e) => {
                e.stopPropagation();
                setPfpOpen((p) => !p);
              }}
            >
              {profile.initials}
            </span>

            <div className={`pfp-card ${pfpOpen ? "open" : ""}`}>
              <div className="pfp-img" />
              <div className="pfp-name">{profile.name}</div>
              <div className="pfp-role font-mono">{profile.pfp.role}</div>
              <div className="pfp-meta">
                {profile.pfp.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            <span>{profile.name.split(" ")[0]}.</span>
          </div>

          <ul className="nav-pills hidden md:flex" ref={pillsRef}>
            <li
              className="nav-indicator"
              aria-hidden="true"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: ready ? 1 : 0,
              }}
            />
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={active === l.href ? "active" : ""}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2 font-mono text-[0.72rem] text-[var(--ink-2)]">
            <span className="pulse" />
            {profile.status}
          </div>
        </div>

        <div className={`mobile-nav md:hidden ${menuOpen ? "open" : ""}`}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`mobile-nav-link ${active === l.href ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
