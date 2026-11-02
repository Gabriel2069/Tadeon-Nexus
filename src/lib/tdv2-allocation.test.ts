import { describe, expect, it } from "vitest";
import {
  allocateCreation,
  newTdvCharacter,
  grantMilestone,
  reverseProgression,
  constitution,
  invest,
} from "./tdv2";
describe("creation allocation and correction", () => {
  it("starts d6/d4 and reuses a released choice without generating PU", () => {
    let c = newTdvCharacter();
    expect(Object.values(c.matrices)).toEqual([1, 1, 1, 1]);
    expect(new Set(Object.values(c.alinhavos))).toEqual(new Set([0]));
    c = allocateCreation(allocateCreation(c, "Ímpeto", 3, true), "Cadência", 3, true);
    expect(() => allocateCreation(c, "Nexo", 3, true)).toThrow();
    c = allocateCreation(c, "Cadência", 1, true);
    c = allocateCreation(c, "Nexo", 3, true);
    expect(constitution(c).pu).toBe(0);
    c = allocateCreation(allocateCreation(c, "Luta", 2, false), "Pontaria", 2, false);
    expect(() => allocateCreation(c, "Engenharia", 2, false)).toThrow();
    c = allocateCreation(c, "Luta", 0, false);
    expect(allocateCreation(c, "Engenharia", 2, false).alinhavos.Engenharia).toBe(2);
  });
  it("locks completed choices and requires explicit authorization", () => {
    const c = { ...newTdvCharacter("reference"), ready: true };
    expect(() => allocateCreation(c, "Nexo", 2, true)).toThrow(/mestre/);
    expect(
      allocateCreation(
        { ...c, progression: { allowCreation: true, allowMilestones: false } },
        "Nexo",
        2,
        true,
      ).matrices.Nexo,
    ).toBe(2);
  });
  it("grants and reverses Marcos without losing the earlier record", () => {
    const c = { ...newTdvCharacter("reference"), ready: true };
    const granted = grantMilestone(c);
    expect(constitution(granted)).toMatchObject({ development: 5, pu: 2 });
    const reversed = reverseProgression(granted, "Marco");
    expect(constitution(reversed)).toMatchObject({ development: 0, pu: 0 });
    expect(JSON.parse(reversed.corrections![0].payload)).toEqual(granted.milestones[0]);
  });
  it("cannot reverse spent PU; reverses the investment before the Marco", () => {
    let c = grantMilestone({ ...newTdvCharacter("reference"), ready: true });
    c = invest(c, {
      kind: "Alinhavo",
      target: "Luta",
      cost: 2,
      reason: "Treino",
      transcendent: false,
    });
    expect(() => reverseProgression(c, "Marco")).toThrow(/insuficientes/);
    const returned = reverseProgression(c, "Investimento");
    expect(constitution(returned).pu).toBe(2);
    expect(returned.corrections).toHaveLength(1);
    expect(constitution(reverseProgression(returned, "Marco")).development).toBe(0);
  });
});
