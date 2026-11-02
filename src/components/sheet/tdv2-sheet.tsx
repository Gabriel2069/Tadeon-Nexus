import { TdvAnchorSeal } from "./tdv2-visual-instruments";
import { LayoutPanelLeft, UserRound, Activity, Layers3, Sprout } from "lucide-react";
import { TdvCreationLoom, TdvFamiliarities } from "./tdv2-creation-loom";
import { TdvPlayPresence } from "./tdv2-play-presence";
import { TdvCompetency, TdvDevelopment, MATRIX_CATEGORIES } from "./tdv2-competencies";
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
  TdvActiveExpressions,
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
  constitution,
  conditionImpact,
  capabilityConditions,
  invest,
  recover,
  uid,
  type Matrix,
  type TdvCharacter,
  type TdvRecord,
} from "@/lib/tdv2";
import { toast } from "sonner";

export { TdvDisclosure, TdvField, TdvSelect, TdvNumber, TdvCheck } from "./tdv2-fields";
export function Tdv2Sheet({
  name = "Personagem",
  presentation = "edit",
  character: incoming,
  onChange,
  canEdit,
  isMaster,
  personaExtra,
  belongings,
  narrative,
  preferenceKey,
}: {
  name?: string;
  presentation?: "edit" | "game";
  character: TdvCharacter;
  onChange: (value: TdvCharacter) => void;
  canEdit: boolean;
  isMaster: boolean;
  personaExtra?: ReactNode;
  belongings?: ReactNode;
  narrative?: ReactNode;
  preferenceKey?: string;
}) {
  const c =
    incoming.ready || incoming.creation
      ? incoming
      : { ...incoming, creation: { groupReason: "", familiarities: [], reviewed: false } };
  const [tab, setTab] = useState(c.ready ? "constituicao" : "pessoa"),
    [event, setEvent] = useState(""),
    [incorporation, setIncorporation] = useState(""),
    [reason, setReason] = useState(""),
    [kind, setKind] = useState("Matriz"),
    [target, setTarget] = useState<string>(MATRICES[0]),
    [cost, setCost] = useState(4),
    [transcendent, setTranscendent] = useState(false),
    [recordKind, setRecordKind] = useState<TdvRecord["kind"]>("Lavor");
  const [developmentOpen, setDevelopmentOpen] = useState(false),
    [expressionUse, setExpressionUse] = useState<string | null>(null),
    [skillSearch, setSkillSearch] = useState(""),
    [showAllGameSkills, setShowAllGameSkills] = useState(false);
  const [gameProfile, setGameProfile] = useState<"digital" | "hibrido" | "fisico">(() => {
    if (!preferenceKey || typeof sessionStorage === "undefined") return "digital";
    try {
      const value = sessionStorage.getItem(`tdv-play-profile:${preferenceKey}`);
      return value === "hibrido" || value === "fisico" ? value : "digital";
    } catch {
      return "digital";
    }
  });
  const [gameTab, setGameTab] = useState(
    gameProfile === "hibrido" ? "expressao" : gameProfile === "fisico" ? "acao" : "constituicao",
  );
  const selectProfile = (value: "digital" | "hibrido" | "fisico") => {
    setGameProfile(value);
    if (preferenceKey)
      try {
        sessionStorage.setItem(`tdv-play-profile:${preferenceKey}`, value);
      } catch {
        /* optional preference */
      }
    setGameTab(value === "hibrido" ? "expressao" : value === "fisico" ? "acao" : "constituicao");
  };
  const develop = (name: string, matrix: boolean) => {
    setKind(matrix ? "Matriz" : "Alinhavo");
    setTarget(name);
    setReason("");
    setTranscendent(false);
    setDevelopmentOpen(true);
  };
  const impacts = (name: string) =>
    capabilityConditions(c, name).map((item) => ({
      name: item.name || "Condição ativa",
      kind: conditionImpact(item.effect)!.kind,
    }));
  const [rollChoice, setRollChoice] = useState<{ matrix?: Matrix; alinhavo?: string } | null>(null);
  const [newLinkId, setNewLinkId] = useState<string | null>(null);
  const [recovery, setRecovery] = useState("Pausa breve"),
    [care, setCare] = useState(false),
    [rebuilt, setRebuilt] = useState(false),
    [window, setWindow] = useState("");
  const [openLinks, setOpenLinks] = useState<Record<string, boolean>>({});
  const [anchorMode, setAnchorMode] = useState<"Sustentar" | "Redirecionar">("Sustentar");
  const [consequence, setConsequence] = useState(""),
    [outcome, setOutcome] = useState(""),
    [careAction, setCareAction] = useState("");
  const stats = constitution(c),
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
  const activeTab = presentation === "game" ? gameTab : tab;
  return (
    <div
      className="tadeon-tdv2-sheet"
      data-folio={activeTab}
      data-presentation={presentation}
      data-game-profile={gameProfile}
    >
      <div className="tdv-presentation-layout">
        {presentation === "game" && (
          <div className="tdv-game-profiles" aria-label="Combinação de jogo">
            {(
              [
                ["digital", "Digital"],
                ["hibrido", "Híbrido"],
                ["fisico", "Apoio físico"],
              ] as const
            ).map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={gameProfile === value}
                onClick={() => selectProfile(value)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <TdvPlayPresence
          name={name}
          character={c}
          onChange={onChange}
          canEdit={canEdit}
          physical={presentation === "game" && gameProfile === "fisico"}
          onInspectState={() => (presentation === "game" ? setGameTab : setTab)("acao")}
        />
        {!c.ready && (
          <TdvCreationLoom
            character={c}
            onChange={onChange}
            canEdit={canEdit}
            onSelect={presentation === "game" ? setGameTab : setTab}
          />
        )}
        <Tabs
          className="tdv-sheet-tabs"
          value={activeTab}
          onValueChange={presentation === "game" ? setGameTab : setTab}
        >
          <TabsList
            className="tdv-tabs tdv-tabs--sheet"
            aria-label={
              presentation === "game" ? "Instrumentos de jogo" : "Fólios da Ficha Integral"
            }
          >
            {(
              [
                ["constituicao", "Constituição", "Ficha", LayoutPanelLeft],
                ["pessoa", "Pessoa", "Pessoa", UserRound],
                ["acao", "Ação", "Cena", Activity],
                ["expressao", "Expressão", "Repertório", Layers3],
                ["percurso", "Percurso", "Percurso", Sprout],
              ] as const
            ).map(([value, label, compact, Icon]) => (
              <TabsTrigger key={value} value={value} aria-label={label} title={label}>
                <Icon aria-hidden="true" />
                <span>{compact}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="pessoa" data-sheet-content>
            <div className="tdv-persona-layout">
              <div className="tdv-persona-dossier">
                <Section variant="folio" id="tdv-feicao" title="Feição">
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
              <Section variant="folio" id="tdv-ancora" title="Âncora">
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
                    <div className="tdv-anchor-rose">
                      <TdvAnchorSeal shaken={c.face.anchor.shaken} pillar={c.face.anchor.pillar} />
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
                    </div>
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
            <Section variant="folio" id="tdv-vinculos" title="Vínculos">
              <div className="tdv-folios tdv-link-list">
                {c.face.links.map((link, index) => (
                  <TdvDisclosure
                    key={link.id}
                    initiallyOpen={newLinkId === link.id}
                    open={openLinks[link.id] ?? newLinkId === link.id}
                    onOpenChange={(open) =>
                      setOpenLinks((previous) =>
                        previous[link.id] === open ? previous : { ...previous, [link.id]: open },
                      )
                    }
                    className="tdv-folio tdv-link-folio"
                  >
                    <summary className="tdv-link-summary">
                      <strong>{link.node.trim() || `Vínculo ${index + 1}`}</strong>
                      <small>{link.nature.trim() || "Definir relação"}</small>
                      <span className="tdv-link-state" data-link-state={link.state}>
                        {link.state}
                      </span>
                      {openLinks[link.id] && (link.offer || link.demand) && (
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
            {c.creation && (
              <Section
                variant="folio"
                id="tdv-grupo"
                title="Laço com a primeira situação"
                emblem="vinculos"
              >
                <TdvInscription
                  label="Razão para entrar na primeira situação"
                  value={c.creation.groupReason}
                  onChange={(v) => onChange({ ...c, creation: { ...c.creation!, groupReason: v } })}
                  disabled={disabled}
                />
              </Section>
            )}
          </TabsContent>
          <TabsContent value="constituicao" data-sheet-content>
            <Section variant="folio" id="tdv-constituicao" title="Matrizes e Alinhavos">
              <div className="tdv-constitution-instruments">
                <details className="tdv-radar-view">
                  <summary>Ver distribuição</summary>
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
                </details>
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
                      onDevelop={() => develop(matrix, true)}
                      effects={impacts(matrix)}
                      onChange={(v) => {
                        const next = { ...c, matrices: { ...c.matrices, [matrix]: v } };
                        onChange({ ...next, resources: constitution(next).maximums });
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="tdv-alinhavos-heading">
                <h3>O que os gestos sabem</h3>
                <div className="tdv-capability-filters">
                  {presentation === "game" && c.ready && (
                    <button
                      type="button"
                      aria-pressed={showAllGameSkills}
                      onClick={() => setShowAllGameSkills((value) => !value)}
                    >
                      {showAllGameSkills ? "Só praticados" : "Todos os 21"}
                    </button>
                  )}
                  <label>
                    <span className="sr-only">Buscar Alinhavo</span>
                    <input
                      data-view-control=""
                      type="search"
                      aria-label="Buscar Alinhavo"
                      placeholder="Encontrar gesto…"
                      value={skillSearch}
                      onChange={(event) => setSkillSearch(event.target.value)}
                    />
                  </label>
                </div>
              </div>
              <div className="tdv-alinhavos">
                {ALINHAVOS.filter(
                  (name) =>
                    (presentation !== "game" ||
                      !c.ready ||
                      showAllGameSkills ||
                      skillSearch ||
                      (stats.alinhavos[name] ?? 0) > 0) &&
                    name
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .includes(
                        skillSearch
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase(),
                      ),
                ).map((name) => (
                  <TdvCompetency
                    key={name}
                    name={name}
                    grade={stats.alinhavos[name] ?? 0}
                    creation={!c.ready}
                    disabled={disabled}
                    onChange={(v) =>
                      onChange({
                        ...c,
                        alinhavos: { ...c.alinhavos, [name]: v },
                        ...(c.creation && v > 0
                          ? {
                              creation: {
                                ...c.creation,
                                familiarities: c.creation.familiarities.filter(
                                  (value) => value !== name,
                                ),
                              },
                            }
                          : {}),
                      })
                    }
                    onRoll={() => setRollChoice({ alinhavo: name })}
                    onDevelop={() => develop(name, false)}
                    effects={impacts(name)}
                  />
                ))}
              </div>
              {skillSearch && (
                <Button variant="ghost" onClick={() => setSkillSearch("")}>
                  Limpar busca
                </Button>
              )}
              <TdvFamiliarities character={c} onChange={onChange} canEdit={canEdit} />
            </Section>
          </TabsContent>
          <TabsContent value="acao" data-sheet-content>
            <Section variant="folio" id="tdv-protecao" title="Proteção e limites">
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
            <details id="tdv-motor" className="tdv-disclosure tdv-optional-tools">
              <summary>Resolver consequência ou consultar dados</summary>
              <TdvOutcome character={c} onChange={onChange} canEdit={canEdit} />
              <Button variant="ghost" onClick={() => setRollChoice({ matrix: "Nexo" })}>
                Abrir dados opcionais
              </Button>
            </details>
            <details className="tdv-disclosure tdv-scene-tools">
              <summary>Recuperação e efeitos de cena</summary>
              <Section variant="folio" id="tdv-cena" title="Continuidade da cena">
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
                  Encerrar cena não recupera recursos, não remove Condições e não Reassenta a
                  Âncora.
                </p>
              </Section>
              <Section variant="folio" id="tdv-recuperacao" title="Recuperação">
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
                  Repetir o mesmo intervalo não multiplica recuperação. Pausa: PE +2, PI +1, PV +2
                  só com cuidado. Repouso: PE máximo, PI +3, PV +5 com cuidado ou +2 sem.
                </p>
              </Section>
            </details>
          </TabsContent>
          <TabsContent value="expressao" data-sheet-content>
            {presentation !== "game" && belongings}
            <TdvActiveExpressions character={c} onChange={onChange} canEdit={canEdit} />
            <Section variant="folio" id="tdv-expressao" title="Repertório e Permanência">
              <div className="tdv-actions">
                <Button
                  id="tdv-uso"
                  variant="ghost"
                  disabled={!c.ready}
                  onClick={() => setExpressionUse("")}
                >
                  Expressar / Costurar
                </Button>
                <TdvSelect
                  label="Mostrar repertório"
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
              <div className="tdv-repertoire-grid">
                {c.records
                  .filter((record) => record.kind === recordKind)
                  .map((record, index) => (
                    <TdvDisclosure
                      key={record.id}
                      initiallyOpen={!record.name}
                      className={`tdv-repertoire-card tdv-repertoire-card--${record.kind.toLowerCase()}`}
                    >
                      <summary className="tdv-record-summary">
                        <span className="tdv-record-summary__title">
                          <span>
                            <small>{record.kind}</small>
                            <strong>{record.name || `Registro ${index + 1}`}</strong>
                          </span>
                        </span>
                        {["Lavor", "Trama", "Fragmento", "Selo"].includes(record.kind) && (
                          <button
                            type="button"
                            className="tdv-expression-quick"
                            disabled={disabled || !c.ready}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setExpressionUse(record.id);
                            }}
                          >
                            Usar {record.name || record.kind} ↗
                          </button>
                        )}
                        {Object.entries(record.fields)
                          .filter(([, value]) => value.trim())
                          .slice(0, record.kind === "Lavor" ? 5 : 3)
                          .map(([key, value]) => (
                            <span className="tdv-record-summary__fact" key={key}>
                              <b>{key}</b>
                              {value}
                            </span>
                          ))}
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
                          ...new Set([
                            ...RECORD_FIELDS[record.kind],
                            ...Object.keys(record.fields),
                          ]),
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
              </div>
              <p className="tdv-note">
                Registrar conteúdo não compra Lavor nem autoriza efeito extraordinário: aquisição
                fica no histórico de PU; custos em PE e condições são os escritos no próprio
                conteúdo.
              </p>
            </Section>
            {presentation === "game" && (
              <TdvDisclosure initiallyOpen={false}>
                <summary>Equipamento e inventário</summary>
                {belongings}
              </TdvDisclosure>
            )}
          </TabsContent>
          <TabsContent value="percurso" data-sheet-content>
            <Section
              variant="folio"
              id="tdv-desenvolvimento"
              title="Desenvolvimento e Ponto de Urdume"
            >
              <TdvDevelopment
                percent={stats.development}
                available={stats.pu}
                spent={stats.spent}
              />
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
              <div className="tdv-development-actions">
                {(
                  [
                    ["Matriz", "Aprofundar uma Matriz", "Categoria atual + 3 PU"],
                    ["Alinhavo", "Praticar um Alinhavo", "2 PU por grau"],
                    ["Lavor", "Incorporar um Lavor", "4 ou 6 PU"],
                    ["Ampliação", "Ampliar uma estrutura", "3 a 7 PU"],
                  ] as const
                ).map(([value, label, price]) => (
                  <button
                    type="button"
                    key={value}
                    disabled={disabled || !c.ready}
                    onClick={() => {
                      setKind(value);
                      setTarget(
                        value === "Matriz" ? MATRICES[0] : value === "Alinhavo" ? ALINHAVOS[0] : "",
                      );
                      setReason("");
                      setTranscendent(false);
                      setDevelopmentOpen(true);
                    }}
                  >
                    <span>{label}</span>
                    <small>{price}</small>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
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
            <Section variant="folio" id="tdv-historia" title="História e memória">
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
        <Dialog open={developmentOpen} onOpenChange={setDevelopmentOpen}>
          <DialogContent className="tdv-development-dialog">
            <DialogHeader>
              <DialogTitle>Dar corpo à experiência</DialogTitle>
              <DialogDescription>
                Escolha uma mudança; confira o custo e o saldo antes de investir.
              </DialogDescription>
            </DialogHeader>
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
                label="Como esta mudança foi incorporada?"
                value={reason}
                onChange={setReason}
                disabled={disabled}
              />
            </div>
            {kind === "Matriz" && investmentGrade === 4 && (
              <TdvCheck
                label="Marco transcendente e incorporação irreversível expressamente reconhecidos"
                value={transcendent}
                onChange={setTranscendent}
                disabled={disabled}
              />
            )}
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
                run(() => {
                  const next = invest(c, {
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
                  });
                  setDevelopmentOpen(false);
                  setReason("");
                  return next;
                })
              }
            >
              Confirmar mudança
            </Button>
          </DialogContent>
        </Dialog>
        <Dialog
          open={expressionUse !== null}
          onOpenChange={(open) => {
            if (!open) setExpressionUse(null);
          }}
        >
          <DialogContent className="tdv-expression-dialog">
            <DialogHeader>
              <DialogTitle>
                {c.records.find((record) => record.id === expressionUse)?.name ||
                  "Compor uma expressão"}
              </DialogTitle>
              <DialogDescription>Intenção, prática e preço no mesmo gesto.</DialogDescription>
            </DialogHeader>
            {expressionUse !== null && (
              <TdvExpressionUse
                key={expressionUse}
                character={c}
                onChange={(value) => {
                  onChange(value);
                  setExpressionUse(null);
                }}
                canEdit={canEdit}
                initialRecordId={expressionUse || undefined}
              />
            )}
          </DialogContent>
        </Dialog>
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
                Escolha a Matriz pela abordagem e o Alinhavo pela prática. A ficha calcula os dados
                e aplica apenas os efeitos mecânicos.
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
    </div>
  );
}
