import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LocateFixed, Weight } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Projects from "./components/Projects";
import About from "./components/About";
import Experience from "./components/Experience";
import Stack from "./components/Stack";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Game from "./Game";
import { useCursorGlow } from "./hooks/useCursorGlow";

export default function App() {
  useCursorGlow();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (!showGame) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowGame(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showGame]);

  return (
    <>
      <div id="top" aria-hidden="true" />
      <Navbar />
      <div className="shell">
        <Hero />
        <Marquee />
        <Projects onPlayGame={() => setShowGame(true)} />
        <About />
        <Experience />
        <Stack />
        <Education />
        <Contact />
        <Footer />
      </div>

      {showGame && (
        <>
          {/* LED pulse keyframe */}
          <style>{`@keyframes led-pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

          {/* backdrop */}
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setShowGame(false); }}
            style={{
              position:"fixed", inset:0, zIndex:1000,
              background:"rgba(4,4,14,0.82)",
              backdropFilter:"blur(12px)",
              WebkitBackdropFilter:"blur(12px)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >
            {/* ── device body ── */}
            <div style={{
              display:"flex", flexDirection:"column",
              width:"min(88vw, calc((100vh - 48px) * 9 / 16))",
              height:"min(calc(100vh - 48px), calc(88vw * 16 / 9))",
              maxWidth:"440px",
              borderRadius:28,
              background:"linear-gradient(160deg,#1a1a2c 0%,#0e0e1c 60%,#09091a 100%)",
              /* layered rim: inner glow → dark gap → white edge → outer glow */
              boxShadow:`
                inset 0 1px 0 rgba(255,255,255,0.07),
                inset 0 -1px 0 rgba(0,0,0,0.5),
                0 0 0 1px rgba(255,255,255,0.07),
                0 0 0 3px #07071a,
                0 0 0 4px rgba(255,255,255,0.05),
                0 0 40px rgba(56,189,248,0.07),
                0 40px 90px rgba(0,0,0,0.85)
              `,
              padding:"10px 22px 20px",
            }}>

              {/* ── top bezel ── */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"0 6px 8px",
                flexShrink:0,
              }}>
                {/* power LED */}
                <div style={{display:"flex", alignItems:"center", gap:6}}>
                  <div style={{
                    width:7, height:7, borderRadius:"50%",
                    background:"#4ade80",
                    boxShadow:"0 0 5px #4ade80, 0 0 12px rgba(74,222,128,0.6)",
                    animation:"led-pulse 2.4s ease-in-out infinite",
                  }}/>
                  <span style={{
                    fontFamily:"'JetBrains Mono',monospace",
                    fontSize:8, letterSpacing:"0.18em",
                    color:"rgba(255,255,255,0.18)", userSelect:"none",
                  }}>PWR</span>
                </div>

                {/* brand */}
                <span style={{
                  fontFamily:"'JetBrains Mono',monospace",fontWeight:"900",
                  fontSize:12, letterSpacing:"0.28em",
                  color:"rgba(255, 255, 255, 0.47)", userSelect:"none",
                }}>SUPER ORGINAL GAME</span>

                {/* close */}
                <button
                  onClick={() => setShowGame(false)}
                  style={{
                    width:24, height:24, borderRadius:5,
                    background:"rgba(0,0,0,0.4)",
                    border:"1px solid rgba(255,255,255,0.12)",
                    color:"rgba(255,255,255,0.4)",
                    fontFamily:"'JetBrains Mono',monospace", fontSize:11,
                    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"color 0.12s, border-color 0.12s",
                  }}
                  onMouseEnter={e=>{const b=e.currentTarget;b.style.color="rgba(255,255,255,0.85)";b.style.borderColor="rgba(255,255,255,0.3)";}}
                  onMouseLeave={e=>{const b=e.currentTarget;b.style.color="rgba(255,255,255,0.4)";b.style.borderColor="rgba(255,255,255,0.12)";}}
                >✕</button>
              </div>

              {/* ── screen bezel ── */}
              <div style={{
                flex:"0 0 75%", position:"relative", minHeight:0,
                borderRadius:"12px",
                overflow:"hidden",
                background:"#04040e",
                boxShadow:`
                  inset 0 0 0 1px rgba(0,0,0,0.8),
                  inset 0 3px 16px rgba(0,0,0,0.7),
                  inset 4px 0 12px rgba(0,0,0,0.3),
                  inset -4px 0 12px rgba(0,0,0,0.3)
                `,
              }}>
                {/* corner screws */}
                {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i)=>(
                  <div key={i} style={{
                    position:"absolute",
                    top: sy<0 ? 6 : "auto", bottom: sy>0 ? 6 : "auto",
                    left: sx<0 ? 6 : "auto", right: sx>0 ? 6 : "auto",
                    width:7, height:7, borderRadius:"50%",
                    background:"radial-gradient(circle at 35% 35%, #1e2030, #0a0b14)",
                    border:"1px solid rgba(255,255,255,0.08)",
                    boxShadow:"inset 0 1px 2px rgba(0,0,0,0.7)",
                    zIndex:2,
                  }}/>
                ))}
                <Game />
              </div>

              {/* ── chin controls ── */}
              <div style={{
                flex:1, display:"flex", alignItems:"center",
                justifyContent:"space-between",
                padding:"0 24px",
                minHeight:0,
              }}>
                {/* move group */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  <div style={{ display:"flex", gap:10 }}>
                    {(["ArrowLeft","ArrowRight"] as const).map((key, i) => (
                      <button
                        key={key}
                        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); window.dispatchEvent(new KeyboardEvent("keydown",{key,bubbles:true})); e.currentTarget.style.background="rgba(56,189,248,0.18)"; e.currentTarget.style.boxShadow="0 0 18px rgba(56,189,248,0.45), inset 0 0 10px rgba(56,189,248,0.08)"; e.currentTarget.style.borderColor="rgba(56,189,248,0.9)"; }}
                        onPointerUp={e => { window.dispatchEvent(new KeyboardEvent("keyup",{key,bubbles:true})); e.currentTarget.style.background="rgba(56,189,248,0.06)"; e.currentTarget.style.boxShadow="0 0 10px rgba(56,189,248,0.2), inset 0 0 8px rgba(56,189,248,0.04)"; e.currentTarget.style.borderColor="rgba(56,189,248,0.55)"; }}
                        onPointerLeave={e => { window.dispatchEvent(new KeyboardEvent("keyup",{key,bubbles:true})); e.currentTarget.style.background="rgba(56,189,248,0.06)"; e.currentTarget.style.boxShadow="0 0 10px rgba(56,189,248,0.2), inset 0 0 8px rgba(56,189,248,0.04)"; e.currentTarget.style.borderColor="rgba(56,189,248,0.55)"; }}
                        onPointerCancel={e => { window.dispatchEvent(new KeyboardEvent("keyup",{key,bubbles:true})); }}
                        style={{
                          width:64, height:64, borderRadius:"50%",
                          background:"rgba(56,189,248,0.06)",
                          border:"2px solid rgba(56,189,248,0.55)",
                          color:"rgba(56,189,248,0.85)",
                          cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          userSelect:"none", touchAction:"none",
                          boxShadow:"0 0 10px rgba(56,189,248,0.2), inset 0 0 8px rgba(56,189,248,0.04)",
                          transition:"background 0.08s, box-shadow 0.08s, border-color 0.08s",
                        }}
                      >
                        {i === 0 ? <ChevronLeft size={28} color="rgba(56,189,248,0.35)" /> : <ChevronRight size={28} color="rgba(56,189,248,0.35)" />}
                      </button>
                    ))}
                  </div>
                  <span style={{
                    fontFamily:"'JetBrains Mono',monospace", fontSize:9,
                    letterSpacing:"0.22em", color:"rgba(255,255,255,0.2)",
                    userSelect:"none",
                  }}>MOVE</span>
                </div>

                {/* fire group */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  <button
                    onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); window.dispatchEvent(new KeyboardEvent("keydown",{key:" ",bubbles:true})); e.currentTarget.style.background="rgba(239,68,68,0.22)"; e.currentTarget.style.boxShadow="0 0 22px rgba(239,68,68,0.55), inset 0 0 12px rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor="rgba(239,68,68,1)"; }}
                    onPointerUp={e => { window.dispatchEvent(new KeyboardEvent("keyup",{key:" ",bubbles:true})); e.currentTarget.style.background="rgba(239,68,68,0.08)"; e.currentTarget.style.boxShadow="0 0 12px rgba(239,68,68,0.25), inset 0 0 10px rgba(239,68,68,0.05)"; e.currentTarget.style.borderColor="rgba(239,68,68,0.6)"; }}
                    onPointerLeave={e => { window.dispatchEvent(new KeyboardEvent("keyup",{key:" ",bubbles:true})); e.currentTarget.style.background="rgba(239,68,68,0.08)"; e.currentTarget.style.boxShadow="0 0 12px rgba(239,68,68,0.25), inset 0 0 10px rgba(239,68,68,0.05)"; e.currentTarget.style.borderColor="rgba(239,68,68,0.6)"; }}
                    onPointerCancel={e => { window.dispatchEvent(new KeyboardEvent("keyup",{key:" ",bubbles:true})); }}
                    style={{
                      width:72, height:72, borderRadius:"50%",
                      background:"rgba(239,68,68,0.08)",
                      border:"2px solid rgba(239,68,68,0.6)",
                      cursor:"pointer", userSelect:"none", touchAction:"none",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 0 12px rgba(239,68,68,0.25), inset 0 0 10px rgba(239,68,68,0.05)",
                      transition:"background 0.08s, box-shadow 0.08s, border-color 0.08s",
                    }}
                  >
                    <LocateFixed size={30} color="rgba(239,68,68,0.35)" />
                  </button>
                  <span style={{
                    fontFamily:"'JetBrains Mono',monospace", fontSize:9,
                    letterSpacing:"0.22em", color:"rgba(255,255,255,0.2)",
                    userSelect:"none",
                  }}>FIRE</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
