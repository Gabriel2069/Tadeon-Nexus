import { TdvDie } from "./tdv2-emblem";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useId } from "react";
import { DICE } from "@/lib/tdv2";

// A departing selector must not return focus over a selector the player just opened.
function preserveNextPopupFocus(event: Event) {
  const next = document.activeElement?.closest(
    '[data-slot="popover-content"][data-state="open"], [data-slot="dialog-content"][data-state="open"], [data-trigger-slot="popover-trigger"][data-state="open"]',
  );
  if (
    next &&
    next !== event.target &&
    !(event.target instanceof Element && event.target.contains(next))
  )
    event.preventDefault();
}
export const ALINHAVO_STATES = [
  "Comum",
  "Iniciado",
  "Praticado",
  "Profissional",
  "Especialista",
] as const;
export const MATRIX_CATEGORIES = [
  "0 · Limitado",
  "I",
  "II",
  "III",
  "IV",
  "V · Transcendente",
] as const;

/** One flat competence scale; visual positions do not create skill families. */
export function TdvCompetency({
  name,
  grade,
  matrix = false,
  shaken = false,
  disabled = false,
  creation = false,
  onRoll,
  onDevelop,
  effects = [],
  choiceAllowed,
  allocationHint,
  onAdvance,
  onReverse,
  advanceCost,
  availablePU = 0,
  canReverse = false,
}: {
  name: string;
  grade: number;
  matrix?: boolean;
  shaken?: boolean;
  disabled?: boolean;
  creation?: boolean;
  onChange?: (grade: number) => void;
  onRoll?: () => void;
  onDevelop?: () => void;
  effects?: { name: string; kind: string }[];
  choiceAllowed?: (grade: number) => boolean;
  allocationHint?: string;
  onAdvance?: () => void;
  onReverse?: () => void;
  advanceCost?: number;
  availablePU?: number;
  canReverse?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const state = matrix
    ? `Categoria ${MATRIX_CATEGORIES[grade]}`
    : `Grau ${grade} · ${ALINHAVO_STATES[grade]}`;
  const die = `d${DICE[grade]}`;
  const blocked = effects.some((effect) => effect.kind === "Impedimento");
  const face = (
    <span className="tdv-capability-die">
      <TdvDie sides={DICE[grade]} />
    </span>
  );
  return (
    <article
      className={`tdv-competency${matrix ? " tdv-matrix" : ""}`}
      data-capability={name}
      data-grade={grade}
      data-shaken={shaken || undefined}
      data-affected={effects.length > 0 || undefined}
    >
      <h3>{name}</h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="tdv-competency__die"
            aria-label={`${creation ? "Distribuir" : "Consultar"} ${name} · ${state} · ${die}`}
          >
            {face}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onCloseAutoFocus={preserveNextPopupFocus}
          className="tdv-capability-popup"
          aria-label={`Capacidade ${name}`}
        >
          <header>
            <small>{matrix ? "Matriz · Prumo" : "Alinhavo · Tento"}</small>
            <h3>{name}</h3>
            <strong>{die}</strong>
          </header>
          <p>
            {state}
            {shaken ? " · Abalada nesta cena" : ""}
          </p>
          {effects.map((effect, i) => (
            <p className="tdv-capability-effect" key={i}>
              {effect.kind} · {effect.name}
            </p>
          ))}
          <div className="tdv-capability-advance">
            <Button
              variant="ghost"
              aria-label={`Reverter ${name}`}
              disabled={disabled || !canReverse}
              title={canReverse ? "Correção pelo mestre" : "Somente o mestre pode regredir"}
              onClick={() => {
                onReverse?.();
                setOpen(false);
              }}
            >
              −
            </Button>
            <div>
              <strong>
                {grade >= (matrix ? 5 : 4)
                  ? "Escala concluída"
                  : `d${DICE[grade]} → d${DICE[grade + 1]}`}
              </strong>
              <small>
                {creation ? allocationHint : `${advanceCost ?? 0} PU · saldo ${availablePU} PU`}
              </small>
            </div>
            <Button
              variant="outline"
              aria-label={`Avançar ${name}`}
              disabled={
                disabled ||
                grade >= (matrix ? 5 : 4) ||
                (!creation && availablePU < (advanceCost ?? 0)) ||
                (creation && choiceAllowed ? !choiceAllowed(grade + 1) : false)
              }
              onClick={() => {
                if (matrix && grade === 4 && !creation) onDevelop?.();
                else onAdvance?.();
                setOpen(false);
              }}
            >
              +
            </Button>
          </div>
          {!creation && (
            <Button
              variant="ghost"
              disabled={disabled || blocked}
              onClick={() => {
                setOpen(false);
                onRoll?.();
              }}
            >
              Dados opcionais
            </Button>
          )}
        </PopoverContent>
      </Popover>
      <div className="tdv-competency__scale" aria-hidden="true">
        {Array.from({ length: matrix ? 6 : 5 }, (_, value) => (
          <i key={value} data-filled={value <= grade} data-current={value === grade} />
        ))}
      </div>
      <p>
        {state}
        {effects.length > 0 ? ` · ${blocked ? "Impedida" : "Desproveito"}` : ""}
        {shaken ? " · Abalada" : ""}
      </p>
    </article>
  );
}

export function TdvDevelopment({
  percent,
  available,
  spent,
}: {
  percent: number;
  available: number;
  spent: number;
}) {
  const band =
    percent < 25
      ? "Práticas fundamentais"
      : percent < 50
        ? "Práticas especializadas"
        : percent < 75
          ? "Combinações e transformação"
          : percent < 100
            ? "Domínio excepcional"
            : "Integração da trajetória";
  return (
    <div className="tdv-development-instrument">
      <div className="tdv-development-instrument__reading">
        <strong>
          {percent}
          <small>%</small>
        </strong>
        <span>
          {band}
          <small>{percent / 5} de 20 Marcos</small>
        </span>
        <div>
          <strong>{available}</strong>
          <span>
            PU disponíveis<small>{spent} investidos</small>
          </span>
        </div>
      </div>
      <div
        className="tdv-development-track"
        role="progressbar"
        aria-label="Desenvolvimento"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <i key={i} data-reached={i < percent / 5} />
        ))}
      </div>
      <div className="tdv-development-landmarks" aria-hidden="true">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
      <p>
        Marcos de 5% · 2 PU por Marco. A faixa orienta o desenvolvimento; não acrescenta bônus aos
        testes.
      </p>
    </div>
  );
}

export function TdvResourceActions({
  name,
  value,
  maximum,
  disabled,
}: {
  name: string;
  value: number;
  maximum: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState(value);
  const id = useId();
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
            if (next) setDraft(value);
            setOpen(next);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="tdv-resource-value"
              disabled={disabled}
              aria-label={`${name}: ${value} de ${maximum}. Ajustar ${name}`}
            >
              <strong>{value}</strong>
              <span>/ {maximum}</span>
              <small>ajustar</small>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="tdv-resource-adjust">
            <label className="tadeon-dossier-label" htmlFor={id}>
              {name} atual
            </label>
            <Input
              className="tadeon-resource-field"
              id={id}
              type="number"
              value={draft}
              min={0}
              max={maximum}
              onChange={(e) => setDraft(Number(e.target.value))}
            />
            <Button
              disabled={!Number.isInteger(draft) || draft < 0 || draft > maximum}
              onClick={() => {
                onChange(draft);
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
