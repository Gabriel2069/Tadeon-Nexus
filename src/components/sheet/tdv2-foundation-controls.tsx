import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TdvAction, TdvField, TdvSelect } from "./tdv2-fields";
import {
  adoptFoundation,
  grantPractice,
  invest,
  recoveryPreview,
  recoverByFronts,
  invokeConviction,
  advanceBond,
  BOND_GRADES,
  MATRICES,
  ALINHAVOS,
  type TdvCharacter,
  type RecoveryFronts,
} from "@/lib/tdv2";

type Props = { character: TdvCharacter; onChange: (c: TdvCharacter) => void; canEdit: boolean };
function commit(onChange: Props["onChange"], action: () => TdvCharacter) {
  try {
    onChange(action());
  } catch (e) {
    toast.error((e as Error).message);
  }
}
export function TdvFoundationConversion({ character: c, onChange, canEdit }: Props) {
  if (c.foundation || !canEdit) return null;
  return (
    <TdvAction title="Adaptar à Fundação VIII">
      <p>
        A adaptação conserva escolhas, preços pagos, equipamentos e uma cópia integral da ficha
        anterior. As novas fórmulas passam a valer; os pontos atuais não são curados. Matrizes
        antigas ficam como exceção legada explícita, sem rebaixamento.
      </p>
      <p>
        Revise graus de Vínculos, condições, Marcas, Espaços de Carga e dados de dano com o jogador.
        A conversão não declara consequências terminais.
      </p>
      <Button disabled={!c.ready} onClick={() => commit(onChange, () => adoptFoundation(c))}>
        Aplicar adaptação preservando os dados
      </Button>
    </TdvAction>
  );
}
export function TdvFoundationDevelopment({
  character: c,
  onChange,
  canEdit,
  isMaster,
}: Props & { isMaster: boolean }) {
  const [practice, setPractice] = useState("");
  if (!c.foundation) return null;
  const used = c.foundation.practices
    .filter((p) => p.interval === c.milestones.length)
    .reduce((s, p) => s + p.pu, 0);
  return (
    <div className="tdv-actions">
      {isMaster && (
        <TdvAction title={`Reconhecer Prática · ${2 - used} PU disponíveis no intervalo`}>
          <TdvField
            label="Prática incorporada"
            value={practice}
            onChange={setPractice}
            disabled={!canEdit}
          />
          <div className="tdv-actions">
            {([1, 2] as const).map((pu) => (
              <Button
                key={pu}
                disabled={
                  !canEdit || !practice.trim() || used + pu > 2 || c.milestones.length >= 20
                }
                onClick={() => commit(onChange, () => grantPractice(c, practice, pu))}
              >
                Reconhecer · +{pu} PU
              </Button>
            ))}
          </div>
        </TdvAction>
      )}
      <TdvAction title="Reforçar reservas · 2 PU">
        <p>
          Uma compra por recurso, mais uma a cada quatro Marcos. Cada compra acrescenta 2 PV, 2 PI
          ou 1 PE.
        </p>
        <div className="tdv-actions">
          {(["pv", "pi", "pe"] as const).map((key) => (
            <Button
              key={key}
              disabled={!canEdit || !c.ready}
              onClick={() =>
                commit(onChange, () =>
                  invest(c, {
                    kind: "Reforço",
                    target: key,
                    cost: 2,
                    reason: `Reforço de ${key.toUpperCase()}`,
                    transcendent: false,
                  }),
                )
              }
            >
              +{key === "pe" ? 1 : 2} {key.toUpperCase()}
            </Button>
          ))}
        </div>
      </TdvAction>
      {!!c.foundation.practices.length && (
        <TdvAction title="Práticas reconhecidas">
          {c.foundation.practices.map((p) => (
            <p key={p.id}>
              {p.name} · +{p.pu} PU · intervalo {p.interval}–{p.interval + 1}
            </p>
          ))}
        </TdvAction>
      )}
    </div>
  );
}
export function TdvFrontRecovery({ character: c, onChange, canEdit }: Props) {
  const [fronts, setFronts] = useState<RecoveryFronts>({
    rest: 1,
    shelter: 0,
    care: 0,
    support: 0,
  });
  const [window, setWindow] = useState("");
  const gain = recoveryPreview(c, fronts);
  return (
    <>
      <div className="tdv-grid tdv-grid--identity">
        {(
          [
            ["rest", "Repouso"],
            ["shelter", "Abrigo · PE"],
            ["care", "Cuidado · PV"],
            ["support", "Amparo · PI"],
          ] as const
        ).map(([key, label]) => (
          <TdvSelect
            key={key}
            label={label}
            value={String(fronts[key])}
            options={key === "rest" ? ["0", "1", "2"] : ["-1", "0", "1", "2"]}
            disabled={!canEdit}
            onChange={(v) => setFronts({ ...fronts, [key]: Number(v) })}
          />
        ))}
      </div>
      <p className="tdv-cargo-reading" role="status">
        <strong>
          +{gain.pv} PV · +{gain.pi} PI · +{gain.pe} PE
        </strong>{" "}
        Cada Cota recupera 25% do máximo; arredondamento único, limitado aos pontos faltantes.
      </p>
      <TdvField
        label="Janela real de recuperação"
        value={window}
        onChange={setWindow}
        disabled={!canEdit}
      />
      <Button
        disabled={!canEdit || !c.ready || !window.trim()}
        onClick={() => commit(onChange, () => recoverByFronts(c, fronts, window))}
      >
        Aplicar recuperação
      </Button>
      <p className="tdv-note">
        Recuperação não remove Condições, Marcas ou Âncora Abalada. A mesma janela não pode ser
        reaplicada.
      </p>
    </>
  );
}
export function TdvConvictionUse({ character: c, onChange, canEdit }: Props) {
  const [target, setTarget] = useState<string>(MATRICES[0]),
    [cost, setCost] = useState("");
  if (!c.foundation) return null;
  return (
    <TdvAction
      title={c.scene.convictionInvoked ? "Convicção invocada nesta cena" : "Invocar Convicção"}
    >
      <TdvSelect
        label="Fio favorecido"
        value={target}
        options={[...MATRICES, ...ALINHAVOS]}
        onChange={setTarget}
        disabled={!canEdit}
      />
      <TdvField
        label="Decisão e custo significativo"
        value={cost}
        onChange={setCost}
        disabled={!canEdit}
      />
      <Button
        disabled={!canEdit || !c.ready || c.scene.convictionInvoked || !cost.trim()}
        onClick={() => commit(onChange, () => invokeConviction(c, target, cost))}
      >
        Invocar · Proveito pertinente
      </Button>
    </TdvAction>
  );
}
export function TdvBondProgress({
  character: c,
  onChange,
  canEdit,
  linkId,
}: Props & { linkId: string }) {
  if (!c.foundation) return null;
  const link = c.face.links.find((l) => l.id === linkId)!;
  const grade = link.grade ?? BOND_GRADES.findIndex((s) => s === link.state);
  return (
    <div className="tdv-actions">
      <span className="tdv-link-state">
        {grade < 0 ? "Grau a revisar com o Mestre" : `${grade} · ${BOND_GRADES[grade]}`}
      </span>
      <Button
        variant="outline"
        disabled={!canEdit || !c.ready || c.scene.bondAdvanced || grade < 0 || grade >= 3}
        title="Um avanço por cena, após acontecimento significativo e reciprocidade"
        onClick={() => commit(onChange, () => advanceBond(c, linkId))}
      >
        Reconhecer avanço recíproco
      </Button>
    </div>
  );
}
