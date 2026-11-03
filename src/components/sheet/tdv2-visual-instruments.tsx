import { useId } from "react";
import type { TdvCharacter } from "@/lib/tdv2";

/** Original thread studies: each drawing reads actual character state. */
export function TdvFeicaoPortrait({ character: c }: { character: TdvCharacter }) {
  const pillars = [
    c.face.origin,
    c.face.occupation,
    c.face.conviction,
    c.face.limit,
    c.face.mark.trigger,
    c.face.links.some((l) => l.node && l.nature),
  ];
  const established = pillars.filter(Boolean).length;
  return (
    <figure
      className="tdv-feicao-portrait"
      aria-label={`${established} pilares de Feição estabelecidos`}
    >
      <svg viewBox="0 0 240 300" fill="none" aria-hidden="true">
        <path className="tdv-portrait-halo" d="M120 12 218 74v152L120 288 22 226V74Z" />
        <path className="tdv-portrait-rim" d="M120 25 206 81v138l-86 56-86-56V81Z" />
        {Array.from({ length: 13 }, (_, i) => (
          <path
            key={i}
            className="tdv-portrait-fiber"
            d={`M${40 + i * 3} 235 Q${30 + i * 9} ${160 - i * 3} 120 ${49 + i * 4} Q${210 - i * 5} ${154 + i * 3} ${201 - i * 3} 235`}
          />
        ))}
        <path className="tdv-portrait-face" d="M82 94q38-28 76 0l-6 64-32 27-32-27Z" />
        <path
          className="tdv-portrait-ink"
          d="m89 122 21 4m20 0 21-4m-31-23-5 45h12m-22 12 15 5 15-5M71 199l49 29 49-29M88 173l-12 29m76-29 12 29"
        />
        {[
          [120, 18],
          [211, 79],
          [211, 221],
          [120, 281],
          [29, 221],
          [29, 79],
        ].map(([x, y], i) => (
          <g key={i} data-filled={Boolean(pillars[i])}>
            <path className="tdv-portrait-spoke" d={`M120 150 ${x} ${y}`} />
            <circle className="tdv-portrait-node" cx={x} cy={y} r="6" />
          </g>
        ))}
        <path className="tdv-portrait-seam" d="M120 38v59m0 88v78M54 250l66 15 66-15" />
      </svg>
      <figcaption>
        <span>Seis pilares · uma presença</span>
        <strong>{c.face.mark.trigger ? "Marca manifesta" : "Marca não manifestada"}</strong>
      </figcaption>
    </figure>
  );
}

export function TdvAnchorSeal({ shaken, pillar }: { shaken: boolean; pillar: string }) {
  return (
    <div className="tdv-anchor-seal" data-shaken={shaken} aria-hidden="true">
      <svg viewBox="0 0 160 180" fill="none">
        <path d="M80 6 146 47v85l-66 41-66-41V47Z" className="tdv-seal-rim" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx="80" cy="90" rx="26" ry="59" transform={`rotate(${i * 30} 80 90)`} />
        ))}
        <path
          d={
            shaken
              ? "M80 32v37l-13 13 27 17-14 14v35"
              : "M80 30v120M48 81l32 22 32-22M43 119q37 36 74 0"
          }
          className="tdv-seal-core"
        />
      </svg>
      <span>{pillar}</span>
    </div>
  );
}

export function TdvResourceVessel({
  kind,
  value,
  maximum,
}: {
  kind: "pv" | "pi" | "pe";
  value: number;
  maximum: number;
}) {
  const id = useId().replace(/:/g, "");
  const level = Math.max(0, Math.min(1, value / Math.max(1, maximum)));
  const vessel = {
    pv: "M56 9C38 35 18 56 18 88a38 38 0 0 0 76 0C94 56 74 35 56 9Z",
    pi: "M56 9 92 31v78l-36 31-36-31V31Z",
    pe: "M30 16h52l-9 38 13 30-14 42H40L26 84l13-30Z",
  }[kind];
  return (
    <svg
      className="tdv-vessel"
      data-kind={kind}
      viewBox="0 0 112 150"
      role="img"
      aria-label={`${kind.toUpperCase()}: ${value} de ${maximum}`}
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={vessel} />
        </clipPath>
        <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="currentColor" stopOpacity=".7" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <path
        d={vessel}
        fill="currentColor"
        fillOpacity=".05"
        stroke="currentColor"
        strokeOpacity=".7"
      />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y={140 - level * 126} width="112" height="150" fill={`url(#${id}-ink)`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M4 ${139 - level * 126 + i * 8}q26 -12 52 0t52 0`}
            fill="none"
            stroke="currentColor"
            opacity=".45"
          />
        ))}
      </g>
      <path
        d="M56 22v104M12 120h15m58 0h15M16 142h80"
        fill="none"
        stroke="currentColor"
        opacity=".35"
      />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M100 ${39 + i * 25}h7`} stroke="currentColor" opacity=".55" />
      ))}
    </svg>
  );
}

export function TdvEquilibriumWeave({ value, tension }: { value: number; tension: number }) {
  const x = 180 + value * 13;
  return (
    <svg
      className="tdv-equilibrium-weave"
      viewBox="0 0 360 150"
      role="img"
      aria-label={`Equilíbrio ${value}, tensão ${tension}; entre Medo e Conhecimento`}
    >
      <path d="M22 76Q96 2 180 76T338 76Q264 150 180 76T22 76Z" className="tdv-weave-body" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M22 ${60 + i * 5}Q105 ${8 + i * 8} 180 ${76}T338 ${60 + i * 5}`}
          className="tdv-weave-strand"
        />
      ))}
      <path d="M24 76h312M180 24v104" className="tdv-weave-axis" />
      {Array.from({ length: 21 }, (_, i) => (
        <path
          key={i}
          d={`M${50 + i * 13} ${i === 10 ? 63 : 71}v${i === 10 ? 26 : 10}`}
          className="tdv-weave-tick"
        />
      ))}
      <path d={`M${x} 48l11 28-11 28-11-28Z`} className="tdv-weave-pin" />
      <circle cx={x} cy="76" r="4" fill="currentColor" />
      {[-3, -2, -1, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={180 + i * 14}
          cy="126"
          r="3"
          className="tdv-weave-tension"
          data-lit={tension > 0 ? i > 0 && i <= tension : i < 0 && i >= tension}
        />
      ))}
    </svg>
  );
}

export function TdvTrajectory({ count }: { count: number }) {
  const points = Array.from({ length: 21 }, (_, i) => ({
    x: 18 + i * 15.2,
    y: 62 + Math.sin((i * Math.PI) / 5) * 30,
  }));
  return (
    <svg
      className="tdv-trajectory"
      viewBox="0 0 340 126"
      role="img"
      aria-label={`${count} de 20 Marcos incorporados`}
    >
      <path
        d={"M" + points.map((p) => `${p.x},${p.y}`).join(" L")}
        className="tdv-trajectory-thread"
      />
      {points.map((p, i) => (
        <g key={i} data-reached={i <= count}>
          <path d={`M${p.x} ${p.y - 7}l7 7-7 7-7-7Z`} className="tdv-trajectory-knot" />
          {i % 5 === 0 && (
            <text x={p.x} y={p.y + 25} textAnchor="middle">
              {i * 5}%
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function TdvLinkAtlas({
  name,
  character: c,
  onSelect,
}: {
  name: string;
  character: TdvCharacter;
  onSelect: (id: string) => void;
}) {
  const links = c.face.links.filter((l) => l.node.trim());
  if (!links.length) return null;
  return (
    <div className="tdv-link-atlas" aria-label="Mapa de vínculos">
      <div className="tdv-link-atlas__center">
        <span aria-hidden="true">◈</span>
        <strong>{name}</strong>
        <small>
          {links.length} {links.length === 1 ? "relação" : "relações"}
        </small>
      </div>
      <div className="tdv-link-atlas__nodes">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => onSelect(link.id)}
            aria-label={`Ver vínculo com ${link.node}`}
            data-state={link.state}
          >
            <i aria-hidden="true" />
            <strong>{link.node}</strong>
            <small>
              {link.nature} · {link.state}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TdvTestWeave({
  prumo,
  tento,
  dt,
  modifier = 0,
}: {
  prumo: number;
  tento: number;
  dt: number;
  modifier?: number;
}) {
  const total = prumo + tento + modifier,
    min = Math.min(0, total),
    max = Math.max(prumo + tento, total, dt, 1),
    sx = (v: number) => 28 + ((v - min) / (max - min)) * 284;
  return (
    <svg
      className="tdv-test-weave"
      viewBox="0 0 340 128"
      role="img"
      aria-label={`Dois Fios: Prumo ${prumo}, Tento ${tento}; Enlace ${total} contra DT ${dt}`}
    >
      <path
        d={`M28 40h${sx(prumo) - 28} Q${sx(prumo)} 40 ${sx(total)} 64`}
        className="tdv-test-weave__prumo"
      />
      <path
        d={`M28 88h${sx(tento) - 28} Q${sx(tento)} 88 ${sx(total)} 64`}
        className="tdv-test-weave__tento"
      />
      <path d="M28 64h284" className="tdv-weave-axis" />
      <path d={`M${sx(dt)} 20v88`} className="tdv-test-weave__threshold" />
      <circle cx={sx(total)} cy="64" r="10" className="tdv-weave-pin" />
      <text x="28" y="29">
        Prumo {prumo}
      </text>
      <text x="28" y="113">
        Tento {tento}
      </text>
      <text x={sx(dt)} y="14" textAnchor="middle">
        DT {dt}
      </text>
      <text x={Math.min(298, sx(total))} y="91" textAnchor="middle">
        {total}
      </text>
    </svg>
  );
}
