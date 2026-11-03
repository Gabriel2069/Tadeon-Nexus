import { changeCrisis, type TdvCharacter } from "@/lib/tdv2";
import { toast } from "sonner";
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
      ...(c.foundation ? ([["surrender", "Sucumbindo", "pe"]] as const) : []),
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
        <div key={kind} data-crisis={key} data-stage={c.crisisMarks?.[kind] ?? 0}>
          <span>
            {c.foundation && kind === "dying" && !c.conditions.some((i) => i.name === "Morrendo")
              ? "Vitalidade zerada"
              : label}
            <em>{c.crisisMarks?.[kind] ?? 0} / 3</em>
            <small>
              {key === "pv"
                ? c.conditions.some((i) => i.name === "Morrendo")
                  ? "Ameaça real à vida"
                  : c.foundation
                    ? "Sem ameaça à vida reconhecida"
                    : c.critical
                : key === "pi"
                  ? "Marcas de Colapso"
                  : "Vestígio · Ruptura · Cessação"}
            </small>
          </span>
          <div>
            {[1, 2, 3].map((value) => (
              <button
                type="button"
                key={value}
                disabled={
                  !canEdit ||
                  Boolean(
                    c.foundation &&
                    (value > (c.crisisMarks?.[kind] ?? 0) + 1 ||
                      (kind === "dying" && !c.conditions.some((i) => i.name === "Morrendo"))),
                  )
                }
                aria-label={`${label}: ${value} de 3`}
                aria-pressed={(c.crisisMarks?.[kind] ?? 0) >= value}
                title={
                  c.foundation
                    ? "Avançar exige agravamento real reconhecido pelo Mestre; nenhuma Marca é automática por rodada."
                    : "Marcador manual de risco; a consequência é definida pela situação."
                }
                onClick={() => {
                  try {
                    onChange(
                      changeCrisis(
                        c,
                        kind,
                        (c.crisisMarks?.[kind] ?? 0) === value ? value - 1 : value,
                      ),
                    );
                  } catch (e) {
                    toast.error((e as Error).message);
                  }
                }}
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
