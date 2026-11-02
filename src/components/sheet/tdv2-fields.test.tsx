// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TdvChoices, TdvInscription } from "./tdv2-fields";
afterEach(cleanup);
it("keeps reading visible and commits inline writing on blur and cancels with Escape", async () => {
  const change = vi.fn();
  render(<TdvInscription label="Convicção" value="Preservar testemunhos" onChange={change} />);
  expect(screen.queryByRole("textbox")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Editar Convicção" }));
  fireEvent.change(await screen.findByLabelText("Convicção"), {
    target: { value: "Preservar vidas" },
  });
  expect(change).not.toHaveBeenCalled();
  fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
  expect(screen.queryByRole("textbox")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Editar Convicção" }));
  const field = (await screen.findByLabelText("Convicção")) as HTMLTextAreaElement;
  expect(field.value).toBe("Preservar testemunhos");
  fireEvent.change(field, { target: { value: "Preservar vidas" } });
  fireEvent.blur(field);
  expect(change).toHaveBeenCalledExactlyOnceWith("Preservar vidas");
});
it("does not expose a writing action in read-only mode", () => {
  render(<TdvInscription label="Origem" value="O cais" onChange={vi.fn()} disabled />);
  expect(screen.getByText("O cais")).toBeTruthy();
  expect(screen.queryByRole("button")).toBeNull();
  expect(screen.queryByRole("textbox")).toBeNull();
});
it("keeps native single-choice semantics and read-only boundaries", () => {
  const change = vi.fn();
  const props = {
    label: "Intensidade",
    value: "Leve",
    options: ["Leve", "Grave", "Crítica"],
    onChange: change,
  };
  const { rerender } = render(<TdvChoices {...props} />);
  expect((screen.getByRole("radio", { name: "Leve" }) as HTMLInputElement).checked).toBe(true);
  fireEvent.click(screen.getByRole("radio", { name: "Grave" }));
  expect(change).toHaveBeenCalledExactlyOnceWith("Grave");
  rerender(<TdvChoices {...props} disabled />);
  expect(
    (screen.getByRole("radio", { name: "Grave" }) as HTMLInputElement).closest("fieldset")
      ?.disabled,
  ).toBe(true);
});
