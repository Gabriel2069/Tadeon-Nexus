// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MaterialGallery } from "./material-gallery";
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("preserves the draft after rejection, prevents concurrent submits and retries successfully", () => {
  render(<MaterialGallery />);
  const input = screen.getByLabelText("Registro de ensaio") as HTMLInputElement;
  fireEvent.change(input, { target: { value: "Registro preservado" } });
  fireEvent.click(screen.getByLabelText("Simular erro no envio"));
  fireEvent.click(screen.getByRole("button", { name: "Simular envio" }));
  expect(
    (screen.getByRole("button", { name: "Enviando ensaio…" }) as HTMLButtonElement).disabled,
  ).toBe(true);
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByRole("alert").textContent).toContain("texto foi preservado");
  expect(input.value).toBe("Registro preservado");
  fireEvent.click(screen.getByLabelText("Simular erro no envio"));
  fireEvent.click(screen.getByRole("button", { name: "Tentar ensaio novamente" }));
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByRole("status").textContent).toContain("Ensaio confirmado");
});
it("keeps the draft in read-only mode and cancels the outstanding timer on unmount", () => {
  const { unmount } = render(<MaterialGallery />);
  fireEvent.click(screen.getByLabelText("Somente leitura"));
  expect((screen.getByLabelText("Registro de ensaio") as HTMLInputElement).readOnly).toBe(true);
  expect(
    (screen.getByRole("button", { name: "Simular envio" }) as HTMLButtonElement).disabled,
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Restaurar ensaio" }));
  fireEvent.click(screen.getByRole("button", { name: "Simular envio" }));
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
