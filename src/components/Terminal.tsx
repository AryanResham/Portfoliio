import { ChevronRight, BookText, Cookie, Braces } from "lucide-react";
import { nowItems, typingPhrases } from "../data/siteData";
import { useClock } from "../hooks/useClock";
import { useCountdown } from "../hooks/useCountdown";
import { useTypingLoop } from "../hooks/useTypingLoop";

export default function Terminal() {
  const clock = useClock();
  const countdown = useCountdown();
  const typedText = useTypingLoop(typingPhrases);

  return (
    <div className="stage">
      <div className="stage-bar">
        <div className="dots">
          <i />
          <i />
          <i />
        </div>
        <span>~/aryan.live — now.sh</span>
        <span>{clock}</span>
      </div>

      <div className="stage-body">
        {nowItems.map((item, i) => (
          <div
            key={i}
            className={`now-row ${item.featured ? "big" : ""}`}
          >
            <span className="icn">
              {item.label === "Currently building" ? <Braces size={16} /> : item.type === "countdown" ? <ChevronRight size={16} /> : item.label === "Reading" ? <BookText size={16} /> : item.label === "Baking" ? <Cookie size={16} /> : item.icon}
            </span>
            <div>
              <div className="lbl">{item.label}</div>
              {item.type === "typing" ? (
                <div className="now-typing">
                  {typedText}
                  <span className="caret" />
                </div>
              ) : item.type === "countdown" ? (
                <div className="val">{countdown.eventLabel}</div>
              ) : (
                <div className="val">{item.value}</div>
              )}
            </div>
            {item.type === "typing" && (
              <div className="now-eq">
                <i />
                <i />
                <i />
                <i />
              </div>
            )}
            {item.type === "countdown" && (
              <div className="meta">
                <span className="now-countdown">{countdown.display}</span>
                <br />
                {countdown.statusLabel}
              </div>
            )}
            {item.meta && (
              <div className="meta whitespace-pre-line">{item.meta}</div>
            )}
          </div>
        ))}
      </div>

      <div className="label">
        <span className="blink" />
        status.{"<missing>"} · syncing from Mumbai
      </div>
    </div>
  );
}
