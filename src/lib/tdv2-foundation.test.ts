import { recordOutcome } from "./tdv2-play";
import { describe, it, expect } from "vitest";
import {
  newTdvCharacter,
  finishCreation,
  constitution,
  allocateCreation,
  creationErrors,
  grantMilestone,
  grantPractice,
  invest,
  advanceCapability,
  reverseCapability,
  spendNexoStep,
  adoptFoundation,
  recoveryPreview,
  recoverByFronts,
  readTest,
  prepareTest,
  resolveTest,
  setResource,
  changeCrisis,
  cargoProfile,
  advanceBond,
  invokeConviction,
} from "./tdv2";
import { newTdvMaster, nextRound } from "./tdv2-master";
import { newOperation, registerOperationStep, searchShadow } from "./tdv2-operations";
const ready = () => finishCreation(newTdvCharacter("reference"));
describe("Fundação VIII: constituição e economia compartilhadas", () => {
  it("accepts all 31 creation distributions and rejects excess allocation", () => {
    let count = 0;
    for (let a = 0; a <= 3; a++)
      for (let b = 0; b <= 3; b++)
        for (let c = 0; c <= 3; c++)
          for (let d = 0; d <= 3; d++) {
            const candidate = {
              ...newTdvCharacter(),
              matrices: { Ímpeto: a, Cadência: b, Nexo: c, Lastro: d },
            };
            if (!creationErrors(candidate).some((e) => e.startsWith("Matrizes"))) count++;
          }
    expect(count).toBe(31);
    let c = allocateCreation(newTdvCharacter(), "Ímpeto", 0, true);
    expect(() => allocateCreation(c, "Cadência", 0, true)).toThrow();
    c = allocateCreation(allocateCreation(c, "Cadência", 3, true), "Nexo", 3, true);
    expect(allocateCreation(c, "Lastro", 2, true).matrices).toEqual({
      Ímpeto: 0,
      Cadência: 3,
      Nexo: 3,
      Lastro: 2,
    });
  });
  it("budgets Alinhavos from Nexo instead of fixed slots", () => {
    let c = newTdvCharacter();
    for (const name of ["Luta", "Pontaria", "Engenharia", "Medicina"])
      c = allocateCreation(c, name, 2, false);
    expect(() => allocateCreation(c, "Ciências", 1, false)).toThrow();
    expect(allocateCreation(c, "Luta", 0, false).alinhavos.Luta).toBe(0);
  });
  it.each([
    [0, 12, 10, 9],
    [4, 20, 17, 13],
    [8, 28, 24, 17],
    [12, 36, 31, 21],
    [16, 44, 38, 25],
    [20, 52, 45, 29],
  ])("matches the reference at Marco %i", (m, pv, pi, pe) => {
    let c = ready();
    for (let i = 0; i < m; i++) c = grantMilestone(c);
    const stats = constitution(c);
    expect(stats.maximums).toEqual({ pv, pi, pe });
    expect(stats.pu).toBe(3 * m);
    expect(stats.defenses).toMatchObject({
      Guarda: 8 + Math.floor(m / 4),
      Resistência: 10 + Math.floor(m / 4),
      Evasão: 11 + Math.floor(m / 4),
      Firmeza: 10 + Math.floor(m / 4),
    });
    expect(stats.defenses.Lucidez).toBeUndefined();
    expect(stats.capacity).toBe(9);
  });
  it("caps Práticas and Reforços without healing existing points", () => {
    let c = grantPractice(ready(), "Aprendizado reconhecido", 2);
    expect(() => grantPractice(c, "Repetir", 1)).toThrow();
    c = invest(c, { kind: "Reforço", target: "pv", cost: 2, reason: "Vigor", transcendent: false });
    expect(constitution(c).maximums.pv).toBe(14);
    expect(c.resources.pv).toBe(12);
    c = grantMilestone(c);
    expect(() =>
      invest(c, { kind: "Reforço", target: "pv", cost: 2, reason: "Outro", transcendent: false }),
    ).toThrow(/Reforço/);
  });
  it("uses progressive costs, ceilings and permanent Nexo entitlements", () => {
    let c = grantMilestone(grantMilestone(ready()));
    c = advanceCapability(c, "Nexo", true);
    expect(constitution(c)).toMatchObject({ pu: 1, nexoSteps: 2 });
    c = spendNexoStep(c, "Ciências");
    c = spendNexoStep(c, "Ciências");
    expect(constitution(c)).toMatchObject({ pu: 1, nexoSteps: 0 });
    expect(() => spendNexoStep(c, "Ofício")).toThrow();
    expect(() => advanceCapability(c, "Nexo", true)).toThrow(/patamar/);
  });
  it("preserves complete source and effective values in an explicit legacy conversion", () => {
    const old = finishCreation(newTdvCharacter("reference", "legacy"));
    const converted = adoptFoundation(old);
    expect(converted.matrices).toEqual(constitution(old).matrices);
    expect(JSON.parse(converted.foundation!.legacy!.source)).toEqual(old);
    expect(converted.resources).toEqual({ pv: 10, pi: 10, pe: 10 }); // clamp only the reserve whose new maximum is lower
    expect(adoptFoundation(converted)).toBe(converted);
  });
  it("reverses an old purchase through its original price without losing provenance", () => {
    let old = finishCreation(newTdvCharacter("reference", "legacy"));
    old = grantMilestone(old);
    old = advanceCapability(old, "Luta", false);
    const converted = adoptFoundation(old),
      reversed = reverseCapability(converted, "Luta", false);
    expect(constitution(reversed).alinhavos.Luta).toBe(0);
    expect(constitution(reversed).pu).toBe(3);
    expect(JSON.parse(reversed.corrections!.at(-1)!.payload).previousFoundation.legacy.source).toBe(
      JSON.stringify(old),
    );
  });
  it("rounds recovery once, rejects a reused window and preserves conditions", () => {
    let c = setResource(ready(), "pi", 0);
    c = setResource(c, "pe", 0);
    const fronts = { rest: 0, shelter: 1, care: -1, support: 1 };
    expect(recoveryPreview(c, fronts)).toEqual({ pv: 0, pi: 3, pe: 3 });
    const recovered = recoverByFronts(c, fronts, "Acampamento após fuga");
    expect(recovered.conditions).toEqual(c.conditions);
    expect(() => recoverByFronts(recovered, fronts, "Acampamento após fuga")).toThrow();
  });
  it("resolves criticals from actual dice and relative bands", () => {
    expect(readTest(4, 4, 8, 0, { prumo: 8, tento: 6, revision: "VIII" }).critical).toBe(false);
    expect(readTest(8, 6, 14, 0, { prumo: 8, tento: 6, revision: "VIII" }).critical).toBe(true);
    expect(readTest(8, 6, 15, 0, { prumo: 8, tento: 6, revision: "VIII" }).critical).toBe(false);
    expect(readTest(1, 1, 2, 0, { prumo: 8, tento: 6, revision: "VIII" }).criticalFailure).toBe(
      true,
    );
    expect(readTest(3, 4, 6, 0, { prumo: 4, tento: 12, revision: "VIII" })).toMatchObject({
      success: true,
      balanced: false,
      relative: { prumo: 3, tento: 1 },
    });
    expect(
      readTest(6, 2, 5, 0, {
        prumo: 8,
        tento: 6,
        revision: "VIII",
        reading: "Ascendente",
        arremate: { thread: "Tento", minimum: 3 },
      }),
    ).toMatchObject({ success: true, arremateMet: false });
  });
  it("retains the declared Arremate thread when reading the stored outcome", () => {
    const c = ready();
    const request = {
      matrix: "Ímpeto" as const,
      alinhavo: "Luta",
      dt: 5,
      reading: "Arremate" as const,
      arremate: { thread: "Prumo" as const, minimum: 5 },
      prumoPro: 0,
      prumoDes: 0,
      tentoPro: 0,
      tentoDes: 0,
      force: "" as const,
      extraordinary: false,
      counterpart: "",
      context: {
        intention: "Sustentar",
        approach: "Apoio corporal",
        change: "Primeira intervenção",
        point: "Travessia",
        risk: true,
      },
    };
    const rolled = resolveTest(c, request, () => 0.5, { prumo: 6, tento: 2 });
    expect(rolled.character.scene.tests![0].arremate).toEqual({ thread: "Prumo", minimum: 5 });
    const recorded = recordOutcome(rolled.character, rolled.character.scene.tests![0].id, {
      principal: "Apoio conservado",
      opening: "Passagem",
      trace: "",
      devolution: "",
      permanence: "",
      redobra: "",
      support: "",
    });
    expect(recorded.records.at(-1)!.fields).toHaveProperty("Abertura", "Passagem");
  });
  it("charges Forçar by Marco and records effective dice sizes", () => {
    let c = ready();
    for (let i = 0; i < 8; i++) c = grantMilestone(c);
    const request = {
      matrix: "Ímpeto" as const,
      alinhavo: "Luta",
      dt: 8,
      prumoPro: 0,
      prumoDes: 0,
      tentoPro: 0,
      tentoDes: 0,
      force: "Prumo" as const,
      extraordinary: false,
      counterpart: "",
      context: {
        intention: "Abrir passagem",
        approach: "Força",
        change: "Porta oposta",
        point: "Saída",
        risk: true,
      },
    };
    expect(prepareTest(c, request).forcingCost).toBe(2);
    const rolled = resolveTest(c, request, () => 0.5);
    expect(rolled.character.scene.tests![0]).toMatchObject({
      prumoSize: 10,
      tentoSize: 6,
      revision: "VIII",
    });
  });
  it("does not infer Morrendo from zero PV or add marks each round", () => {
    const c = setResource(setResource(ready(), "pv", 0), "pe", 0);
    expect(c.conditions.map((i) => i.name)).toEqual(["Incapacitada", "Sucumbindo"]);
    expect(() => changeCrisis(c, "dying", 1)).toThrow(/Morrendo/);
    const s = {
      ...newTdvMaster(),
      participants: [
        {
          id: "p",
          sheetId: "c",
          name: "Iria",
          cadence: 2,
          score: null,
          impulses: 2,
          response: true,
          position: "Disputada" as const,
        },
      ],
    };
    expect(nextRound(s, [{ id: "c", tdv2_data: c }]).participants[0]).toMatchObject({
      impulses: 1,
      response: false,
    });
    expect(c.crisisMarks).toBeUndefined();
  });
  it("conserves load zero, quantities and unclassified old equipment", () => {
    const c = {
      ...ready(),
      records: [
        {
          id: "1",
          kind: "Equipamento" as const,
          name: "Ferramentas",
          fields: { Espaços: "2", Quantidade: "3" },
        },
        { id: "2", kind: "Arma" as const, name: "Antiga", fields: {} as Record<string, string> },
      ],
    };
    expect(cargoProfile(c)).toMatchObject({ used: 6, capacity: 9, unclassified: 1 });
  });
  it("limits bond advancement and Convicção by scene", () => {
    let c = ready();
    c.face.conviction = "Proteger testemunhos";
    c = advanceBond(c, c.face.links[0].id);
    expect(c.face.links[0]).toMatchObject({ grade: 3, state: "Sólido" });
    expect(() => advanceBond(c, c.face.links[0].id)).toThrow();
    c = invokeConviction(c, "Lastro", "Assumir a exposição");
    expect(() => invokeConviction(c, "Nexo", "Novo custo")).toThrow();
  });
});
describe("Malha: procedimentos facultativos", () => {
  it("adds Ascendente only after successful Enlace and retains failed progress", () => {
    let o = {
      ...newOperation("Prolongada"),
      objective: "Abrir o selo",
      dt: 8,
      computation: { reading: "Ascendente" as const, target: 20, progress: 0 },
    };
    const step = {
      stageIds: [],
      intention: "Afrouxar",
      approach: "Ferramenta",
      change: "Primeiro suporte",
      evidence: "",
      rest: "",
      participants: "",
      resolution: "Teste" as const,
      prumo: 4,
      tento: 5,
      broadens: false,
    };
    o = registerOperationStep(o, step) as typeof o;
    expect(o.computation.progress).toBe(5);
    o = registerOperationStep(o, {
      ...step,
      change: "Segundo suporte",
      prumo: 2,
      tento: 2,
    }) as typeof o;
    expect(o.computation.progress).toBe(5);
  });
  it("examines two new faces per successful search without discarding hideouts", () => {
    let o = {
      ...newOperation("Malha"),
      malha: {
        branch: "Ocultação" as const,
        fields: {},
        shadow: { signal: 5, examined: [], hideouts: [{ id: "h", name: "Mureta", valid: true }] },
      },
    };
    o = searchShadow(o, [1, 2]) as typeof o;
    expect(() => searchShadow(o, [2, 3])).toThrow();
    o = searchShadow(o, [3, 4]) as typeof o;
    o = searchShadow(o, [5, 6]) as typeof o;
    expect(o.malha.shadow.examined).toHaveLength(6);
    expect(o.malha.shadow.hideouts[0].valid).toBe(true);
  });
});
