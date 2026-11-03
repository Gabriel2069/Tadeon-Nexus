import { expect, it } from "vitest";
import {
  newTdvCharacter,
  constitution,
  setResource,
  setResourceModifier,
  withResourceConditions,
  addCapabilityEffect,
  prepareTest,
  resolveTest,
  readTest,
  endCharacterScene,
  tdv2CharacterSchema,
} from "./tdv2";
import { payDeclared, recordOutcome } from "./tdv2-play";
const ready = () => ({ ...newTdvCharacter("reference"), ready: true });
const request = {
  matrix: "Nexo" as const,
  alinhavo: "Investigação",
  dt: 14,
  prumoPro: 0,
  prumoDes: 0,
  tentoPro: 0,
  tentoDes: 0,
  force: "" as const,
  extraordinary: false,
  counterpart: "",
};
it("modifies resource capacity while preserving the independent defense formulas", () => {
  const c = ready(),
    base = constitution(c);
  let next = setResourceModifier(c, "pv", 5);
  expect(constitution(next).maximums.pv).toBe(base.maximums.pv + 5);
  expect(next.resources.pv).toBe(c.resources.pv);
  expect(constitution(next).defenses).toEqual(base.defenses);
  next = setResourceModifier(next, "pi", -3);
  expect(next.resources.pi).toBe(base.maximums.pi - 3);
  expect(constitution(next).defenses).toEqual(base.defenses);
  expect(
    setResourceModifier({ ...c, resources: { ...c.resources, pv: 3 } }, "pv", 5).resources.pv,
  ).toBe(3);
  expect(() => setResourceModifier(c, "pv", NaN)).toThrow();
  expect(() => setResourceModifier(c, "pv", 1.5)).toThrow();
});
it("adds canonical zero conditions once, without turning effort exhaustion into a general penalty", () => {
  const c = ready();
  expect(withResourceConditions(c)).toBe(c);
  const pv = setResource(c, "pv", 0);
  expect(pv.critical).toBe("Incapacitada");
  expect(pv.conditions.filter((x) => x.id === "tdv-zero-pv")).toHaveLength(1);
  expect(withResourceConditions(pv).conditions).toHaveLength(1);
  const pi = payDeclared(c, { id: "cost", source: "Regra declarada", pe: 0, pi: c.resources.pi });
  expect(pi.conditions.find((x) => x.id === "tdv-zero-pi")?.intensity).toBe("Crítica");
  const pe = setResource(c, "pe", 0);
  expect(pe.conditions.find((x) => x.id === "tdv-zero-pe")?.intensity).toBe("Leve");
  expect(() => prepareTest(pe, request)).not.toThrow();
  expect(setResource(pe, "pe", 1).conditions).toHaveLength(0);
  const zero = setResourceModifier(c, "pv", -100);
  expect(zero.resources.pv).toBe(0);
  expect(zero.conditions[0].name).toBe("Incapacitada");
});
it("cancels portable Proveito/Desproveito at one category, keeping purchased grades intact", () => {
  const c = ready();
  let next = addCapabilityEffect(c, "Nexo", "Proveito", 1);
  next = addCapabilityEffect(next, "Nexo", "Proveito", 1);
  expect(prepareTest(next, request).prumo).toBe(12);
  next = addCapabilityEffect(next, "Nexo", "Desproveito", 1);
  expect(prepareTest(next, request).prumo).toBe(12);
  next = addCapabilityEffect(next, "Nexo", "Desproveito", 1);
  expect(prepareTest(next, request).prumo).toBe(10);
  expect(next.matrices).toEqual(c.matrices);
  expect(c.temporaryEffects).toBeUndefined();
});
it("applies numeric declarations to Enlace and freezes the modifier with an optional recorded test", () => {
  let c = addCapabilityEffect(ready(), "Nexo", "Bônus", 5, "Instrumento");
  c = addCapabilityEffect(c, "Investigação", "Bônus", -2, "Obstáculo");
  const resolved = resolveTest(
    c,
    {
      ...request,
      context: {
        risk: true,
        intention: "Ler o selo",
        approach: "Examinar os fios",
        point: "Abrir acesso",
        change: "Primeira intervenção",
      },
    },
    () => 0,
    { prumo: 6, tento: 6 },
  );
  expect(resolved.result).toMatchObject({
    prumo: 6,
    tento: 6,
    enlace: 15,
    modifier: 3,
    consonance: true,
    ascendente: 6,
    desvio: 0,
    success: true,
  });
  expect(resolved.character.scene.tests?.[0].modifier).toBe(3);
  expect(readTest(1, 1, 2, 100).criticalFailure).toBe(true);
  const stored = { ...resolved.character, temporaryEffects: [] };
  const outcome = recordOutcome(stored, stored.scene.tests![0].id, {
    principal: "Acesso aberto",
    opening: "",
    trace: "",
    devolution: "",
    permanence: "",
    redobra: "",
    support: "",
  });
  expect(outcome.records.at(-1)?.fields["Dados originais"]).toContain("6 + 6 + 3 = 15");
  expect(
    prepareTest(c, { ...request, helper: { name: "Elen", grade: 2, contribution: "Lê os sinais" } })
      .bonus,
  ).toBe(5);
});
it("clears only scene effects at the explicit scene boundary and never kills from manual risk marks", () => {
  const c = {
    ...addCapabilityEffect(setResource(ready(), "pv", 0), "Nexo", "Proveito", 1),
    crisisMarks: { dying: 3, collapse: 3 },
  };
  const next = endCharacterScene(c);
  expect(next.temporaryEffects).toEqual([]);
  expect(next.resources).toEqual(c.resources);
  expect(next.conditions).toEqual(c.conditions);
  expect(next.critical).toBe("Incapacitada");
});
it("keeps familiarity descriptive and rejects malformed new fields", () => {
  const c = ready(),
    familiar = {
      ...c,
      creation: { groupReason: "", reviewed: false, familiarities: ["Luta" as const] },
    };
  expect(prepareTest(familiar, { ...request, alinhavo: "Luta" })).toEqual(
    prepareTest(c, { ...request, alinhavo: "Luta" }),
  );
  expect(
    tdv2CharacterSchema.safeParse({ ...c, resourceModifiers: { pv: 0.5, pi: 0, pe: 0 } }).success,
  ).toBe(false);
  expect(
    tdv2CharacterSchema.safeParse({ ...c, crisisMarks: { dying: 4, collapse: 0 } }).success,
  ).toBe(false);
  expect(
    tdv2CharacterSchema.safeParse({
      ...c,
      temporaryEffects: [{ id: "x", target: "Tudo", kind: "Proveito", value: 1, note: "" }],
    }).success,
  ).toBe(false);
});
