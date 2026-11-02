import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TdvChoices } from "./tdv2-fields";
import type { TdvCharacter } from "@/lib/tdv2";
type Effect = NonNullable<TdvCharacter["temporaryEffects"]>[number];
export type TdvEffectControls = {
  temporaryEffects?: Effect[];
  onAddEffect?: (kind: Effect["kind"], value: number, note: string) => void;
  onRemoveEffect?: (id: string) => void;
};
export function TdvEffectEditor({
  name,
  effects,
  disabled,
  onAdd,
  onRemove,
}: {
  name: string;
  effects: Effect[];
  disabled: boolean;
  onAdd?: TdvEffectControls["onAddEffect"];
  onRemove?: TdvEffectControls["onRemoveEffect"];
}) {
  const [editing, setEditing] = useState(false),
    [kind, setKind] = useState<Effect["kind"]>("Proveito"),
    [value, setValue] = useState(1),
    [note, setNote] = useState("");
  return (
    <section className="tdv-temporary-section" aria-label={`Efeitos de ${name}`}>
      {effects.map((effect) => (
        <div className="tdv-temporary-entry" key={effect.id} data-effect={effect.kind}>
          <span>
            <strong>
              {effect.kind}
              {effect.kind === "Bônus" ? ` ${effect.value > 0 ? "+" : ""}${effect.value}` : ""}
            </strong>
            {effect.note && <small>{effect.note}</small>}
          </span>
          <Button
            variant="ghost"
            disabled={disabled}
            aria-label={`Remover ${effect.kind} de ${name}`}
            onClick={() => onRemove?.(effect.id)}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      ))}
      {onAdd && (
        <Button
          variant="ghost"
          className="tdv-temporary-add"
          disabled={disabled}
          aria-expanded={editing}
          onClick={() => setEditing(!editing)}
        >
          <Plus aria-hidden="true" />
          Efeito temporário
        </Button>
      )}
      {editing && (
        <div className="tdv-temporary-editor">
          <TdvChoices
            label="Tipo de efeito"
            value={kind}
            options={["Proveito", "Desproveito", "Bônus"]}
            onChange={(next) => setKind(next as Effect["kind"])}
          />
          {kind === "Bônus" && (
            <label>
              Valor no Enlace
              <Input
                aria-label={`Bônus temporário de ${name}`}
                type="number"
                value={value}
                min={-100}
                max={100}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </label>
          )}
          <label>
            Origem ou duração
            <Input
              aria-label={`Origem do efeito em ${name}`}
              placeholder="Regra, equipamento ou circunstância"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <Button
            disabled={
              disabled ||
              (kind === "Bônus" && (!Number.isInteger(value) || !value || Math.abs(value) > 100))
            }
            onClick={() => {
              onAdd?.(kind, kind === "Bônus" ? value : 1, note);
              setEditing(false);
              setNote("");
            }}
          >
            Aplicar efeito
          </Button>
          <small>
            {kind === "Bônus"
              ? "Modificador excepcional no Enlace, conforme a regra declarada."
              : "Proveito e Desproveito se cancelam; o Fio muda até uma categoria."}
          </small>
        </div>
      )}
    </section>
  );
}
export function TdvEffectBadges({ name, effects }: { name: string; effects: Effect[] }) {
  if (!effects.length) return null;
  const pro = effects.filter((e) => e.kind === "Proveito").length,
    des = effects.filter((e) => e.kind === "Desproveito").length,
    bonus = effects.filter((e) => e.kind === "Bônus").reduce((n, e) => n + e.value, 0);
  return (
    <span className="tdv-capability-badges" aria-label={`Efeitos temporários de ${name}`}>
      {(pro > 0 || des > 0) && (
        <i data-effect={pro > des ? "Proveito" : des > pro ? "Desproveito" : "Cancelados"}>
          {pro > des ? "↑" : des > pro ? "↓" : "↕"}
        </i>
      )}
      {effects.some((e) => e.kind === "Bônus") && (
        <i data-effect="Bônus">
          {bonus > 0 ? "+" : ""}
          {bonus}
        </i>
      )}
    </span>
  );
}
