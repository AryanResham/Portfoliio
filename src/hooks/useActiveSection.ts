import { useEffect, useState } from "react";

/**
 * Tracks the section currently nearest the viewport focus line and returns
 * its href (e.g. "#work"). This is more reliable for short final sections
 * like contact blocks that may never dominate intersection ratio.
 */
export function useActiveSection(hrefs: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = hrefs.map((h) => h.replace("#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const updateActive = () => {
      const viewportHeight = window.innerHeight;
      const focusY = viewportHeight * 0.35;
      const scrollBottom = window.scrollY + viewportHeight;
      const docHeight = document.documentElement.scrollHeight;
      const topThreshold = Math.max(24, viewportHeight * 0.08);

      if (window.scrollY <= topThreshold) {
        setActive("#top");
        return;
      }

      // Near the bottom of the page, explicitly activate the last section.
      if (scrollBottom >= docHeight - 24) {
        setActive("#" + elements[elements.length - 1].id);
        return;
      }

      let bestId = elements[0].id;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top;
        const distance = Math.abs(sectionTop - focusY);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = el.id;
        }
      }
      setActive("#" + bestId);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [hrefs]);

  return active;
}
