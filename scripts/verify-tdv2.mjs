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
      if (process.env.NEXUS_PLAY_VIEW_ONLY === "1" || process.env.NEXUS_DEC030_ONLY === "1") {
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
      const masterTool = async (value, label) => {
        const jump = page.getByLabel("Ir para uma ferramenta do mestre");
        if (await jump.isVisible()) await jump.selectOption(value);
        else await page.getByRole("tab", { name: label, exact: true }).click();
      };
      const geometry = async (label) => {
        const target = {
          "sheet-critical": ".tdv-result",
          "sheet-records": "#tdv-expressao",
          "play-repertoire": "#tdv-expressao",
          "atlas-expression": "#tdv-expressao",
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
      if (process.env.NEXUS_DEC030_ONLY === "1") {
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
        });
        continue;
      }
      if (process.env.NEXUS_LAYOUT_ONLY === "1") {
        for (const [label, key] of [
          ["Pessoa", "person"],
          ["Constituição", "constitution"],
          ["Ação", "action"],
          ["Expressão", "expression"],
          ["Percurso", "path"],
        ]) {
          await page.evaluate(() => {
            document.getElementById("tadeon-main").scrollTop = 0;
          });
          await page.getByRole("tab", { name: label, exact: true }).click();
          await geometry("layout-" + key);
          if (key === "constitution") {
            await page.locator(".tdv-play-presence").scrollIntoViewIfNeeded();
            await geometry("layout-instruments");
          }
        }
        await context.close();
        continue;
      }
      await page.getByRole("tab", { name: "Pessoa", exact: true }).click();
      await geometry("sheet-person");
      await page.locator(".tdv-link-summary").first().click();
      const linkOffer = page.getByLabel("Oferta do vínculo 1", { exact: true });
      if (role === "mestre") {
        await linkOffer.fill("Abrigo no cais");
        await saved(() => row.tdv2_data.face.links[0].offer === "Abrigo no cais");
      } else assert(await linkOffer.isDisabled(), "Readonly link became editable");
      await geometry("sheet-link-editor");
      await page.locator(".tdv-link-summary").first().click();
      await page.getByRole("tab", { name: "Ação", exact: true }).click();
      await page.getByRole("tab", { name: "Pessoa", exact: true }).click();
      if (role === "mestre") {
        await page
          .locator("summary")
          .filter({ hasText: "Ancorar · sustentar ou redirecionar" })
          .click();
        await page
          .getByLabel("Consequência concreta", { exact: true })
          .fill("A testemunha é levada");
        await page
          .getByLabel("Como a consequência permanece na ficção")
          .fill("Sustento o vínculo mesmo à distância");
        await page.getByRole("button", { name: "Ancorar e abalar Âncora" }).click();
        await page.getByRole("button", { name: "Registrar Reassentamento" }).waitFor();
        console.log("anchor changed");
        await saved(() => row.tdv2_data.face.anchor.shaken);
        await page
          .getByLabel("Ação significativa de Reassentar")
          .fill("Voltei ao cais e cumpri a promessa");
        await page.getByRole("button", { name: "Registrar Reassentamento" }).click();
        await page.getByRole("button", { name: "Ancorar e abalar Âncora" }).waitFor();
        console.log("anchor resettled");
        await saved(() => !row.tdv2_data.face.anchor.shaken);
        await page.getByRole("tab", { name: "Constituição", exact: true }).click();
        await geometry("sheet-constitution");
        for (let i = 0; i < 4; i++)
          await page.getByRole("button", { name: "Tensão +1", exact: true }).click();
        await saved(() => row.tdv2_data.equilibrium === 1 && row.tdv2_data.tension === 0);
        await page.getByRole("tab", { name: "Percurso", exact: true }).click();
        await geometry("sheet-path");
        await page.locator("summary").filter({ hasText: "Reconhecer um Marco" }).click();
        await page.getByLabel("Acontecimento do Marco").fill("Resgate do arquivo");
        await page.getByLabel("Mudança incorporada").fill("Assumir o testemunho");
        await page
          .getByRole("button", { name: "Conceder Marco · +5% e 2 PU", exact: true })
          .click();
        await saved(() => row.tdv2_data.milestones.length === 1);
        await page.getByRole("button", { name: /Praticar um Alinhavo/ }).click();
        await page.getByLabel("Tipo de investimento", { exact: true }).selectOption("Alinhavo");
        await page
          .getByLabel("Capacidade a desenvolver", { exact: true })
          .selectOption("Iniciativa");
        await page
          .getByLabel("Como esta mudança foi incorporada?")
          .fill("Assumi a dianteira no resgate");
        await page.getByRole("button", { name: "Confirmar mudança", exact: true }).click();
        await saved(() => row.tdv2_data.investments.length === 1);
        await page.getByRole("tab", { name: "Constituição", exact: true }).click();
        await page.getByRole("button", { name: /Ajustar PE$/ }).click();
        await page.getByLabel("PE atual", { exact: true }).fill("0");
        await page.getByRole("button", { name: "Aplicar PE", exact: true }).click();
        await saved(() => row.tdv2_data.resources.pe === 0);
      } else {
        assert(
          (await page
            .getByRole("button", { name: "Editar Nome da personagem", exact: true })
            .count()) === 0,
          "Readonly name enabled",
        );
        assert(
          (await page
            .locator(
              ".tadeon-tdv2-sheet input:enabled:not([data-view-control]),.tadeon-tdv2-sheet textarea:enabled,.tadeon-tdv2-sheet select:enabled:not([data-view-control])",
            )
            .count()) === 0,
          "Readonly fields enabled",
        );
      }
      if (role === "espectador")
        for (const name of ["Constituição", "Percurso", "Expressão"]) {
          await page.getByRole("tab", { name, exact: true }).click();
          assert(
            (await page
              .locator(
                ".tadeon-tdv2-sheet input:enabled:not([data-view-control]),.tadeon-tdv2-sheet textarea:enabled,.tadeon-tdv2-sheet select:enabled:not([data-view-control])",
              )
              .count()) === 0,
            "Readonly fields enabled in " + name,
          );
          if (name === "Expressão") {
            const filter = page.getByLabel("Mostrar repertório", { exact: true });
            assert(await filter.isEnabled(), "Readonly repertoire navigation blocked");
            await filter.selectOption("Trama");
            await page
              .locator("summary")
              .filter({ has: page.getByText("A trama consultável", { exact: true }) })
              .waitFor();
            assert(
              await page
                .getByRole("button", { name: "Adicionar registro", exact: true })
                .isDisabled(),
              "Readonly navigation enabled a mutation",
            );
          }
          await geometry("sheet-readonly-" + name.toLowerCase());
        }
      await page.getByRole("tab", { name: "Ação", exact: true }).click();
      await geometry("sheet-action");
      if (role === "mestre") {
        await page
          .locator("summary")
          .filter({ hasText: "Resolver consequência ou consultar dados" })
          .click();
        await page.getByRole("button", { name: "Abrir dados opcionais", exact: true }).click();
        await page.getByLabel("Registrar a próxima rolagem", { exact: true }).check();
        await page.getByLabel("Intenção", { exact: true }).fill("Abrir o arquivo");
        await page.getByLabel("Abordagem", { exact: true }).fill("Ler as relações entre as travas");
        await page.getByLabel("Existe risco ou oposição relevante", { exact: true }).check();
        await page.locator("summary").filter({ hasText: "Proveito, Desproveito e Forçar" }).click();
        await page.getByLabel("Forçar um Fio", { exact: true }).selectOption("Prumo");
        await page
          .getByLabel("Contrapartida acordada para Forçar a 0 PE")
          .fill("O selo expõe meu rastro");
        await page.getByRole("button", { name: /Rolar os dois Fios/ }).click();
        await saved(
          () => row.tdv2_data.scene.forcedAtZero && row.tdv2_data.scene.shaken.includes("Nexo"),
        );
        assert(row.tdv2_data.resources.pe === 0, "0 PE altered");
        assert(
          await page.getByRole("button", { name: /Rolar os dois Fios/ }).isDisabled(),
          "Repeated zero forcing allowed",
        );
        await geometry("sheet-critical");
      }
      if (role === "mestre") await page.keyboard.press("Escape");
      await page.getByRole("tab", { name: "Expressão", exact: true }).click();
      if (role === "mestre") {
        await page.getByRole("button", { name: "Adicionar registro", exact: true }).click();
        const name = page.getByLabel(/^Nome do registro /).last();
        await name.pressSequentially("O fio que permanece");
        assert(await name.isVisible(), "Record collapsed while typing");
        await saved(() => row.tdv2_data.records.at(-1)?.name === "O fio que permanece");
      }
      if (role === "mestre" && [320, 1440].includes(width)) {
        await page.getByRole("tab", { name: "Constituição", exact: true }).click();
        await page.getByRole("button", { name: /Ajustar PE$/ }).click();
        await page.getByLabel("PE atual", { exact: true }).fill("5");
        await page.getByRole("button", { name: "Aplicar PE", exact: true }).click();
        await page.getByRole("tab", { name: "Ação", exact: true }).click();
        await page
          .locator("summary")
          .filter({ hasText: "Proteção, cobertura e ausência de Guarda" })
          .click();
        await page.getByLabel("Proteção ordinária combinada", { exact: true }).selectOption("2");
        await page
          .getByLabel("Escudo ou cobertura efetivamente interposta", { exact: true })
          .fill("Parede de pedra dominante");
        await page.getByRole("button", { name: "Aplicar proteção declarada", exact: true }).click();
        await saved(() => row.tdv2_data.guard.protection === 2 && row.tdv2_data.resources.pe === 5);
        await page.getByRole("tab", { name: "Ação", exact: true }).click();
        const optional = page
          .locator("summary")
          .filter({ hasText: "Resolver consequência ou consultar dados" });
        if (!(await optional.evaluate((el) => el.parentElement.open))) await optional.click();
        await page.locator("summary").filter({ hasText: "Da resolução ao Resto" }).click();
        await page
          .getByLabel("Consequência principal", { exact: true })
          .fill("A porta não cede e o alarme revela a tentativa");
        await page.getByRole("button", { name: "Incorporar Resto do teste", exact: true }).click();
        await saved(() =>
          row.tdv2_data.records.some((r) => r.fields.Teste === row.tdv2_data.scene.tests.at(-1).id),
        );
        await geometry("sheet-outcome");
        await page.getByRole("tab", { name: "Expressão", exact: true }).click();
        await page.getByLabel("Mostrar repertório", { exact: true }).selectOption("Trama");
        await page.getByRole("button", { name: "Adicionar registro", exact: true }).click();
        await page.getByLabel("Nome do registro 1", { exact: true }).fill("Passagem do cais");
        await saved(() => row.tdv2_data.records.at(-1).name === "Passagem do cais");
        await page.getByRole("button", { name: "Expressar / Costurar", exact: true }).click();
        await page.getByLabel("Trama: Passagem do cais", { exact: true }).check();
        await page
          .getByLabel("Intenção única da expressão", { exact: true })
          .fill("Sustentar a passagem");
        await page.getByLabel("Alvo e acesso concreto", { exact: true }).fill("O portão acessível");
        await page
          .getByLabel("Preços, gatilhos, Puxagem e limites declarados", { exact: true })
          .fill("Acesso seguro; custo escrito de 1 PE, sem PI");
        await page.getByLabel("Custo declarado em PE", { exact: true }).fill("1");
        await page
          .getByLabel("Gatilhos válidos e preços de todas as práticas conferidos", { exact: true })
          .check();
        await page.getByLabel("A expressão permanece sustentada", { exact: true }).check();
        await page.getByLabel("PE por janela de sustentação", { exact: true }).fill("1");
        await page
          .getByLabel("Condição de término, Fixação ou Relaxamento", { exact: true })
          .fill("Relaxar após a travessia");
        await page
          .getByRole("button", { name: "Expressar pela ficção e pagar custos", exact: true })
          .click();
        await saved(
          () => row.tdv2_data.activeExpressions?.length === 1 && row.tdv2_data.resources.pe === 4,
        );
        await page
          .locator(".tdv-active-expressions > details > summary")
          .filter({ hasText: "Sustentada" })
          .click();
        await page
          .getByLabel("Nova janela de sustentação", { exact: true })
          .fill("Segunda travessia");
        await page
          .getByLabel("Continuidade que sustenta ou encerra a expressão", { exact: true })
          .fill("Continuo junto ao portão");
        await page.getByRole("button", { name: "Sustentar nesta janela", exact: true }).click();
        await saved(() => row.tdv2_data.resources.pe === 3);
        await page.getByRole("button", { name: "Relaxar", exact: true }).click();
        await saved(() => row.tdv2_data.activeExpressions[0].state === "Relaxada");
        assert(row.tdv2_data.resources.pe === 3, "Relaxamento refunded PE");
        await geometry("sheet-expression-use");
      }
      await geometry("sheet-records");
      assert(
        legacy === JSON.stringify({ attributes: row.attributes, stats: row.stats }),
        "Historical values changed",
      );
      if (role === "espectador") assert(writes.length === 0, "Readonly writes");
      if (role === "mestre") {
        await page.goto(`http://127.0.0.1:${port}/master-panel`);
        await page.getByRole("tab", { name: "Sessão Ativa", exact: true }).waitFor();
        for (const label of [
          "Cenas",
          "NPCs",
          "Ameaças",
          "Investigação",
          "Interlúdios",
          "Dobras",
          "Acervo",
          "Notas",
          "Regras TdV II",
        ]) {
          assert(
            (await page.getByRole("tab", { name: label, exact: true }).count()) === 1,
            "Campaign tool hidden: " + label,
          );
        }
        await geometry("master-workspace");
        await masterTool("initiative", "Iniciativa");
        await page.getByRole("button", { name: "NPC", exact: true }).waitFor();
        assert(
          (await page.getByRole("button", { name: "Jogador", exact: true }).count()) === 1,
          "Manual initiative controls removed",
        );
        await page.getByLabel("Título da cena", { exact: true }).waitFor();
        const initiativeName = await page.getByLabel("Nome", { exact: true }).boundingBox();
        assert(
          initiativeName && initiativeName.width >= Math.min(240, width - 110),
          "Initiative name became too narrow to read",
        );
        await geometry("master-initiative-retained");
        await masterTool("rules", "Regras TdV II");
        await page.getByLabel("Título da cena", { exact: true }).fill("Rascunho protegido");
        await masterTool("session", "Sessão Ativa");
        await page.getByRole("alertdialog").waitFor();
        await page.getByRole("button", { name: "Continuar no painel", exact: true }).click();
        assert(
          (await page.getByLabel("Título da cena", { exact: true }).inputValue()) ===
            "Rascunho protegido",
          "Parent navigation lost embedded draft",
        );
        await masterTool("session", "Sessão Ativa");
        await page.getByRole("button", { name: "Salvar e continuar", exact: true }).click();
        await page.waitForFunction(
          () => new URL(location.href).searchParams.get("tab") === "session",
        );
        assert(
          settings.tdv2_state.title === "Rascunho protegido",
          "Embedded draft not saved before navigation",
        );
        await page.goto(`http://127.0.0.1:${port}/master-panel?edition=tdv2`);
        await page.getByLabel("Título da cena", { exact: true }).waitFor();
        await geometry("master-scene");
        await page.getByLabel("Título da cena", { exact: true }).fill("O arquivo em ruptura");
        await page.getByRole("button", { name: "Nova frente de Pressão" }).click();
        await page.getByLabel("Nome da frente", { exact: true }).fill("O portão");
        await page.getByLabel("Ruptura anunciada ao atingir 4").fill("O portão cede");
        await page
          .getByLabel("Acontecimento ou intervenção que altera a Pressão")
          .fill("Os pilares se partem");
        for (let i = 0; i < 4; i++)
          await page.getByRole("button", { name: "Aumentar Pressão" }).click();
        await page.locator("summary").filter({ hasText: "Adicionar personagens TdV II" }).click();
        await page.getByRole("button", { name: "Incluir na rodada", exact: true }).first().click();
        await page.getByRole("button", { name: "Usar 1 Impulso", exact: true }).click();
        await page.getByRole("button", { name: "Usar Resposta", exact: true }).click();
        await page.getByRole("button", { name: "Iniciar próxima rodada" }).click();
        await page.getByRole("button", { name: "Rolar Iniciativa", exact: true }).click();
        await page.getByText("Prioridade: 0", { exact: false }).waitFor();
        assert(
          row.tdv2_data.scene.shaken.includes("Cadência"),
          "Initiative did not preserve critical matrix consequence",
        );
        await page.getByRole("button", { name: "Salvar condução", exact: true }).click();
        await page.waitForFunction(() => document.body.textContent.includes("Salvo"));
        assert(settings.tdv2_state.pressures[0].value === 4, "Pressure not saved");
        assert(
          settings.tdv2_state.participants[0].impulses === 2 &&
            settings.tdv2_state.participants[0].response,
          "Round not reset",
        );
        await geometry("master-round");
        for (const tab of [
          "Resolução e operações",
          "Pessoas e ameaças",
          "Investigação e Selagem",
          "Referência",
        ]) {
          await page.getByRole("tab", { name: tab, exact: true }).click();
          if (tab === "Resolução e operações") {
            await page.getByRole("button", { name: "Abrir operação", exact: true }).click();
            await page.getByLabel("Nome da operação", { exact: true }).fill("Reabrir o arquivo");
            await page
              .getByLabel("Objetivo e condição de conclusão", { exact: true })
              .fill("Acesso seguro ao testemunho");
            await page.getByLabel("Esta intervenção abrange Acesso", { exact: true }).check();
            await page.locator("summary").filter({ hasText: "Registrar uma intervenção" }).click();
            await page
              .getByLabel("Intenção desta intervenção", { exact: true })
              .fill("Abrir a porta exterior");
            await page
              .getByLabel("Abordagem e acesso", { exact: true })
              .fill("A testemunha conhece a chave");
            await page
              .getByLabel("Mudança verificável produzida ou consequência da falha", { exact: true })
              .fill("A porta está aberta");
            await page
              .getByRole("button", {
                name: "Registrar intervenção e preservar progresso",
                exact: true,
              })
              .click();
          }
          if (tab === "Pessoas e ameaças") {
            await page.getByRole("button", { name: "Novo Ameaça", exact: true }).click();
            await page.getByLabel("Identidade da presença 1").pressSequentially("A voz do cais");
            const magnitude = page.getByLabel("Magnitude de A voz do cais", { exact: true });
            await magnitude.selectOption("4");
            assert(await magnitude.isVisible(), "Opposition collapsed while typing");
          }
          if (tab === "Investigação e Selagem") {
            await page.getByRole("button", { name: "Preparar Selagem", exact: true }).click();
            await page.getByLabel("Nome do Selo 1", { exact: true }).fill("Fio do portão");
          }
          const saveConduction = page.getByRole("button", { name: "Salvar condução", exact: true });
          if (await saveConduction.isEnabled()) await saveConduction.click();
          await page.waitForFunction(() => document.body.textContent.includes("Salvo"));
          if (tab === "Resolução e operações")
            assert(
              settings.tdv2_state.operations[0].stages[0].done,
              "Operation progress not saved",
            );
          await geometry("master-" + tab.split(" ")[0].toLowerCase());
        }
      }
      if (role === "mestre" && [320, 1440].includes(width)) {
        row = {
          ...row,
          rules_version: 1,
          tdv2_data: null,
          exposure: 0,
          equilibrium: 0,
          drift: 0,
          fragments: 0,
          pm_spent: 0,
          stat_upgrades: { pv: 0, ps: 0, pe: 0, def: 0 },
          origin: "O cais antigo",
          occupation: "Registradora",
          notes: "Memória preservada",
          brand: "Marca anterior",
          description: {
            historia: "História preservada",
            personalidade: "Atenta",
            objetivos: "Voltar ao cais",
            observacoes: "Fala baixo",
          },
          weapons: [{ id: "old-sword", nome: "Espada do cais", dano: "2d10" }],
          inventory: [
            { id: "old-rope", nome: "Corda de linho", descricao: "Dez metros", espaco: 1 },
          ],
          identity_data: {
            conviction: "Preservar testemunhos",
            limit: "Não entregar inocentes",
            links: [{ id: "old-link", name: "Elen", relation: "Confiança", state: "Presente" }],
          },
        };
        const historical = JSON.stringify(
          Object.fromEntries(
            Object.entries(row).filter(
              ([k]) =>
                ![
                  "rules_version",
                  "tdv2_data",
                  "updated_at",
                  "description",
                  "inventory",
                  "identity_data",
                  "age",
                ].includes(k),
            ),
          ),
        );
        await page.goto(`http://127.0.0.1:${port}/sheet/${sheetId}?mode=edit`);
        await page.getByRole("heading", { name: "Feição", exact: true }).waitFor();
        assert(row.rules_version === 1, "Opening an existing sheet wrote data before review");
        assert(
          (await page
            .getByRole("button", { name: "Preparar ficha TdV II", exact: true })
            .count()) === 0,
          "Existing sheet still blocked behind conversion",
        );
        await page.getByRole("heading", { name: "Dar forma à presença", exact: true }).waitFor();
        await geometry("sheet-adaptation-review");
        assert(
          await page
            .getByRole("button", { name: "Concluir criação TdV II", exact: true })
            .isDisabled(),
          "Incomplete creation accepted",
        );
        await page
          .getByLabel("A que parte de mim consigo retornar?", { exact: true })
          .fill("A promessa a Elen");
        await page.locator("summary").filter({ hasText: "Marca ·" }).click();
        await page.getByLabel("Gatilho", { exact: true }).fill("Quando a promessa é ameaçada");
        await page.getByLabel("Resíduo", { exact: true }).fill("O fio permanece quente");
        await page.getByRole("tab", { name: "Constituição", exact: true }).click();
        for (const [name, grade] of [
          ["Ímpeto", 2],
          ["Cadência", 3],
          ["Nexo", 3],
          ["Lastro", 2],
        ]) {
          await page.getByRole("button", { name: new RegExp("^Valor de " + name + ":") }).click();
          await page
            .getByRole("group", { name: "Valor de " + name, exact: true })
            .getByRole("button", { name: new RegExp("^" + grade + " ·") })
            .click();
        }
        for (const [name, grade] of [
          ["Engenharia", 2],
          ["Investigação", 2],
          ["Atletismo", 1],
          ["Percepção", 1],
          ["Sociedade", 1],
          ["Iniciativa", 1],
        ]) {
          await page
            .getByRole("button", { name: new RegExp("^Grau inicial de " + name + ":") })
            .click();
          await page
            .getByRole("group", { name: "Grau inicial de " + name, exact: true })
            .getByRole("button", { name: new RegExp("^" + grade + " ·") })
            .click();
        }
        await page.getByRole("tab", { name: "Pessoa", exact: true }).click();
        await page
          .getByRole("button", {
            name: "Editar Razão para entrar na primeira situação",
            exact: true,
          })
          .click();
        await page
          .getByRole("textbox", { name: "Razão para entrar na primeira situação", exact: true })
          .fill("Proteger Elen e recuperar o testemunho do cais");
        await page
          .getByRole("button", {
            name: "Aplicar Razão para entrar na primeira situação",
            exact: true,
          })
          .click();
        await page.locator(".tdv-creation-journey > summary").click();
        await page.locator(".tdv-creation-review > summary").click();
        await page
          .getByLabel(
            "Conferi permissões ficcionais, equipamento, Condições iniciais e capacidade",
            { exact: true },
          )
          .check();
        await page.getByRole("button", { name: "Concluir criação TdV II", exact: true }).click();
        await saved(() => row.rules_version === 2 && row.tdv2_data.ready);
        assert(
          row.tdv2_data.milestones.length === 0 && row.tdv2_data.investments.length === 0,
          "Legacy experience inferred as PU",
        );
        assert(
          historical ===
            JSON.stringify(
              Object.fromEntries(
                Object.entries(row).filter(
                  ([k]) =>
                    ![
                      "rules_version",
                      "tdv2_data",
                      "updated_at",
                      "description",
                      "inventory",
                      "identity_data",
                      "age",
                    ].includes(k),
                ),
              ),
            ),
          "Conversion changed legacy fields",
        );
        assert(
          row.tdv2_data.records.some((r) => r.id === "old-sword" && r.name === "Espada do cais"),
          "Weapon lost in adaptation",
        );
        assert(
          row.inventory.some((r) => r.id === "old-rope" && r.nome === "Corda de linho"),
          "Organizer item identity lost",
        );
        await page.getByRole("tab", { name: "Expressão", exact: true }).click();
        await page.getByRole("heading", { name: "Inventário", exact: true }).waitFor();
        assert(
          (await page.getByRole("button", { name: "Organizar", exact: true }).count()) +
            (await page
              .getByRole("button", { name: "Organizar inventário", exact: true })
              .count()) >
            0,
          "Inventory organizer missing",
        );
        await page.getByRole("tab", { name: "Percurso", exact: true }).click();
        await page.getByRole("button", { name: "Editar História", exact: true }).click();
        await page
          .getByRole("textbox", { name: "História", exact: true })
          .fill("História revisada sem apagar a personalidade");
        await page.getByRole("button", { name: "Aplicar História", exact: true }).click();
        await page.getByRole("button", { name: "Salvar", exact: true }).click();
        await saved(
          () => row.description.historia === "História revisada sem apagar a personalidade",
        );
        assert(
          row.tdv2_data.history === row.description.historia &&
            row.description.personalidade === "Atenta",
          "Narrative editor lost other sections",
        );
        await page.getByRole("tab", { name: "Pessoa", exact: true }).click();
        await geometry("converted-sheet");
        row = {
          ...row,
          updated_at: new Date(Date.parse(row.updated_at) + 1000).toISOString(),
          tdv2_data: { ...row.tdv2_data, notes: "Atualização em outra janela" },
        };
        await page.getByRole("button", { name: "Editar Origem", exact: true }).click();
        await page
          .getByRole("dialog", { name: "Edição de Origem", exact: true })
          .getByRole("textbox", { name: "Origem", exact: true })
          .fill("Rascunho local em conflito");
        await page.getByRole("button", { name: "Aplicar Origem", exact: true }).click();
        await page.getByRole("button", { name: "Salvar", exact: true }).click();
        await page.getByRole("button", { name: "Guardar rascunho", exact: true }).waitFor();
        const downloadEvent = page.waitForEvent("download");
        await page.getByRole("button", { name: "Guardar rascunho", exact: true }).click();
        const download = await downloadEvent;
        const draftPath = `${output}/conflict-dossier-${viewportKey}.json`;
        await download.saveAs(draftPath);
        const exported = JSON.parse(readFileSync(draftPath, "utf8"));
        assert(
          exported.description.personalidade === "Atenta" &&
            exported.description.historia === exported.tdv2_data.history &&
            exported.inventory.some((r) => r.id === "old-rope"),
          "Conflict export lost restored dossier fields",
        );
        assert(row.tdv2_data.face.origin === "O cais antigo", "Conflict overwrote another window");
        const attempts = writes.length;
        await page.waitForTimeout(3500);
        assert(writes.length === attempts, "Conflict retried stale writes");
        await geometry("sheet-conflict");
        if (width === 1440) {
          row = {
            ...row,
            exposure: 95,
            tdv2_data: {
              ...row.tdv2_data,
              milestones: Array.from({ length: 3 }, (_, i) => ({
                id: `fixture-marco-${i}`,
                event: `Acontecimento ${i}`,
                incorporation: `Mudança ${i}`,
              })),
            },
          };
          await page.goto(`http://127.0.0.1:${port}/`);
          await page.locator(".tadeon-character-card").first().waitFor();
          const progress = await page
            .locator(".tadeon-continuity-facts dd:not(.tadeon-continuity-facts__detail)")
            .nth(2)
            .textContent();
          assert(
            progress === "15",
            "Archive used the historical exposure for a TdV II character: " + progress,
          );
          assert(
            (await page.locator(".tadeon-character-card").first().innerText()).includes(
              "Desenvolvimento",
            ),
            "Archive lost rules edition",
          );
          await geometry("archive-versioned");
        }
      }
      await context.close();
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
