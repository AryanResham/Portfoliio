import type { Project } from "../data/siteData";

export default function SectionHead({
  num,
  title,
  accent,
  aside,
}: {
  num: string;
  title: string;
  accent?: string;
  aside?: string;
}) {
  return (
    <div className="sec-head">
      <div>
        <div className="no">{num}</div>
        <h2>
          {title}
          {accent && (
            <>
              <br />
              <span className="accent">{accent}</span>
            </>
          )}
        </h2>
      </div>
      {aside && <div className="aside">{aside}</div>}
    </div>
  );
}

export function ProjectViz({ viz }: { viz: Project["viz"] }) {
  if (viz === "auction") return <AuctionViz />;
  if (viz === "route") return <RouteViz />;
  if (viz === "terminal") return <TerminalViz />;
  return null;
}

function AuctionViz() {
  return (
    <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity={0.3} />
          <stop offset="1" stopColor="var(--accent)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width="600" height="380" fill="url(#g1)" />
      <g
        fontFamily="JetBrains Mono"
        fontSize="10"
        fill="var(--ink-dim)"
        letterSpacing="1"
      >
        <text x="30" y="36">LOT · 0042 · 1952 WILSON CARD</text>
        <text x="460" y="36" fill="var(--accent)">● LIVE</text>
        <text x="460" y="52">00:02:17</text>
      </g>
      <rect x="30" y="80" width="540" height="110" fill="none" stroke="var(--accent)" strokeOpacity={0.4} />
      <text x="50" y="150" fontFamily="Space Grotesk" fontSize="56" fontWeight="400" fill="var(--ink)" letterSpacing="-2">₹ 48,200</text>
      <text x="50" y="175" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-dim)">CURRENT · 14 BIDDERS</text>
      <rect x="30" y="210" width="150" height="40" fill="var(--accent)" rx="6" />
      <text x="60" y="235" fontFamily="JetBrains Mono" fontSize="10" fill="#fff" letterSpacing="1">BID ₹ 49,000 →</text>
      <rect x="190" y="210" width="80" height="40" fill="none" stroke="var(--rule-2)" rx="6" />
      <text x="210" y="235" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-2)">+1,000</text>
      <text x="30" y="290" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-dim)">REDIS · PUB/SUB · 247 EVENTS / MIN</text>
      <g>
        {[
          { x: 30, h: 10 }, { x: 40, h: 15 }, { x: 50, h: 20 }, { x: 60, h: 12 },
          { x: 70, h: 25 }, { x: 80, h: 18 }, { x: 90, h: 30 }, { x: 100, h: 22 },
          { x: 110, h: 17 }, { x: 120, h: 24 }, { x: 130, h: 20 }, { x: 140, h: 27 },
        ].map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={320 - bar.h}
            width="6"
            height={bar.h}
            fill="var(--accent)"
            opacity={i === 6 ? 1 : 0.7}
          />
        ))}
      </g>
    </svg>
  );
}

function RouteViz() {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
      <g stroke="var(--rule)" strokeWidth="1" fill="none" opacity={0.5}>
        <path d="M0 60 Q 150 90 400 40" />
        <path d="M0 120 Q 200 80 400 130" />
        <path d="M0 170 Q 180 190 400 160" />
      </g>
      <path d="M50 160 C 120 120, 180 130, 240 80 S 340 40, 360 30" stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="5 3" />
      <circle cx="50" cy="160" r="7" fill="var(--bg-2)" stroke="var(--accent)" strokeWidth="2" />
      <text x="62" y="163" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-2)">SION</text>
      <circle cx="360" cy="30" r="7" fill="var(--accent)" />
      <text x="270" y="22" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-2)">KJ SOMAIYA</text>
      <text x="20" y="25" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-dim)">ROUTE 74A · 4.2KM · 12MIN</text>
      <text x="20" y="190" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-dim)">3 MATCHES · ₹45 AVG</text>
    </svg>
  );
}

function TerminalViz() {
  return (
    <div className="viz-pad font-mono text-[0.72rem] leading-[1.7]" style={{ color: "#c9c6bc", background: "#050608" }}>
      <div className="opacity-50">$ python categorize.py oct.pdf</div>
      <div>→ parsed <span className="text-[var(--accent)]">247</span> rows · cleaning…</div>
      <div className="opacity-50">&nbsp;</div>
      <div>FOOD     ████████████░░  42% <span className="text-[var(--accent)]">₹18,240</span></div>
      <div>TRAVEL   █████░░░░░░░░░  18% <span className="text-[var(--accent)]">₹ 7,820</span></div>
      <div>UTILITY  ████░░░░░░░░░░  14% <span className="text-[var(--accent)]">₹ 6,090</span></div>
      <div>SHOP     ███░░░░░░░░░░░  11% <span className="text-[var(--accent)]">₹ 4,770</span></div>
      <div className="opacity-50">&nbsp;</div>
      <div>→ <span className="text-[var(--accent)]">categories.csv</span> · 0.42s</div>
    </div>
  );
}
