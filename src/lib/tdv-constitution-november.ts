import { constitution, novemberConstitution, type TdvCharacter } from "./tdv2";
export { NOVEMBER_REVISION, novemberConstitution, type ReserveValues } from "./tdv2";

export function previewNovember(c: TdvCharacter, marco = c.milestones.length) {
  const current = constitution(c);
  const modifiers = { pv: 0, pi: 0, pe: 0, ...c.resourceModifiers };
  return {
    current,
    projection: novemberConstitution(marco, current.matrices, current.reinforcements, modifiers),
  };
}
