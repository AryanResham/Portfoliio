import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import SectionHead from "./SectionHead";

const TAPE_TEXT = "⚠ WORK IN PROGRESS ⚠ ".repeat(12);

interface Pt { x: number; y: number }

function Tape({
  from,
  to,
  containerRef,
}: {
  from: Pt;
  to: Pt;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const idRef = useRef(`tape-${Math.random().toString(36).slice(2, 7)}`);
  const id = idRef.current;

  const mid = useMemo<Pt>(
    () => ({ x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }),
    [from.x, from.y, to.x, to.y]
  );

  const ctrlRef = useRef<Pt>({ ...mid });
  const velRef = useRef<Pt>({ x: 0, y: 0 });
  const [ctrl, setCtrl] = useState<Pt>({ ...mid });
  const rafRef = useRef<number | null>(null);
  const dragging = useRef(false);

  const midRef = useRef(mid);
  useEffect(() => { midRef.current = mid; }, [mid]);

  const springBack = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    velRef.current = { x: 0, y: 0 };
    const tick = () => {
      const target = midRef.current;
      const ax = (target.x - ctrlRef.current.x) * 0.13;
      const ay = (target.y - ctrlRef.current.y) * 0.13;
      velRef.current.x = (velRef.current.x + ax) * 0.68;
      velRef.current.y = (velRef.current.y + ay) * 0.68;
      ctrlRef.current = {
        x: ctrlRef.current.x + velRef.current.x,
        y: ctrlRef.current.y + velRef.current.y,
      };
      setCtrl({ ...ctrlRef.current });
      const settled =
        Math.abs(velRef.current.x) < 0.25 &&
        Math.abs(velRef.current.y) < 0.25 &&
        Math.abs(target.x - ctrlRef.current.x) < 0.25 &&
        Math.abs(target.y - ctrlRef.current.y) < 0.25;
      if (!settled) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctrlRef.current = { ...target };
        setCtrl({ ...target });
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    dragging.current = true;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    ctrlRef.current = p;
    setCtrl(p);
  }, [containerRef]);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    springBack();
  }, [springBack]);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  const d = `M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`;

  return (
    <g
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ cursor: "grab", pointerEvents: "all" }}
    >
      {/* fat invisible hit area */}
      <path d={d} stroke="transparent" strokeWidth={80} fill="none" />
      <defs>
        <pattern
          id={`${id}-p`}
          x="0" y="0"
          width="14" height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="7" height="14" fill="#1a1000" />
          <rect x="7" width="7" height="14" fill="#f5c800" />
        </pattern>
        <mask id={`${id}-m`}>
          <rect x="-9999" y="-9999" width="19998" height="19998" fill="white" />
          <path d={d} stroke="black" strokeWidth={26} fill="none" strokeLinecap="butt" />
        </mask>
      </defs>

      {/* diagonal stripe edges only — center masked out */}
      {/* diagonal stripe edges only — center masked out */}
      <path d={d} stroke={`url(#${id}-p)`} strokeWidth={42} fill="none" strokeLinecap="butt" opacity={0.75} mask={`url(#${id}-m)`} />
      {/* yellow center body */}
      <path d={d} stroke="#f5c800" strokeWidth={26} fill="none" strokeLinecap="butt" opacity={0.75} />
      <path id={id} d={d} fill="none" />
      <text
        fill="rgba(0,0,0,0.8)"
        fontSize="13"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="900"
        letterSpacing="2"
        dominantBaseline="central"
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        <textPath href={`#${id}`} startOffset="1%">
          {TAPE_TEXT}
        </textPath>
      </text>
    </g>
  );
}

export default function Projects({ onPlayGame }: { onPlayGame?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ w: 900, h: 400 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;

  return (
    <section id="work">
      <SectionHead
        num="01 / Selected work"
        title="Things I've built."
        aside="Play with the tape while you wait..."
      />
      <div className="wip-zone" ref={containerRef}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${w} ${h}`}
          style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}
        >
          <Tape from={{ x: 0, y: 0 }} to={{ x: w, y: h }} containerRef={containerRef} />
        </svg>
        <div className="wip-plate">
          <span className="wip-badge">WORK IN PROGRESS</span>
          <div className="wip-glyph">🚧</div>
          <h2 className="wip-title">Still deciding how to make this section</h2>
          <p className="wip-sub">
            I am gonna fill this up one day... I promise...
          </p>
          {onPlayGame && (
            <button className="wip-play-btn" onClick={onPlayGame}>
              click for fun
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
