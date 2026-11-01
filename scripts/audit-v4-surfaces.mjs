/** V4 phase 0: source census. Reachability is evidence to investigate, never runtime certification. */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, relative, dirname } from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`;
    return entry.isDirectory() ? walk(path) : [path];
  });
const unique = (values) => [...new Set(values)].sort();

export function inspectModule(source, path) {
  const ast = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const imports = [],
    renders = [],
    actions = [],
    data = [],
    routes = [],
    guards = [];
  const at = (node) => ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1;
  const snippet = (node) => node.getText(ast).replace(/\s+/g, " ").slice(0, 240);
  function visit(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const names = [];
      if (node.importClause?.name) names.push(node.importClause.name.text);
      const bindings = node.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings))
        names.push(...bindings.elements.filter((el) => !el.isTypeOnly).map((el) => el.name.text));
      if (!node.importClause?.isTypeOnly)
        imports.push({
          specifier: node.moduleSpecifier.text,
          names,
          line: at(node),
          kind: "static",
        });
    }
    if (ts.isCallExpression(node)) {
      const arg = node.arguments[0];
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword && arg && ts.isStringLiteral(arg)) {
        let owner = node.parent;
        while (owner && !ts.isVariableDeclaration(owner) && !ts.isSourceFile(owner))
          owner = owner.parent;
        imports.push({
          specifier: arg.text,
          names:
            owner && ts.isVariableDeclaration(owner) && ts.isIdentifier(owner.name)
              ? [owner.name.text]
              : [],
          line: at(node),
          kind: "dynamic",
        });
      }
      const name = ts.isPropertyAccessExpression(node.expression)
        ? node.expression.name.text
        : node.expression.getText(ast);
      if (name === "createFileRoute" && arg && ts.isStringLiteral(arg)) routes.push(arg.text);
      if (["from", "rpc", "invoke", "channel", "getItem", "setItem"].includes(name))
        data.push({
          operation: name,
          target: arg && ts.isStringLiteralLike(arg) ? arg.text : "[dynamic]",
          line: at(node),
        });
      if (["can", "hasRole", "canEdit", "canManageWorkspace", "canManageCampaign"].includes(name))
        guards.push({ expression: snippet(node), line: at(node) });
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(ast);
      const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
      renders.push({ component: tag, line: at(node) });
      const name = attrs.find((a) =>
        ["aria-label", "title", "id", "name"].includes(a.name.getText(ast)),
      );
      for (const attr of attrs) {
        const event = attr.name.getText(ast);
        if (/^on[A-Z]/.test(event) || ["to", "href"].includes(event))
          actions.push({
            component: tag,
            line: at(attr),
            event,
            expression: attr.initializer ? snippet(attr.initializer) : "true",
            label: name?.initializer ? snippet(name.initializer) : null,
            certification: "source-only",
          });
        if (["requireRole", "canEdit", "disabled", "readOnly", "canInteract"].includes(event))
          guards.push({ expression: `${tag} ${snippet(attr)}`, line: at(attr) });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return { imports, renders, actions, data, routes, guards };
}

export function buildSurfaceCensus(root) {
  const files = walk(resolve(root, "src"))
    .filter((p) => /\.[cm]?tsx?$/.test(p) && !/\.test\./.test(p) && !p.endsWith("routeTree.gen.ts"))
    .sort();
  const modules = {};
  function localImport(file, specifier) {
    if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return null;
    const base = specifier.startsWith("@/")
      ? resolve(root, "src", specifier.slice(2))
      : resolve(dirname(file), specifier);
    return (
      [base, ...[".ts", ".tsx", "/index.ts", "/index.tsx"].map((s) => base + s)].find((p) =>
        files.includes(p),
      ) ?? null
    );
  }
  for (const file of files) {
    const path = relative(root, file),
      source = readFileSync(file, "utf8");
    const info = inspectModule(source, path);
    modules[path] = {
      sha256: createHash("sha256").update(source).digest("hex"),
      ...info,
      imports: info.imports.map((imp) => ({
        ...imp,
        target: localImport(file, imp.specifier)
          ? relative(root, localImport(file, imp.specifier))
          : null,
      })),
    };
  }
  const reach = (entries) => {
    const seen = new Set(),
      pending = [...entries];
    while (pending.length) {
      const file = pending.pop();
      if (seen.has(file) || !modules[file]) continue;
      seen.add(file);
      pending.push(...modules[file].imports.flatMap((i) => (i.target ? [i.target] : [])));
    }
    return [...seen].sort();
  };
  const rootFile = "src/routes/__root.tsx";
  const routes = Object.entries(modules)
    .flatMap(([file, m]) =>
      m.routes.map((route) => {
        const reachable = reach([rootFile, file]);
        return {
          route: route.replace(/_\//g, "/"),
          routeId: route,
          file,
          reachable,
          runtimeCertification: "pending",
          actions: reachable.filter((p) => modules[p].actions.length),
          permissionSources: reachable.filter((p) => modules[p].guards.length),
          dataSources: reachable.filter((p) => modules[p].data.length),
          responsive: { desktop: "pending", tablet: "pending", mobile: "pending" },
          test: [],
          screenshot: [],
        };
      }),
    )
    .sort((a, b) => a.route.localeCompare(b.route));
  const bridges = Object.keys(modules)
    .filter((p) => p.endsWith("-bridge.tsx"))
    .map((path) => ({
      path,
      importedBy: Object.entries(modules)
        .filter(([, m]) => m.imports.some((i) => i.target === path))
        .map(([p]) => p),
      jsxReferences: Object.entries(modules).flatMap(([p, m]) =>
        m.imports
          .filter((i) => i.target === path)
          .flatMap((i) =>
            m.renders.filter((r) => i.names.includes(r.component)).map((r) => ({ file: p, ...r })),
          ),
      ),
      certification: "pending-runtime",
    }));
  const tests = walk(resolve(root, "src"))
    .concat(walk(resolve(root, "scripts")))
    .filter((p) => /\.test\.[cm]?[jt]sx?$/.test(p))
    .map((p) => relative(root, p))
    .sort();
  return {
    version: 1,
    scope:
      "Source inventory; imports and JSX references do not prove a feature mounted, a handler executed, authorization or persistence.",
    root: rootFile,
    routes,
    bridges,
    tests,
    modules,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = process.cwd(),
    target = "docs/v4/surface-manifest.json";
  const result = buildSurfaceCensus(root),
    content = JSON.stringify(result, null, 2) + "\n";
  if (process.argv.includes("--write")) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  } else if (!existsSync(target) || readFileSync(target, "utf8") !== content) {
    throw Error(
      "V4 source census is stale. Run node scripts/audit-v4-surfaces.mjs --write and review the diff; runtime certification is separate.",
    );
  }
  console.log(
    JSON.stringify({
      routes: result.routes.length,
      modules: Object.keys(result.modules).length,
      actions: Object.values(result.modules).reduce((n, m) => n + m.actions.length, 0),
      bridges: result.bridges.length,
      tests: result.tests.length,
      runtimeCertified: false,
    }),
  );
}
