import { verifyInteractive } from "./verify-sheet-interactive.mjs";
import { auditViewports } from "./v4-viewports.mjs";
/** NEX-040: real UI, isolated authenticated fixtures. No production writes. */
import { captureSurfaceCensus } from "./surface-census.mjs";
import { installDesignFonts } from "./design-font-fixtures.mjs";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
const output = process.env.NEXUS_AUDIT_OUTPUT || "/tmp/nexus-tdv2";
mkdirSync(output, { recursive: true });
await build({
  entryPoints: ["src/lib/tdv2.ts"],
  outfile: output + "/engine.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
});
const { newTdvCharacter, finishCreation } = await import(pathToFileURL(output + "/engine.mjs"));
const { chromium } = await import(process.env.NEXUS_BROWSER_MODULE || "playwright-core");
const port = Number(process.env.NEXUS_AUDIT_PORT || 6151);
const assert = (ok, msg) => {
  if (!ok) throw Error(msg);
};
const userId = "00000000-0000-4000-8000-000000000001",
  sheetId = "00000000-0000-4000-8000-000000000010";
const user = {
  id: userId,
  aud: "authenticated",
  role: "authenticated",
  email: "fixture@nexus.test",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  created_at: "2026-01-01T00:00:00Z",
};
const token = [
  { alg: "HS256", typ: "JWT" },
  { sub: userId, aud: "authenticated", role: "authenticated", exp: 2000000000 },
  "fixture",
]
  .map((v) => (typeof v === "string" ? v : Buffer.from(JSON.stringify(v)).toString("base64url")))
  .join(".");
function character() {
  const c = newTdvCharacter("reference");
  Object.assign(c.face, {
    origin: "O cais",
    occupation: "Registradora",
    conviction: "Preservar testemunhos",
    limit: "Não entregar inocentes",
  });
  c.face.anchor.detail = "A promessa a Elen";
  Object.assign(c.face.links[0], { node: "Elen", nature: "Confiança" });
  return finishCreation(c);
}
const server = spawn(
  "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--strictPort", "--port", String(port)],
  { detached: true, stdio: ["ignore", "pipe", "pipe"] },
);
let serverLog = "";
server.stdout.on("data", (b) => (serverLog += b));
server.stderr.on("data", (b) => (serverLog += b));
let browser;
const results = [];
try {
  browser = await chromium.launch({
    executablePath: process.env.NEXUS_CHROMIUM_PATH,
    args: JSON.parse(process.env.NEXUS_CHROMIUM_ARGS || "[]"),
  });
  const deadline = Date.now() + 120000;
  while (true) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}`);
      if (r.ok) break;
    } catch {}
    if (Date.now() > deadline) throw Error("Vite readiness: " + serverLog.slice(-2000));
    await new Promise((r) => setTimeout(r, 500));
  }
  for (const { width, height, viewportKey } of auditViewports())
    for (const role of ["mestre", "espectador"]) {
      let row = {
        id: sheetId,
        owner_id: userId,
        name: "Iria dos testemunhos",
        rules_version: 2,
        tdv2_data: character(),
        updated_at: "2026-10-27T00:00:00.000Z",
        attributes: { COR: 3 },
        stats: { ps_current: 99, pa_current: 88 },
        description: {},
        identity_data: {},
        weapons: [],
        inventory: [],
        defense_items: [],
        fragments_items: [],
        abilities: [],
        purchased_skills: [],
        plots: [],
        skills: {},
        stat_upgrades: {},
        conditions: {},
        power_form_enabled: false,
      };
      if (role === "espectador")
        row.tdv2_data.records.push({
          id: "readonly-trama",
          kind: "Trama",
          name: "A trama consultável",
          fields: { Alvo: "O portão" },
        });
      const legacy = JSON.stringify({ attributes: row.attributes, stats: row.stats });
      let settings = {
        id: "00000000-0000-4000-8000-000000000099",
        key: "global",
        campaign_id: null,
        tdv2_state: {},
        tdv2_revision: 0,
      };
      if (process.env.NEXUS_SHEET_READING_ONLY === "1") {
        row.tdv2_data.face.links[0].offer = "Abrigo e acesso aos arquivos do cais";
        row.tdv2_data.face.links[0].demand = "Preservar a identidade das testemunhas";
        row.tdv2_data.conditions = [
          {
            id: "fixture-condition",
            name: "Ferida no braço",
            origin: "Estilhaços no cais",
            effect: "Dificulta ações que exigem o braço ferido",
            exit: "Receber cuidado e repouso adequado",
            intensity: "Leve",
          },
        ];
      }
      {
        row.power_form_enabled = true;
        row.power_form_data = { notes: "Registro histórico preservado", attributes: { COR: 7 } };
        row.tdv2_data.records.push(
          {
            id: "play-lavor",
            kind: "Lavor",
            name: "Ler os vestígios do cais",
            fields: {
              Gatilho: "Examinar um objeto ligado a um testemunho",
              Efeito: "Reconhecer a marca de sua origem",
            },
          },
          {
            id: "play-trama",
            kind: "Trama",
            name: "A memória dos fios",
            fields: {
              Alvo: "Um testemunho preservado",
              Sustentação: "Conforme a situação ficcional",
            },
          },
        );
      }
      let historicalEditing = false;
      const writes = [],
        errors = [];
      const context = await browser.newContext({
        viewport: { width, height },
        hasTouch: width < 768,
        reducedMotion: width === 1440 ? "no-preference" : "reduce",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(45000);
      page.on("pageerror", (e) => errors.push(e.message));
      await page.addInitScript(
        ({ user, token }) => {
          localStorage.setItem(
            "sb-nkxpstyfrzufsnowjrdi-auth-token",
            JSON.stringify({
              access_token: token,
              refresh_token: "fixture",
              token_type: "bearer",
              expires_in: 86400,
              expires_at: 2000000000,
              user,
            }),
          );
          Math.random = () => 0;
        },
        { user, token },
      );
      await page.route("**/*.supabase.co/**", async (route) => {
        const req = route.request(),
          url = new URL(req.url()),
          path = url.pathname;
        let body = [];
        if (req.method() === "PATCH") {
          const patch = req.postDataJSON();
          assert(role === "mestre", "Readonly mutation");
          writes.push({ path, patch });
          if (path.includes("/character_sheets")) {
            if (historicalEditing) {
              assert(
                new URL(page.url()).pathname.endsWith("/power"),
                "Historical write outside historical route",
              );
              assert(
                Object.keys(patch).sort().join(",") === "power_form_data,stats",
                "Historical edit changed current-edition fields",
              );
              row = { ...row, ...patch };
              body = { id: sheetId };
            } else {
              assert(
                Object.keys(patch).every((k) =>
                  [
                    "name",
                    "rules_version",
                    "tdv2_data",
                    "age",
                    "identity_data",
                    "description",
                    "inventory",
                  ].includes(k),
                ),
                "Legacy column mutation: " +
                  JSON.stringify({ keys: Object.keys(patch), patch, url: page.url() }),
              );
              assert(url.searchParams.has("updated_at"), "Missing CAS");
              if (url.searchParams.get("updated_at") !== "eq." + row.updated_at) {
                await route.fulfill({ status: 200, contentType: "application/json", body: "null" });
                return;
              }
              row = {
                ...row,
                ...patch,
                updated_at: new Date(Date.parse(row.updated_at) + 1000).toISOString(),
              };
              body = { id: sheetId, updated_at: row.updated_at };
            }
          } else if (path.includes("/game_settings")) {
            assert(Object.keys(patch).join(",") === "tdv2_state", "Legacy master mutation");
            assert(
              url.searchParams.get("tdv2_revision") === "eq." + settings.tdv2_revision,
              "Missing/stale master CAS",
            );
            settings = { ...settings, ...patch, tdv2_revision: settings.tdv2_revision + 1 };
            body = { id: settings.id, tdv2_revision: settings.tdv2_revision };
          } else throw Error("Unexpected PATCH " + path);
        } else if (path.endsWith("/user")) body = user;
        else if (path.includes("/user_roles")) body = [{ user_id: userId, role }];
        else if (path.includes("/profiles"))
          body = [{ id: userId, email: user.email, full_name: "Tadeu de exemplo" }];
        else if (path.includes("/feature_flags")) body = [];
        else if (path.includes("/character_sheets")) body = [row];
        else if (path.includes("/game_settings")) body = [settings];
        else if (path.includes("project_heartbeat")) body = "2026-10-27T00:00:00Z";
        else if (
          req.method() === "POST" &&
          !path.includes("/rpc/") &&
          !path.includes("/app_error_logs")
        )
          errors.push("Unexpected POST " + path);
        if (Array.isArray(body) && req.headers().accept?.includes("vnd.pgrst.object"))
          body = body[0] || null;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
      });
      await installDesignFonts(page);
      const geometry = async (label) => {
        const target = {
          "sheet-critical": ".tdv-result",
          "sheet-records": ".tdv-record-collections",
          "play-repertoire": ".tdv-record-collections",
          "atlas-expression": ".tdv-record-collections",
          "play-physical-result": ".tdv-result",
          "master-round": "#tdv-master-round",
          "master-pessoas": "#tdv-master-opposition",
          "master-investigação": "#tdv-master-sealing",
          "master-referência": "#tdv-master-reference",
        }[label];
        if (target) await page.locator(target).scrollIntoViewIfNeeded();
        await page.evaluate(() => document.fonts.ready);
        // Re-read the current state: a CSS animation removed by a disclosure or
        // tab change can leave an earlier `finished` promise unresolved.
        await page.waitForFunction(
          () =>
            document
              .getAnimations()
              .every(
                (a) =>
                  a.playState !== "running" ||
                  !Number.isFinite(a.effect?.getComputedTiming().endTime),
              ),
          null,
          { timeout: 10000 },
        );
        await page.evaluate(async () => {
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        });
        const g = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          documentHeight: document.documentElement.scrollHeight,
          headerHeight: Math.round(
            document.querySelector("[data-page-header]")?.getBoundingClientRect().height ?? 0,
          ),
          firstSectionTop: Math.round(
            document
              .querySelector("[data-sheet-content][data-state='active'] .tadeon-sheet-section")
              ?.getBoundingClientRect().top ?? 0,
          ),
          visibleControls: [
            ...document.querySelectorAll("main input,main select,main textarea"),
          ].filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight;
          }).length,
          h1: document.querySelectorAll("h1").length,
          boundary: document.body.textContent.includes("Something went wrong"),
        }));
        assert(
          !g.overflow && g.h1 === 1 && !g.boundary,
          `${label}/${width}/${role}: ${JSON.stringify(g)}`,
        );
        assert(!errors.length, errors.join("\n"));
        const checkboxText = await page.locator(".tadeon-tdv2-sheet .tdv-check").evaluateAll((es) =>
          es
            .filter((el) => el.getBoundingClientRect().height > 0)
            .map((el) => ({
              label: el.textContent.trim(),
              size: parseFloat(getComputedStyle(el).fontSize),
            })),
        );
        assert(
          checkboxText.every((x) => x.size >= 14),
          "Legacy game styling reduced TdV II checkbox text: " + JSON.stringify(checkboxText),
        );
        const targets = await page
          .locator('.tadeon-page-header__actions :is(button, [data-slot="button"])')
          .evaluateAll((es) =>
            es
              .map((el) => {
                const r = el.getBoundingClientRect();
                return { w: r.width, h: r.height, label: el.textContent.trim() };
              })
              .filter((r) => r.w && r.h),
          );
        assert(
          targets.every((r) => r.w >= 43.9 && r.h >= 43.9),
          "Header targets below 44px: " + JSON.stringify(targets),
        );
        if (process.env.NEXUS_SKIP_SCREENSHOTS !== "1")
          await page.screenshot({
            path: `${output}/${label}-${role}-${viewportKey}.png`,
            timeout: 45000,
          });
        if (process.env.NEXUS_SURFACE_CENSUS === "1")
          await captureSurfaceCensus(page, {
            path: `${output}/${label}-${role}-${viewportKey}.surface.json`,
            state: `${label}/${role}`,
            screenshot:
              process.env.NEXUS_SKIP_SCREENSHOTS !== "1"
                ? `${label}-${role}-${viewportKey}.png`
                : null,
          });
        results.push({ label, width, height, role, ...g, writes: writes.length });
        writeFileSync(output + "/results.json", JSON.stringify(results, null, 2));
        console.log(`${width}/${role}: ${label}`);
      };
      const saved = async (predicate) => {
        if ((await page.locator('[data-slot="dialog-content"]:visible').count()) === 0)
          await page.getByRole("button", { name: "Salvar", exact: true }).click();
        await page.locator('[data-page-header="sheet"] [data-tadeon-state="saved"]').waitFor();
        const end = Date.now() + 10000;
        while (!predicate()) {
          if (Date.now() > end)
            throw Error(
              "Save did not persist: " +
                JSON.stringify({ writes, text: await page.locator("body").innerText() }),
            );
          await new Promise((r) => setTimeout(r, 100));
        }
      };
      await page.goto(`http://127.0.0.1:${port}/sheet/${sheetId}`);
      await page.locator(".tdv-character-name").waitFor();
      await verifyInteractive({
        page,
        context,
        getRow: () => row,
        writes,
        role,
        width,
        height,
        geometry,
        saved,
        assert,
        resetCharacter: (character) => {
          row = { ...row, tdv2_data: character };
        },
        makeCharacter: newTdvCharacter,
      });
      assert(errors.length === 0, "Browser errors: " + errors.join("; "));
      assert(
        JSON.stringify({ attributes: row.attributes, stats: row.stats }) === legacy,
        "Historical data preserved",
      );
    }
} catch (error) {
  // Persist the failure before browser teardown; native runtime shutdown can hide stderr.
  writeFileSync(output + "/failure.txt", error?.stack || String(error));
  throw error;
} finally {
  writeFileSync(output + "/server.log", serverLog);
  await browser?.close();
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {}
}
