import { V4_VIEWPORTS } from "./v4-viewports.mjs";
/** Reconcile local fixture artifacts with source contracts. No backend connection. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';
import { createHash } from 'node:crypto';
const args=process.argv.slice(2);
if(!args.length) throw Error('Supply completed browser-artifact directories');
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const digest=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const contracts=read('docs/v4/route-contracts.json');
const source=read('docs/v4/surface-manifest.json');
const captures=[];
for(const directory of args.map(directory=>resolve(directory))) {
  if(basename(directory).includes('login')&&existsSync(join(directory,'results.json'))) {
    const login=read(join(directory,'results.json'));
    if(login.length!==V4_VIEWPORTS.length)throw Error('Incomplete login matrix');
    login.forEach((result,i)=>{
      const [width,height]=V4_VIEWPORTS[i],image=`login-${width}x${height}.png`,screenshot=join(directory,image);
      if(result.width!==width||result.errors.length||!existsSync(screenshot))throw Error('Login evidence mismatch');
      captures.push({route:'/login',state:'signin/error/recovery/signup',viewport:{width,height},artifact:basename(directory)+'/results.json',resultsSha256:digest(join(directory,'results.json')),visibleControls:null,screenshot:{artifact:basename(directory)+'/'+image,sha256:digest(screenshot)},evidence:'Rendered and interacted with a synthetic transport; no DOM census and no real account certification'});
    });
  }
  for(const name of readdirSync(directory).filter(n=>n.endsWith('.surface.json'))) {
    const path=join(directory,name),c=read(path);
    const screenshot=c.screenshot?join(directory,c.screenshot):null;
    if(screenshot&&!existsSync(screenshot)) throw Error('Missing screenshot '+screenshot);
    captures.push({route:c.route.replace(/\/sheet\/[^/?]+/, '/sheet/$id'),state:c.state,viewport:c.viewport,
      artifact:basename(directory)+'/'+name,censusSha256:digest(path),visibleControls:c.controls.filter(x=>x.visible).length,
      screenshot:screenshot?{artifact:basename(directory)+'/'+c.screenshot,sha256:digest(screenshot)}:null});
  }
}
// Later directories supersede earlier captures of the same route/state/viewport.
const uniqueCaptures=[...new Map(captures.map(c=>[[c.route,c.state,c.viewport.width,c.viewport.height].join('|'),c])).values()];
const routes=contracts.routes.map(c=>({route:c.route,component:c.component,actionGroups:c.actionGroups,
  sourceActionRefs:c.sourceActionRefs,permission:c.permission,persistentData:c.persistentData,disposition:c.disposition,
  test:c.test,captures:uniqueCaptures.filter(x=>x.route.split('?')[0]===c.route),
  status:uniqueCaptures.some(x=>x.route.split('?')[0]===c.route)?'mounted-in-fixture':'source-only-in-this-lot',
  authorization:'server/real-account certification remains separate',
  individualActionCoverage:'Not inferred from mounted controls or source callbacks'}));
const result={version:1,visualComparisons:readdirSync('docs/v4/evidence').filter(n=>n.endsWith('.png')).sort().map(name=>({path:'docs/v4/evidence/'+name,sha256:digest('docs/v4/evidence/'+name)})),scope:'V4 phases 0–2 implementation evidence, plus sheet material regression. Local synthetic fixtures; not physical-device or real-account certification.',
  sourceManifestSha256:digest('docs/v4/surface-manifest.json'),
  materialSources:['src/styles/sheet-premium.css','src/styles/experience-surfaces.css','src/styles/hero-backgrounds.css','src/styles/workspace.css','src/styles/interface-layout.css','src/styles/desktop-shell.css','vite.config.ts'].map(path=>({path,sha256:digest(path)})),routes,
  bridgeDisposition:source.bridges.map(b=>({file:b.file??b.path,disposition:(b.file??b.path)?.includes('director-enhancement')?'preserve-unmounted-experimental':'preserve; availability requires mounted evidence'})),
  limitations:['Backup/services/private objects deferred by DEC-024','No real accounts, campaign-audience transport or physical-device certification','Screenshots are fixture artifacts; paths refer to the corresponding browser output, not a permanent public image host','Callbacks without an execution test remain uncertified','Phases 3–6 remain open; no schema or rules migration in this lot']};
writeFileSync('docs/v4/material-validation.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({routes:routes.length,captures:uniqueCaptures.length,mountedRoutes:routes.filter(r=>r.captures.length).length}));
