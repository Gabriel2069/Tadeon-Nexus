import { expect, it } from "vitest";
import {
  newTdvCharacter,
  prepareTest,
  conditionImpact,
  declareConditionImpact,
  capabilityConditions,
  tdv2CharacterSchema,
} from "./tdv2";
const request = {
  matrix: "Nexo" as const,
  alinhavo: "Investigação",
  dt: 10,
  prumoPro: 0,
  prumoDes: 0,
  tentoPro: 0,
  tentoDes: 0,
  force: "" as const,
  extraordinary: false,
  counterpart: "",
};
function fixture() {
  const c = newTdvCharacter("reference");
  c.ready = true;
  c.matrices.Nexo = 2;
  c.conditions = [
    {
      id: "wound",
      name: "Sobressalto",
      intensity: "Crítica",
      origin: "Cais",
      exit: "Recuperar a calma",
      effect: "Nexo difícil; −2 em tudo",
    },
  ];
  return c;
}
it("does not infer effects from intensity or prose", () => {
  const c = fixture(),
    before = JSON.stringify(c);
  expect(prepareTest(c, request)).toMatchObject({ prumo: 8, tento: 8 });
  expect(conditionImpact("Desproveito em Nexo.")).toBeNull();
  expect(conditionImpact("Fio declarado · Desproveito · Tudo")).toBeNull();
  expect(JSON.stringify(c)).toBe(before);
});
it("preserves prose and schema compatibility through declaration and reversal", () => {
  const c = fixture(),
    prose = c.conditions[0].effect;
  c.conditions[0].effect = declareConditionImpact(prose, "Desproveito", "Nexo");
  expect(tdv2CharacterSchema.parse(c).conditions[0].effect).toBe(c.conditions[0].effect);
  expect(declareConditionImpact(c.conditions[0].effect, "Descrição apenas", "")).toBe(prose);
  expect(() => declareConditionImpact(prose, "Desproveito", "Tudo")).toThrow("válida");
});
it("cancels one source at a time with one-category cap and no grade mutation", () => {
  const c = fixture();
  c.conditions[0].effect = declareConditionImpact("", "Desproveito", "Nexo");
  expect(prepareTest(c, request).prumo).toBe(6);
  expect(prepareTest(c, { ...request, prumoPro: 1 }).prumo).toBe(8);
  c.conditions.push({ ...c.conditions[0], id: "two" });
  expect(prepareTest(c, { ...request, prumoPro: 1 }).prumo).toBe(6);
  expect(prepareTest(c, { ...request, prumoPro: 2 }).prumo).toBe(8);
  expect(prepareTest(c, { ...request, prumoDes: 20 }).prumo).toBe(6);
  expect(c.matrices.Nexo).toBe(2);
  expect(capabilityConditions(c, "Lastro")).toHaveLength(0);
  c.conditions = [];
  expect(prepareTest(c, request).prumo).toBe(8);
});
it("does not transfer the actor's skill disadvantage to a helper's Tento", () => {
  const c = fixture();
  c.conditions[0].effect = declareConditionImpact("", "Desproveito", "Investigação");
  expect(prepareTest(c, request).tento).toBe(6);
  expect(
    prepareTest(c, {
      ...request,
      helper: { name: "Elen", grade: 2, contribution: "Lê as inscrições" },
    }).tento,
  ).toBe(8);
});
it("blocks only an explicit scope and removes it on exit", () => {
  const c = fixture();
  c.conditions[0].effect = declareConditionImpact("", "Impedimento", "Investigação");
  expect(() => prepareTest(c, request)).toThrow("está impedido");
  expect(() => prepareTest(c, { ...request, alinhavo: "Iniciativa" })).not.toThrow();
  expect(() =>
    prepareTest(c, { ...request, helper: { name: "Elen", grade: 2, contribution: "Observa" } }),
  ).toThrow("está impedido");
  c.conditions = [];
  expect(() => prepareTest(c, request)).not.toThrow();
});
it("combines shaken and condition sources before Forçar", () => {
  const c = fixture();
  c.scene.shaken = ["Nexo"];
  c.conditions[0].effect = declareConditionImpact("", "Desproveito", "Nexo");
  expect(prepareTest(c, { ...request, prumoPro: 1 }).prumo).toBe(6);
  expect(prepareTest(c, { ...request, prumoPro: 2 }).prumo).toBe(8);
  expect(prepareTest(c, { ...request, prumoPro: 3 }).prumo).toBe(10);
});
