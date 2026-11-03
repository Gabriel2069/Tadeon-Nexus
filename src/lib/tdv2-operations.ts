import { z } from "zod";
import { readTest, testSignature, uid } from "./tdv2";
const text = z.string().max(12000);
export const BRANCH_FIELDS = {
  Confrontação: [
    "Campo e intenção",
    "Defesa principal",
    "Fonte de dano e propriedades",
    "Sustentação e contrajogo",
  ],
  Ocultação: ["Observadores", "Coberturas e rotas reais", "Ação comprometedora ou reveladora"],
  Infiltração: ["Identidade", "Finalidade", "Autorização", "Inspeção dirigida"],
  Perseguição: ["Rota e obstáculos", "Rastro · faixa do Tento", "Método de Rastrear"],
  Investigação: [
    "Pergunta Central",
    "Evidências",
    "Hipótese e previsão",
    "Contraprova",
    "Contradições",
    "Teia e compartilhamento",
  ],
  Negociação: ["Pedido", "Contrapartida", "Garantia", "Compromisso"],
  Exploração: ["Conhecidas", "Presumidas", "Bloqueadas"],
  Navegação: [
    "Referências",
    "Objeto da Atenção",
    "Duração ficcional",
    "Arremate prévio",
    "Agulha de Rumo",
  ],
  Transposição: ["Travessia", "Apoios materiais", "Retorno do Apoio", "Balanço anunciado"],
  Preservação: ["Núcleo", "Perímetro", "Suportes", "Frentes de Recuperação"],
  Construção: [
    "Função",
    "Componentes e dependências",
    "Gabarito · faixa do Tento",
    "Ajuste e tolerância",
    "Integridade",
  ],
} as const;
export const BRANCHES = Object.keys(BRANCH_FIELDS) as (keyof typeof BRANCH_FIELDS)[];
export const OPERATION_KINDS = [
  "Prolongada",
  "Selagem",
  "Canalização",
  "Coordenação",
  "Perseguição",
  "Sustentada",
  "Malha",
] as const;
export const operationSchema = z.object({
  id: z.string(),
  kind: z.enum(OPERATION_KINDS),
  name: text,
  objective: text,
  dt: z.number().int().min(2).max(1000),
  pressureId: z.string(),
  computation: z
    .object({
      reading: z.enum(["Ascendente", "Retorno"]),
      target: z.number().int().min(0).max(1000000),
      progress: z.number().int().min(0).max(1000000),
    })
    .optional(),
  malha: z
    .object({
      branch: z.enum([
        "Confrontação",
        "Ocultação",
        "Infiltração",
        "Perseguição",
        "Investigação",
        "Negociação",
        "Exploração",
        "Navegação",
        "Transposição",
        "Preservação",
        "Construção",
      ]),
      fields: z.record(z.string(), text),
      shadow: z
        .object({
          signal: z.number().int().min(1).max(6),
          examined: z.array(z.number().int().min(1).max(6)).max(6),
          hideouts: z.array(z.object({ id: z.string(), name: text, valid: z.boolean() })).max(3),
        })
        .optional(),
      credentials: z
        .object({
          identity: z.enum(["Íntegro", "Questionado", "Rompido"]),
          purpose: z.enum(["Íntegro", "Questionado", "Rompido"]),
          authorization: z.enum(["Íntegro", "Questionado", "Rompido"]),
        })
        .optional(),
      route: z
        .enum(["Contato", "Próximo", "Afastado", "Fora de Vista", "Contato Perdido"])
        .optional(),
      urgency: z
        .object({ size: z.number().int().min(3).max(8), used: z.number().int().min(0).max(8) })
        .optional(),
    })
    .optional(),
  stages: z
    .array(z.object({ id: z.string(), name: text, done: z.boolean(), evidence: text }))
    .min(1)
    .max(20),
  history: z
    .array(
      z.object({
        id: z.string(),
        signature: text,
        intention: text,
        approach: text,
        change: text,
        resolution: z.enum(["Ficção direta", "Teste"]),
        prumo: z.number().int().min(1).max(20).optional(),
        tento: z.number().int().min(1).max(20).optional(),
        dt: z.number(),
        success: z.boolean(),
        stages: z.array(z.string()).max(20),
        rest: text,
        participants: text,
      }),
    )
    .max(200),
});
export type TdvOperation = z.infer<typeof operationSchema>;
export function newOperation(
  kind: TdvOperation["kind"],
  revision: "VIII" | "legacy" = "VIII",
): TdvOperation {
  const names =
    kind === "Selagem"
      ? ["Diagnóstico", "Acesso", "Tecitura", "Fixação", "Resto"]
      : kind === "Canalização"
        ? ["Aproximação", "Tração", "Tecitura", "Expressão", "Relaxamento"]
        : kind === "Coordenação"
          ? ["Primeira contribuição", "Segunda contribuição"]
          : kind === "Perseguição"
            ? ["Criar ou preservar acesso", "Alterar a distância ou rota", "Resolver o objetivo"]
            : kind === "Sustentada"
              ? ["Estabelecimento", "Sustentação", "Interferência"]
              : ["Acesso", "Intervenção", "Estabilização"];
  return {
    id: uid(),
    kind,
    name: "",
    objective: "",
    dt: 12,
    pressureId: "",
    ...(kind === "Prolongada" && revision === "VIII"
      ? { computation: { reading: "Ascendente" as const, target: 0, progress: 0 } }
      : {}),
    ...(kind === "Malha" ? { malha: { branch: "Confrontação" as const, fields: {} } } : {}),
    stages: names.map((name) => ({ id: uid(), name, done: false, evidence: "" })),
    history: [],
  };
}
export interface OperationStep {
  stageIds: string[];
  intention: string;
  approach: string;
  change: string;
  evidence: string;
  rest: string;
  participants: string;
  resolution: "Ficção direta" | "Teste";
  prumo: number;
  tento: number;
  broadens: boolean;
}
export function registerOperationStep(operation: TdvOperation, step: OperationStep): TdvOperation {
  if (
    !operation.objective.trim() ||
    !step.intention.trim() ||
    !step.approach.trim() ||
    (!operation.computation && !step.evidence.trim())
  )
    throw new Error("Declare objetivo, intervenção, abordagem e a mudança verificável.");
  if (operation.history.length >= 200)
    throw new Error("Organize a memória da operação antes de novos registros.");
  const signature = testSignature({
    intention: step.intention,
    approach: step.approach,
    change: step.change,
    point: "",
    risk: step.resolution === "Teste",
  });
  if (operation.history.some((h) => h.signature === signature))
    throw new Error("Não repita a mesma intervenção sem mudança real da situação.");
  const result =
    step.resolution === "Teste" ? readTest(step.prumo, step.tento, operation.dt) : null;
  if (result && [step.prumo, step.tento].some((n) => !Number.isInteger(n) || n < 1 || n > 20))
    throw new Error("Use os resultados originais dos dois Fios.");
  const success = result?.success ?? true;
  const stageIds = [...new Set(step.stageIds)];
  if (
    (!operation.computation && !stageIds.length) ||
    stageIds.some((id) => !operation.stages.some((s) => s.id === id && !s.done))
  )
    throw new Error("Escolha etapas ainda abertas desta operação.");
  if (
    success &&
    operation.kind === "Prolongada" &&
    !operation.computation &&
    step.resolution === "Teste" &&
    stageIds.length > 1 &&
    (!(result!.margin >= 4 && step.broadens) || stageIds.length > 2)
  )
    throw new Error("Etapa adicional exige êxito elevado e uma ação que realmente abranja ambas.");
  return {
    ...operation,
    ...(operation.computation
      ? {
          computation: {
            ...operation.computation,
            progress: computationContribution(operation, step, result),
          },
        }
      : {}),
    stages: operation.stages.map((stage) =>
      success && stageIds.includes(stage.id)
        ? { ...stage, done: true, evidence: step.evidence }
        : stage,
    ),
    history: [
      ...operation.history,
      {
        id: uid(),
        signature,
        intention: step.intention,
        approach: step.approach,
        change: step.change,
        resolution: step.resolution,
        ...(result ? { prumo: step.prumo, tento: step.tento } : {}),
        dt: operation.dt,
        success,
        stages: success ? stageIds : [],
        rest: step.rest,
        participants: step.participants,
      },
    ],
  };
}
function computationContribution(
  operation: TdvOperation,
  step: OperationStep,
  result: ReturnType<typeof readTest> | null,
) {
  const computation = operation.computation!;
  if (computation.target <= 0 || step.resolution !== "Teste" || !result)
    throw new Error(
      "Defina o total e a leitura de contribuição antes de resolver o Cômputo pelo Enlace.",
    );
  if (computation.progress >= computation.target) throw new Error("Este Cômputo já foi concluído.");
  return (
    computation.progress +
    (result.success
      ? computation.reading === "Ascendente"
        ? result.ascendente
        : result.retorno
      : 0)
  );
}
export function searchShadow(operation: TdvOperation, faces: number[]): TdvOperation {
  const shadow = operation.malha?.shadow;
  if (
    !shadow ||
    faces.length !== 2 ||
    new Set(faces).size !== 2 ||
    faces.some((n) => !Number.isInteger(n) || n < 1 || n > 6 || shadow.examined.includes(n))
  )
    throw new Error("Uma Busca bem-sucedida examina duas faces inéditas do d6.");
  return {
    ...operation,
    malha: { ...operation.malha!, shadow: { ...shadow, examined: [...shadow.examined, ...faces] } },
  };
}
