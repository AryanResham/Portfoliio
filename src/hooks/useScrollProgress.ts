import { useEffect, useState } from "react";

/**
 * Returns a 0 → 1 value representing how far the user has scrolled
 * through the page. Updates on every scroll frame via rAF for smoothness.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
