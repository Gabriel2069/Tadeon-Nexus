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

 for(const {width,height,viewportKey} of auditViewports()) {
  browser=await chromium.launch({executablePath:process.env.NEXUS_CHROMIUM_PATH,args:JSON.parse(process.env.NEXUS_CHROMIUM_ARGS||'[]')});
  for(const state of ['expired','ready']) {
   const page=await browser.newPage({viewport:{width,height},hasTouch:width<768,reducedMotion:'reduce'}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   let reject=true,release=null,updates=0,signal;
   let gate=new Promise(resolve=>{signal=resolve;});
   const resume=async()=>{await gate;release();release=null;gate=new Promise(resolve=>{signal=resolve;});};
   if(state==='ready') await page.addInitScript(({user,token})=>localStorage.setItem('sb-nkxpstyfrzufsnowjrdi-auth-token',JSON.stringify({access_token:token,refresh_token:'fixture',expires_at:2000000000,token_type:'bearer',user})),{user,token});
   await page.route('**/*.supabase.co/**',async route=>{
    const req=route.request(),path=new URL(req.url()).pathname;let data=[];
    if(req.method()==='PUT'&&path.endsWith('/auth/v1/user')) {
     updates++;await new Promise(resolve=>{release=resolve;signal();});
     return route.fulfill({status:reject?422:200,contentType:'application/json',body:JSON.stringify(reject?{code:'validation_failed',message:'Fixture rejection'}:user)});
    }
    assert(req.method()==='GET'||path.endsWith('/rpc/project_heartbeat'),'Unexpected write '+path);
    if(path.endsWith('/user'))data=user;
    else if(path.includes('/profiles'))data=[{id,full_name:'Conta de teste'}];
    else if(path.includes('/user_roles'))data=[{user_id:id,role:'mestre'}];
    if(Array.isArray(data)&&req.headers().accept?.includes('vnd.pgrst.object'))data=data[0]||null;
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
   });
   await page.route('**/_serverFn/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{}'}));
   await installDesignFonts(page);
   await page.goto(`http://127.0.0.1:${port}/reset-password${state==='expired'?'#error=access_denied&error_description=Expired':''}`,{waitUntil:'domcontentloaded',timeout:120000});
   await page.getByRole('heading',{name:'Redefinir senha',exact:true}).waitFor({timeout:120000});
   if(state==='expired') {await page.getByRole('link',{name:'Solicitar outro link',exact:true}).waitFor();assert(await page.locator('form').count()===0,'Expired link cannot edit');}
   else {
    const input=page.getByLabel('Nova senha',{exact:true}),confirm=page.getByLabel('Confirmar senha',{exact:true});
    await input.fill('synthetic-password-2026');await confirm.fill('synthetic-different-2026');
    await page.getByRole('button',{name:'Salvar nova senha',exact:true}).click();await page.getByText('As senhas não coincidem.',{exact:true}).first().waitFor();assert(updates===0,'Mismatch never submits');
    await confirm.fill('synthetic-password-2026');await page.getByRole('button',{name:'Salvar nova senha',exact:true}).click();
    await page.getByRole('button',{name:'Salvando…',exact:true}).waitFor();assert(await page.getByRole('button',{name:'Salvando…',exact:true}).isDisabled(),'Pending is disabled');await resume();
    await page.getByText('Não foi possível salvar a nova senha. Solicite outro link.',{exact:true}).first().waitFor();
    assert(await input.inputValue()==='synthetic-password-2026','Error preserves draft');
   }
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow&&!errors.length,JSON.stringify({width,height,state,overflow,errors}));
   await page.screenshot({path:`${output}/reset-${state}-${viewportKey}.png`,fullPage:true});
   await captureSurfaceCensus(page,{path:`${output}/reset-${state}-${viewportKey}.surface.json`,state:`reset/${state}`,screenshot:`reset-${state}-${viewportKey}.png`});
   if(state==='ready') {
    reject=false;await page.getByRole('button',{name:'Salvar nova senha',exact:true}).click();await page.getByRole('button',{name:'Salvando…',exact:true}).waitFor();await resume();
    await page.locator('.tadeon-continuity-hero').waitFor();assert(updates===2,'Retry submitted exactly once');
   }
   rows.push({route:'/reset-password',width,height,state,overflow,errors,pending:state==='ready',rejectionPreservesDraft:state==='ready',retry:state==='ready',realPasswordWrites:0});writeFileSync(`${output}/results.json`,JSON.stringify(rows,null,2));console.log(`${viewportKey}: reset/${state}`);await page.close();
  }
  await browser.close();browser=null;
 }
}finally{await browser?.close();try{process.kill(-server.pid,'SIGTERM');}catch{/* already stopped */}}
