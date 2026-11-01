/** Read-only input, isolated PostgreSQL restore. Never connects to a database server. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const input = process.argv[2];
if (!input)
  throw Error("Usage: node scripts/verify-v4-application-restore.mjs /private/backup.dump");
const { PGlite } = await import(process.env.NEXUS_PGLITE_MODULE || "@electric-sql/pglite");
const binary = process.env.NEXUS_PG_RESTORE || "pg_restore";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const scratch = mkdtempSync(join(tmpdir(), "tadeon-restore-"));
let source, restored;
try {
  const toc = execFileSync(binary, ["--list", input], { encoding: "utf8" });
  // Keep actual table definitions/checks and their pure validators. Do not stub failed checks.
  const selected = toc
    .split("\n")
    .filter(
      (line) =>
        / (TYPE|DOMAIN|TABLE|TABLE DATA|SEQUENCE|SEQUENCE SET) (public|private) /.test(line) ||
        line.includes(" SCHEMA - private ") ||
        / FUNCTION private (tdv2_character_valid|is_valid_tabletop_director_state|is_valid_tabletop_director_cue)\(jsonb\)/.test(
          line,
        ),
    );
  const tables = selected
    .flatMap((line) => {
      const match = line.match(/ TABLE public (\w+) /);
      return match ? [`public.${match[1]}`] : [];
    })
    .sort();
  assert(tables.length > 0, "The backup has no supported application tables.");
  const list = join(scratch, "application.toc");
  writeFileSync(list, selected.join("\n") + "\n", { mode: 0o600 });
  const sql = execFileSync(
    binary,
    ["--no-owner", "--no-acl", "--use-list", list, "--file", "-", input],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  ).replace(/^\\(?:un)?restrict.*$/gm, "");
  source = new PGlite();
  const verified = [];
  let cursor = 0;
  // pg_dump text COPY escapes tabs/newlines in data; a physical newline delimits a row.
  for (const match of sql.matchAll(
    /^COPY (public\.\w+) \(([^\n]+)\) FROM stdin;\n([\s\S]*?)^\\\.\n/gm,
  )) {
    await source.exec(sql.slice(cursor, match.index));
    // /dev/blob is PGlite's in-memory COPY API, not a file on a database server.
    await source.exec(`COPY ${match[1]} (${match[2]}) FROM '/dev/blob'`, {
      blob: new Blob([match[3]]),
    });
    const rows = match[3] ? match[3].split("\n").length - 1 : 0;
    assert.equal((await source.query(`select count(*)::int n from ${match[1]}`)).rows[0].n, rows);
    const query = `select to_jsonb(t)::text row from ${match[1]} t order by to_jsonb(t)::text`;
    verified.push({
      table: match[1],
      rows,
      query,
      hash: hash(JSON.stringify((await source.query(query)).rows)),
    });
    cursor = match.index + match[0].length;
  }
  await source.exec(sql.slice(cursor));
  assert.deepEqual(
    verified.map((t) => t.table).sort(),
    tables,
    "Every application table must have a restored COPY block.",
  );
  const image = await source.dumpDataDir();
  await source.close();
  source = null;
  restored = new PGlite({ loadDataDir: image });
  for (const table of verified)
    assert.equal(
      hash(JSON.stringify((await restored.query(table.query)).rows)),
      table.hash,
      `Restored content differs in ${table.table}`,
    );
  // No rows, credentials, per-table hashes or database image are written to the report.
  console.log(
    JSON.stringify({
      passed: true,
      dumpSha256: hash(readFileSync(input)),
      engine: "isolated PostgreSQL (PGlite)",
      applicationTables: verified.length,
      rows: verified.reduce((n, table) => n + table.rows, 0),
      allTableHashesMatched: true,
      scope: "public application tables and inline checks; binary image exported and reloaded",
      notCertified: [
        "Supabase Auth/Realtime/Storage services",
        "roles, policies, triggers and RPC operation",
        "Storage/R2 object bytes",
      ],
      migrationGate: "full-service restore remains required before production migrations",
    }),
  );
} catch (error) {
  // Database errors may contain user rows. Keep raw diagnostics out of CI/artifact logs.
  console.error("Isolated application restore failed; no migration is authorized by this result.");
  console.error(
    error.code ? `PostgreSQL code: ${error.code}` : "Review the private input in isolation.",
  );
  process.exitCode = 1;
} finally {
  if (source) await source.close();
  if (restored) await restored.close();
  rmSync(scratch, { recursive: true, force: true });
}
