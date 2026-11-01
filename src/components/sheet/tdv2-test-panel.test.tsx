// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { newTdvCharacter } from "@/lib/tdv2";
import { TdvTestPanel } from "./tdv2-test-panel";
import { TdvCompetency } from "./tdv2-competencies";
beforeEach(() => {
  vi.spyOn(Math, "random").mockReturnValue(0.5);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("offers an immediate roll without narrative fields or a persisted diary entry", () => {
  const onChange = vi.fn();
  render(
    <TdvTestPanel
      character={{ ...newTdvCharacter(), ready: true }}
      onChange={onChange}
      canEdit
      quick
    />,
  );
  expect(screen.queryByLabelText("Intenção")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Rolar os dois Fios" }));
  expect(screen.getByText("Enlace")).toBeTruthy();
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByLabelText("Registrar a próxima rolagem"));
  fireEvent.change(screen.getByLabelText("Intenção"), { target: { value: "Abrir o portão" } });
  fireEvent.change(screen.getByLabelText("Abordagem"), { target: { value: "Ler as travas" } });
  fireEvent.click(screen.getByLabelText("Existe risco ou oposição relevante"));
  fireEvent.click(screen.getByRole("button", { name: "Rolar os dois Fios" }));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].scene.tests).toHaveLength(1);
});
it("keeps ordinary competence distinct from limitation and disables read-only rolling", () => {
  const roll = vi.fn();
  render(
    <>
      <TdvCompetency name="Luta" grade={0} onRoll={roll} disabled />
      <TdvCompetency name="Nexo" grade={0} matrix onRoll={roll} disabled />
      <TdvCompetency name="Selagem" grade={4} onRoll={roll} disabled />
    </>,
  );
  expect(screen.getByText("Grau 0 · Comum")).toBeTruthy();
  expect(screen.getByText("Categoria 0 · Limitado")).toBeTruthy();
  expect(screen.getByText("Grau 4 · Especialista")).toBeTruthy();
  const button = screen.getByRole("button", {
    name: "Rolar Selagem · Grau 4 · Especialista · d12",
  }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  fireEvent.click(button);
  expect(roll).not.toHaveBeenCalled();
});
