import { useEffect, useCallback } from "react";

/**
 * Attaches a radial glow that follows the cursor across the page.
 * Uses CSS custom properties on <body> so the glow div can track position via CSS.
 */
export function useCursorGlow() {
  const handleMove = useCallback((e: MouseEvent) => {
    document.body.style.setProperty("--glow-x", `${e.clientX}px`);
    document.body.style.setProperty("--glow-y", `${e.clientY}px`);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [handleMove]);
}
