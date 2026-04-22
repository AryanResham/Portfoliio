import { useState, useEffect, useRef } from "react";

type CountdownState = {
  display: string;
  eventLabel: string;
  statusLabel: string;
};

const FALLBACK_TARGET = getFallbackRaceDate();
const FALLBACK_EVENT = "Next race weekend";
const FALLBACK_STATUS = "schedule syncing";

type OpenF1Session = {
  country_name?: string;
  circuit_short_name?: string;
  date_start?: string;
  session_name?: string;
};

export function useCountdown(): CountdownState {
  const targetRef = useRef(FALLBACK_TARGET);
  const [state, setState] = useState<CountdownState>({
    display: format(FALLBACK_TARGET),
    eventLabel: FALLBACK_EVENT,
    statusLabel: FALLBACK_STATUS,
  });

  useEffect(() => {
    let cancelled = false;

    const syncNextRace = async () => {
      try {
        const nowIso = new Date().toISOString();
        const response = await fetch(
          `https://api.openf1.org/v1/sessions?session_name=Race&date_start>=${encodeURIComponent(nowIso)}&is_cancelled=false`
        );

        if (!response.ok) {
          throw new Error(`OpenF1 returned ${response.status}`);
        }

        const sessions = (await response.json()) as OpenF1Session[];
        const nextRace = sessions
          .filter((session) => session.date_start)
          .sort(
            (a, b) =>
              new Date(a.date_start as string).getTime() -
              new Date(b.date_start as string).getTime()
          )[0];

        if (!nextRace?.date_start || cancelled) return;

        const target = new Date(nextRace.date_start);
        targetRef.current = target;

        const circuit = nextRace.circuit_short_name?.trim();
        const country = nextRace.country_name?.trim();

        setState({
          display: format(target),
          eventLabel:
            circuit && country ? `${country} GP · ${circuit}` : FALLBACK_EVENT,
          statusLabel: nextRace.session_name ?? "Race",
        });
      } catch {
        if (cancelled) return;
        targetRef.current = FALLBACK_TARGET;
        setState({
          display: format(FALLBACK_TARGET),
          eventLabel: FALLBACK_EVENT,
          statusLabel: FALLBACK_STATUS,
        });
      }
    };

    syncNextRace();
    const refreshId = window.setInterval(syncNextRace, 1000 * 60 * 60 * 6);
    const tickId = window.setInterval(() => {
      setState((current) => ({
        ...current,
        display: format(targetRef.current),
      }));
    }, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshId);
      window.clearInterval(tickId);
    };
  }, []);

  return state;
}

function getFallbackRaceDate() {
  const t = new Date();
  t.setUTCDate(t.getUTCDate() + ((7 - t.getUTCDay()) % 7 || 7));
  t.setUTCHours(18, 0, 0, 0);
  return t;
}

function format(target: Date) {
  let diff = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  const d = Math.floor(diff / 86400);
  diff %= 86400;
  const h = Math.floor(diff / 3600);
  diff %= 3600;
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${p(d)}d ${p(h)}h ${p(m)}m ${p(s)}s`;
}

const p = (n: number) => String(n).padStart(2, "0");
