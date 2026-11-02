import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useId } from "react";
import { DICE } from "@/lib/tdv2";

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
  onChange,
  onRoll,
  onDevelop,
  effects = [],
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
}) {
  const [open, setOpen] = useState(false);
  const state = matrix
    ? `Categoria ${MATRIX_CATEGORIES[grade]}`
    : `Grau ${grade} · ${ALINHAVO_STATES[grade]}`;
  const die = `d${DICE[grade]}`;
  const blocked = effects.some((effect) => effect.kind === "Impedimento");
  const face = (
    <span className="tdv-capability-die">
      <small>d</small>
      {DICE[grade]}
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
      {creation ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="tdv-competency__die"
              disabled={disabled}
              aria-label={`${matrix ? "Valor" : "Grau inicial"} de ${name}: ${grade}, ${die}`}
            >
              {face}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="tdv-competency__choices" aria-label={`Escolher ${name}`}>
            <p>{name} · distribuição inicial</p>
            <div role="group" aria-label={matrix ? `Valor de ${name}` : `Grau inicial de ${name}`}>
              {(matrix ? [1, 2, 3] : [0, 1, 2]).map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  aria-pressed={grade === value}
                  onClick={() => {
                    onChange?.(value);
                    setOpen(false);
                  }}
                >
                  {value} · d{DICE[value]}
                  <small>
                    {matrix ? `Categoria ${MATRIX_CATEGORIES[value]}` : ALINHAVO_STATES[value]}
                  </small>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="tdv-competency__die"
              aria-label={`Consultar ${name} · ${state} · ${die}`}
            >
              {face}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="tdv-capability-popup" aria-label={`Capacidade ${name}`}>
            <header>
              <small>{matrix ? "Matriz · Prumo" : "Alinhavo · Tento"}</small>
              <h3>{name}</h3>
              <strong>{die}</strong>
            </header>
            <p>
              {state}
              {shaken ? " · Abalada nesta cena" : ""}
            </p>
            {effects.map((effect, index) => (
              <p className="tdv-capability-effect" key={index}>
                {effect.kind} · {effect.name}
              </p>
            ))}
            {(shaken || effects.length > 0) && (
              <p className="tdv-note">
                {blocked
                  ? "Capacidade impedida até a saída declarada."
                  : "Proveito cancela uma fonte por vez; o deslocamento líquido é de uma categoria por Fio."}
              </p>
            )}
            <div className="tdv-actions">
              <Button
                variant="outline"
                disabled={disabled || !onDevelop}
                onClick={() => {
                  setOpen(false);
                  onDevelop?.();
                }}
              >
                Desenvolver
              </Button>
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
            </div>
          </PopoverContent>
        </Popover>
      )}
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
  onChange,
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
