import { z } from "zod";

/** TdV II v2.0, Livro de Regras supplied 26/10/2026. See docs/rules/tdv-ii-v2.md. */
export const MATRICES = ["Ímpeto", "Cadência", "Nexo", "Lastro"] as const;
export type Matrix = (typeof MATRICES)[number];
export const ALINHAVOS = [
  "Atletismo",
  "Luta",
  "Pontaria",
  "Furtividade",
  "Engenharia",
  "Ciências",
  "Medicina",
  "Ofício",
  "Percepção",
  "Sobrevivência",
  "Investigação",
  "Condução",
  "Diplomacia",
  "Persuasão",
  "Intimidação",
  "Encenação",
  "Sociedade",
  "Tática",
  "Iniciativa",
  "Canalização",
  "Selagem",
] as const;
export const DICE = [4, 6, 8, 10, 12, 20] as const;
export const LINK_STATES = ["Presente", "Tensionado", "Ferido", "Rompido", "Costurado"] as const;
export const PILLARS = ["Origem", "Ofício", "Convicção", "Limite", "Marca", "Vínculo"] as const;
export const POSITIONS = ["Favorecida", "Disputada", "Exposta"] as const;
export const DIFFICULTIES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32] as const;
const text = z.string().max(12000);
const degree = z.number().int().min(0).max(5);
export const tdvInvestmentSchema = z.object({
  id: z.string(),
  kind: z.enum(["Matriz", "Alinhavo", "Lavor", "Ampliação"]),
  target: z.string().max(200),
  cost: z.number().int().min(2).max(7),
  reason: text,
  transcendent: z.boolean(),
});
export const tdvRecordSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "Lavor",
    "Trama",
    "Fragmento",
    "Selo",
    "Arma",
    "Equipamento",
    "Reputação",
    "Preparo",
    "Costura",
    "Resto",
  ]),
  name: z.string().max(200),
  fields: z.record(z.string(), text),
});
export type TdvRecord = z.infer<typeof tdvRecordSchema>;
export const sceneTestSchema = z.object({
  id: z.string(),
  signature: text,
  intention: text,
  approach: text,
  change: text,
  point: text,
  modifier: z.number().int().min(-10000).max(10000).optional(),
  prumo: z.number().int().min(1).max(20),
  tento: z.number().int().min(1).max(20),
  dt: z.number().min(2).max(1000),
  matrix: z.enum(MATRICES),
  alinhavo: z.string(),
  helper: z.string().optional(),
});
export const activeExpressionSchema = z.object({
  id: z.string(),
  recordIds: z.array(z.string()).min(1).max(10),
  name: text,
  target: text,
  state: z.enum(["Em curso", "Sustentada", "Relaxada", "Interrompida"]),
  sustainPE: z.number().int().min(0).max(1000),
  sustainPI: z.number().int().min(0).max(1000),
  lastWindow: text,
  signature: text,
  reflux: text,
  exit: text,
  pullEventId: z.string().optional(),
  paidConsequences: z.array(z.string()).max(100),
  paidWindows: z.array(z.string()).max(200).optional(),
});
export type TdvActiveExpression = z.infer<typeof activeExpressionSchema>;
export const tdv2CharacterSchema = z
  .object({
    version: z.literal(2),
    ready: z.boolean(),
    progression: z.object({ allowMilestones: z.boolean(), allowCreation: z.boolean() }).optional(),
    corrections: z
      .array(
        z.object({
          id: z.string(),
          at: z.string(),
          kind: z.enum(["Marco", "Investimento"]),
          payload: text,
        }),
      )
      .max(500)
      .optional(),
    creation: z
      .object({
        groupReason: text,
        familiarities: z
          .array(z.enum(ALINHAVOS))
          .max(4)
          .refine((values) => new Set(values).size === values.length, "Não repita familiaridades."),
        reviewed: z.boolean(),
      })
      .optional(),
    matrices: z.object({ Ímpeto: degree, Cadência: degree, Nexo: degree, Lastro: degree }),
    alinhavos: z.record(z.string(), z.number().int().min(0).max(4)),
    face: z.object({
      origin: text,
      occupation: text,
      conviction: text,
      limit: text,
      mark: z.object({ trigger: text, manifestation: text, residue: text }),
      links: z
        .array(
          z.object({
            id: z.string(),
            node: text,
            nature: text,
            state: z.enum(LINK_STATES),
            offer: text,
            demand: text,
            tension: text,
          }),
        )
        .max(50),
      anchor: z.object({ pillar: z.enum(PILLARS), detail: text, shaken: z.boolean() }),
    }),
    resources: z.object({
      pv: z.number().int().min(0).max(100000),
      pi: z.number().int().min(0).max(100000),
      pe: z.number().int().min(0).max(100000),
    }),
    resourceModifiers: z
      .object({
        pv: z.number().int().min(-10000).max(10000),
        pi: z.number().int().min(-10000).max(10000),
        pe: z.number().int().min(-10000).max(10000),
      })
      .optional(),
    temporaryEffects: z
      .array(
        z.object({
          id: z.string(),
          target: z.enum([...MATRICES, ...ALINHAVOS]),
          kind: z.enum(["Proveito", "Desproveito", "Bônus"]),
          value: z.number().int().min(-100).max(100),
          note: text,
        }),
      )
      .max(50)
      .optional(),
    crisisMarks: z
      .object({ dying: z.number().int().min(0).max(3), collapse: z.number().int().min(0).max(3) })
      .optional(),
    guard: z.object({
      modifier: z.number().int().min(-100).max(100),
      source: text,
      broken: z.boolean(),
      protection: z.number().int().min(0).max(2).optional(),
      protectionSource: text.optional(),
      totalCover: text.optional(),
    }),
    equilibrium: z.number().int().min(-10).max(10),
    tension: z.number().int().min(-3).max(3),
    milestones: z.array(z.object({ id: z.string(), event: text, incorporation: text })).max(20),
    investments: z.array(tdvInvestmentSchema).max(100),
    records: z.array(tdvRecordSchema).max(200),
    conditions: z
      .array(
        z.object({
          id: z.string(),
          name: text,
          origin: text,
          effect: text,
          exit: text,
          intensity: z.enum(["Leve", "Grave", "Crítica"]),
        }),
      )
      .max(102),
    scene: z.object({
      shaken: z.array(z.enum(MATRICES)).max(4),
      forcedAtZero: z.boolean(),
      recoveryWindow: text,
      tests: z.array(sceneTestSchema).max(200).optional(),
      paidEvents: z
        .array(
          z.object({
            id: z.string(),
            source: text,
            pe: z.number().int().min(0),
            pi: z.number().int().min(0),
          }),
        )
        .max(200)
        .optional(),
    }),
    activeExpressions: z.array(activeExpressionSchema).max(100).optional(),
    critical: z.enum(["Ativa", "Incapacitada", "À Beira", "Morta"]),
    deathWindow: text,
    history: text,
    notes: text,
  })
  .strict();
export type TdvCharacter = z.infer<typeof tdv2CharacterSchema>;
export const uid = () => crypto.randomUUID();
export function newTdvCharacter(distribution: "base" | "reference" = "base"): TdvCharacter {
  const value: TdvCharacter = {
    version: 2,
    ready: false,
    matrices:
      distribution === "reference"
        ? { Ímpeto: 2, Cadência: 3, Nexo: 3, Lastro: 2 }
        : { Ímpeto: 1, Cadência: 1, Nexo: 1, Lastro: 1 },
    alinhavos: Object.fromEntries(
      ALINHAVOS.map((name) => [
        name,
        distribution === "base"
          ? 0
          : ["Engenharia", "Investigação"].includes(name)
            ? 2
            : ["Atletismo", "Percepção", "Sociedade", "Iniciativa"].includes(name)
              ? 1
              : 0,
      ]),
    ),
    face: {
      origin: "",
      occupation: "",
      conviction: "",
      limit: "",
      mark: { trigger: "", manifestation: "", residue: "" },
      links: [
        { id: uid(), node: "", nature: "", state: "Presente", offer: "", demand: "", tension: "" },
      ],
      anchor: { pillar: "Convicção", detail: "", shaken: false },
    },
    ...(distribution === "base"
      ? { creation: { groupReason: "", familiarities: [], reviewed: false } }
      : {}),
    resources: { pv: 10, pi: 11, pe: 10 },
    guard: { modifier: 0, source: "", broken: false },
    equilibrium: 0,
    tension: 0,
    milestones: [],
    investments: [],
    records: [],
    conditions: [],
    scene: { shaken: [], forcedAtZero: false, recoveryWindow: "" },
    critical: "Ativa",
    deathWindow: "",
    history: "",
    notes: "",
  };
  value.resources = constitution(value).maximums;
  return value;
}
export function constitution(character: TdvCharacter) {
  const matrices = { ...character.matrices },
    alinhavos = { ...character.alinhavos };
  let spent = 0;
  for (const entry of character.investments) {
    if (!entry.reason.trim() || !entry.target.trim())
      throw new Error("O investimento precisa de incorporação registrada.");
    if (entry.kind === "Matriz") {
      const key = entry.target as Matrix,
        from = matrices[key];
      if (
        !MATRICES.includes(key) ||
        from >= 5 ||
        entry.cost !== from + 3 ||
        (from === 4 && !entry.transcendent)
      )
        throw new Error("Avanço de Matriz inválido ou sem incorporação transcendente.");
      matrices[key] = from + 1;
    } else if (entry.kind === "Alinhavo") {
      if (
        !ALINHAVOS.includes(entry.target as (typeof ALINHAVOS)[number]) ||
        (alinhavos[entry.target] ?? 0) >= 4 ||
        entry.cost !== 2
      )
        throw new Error("Avanço de Alinhavo inválido.");
      alinhavos[entry.target] = (alinhavos[entry.target] ?? 0) + 1;
    } else if (entry.kind === "Lavor" && ![4, 6].includes(entry.cost))
      throw new Error("Lavor custa 4 ou 6 PU.");
    else if (entry.kind === "Ampliação" && (entry.cost < 3 || entry.cost > 7))
      throw new Error("Ampliação custa de 3 a 7 PU.");
    spent += entry.cost;
  }
  if (spent > character.milestones.length * 2) throw new Error("Pontos de Urdume insuficientes.");
  const pv = 6 + 2 * matrices["Ímpeto"],
    pi = 6 + matrices.Nexo + matrices.Lastro,
    pe = 5 + matrices.Nexo + matrices.Lastro,
    evasion = 6 + 2 * matrices["Cadência"];
  return {
    matrices,
    alinhavos,
    baseMaximums: { pv, pi, pe },
    maximums: {
      pv: Math.max(0, pv + (character.resourceModifiers?.pv ?? 0)),
      pi: Math.max(0, pi + (character.resourceModifiers?.pi ?? 0)),
      pe: Math.max(0, pe + (character.resourceModifiers?.pe ?? 0)),
    },
    defenses: { Resistência: pv, Evasão: evasion, Lucidez: pi, Firmeza: pi },
    guard: character.guard.broken
      ? null
      : Math.max(0, evasion + character.guard.modifier + (character.guard.protection ?? 0)),
    development: character.milestones.length * 5,
    pu: character.milestones.length * 2 - spent,
    spent,
  };
}
/** Sealing the numerical allocation does not require typing the character's fiction. */
export function creationErrors(c: TdvCharacter): string[] {
  const errors: string[] = [];
  if (Object.values(c.matrices).sort().join(",") !== "2,2,3,3")
    errors.push("Matrizes: duas d10 e duas d8.");
  const grades = ALINHAVOS.map((name) => c.alinhavos[name] ?? 0);
  if (
    grades.filter((n) => n === 2).length !== 2 ||
    grades.filter((n) => n === 1).length !== 4 ||
    grades.some((n) => n > 2)
  )
    errors.push("Alinhavos: dois d8 e quatro d6; os demais d4.");
  return errors;
}
export function finishCreation(c: TdvCharacter): TdvCharacter {
  const errors = creationErrors(c);
  if (errors.length) throw new Error(errors.join(" "));
  return { ...c, ready: true, resources: constitution(c).maximums };
}
export function invest(
  c: TdvCharacter,
  entry: Omit<z.infer<typeof tdvInvestmentSchema>, "id">,
): TdvCharacter {
  if (!c.ready) throw new Error("Conclua a criação antes de investir PU.");
  const next = { ...c, investments: [...c.investments, { ...entry, id: uid() }] };
  constitution(next);
  return next;
}
export function addMilestone(c: TdvCharacter, event: string, incorporation: string): TdvCharacter {
  if (
    !c.ready ||
    c.milestones.length >= 20 ||
    !event.trim() ||
    !incorporation.trim() ||
    c.milestones.some(
      (m) => m.event.trim() === event.trim() && m.incorporation.trim() === incorporation.trim(),
    )
  )
    throw new Error("O Marco precisa de acontecimento e incorporação; o limite é 100%.");
  return { ...c, milestones: [...c.milestones, { id: uid(), event, incorporation }] };
}
/** Creation has an allocation, not freely editable levels or a second PU currency. */
export function allocateCreation(
  c: TdvCharacter,
  name: string,
  grade: number,
  matrix: boolean,
): TdvCharacter {
  if (c.ready && !c.progression?.allowCreation)
    throw new Error("A criação está concluída. Solicite autorização ao mestre.");
  if (c.investments.length)
    throw new Error("Reverta os investimentos antes de corrigir a distribuição inicial.");
  if (!Number.isInteger(grade)) throw new Error("Escolha um grau inteiro.");
  let next: TdvCharacter;
  if (matrix) {
    if (!MATRICES.includes(name as Matrix) || grade < 1 || grade > 3)
      throw new Error("Matriz inicial entre d6 e d10.");
    next = { ...c, matrices: { ...c.matrices, [name]: grade } };
    const values = Object.values(next.matrices);
    if (
      values.filter((value) => value === 3).length > 2 ||
      values.reduce((sum, value) => sum + value - 1, 0) > 6
    )
      throw new Error(
        "Distribua seis avanços: duas Matrizes d10 e duas d8. Devolva uma escolha para redistribuir.",
      );
  } else {
    if (!ALINHAVOS.includes(name as (typeof ALINHAVOS)[number]) || grade < 0 || grade > 2)
      throw new Error("Alinhavo inicial entre d4 e d8.");
    next = {
      ...c,
      alinhavos: { ...c.alinhavos, [name]: grade },
      ...(c.creation && grade > 0
        ? {
            creation: {
              ...c.creation,
              familiarities: c.creation.familiarities.filter((value) => value !== name),
            },
          }
        : {}),
    };
    const values = ALINHAVOS.map((key) => next.alinhavos[key] ?? 0);
    if (
      values.filter((value) => value === 2).length > 2 ||
      values.filter((value) => value === 1).length > 4
    )
      throw new Error(
        "Há duas escolhas d8 e quatro escolhas d6. Devolva uma escolha para liberar a vaga.",
      );
  }
  const maximums = constitution(next).maximums;
  return {
    ...next,
    resources: c.ready
      ? {
          pv: Math.min(c.resources.pv, maximums.pv),
          pi: Math.min(c.resources.pi, maximums.pi),
          pe: Math.min(c.resources.pe, maximums.pe),
        }
      : maximums,
  };
}
export function grantMilestone(c: TdvCharacter): TdvCharacter {
  const base = c.ready ? c : { ...finishCreation(c), resources: c.resources };
  const number = base.milestones.length + 1;
  return addMilestone(base, `Marco ${number}`, `Reconhecido na trajetória · ${number * 5}%`);
}
export function advanceCapability(c: TdvCharacter, name: string, matrix: boolean): TdvCharacter {
  const stats = constitution(c),
    grade = matrix ? stats.matrices[name as Matrix] : (stats.alinhavos[name] ?? 0);
  if (!c.ready) return allocateCreation(c, name, grade + 1, matrix);
  if (matrix && grade === 4)
    throw new Error("O avanço transcendente exige reconhecimento expresso do mestre.");
  return invest(c, {
    kind: matrix ? "Matriz" : "Alinhavo",
    target: name,
    cost: matrix ? grade + 3 : 2,
    reason: `Prática incorporada · ${name}`,
    transcendent: false,
  });
}
export function reverseCapability(c: TdvCharacter, name: string, matrix: boolean): TdvCharacter {
  if (!c.ready) {
    const grade = matrix ? c.matrices[name as Matrix] : (c.alinhavos[name] ?? 0);
    return allocateCreation(c, name, grade - 1, matrix);
  }
  let index = -1;
  for (let i = c.investments.length - 1; i >= 0; i--) {
    if (
      c.investments[i].target === name &&
      c.investments[i].kind === (matrix ? "Matriz" : "Alinhavo")
    ) {
      index = i;
      break;
    }
  }
  if (index < 0) throw new Error("Este é o valor inicial. Não há avanço comprado para reverter.");
  const entry = c.investments[index],
    next = {
      ...c,
      investments: c.investments.filter((_, i) => i !== index),
      corrections: [
        ...(c.corrections ?? []),
        {
          id: uid(),
          at: new Date().toISOString(),
          kind: "Investimento" as const,
          payload: JSON.stringify(entry),
        },
      ],
    };
  const max = constitution(next).maximums;
  return {
    ...next,
    resources: {
      pv: Math.min(next.resources.pv, max.pv),
      pi: Math.min(next.resources.pi, max.pi),
      pe: Math.min(next.resources.pe, max.pe),
    },
  };
}
/** Corrections retain the previous record; spent PU can never become negative. */
export function reverseProgression(c: TdvCharacter, kind: "Marco" | "Investimento"): TdvCharacter {
  const record = kind === "Marco" ? c.milestones.at(-1) : c.investments.at(-1);
  if (!record) throw new Error("Não há registro para reverter.");
  const next = {
    ...c,
    ...(kind === "Marco"
      ? { milestones: c.milestones.slice(0, -1) }
      : { investments: c.investments.slice(0, -1) }),
    corrections: [
      ...(c.corrections ?? []),
      { id: uid(), at: new Date().toISOString(), kind, payload: JSON.stringify(record) },
    ],
  };
  const stats = constitution(next); // blocks reversal of a Marco whose PU are invested
  return {
    ...next,
    resources: {
      pv: Math.min(next.resources.pv, stats.maximums.pv),
      pi: Math.min(next.resources.pi, stats.maximums.pi),
      pe: Math.min(next.resources.pe, stats.maximums.pe),
    },
  };
}
export function addTension(c: TdvCharacter, amount: number): TdvCharacter {
  const total = c.tension + Math.trunc(amount);
  return Math.abs(total) >= 4
    ? {
        ...c,
        equilibrium: Math.max(-10, Math.min(10, c.equilibrium + Math.sign(total))),
        tension: 0,
      }
    : { ...c, tension: total };
}
export function equilibriumBand(n: number) {
  return n <= -7
    ? "Medo prevalente"
    : n <= -3
      ? "Medo inclinado"
      : n <= 2
        ? "Equilíbrio"
        : n <= 6
          ? "Conhecimento inclinado"
          : "Conhecimento prevalente";
}
/** Canonical zero-resource states are idempotent; a read never writes the sheet. */
export function withResourceConditions(c: TdvCharacter): TdvCharacter {
  const critical = c.resources.pv === 0 && c.critical === "Ativa" ? "Incapacitada" : c.critical;
  const conditions = [...c.conditions];
  const add = (id: string, name: string, origin: string, effect: string, exit: string) => {
    if (
      !conditions.some(
        (item) =>
          item.id === id ||
          item.name.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"),
      )
    )
      conditions.push({ id, name, origin, effect, exit, intensity: "Crítica" });
  };
  if (
    (c.resources.pv === 0 || ["Incapacitada", "À Beira"].includes(critical)) &&
    critical !== "Morta"
  )
    add(
      "tdv-zero-pv",
      "Incapacitada",
      "Vitalidade zerada",
      "Sem ações físicas exigentes. Fala, percepção e um gesto plausível dependem da situação; nova consequência física relevante pode levar a À Beira.",
      "Recuperar PV e condições de funcionamento; receber o cuidado necessário.",
    );
  if (c.resources.pi === 0)
    add(
      "tdv-zero-pi",
      "Colapso",
      "Inteireza zerada",
      "Interromper a operação dependente da continuidade afetada. Definir ameaça, assistência e transformação da Feição com a mesa.",
      "Conter a ameaça, recuperar continuidade e PI; reconhecer a transformação na Feição.",
    );
  return critical === c.critical && conditions.length === c.conditions.length
    ? c
    : { ...c, critical, conditions };
}
export function setResourceModifier(
  c: TdvCharacter,
  key: "pv" | "pi" | "pe",
  value: number,
  current = c.resources[key],
): TdvCharacter {
  if (!Number.isInteger(value) || Math.abs(value) > 10000)
    throw new Error("Use um modificador inteiro entre −10000 e +10000.");
  return setResource(
    { ...c, resourceModifiers: { pv: 0, pi: 0, pe: 0, ...c.resourceModifiers, [key]: value } },
    key,
    current,
  );
}
export function capabilityEffects(c: TdvCharacter, target: string) {
  return (c.temporaryEffects ?? []).filter((effect) => effect.target === target);
}
export function addCapabilityEffect(
  c: TdvCharacter,
  target: string,
  kind: "Proveito" | "Desproveito" | "Bônus",
  value: number,
  note = "",
): TdvCharacter {
  if (![...MATRICES, ...ALINHAVOS].some((name) => name === target))
    throw new Error("Escolha uma capacidade válida.");
  if ((c.temporaryEffects?.length ?? 0) >= 50)
    throw new Error("Encerre um efeito antes de adicionar outro.");
  if (!Number.isInteger(value) || Math.abs(value) > 100 || (kind === "Bônus" && value === 0))
    throw new Error("Informe um bônus inteiro não nulo entre −100 e +100.");
  return {
    ...c,
    temporaryEffects: [
      ...(c.temporaryEffects ?? []),
      {
        id: uid(),
        target: target as (typeof MATRICES)[number] | (typeof ALINHAVOS)[number],
        kind,
        value: kind === "Bônus" ? value : 1,
        note: note.trim(),
      },
    ],
  };
}
export function endCharacterScene(c: TdvCharacter): TdvCharacter {
  return {
    ...c,
    temporaryEffects: [],
    scene: { ...c.scene, shaken: [], forcedAtZero: false, tests: [], paidEvents: [] },
  };
}
export function setResource(c: TdvCharacter, key: "pv" | "pi" | "pe", value: number): TdvCharacter {
  const max = constitution(c).maximums[key],
    current = Math.max(0, Math.min(max, Math.round(value) || 0));
  return withResourceConditions({
    ...c,
    resources: { ...c.resources, [key]: current },
    critical: key === "pv" && current === 0 && c.critical === "Ativa" ? "Incapacitada" : c.critical,
  });
}
export function recover(
  c: TdvCharacter,
  depth: "Pausa breve" | "Repouso profundo" | "Recuperação plena",
  care: boolean,
  rebuilt: boolean,
  window: string,
): TdvCharacter {
  if (!window.trim() || window.trim() === c.scene.recoveryWindow)
    throw new Error(
      "Identifique uma nova janela real de recuperação, após outra sequência de risco ou esforço.",
    );
  if (c.critical === "Morta") throw new Error("Recuperação ordinária não reverte morte.");
  const max = constitution(c).maximums,
    old = c.resources;
  const resources =
    depth === "Pausa breve"
      ? { pv: old.pv + (care ? 2 : 0), pi: old.pi + 1, pe: old.pe + 2 }
      : depth === "Repouso profundo"
        ? { pv: old.pv + (care ? 5 : 2), pi: old.pi + 3, pe: max.pe }
        : { pv: max.pv, pi: rebuilt ? max.pi : old.pi, pe: max.pe };
  return {
    ...c,
    resources: {
      pv: Math.min(max.pv, resources.pv),
      pi: Math.min(max.pi, resources.pi),
      pe: Math.min(max.pe, resources.pe),
    },
    scene: { ...c.scene, recoveryWindow: window.trim() },
  };
}
/** Fictional consequences are recorded, never erased or traded for a numeric PA cost. */
export function anchor(
  c: TdvCharacter,
  mode: "Sustentar" | "Redirecionar",
  consequence: string,
  outcome: string,
): TdvCharacter {
  if (!c.ready || c.face.anchor.shaken)
    throw new Error("A Âncora precisa estar estabelecida e assentada.");
  if (!consequence.trim() || !outcome.trim())
    throw new Error("Registre a consequência concreta e como ela foi sustentada ou redirecionada.");
  return {
    ...c,
    face: { ...c.face, anchor: { ...c.face.anchor, shaken: true } },
    records: [
      ...c.records,
      {
        id: uid(),
        kind: "Resto",
        name: `Ancorar: ${mode}`,
        fields: {
          Consequência: consequence.trim(),
          Desdobramento: outcome.trim(),
          Âncora: c.face.anchor.detail,
        },
      },
    ],
  };
}
export function resettle(c: TdvCharacter, action: string): TdvCharacter {
  if (!c.face.anchor.shaken || !action.trim())
    throw new Error("Reassentar exige uma Âncora Abalada e uma ação significativa na ficção.");
  return {
    ...c,
    face: { ...c.face, anchor: { ...c.face.anchor, shaken: false } },
    records: [
      ...c.records,
      {
        id: uid(),
        kind: "Resto",
        name: "Reassentar Âncora",
        fields: { Ação: action.trim(), Âncora: c.face.anchor.detail },
      },
    ],
  };
}
export function stabilize(c: TdvCharacter, action: string): TdvCharacter {
  if (c.critical === "Morta") throw new Error("Estabilização ordinária não reverte morte.");
  if (!action.trim()) throw new Error("Registre o cuidado e a condição concreta de estabilização.");
  return {
    ...c,
    critical: c.resources.pv > 0 ? "Ativa" : "Incapacitada",
    deathWindow: action.trim(),
    records: [
      ...c.records,
      { id: uid(), kind: "Resto", name: "Estabilização", fields: { Cuidado: action.trim() } },
    ],
  };
}
export type Thread = "Prumo" | "Tento";
export interface TestRequest {
  matrix: Matrix;
  alinhavo: string;
  dt: number;
  prumoPro: number;
  prumoDes: number;
  tentoPro: number;
  tentoDes: number;
  force: Thread | "";
  extraordinary: boolean;
  counterpart: string;
  helper?: { name: string; grade: number; contribution: string };
  context?: { intention: string; approach: string; change: string; point: string; risk: boolean };
  costs?: { pe: number; pi: number; source: string; eventId: string };
}
function shift(die: number, direction: number, extraordinary: boolean) {
  const index = DICE.indexOf(die as (typeof DICE)[number]);
  return DICE[Math.max(0, Math.min(extraordinary ? 5 : Math.max(index, 4), index + direction))];
}
/** Only explicit portable declarations affect a Fio; severity/prose never infer penalties. */
export function conditionImpact(
  effect: string,
): { kind: "Desproveito" | "Impedimento"; target: string; description: string } | null {
  const [line, ...rest] = effect.split("\n");
  const m = /^Fio declarado · (Desproveito|Impedimento) · (.+)$/.exec(line);
  return m && [...MATRICES, ...ALINHAVOS].some((name) => name === m[2])
    ? { kind: m[1] as "Desproveito" | "Impedimento", target: m[2], description: rest.join("\n") }
    : null;
}
export function declareConditionImpact(
  effect: string,
  kind: "Descrição apenas" | "Desproveito" | "Impedimento",
  target: string,
) {
  const prose = conditionImpact(effect)?.description ?? effect;
  if (kind === "Descrição apenas") return prose;
  if (![...MATRICES, ...ALINHAVOS].some((name) => name === target))
    throw new Error("Escolha uma capacidade válida.");
  return `Fio declarado · ${kind} · ${target}\n${prose}`;
}
export function capabilityConditions(c: TdvCharacter, target: string) {
  return c.conditions.filter((item) => conditionImpact(item.effect)?.target === target);
}
export function prepareTest(c: TdvCharacter, r: TestRequest) {
  if (!c.ready) throw new Error("Conclua a criação da personagem.");
  const current = constitution(c);
  if (!ALINHAVOS.includes(r.alinhavo as (typeof ALINHAVOS)[number]))
    throw new Error("Alinhavo inválido.");
  if (
    r.helper &&
    (!r.helper.name.trim() ||
      !r.helper.contribution.trim() ||
      !Number.isInteger(r.helper.grade) ||
      r.helper.grade < 0 ||
      r.helper.grade > 4)
  )
    throw new Error("Auxílio exige uma pessoa, contribuição concreta e grau válido de Tento.");
  if (r.context) {
    if (!r.context.risk)
      throw new Error("Sem risco ou oposição relevante, resolva diretamente pela ficção.");
    if (!r.context.intention.trim() || !r.context.approach.trim())
      throw new Error("Declare intenção e abordagem antes de rolar.");
    const signature = testSignature(r.context);
    if (c.scene.tests?.some((test) => test.signature === signature))
      throw new Error(
        "A mesma intervenção já foi resolvida. Declare uma mudança real na situação antes de outro teste.",
      );
    if ((c.scene.tests?.length ?? 0) >= 200)
      throw new Error("Encerre ou organize a cena antes de registrar novos testes.");
  }
  const declaredPE = r.costs?.pe ?? 0,
    declaredPI = r.costs?.pi ?? 0;
  if (
    !Number.isInteger(declaredPE) ||
    !Number.isInteger(declaredPI) ||
    declaredPE < 0 ||
    declaredPI < 0
  )
    throw new Error("Custos declarados precisam ser inteiros não negativos.");
  if (
    r.costs &&
    (!r.costs.source.trim() ||
      !r.costs.eventId ||
      c.scene.paidEvents?.some((event) => event.id === r.costs!.eventId))
  )
    throw new Error("O custo precisa de fonte e de um acontecimento ainda não pago.");
  if (r.costs && (c.scene.paidEvents?.length ?? 0) >= 200)
    throw new Error("Organize a cena antes de novos pagamentos.");
  let prumo: number = DICE[current.matrices[r.matrix]],
    tento: number = DICE[r.helper?.grade ?? current.alinhavos[r.alinhavo] ?? 0];
  const impacts = c.conditions.map((item) => ({ item, impact: conditionImpact(item.effect) }));
  const applicable = impacts.filter(
    ({ impact }) => impact && (impact.target === r.matrix || impact.target === r.alinhavo),
  );
  const blocked = applicable.find(({ impact }) => impact?.kind === "Impedimento");
  if (blocked)
    throw new Error(
      `${blocked.item.name || "Condição ativa"}: ${blocked.impact!.target} está impedido até a saída declarada.`,
    );
  const disadvantages = (target: string) =>
    applicable.filter(({ impact }) => impact?.target === target && impact.kind === "Desproveito")
      .length;
  const shaken = c.scene.shaken.includes(r.matrix) ? 1 : 0;
  const temporary = (target: string, kind: string) =>
    capabilityEffects(c, target).filter((effect) => effect.kind === kind).length;
  const direction = (target: string) =>
    temporary(target, "Proveito") - temporary(target, "Desproveito");
  const bonus = (target: string) =>
    capabilityEffects(c, target)
      .filter((effect) => effect.kind === "Bônus")
      .reduce((sum, effect) => sum + effect.value, 0);
  prumo = shift(
    prumo,
    Math.sign(r.prumoPro - r.prumoDes - shaken - disadvantages(r.matrix) + direction(r.matrix)),
    r.extraordinary,
  );
  tento = shift(
    tento,
    Math.sign(
      r.tentoPro - r.tentoDes + (r.helper ? 0 : direction(r.alinhavo) - disadvantages(r.alinhavo)),
    ),
    r.extraordinary,
  );
  let cost = 0,
    zero = false;
  if (r.force) {
    const old = r.force === "Prumo" ? prumo : tento;
    if (old === 20) throw new Error("Um Fio em d20 não pode ser Forçado.");
    if (old === 12 && !r.extraordinary)
      throw new Error("d12 para d20 exige autorização transcendente expressa.");
    cost = old === 12 ? 2 : 1;
    if (c.resources.pe === 0) {
      if (c.scene.forcedAtZero || !r.counterpart.trim())
        throw new Error("Forçar a 0 PE exige contrapartida e só pode ocorrer uma vez por cena.");
      cost = 0;
      zero = true;
    } else if (c.resources.pe < cost) throw new Error("PE insuficiente para Forçar.");
    if (r.force === "Prumo") prumo = shift(prumo, 1, r.extraordinary);
    else tento = shift(tento, 1, r.extraordinary);
  }
  if (c.resources.pe < cost + declaredPE || c.resources.pi < declaredPI)
    throw new Error("Não há PE ou PI para pagar os custos declarados; esta abordagem não começa.");
  return {
    prumo,
    tento,
    cost: cost + declaredPE,
    forcingCost: cost,
    piCost: declaredPI,
    zero,
    bonus: bonus(r.matrix) + (r.helper ? 0 : bonus(r.alinhavo)),
  };
}
export function testSignature(context: NonNullable<TestRequest["context"]>) {
  return [context.intention, context.approach, context.change]
    .map((value) => value.trim().normalize("NFC").toLocaleLowerCase("pt-BR"))
    .join(" | ");
}
export function readTest(prumo: number, tento: number, dt: number, modifier = 0) {
  const enlace = prumo + tento + modifier,
    margin = enlace - dt,
    criticalFailure = prumo === 1 && tento === 1,
    success = !criticalFailure && enlace >= dt,
    consonance = prumo === tento;
  return {
    prumo,
    tento,
    ...(modifier ? { modifier } : {}),
    enlace,
    dt,
    margin,
    ascendente: Math.max(prumo, tento),
    retorno: Math.min(prumo, tento),
    desvio: prumo - tento,
    consonance,
    criticalFailure,
    success,
    critical: success && consonance,
    quality: criticalFailure
      ? "Falha Crítica"
      : margin >= 8
        ? "Êxito excepcional"
        : margin >= 4
          ? "Êxito elevado"
          : margin >= 0
            ? "Êxito"
            : margin >= -2
              ? "Quase"
              : margin >= -5
                ? "Falha com consequência"
                : "Falha severa",
  };
}
export function resolveTest(
  c: TdvCharacter,
  r: TestRequest,
  random: () => number = Math.random,
  faces?: { prumo: number; tento: number },
) {
  const dice = prepareTest(c, r),
    roll = (size: number) => Math.min(size, Math.floor(Math.max(0, random()) * size) + 1),
    validFace = (value: number, size: number) =>
      Number.isInteger(value) && value >= 1 && value <= size;
  if (faces && (!validFace(faces.prumo, dice.prumo) || !validFace(faces.tento, dice.tento)))
    throw new Error("Confira as faces físicas: use inteiros entre 1 e o dado final de cada Fio.");
  const result = readTest(
    faces?.prumo ?? roll(dice.prumo),
    faces?.tento ?? roll(dice.tento),
    r.dt,
    dice.bonus,
  );
  // A plain roll is transient; only mechanical effects or explicit records change the sheet.
  if (!(dice.cost || dice.piCost || dice.zero || result.criticalFailure || r.context || r.costs))
    return { result, dice, character: c };
  return {
    result,
    dice,
    character: withResourceConditions({
      ...c,
      resources: {
        ...c.resources,
        pe: c.resources.pe - dice.cost,
        pi: c.resources.pi - dice.piCost,
      },
      records: dice.zero
        ? [
            ...c.records,
            {
              id: uid(),
              kind: "Resto" as const,
              name: "Forçar a 0 PE",
              fields: { Fio: r.force, Contrapartida: r.counterpart.trim() },
            },
          ]
        : c.records,
      scene: {
        ...c.scene,
        ...(r.context
          ? {
              tests: [
                ...(c.scene.tests ?? []),
                {
                  id: uid(),
                  signature: testSignature(r.context),
                  intention: r.context.intention.trim(),
                  approach: r.context.approach.trim(),
                  change: r.context.change.trim(),
                  point: r.context.point.trim(),
                  prumo: result.prumo,
                  tento: result.tento,
                  dt: r.dt,
                  ...(dice.bonus ? { modifier: dice.bonus } : {}),
                  matrix: r.matrix,
                  alinhavo: r.alinhavo,
                  ...(r.helper ? { helper: r.helper.name } : {}),
                },
              ],
            }
          : {}),
        ...(r.costs
          ? {
              paidEvents: [
                ...(c.scene.paidEvents ?? []),
                { id: r.costs.eventId, source: r.costs.source, pe: r.costs.pe, pi: r.costs.pi },
              ],
            }
          : {}),
        forcedAtZero: c.scene.forcedAtZero || dice.zero,
        shaken: result.criticalFailure
          ? [...new Set([...c.scene.shaken, r.matrix])]
          : c.scene.shaken,
      },
    }),
  };
}
export function contested(a: ReturnType<typeof readTest>, b: ReturnType<typeof readTest>) {
  if (a.criticalFailure && b.criticalFailure) return "Empate";
  if (a.criticalFailure) return "B";
  if (b.criticalFailure) return "A";
  return a.enlace === b.enlace ? "Empate" : a.enlace > b.enlace ? "A" : "B";
}

export const RECORD_FIELDS: Record<TdvRecord["kind"], string[]> = {
  Lavor: ["Vertente", "Gatilho", "Gesto", "Expressão", "Preço/limite"],
  Trama: [
    "Natureza",
    "Alvo",
    "Intensidade",
    "Alcance",
    "Duração",
    "Resistência",
    "Custo em PE",
    "Puxagem e acesso",
    "Refluxo",
    "Assinatura",
    "Sustentação",
    "Relaxamento",
  ],
  Fragmento: ["Suporte", "Relação preservada", "Acesso", "Uso", "Custo e risco", "Conservação"],
  Selo: [
    "Diagnóstico",
    "Ponto de Costura",
    "Acesso",
    "Tecitura",
    "Fixação",
    "Cargas concretas",
    "Resto e Permanência",
    "Manutenção",
  ],
  Arma: [
    "Família",
    "Alcance",
    "Manejo",
    "Impacto",
    "Propriedades",
    "Porte e acesso",
    "Dano-base",
    "Integridade",
    "Função comprometida",
    "Reparo necessário",
    "Redução numérica expressa",
  ],
  Preparo: ["Gesto", "Gatilho", "Mudança permitida", "Continuidade e consumo", "Estado"],
  Costura: [
    "Intenção única",
    "Lavores envolvidos",
    "Contribuição de cada Lavor",
    "Gatilhos válidos",
    "Preços e limites",
    "Expressão híbrida",
    "Risco adicional",
  ],
  Equipamento: [
    "Forma",
    "Uso",
    "Propriedades",
    "Alcance",
    "Dano-base",
    "Integridade",
    "Preço/limite",
  ],
  Reputação: ["Rede", "Imagem", "Peso", "Cobrança"],
  Resto: ["Acontecimento", "Consequência", "O que permanece", "Relações", "Incorporação"],
};

export function characterStateLabel(c: TdvCharacter) {
  return (
    [c.critical !== "Ativa" ? c.critical : "", c.resources.pi === 0 ? "Colapso" : ""]
      .filter(Boolean)
      .join(" · ") || "Ativa"
  );
}
export function probabilityProfile(prumo: number, tento: number, dt: number, modifier = 0) {
  if (
    !DICE.includes(prumo as (typeof DICE)[number]) ||
    !DICE.includes(tento as (typeof DICE)[number]) ||
    !Number.isFinite(dt)
  )
    throw new Error("Dados ou limiar inválidos.");
  let success = 0,
    critical = 0,
    criticalFailure = 0;
  for (let p = 1; p <= prumo; p++)
    for (let t = 1; t <= tento; t++) {
      const r = readTest(p, t, dt, modifier);
      success += Number(r.success);
      critical += Number(r.critical);
      criticalFailure += Number(r.criticalFailure);
    }
  const total = prumo * tento;
  return {
    success: success / total,
    critical: critical / total,
    criticalFailure: criticalFailure / total,
    total,
  };
}
