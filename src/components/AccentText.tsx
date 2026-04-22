/**
 * Parses strings with <accent>text</accent> markers into styled spans.
 * Also handles <verb>text</verb> for the headline verb.
 */
export default function AccentText({ text }: { text: string }) {
  const parts = text.split(/(<accent>.*?<\/accent>|<verb>.*?<\/verb>)/);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("<accent>")) {
          return (
            <span key={i} className="text-[var(--accent)]">
              {part.replace(/<\/?accent>/g, "")}
            </span>
          );
        }
        if (part.startsWith("<verb>")) {
          return (
            <span key={i} id="hl-verb">
              {part.replace(/<\/?verb>/g, "")}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
