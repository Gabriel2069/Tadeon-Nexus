import { describe, expect, it } from "vitest";
import { newTdvCharacter, finishCreation, constitution, advanceCapability, invest, grantMilestone, capabilityCost, grantPractice, NOVEMBER_REVISION } from "./tdv2";
import { novemberConstitution, previewNovember } from "./tdv-constitution-november";
import { threatFrame, traceDirectEncounter } from "./tdv-encounter-trace";
import catalog from "@/data/tdv-arsenal-v09.json";

const zero = { pv: 0, pi: 0, pe: 0 };
const matrices = { Ímpeto: 2, Lastro: 2, Cadência: 2, Nexo: 2 };
const scenario = {
  prumo: 12,
  tento: 12,
  impact: 8,
  guard: 13,
  pp: 227,
  opportunities: 6,
  reduction: 0,
  accessible: true,
};

describe("Caderno de novembro", () => {
  it("reproduz as 21 linhas de reservas da fonte e os créditos dos seis Patamares", () => {
    const points = Array.from({ length: 21 }, (_, m) =>
      novemberConstitution(m, matrices, zero, zero),
    );
    expect(points.map((p) => p.bases.pv)).toEqual([
      12, 14, 16, 18, 21, 23, 25, 27, 30, 32, 34, 36, 39, 41, 43, 45, 48, 50, 52, 54, 57,
    ]);
    expect(points.map((p) => p.bases.pi)).toEqual([
      9, 10, 12, 14, 17, 18, 20, 22, 25, 26, 28, 30, 33, 34, 36, 38, 41, 42, 44, 46, 49,
    ]);
    expect(points.map((p) => p.bases.pe)).toEqual(Array.from({ length: 21 }, (_, i) => 6 + i));
    expect(points.filter((p) => p.marco % 4 === 0).map((p) => p.credit)).toEqual([
      10, 28, 46, 64, 82, 100,
    ]);
    expect(points[20].maximums).toEqual({ pv: 61, pi: 53, pe: 30 });
  });
  it("compara sem escrever ou curar fichas VIII e anteriores", () => {
    for (const revision of ["VIII", "legacy"] as const) {
      const c = newTdvCharacter("reference", revision);
      c.resources.pv = 2;
      const before = structuredClone(c);
      const { projection } = previewNovember(c, 20);
      expect(projection.revision).toBe("TDV-2026-11-23");
      expect(c).toEqual(before);
    }
    expect(
      novemberConstitution(4, matrices, { pv: 2, pi: 1, pe: 1 }, { pv: -1, pi: 0, pe: 1 }).maximums,
    ).toEqual({ pv: 28, pi: 23, pe: 16 });
    expect(() => novemberConstitution(0, matrices, { ...zero, pi: 2 }, zero)).toThrow();
  });
  it("aplica a tabela da edição na ficha jogável e conserva o orçamento da Fundação VIII", () => {
    const sealed = finishCreation(newTdvCharacter("reference", NOVEMBER_REVISION));
    expect(constitution(sealed).pu).toBe(10);
    expect([0,1,2,3,4].map(grade => capabilityCost(sealed,grade,true))).toEqual([2,3,4,5,8]);
    expect([0,1,2,3].map(grade => capabilityCost(sealed,grade,false))).toEqual([2,2,3,4]);
    const skilled = advanceCapability(sealed, "Iniciativa", false);
    const reinforced = invest(skilled, { kind: "Reforço", target: "pe", cost: 1, reason: "Aprendizado", transcendent: false });
    expect(constitution(reinforced)).toMatchObject({ pu: 7, spent: 3, maximums: { pv: 16, pi: 13, pe: 11 } });
    expect(reinforced.resources.pe).toBe(10);
    let developed = reinforced;
    for (let m = 1; m <= 20; m++) developed = grantMilestone(developed);
    expect(constitution(developed)).toMatchObject({ pu: 97, spent: 3, maximums: { pv: 61, pi: 53, pe: 31 } });
    expect(() => grantPractice(sealed, "Crédito da edição anterior", 2)).toThrow();
    expect(constitution(finishCreation(newTdvCharacter("reference", "VIII"))).pu).toBe(0);
  });
  it("reproduz as bases das vinte Magnitudes, separando PP, Guarda e Entalhes", () => {
    const frames = Array.from({ length: 20 }, (_, i) => threatFrame(i + 1));
    expect(frames.map((f) => f.pp)).toEqual([
      12, 17, 23, 30, 37, 45, 54, 63, 73, 84, 95, 107, 120, 133, 147, 162, 177, 193, 210, 227,
    ]);
    expect(frames.map((f) => f.et)).toEqual([
      10, 13, 16, 19, 24, 27, 30, 33, 38, 41, 44, 47, 52, 55, 58, 61, 66, 69, 72, 75,
    ]);
    expect(frames[19].guard).toBe(13);
    for (const m of [0, 1.5, 21]) expect(() => threatFrame(m)).toThrow();
  });
  it("calcula a referência de 7,76 rodadas e os casos sem progresso", () => {
    const trace = traceDirectEncounter(scenario);
    expect(trace.chance).toBe(13 / 24);
    expect(trace.dpr).toBe(29.25);
    expect(trace.rounds).toBeCloseTo(7.76, 2);
    for (const change of [
      { opportunities: 0 },
      { reduction: 16 },
      { accessible: false },
      { guard: 25 },
    ])
      expect(traceDirectEncounter({ ...scenario, ...change }).rounds).toBeNull();
    expect(traceDirectEncounter({ ...scenario, pp: 0 }).rounds).toBe(0);
    expect(traceDirectEncounter({ ...scenario, impact: 4, reduction: 7 }).expectedImpact).toBe(
      1 / 16,
    );
  });
  it("mantém o inventário do Arsenal v0.9 identificável por registro", () => {
    expect(catalog.items.filter((i) => i.kind === "Arma")).toHaveLength(30);
    const gear = catalog.items.filter((i) => i.kind === "Equipamento");
    expect(gear).toHaveLength(30);
    expect(new Set(gear.map((i) => i.group)).size).toBe(10);
    expect(new Set(catalog.items.map((i) => i.id)).size).toBe(60);
    expect(catalog.damageTypes).toHaveLength(12);
  });
});
