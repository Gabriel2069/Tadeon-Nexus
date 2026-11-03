// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TdvConditions } from "./tdv2-conditions";
import { newTdvCharacter, setResource, type TdvCharacter } from "@/lib/tdv2";
afterEach(cleanup);
it.each(["Incapacitada", "À Beira", "Morta"] as const)(
  "ends a recovered physical condition while respecting critical state %s",
  (critical) => {
    const zero = setResource(newTdvCharacter("reference", "legacy"), "pv", 0);
    const c: TdvCharacter = { ...zero, critical, resources: { ...zero.resources, pv: 1 } };
    const change = vi.fn();
    render(<TdvConditions character={c} onChange={change} canEdit />);
    fireEvent.click(screen.getByRole("button", { name: /^Incapacitada/ }));
    fireEvent.click(screen.getByRole("button", { name: "Saída cumprida" }));
    expect(change).toHaveBeenCalledTimes(1);
    expect(change.mock.calls[0][0].critical).toBe(critical === "Morta" ? "Morta" : "Ativa");
    expect(change.mock.calls[0][0].conditions).toEqual([]);
    expect(change.mock.calls[0][0].resources.pv).toBe(1);
  },
);
it("keeps incapacitation active while Vitality remains zero", () => {
  const change = vi.fn();
  render(
    <TdvConditions
      character={setResource(newTdvCharacter("reference", "legacy"), "pv", 0)}
      onChange={change}
      canEdit
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /^Incapacitada/ }));
  const exit = screen.getByRole("button", { name: "Saída cumprida" });
  expect((exit as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(exit);
  expect(change).not.toHaveBeenCalled();
});
