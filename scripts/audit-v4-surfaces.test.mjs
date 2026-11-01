// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { inspectModule } from "./audit-v4-surfaces.mjs";
import { captureSurfaceCensus } from "./surface-census.mjs";

describe("V4 source census boundaries", () => {
  it("distinguishes an unused bridge import from an actual JSX reference and keeps conditional guards", () => {
    const result = inspectModule(
      `import { Mounted, Unused } from './bridges';
      export const Route = createFileRoute('/sheet/$id')({component: () => <>
      {canEdit && <Mounted canEdit={canEdit} onSave={save} />}
      <input readOnly={!canEdit} aria-label="Nome" onChange={update} /></>});`,
      "fixture.tsx",
    );
    expect(result.imports[0].names).toEqual(["Mounted", "Unused"]);
    expect(result.renders.map((r) => r.component)).not.toContain("Unused");
    expect(result.renders.map((r) => r.component)).toContain("Mounted");
    expect(result.routes).toEqual(["/sheet/$id"]);
    expect(result.guards.map((g) => g.expression)).toContain("input readOnly={!canEdit}");
    expect(result.actions.find((a) => a.event === "onSave")?.certification).toBe("source-only");
  });
  it("does not mistake a table name in prose for a persistent write or claim a dynamic target is known", () => {
    const result = inspectModule(
      `const prose = 'db.from("secret")';
      db.from('character_sheets'); db.rpc(operation); import('./lazy');`,
      "fixture.ts",
    );
    expect(result.data).toEqual([
      { operation: "from", target: "character_sheets", line: 2 },
      { operation: "rpc", target: "[dynamic]", line: 2 },
    ]);
    expect(result.imports[0]).toMatchObject({ kind: "dynamic", specifier: "./lazy" });
  });
  it("recognizes a lazy JSX alias without declaring that its branch mounted", () => {
    const result = inspectModule(
      `const Radial = lazy(() => import('./radial').then(m => ({default:m.Radial}))); const view = master && <Radial />;`,
      "fixture.tsx",
    );
    expect(result.imports[0]).toMatchObject({ kind: "dynamic", names: ["Radial"] });
    expect(result.renders[0].component).toBe("Radial");
  });
  it("refuses production capture before reading any page controls", async () => {
    await expect(
      captureSurfaceCensus(
        { url: () => "https://tadeon-nexus.gtadeusz.workers.dev/" },
        { path: "never-written.json", state: "test" },
      ),
    ).rejects.toThrow("local fixtures");
  });
  it("does not copy textarea or contenteditable values into the census", async () => {
    const dir = mkdtempSync(tmpdir() + "/tadeon-census-");
    const textarea = document.createElement("textarea");
    textarea.textContent = "PRIVATE DRAFT";
    const editor = document.createElement("div");
    editor.setAttribute("contenteditable", "true");
    editor.textContent = "PRIVATE EDITOR";
    const button = document.createElement("button");
    button.textContent = "Salvar";
    const page = {
      url: () => "http://127.0.0.1:5173/sheet/fixture",
      viewportSize: () => ({ width: 390, height: 844 }),
      locator: () => ({ evaluateAll: async (fn) => fn([textarea, editor, button]) }),
    };
    try {
      await captureSurfaceCensus(page, { path: dir + "/census.json", state: "fixture" });
      const output = readFileSync(dir + "/census.json", "utf8");
      expect(output).not.toContain("PRIVATE");
      expect(JSON.parse(output).controls[2].label).toBe("Salvar");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
