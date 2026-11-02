import { useState } from "react";
import { Activity, Backpack, Layers3, Sprout, UserRound, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ALINHAVOS,
  MATRICES,
  constitution,
  advanceCapability,
  reverseCapability,
  allocateCreation,
  capabilityConditions,
  conditionImpact,
  type TdvCharacter,
} from "@/lib/tdv2";
import { TdvCompetency } from "./tdv2-competencies";
import { TdvProtection } from "./tdv2-protection";
import { TdvGuard } from "./tdv2-procedures";
import { toast } from "sonner";

export function TdvGamePanel({
  character: c,
  onChange,
  canEdit,
  isMaster,
  onOpen,
  onUse,
  onTranscend,
}: {
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
  isMaster: boolean;
  onOpen: (tab: string) => void;
  onUse: (id: string) => void;
  onTranscend: (name: string) => void;
}) {
  const [allSkills, setAllSkills] = useState(false);
  const s = constitution(c);
  const commit = (fn: () => TdvCharacter) => {
    try {
      onChange(fn());
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const capacity = (name: string, matrix = false) => {
    const grade = matrix ? s.matrices[name as (typeof MATRICES)[number]] : (s.alinhavos[name] ?? 0);
    return (
      <TdvCompetency
        key={name}
        name={name}
        matrix={matrix}
        grade={grade}
        creation={!c.ready}
        disabled={!canEdit}
        advanceCost={matrix ? grade + 3 : 2}
        availablePU={s.pu}
        allocationHint="Distribuição inicial"
        choiceAllowed={(value) => {
          try {
            allocateCreation(c, name, value, matrix);
            return true;
          } catch {
            return false;
          }
        }}
        canReverse={
          isMaster &&
          (c.ready
            ? c.investments.some(
                (i) => i.target === name && i.kind === (matrix ? "Matriz" : "Alinhavo"),
              )
            : grade > (matrix ? 1 : 0))
        }
        onAdvance={() => commit(() => advanceCapability(c, name, matrix))}
        onReverse={() => commit(() => reverseCapability(c, name, matrix))}
        onDevelop={() => onTranscend(name)}
        effects={capabilityConditions(c, name).map((item) => ({
          name: item.name || "Condição",
          kind: conditionImpact(item.effect)!.kind,
        }))}
        shaken={matrix && c.scene.shaken.includes(name as (typeof MATRICES)[number])}
      />
    );
  };
  const equipped = c.records.filter((r) => r.kind === "Arma" || r.kind === "Equipamento");
  const expressions = c.records.filter((r) =>
    ["Lavor", "Trama", "Fragmento", "Selo"].includes(r.kind),
  );
  return (
    <section className="tdv-game-panel" aria-label="Painel de jogo">
      <nav className="tdv-game-toolbelt" aria-label="Ferramentas da personagem">
        {(
          [
            ["pessoa", "Pessoa", UserRound],
            ["equipamento", "Equipamento", Backpack],
            ["expressao", "Expressão", Layers3],
            ["acao", "Cena", Activity],
            ["percurso", `${s.pu} PU · ${s.development}%`, Sprout],
          ] as const
        ).map(([tab, label, Icon]) => (
          <Button key={tab} variant="ghost" onClick={() => onOpen(tab)}>
            <Icon aria-hidden="true" />
            {label}
          </Button>
        ))}
      </nav>
      <div className="tdv-game-capacities">
        <div className="tdv-game-matrices">{MATRICES.map((name) => capacity(name, true))}</div>
        <div className="tdv-game-skills">
          {ALINHAVOS.filter((name) => allSkills || (s.alinhavos[name] ?? 0) > 0).map((name) =>
            capacity(name),
          )}
        </div>
        <Button
          variant="ghost"
          className="tdv-game-skills-toggle"
          aria-expanded={allSkills}
          onClick={() => setAllSkills(!allSkills)}
        >
          {allSkills ? "Só treinados" : "Todos os Alinhavos"}
        </Button>
      </div>
      <section className="tdv-game-defense" aria-label="Defesas">
        <TdvProtection character={c} />
        <TdvGuard character={c} canEdit={canEdit} onChange={onChange} />
      </section>
      <section className="tdv-game-ready" aria-label="À mão">
        <h2>
          <Shield aria-hidden="true" />À mão
        </h2>
        <div className="tdv-game-ready-list">
          {equipped.slice(0, 6).map((r) => (
            <button key={r.id} type="button" onClick={() => onOpen("equipamento")}>
              <strong>{r.name || r.kind}</strong>
              <span>{r.fields.Impacto || r.fields["Porte e acesso"] || r.kind}</span>
            </button>
          ))}
        </div>
        {!equipped.length && (
          <Button variant="ghost" onClick={() => onOpen("equipamento")}>
            Organizar equipamento
          </Button>
        )}
        <div className="tdv-game-expression-list">
          {expressions.slice(0, 8).map((r) => (
            <Button
              key={r.id}
              variant="outline"
              disabled={!canEdit || !c.ready}
              onClick={() => onUse(r.id)}
            >
              {r.name || r.kind}
              <small>{r.kind}</small>
            </Button>
          ))}
        </div>
        <Button variant="ghost" onClick={() => onOpen("pessoa")}>
          Âncora · {c.face.anchor.pillar}
        </Button>
        {c.face.links.length > 0 && (
          <Button variant="ghost" onClick={() => onOpen("pessoa")}>
            Vínculos · {c.face.links.length}
          </Button>
        )}
      </section>
    </section>
  );
}
