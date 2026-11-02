// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Tdv2Sheet } from "./tdv2-sheet";
import { newTdvCharacter } from "@/lib/tdv2";

it("offers the full creation review on an older draft without changing its saved data on read", () => {
  const character = newTdvCharacter("reference");
  const before = JSON.stringify(character);
  const change = vi.fn();
  const html = renderToStaticMarkup(
    <Tdv2Sheet character={character} onChange={change} canEdit isMaster />,
  );
  expect(html).toContain("Razão para entrar na primeira situação");
  expect(html).toContain("Revisar criação");
  expect(JSON.stringify(character)).toBe(before);
  expect(change).not.toHaveBeenCalled();
});

afterEach(cleanup);
it("applies only reviewed choices and preserves concurrent resources and records", async () => {
  const character = newTdvCharacter("reference");
  character.ready = true;
  character.progression = { allowCreation: true, allowMilestones: false };
  Object.assign(character.face, {
    origin: "Cais",
    occupation: "Registradora",
    conviction: "Preservar",
    limit: "Não abandonar",
  });
  character.face.anchor.detail = "Promessa";
  character.face.links[0].node = "Elen";
  character.face.links[0].nature = "Confiança";
  const change = vi.fn();
  const props = { character, onChange: change, canEdit: true, isMaster: true };
  const view = render(<Tdv2Sheet {...props} />);
  fireEvent.mouseDown(screen.getByRole("tab", { name: "Percurso" }), {
    button: 0,
    ctrlKey: false,
  });
  fireEvent.click(await screen.findByRole("button", { name: "Correções e permissões" }));
  fireEvent.click(await screen.findByRole("button", { name: "Rever escolhas iniciais" }));
  expect(screen.getByRole("button", { name: "Retirar 1 PV" }).hasAttribute("disabled")).toBe(true);
  const updated = {
    ...character,
    resources: { ...character.resources, pv: 3 },
    records: [
      {
        id: "kept",
        kind: "Equipamento" as const,
        name: "Corda",
        fields: { Descrição: "Preservada" },
      },
    ],
  };
  view.rerender(<Tdv2Sheet {...props} character={updated} />);
  fireEvent.click(screen.getByRole("button", { name: "Salvar escolhas iniciais" }));
  expect(change.mock.calls.at(-1)?.[0]).toMatchObject({
    resources: { pv: 3 },
    records: updated.records,
  });
});
