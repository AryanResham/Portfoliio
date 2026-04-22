import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Cycles through `phrases`, typing and deleting each one character by character.
 * Returns the currently visible text string.
 */
export function useTypingLoop(phrases: string[]) {
  const [text, setText] = useState("");
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  const tick = useCallback(() => {
    const phrase = phrases[phraseIdx.current];
    charIdx.current += deleting.current ? -1 : 1;
    setText(phrase.slice(0, charIdx.current));

    let delay = deleting.current ? 35 : 60;

    if (!deleting.current && charIdx.current === phrase.length) {
      delay = 1800;
      deleting.current = true;
    } else if (deleting.current && charIdx.current === 0) {
      deleting.current = false;
      phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
      delay = 400;
    }

    return delay;
  }, [phrases]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      const delay = tick();
      timer = setTimeout(loop, delay);
    };
    loop();
    return () => clearTimeout(timer);
  }, [tick]);

  return text;
}
