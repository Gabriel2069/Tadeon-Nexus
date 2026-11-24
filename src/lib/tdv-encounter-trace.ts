import { DICE, probabilityProfile } from "./tdv2";

// Caderno VII.7, VIII.3 and IX. Preparation never changes a scene.
export function threatFrame(magnitude: number) {
  if (!Number.isInteger(magnitude) || magnitude < 1 || magnitude > 20)
    throw new RangeError("Magnitude fora da escala I a XX.");
  const n = magnitude - 1;
  return {
    pp: 12 + 5 * n + Math.floor(n ** 2 / 3),
    guard: 8 + Math.floor(magnitude / 4),
    et: 10 + 3 * n + 2 * Math.floor(n / 4),
  };
}

export function traceDirectEncounter(input: {
  prumo: number;
  tento: number;
  guard: number;
  opportunities: number;
  impact: number;
  reduction: number;
  pp: number;
  accessible: boolean;
}) {
  const { prumo, tento, guard, opportunities, impact, reduction, pp, accessible } = input;
  if (
    ![4, 6, 8, 10].includes(impact) ||
    ![guard, opportunities, reduction, pp].every((n) => Number.isSafeInteger(n) && n >= 0) ||
    !DICE.some((d) => d === prumo) ||
    !DICE.some((d) => d === tento)
  )
    throw new RangeError("Hipótese de confronto inválida.");
  const chance = probabilityProfile(prumo, tento, guard).success;
  let totalDamage = 0;
  for (let a = 1; a <= impact; a++)
    for (let b = 1; b <= impact; b++) totalDamage += Math.max(0, a + b - reduction);
  const expectedImpact = totalDamage / (impact * impact);
  const dpr = accessible ? opportunities * chance * expectedImpact : 0;
  return { chance, expectedImpact, dpr, rounds: pp === 0 ? 0 : dpr > 0 ? pp / dpr : null };
}
