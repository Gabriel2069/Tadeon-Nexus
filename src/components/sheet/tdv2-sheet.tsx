import { TdvSurfaceContext } from "./tdv2-surface-context";
import { TdvGamePanel } from "./tdv2-game-panel";
import { TdvProtection } from "./tdv2-protection";
import { TdvRecordCollection } from "./tdv2-retained-tools";
import { TdvAnchorSeal } from "./tdv2-visual-instruments";
import { LayoutPanelLeft, UserRound, Layers3, Sprout } from "lucide-react";
import { TdvCreationLoom, TdvFamiliarities } from "./tdv2-creation-loom";
import { TdvPlayPresence } from "./tdv2-play-presence";
import { TdvCompetency, TdvDevelopment, MATRIX_CATEGORIES } from "./tdv2-competencies";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AttributeRadar from "./attribute-radar";
import { useState, type ReactNode, type CSSProperties } from "react";
import {
  TdvAction,
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
  anchor,
  resettle,
  stabilize,
  grantMilestone,
  advanceCapability,
  reverseCapability,
  reverseProgression,
  allocateCreation,
  creationErrors,
  constitution,
  withResourceConditions,
  capabilityEffects,
  addCapabilityEffect,
  endCharacterScene,
  conditionImpact,
  capabilityConditions,
  invest,
  recover,
  uid,
  type Matrix,
  type TdvCharacter,
} from "@/lib/tdv2";
import { toast } from "sonner";

const correctionText = (payload: string) => {
  try {
    const record = JSON.parse(payload) as { target?: string; event?: string };
    return record.target || record.event || "Registro preservado";
  } catch {
    return "Registro preservado";
  }
};
export { TdvDisclosure, TdvField, TdvSelect, TdvNumber, TdvCheck } from "./tdv2-fields";
export function Tdv2Sheet({
  name = "Personagem",
  presentation = "edit",
  character: incoming,
  onChange: onPersist,
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
  const [initialDraft, setInitialDraft] = useState<TdvCharacter | null>(null);
  const source = withResourceConditions(initialDraft ?? incoming);
  const c =
    source.ready || source.creation
      ? source
      : { ...source, creation: { groupReason: "", familiarities: [], reviewed: false } };
  const onChange = (value: TdvCharacter) => {
    const next = withResourceConditions(value);
    if (initialDraft) setInitialDraft(next);
    else onPersist(next);
  };
  const [tab, setTab] = useState(c.ready ? "constituicao" : "pessoa"),
    [reason, setReason] = useState(""),
    [kind, setKind] = useState("Matriz"),
    [target, setTarget] = useState<string>(MATRICES[0]),
    [cost, setCost] = useState(4),
    [transcendent, setTranscendent] = useState(false);
  const [markEditing, setMarkEditing] = useState(false);
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
  const [gameToolsOpen, setGameToolsOpen] = useState(false);
  const [gameTab, setGameTab] = useState(
    gameProfile === "hibrido"
      ? "expressao"
      : gameProfile === "fisico"
        ? "constituicao"
        : "constituicao",
  );
  const selectProfile = (value: "digital" | "hibrido" | "fisico") => {
    setGameProfile(value);
    if (preferenceKey)
      try {
        sessionStorage.setItem(`tdv-play-profile:${preferenceKey}`, value);
      } catch {
        /* optional preference */
      }
    setGameTab(
      value === "hibrido" ? "expressao" : value === "fisico" ? "constituicao" : "constituicao",
    );
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
    disabled = !canEdit || Boolean(initialDraft);
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
  const FaceField = TdvInscription;
  const initialUnlocked = !c.ready || (isMaster && Boolean(initialDraft));
  const mayGrantMilestone = isMaster || Boolean(c.progression?.allowMilestones);
  const allocationPossible = (name: string, grade: number, matrix: boolean) => {
    try {
      allocateCreation(c, name, grade, matrix);
      return true;
    } catch {
      return false;
    }
  };
  const matrixAllocation = `${6 - Object.values(c.matrices).reduce((sum, value) => sum + value - 1, 0)} avanços restantes · duas d10 e duas d8`;
  const skillAllocation = `${2 - Object.values(c.alinhavos).filter((n) => n === 2).length} escolhas d8 · ${4 - Object.values(c.alinhavos).filter((n) => n === 1).length} escolhas d6`;
  const conditionSeverity = c.conditions.some((item) => item.intensity === "Crítica")
    ? "Crítica"
    : c.conditions.some((item) => item.intensity === "Grave")
      ? "Grave"
      : c.conditions.length
        ? "Leve"
        : "Nenhuma";
  const face = (key: "origin" | "occupation" | "conviction" | "limit", value: string) =>
    upd("face", { ...c.face, [key]: value });
  const activeTab = presentation === "game" ? gameTab : tab;
  const sheetContents = (
    <Tabs
      className="tdv-sheet-tabs"
      value={activeTab}
      onValueChange={presentation === "game" ? setGameTab : setTab}
    >
      <TabsList
        className="tdv-tabs tdv-tabs--sheet"
        aria-label={presentation === "game" ? "Instrumentos de jogo" : "Fólios da Ficha Integral"}
      >
        {(
          [
            ["pessoa", "Feição", "Feição", UserRound],
            ["constituicao", "Ação", "Ação", LayoutPanelLeft],
            ["expressao", "Expressão", "Expressão", Layers3],
            ["percurso", "Transformação", "Transformação", Sprout],
          ] as const
        ).map(([value, label, compact, Icon]) => (
          <TabsTrigger
            key={value}
            value={value}
            aria-label={label}
            title={label}
            disabled={Boolean(initialDraft) && !["pessoa", "constituicao"].includes(value)}
          >
            <Icon aria-hidden="true" />
            <span>{compact}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="pessoa" data-sheet-content>
        <div className="tdv-persona-layout">
          <div className="tdv-persona-dossier">
            <Section variant="folio" id="tdv-feicao" title="Pessoa">
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
              <div className="tdv-mark-reading">
                <h3>Marca</h3>
                {markEditing || Object.values(c.face.mark).some((value) => value.trim()) ? (
                  <div className="tdv-grid tdv-grid--identity">
                    {(
                      [
                        ["trigger", "Gatilho"],
                        ["manifestation", "Manifestação"],
                        ["residue", "Resíduo"],
                      ] as const
                    ).map(([key, label]) => (
                      <TdvInscription
                        key={key}
                        label={label}
                        value={c.face.mark[key]}
                        disabled={disabled}
                        onChange={(value) =>
                          upd("face", { ...c.face, mark: { ...c.face.mark, [key]: value } })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p>Não manifestada</p>
                )}
                {canEdit && !Object.values(c.face.mark).some((value) => value.trim()) && (
                  <Button
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => setMarkEditing((value) => !value)}
                  >
                    {markEditing ? "Fechar edição" : "Definir Marca"}
                  </Button>
                )}
              </div>
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
              <div className="tdv-anchor-foundation" data-locked={!initialUnlocked}>
                <div className={initialUnlocked ? "tdv-anchor-rose" : "tdv-anchor-portrait"}>
                  <TdvAnchorSeal shaken={c.face.anchor.shaken} pillar={c.face.anchor.pillar} />
                  {initialUnlocked && (
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
                      disabled={!canEdit}
                    />
                  )}
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
              <TdvAction title={c.face.anchor.shaken ? "Reassentar" : "Ancorar"}>
                <div className="tdv-anchor-operation__body">
                  <p className="tdv-note">
                    Ancorar sustenta ou redireciona uma consequência plausível; não a apaga. Depois,
                    a Âncora fica Abalada até uma ação significativa de Reassentar.
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
                    {c.face.anchor.shaken ? "Registrar Reassentamento" : "Ancorar e abalar Âncora"}
                  </Button>
                </div>
              </TdvAction>
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
                  <span className="tdv-link-emblem" aria-hidden="true">
                    <svg viewBox="0 0 48 48">
                      <circle cx="11" cy="24" r="5" />
                      <circle cx="37" cy="24" r="5" />
                      <path
                        d={
                          link.state === "Rompido"
                            ? "M16 24h5m6 0h5"
                            : "M16 24c7-15 9 15 16 0M16 24c7 15 9-15 16 0"
                        }
                      />
                    </svg>
                  </span>
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
                      <TdvInscription
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
          <Section variant="folio" id="tdv-grupo" title="Implicação" emblem="vinculos">
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
          {initialUnlocked && (
            <p className="tdv-allocation-status" role="status">
              Matrizes · {matrixAllocation}
              <br />
              Alinhavos · {skillAllocation}
            </p>
          )}
          <div className="tdv-constitution-instruments">
            <div className="tdv-radar-view">
              <div className="tadeon-attribute-radar">
                <AttributeRadar
                  title="Distribuição das Matrizes"
                  valueText={(value) =>
                    `${MATRIX_CATEGORIES[value].split(" · ")[0]} · d${DICE[value]}`
                  }
                  color="#a397bf"
                  tickColor="#e9e3d5"
                  data={MATRICES.map((attr, index) => ({
                    attr,
                    value: stats.matrices[attr],
                    color: ["#d28f84", "#89bec5", "#b29ed3", "#b1be8d"][index],
                  }))}
                />
              </div>
            </div>
            <div className="tdv-matrices">
              {MATRICES.map((matrix) => (
                <TdvCompetency
                  key={matrix}
                  name={matrix}
                  grade={stats.matrices[matrix]}
                  matrix
                  temporaryEffects={capabilityEffects(c, matrix)}
                  onAddEffect={(kind, value, note) =>
                    run(() => addCapabilityEffect(c, matrix, kind, value, note))
                  }
                  onRemoveEffect={(id) =>
                    upd(
                      "temporaryEffects",
                      (c.temporaryEffects ?? []).filter((e) => e.id !== id),
                    )
                  }
                  onAdvance={() =>
                    run(() =>
                      initialDraft
                        ? allocateCreation(c, matrix, c.matrices[matrix] + 1, true)
                        : advanceCapability(c, matrix, true),
                    )
                  }
                  onReverse={() =>
                    run(() =>
                      initialDraft
                        ? allocateCreation(c, matrix, c.matrices[matrix] - 1, true)
                        : reverseCapability(c, matrix, true),
                    )
                  }
                  canReverse={
                    isMaster &&
                    (c.ready && !initialDraft
                      ? c.investments.some((i) => i.target === matrix && i.kind === "Matriz")
                      : c.matrices[matrix] > 1)
                  }
                  advanceCost={stats.matrices[matrix] + 3}
                  availablePU={stats.pu}
                  shaken={c.scene.shaken.includes(matrix)}
                  creation={initialUnlocked}
                  disabled={!canEdit}
                  onRoll={() => setRollChoice({ matrix })}
                  onDevelop={() => develop(matrix, true)}
                  effects={impacts(matrix)}
                  allocationHint={matrixAllocation}
                  choiceAllowed={(grade) => allocationPossible(matrix, grade, true)}
                  onChange={(grade) => run(() => allocateCreation(c, matrix, grade, true))}
                />
              ))}
            </div>
          </div>
          <div className="tdv-alinhavos-heading">
            <h3>Alinhavos</h3>
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
                familiar={c.creation?.familiarities.includes(name)}
                temporaryEffects={capabilityEffects(c, name)}
                onAddEffect={(kind, value, note) =>
                  run(() => addCapabilityEffect(c, name, kind, value, note))
                }
                onRemoveEffect={(id) =>
                  upd(
                    "temporaryEffects",
                    (c.temporaryEffects ?? []).filter((e) => e.id !== id),
                  )
                }
                onAdvance={() =>
                  run(() =>
                    initialDraft
                      ? allocateCreation(c, name, (c.alinhavos[name] ?? 0) + 1, false)
                      : advanceCapability(c, name, false),
                  )
                }
                onReverse={() =>
                  run(() =>
                    initialDraft
                      ? allocateCreation(c, name, (c.alinhavos[name] ?? 0) - 1, false)
                      : reverseCapability(c, name, false),
                  )
                }
                canReverse={
                  isMaster &&
                  (c.ready && !initialDraft
                    ? c.investments.some((i) => i.target === name && i.kind === "Alinhavo")
                    : (c.alinhavos[name] ?? 0) > 0)
                }
                advanceCost={2}
                availablePU={stats.pu}
                creation={initialUnlocked}
                disabled={!canEdit}
                allocationHint={skillAllocation}
                choiceAllowed={(grade) => allocationPossible(name, grade, false)}
                onChange={(grade) => run(() => allocateCreation(c, name, grade, false))}
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
          <TdvFamiliarities
            character={c}
            onChange={onChange}
            canEdit={canEdit && initialUnlocked}
          />
        </Section>
        <Section variant="folio" id="tdv-protecao" title="Proteção">
          <TdvProtection character={c} />
          <TdvGuard character={c} onChange={onChange} canEdit={canEdit} />
          {c.guard.totalCover && (
            <p className="tdv-protection-note">Cobertura total · {c.guard.totalCover}</p>
          )}
          {c.resources.pi === 0 && (
            <p role="alert">
              Colapso: registre Condição Crítica e transformação duradoura na Feição. Nenhum
              diagnóstico ou perda arbitrária de autonomia é presumido.
            </p>
          )}
          {c.resources.pe === 0 && (
            <p className="tdv-note">
              A 0 PE, ações ordinárias continuam possíveis; custos em PE precisam ser pagos. Forçar
              a 0 PE é uma exceção por cena.
            </p>
          )}
          {(c.resources.pv === 0 || c.critical !== "Ativa") && (
            <div>
              <p role="alert">
                {c.critical}: 0 PV incapacita; uma nova consequência física relevante pode levar a À
                Beira.
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
                A 0 PV, estabilizar conserva a incapacidade. Condições e marcas permanecem até suas
                saídas próprias.
              </p>
            </div>
          )}
        </Section>
        <div id="tdv-motor" className="tdv-scene-actions">
          <TdvAction title="Consequência">
            <TdvOutcome character={c} onChange={onChange} canEdit={canEdit} />
            <Button variant="ghost" onClick={() => setRollChoice({ matrix: "Nexo" })}>
              Abrir dados opcionais
            </Button>
          </TdvAction>
          <TdvAction title="Recuperação e efeitos">
            <Section variant="folio" id="tdv-cena" title="Continuidade da cena">
              <p>
                Matrizes Abaladas: {c.scene.shaken.join(", ") || "nenhuma"}. Forçar a 0 PE:{" "}
                {c.scene.forcedAtZero ? "já utilizado" : "disponível, mediante contrapartida"}.
              </p>
              <Button
                disabled={disabled}
                variant="outline"
                onClick={() => onChange(endCharacterScene(c))}
              >
                Encerrar cena e liberar efeitos de cena
              </Button>
              <p className="tdv-note">
                Encerrar cena não recupera recursos, não remove Condições e não Reassenta a Âncora.
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
                Repetir o mesmo intervalo não multiplica recuperação. Pausa: PE +2, PI +1, PV +2 só
                com cuidado. Repouso: PE máximo, PI +3, PV +5 com cuidado ou +2 sem.
              </p>
            </Section>
          </TdvAction>
        </div>
      </TabsContent>
      <TabsContent value="expressao" data-sheet-content>
        {presentation !== "game" && belongings}
        <TdvActiveExpressions character={c} onChange={onChange} canEdit={canEdit} />
        <TdvRecordCollection
          character={c}
          onChange={onChange}
          canEdit={canEdit}
          onUse={setExpressionUse}
        />
        {presentation === "game" && belongings}
      </TabsContent>
      <TabsContent value="percurso" data-sheet-content>
        <Section variant="folio" id="tdv-desenvolvimento" title="Desenvolvimento e PU">
          <TdvDevelopment percent={stats.development} available={stats.pu} spent={stats.spent} />
          <div className="tdv-milestone-actions">
            {mayGrantMilestone && (
              <Button
                disabled={disabled || c.milestones.length >= 20}
                onClick={() => {
                  if (!c.ready && creationErrors(c).length) {
                    toast.error(creationErrors(c).join(" "));
                    setTab("constituicao");
                    setGameTab("constituicao");
                    return;
                  }
                  run(() => grantMilestone(c));
                }}
              >
                Conceder Marco · +5% e 2 PU
              </Button>
            )}
            {isMaster && (
              <TdvAction title="Correções e permissões">
                <p>
                  Corrigir preserva o registro anterior. Um Marco com PU já investidos exige
                  reverter o investimento primeiro.
                </p>
                {c.ready && !initialDraft && (
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      disabled={!canEdit || c.investments.length > 0}
                      onClick={() => {
                        setInitialDraft({
                          ...c,
                          progression: {
                            allowMilestones: c.progression?.allowMilestones ?? false,
                            allowCreation: true,
                          },
                        });
                        setGameToolsOpen(false);
                        setTab("constituicao");
                        setGameTab("constituicao");
                      }}
                    >
                      Rever escolhas iniciais
                    </Button>
                  </DialogClose>
                )}

                <div className="tdv-actions">
                  <Button
                    disabled={disabled || !c.milestones.length || stats.pu < 2}
                    onClick={() => run(() => reverseProgression(c, "Marco"))}
                  >
                    Reverter último Marco
                  </Button>
                  <Button
                    disabled={disabled || !c.investments.length}
                    onClick={() => run(() => reverseProgression(c, "Investimento"))}
                  >
                    Reverter último investimento
                  </Button>
                </div>
                <TdvCheck
                  label="Autorizar jogador a conceder Marcos nesta ficha"
                  value={Boolean(c.progression?.allowMilestones)}
                  disabled={disabled}
                  onChange={(value) =>
                    upd("progression", {
                      allowCreation: c.progression?.allowCreation ?? false,
                      allowMilestones: value,
                    })
                  }
                />
              </TdvAction>
            )}
          </div>
          <Button
            variant="outline"
            disabled={disabled || !c.ready || stats.pu < 2}
            onClick={() => {
              setKind("Matriz");
              setTarget(MATRICES[0]);
              setReason("");
              setTranscendent(false);
              setDevelopmentOpen(true);
            }}
          >
            Investir PU
          </Button>
          <details className="tdv-disclosure">
            <summary>Trajetória incorporada</summary>
            {c.milestones.map((m, i) => (
              <p key={m.id}>
                {(i + 1) * 5}% · {m.event} · {m.incorporation}
              </p>
            ))}
            {c.corrections?.map((item) => (
              <p key={item.id}>
                {item.kind} revertido · {new Date(item.at).toLocaleDateString("pt-BR")}
                <br />
                {correctionText(item.payload)}
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
  );
  return (
    <TdvSurfaceContext.Provider value={activeTab}>
      <div
        className="tadeon-tdv2-sheet"
        data-folio={activeTab}
        data-severity={conditionSeverity}
        data-zero-pv={c.resources.pv === 0 || c.critical === "Morta" || undefined}
        data-zero-pi={c.resources.pi === 0 || undefined}
        data-zero-pe={c.resources.pe === 0 || undefined}
        style={
          {
            "--equilibrium-tint": c.equilibrium < 0 ? "242 88 70" : "244 205 62",
            "--equilibrium-strength": Math.abs(c.equilibrium) / 100,
            "--crisis-rgb":
              c.resources.pv === 0 || c.critical === "Morta"
                ? "255 72 98"
                : c.resources.pi === 0
                  ? "176 112 255"
                  : "82 208 135",
            "--crisis-strength":
              Object.values(c.resources).some((value) => value === 0) || c.critical === "Morta"
                ? 0.22
                : 0,
          } as CSSProperties
        }
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
                  disabled={Boolean(initialDraft)}
                  onClick={() => selectProfile(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {initialDraft && (
            <div className="tdv-allocation-status">
              <p>Revisão das escolhas · alterações ainda não salvas</p>
              {creationErrors(c).length > 0 && (
                <ul aria-live="polite">
                  {creationErrors(c).map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
              <div className="tdv-actions">
                <Button variant="ghost" onClick={() => setInitialDraft(null)}>
                  Cancelar revisão
                </Button>
                <Button
                  disabled={creationErrors(c).length > 0}
                  onClick={() => {
                    const merged = {
                      ...incoming,
                      matrices: c.matrices,
                      alinhavos: c.alinhavos,
                      creation: c.creation
                        ? { ...incoming.creation!, familiarities: c.creation.familiarities }
                        : incoming.creation,
                      face: {
                        ...incoming.face,
                        anchor: { ...incoming.face.anchor, pillar: c.face.anchor.pillar },
                      },
                    };
                    const maximums = constitution(merged).maximums;
                    onPersist({
                      ...merged,
                      resources: {
                        pv: Math.min(incoming.resources.pv, maximums.pv),
                        pi: Math.min(incoming.resources.pi, maximums.pi),
                        pe: Math.min(incoming.resources.pe, maximums.pe),
                      },
                    });
                    setInitialDraft(null);
                  }}
                >
                  Salvar escolhas iniciais
                </Button>
              </div>
            </div>
          )}
          <TdvPlayPresence
            name={name}
            character={c}
            onChange={onChange}
            canEdit={canEdit && !initialDraft}
            physical={presentation === "game" && gameProfile === "fisico"}
            onInspectState={() => {
              if (presentation === "game") {
                setGameTab("constituicao");
                setGameToolsOpen(true);
              } else setTab("constituicao");
            }}
          />
          {!c.ready && (
            <TdvCreationLoom
              character={c}
              onChange={onChange}
              canEdit={canEdit}
              onSelect={presentation === "game" ? setGameTab : setTab}
            />
          )}
          {presentation === "game" && !initialDraft ? (
            <>
              <TdvGamePanel
                character={c}
                onChange={onChange}
                canEdit={canEdit}
                isMaster={isMaster}
                onUse={setExpressionUse}
                onTranscend={(name) => develop(name, true)}
                onOpen={(value) => {
                  setGameTab(value === "equipamento" ? "expressao" : value);
                  setGameToolsOpen(true);
                }}
              />
              <Dialog open={gameToolsOpen} onOpenChange={setGameToolsOpen}>
                <DialogContent className="tdv-game-tools-dialog">
                  <DialogHeader>
                    <DialogTitle>Instrumentos da personagem</DialogTitle>
                    <DialogDescription>Detalhes e operações da ficha integral.</DialogDescription>
                  </DialogHeader>
                  <div className="tadeon-tdv2-sheet" data-folio={activeTab}>
                    {sheetContents}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            sheetContents
          )}

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
                  Escolha a Matriz pela abordagem e o Alinhavo pela prática. A ficha calcula os
                  dados e aplica apenas os efeitos mecânicos.
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
    </TdvSurfaceContext.Provider>
  );
}
