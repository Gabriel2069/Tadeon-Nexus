/** Geometric thread instruments. Shape follows the section's job, never a bonus. */
const paths: Record<string, string[]> = {
  pessoal: ["M15 10h34v44H15Z", "M24 10v44m7-30h11m-11 8h11m-11 8h7", "M11 18h8m-8 12h8m-8 12h8"],
  armas: ["M34 7 42 15 25 40l-9 6 3-11Z", "M13 36 28 49M20 43l-9 12", "M39 37h13m-6-6v22"],
  inventario: ["M13 23h38v31H13Z", "M23 23v-9h18v9M13 33h38M28 29h8v8h-8Z", "M21 42v7m22-7v7"],
  historia: ["M10 12h20l4 4h20v38H10Z", "M18 27h28m-28 9h24m-24 9h18", "M6 8h22"],
  uso: ["M32 5 45 20 57 32 45 45 32 59 19 45 7 32 19 20Z", "M20 20h24v24H20ZM32 5v54M7 32h50"],

  pessoa: ["M18 49V19l14-8 14 8v30l-14 8Z", "M21 30h22M24 38h16M27 46h10", "M32 11v46"],
  ancora: [
    "M32 9v25m-9-9 9 9 9-9",
    "M15 37c0 19 34 19 34 0M10 42l5-5 5 5m24 0 5-5 5 5",
    "M26 12a6 6 0 1 1 12 0",
  ],
  vinculos: [
    "M14 20 32 12l18 14-8 24-25-4Z",
    "M14 20 42 50M32 12 17 46M14 20l36 6-33 20",
    "M9 20h10m26 6h10M27 12h10m0 38h10",
  ],
  constituicao: [
    "M32 6 58 32 32 58 6 32Z",
    "M32 16 48 32 32 48 16 32Z",
    "M32 6v52M6 32h52",
    "M32 17 43 32 32 43 19 32Z",
  ],
  recursos: [
    "M12 16h10v29l-5 8-5-8Zm15-6h10v35l-5 8-5-8Zm15 11h10v24l-5 8-5-8Z",
    "M12 34h10m5-8h10m5 12h10",
  ],
  equilibrio: [
    "M7 32h50M32 8v48",
    "M9 23 17 8l8 15H9Zm30 18 8 15 8-15H39Z",
    "M18 32c0-18 28-18 28 0s-28 18-28 0",
  ],
  motor: [
    "M8 15 24 8l16 7v17L24 42 8 32Z",
    "M24 8v34M8 15l16 10 16-10",
    "M33 36l10-8 13 7v16l-13 8-13-8V39",
    "M43 28v31m-13-8 13-8 13 8",
  ],
  condicoes: ["M13 12h38L42 52H22Z", "M32 12v11l-7 7 14 7-7 6v9", "M20 24h8m8 0h9M19 39h10m9 0h7"],
  recuperacao: [
    "M13 49c0-21 8-34 37-35-1 29-14 37-35 37Z",
    "M14 50 43 21M24 40V27m0 13h14m-5-9V19",
  ],
  cena: ["M32 7a25 25 0 1 1-18 7", "M32 13v19l13 8", "M7 8v12h12"],
  expressao: ["M12 14h23l17 17v23H12Z", "M35 14v17h17M20 39h23m-23 7h17", "M9 8h34"],
  percurso: ["M12 49 24 37l11 5 17-26", "M10 16h11m-4-4v9M44 51h10", "M12 49h40M24 37v12m11-7v7"],
};
export function TdvEmblem({ kind, className = "" }: { kind: string; className?: string }) {
  return (
    <svg
      className={`tdv-emblem ${className}`}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="tdv-emblem__frame" d="M4 18 18 4h42v42L46 60H4Z" />
      {(paths[kind] ?? paths.expressao).map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={i === 0 ? 1.5 : 1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
export function TdvDie({ sides }: { sides: number }) {
  const polygon: Record<number, string> = {
    4: "32 5 60 55 4 55",
    6: "10 10 54 10 54 54 10 54",
    8: "32 3 61 32 32 61 3 32",
    10: "32 3 57 22 48 55 16 55 7 22",
    12: "32 3 59 23 49 56 15 56 5 23",
    20: "17 5 47 5 62 32 47 59 17 59 2 32",
  };
  return (
    <span className="tdv-die">
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <polygon points={polygon[sides] ?? polygon[4]} stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M17 5 32 15 47 5M2 32l12 5 3 22m30 0 3-22 12-5"
          stroke="currentColor"
          opacity=".25"
        />
      </svg>
      <b>d{sides}</b>
    </span>
  );
}
