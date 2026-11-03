import { HeartPulse, Footprints, Eye, Mountain } from "lucide-react";
import { constitution, type TdvCharacter } from "@/lib/tdv2";

/** Thresholds are limits to meet, not consumable bars. */
export function TdvProtection({ character: c }: { character: TdvCharacter }) {
  const stats = constitution(c);
  const thresholds = [
    ["Resistência", HeartPulse, "Ímpeto", "Corpo"],
    ["Evasão", Footprints, "Cadência", "Movimento"],
    ...(!c.foundation ? ([["Lucidez", Eye, "Nexo + Lastro", "Percepção"]] as const) : []),
    ["Firmeza", Mountain, c.foundation ? "Lastro" : "Lastro + Nexo", "Presença"],
  ] as const;
  return (
    <div className="tdv-protection-instrument" data-broken={c.guard.broken}>
      <div className="tdv-guard-sigil">
        <svg viewBox="0 0 120 136" aria-hidden="true">
          <path d="M60 5 109 24v44c0 30-23 49-49 63C34 117 11 98 11 68V24Z" />
          <path d="m60 14 40 16v38c0 25-18 42-40 55-22-13-40-30-40-55V30Z" />
          <path d={c.guard.broken ? "m65 7-17 40 22 13-25 40 17 30" : "M36 37h48M32 94h56"} />
        </svg>
        <div>
          <small>Guarda</small>
          <strong>{stats.guard ?? "∅"}</strong>
          <span>{c.guard.broken ? "Quebrada" : "Disponível"}</span>
        </div>
      </div>
      <div className="tdv-protection-context">
        <strong>
          {c.guard.totalCover
            ? "Cobertura total"
            : c.guard.protectionSource || (c.foundation ? "Proteção passiva" : "Base de Cadência")}
        </strong>
        <span>
          {c.guard.totalCover ||
            (c.guard.broken
              ? "Sem proteção imediata; os demais limiares permanecem."
              : `${c.foundation ? 8 + Math.floor(c.milestones.length / 4) : stats.defenses.Evasão} de base${c.guard.protection ? ` + ${c.guard.protection} de proteção` : ""}${c.guard.modifier ? ` ${c.guard.modifier > 0 ? "+" : "−"} ${Math.abs(c.guard.modifier)} extraordinário` : ""}`)}
        </span>
      </div>
      <dl className="tdv-defense">
        {thresholds.map(([name, Icon, source, scope]) => (
          <div key={name} data-defense={name}>
            <Icon aria-hidden="true" />
            <dt>
              {name}
              <small>{scope}</small>
            </dt>
            <dd>{stats.defenses[name]}</dd>
            <span>{source}</span>
          </div>
        ))}
      </dl>
    </div>
  );
}
