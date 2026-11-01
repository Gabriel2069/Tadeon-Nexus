import {
  TdvCompetency,
  TdvDevelopment,
  TdvResourceActions,
  MATRIX_CATEGORIES,
} from "./tdv2-competencies";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AttributeRadar from "./attribute-radar";
import { useState, type ReactNode } from "react";
import {
  TdvDisclosure,
  TdvField,
  TdvSelect,
  TdvNumber,
  TdvCheck,
  TdvInscription,
  TdvChoices,
} from "./tdv2-fields";
import {
  TdvGuard,
  TdvLinkUse,
  TdvOutcome,
  TdvRecordActions,
  TdvExpressionUse,
} from "./tdv2-procedures";
import { TdvTestPanel } from "./tdv2-test-panel";
export { TdvTestPanel } from "./tdv2-test-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section } from "./sheet-ui";
import {
  ALINHAVOS,
  DICE,
  LINK_STATES,
  MATRICES,
  PILLARS,
  RECORD_FIELDS,
  anchor,
  resettle,
  stabilize,
  addMilestone,
  addTension,
  constitution,
  creationErrors,
  equilibriumBand,
  finishCreation,
  invest,
  recover,
  setResource,
  uid,
  type Matrix,
  type TdvCharacter,
  type TdvRecord,
} from "@/lib/tdv2";
import { toast } from "sonner";

export { TdvDisclosure, TdvField, TdvSelect, TdvNumber, TdvCheck } from "./tdv2-fields";
export function Tdv2Sheet({
  character: c,
  onChange,
  canEdit,
  isMaster,
  personaExtra,
  belongings,
  narrative,
}: {
  character: TdvCharacter;
  onChange: (value: TdvCharacter) => void;
  canEdit: boolean;
  isMaster: boolean;
  personaExtra?: ReactNode;
  belongings?: ReactNode;
  narrative?: ReactNode;
}) {
  const [tab, setTab] = useState("pessoa"),
    [event, setEvent] = useState(""),
    [incorporation, setIncorporation] = useState(""),
    [reason, setReason] = useState(""),
    [kind, setKind] = useState("Matriz"),
    [target, setTarget] = useState<string>(MATRICES[0]),
    [cost, setCost] = useState(4),
    [transcendent, setTranscendent] = useState(false),
    [recordKind, setRecordKind] = useState<TdvRecord["kind"]>("Lavor");
  const [rollChoice, setRollChoice] = useState<{ matrix?: Matrix; alinhavo?: string } | null>(null);
  const [newLinkId, setNewLinkId] = useState<string | null>(null);
  const [recovery, setRecovery] = useState("Pausa breve"),
    [care, setCare] = useState(false),
    [rebuilt, setRebuilt] = useState(false),
    [window, setWindow] = useState("");
  const [anchorMode, setAnchorMode] = useState<"Sustentar" | "Redirecionar">("Sustentar");
  const [consequence, setConsequence] = useState(""),
    [outcome, setOutcome] = useState(""),
    [careAction, setCareAction] = useState("");
  const stats = constitution(c),
    errors = creationErrors(c),
    disabled = !canEdit;
  const investmentGrade =
    kind === "Matriz"
      ? stats.matrices[target as Matrix]
      : kind === "Alinhavo"
        ? stats.alinhavos[target]
        : undefined;
  const investmentCost =
    kind === "Matriz" ? (investmentGrade ?? 0) + 3 : kind === "Alinhavo" ? 2 : cost;
  const investmentAtLimit =
    investmentGrade !== undefined && investmentGrade >= (kind === "Matriz" ? 5 : 4);
  const upd = <K extends keyof TdvCharacter>(key: K, value: TdvCharacter[K]) =>
    onChange({ ...c, [key]: value });
  const run = (action: () => TdvCharacter) => {
    try {
      onChange(action());
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const FaceField = c.ready ? TdvInscription : TdvField;
  const face = (key: "origin" | "occupation" | "conviction" | "limit", value: string) =>
    upd("face", { ...c.face, [key]: value });
  return (
    <div className="tadeon-tdv2-sheet" data-folio={tab}>
      <div className="tdv-overview">
        {Object.entries({
          Desenvolvimento: `${stats.development}%`,
          "PU disponíveis": stats.pu,
          Equilíbrio: `${c.equilibrium > 0 ? "+" : ""}${c.equilibrium}`,
          Âncora: c.face.anchor.shaken ? "Abalada" : "Assentada",
        }).map(([label, value]) => (
          <div key={label}>
            <small>
              {label === "Desenvolvimento" ? (
                <abbr title="Desenvolvimento">Desenv.</abbr>
              ) : label === "PU disponíveis" ? (
                <abbr title="Pontos de Urdume disponíveis">PU</abbr>
              ) : (
                label
              )}
            </small>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {!c.ready && (
        <div className="tdv-creation" role="status">
          <div className="tdv-creation-head">
            <h2>Preparar a personagem</h2>
            <Button
              aria-label="Concluir criação TdV II"
              title="Concluir criação TdV II"
              disabled={disabled || errors.length > 0}
              onClick={() => run(() => finishCreation(c))}
            >
              Concluir
            </Button>
          </div>
          <details className="tdv-creation-review">
            <summary>
              {errors.length
                ? `Ver ${errors.length} pendências da revisão`
                : "Conferir a distribuição inicial"}
            </summary>
            <p>
              A distribuição inicial é um exemplo editável. Revise Feição, Matrizes e Alinhavos
              antes de concluir.
            </p>
            {errors.length > 0 && (
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </details>
        </div>
      )}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="tdv-tabs tdv-tabs--sheet" aria-label="Fólios da Ficha Integral">
          {(
            [
              ["pessoa", "Pessoa", "Pessoa"],
              ["constituicao", "Constituição", "Constit."],
              ["acao", "Ação", "Ação"],
              ["expressao", "Expressão", "Expressão"],
              ["percurso", "Percurso", "Percurso"],
            ] as const
          ).map(([value, label, compact], index) => (
            <TabsTrigger key={value} value={value} aria-label={label}>
              <span className="tdv-folio-number" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="tdv-tab-label-full">{label}</span>
              <span className="tdv-tab-label-short" aria-hidden="true">
                {compact}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="pessoa" data-sheet-content>
          <div className="tdv-persona-layout">
            <div className="tdv-persona-dossier">
              <Section id="tdv-feicao" title="Feição">
                <div className="tdv-grid tdv-grid--identity">
                  {(
                    [
                      ["origin", "Origem"],
                      ["occupation", "Ofício"],
                      ["conviction", "Convicção"],
                      ["limit", "Limite"],
                    ] as const
                  ).map(([key, label]) => (
                    <FaceField
                      key={key}
                      label={label}
                      short={key === "origin" || key === "occupation"}
                      value={c.face[key]}
                      onChange={(v) => face(key, v)}
                      disabled={disabled}
                    />
                  ))}
                </div>
                <details className="tdv-disclosure">
                  <summary>
                    Marca · {c.face.mark.trigger ? "transformação registrada" : "não manifestada"}
                  </summary>
                  <div className="tdv-grid">
                    {(
                      [
                        ["trigger", "Gatilho"],
                        ["manifestation", "Manifestação"],
                        ["residue", "Resíduo"],
                      ] as const
                    ).map(([key, label]) => (
                      <TdvField
                        key={key}
                        label={label}
                        value={c.face.mark[key]}
                        onChange={(v) =>
                          upd("face", { ...c.face, mark: { ...c.face.mark, [key]: v } })
                        }
                        disabled={disabled}
                      />
                    ))}
                  </div>
                </details>
              </Section>
            </div>
            <Section id="tdv-ancora" title="Âncora">
              <div className="tdv-anchor-state" data-shaken={c.face.anchor.shaken}>
                <span aria-hidden="true" className="tdv-anchor-knot" />
                <div>
                  <small>Continuidade</small>
                  <strong>{c.face.anchor.shaken ? "Abalada" : "Assentada"}</strong>
                </div>
                <span>{c.face.anchor.pillar}</span>
              </div>
              <div className="tdv-anchor">
                <div className="tdv-anchor-foundation">
                  <TdvChoices
                    label="Pilar escolhido como Âncora"
                    value={c.face.anchor.pillar}
                    options={PILLARS}
                    onChange={(v) =>
                      upd("face", {
                        ...c.face,
                        anchor: {
                          ...c.face.anchor,
                          pillar: v as TdvCharacter["face"]["anchor"]["pillar"],
                        },
                      })
                    }
                    disabled={disabled}
                  />
                  <FaceField
                    label="A que parte de mim consigo retornar?"
                    value={c.face.anchor.detail}
                    onChange={(v) =>
                      upd("face", { ...c.face, anchor: { ...c.face.anchor, detail: v } })
                    }
                    disabled={disabled}
                  />
                </div>
                <TdvDisclosure initiallyOpen={false} className="tdv-anchor-operation">
                  <summary>
                    {c.face.anchor.shaken
                      ? "Reassentar · registrar retorno"
                      : "Ancorar · sustentar ou redirecionar"}
                  </summary>
                  <div className="tdv-anchor-operation__body">
                    <p className="tdv-note">
                      Ancorar sustenta ou redireciona uma consequência plausível; não a apaga.
                      Depois, a Âncora fica Abalada até uma ação significativa de Reassentar.
                    </p>
                    {!c.face.anchor.shaken && (
                      <>
                        <TdvSelect
                          label="Forma de Ancorar"
                          value={anchorMode}
                          options={["Sustentar", "Redirecionar"]}
                          onChange={(v) => setAnchorMode(v as typeof anchorMode)}
                          disabled={disabled}
                        />
                        <TdvField
                          label="Consequência concreta"
                          value={consequence}
                          onChange={setConsequence}
                          disabled={disabled}
                        />
                      </>
                    )}
                    <TdvField
                      label={
                        c.face.anchor.shaken
                          ? "Ação significativa de Reassentar"
                          : "Como a consequência permanece na ficção"
                      }
                      value={outcome}
                      onChange={setOutcome}
                      disabled={disabled}
                    />
                    <Button
                      variant="outline"
                      disabled={disabled || !c.ready}
                      onClick={() =>
                        run(() =>
                          c.face.anchor.shaken
                            ? resettle(c, outcome)
                            : anchor(c, anchorMode, consequence, outcome),
                        )
                      }
                    >
                      {c.face.anchor.shaken
                        ? "Registrar Reassentamento"
                        : "Ancorar e abalar Âncora"}
                    </Button>
                  </div>
                </TdvDisclosure>
              </div>
            </Section>
            {personaExtra}
          </div>
          <Section id="tdv-vinculos" title="Vínculos">
            <div className="tdv-folios tdv-link-list">
              {c.face.links.map((link, index) => (
                <TdvDisclosure
                  key={link.id}
                  initiallyOpen={(!c.ready && index === 0) || newLinkId === link.id}
                  className="tdv-folio tdv-link-folio"
                >
                  <summary className="tdv-link-summary">
                    <strong>{link.node.trim() || `Vínculo ${index + 1}`}</strong>
                    <small>{link.nature.trim() || "Definir relação"}</small>
                    <span className="tdv-link-state" data-link-state={link.state}>
                      {link.state}
                    </span>
                    {(link.offer || link.demand) && (
                      <span className="tdv-link-exchange">
                        {link.offer && (
                          <span>
                            <b>Oferece</b>
                            {link.offer}
                          </span>
                        )}
                        {link.demand && (
                          <span>
                            <b>Cobra</b>
                            {link.demand}
                          </span>
                        )}
                      </span>
                    )}
                  </summary>
                  <div className="tdv-link-editor">
                    <div className="tdv-grid tdv-grid--identity">
                      {(
                        [
                          ["node", "Nó"],
                          ["nature", "Natureza"],
                          ["offer", "Oferta"],
                          ["demand", "Cobrança"],
                          ["tension", "Condição de tensão"],
                        ] as const
                      ).map(([key, label]) => (
                        <TdvField
                          key={key}
                          label={`${label} do vínculo ${index + 1}`}
                          value={link[key]}
                          onChange={(v) =>
                            upd("face", {
                              ...c.face,
                              links: c.face.links.map((l) =>
                                l.id === link.id ? { ...l, [key]: v } : l,
                              ),
                            })
                          }
                          disabled={disabled}
                          short={key === "node" || key === "nature"}
                        />
                      ))}
                      <TdvSelect
                        label={`Estado do vínculo ${index + 1}`}
                        value={link.state}
                        options={LINK_STATES}
                        onChange={(v) =>
                          upd("face", {
                            ...c.face,
                            links: c.face.links.map((l) =>
                              l.id === link.id ? { ...l, state: v as typeof link.state } : l,
                            ),
                          })
                        }
                        disabled={disabled}
                      />
                    </div>
                    <TdvLinkUse
                      character={c}
                      linkId={link.id}
                      onChange={onChange}
                      canEdit={canEdit}
                    />
                    <Button
                      variant="ghost"
                      disabled={disabled}
                      onClick={() =>
                        upd("face", {
                          ...c.face,
                          links: c.face.links.filter((l) => l.id !== link.id),
                        })
                      }
                    >
                      Remover vínculo {index + 1}
                    </Button>
                  </div>
                </TdvDisclosure>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={disabled || c.face.links.length >= 50}
              onClick={() => {
                const id = uid();
                setNewLinkId(id);
                upd("face", {
                  ...c.face,
                  links: [
                    ...c.face.links,
                    {
                      id,
                      node: "",
                      nature: "",
                      state: "Presente",
                      offer: "",
                      demand: "",
                      tension: "",
                    },
                  ],
                });
              }}
            >
              Novo vínculo
            </Button>
          </Section>
        </TabsContent>
        <TabsContent value="constituicao" data-sheet-content>
          <Section id="tdv-constituicao" title="Matrizes e Alinhavos">
            <div className="tdv-constitution-instruments">
              <div className="tadeon-attribute-radar">
                <AttributeRadar
                  title="Distribuição das Matrizes"
                  valueText={(value) =>
                    `${MATRIX_CATEGORIES[value].split(" · ")[0]} · d${DICE[value]}`
                  }
                  color="#a397bf"
                  tickColor="#e9e3d5"
                  data={MATRICES.map((attr) => ({ attr, value: stats.matrices[attr] }))}
                />
              </div>
              <div className="tdv-matrices">
                {MATRICES.map((matrix) => (
                  <TdvCompetency
                    key={matrix}
                    name={matrix}
                    grade={stats.matrices[matrix]}
                    matrix
                    shaken={c.scene.shaken.includes(matrix)}
                    creation={!c.ready}
                    disabled={disabled}
                    onRoll={() => setRollChoice({ matrix })}
                    onChange={(v) => {
                      const next = { ...c, matrices: { ...c.matrices, [matrix]: v } };
                      onChange({ ...next, resources: constitution(next).maximums });
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="tdv-alinhavos">
              {ALINHAVOS.map((name) => (
                <TdvCompetency
                  key={name}
                  name={name}
                  grade={stats.alinhavos[name] ?? 0}
                  creation={!c.ready}
                  disabled={disabled}
                  onChange={(v) => upd("alinhavos", { ...c.alinhavos, [name]: v })}
                  onRoll={() => setRollChoice({ alinhavo: name })}
                />
              ))}
            </div>
          </Section>
          <div className="tdv-state-layout">
            <Section id="tdv-recursos" title="Recursos e proteção">
              <div className="tdv-resources">
                {(["pv", "pi", "pe"] as const).map((key) => (
                  <div key={key} className="tdv-resource" data-resource={key}>
                    <small>
                      {{ pv: "Vitalidade · PV", pi: "Inteireza · PI", pe: "Esforço · PE" }[key]}
                    </small>
                    <TdvResourceActions
                      name={key.toUpperCase()}
                      value={c.resources[key]}
                      maximum={stats.maximums[key]}
                      disabled={disabled}
                      onChange={(v) => run(() => setResource(c, key, v))}
                    />
                  </div>
                ))}
              </div>
              <dl className="tdv-defense">
                {Object.entries(stats.defenses).map(([name, value]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <TdvGuard character={c} onChange={onChange} canEdit={canEdit} />
              <p>
                Guarda atual: <strong>{stats.guard ?? "sem proteção imediata"}</strong>
              </p>
              {c.resources.pi === 0 && (
                <p role="alert">
                  Colapso: registre Condição Crítica e transformação duradoura na Feição. Nenhum
                  diagnóstico ou perda arbitrária de autonomia é presumido.
                </p>
              )}
              {c.resources.pe === 0 && (
                <p className="tdv-note">
                  A 0 PE, ações ordinárias continuam possíveis; custos em PE precisam ser pagos.
                  Forçar a 0 PE é uma exceção por cena.
                </p>
              )}
              {(c.resources.pv === 0 || c.critical !== "Ativa") && (
                <div>
                  <p role="alert">
                    {c.critical}: 0 PV incapacita; uma nova consequência física relevante pode levar
                    a À Beira.
                  </p>
                  <TdvSelect
                    label="Estado crítico físico"
                    value={c.critical}
                    options={
                      c.resources.pv > 0
                        ? [c.critical, "À Beira", "Morta"]
                        : ["Incapacitada", "À Beira", "Morta"]
                    }
                    onChange={(v) => upd("critical", v as TdvCharacter["critical"])}
                    disabled={disabled}
                  />
                  <TdvField
                    label="Janela de estabilização e risco anunciado"
                    value={c.deathWindow}
                    onChange={(v) => upd("deathWindow", v)}
                    disabled={disabled}
                  />
                  <TdvField
                    label="Cuidado ou intervenção de estabilização"
                    value={careAction}
                    onChange={setCareAction}
                    disabled={disabled}
                  />
                  <Button
                    variant="outline"
                    disabled={disabled || c.critical === "Morta"}
                    onClick={() => run(() => stabilize(c, careAction))}
                  >
                    Registrar estabilização
                  </Button>
                  <p className="tdv-note">
                    A 0 PV, estabilizar conserva a incapacidade. Condições e marcas permanecem até
                    suas saídas próprias.
                  </p>
                </div>
              )}
            </Section>
            <Section id="tdv-equilibrio" title="Equilíbrio e Tensão">
              <div className="tdv-equilibrium">
                <div>
                  <small>Posição no Véu</small>
                  <strong>
                    {c.equilibrium > 0 ? "+" : ""}
                    {c.equilibrium}
                  </strong>
                </div>
                <p>{equilibriumBand(c.equilibrium)}</p>
              </div>
              <div className="tdv-equilibrium-axis" aria-hidden="true">
                <div className="tdv-equilibrium-axis__ticks">
                  {Array.from({ length: 21 }, (_, i) => (
                    <i key={i} data-center={i === 10} />
                  ))}
                </div>
                <span
                  className="tdv-equilibrium-axis__pin"
                  style={{ left: `${(c.equilibrium + 10) * 5}%` }}
                />
              </div>
              <div className="tdv-equilibrium-poles">
                <span>
                  Medo <small>−10</small>
                </span>
                <span>
                  Inteireza <small>0</small>
                </span>
                <span>
                  Conhecimento <small>+10</small>
                </span>
              </div>
              <input
                className="tdv-range"
                type="range"
                aria-label="Equilíbrio TdV II"
                min={-10}
                max={10}
                value={c.equilibrium}
                disabled={disabled}
                onChange={(e) => upd("equilibrium", Number(e.target.value))}
              />
              <p className="tdv-note">
                Nenhum bônus universal. A faixa contextualiza Feição, Lavores e Tramas.
              </p>
              <div className="tdv-tension-steps" aria-hidden="true">
                {[-3, -2, -1, 0, 1, 2, 3].map((value) => (
                  <span key={value} data-active={value === c.tension}>
                    {value > 0 ? "+" : ""}
                    {value}
                  </span>
                ))}
              </div>
              <div className="tdv-actions">
                <Button
                  variant="outline"
                  disabled={disabled}
                  onClick={() => run(() => addTension(c, -1))}
                >
                  Tensão −1
                </Button>
                <output aria-label="Tensão TdV II">
                  {c.tension > 0 ? "+" : ""}
                  {c.tension}
                </output>
                <Button
                  variant="outline"
                  disabled={disabled}
                  onClick={() => run(() => addTension(c, 1))}
                >
                  Tensão +1
                </Button>
              </div>
              <p className="tdv-note">
                Ao atingir ±4: desloca Equilíbrio em 1 e zera Tensão, sem carregar excedente.
              </p>
            </Section>
          </div>
        </TabsContent>
        <TabsContent value="acao" data-sheet-content>
          <Section id="tdv-motor" title="Motor de dois Fios">
            <TdvTestPanel character={c} onChange={onChange} canEdit={canEdit} quick />
            <TdvOutcome character={c} onChange={onChange} canEdit={canEdit} />
          </Section>
          <details className="tdv-disclosure tdv-scene-tools">
            <summary>Recuperação e efeitos de cena</summary>
            <Section id="tdv-cena" title="Continuidade da cena">
              <p>
                Matrizes Abaladas: {c.scene.shaken.join(", ") || "nenhuma"}. Forçar a 0 PE:{" "}
                {c.scene.forcedAtZero ? "já utilizado" : "disponível, mediante contrapartida"}.
              </p>
              <Button
                disabled={disabled}
                variant="outline"
                onClick={() =>
                  upd("scene", {
                    ...c.scene,
                    shaken: [],
                    forcedAtZero: false,
                    tests: [],
                    paidEvents: [],
                  })
                }
              >
                Encerrar cena e liberar efeitos de cena
              </Button>
              <p className="tdv-note">
                Encerrar cena não recupera recursos, não remove Condições e não Reassenta a Âncora.
              </p>
            </Section>
            <Section id="tdv-recuperacao" title="Recuperação">
              <TdvSelect
                label="Profundidade da recuperação"
                value={recovery}
                options={["Pausa breve", "Repouso profundo", "Recuperação plena"]}
                onChange={setRecovery}
                disabled={disabled}
              />
              <TdvField
                label="Nova janela real de recuperação"
                value={window}
                onChange={setWindow}
                disabled={disabled}
              />
              <TdvCheck
                label="Houve cuidado corporal adequado"
                value={care}
                onChange={setCare}
                disabled={disabled}
              />
              <TdvCheck
                label="Houve reconstrução real da continuidade para PI pleno"
                value={rebuilt}
                onChange={setRebuilt}
                disabled={disabled}
              />
              <Button
                disabled={disabled || !c.ready}
                onClick={() =>
                  run(() =>
                    recover(
                      c,
                      recovery as "Pausa breve" | "Repouso profundo" | "Recuperação plena",
                      care,
                      rebuilt,
                      window,
                    ),
                  )
                }
              >
                Aplicar recuperação
              </Button>
              <p className="tdv-note">
                Repetir o mesmo intervalo não multiplica recuperação. Pausa: PE +2, PI +1, PV +2 só
                com cuidado. Repouso: PE máximo, PI +3, PV +5 com cuidado ou +2 sem.
              </p>
            </Section>
          </details>
          <Section id="tdv-condicoes" title="Condições">
            {c.conditions.length === 0 && (
              <p className="tdv-condition-empty">Nenhuma condição ativa.</p>
            )}
            <div className="tdv-folios tdv-condition-list">
              {c.conditions.map((condition, index) => (
                <article
                  key={condition.id}
                  className="tdv-folio tdv-condition"
                  data-intensity={condition.intensity}
                >
                  <header>
                    <span className="tdv-condition__severity">
                      <i aria-hidden="true" />
                      {condition.intensity}
                    </span>
                    <h3>{condition.name || "Nova condição"}</h3>
                  </header>
                  <dl className="tdv-condition__reading">
                    <div>
                      <dt>Efeito</dt>
                      <dd>{condition.effect || "Efeito ainda não definido"}</dd>
                    </div>
                    <div>
                      <dt>Saída</dt>
                      <dd>{condition.exit || "Saída ainda não definida"}</dd>
                    </div>
                  </dl>
                  <TdvDisclosure initiallyOpen={!condition.name.trim()}>
                    <summary>Editar condição {index + 1}</summary>
                    <div className="tdv-grid">
                      {(["name", "origin", "effect", "exit"] as const).map((key, i) => (
                        <TdvField
                          key={key}
                          label={`${["Nome", "Origem", "Efeito", "Saída"][i]} da condição ${index + 1}`}
                          value={condition[key]}
                          disabled={disabled}
                          onChange={(v) =>
                            upd(
                              "conditions",
                              c.conditions.map((x) =>
                                x.id === condition.id ? { ...x, [key]: v } : x,
                              ),
                            )
                          }
                        />
                      ))}
                      <TdvChoices
                        label={`Intensidade da condição ${index + 1}`}
                        value={condition.intensity}
                        options={["Leve", "Grave", "Crítica"]}
                        disabled={disabled}
                        onChange={(v) =>
                          upd(
                            "conditions",
                            c.conditions.map((x) =>
                              x.id === condition.id
                                ? { ...x, intensity: v as typeof condition.intensity }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                  </TdvDisclosure>
                  <Button
                    variant="ghost"
                    disabled={disabled || !condition.exit.trim()}
                    onClick={() =>
                      upd(
                        "conditions",
                        c.conditions.filter((x) => x.id !== condition.id),
                      )
                    }
                  >
                    Registrar saída da condição {index + 1}
                  </Button>
                </article>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={disabled}
              onClick={() =>
                upd("conditions", [
                  ...c.conditions,
                  { id: uid(), name: "", origin: "", effect: "", exit: "", intensity: "Leve" },
                ])
              }
            >
              Nova condição
            </Button>
          </Section>
        </TabsContent>
        <TabsContent value="expressao" data-sheet-content>
          {belongings}
          <Section id="tdv-uso" title="Expressar e sustentar">
            <TdvExpressionUse character={c} onChange={onChange} canEdit={canEdit} />
          </Section>
          <Section id="tdv-expressao" title="Repertório e Permanência">
            <div className="tdv-actions">
              <TdvSelect
                label="Tipo de registro"
                value={recordKind}
                options={Object.keys(RECORD_FIELDS)}
                navigation
                onChange={(v) => setRecordKind(v as TdvRecord["kind"])}
              />
              <Button
                variant="outline"
                disabled={disabled || c.records.length >= 200}
                onClick={() =>
                  upd("records", [
                    ...c.records,
                    {
                      id: uid(),
                      kind: recordKind,
                      name: "",
                      fields: Object.fromEntries(RECORD_FIELDS[recordKind].map((k) => [k, ""])),
                    },
                  ])
                }
              >
                Adicionar registro
              </Button>
            </div>
            {c.records
              .filter((record) => record.kind === recordKind)
              .map((record, index) => (
                <TdvDisclosure key={record.id} initiallyOpen={!record.name}>
                  <summary>
                    {record.kind} · {record.name || `Registro ${index + 1}`}
                  </summary>
                  <TdvField
                    label={`Nome do registro ${index + 1}`}
                    value={record.name}
                    short
                    disabled={disabled}
                    onChange={(v) =>
                      upd(
                        "records",
                        c.records.map((x) => (x.id === record.id ? { ...x, name: v } : x)),
                      )
                    }
                  />
                  <div className="tdv-grid">
                    {[
                      ...new Set([...RECORD_FIELDS[record.kind], ...Object.keys(record.fields)]),
                    ].map((field) => (
                      <TdvField
                        key={field}
                        label={`${field} · registro ${index + 1}`}
                        value={record.fields[field] || ""}
                        disabled={disabled}
                        onChange={(v) =>
                          upd(
                            "records",
                            c.records.map((x) =>
                              x.id === record.id
                                ? { ...x, fields: { ...x.fields, [field]: v } }
                                : x,
                            ),
                          )
                        }
                      />
                    ))}
                  </div>
                  <TdvRecordActions
                    character={c}
                    record={record}
                    onChange={onChange}
                    canEdit={canEdit}
                  />
                  <Button
                    variant="ghost"
                    disabled={disabled}
                    onClick={() =>
                      upd(
                        "records",
                        c.records.filter((x) => x.id !== record.id),
                      )
                    }
                  >
                    Remover registro {index + 1}
                  </Button>
                </TdvDisclosure>
              ))}
            <p className="tdv-note">
              Registrar conteúdo não compra Lavor nem autoriza efeito extraordinário: aquisição fica
              no histórico de PU; custos em PE e condições são os escritos no próprio conteúdo.
            </p>
          </Section>
        </TabsContent>
        <TabsContent value="percurso" data-sheet-content>
          <Section id="tdv-desenvolvimento" title="Desenvolvimento e Ponto de Urdume">
            <TdvDevelopment percent={stats.development} available={stats.pu} spent={stats.spent} />
            {isMaster && (
              <details className="tdv-disclosure">
                <summary>Reconhecer um Marco</summary>
                <div className="tdv-grid">
                  <TdvField label="Acontecimento do Marco" value={event} onChange={setEvent} />
                  <TdvField
                    label="Mudança incorporada"
                    value={incorporation}
                    onChange={setIncorporation}
                  />
                </div>
                <Button
                  disabled={disabled || !c.ready || c.milestones.length >= 20}
                  onClick={() => run(() => addMilestone(c, event, incorporation))}
                >
                  Conceder Marco · +5% e 2 PU
                </Button>
              </details>
            )}
            <details className="tdv-disclosure">
              <summary>Investir PU com incorporação</summary>
              <div className="tdv-grid">
                <TdvSelect
                  label="Tipo de investimento"
                  value={kind}
                  options={["Matriz", "Alinhavo", "Lavor", "Ampliação"]}
                  onChange={(v) => {
                    setKind(v);
                    setTarget(v === "Matriz" ? MATRICES[0] : v === "Alinhavo" ? ALINHAVOS[0] : "");
                  }}
                  disabled={disabled}
                />
                {kind === "Matriz" || kind === "Alinhavo" ? (
                  <TdvSelect
                    label="Capacidade a desenvolver"
                    value={target}
                    options={kind === "Matriz" ? MATRICES : ALINHAVOS}
                    onChange={setTarget}
                    disabled={disabled}
                  />
                ) : (
                  <TdvField
                    label="Estrutura que recebe a mudança"
                    value={target}
                    onChange={setTarget}
                    disabled={disabled}
                    short
                  />
                )}
                {(kind === "Lavor" || kind === "Ampliação") && (
                  <TdvSelect
                    label="Custo em PU"
                    value={String(cost)}
                    options={kind === "Lavor" ? ["4", "6"] : ["3", "4", "5", "6", "7"]}
                    onChange={(v) => setCost(Number(v))}
                    disabled={disabled}
                  />
                )}
                <TdvField
                  label="Onde isto passou a existir na história?"
                  value={reason}
                  onChange={setReason}
                  disabled={disabled}
                />
              </div>
              <TdvCheck
                label="Marco transcendente e incorporação irreversível expressamente reconhecidos"
                value={transcendent}
                onChange={setTranscendent}
                disabled={disabled}
              />
              <div className="tdv-investment-preview" role="status">
                <strong>
                  {investmentAtLimit
                    ? "Escala concluída"
                    : investmentGrade !== undefined
                      ? `d${DICE[investmentGrade]} → d${DICE[investmentGrade + 1]}`
                      : target || "Escolha uma incorporação"}
                </strong>
                <span>
                  {investmentAtLimit ? (
                    "Não há avanço ordinário seguinte"
                  ) : (
                    <>
                      {investmentCost} PU ·{" "}
                      {stats.pu >= investmentCost
                        ? `${stats.pu - investmentCost} PU após investir`
                        : `faltam ${investmentCost - stats.pu} PU`}
                    </>
                  )}
                </span>
              </div>
              <Button
                disabled={
                  disabled ||
                  !c.ready ||
                  investmentAtLimit ||
                  stats.pu < investmentCost ||
                  !reason.trim() ||
                  !target.trim()
                }
                onClick={() =>
                  run(() =>
                    invest(c, {
                      kind: kind as TdvCharacter["investments"][number]["kind"],
                      target,
                      reason,
                      transcendent,
                      cost:
                        kind === "Matriz"
                          ? stats.matrices[target as Matrix] + 3
                          : kind === "Alinhavo"
                            ? 2
                            : cost,
                    }),
                  )
                }
              >
                Registrar investimento
              </Button>
            </details>
            <details className="tdv-disclosure">
              <summary>Trajetória incorporada</summary>
              {c.milestones.map((m, i) => (
                <p key={m.id}>
                  {(i + 1) * 5}% · {m.event} · {m.incorporation}
                </p>
              ))}
              {c.investments.map((i) => (
                <p key={i.id}>
                  {i.target} · {i.cost} PU · {i.reason}
                </p>
              ))}
            </details>
          </Section>
          {narrative}
          <Section id="tdv-historia" title="História e memória">
            {!narrative && (
              <TdvField
                label="História da personagem"
                value={c.history}
                onChange={(v) => upd("history", v)}
                disabled={disabled}
              />
            )}
            <TdvDisclosure initiallyOpen={Boolean(c.notes.trim())}>
              <summary>Anotações opcionais</summary>
              <TdvField
                label="Anotações e Restos"
                value={c.notes}
                onChange={(v) => upd("notes", v)}
                disabled={disabled}
              />
            </TdvDisclosure>
          </Section>
        </TabsContent>
      </Tabs>
      <Dialog
        open={rollChoice !== null}
        onOpenChange={(open) => {
          if (!open) setRollChoice(null);
        }}
      >
        <DialogContent className="tdv-roll-dialog">
          <DialogHeader>
            <DialogTitle>Dois Fios · {rollChoice?.alinhavo ?? rollChoice?.matrix}</DialogTitle>
            <DialogDescription>
              Escolha a Matriz pela abordagem e o Alinhavo pela prática. A ficha calcula os dados e
              aplica apenas os efeitos mecânicos.
            </DialogDescription>
          </DialogHeader>
          {rollChoice && (
            <TdvTestPanel
              key={`${rollChoice.matrix}/${rollChoice.alinhavo}`}
              character={c}
              onChange={onChange}
              canEdit={canEdit}
              quick
              initialMatrix={rollChoice.matrix}
              initialAlinhavo={rollChoice.alinhavo}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
