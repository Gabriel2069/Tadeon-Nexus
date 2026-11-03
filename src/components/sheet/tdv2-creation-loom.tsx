import { useState } from "react";
import {
  ALINHAVOS,
  constitution,
  creationErrors,
  finishCreation,
  type TdvCharacter,
} from "@/lib/tdv2";
import { TdvCheck, TdvAction } from "./tdv2-fields";
import { Button } from "@/components/ui/button";

/** The book's eight creation steps; no XP pool, class or free Lavor is inferred. */
export function TdvCreationLoom({
  character: c,
  onChange,
  canEdit,
  onSelect,
}: {
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
  onSelect: (tab: string) => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const stats = constitution(c),
    errors = creationErrors(c);
  const matrices = Object.values(c.matrices).sort().join(",") === "2,2,3,3";
  const grades = Object.values(c.alinhavos);
  const skills =
    grades.filter((n) => n === 2).length === 2 && grades.filter((n) => n === 1).length === 4;
  const face =
    [c.face.origin, c.face.occupation, c.face.conviction, c.face.limit, c.face.anchor.detail].every(
      (v) => v.trim(),
    ) && c.face.links.some((l) => l.node.trim() && l.nature.trim());
  const steps = [
    ["Feição", "pessoa", "pessoa", face, "Seis pilares e Âncora"],
    ["Matrizes", "constituicao", "constituicao", matrices, "Duas d10 · duas d8"],
    ["Alinhavos", "constituicao", "motor", skills, "Dois d8 · quatro d6"],
    [
      "Recursos",
      "constituicao",
      "recursos",
      true,
      `${stats.maximums.pv} PV · ${stats.maximums.pi} PI · ${stats.maximums.pe} PE`,
    ],
    [
      "Defesas",
      "constituicao",
      "ancora",
      true,
      `Res. ${stats.defenses.Resistência} · Evasão ${stats.defenses.Evasão}`,
    ],
    [
      "Equipar",
      "expressao",
      "inventario",
      Boolean(c.creation?.reviewed),
      "Equipamento e concessões da campanha",
    ],
    [
      "Implicação",
      "pessoa",
      "vinculos",
      Boolean(c.creation?.groupReason.trim()),
      "Por que entrar nesta situação?",
    ],
    [
      "Revisão",
      "constituicao",
      "uso",
      Boolean(c.creation?.reviewed),
      "Acesso, Condições e capacidade",
    ],
  ] as const;
  return (
    <section className="tdv-creation-loom" aria-label="Criação da personagem pelo Livro II">
      <div className="tdv-creation-loom__head">
        <div>
          <small>Livro II · {steps.filter((step) => step[3]).length}/8 passos</small>
          <h2>Criação</h2>
        </div>
        <Button
          aria-label="Concluir criação TdV II"
          disabled={!canEdit || errors.length > 0}
          onClick={() => onChange(finishCreation(c))}
        >
          Concluir
        </Button>
      </div>
      <div className="tdv-creation-journey">
        <div className="tdv-creation-steps">
          {steps.map(([label, tab, emblem, done, hint], i) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                setActiveStep(i);
                onSelect(tab);
              }}
              data-complete={done}
              data-current={activeStep === i}
              aria-label={`Criação: ${label}`}
            >
              <span>
                <small>0{i + 1}</small>
                <strong>{label}</strong>
                <span className="sr-only">{hint}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="tdv-creation-guidance">
          <strong>{steps[activeStep][0]}</strong> · {steps[activeStep][4]}
        </p>
        <TdvAction
          title={`Revisar criação · ${errors.length ? `${errors.length} pendências` : "pronta"}`}
          className="tdv-creation-review"
        >
          <p>
            Matrizes começam em d6; distribua 3, 3, 2 e 2. Alinhavos começam em d4; escolha dois em
            grau 2 e quatro em grau 1. Os demais permanecem em grau 0.
          </p>
          <p>
            Equipamento depende da Origem, Ofício e campanha. Lavor inicial exige concessão
            explícita do cenário, igualmente oferecida ao grupo; não é gratuito por este painel e
            não gasta retroativamente o Urdume futuro.
          </p>
          {c.creation && (
            <>
              <p>
                Implicação:{" "}
                {c.creation.groupReason || "Defina o laço com a primeira situação em Pessoa."}
              </p>
              <TdvCheck
                label="Conferi permissões ficcionais, equipamento, Condições iniciais e capacidade"
                value={c.creation.reviewed}
                disabled={!canEdit}
                onChange={(v) => onChange({ ...c, creation: { ...c.creation!, reviewed: v } })}
              />
            </>
          )}
          <p>
            Ao concluir, PV, PI e PE ficam nos máximos calculados. A Marca pode continuar não
            manifestada.
          </p>
          <ul>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </TdvAction>
      </div>
    </section>
  );
}

export function TdvFamiliarities({
  character: c,
  onChange,
  canEdit,
}: {
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
}) {
  if (!c.creation) return null;
  const selected = c.creation.familiarities;
  if (c.ready && !c.progression?.allowCreation)
    return selected.length ? (
      <div className="tdv-familiarities-reading">
        <small>Familiaridades iniciais · sem bônus</small>
        <p>{selected.join(" · ")}</p>
        <span>Os dados atuais estão nos Alinhavos.</span>
      </div>
    ) : null;
  return (
    <TdvAction title={`Familiaridades · ${selected.length}/4`} className="tdv-familiarities">
      <p>
        Destaque até quatro Alinhavos em grau 0 para retratar sua formação. Todos continuam d4;
        familiaridade não altera grau, dado ou custo.
      </p>
      <div>
        {ALINHAVOS.filter((name) => (c.alinhavos[name] ?? 0) === 0).map((name) => (
          <button
            type="button"
            aria-pressed={selected.includes(name)}
            disabled={
              !canEdit ||
              (c.ready && !c.progression?.allowCreation) ||
              (!selected.includes(name) && selected.length >= 4)
            }
            key={name}
            onClick={() =>
              onChange({
                ...c,
                creation: {
                  ...c.creation!,
                  familiarities: selected.includes(name)
                    ? selected.filter((n) => n !== name)
                    : [...selected, name],
                },
              })
            }
          >
            {name}
            <small>d4</small>
          </button>
        ))}
      </div>
    </TdvAction>
  );
}
