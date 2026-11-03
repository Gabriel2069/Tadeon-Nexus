import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const { PGlite } = await import(process.env.NEXUS_PGLITE_MODULE || "@electric-sql/pglite");
const require = createRequire(import.meta.url);
const testRoot = mkdtempSync(tmpdir() + "/tdv2-postgres-");
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
let engine = ts
  .transpileModule(readFileSync("src/lib/tdv2.ts", "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  })
  .outputText.replace(
    'from "zod"',
    "from " + JSON.stringify(pathToFileURL(require.resolve("zod")).href),
  );
writeFileSync(testRoot + "/engine.mjs", engine);
const {
  newTdvCharacter,
  finishCreation,
  addMilestone,
  invest,
  setResourceModifier,
  addCapabilityEffect,
  grantPractice,
  grantMilestone,
  advanceCapability,
  constitution,
  adoptFoundation,
} = await import(pathToFileURL(testRoot + "/engine.mjs"));
const db = new PGlite();
let checks = 0;
const player = "00000000-0000-4000-8000-000000000001",
  master = "00000000-0000-4000-8000-000000000002",
  stranger = "00000000-0000-4000-8000-000000000003",
  sheet = "00000000-0000-4000-8000-000000000010";
const schema = `create role anon; create role authenticated; create role service_role; create schema private; create schema auth; create type public.app_role as enum ('mestre','jogador','espectador'); create table public.user_roles(user_id uuid,role public.app_role); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; create table public.character_sheets(id uuid primary key,owner_id uuid,name text,attributes jsonb default '{}'); create table public.game_settings(id uuid primary key); grant usage on schema public,private,auth to authenticated; grant select on public.user_roles to authenticated; grant all on public.character_sheets to authenticated; insert into user_roles values('${player}','jogador'),('${master}','mestre'),('${stranger}','jogador'); alter table public.character_sheets enable row level security; create policy own on public.character_sheets to authenticated using (owner_id=auth.uid() or exists(select 1 from public.user_roles where user_id=auth.uid() and role='mestre')) with check(owner_id=auth.uid() or exists(select 1 from public.user_roles where user_id=auth.uid() and role='mestre')); insert into character_sheets values('00000000-0000-4000-8000-000000000099','${player}','Legado','{"COR":3,"MEN":2}');`;
await db.exec(schema);
await db.exec(
  readFileSync("supabase/migrations/20261027093709_tdv_ii_versioned_rules.sql", "utf8"),
);
const old = (await db.query("select rules_version,tdv2_data,attributes from character_sheets"))
  .rows[0];
assert.deepEqual(old, { rules_version: 1, tdv2_data: null, attributes: { COR: 3, MEN: 2 } });
checks++;
const auth = async (id) =>
  db.exec(
    `reset role;select set_config('request.jwt.claim.sub','${id}',false);set role authenticated;`,
  );
const valid = async (c) =>
  (await db.query("select private.tdv2_character_valid($1::jsonb) ok", [JSON.stringify(c)])).rows[0]
    .ok;
assert.equal(await valid(newTdvCharacter("base", "legacy")), true);
checks++;
let c = newTdvCharacter("reference", "legacy");
assert.equal(await valid(c), true);
checks++;
assert.equal(await valid({ ...c, version: undefined }), false);
checks++;
assert.equal(await valid({ ...c, resources: { ...c.resources, pv: 1000 } }), false);
checks++;
await auth(player);
await db.query(
  "insert into character_sheets(id,owner_id,name,rules_version,tdv2_data) values($1,$2,$3,2,$4)",
  [sheet, player, "Iria", JSON.stringify(c)],
);
checks++;
c.face.origin = "Cais";
c.face.occupation = "Registradora";
c.face.conviction = "Testemunhos";
c.face.limit = "Não entregar inocentes";
c.face.links[0].node = "Elen";
c.face.links[0].nature = "Confiança";
c.face.anchor.detail = "A promessa";
c = finishCreation(c);
const update = async (value) =>
  db.query("update character_sheets set tdv2_data=$1 where id=$2 returning id", [
    JSON.stringify(value),
    sheet,
  ]);
await update(c);
checks++;
await assert.rejects(() => update({ ...c, matrices: { ...c.matrices, Nexo: 2 } }));
checks++;
await assert.rejects(() => update(addMilestone(c, "A", "A")));
checks++;
await assert.rejects(() =>
  db.query("update character_sheets set rules_version=1 where id=$1", [sheet]),
);
checks++;
await auth(master);
c = addMilestone(addMilestone(c, "A", "A"), "B", "B");
await update(c);
checks++;
await auth(player);
c = invest(c, {
  kind: "Alinhavo",
  target: "Iniciativa",
  cost: 2,
  reason: "Aprendizado incorporado",
  transcendent: false,
});
await update(c);
checks++;
await assert.rejects(() => update({ ...c, investments: [] }));
checks++;
await assert.rejects(() =>
  update({
    ...c,
    investments: [
      ...c.investments,
      { id: "fake", kind: "Lavor", target: "X", cost: 6, reason: "X", transcendent: false },
    ],
  }),
);
checks++;
await assert.rejects(() => update({ ...c, resources: { ...c.resources, pe: -1 } }));
checks++;
await auth(stranger);
assert.equal((await db.query("select count(*) n from character_sheets")).rows[0].n, 0);
checks++;
assert.equal((await update({ ...c, notes: "intrusão" })).rows.length, 0);
checks++;
await auth(player);
assert.notEqual(
  (await db.query("select tdv2_data from character_sheets where id=$1", [sheet])).rows[0].tdv2_data
    .notes,
  "intrusão",
);
checks++;
await db.exec(`reset role;
create type public.knowledge_node_type as enum ('character','npc','creature','transcendental_ability','fragment','rule','session','clue');
create function private.is_feature_enabled(text) returns boolean language sql as $$select true$$;
create function private.can_manage_workspace(uuid) returns boolean language sql as $$select auth.uid()='${master}'::uuid$$;
create table knowledge_templates(workspace_id uuid,node_type public.knowledge_node_type,name text,description text,default_content text,default_properties jsonb,required_fields text[],suggested_relations jsonb,is_default boolean,created_by uuid,updated_by uuid,unique(workspace_id,node_type,name));
grant select,insert,update on knowledge_templates to authenticated;`);
const workspace = "00000000-0000-4000-8000-000000000088";
await auth(player);
await assert.rejects(() => db.query("select ensure_tdv2_knowledge_templates($1)", [workspace]));
checks++;
await auth(master);
assert.equal(
  (await db.query("select ensure_tdv2_knowledge_templates($1) n", [workspace])).rows[0].n,
  9,
);
checks++;
await db.query(
  "update knowledge_templates set default_content='CUSTOM' where name='Feição TdV II'",
);
assert.equal(
  (await db.query("select ensure_tdv2_knowledge_templates($1) n", [workspace])).rows[0].n,
  0,
);
checks++;
assert.equal(
  (await db.query("select default_content from knowledge_templates where name='Feição TdV II'"))
    .rows[0].default_content,
  "CUSTOM",
);
checks++;
const snapshot = (
  await db.query("select sheet_history_snapshot($1::jsonb) data", [
    JSON.stringify({ rules_version: 2, tdv2_data: c, attributes: { COR: 3 } }),
  ])
).rows[0].data;
assert.deepEqual(snapshot.tdv2_data, c);
assert.equal(snapshot.rules_version, 2);
assert.deepEqual(snapshot.attributes, { COR: 3 });
checks++;
await db.exec(`reset role;
alter table game_settings add column key text, add column campaign_id uuid;
create table tabletop_scenes(id uuid primary key,campaign_id uuid,name text);
create table tabletop_entities(id uuid primary key,scene_id uuid,linked_sheet_id uuid,properties jsonb default '{}',version integer default 1);
create table tabletop_sessions(id uuid,current_scene_id uuid,status text);
create table tabletop_session_participants(session_id uuid,user_id uuid,state text,left_at timestamptz,removed_by uuid,role text);
create schema realtime;
create table realtime.test_messages(payload jsonb,event text,topic text,private boolean);
create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as $$insert into realtime.test_messages values(payload,event,topic,private)$$;
grant usage on schema realtime to authenticated;
grant execute on function realtime.send(jsonb,text,text,boolean) to authenticated;
grant select,insert on realtime.test_messages to authenticated;
grant all on game_settings,tabletop_scenes,tabletop_entities,tabletop_sessions,tabletop_session_participants to authenticated;
alter table game_settings enable row level security;
create policy master_settings on game_settings to authenticated using(auth.uid()='${master}'::uuid) with check(auth.uid()='${master}'::uuid);
alter table tabletop_entities enable row level security;
create policy master_entities_insert on tabletop_entities for insert to authenticated with check(auth.uid()='${master}'::uuid);
create policy public_entities on tabletop_entities for select to authenticated using(true);
create policy master_entities on tabletop_entities for update to authenticated using(auth.uid()='${master}'::uuid) with check(auth.uid()='${master}'::uuid);
`);
await db.exec(
  readFileSync("supabase/migrations/20261027191353_tdv_ii_operational_play.sql", "utf8"),
);
await auth(master);
assert.equal(
  await valid({ ...c, guard: { ...c.guard, protection: 3, protectionSource: "Parede" } }),
  false,
);
checks++;
assert.equal(
  await valid({ ...c, guard: { ...c.guard, protection: 1, protectionSource: "" } }),
  false,
);
checks++;
assert.equal(
  await valid({
    ...c,
    guard: {
      ...c.guard,
      protection: 2,
      protectionSource: "Parede",
      totalCover: "Abordagem impedida",
    },
  }),
  false,
);
checks++;
assert.equal(
  await valid({ ...c, guard: { ...c.guard, protection: 2, protectionSource: "Parede" } }),
  true,
);
checks++;
assert.equal(await valid({ ...c, guard: { ...c.guard, modifier: 3, source: "" } }), false);
checks++;
assert.equal(
  (await db.query("select ensure_tdv2_knowledge_templates($1) n", [workspace])).rows[0].n,
  5,
);
checks++;
assert.equal(
  (await db.query("select ensure_tdv2_knowledge_templates($1) n", [workspace])).rows[0].n,
  0,
);
checks++;
assert.equal(
  (await db.query("select default_content from knowledge_templates where name='Feição TdV II'"))
    .rows[0].default_content,
  "CUSTOM",
);
checks++;
const scene = "00000000-0000-4000-8000-000000000077",
  settingsId = "00000000-0000-4000-8000-000000000078",
  campaign = "00000000-0000-4000-8000-000000000079",
  entityId = "00000000-0000-4000-8000-000000000080",
  session = "00000000-0000-4000-8000-000000000081";
await db.query("insert into tabletop_scenes values($1,$2,'Arquivo')", [scene, campaign]);
await db.query(
  "insert into tabletop_entities(id,scene_id,linked_sheet_id,properties) values($1,$2,$3,$4)",
  [entityId, scene, sheet, JSON.stringify({ color: "ivory", notes: "TOKEN PRIVATE" })],
);
await db.query("insert into tabletop_sessions values($1,$2,'open')", [session, scene]);
await db.query(
  "insert into tabletop_session_participants(session_id,user_id,state,role) values($1,$2,'active','master')",
  [session, master],
);
await db.query("insert into game_settings(id,key,campaign_id) values($1,'global',$2)", [
  settingsId,
  campaign,
]);
let state = {
  version: 2,
  round: 1,
  tabletopSceneId: scene,
  participants: [{ sheetId: sheet, impulses: 2, response: true, position: "Disputada" }],
  notes: "GM SECRET",
  objective: "GM SECRET",
};
const saveMaster = async (revision, state) =>
  db.query(
    "update game_settings set tdv2_state=$1 where id=$2 and tdv2_revision=$3 returning tdv2_revision",
    [JSON.stringify(state), settingsId, revision],
  );
assert.equal((await saveMaster(0, state)).rows[0].tdv2_revision, 1);
checks++;
const props = (await db.query("select properties from tabletop_entities where id=$1", [entityId]))
  .rows[0].properties;
assert.deepEqual(props.tdv2_round, {
  version: 2,
  round: 1,
  impulses: 2,
  responses: 1,
  position: "Disputada",
  revision: 1,
});
checks++;
assert.equal(props.notes, "TOKEN PRIVATE");
assert.equal(JSON.stringify(props).includes("GM SECRET"), false);
checks++;
assert.equal((await saveMaster(0, { ...state, round: 2 })).rows.length, 0);
checks++;
const messages = (await db.query("select * from realtime.test_messages")).rows;
assert.equal(messages.length, 1);
assert.equal(messages[0].private, true);
assert.equal(messages[0].payload.type, "round.state");
assert.equal(JSON.stringify(messages).includes("GM SECRET"), false);
checks++;
state = { ...state, notes: "Updated private note" };
await saveMaster(1, state);
assert.equal((await db.query("select count(*) n from realtime.test_messages")).rows[0].n, 1);
checks++;
await auth(player);
assert.equal((await saveMaster(2, { ...state, round: 99 })).rows.length, 0);
checks++;
assert.equal(
  (await db.query("update tabletop_entities set properties='{}' returning id")).rows.length,
  0,
);
checks++;
await auth(master);
await saveMaster(2, { ...state, tabletopSceneId: "" });
assert.equal(
  (await db.query("select properties from tabletop_entities where id=$1", [entityId])).rows[0]
    .properties.tdv2_round,
  undefined,
);
checks++;
assert.deepEqual(
  (await db.query("select attributes from character_sheets where name='Legado'")).rows[0]
    .attributes,
  { COR: 3, MEN: 2 },
);
checks++;
// DEC-031: delegated authority comes only from the stored master grant.
await db.exec("reset role");
await db.exec(
  readFileSync("supabase/migrations/20261102153325_tdv_sheet_authorized_corrections.sql", "utf8"),
);
await db.exec(
  readFileSync("supabase/migrations/20261102183118_tdv_progression_without_form_gate.sql", "utf8"),
);
await auth(master);
let authorized = { ...c, progression: { allowCreation: false, allowMilestones: false } };
await update(authorized);
await auth(player);
await assert.rejects(() =>
  update({ ...authorized, progression: { allowCreation: false, allowMilestones: true } }),
);
checks++;
await assert.rejects(() => update(addMilestone(authorized, "Delegated", "Changed")));
checks++;
await auth(master);
authorized.progression.allowMilestones = true;
await update(authorized);
await auth(player);
const advanced = addMilestone(authorized, "Delegated", "Changed");
await update(advanced);
checks++;
await assert.rejects(() => update({ ...advanced, milestones: advanced.milestones.slice(1) }));
checks++;
await assert.rejects(() =>
  update({
    ...advanced,
    milestones: advanced.milestones.map((m, i) => (i ? m : { ...m, event: "Rewrite" })),
  }),
);
checks++;
await assert.rejects(() =>
  update({
    ...advanced,
    face: { ...advanced.face, anchor: { ...advanced.face.anchor, pillar: "Origem" } },
  }),
);
checks++;
await auth(master);
const reopened = {
  ...advanced,
  investments: [],
  progression: { allowMilestones: false, allowCreation: true },
};
await update(reopened);
await auth(player);
await assert.rejects(() =>
  update({
    ...reopened,
    face: { ...reopened.face, anchor: { ...reopened.face.anchor, pillar: "Origem" } },
  }),
);
checks++;
await assert.rejects(() =>
  update({ ...reopened, progression: { allowMilestones: true, allowCreation: true } }),
);
checks++;
await auth(master);
await update({ ...reopened, progression: { allowMilestones: false, allowCreation: false } });
await auth(player);
await assert.rejects(() =>
  update({
    ...reopened,
    face: { ...reopened.face, anchor: { ...reopened.face.anchor, pillar: "Origem" } },
    progression: { allowMilestones: false, allowCreation: false },
  }),
);
checks++;
await assert.rejects(() =>
  db.query(
    "insert into character_sheets(id,owner_id,name,rules_version,tdv2_data) values($1,$2,$3,2,$4)",
    [
      "00000000-0000-4000-8000-000000000077",
      player,
      "Forged grant",
      JSON.stringify({
        ...newTdvCharacter("base", "legacy"),
        progression: { allowCreation: true, allowMilestones: false },
      }),
    ],
  ),
);
checks++;
await db.exec("reset role; set role anon");
await assert.rejects(() => db.query("select * from character_sheets"));
checks++;
// Drafts can advance, but only the mestre can reverse even before numerical sealing.
await auth(master);
const draft = newTdvCharacter("reference", "legacy");
draft.face.origin = "";
draft.face.occupation = "";
draft.face.conviction = "";
draft.face.limit = "";
draft.face.anchor.detail = "";
draft.face.links = [];
await update(draft);
await auth(player);
await assert.rejects(() => update({ ...draft, alinhavos: { ...draft.alinhavos, Engenharia: 0 } }));
checks++;
await update(finishCreation(draft));
checks++;
await auth(master);
await update(newTdvCharacter("base", "legacy"));
await auth(player);
const increased = newTdvCharacter("base", "legacy");
increased.matrices.Ímpeto = 2;
await update(increased);
checks++;
await assert.rejects(() => update(newTdvCharacter("base", "legacy")));
checks++;
// Optional DEC-033 payloads obey the same capacity calculations on the server.
await db.exec("reset role");
await db.exec(readFileSync("supabase/migrations/20261102234203_tdv_resource_effects.sql", "utf8"));
const effectsBase = finishCreation(newTdvCharacter("reference", "legacy"));
const raised = setResourceModifier(effectsBase, "pv", 5, 15);
assert.equal(await valid(raised), true);
checks++;
assert.equal(await valid({ ...raised, resources: { ...raised.resources, pv: 16 } }), false);
checks++;
assert.equal(await valid(setResourceModifier(effectsBase, "pi", -20)), true);
checks++;
assert.equal(await valid({ ...effectsBase, resourceModifiers: { pv: "5", pi: 0, pe: 0 } }), false);
checks++;
assert.equal(await valid(addCapabilityEffect(effectsBase, "Nexo", "Bônus", 2)), true);
checks++;
for (const patch of [
  { target: undefined },
  { target: "Tudo" },
  { kind: "Proveito", value: 2 },
  { value: 0.5 },
  { kind: "Bônus", value: 0 },
]) {
  const e = addCapabilityEffect(effectsBase, "Nexo", "Bônus", 2);
  e.temporaryEffects[0] = { ...e.temporaryEffects[0], ...patch };
  assert.equal(await valid(e), false);
  checks++;
}
assert.equal(await valid({ ...effectsBase, crisisMarks: { dying: 3, collapse: 3 } }), true);
checks++;
assert.equal(await valid({ ...effectsBase, crisisMarks: { dying: 4, collapse: 0 } }), false);
checks++;
await auth(player);
await update(raised);
checks++;
await assert.rejects(() =>
  update({ ...raised, progression: { allowMilestones: true, allowCreation: true } }),
);
checks++;
// New revision and old payloads coexist under the same constraint and RLS.
await db.exec("reset role");
await db.exec(
  "alter table public.character_sheets add column updated_at timestamptz default now()",
);
await db.exec(readFileSync("supabase/migrations/20261103200854_tdv_foundation_viii.sql", "utf8"));
assert.equal(await valid(newTdvCharacter("base", "VIII")), true);
checks++;
assert.equal(await valid(newTdvCharacter("reference", "VIII")), true);
checks++;
assert.equal(await valid(newTdvCharacter("reference", "legacy")), true);
checks++;
let modern = finishCreation(newTdvCharacter("reference", "VIII"));
assert.equal(await valid(modern), true);
checks++;
await auth(master);
await update(modern);
checks++;
await auth(player);
await assert.rejects(() => update(grantPractice(modern, "Crédito forjado", 2)));
checks++;
await assert.rejects(() => update({ ...modern, foundation: undefined }));
checks++;
await assert.rejects(() =>
  update({ ...modern, foundation: { ...modern.foundation, nexoHighWater: 5 } }),
);
checks++;
await assert.rejects(() =>
  update({ ...modern, crisisMarks: { dying: 1, collapse: 0, surrender: 0 } }),
);
checks++;
await auth(master);
modern = grantPractice(grantMilestone(modern), "Treino reconhecido", 2);
await update(modern);
checks++;
await auth(player);
const bought = advanceCapability(modern, "Luta", false);
assert.equal(await valid(bought), true);
await update(bought);
checks++;
assert.equal(
  await valid({ ...bought, investments: bought.investments.map((e) => ({ ...e, cost: 2 })) }),
  false,
);
checks++;
await assert.rejects(() => update(modern));
checks++;
const adapted = adoptFoundation(finishCreation(newTdvCharacter("reference", "legacy")));
assert.equal(await valid(adapted), true);
checks++;
await assert.rejects(() => update(adapted));
checks++;
await auth(master);
await update(newTdvCharacter("base", "VIII"));
await auth(player);
let modernDraft = newTdvCharacter("base", "VIII");
modernDraft.matrices.Ímpeto = 2;
await update(modernDraft);
modernDraft.matrices.Ímpeto = 1;
await update(modernDraft);
checks++;
await auth(master);
await update(modern);
let masterRow = (
  await db.query("select tdv2_revision from game_settings where id=$1", [settingsId])
).rows[0];
await saveMaster(masterRow.tdv2_revision, state);
await auth(player);
const exhausted = { ...modern, resources: { ...modern.resources, pe: 0 } };
await update(exhausted);
checks++;
const projected = (
  await db.query("select properties from tabletop_entities where id=$1", [entityId])
).rows[0].properties.tdv2_round;
assert.equal(projected.impulses, 1);
assert.equal(projected.responses, 0);
checks++;
await auth(master);
masterRow = (
  await db.query("select tdv2_revision,tdv2_state from game_settings where id=$1", [settingsId])
).rows[0];
const stamp = (
  await db.query("select updated_at::text stamp from character_sheets where id=$1", [sheet])
).rows[0].stamp;
const actionCharacter = {
  ...exhausted,
  resources: { ...exhausted.resources, pv: exhausted.resources.pv - 1 },
};
await assert.rejects(() =>
  db.query("select public.apply_tdv2_scene_action($1,$2,$3,$4,$5,$6)", [
    sheet,
    stamp,
    JSON.stringify(actionCharacter),
    settingsId,
    Number(masterRow.tdv2_revision) + 100,
    JSON.stringify(masterRow.tdv2_state),
  ]),
);
checks++;
assert.equal(
  (
    await db.query("select tdv2_data->'resources'->>'pv' pv from character_sheets where id=$1", [
      sheet,
    ])
  ).rows[0].pv,
  String(exhausted.resources.pv),
);
checks++;
await db.query("select public.apply_tdv2_scene_action($1,$2,$3,$4,$5,$6)", [
  sheet,
  stamp,
  JSON.stringify(actionCharacter),
  settingsId,
  masterRow.tdv2_revision,
  JSON.stringify(masterRow.tdv2_state),
]);
checks++;
await auth(player);
await assert.rejects(() =>
  db.query("select public.apply_tdv2_scene_action($1,$2,$3,$4,$5,$6)", [
    sheet,
    stamp,
    JSON.stringify(actionCharacter),
    settingsId,
    masterRow.tdv2_revision,
    JSON.stringify(masterRow.tdv2_state),
  ]),
);
checks++;
console.log(
  JSON.stringify({
    passed: true,
    checks,
    engine: "PostgreSQL (PGlite)",
    migrations: [
      "20261027093709_tdv_ii_versioned_rules",
      "20261027191353_tdv_ii_operational_play",
      "20261102153325_tdv_sheet_authorized_corrections",
      "20261102183118_tdv_progression_without_form_gate",
      "20261102234203_tdv_resource_effects",
      "20261103200854_tdv_foundation_viii",
    ],
    legacyUnchanged: true,
  }),
);
await db.close();
