import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Tdv2Sheet } from "./tdv2-sheet";
import { newTdvCharacter } from "@/lib/tdv2";

it("offers the full creation review on an older draft without changing its saved data on read", () => {
  const character = newTdvCharacter("reference");
  const before = JSON.stringify(character);
  const change = vi.fn();
  const html = renderToStaticMarkup(<Tdv2Sheet character={character} onChange={change} canEdit isMaster />);
  expect(html).toContain("Razão para entrar na primeira situação");
  expect(html).toContain("Revisar criação");
  expect(JSON.stringify(character)).toBe(before);
  expect(change).not.toHaveBeenCalled();
});
