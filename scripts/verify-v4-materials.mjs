import { auditViewports } from "./v4-viewports.mjs";
import { captureSurfaceCensus } from "./surface-census.mjs";
/** Shared motion lab: read-only client fixtures, real primitives, no live writes.
 * Counts geometry work under fixed input; timings are CSS contracts, not INP/FPS.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { installDesignFonts } from "./design-font-fixtures.mjs";
const { chromium } = await import(process.env.NEXUS_BROWSER_MODULE || "playwright-core");
const baseline = process.argv.includes("baseline");
const repo = resolve(process.env.NEXUS_AUDIT_REPO || ".");
const output = resolve(process.env.NEXUS_AUDIT_OUTPUT || "/tmp/nexus-shared-motion");
const port = Number(process.env.NEXUS_AUDIT_PORT || 5188);
mkdirSync(output, { recursive: true });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--strictPort", "--port", String(port)], { cwd: repo, detached: true, stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "", browser;
server.stdout.on("data", data => { serverLog = (serverLog + data).slice(-8000); });
server.stderr.on("data", data => { serverLog = (serverLog + data).slice(-8000); });
const rows = [];
const id = "00000000-0000-4000-8000-000000000001";
const user = { id, email: "fixture@nexus.test", aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01" };
const token = [{ alg: "HS256", typ: "JWT" }, { sub: id, aud: "authenticated", role: "authenticated", exp: 2000000000 }, "fixture"].map(x => typeof x === "string" ? x : Buffer.from(JSON.stringify(x)).toString("base64url")).join(".");
try {
  let ready = false;
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    try { ready = (await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(3000) })).status < 500; } catch { /* compiling */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  assert(ready, `Vite readiness: ${serverLog}`);

  console.log("Material fixture server ready");
  for (const {width,height,viewportKey} of auditViewports()) {
    browser = await chromium.launch({ executablePath: process.env.NEXUS_CHROMIUM_PATH, args: JSON.parse(process.env.NEXUS_CHROMIUM_ARGS || "[]") });
    const page = await browser.newPage({viewport:{width,height},hasTouch:width<768,reducedMotion:"no-preference"});
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(({ user, token }) => localStorage.setItem("sb-nkxpstyfrzufsnowjrdi-auth-token", JSON.stringify({ access_token: token, refresh_token: "fixture", expires_at: 2000000000, user })), { user, token });
    await page.route("**/*.supabase.co/**", async route => {
      const request = route.request(), path = new URL(request.url()).pathname;
      assert(request.method() === "GET" || path.includes("/auth/"), `Unexpected write: ${path}`);
      let body = [];
      if (path.endsWith("/user")) body = user;
      else if (path.includes("/profiles")) body = [{ id, email: user.email, full_name: "Conta de teste" }];
      else if (path.includes("/user_roles")) body = [{ user_id: id, role: "mestre" }];
      else if (path.includes("/feature_flags")) body = [{ key: "nexus_knowledge_enabled", enabled: true }, { key: "nexus_tabletop_enabled", enabled: true }];
      if (Array.isArray(body) && request.headers().accept?.includes("vnd.pgrst.object")) body = body[0] || null;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
    });
    await page.route("**/_serverFn/**", route => route.fulfill({ status: 503, contentType: "application/json", body: "{}" }));
    await installDesignFonts(page);

    await page.goto(`http://127.0.0.1:${port}/visual-audit?gallery=1`,{waitUntil:"domcontentloaded",timeout:120000});
    console.log(viewportKey+": gallery mounted");
    const library=page.locator('.tadeon-material-library');await library.waitFor({timeout:120000});
    const input=page.getByLabel('Registro de ensaio');await input.fill('Um registro preservado');
    await page.getByLabel('Simular erro no envio').check();
    await page.getByRole('button',{name:'Simular envio',exact:true}).click();
    assert(await page.getByRole('button',{name:'Enviando ensaio…'}).isDisabled(),'Pending is disabled');
    await library.getByRole('alert').waitFor();
    assert(await input.inputValue()==='Um registro preservado','Error preserves draft');
    await page.getByLabel('Simular erro no envio').uncheck();
    await page.getByRole('button',{name:'Tentar ensaio novamente'}).click();
    await library.getByRole('status').filter({hasText:'Ensaio confirmado'}).waitFor();
    await page.getByLabel('Somente leitura').check();assert(await input.getAttribute('readonly')!==null,'Read-only input');
    assert(await page.getByRole('button',{name:'Simular envio',exact:true}).isDisabled(),'Read-only action');
    for(const family of ['Instrumento','Trama','Lâmina','Palco','Acervo','Fólio']) {
      await library.getByRole('tab',{name:family,exact:true}).click();
      assert(await library.getByRole('tab',{name:family,exact:true}).getAttribute('aria-selected')==='true','Material selection');
    }
    await page.getByRole('button',{name:'Restaurar ensaio'}).click();
    await page.evaluate(()=>document.getElementById('tadeon-main').scrollTo(0,0));
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    assert(!overflow&&errors.length===0,JSON.stringify({width,height,overflow,errors}));
    await page.screenshot({path:`${output}/materials-${viewportKey}.png`,fullPage:true});
    await captureSurfaceCensus(page,{path:`${output}/materials-${viewportKey}.surface.json`,state:'gallery/materials',screenshot:`materials-${viewportKey}.png`});
    await page.getByRole('button',{name:'Abrir dialog',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Janela de auditoria',exact:true});await dialog.waitFor();
    const bounds=await dialog.evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:innerWidth,h:innerHeight};});
    assert(bounds.x>=-1&&bounds.y>=-1&&bounds.right<=bounds.w+1&&bounds.bottom<=bounds.h+1,'Dialog fits '+JSON.stringify(bounds));
    await page.screenshot({path:`${output}/dialog-${viewportKey}.png`});
    await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
    assert(await page.getByRole('button',{name:'Abrir dialog',exact:true}).evaluate(e=>e===document.activeElement),'Focus returns');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.getByRole('button',{name:'Abrir dialog',exact:true}).click();await dialog.waitFor();
    assert(await dialog.evaluate(e=>getComputedStyle(e).animationName)==='none','Reduced motion');
    await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
    const loops=await page.evaluate(()=>document.getAnimations().filter(a=>a.effect?.getTiming().iterations===Infinity).length);
    assert(loops===0,'No decorative loops');
    await page.emulateMedia({forcedColors:'active'});
    const forced=await page.locator('.tadeon-material-specimen').first().evaluate(e=>({shadow:getComputedStyle(e).boxShadow,edge:getComputedStyle(e).borderTopColor}));
    assert(forced.shadow==='none'&&forced.edge!=='rgba(0, 0, 0, 0)','Forced-color fallback');
    await page.emulateMedia({forcedColors:'none'});
    rows.push({route:'/visual-audit?gallery=1',width,height,materials:6,pending:true,errorPreserved:true,retry:true,readOnly:true,focusReturn:true,reducedMotion:true,forcedColors:true,decorativeLoops:loops,overflow,errors});
    writeFileSync(`${output}/results.json`,JSON.stringify(rows,null,2));console.log(viewportKey+': material states and dialog passed');
    await browser.close();browser=null;
  }
} finally {
  await browser?.close();try{process.kill(-server.pid,'SIGTERM');}catch{/* already stopped */}
}
