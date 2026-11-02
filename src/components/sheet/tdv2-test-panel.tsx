import { TdvTestWeave } from "./tdv2-visual-instruments";
import { TdvDie } from "./tdv2-emblem";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TdvDisclosure, TdvField, TdvSelect, TdvNumber, TdvCheck } from "./tdv2-fields";
import {
  ALINHAVOS,
  MATRICES,
  prepareTest,
  resolveTest,
  probabilityProfile,
  type Matrix,
  type TdvCharacter,
  type TestRequest,
} from "@/lib/tdv2";
export function TdvTestPanel({
  character,
  onChange,
  canEdit,
  resolver,
  declaredCosts,
  intention,
  quick = false,
  initialMatrix = "Nexo",
  initialAlinhavo = "Investigação",
}: {
  character: TdvCharacter;
  onChange: (value: TdvCharacter) => void;
  canEdit: boolean;
  resolver?: (request: TestRequest) => ReturnType<typeof resolveTest>;
  declaredCosts?: TestRequest["costs"];
  intention?: string;
  quick?: boolean;
  initialMatrix?: Matrix;
  initialAlinhavo?: string;
}) {
  const [request, setRequest] = useState<TestRequest>({
    matrix: initialMatrix,
    alinhavo: initialAlinhavo,
    dt: 10,
    prumoPro: 0,
    prumoDes: 0,
    tentoPro: 0,
    tentoDes: 0,
    force: "",
    extraordinary: false,
    counterpart: "",
    context: { intention: "", approach: "", change: "", point: "", risk: false },
  });
  const [physical, setPhysical] = useState(false);
  const [confirmedPhysical, setConfirmedPhysical] = useState("");
  const [faces, setFaces] = useState({ prumo: 1, tento: 1 });
  const [remember, setRemember] = useState(!quick);
  const [last, setLast] = useState<ReturnType<typeof resolveTest> | null>(null);
  const upd = <K extends keyof TestRequest>(key: K, value: TestRequest[K]) =>
    setRequest((p) => ({ ...p, [key]: value }));
  const [auxiliary, setAuxiliary] = useState(false);
  const [helper, setHelper] = useState({ name: "", grade: 0, contribution: "" });
  const effective = {
    ...request,
    context: remember
      ? {
          ...request.context!,
          ...(intention !== undefined ? { intention } : {}),
          ...(resolver ? { risk: true } : {}),
        }
      : undefined,
    helper: auxiliary ? helper : undefined,
    costs: declaredCosts,
  };
  const physicalSignature = JSON.stringify({ request: effective, faces });
  let prepared: ReturnType<typeof prepareTest> | null = null,
    error = "";
  try {
    prepared = prepareTest(character, effective);
  } catch (e) {
    error = (e as Error).message;
  }
  const intro = (
    <>
      <p className="tdv-note">
        {quick
          ? "Escolha os Fios e o limiar. Role quando a incerteza mudar a situação."
          : "Declare intenção, abordagem e limiar antes de rolar. Sem risco relevante, resolva diretamente pela ficção."}
      </p>
    </>
  );
  const context = (
    <>
      {quick && (
        <TdvCheck
          label="Registrar a próxima rolagem"
          value={remember}
          onChange={setRemember}
          disabled={!canEdit}
        />
      )}
      {remember && (
        <>
          {" "}
          <div className="tdv-grid">
            {(
              [
                ["intention", "Intenção"],
                ["approach", "Abordagem"],
                ["point", "Ponto em Jogo"],
                ["change", "Mudança relevante desde a tentativa anterior"],
              ] as const
            ).map(([key, label]) => (
              <TdvField
                key={key}
                label={label}
                value={
                  key === "intention" && intention !== undefined ? intention : request.context![key]
                }
                disabled={!canEdit || (key === "intention" && intention !== undefined)}
                onChange={(v) => upd("context", { ...request.context!, [key]: v })}
              />
            ))}
          </div>
          <TdvCheck
            label="Existe risco ou oposição relevante"
            value={effective.context?.risk ?? request.context!.risk}
            disabled={!canEdit}
            onChange={(risk) => upd("context", { ...request.context!, risk })}
          />
        </>
      )}
    </>
  );
  const help = (
    <>
      <TdvDisclosure initiallyOpen={false}>
        <summary>Auxílio: um Prumo, um Tento, um teste</summary>
        <TdvCheck
          label="Receber um Tento de outra pessoa"
          value={auxiliary}
          onChange={setAuxiliary}
          disabled={!canEdit}
        />
        {auxiliary && (
          <div className="tdv-grid">
            <TdvField
              label="Pessoa que auxilia"
              value={helper.name}
              onChange={(name) => setHelper({ ...helper, name })}
              disabled={!canEdit}
              short
            />
            <TdvNumber
              label="Grau do Alinhavo compatível de quem auxilia"
              value={helper.grade}
              max={4}
              onChange={(grade) => setHelper({ ...helper, grade })}
              disabled={!canEdit}
            />
            <TdvField
              label="Contribuição e risco compartilhado"
              value={helper.contribution}
              onChange={(contribution) => setHelper({ ...helper, contribution })}
              disabled={!canEdit}
            />
          </div>
        )}
        <p className="tdv-note">
          Auxílio substitui o Tento: ninguém rola um terceiro dado. Cooperação reúne intervenções
          distintas; seus ganhos não desaparecem pela falha de outra pessoa.
        </p>
      </TdvDisclosure>
    </>
  );
  const physicalControls = (
    <>
      {quick && !resolver && (
        <div className="tdv-dice-source">
          <TdvCheck
            label="Usar dados físicos"
            value={physical}
            onChange={setPhysical}
            disabled={!canEdit}
          />
        </div>
      )}
      {physical && prepared && (
        <div className="tdv-physical-dice">
          <div>
            <TdvDie sides={prepared.prumo} />
            <TdvNumber
              label="Face física de Prumo"
              value={faces.prumo}
              min={1}
              max={prepared.prumo}
              onChange={(prumo) => setFaces({ ...faces, prumo })}
              disabled={!canEdit}
            />
          </div>
          <div>
            <TdvDie sides={prepared.tento} />
            <TdvNumber
              label="Face física de Tento"
              value={faces.tento}
              min={1}
              max={prepared.tento}
              onChange={(tento) => setFaces({ ...faces, tento })}
              disabled={!canEdit}
            />
          </div>
        </div>
      )}
    </>
  );
  const selection = (
    <>
      <div className={`tdv-grid tdv-grid--three${quick ? " tdv-thread-console" : ""}`}>
        <div className="tdv-thread-control">
          {quick && prepared && <TdvDie sides={prepared.prumo} />}
          <TdvSelect
            label="Matriz de Prumo"
            value={request.matrix}
            options={MATRICES}
            onChange={(v) => upd("matrix", v as Matrix)}
            disabled={!canEdit}
          />
        </div>
        <div className="tdv-thread-control">
          {quick && prepared && <TdvDie sides={prepared.tento} />}
          <TdvSelect
            label="Alinhavo de Tento"
            value={request.alinhavo}
            options={ALINHAVOS}
            onChange={(v) => upd("alinhavo", v)}
            disabled={!canEdit}
          />
        </div>
        <TdvNumber
          label="DT ou Defesa"
          value={request.dt}
          min={2}
          max={100}
          onChange={(v) => upd("dt", v)}
          disabled={!canEdit}
        />
      </div>
    </>
  );
  const advanced = (
    <>
      <details className="tdv-disclosure">
        <summary>Proveito, Desproveito e Forçar</summary>
        <div className="tdv-grid">
          {(["Prumo", "Tento"] as const).map((thread) => (
            <div key={thread} className="tdv-grid">
              <TdvNumber
                label={`Fontes de Proveito em ${thread}`}
                value={request[thread === "Prumo" ? "prumoPro" : "tentoPro"]}
                max={20}
                onChange={(v) => upd(thread === "Prumo" ? "prumoPro" : "tentoPro", v)}
                disabled={!canEdit}
              />
              <TdvNumber
                label={`Fontes de Desproveito em ${thread}`}
                value={request[thread === "Prumo" ? "prumoDes" : "tentoDes"]}
                max={20}
                onChange={(v) => upd(thread === "Prumo" ? "prumoDes" : "tentoDes", v)}
                disabled={!canEdit}
              />
            </div>
          ))}
        </div>
        <p className="tdv-note">
          Fontes opostas se cancelam por Fio; no máximo uma categoria líquida. Matriz Abalada e
          efeitos declarados de Condições já estão incluídos. Informe apenas outras fontes.
        </p>
        <TdvSelect
          label="Forçar um Fio"
          options={["Não forçar", "Prumo", "Tento"]}
          value={request.force || "Não forçar"}
          onChange={(v) => upd("force", v === "Não forçar" ? "" : (v as "Prumo" | "Tento"))}
          disabled={!canEdit}
        />
        <TdvCheck
          label="Existe autorização extraordinária expressa para d20"
          value={request.extraordinary}
          onChange={(v) => upd("extraordinary", v)}
          disabled={!canEdit}
        />
        {request.force && character.resources.pe === 0 && (
          <TdvField
            label="Contrapartida acordada para Forçar a 0 PE"
            value={request.counterpart}
            onChange={(v) => upd("counterpart", v)}
            disabled={!canEdit}
          />
        )}
      </details>
    </>
  );
  const roll = (
    <>
      <div className={`tdv-test-dice${quick ? " tdv-test-dice--quick" : ""}`}>
        {!quick && (
          <>
            <div>
              <small>Fio de Prumo</small>
              <strong>{prepared ? `d${prepared.prumo}` : "~"}</strong>
            </div>
            <span aria-hidden="true">+</span>
            <div>
              <small>Fio de Tento</small>
              <strong>{prepared ? `d${prepared.tento}` : "~"}</strong>
            </div>
          </>
        )}
        <Button
          disabled={!canEdit || !prepared || (physical && confirmedPhysical === physicalSignature)}
          onClick={() => {
            try {
              const rolled = resolver
                ? resolver(effective)
                : resolveTest(character, effective, undefined, physical ? faces : undefined);
              if (rolled.character !== character) onChange(rolled.character);
              setLast(rolled);
              if (physical) setConfirmedPhysical(physicalSignature);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        >
          {physical ? "Conferir dados físicos" : "Rolar os dois Fios"}
          {prepared?.cost ? ` · ${prepared.cost} PE` : ""}
          {prepared?.piCost ? ` · ${prepared.piCost} PI` : ""}
        </Button>
        {physical && confirmedPhysical === physicalSignature && (
          <Button variant="ghost" disabled={!canEdit} onClick={() => setConfirmedPhysical("")}>
            Conferir outra rolagem
          </Button>
        )}
      </div>
    </>
  );
  const probability = prepared
    ? probabilityProfile(prepared.prumo, prepared.tento, request.dt).success * 100
    : 0;
  const chance = prepared && (
    <div className="tdv-probability-instrument">
      <div>
        <span>Chance de alcançar o limiar</span>
        <strong>
          {probability.toFixed(1)}
          <small>%</small>
        </strong>
      </div>
      <div
        className="tdv-probability-instrument__scale"
        role="meter"
        aria-label="Chance exata de alcançar o limiar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={probability}
      >
        <span style={{ width: `${probability}%` }} />
        {Array.from({ length: 21 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <small>
        Dados finais contra DT {request.dt}. Não presume acesso nem substitui a situação.
      </small>
    </div>
  );
  const errorNotice = (
    <>
      {error && (
        <p className="tdv-note" role="status">
          {error}
        </p>
      )}
    </>
  );
  const result = (
    <>
      {last && (
        <div className="tdv-result" aria-live="polite">
          <TdvTestWeave prumo={last.result.prumo} tento={last.result.tento} dt={last.result.dt} />
          <p>
            {last.result.quality}
            {last.result.critical ? " · Consonância crítica" : ""}
          </p>
          <div className="tdv-grid tdv-grid--three">
            {Object.entries({
              Prumo: last.result.prumo,
              Tento: last.result.tento,
              Enlace: last.result.enlace,
              Ascendente: last.result.ascendente,
              Retorno: last.result.retorno,
              Desvio: last.result.desvio,
            }).map(([name, value]) => (
              <div className="tdv-reading" key={name}>
                <small>{name}</small>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p>
            Enlace {last.result.enlace} / DT {last.result.dt} · margem{" "}
            {last.result.margin >= 0 ? "+" : ""}
            {last.result.margin}
          </p>
          {last.result.criticalFailure ? (
            <p>
              Matriz {request.matrix} Abalada até o fim da cena. A dupla unidade prevalece sobre o
              limiar e sobre Consonância.
            </p>
          ) : (
            <p>
              {last.result.success
                ? "Intenção alcançada."
                : "Intenção não alcançada como pretendida."}{" "}
              {last.result.consonance && !last.result.success
                ? "Consonância sem alcance não é crítico."
                : "A consequência depende da ação e da situação; Retorno baixo não cobra preço automático."}
            </p>
          )}
        </div>
      )}
    </>
  );
  return (
    <div className="tdv-test-panel">
      {intro}
      {quick ? (
        <>
          {selection}
          {physicalControls}
          {roll}
          {chance}
          {errorNotice}
          {result}
          {advanced}
          {help}
          {context}
        </>
      ) : (
        <>
          {context}
          {help}
          {selection}
          {advanced}
          {roll}
          {chance}
          {errorNotice}
          {result}
        </>
      )}
    </div>
  );
}
