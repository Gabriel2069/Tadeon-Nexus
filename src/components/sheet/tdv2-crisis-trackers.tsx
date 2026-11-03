import type { TdvCharacter } from "@/lib/tdv2";
export function TdvCrisisTrackers({
  character: c,
  onChange,
  canEdit,
}: {
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
}) {
  const entries = (
    [
      ["dying", "Morrendo", "pv"],
      ["collapse", "Colapsando", "pi"],
    ] as const
  ).filter(
    ([kind, , key]) =>
      c.resources[key] === 0 ||
      (c.crisisMarks?.[kind] ?? 0) > 0 ||
      (key === "pv" && c.critical !== "Ativa") ||
      (key === "pi" && c.conditions.some((item) => item.id === "tdv-zero-pi")),
  );
  if (!entries.length) return null;
  return (
    <div className="tdv-crisis-trackers" aria-label="Acompanhamento de risco">
      {entries.map(([kind, label, key]) => (
        <div key={kind} data-crisis={key}>
          <span>
            {label}
            <small>{key === "pv" ? c.critical : "Colapso de Inteireza"}</small>
          </span>
          <div>
            {[1, 2, 3].map((value) => (
              <button
                type="button"
                key={value}
                disabled={!canEdit}
                aria-label={`${label}: ${value} de 3`}
                aria-pressed={(c.crisisMarks?.[kind] ?? 0) >= value}
                title="Marcador manual de risco; a consequência é definida pela situação."
                onClick={() =>
                  onChange({
                    ...c,
                    crisisMarks: {
                      dying: c.crisisMarks?.dying ?? 0,
                      collapse: c.crisisMarks?.collapse ?? 0,
                      [kind]: (c.crisisMarks?.[kind] ?? 0) === value ? 0 : value,
                    },
                  })
                }
              >
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
