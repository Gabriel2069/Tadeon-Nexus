// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useState } from "react";
import { newTdvCharacter, type TdvCharacter } from "@/lib/tdv2";
import { TdvCreationLoom, TdvFamiliarities } from "./tdv2-creation-loom";
afterEach(cleanup);
it("keeps the eight book steps navigable and requires a real final review", () => {
  const initial = newTdvCharacter("reference");
  Object.assign(initial.face, {
    origin: "Cais",
    occupation: "Registradora",
    conviction: "Preservar testemunhos",
    limit: "Não entregar Elen",
  });
  initial.face.anchor.detail = "A promessa";
  initial.face.links[0].node = "Elen";
  initial.face.links[0].nature = "Confiança";
  initial.creation = { groupReason: "Recuperar o testemunho", familiarities: [], reviewed: false };
  const select = vi.fn();
  function Fixture() {
    const [c, set] = useState<TdvCharacter>(initial);
    return (
      <>
        <TdvCreationLoom character={c} onChange={set} canEdit onSelect={select} />
        <output data-testid="ready">{String(c.ready)}</output>
      </>
    );
  }
  render(<Fixture />);
  fireEvent.click(screen.getByText("Explorar os oito passos e revisar a criação"));
  expect(
    screen.getByRole("button", { name: "Concluir criação TdV II" }).hasAttribute("disabled"),
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Criação: Equipar" }));
  expect(select).toHaveBeenCalledWith("expressao");
  fireEvent.click(screen.getByText(/Conferir a criação/));
  fireEvent.click(
    screen.getByLabelText(
      "Conferi permissões ficcionais, equipamento, Condições iniciais e capacidade",
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Concluir criação TdV II" }));
  expect(screen.getByTestId("ready").textContent).toBe("true");
});
it("limits optional familiarity choices to four and releases a choice when deselected", () => {
  function Fixture() {
    const [c, set] = useState(newTdvCharacter());
    return <TdvFamiliarities character={c} onChange={set} canEdit />;
  }
  render(<Fixture />);
  fireEvent.click(screen.getByText(/Familiaridades de Feição/));
  for (const name of ["Atletismo", "Luta", "Pontaria", "Furtividade"])
    fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
  expect(screen.getByRole("button", { name: /Engenharia/ }).hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: /Luta/ }));
  expect(screen.getByRole("button", { name: /Engenharia/ }).hasAttribute("disabled")).toBe(false);
});
