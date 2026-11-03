// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { TdvResourceActions } from "./tdv2-resource-menu";
import { newTdvCharacter, constitution, setResource, setResourceModifier } from "@/lib/tdv2";
afterEach(cleanup);
it("confirms current value and maximum modifier atomically, then exposes zero-resource consequences", () => {
  function Fixture() {
    const [c, set] = useState(newTdvCharacter("reference"));
    const s = constitution(c);
    return (
      <>
        <TdvResourceActions
          name="PV"
          value={c.resources.pv}
          maximum={s.maximums.pv}
          base={s.baseMaximums.pv}
          modifier={c.resourceModifiers?.pv ?? 0}
          disabled={false}
          onChange={(v) => set(setResource(c, "pv", v))}
          onApply={(v, m) => set(setResourceModifier(c, "pv", m, v))}
        />
        <output data-testid="result">
          {JSON.stringify({
            max: s.maximums.pv,
            value: c.resources.pv,
            condition: c.conditions[0]?.name,
          })}
        </output>
      </>
    );
  }
  render(<Fixture />);
  fireEvent.click(screen.getByRole("button", { name: /Ajustar PV/ }));
  fireEvent.change(screen.getByLabelText("Modificador de PV"), { target: { value: "4" } });
  fireEvent.click(screen.getByRole("button", { name: "Aplicar PV" }));
  expect(screen.getByTestId("result").textContent).toContain('"max":14,"value":10');
  fireEvent.click(screen.getByRole("button", { name: /Ajustar PV/ }));
  fireEvent.change(screen.getByLabelText("Modificador de PV"), { target: { value: "-10" } });
  fireEvent.click(screen.getByRole("button", { name: "Aplicar PV" }));
  expect(screen.getByTestId("result").textContent).toContain(
    '"max":0,"value":0,"condition":"Incapacitada"',
  );
});
it("allows readonly consultation while disabling every write", () => {
  const apply = vi.fn();
  render(
    <TdvResourceActions
      name="PI"
      value={5}
      maximum={11}
      base={11}
      modifier={0}
      disabled
      onChange={apply}
      onApply={apply}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /Ajustar PI/ }));
  expect(screen.getByRole("button", { name: "Aplicar PI" }).hasAttribute("disabled")).toBe(true);
  expect(screen.getByLabelText("Modificador de PI").hasAttribute("disabled")).toBe(true);
  expect(apply).not.toHaveBeenCalled();
});
