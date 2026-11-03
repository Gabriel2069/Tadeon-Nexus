import { useId, useState } from "react";
import { HeartPulse, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function TdvResourceActions({
  name,
  value,
  maximum,
  disabled,
  onChange,
  base = maximum,
  modifier = 0,
  onApply,
}: {
  name: string;
  value: number;
  maximum: number;
  disabled: boolean;
  onChange: (value: number) => void;
  base?: number;
  modifier?: number;
  onApply?: (current: number, modifier: number) => void;
}) {
  const id = useId(),
    [open, setOpen] = useState(false),
    [draft, setDraft] = useState(value),
    [draftModifier, setDraftModifier] = useState(modifier);
  const nextMaximum = Math.max(0, base + draftModifier),
    key = name.toLowerCase(),
    Icon = name === "PV" ? HeartPulse : name === "PI" ? Brain : Zap;
  return (
    <>
      <div className="tdv-resource-operation">
        <Button
          className="tdv-resource-step"
          variant="ghost"
          disabled={disabled || value <= 0}
          aria-label={`Retirar 1 ${name}`}
          onClick={() => onChange(value - 1)}
        >
          −
        </Button>
        <Popover
          open={open}
          onOpenChange={(next) => {
            if (next) {
              setDraft(value);
              setDraftModifier(modifier);
            }
            setOpen(next);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="tdv-resource-value"
              aria-label={`${name}: ${value} de ${maximum}. Ajustar ${name}`}
            >
              <strong>{value}</strong>
              <span>/ {maximum}</span>
              <small>ajustar</small>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="tdv-resource-adjust"
            data-resource={key}
            aria-label={`Reserva ${name}`}
          >
            <header>
              <Icon aria-hidden="true" />
              <small>{{ PV: "Vitalidade", PI: "Inteireza", PE: "Esforço" }[name] ?? name}</small>
              <strong>
                {value}
                <span> / {maximum}</span>
              </strong>
              <p>
                {base} de base {modifier >= 0 ? "+" : "−"} {Math.abs(modifier)} de modificador
              </p>
            </header>
            <label htmlFor={id}>{name} atual</label>
            <Input
              id={id}
              className="tadeon-resource-field"
              type="number"
              value={draft}
              min={0}
              max={nextMaximum}
              disabled={disabled}
              onChange={(e) => setDraft(Number(e.target.value))}
            />
            {onApply && (
              <label className="tdv-resource-modifier">
                Modificador do máximo
                <Input
                  aria-label={`Modificador de ${name}`}
                  type="number"
                  min={-10000}
                  max={10000}
                  disabled={disabled}
                  value={draftModifier}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setDraftModifier(next);
                    setDraft(Math.min(draft, Math.max(0, base + next)));
                  }}
                />
                <small>
                  {base} {draftModifier >= 0 ? "+" : "−"} {Math.abs(draftModifier)} = {nextMaximum}
                </small>
              </label>
            )}
            <Button
              disabled={
                disabled ||
                !Number.isInteger(draft) ||
                draft < 0 ||
                draft > nextMaximum ||
                !Number.isInteger(draftModifier) ||
                Math.abs(draftModifier) > 10000
              }
              onClick={() => {
                if (onApply) onApply(draft, draftModifier);
                else onChange(draft);
                setOpen(false);
              }}
            >
              Aplicar {name}
            </Button>
          </PopoverContent>
        </Popover>
        <Button
          className="tdv-resource-step"
          variant="ghost"
          disabled={disabled || value >= maximum}
          aria-label={`Restaurar 1 ${name}`}
          onClick={() => onChange(value + 1)}
        >
          +
        </Button>
      </div>
      <div className="tdv-resource-level" aria-hidden="true">
        <span
          style={{ width: `${Math.max(0, Math.min(100, (value / Math.max(1, maximum)) * 100))}%` }}
        />
      </div>
    </>
  );
}
