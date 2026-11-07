/** Focused sheet contract: current folios, new menus, effects and zero-resource states. */
export async function verifyInstruments({
  page,
  context,
  getRow,
  writes,
  role,
  width,
  height,
  geometry,
  saved,
  assert,
  resetCharacter,
}) {
  const tab = (name) => page.getByRole("tab", { name, exact: true }).click();
  const top = () =>
    page.evaluate(() => {
      scrollTo(0, 0);
      const main = document.getElementById("tadeon-main");
      if (main) main.scrollTop = 0;
    });
  const close = async (popup) => {
    await page.keyboard.press("Escape");
    await popup.waitFor({ state: "detached" });
  };
  const settle = () =>
    page.waitForFunction(() =>
      document
        .getAnimations()
        .every(
          (a) =>
            a.playState !== "running" || !Number.isFinite(a.effect?.getComputedTiming().endTime),
        ),
    );
  const fit = async (popup) => {
    await settle();
    const b = await popup.boundingBox();
    assert(
      b && b.x >= -1 && b.y >= -1 && b.x + b.width <= width + 1 && b.y + b.height <= height + 1,
      "Popup within viewport: " + JSON.stringify(b),
    );
  };
  const resourceTargets = async () => {
    const targets = await page.locator(".tdv-play-resources .tdv-resource-step").evaluateAll((es) =>
      es.map((e) => {
        const r = e.getBoundingClientRect(),
          p = e.closest(".tdv-resource").getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height, left: p.left, right: p.right };
      }),
    );
    assert(
      targets.every(
        (r) => r.w >= 43.9 && r.h >= 43.9 && r.x >= r.left - 1 && r.x + r.w <= r.right + 1,
      ),
      "Resource targets fit their own column: " + JSON.stringify(targets),
    );
    assert(
      targets.every((r, i) =>
        targets.every(
          (s, j) =>
            i === j ||
            Math.min(r.x + r.w, s.x + s.w) - Math.max(r.x, s.x) <= 1 ||
            Math.min(r.y + r.h, s.y + s.h) - Math.max(r.y, s.y) <= 1,
        ),
      ),
      "Resource targets never overlap",
    );
    const gauges = await page.locator(".tdv-resource-dial").evaluateAll((ds) =>
      ds.map((dial) => {
        const text = dial.querySelector("strong").getBoundingClientRect();
        const path = dial.querySelector(".tdv-resource-arc__track");
        const matrix = path.getScreenCTM();
        const length = path.getTotalLength();
        return Array.from({ length: 101 }, (_, i) => {
          const point = path.getPointAtLength((length * i) / 100);
          const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
          return (
            screen.x >= text.left - 3 &&
            screen.x <= text.right + 3 &&
            screen.y >= text.top - 3 &&
            screen.y <= text.bottom + 3
          );
        }).every((hit) => !hit);
      }),
    );
    assert(
      gauges.length === 3 && gauges.every(Boolean),
      "Resource arcs stay clear of their values",
    );
  };
  await page.evaluate(() => document.fonts.ready);
  await settle();
  await resourceTargets();
  assert(
    (await page.locator('.tdv-tabs--sheet [role="tab"]').count()) === 4,
    "Four operational folios",
  );
  assert(
    (await page.getByRole("tab", { name: "Cena", exact: true }).count()) === 0,
    "Scene tools relocated",
  );
  for (const [name, state] of [
    ["Feição", "face"],
    ["Ação", "action"],
    ["Expressão", "expression"],
    ["Transformação", "development"],
  ]) {
    await tab(name);
    await top();
    await geometry("instruments-" + state);
    if (name === "Expressão") {
      await page.getByRole("button", { name: /^Fragmentos/ }).click();
      await geometry("instruments-fragments");
      await page.getByRole("button", { name: /^Tramas/ }).click();
    }
    if (name === "Feição" && [320, 1440].includes(width)) {
      await geometry("instruments-links");
      const links = await page.locator(".tdv-link-summary").evaluateAll((es) =>
        es.map((e) => ({
          display: getComputedStyle(e).display,
          name: e.querySelector("strong").getBoundingClientRect().bottom,
          nature: e.querySelector("small").getBoundingClientRect().top,
          exchange: [...e.querySelectorAll(".tdv-link-exchange > span")].map((s) => ({
            label: s.querySelector("b").getBoundingClientRect().bottom,
            value: s.querySelector("span").getBoundingClientRect().top,
          })),
        })),
      );
      assert(
        links.every(
          (e) =>
            e.display === "grid" &&
            e.nature >= e.name - 1 &&
            e.exchange.every((s) => s.value >= s.label - 1),
        ),
        "Link identity and reciprocity have separate reading lines: " + JSON.stringify(links),
      );
    }
  }
  for (const name of ["Feição", "Transformação"]) {
    await tab(name);
    await settle();
    const host = page.locator(".tdv-tabs--sheet"),
      plate = host.locator(".tadeon-selection-plate");
    const [h, p] = await Promise.all([host.boundingBox(), plate.boundingBox()]);
    assert(
      h &&
        p &&
        p.x >= h.x - 1 &&
        p.y >= h.y - 1 &&
        p.x + p.width <= h.x + h.width + 1 &&
        p.y + p.height <= h.y + h.height + 1,
      "Selection stays inside folio rail",
    );
    const r = await host.evaluate((e) => ({
      outer: parseFloat(getComputedStyle(e).borderTopLeftRadius),
      padding: parseFloat(getComputedStyle(e).paddingTop),
      inner: parseFloat(
        getComputedStyle(e.querySelector(".tadeon-selection-plate")).borderTopLeftRadius,
      ),
    }));
    assert(
      r.inner >= Math.max(0, r.outer - r.padding - 2),
      "Rounded selection follows rail contour: " + JSON.stringify(r),
    );
  }
  await tab("Ação");
  if (width === 1440) {
    const labels = await page.locator(".tdv-tabs--sheet > button > span").evaluateAll((es) =>
      es.map((e) => ({
        text: e.textContent,
        width: e.clientWidth,
        scroll: e.scrollWidth,
        height: e.getBoundingClientRect().height,
        line: parseFloat(getComputedStyle(e).lineHeight),
      })),
    );
    assert(
      labels.every((e) => e.scroll <= e.width + 1 && e.height <= e.line * 1.2),
      "Desktop folio names remain whole: " + JSON.stringify(labels),
    );
  }
  assert(
    (await page.locator(".tdv-competency").count()) === 25,
    "Canonical capabilities preserved",
  );
  assert(
    (await page.locator('.tdv-alinhavos [aria-label="Familiaridade"]').count()) === 1,
    "Familiarity has its own symbol",
  );
  if ([320, 1440].includes(width)) {
    await page.getByRole("button", { name: "Proteção e cobertura", exact: true }).click();
    const protection = page.getByRole("dialog", { name: "Proteção e cobertura", exact: true });
    await fit(protection);
    await geometry("instruments-protection");
    await close(protection);
  }
  await page.getByRole("button", { name: /Consultar Nexo ·/ }).click();
  let popup = page.getByRole("dialog", { name: "Capacidade Nexo", exact: true });
  await fit(popup);
  if (role === "espectador")
    assert(
      await popup.getByRole("button", { name: "Efeito temporário", exact: true }).isDisabled(),
      "Readonly temporary declarations",
    );
  await geometry("instruments-capability");
  await close(popup);
  await page.getByRole("button", { name: /PV:.*Ajustar PV/ }).click();
  popup = page.getByRole("dialog", { name: "Reserva PV", exact: true });
  await fit(popup);
  await geometry("instruments-resource");
  if (role === "mestre" && [320, 1440].includes(width)) {
    const old = getRow().tdv2_data.resources.pv;
    await popup.getByLabel("Modificador de PV", { exact: true }).fill("4");
    await popup.getByRole("button", { name: "Aplicar PV", exact: true }).click();
    await saved(() => getRow().tdv2_data.resourceModifiers?.pv === 4);
    assert(getRow().tdv2_data.resources.pv === old, "Capacity modifiers do not heal");
    await page.getByRole("button", { name: /PV:.*Ajustar PV/ }).click();
    popup = page.getByRole("dialog", { name: "Reserva PV", exact: true });
    await popup.getByLabel("Modificador de PV", { exact: true }).fill("0");
    await popup.getByRole("button", { name: "Aplicar PV", exact: true }).click();
    await saved(() => getRow().tdv2_data.resourceModifiers.pv === 0);
    await page.getByRole("button", { name: /Consultar Nexo ·/ }).click();
    popup = page.getByRole("dialog", { name: "Capacidade Nexo", exact: true });
    await popup.getByRole("button", { name: "Efeito temporário", exact: true }).click();
    await fit(popup);
    await geometry("instruments-effect-editor");
    await popup.getByRole("button", { name: "Aplicar efeito", exact: true }).click();
    await saved(() =>
      getRow().tdv2_data.temporaryEffects?.some(
        (e) => e.target === "Nexo" && e.kind === "Proveito",
      ),
    );
    assert(
      (await page.getByLabel("Efeitos temporários de Nexo", { exact: true }).count()) === 1,
      "Effect beside die",
    );
    await page.getByRole("button", { name: /Consultar Nexo ·/ }).click();
    popup = page.getByRole("dialog", { name: "Capacidade Nexo", exact: true });
    await popup.getByRole("button", { name: "Remover Proveito de Nexo", exact: true }).click();
    await saved(() => getRow().tdv2_data.temporaryEffects.length === 0);
  } else {
    if (role === "espectador")
      assert(
        await popup.getByRole("button", { name: "Aplicar PV", exact: true }).isDisabled(),
        "Readonly resource modifiers",
      );
    await close(popup);
  }
  await page.getByRole("button", { name: /Consultar Equilíbrio/ }).click();
  popup = page.getByRole("dialog", { name: "Domínios do Equilíbrio", exact: true });
  await fit(popup);
  await geometry("instruments-equilibrium");
  await close(popup);
  await page.getByRole("button", { name: "Modo de jogo", exact: true }).click();
  assert((await page.locator(".tdv-game-panel").count()) === 1, "Game cockpit mounted");
  await settle();
  await resourceTargets();
  assert(
    (await page.locator(".tdv-game-skills .tdv-competency").count()) === 8,
    "Trained skills prioritized",
  );
  const search = page.getByRole("searchbox", { name: "Buscar Alinhavo no modo de jogo" });
  assert((await search.boundingBox()).height >= 44, "Game search retains touch target size");
  await search.fill("canalizacao");
  assert(
    (await page.locator(".tdv-game-skills .tdv-competency").count()) === 1,
    "Search includes untrained skills without accents",
  );
  if ([320, 1440].includes(width)) await geometry("game-capability-search");
  await search.fill("zzzz");
  assert(
    (await page.locator(".tdv-game-skills .tdv-competency").count()) === 0,
    "Empty search has no stale skills",
  );
  await search.fill("");
  assert(
    (await page.locator(".tdv-game-skills .tdv-competency").count()) === 8,
    "Clearing restores trained skills",
  );
  const cramped = await page
    .locator(".tdv-game-skills h3")
    .evaluateAll((es) =>
      es
        .filter(
          (e) => e.getBoundingClientRect().height > parseFloat(getComputedStyle(e).fontSize) * 3.8,
        )
        .map((e) => e.textContent),
    );
  assert(!cramped.length, "Readable capability names: " + JSON.stringify(cramped));
  await top();
  await geometry("instruments-game");
  await page.getByRole("button", { name: "Equipamento", exact: true }).click();
  popup = page.getByRole("dialog", { name: "Instrumentos da personagem", exact: true });
  await fit(popup);
  await geometry("instruments-tools");
  await close(popup);
  const old = getRow().tdv2_data;
  resetCharacter({ ...old, resources: { pv: 0, pi: 0, pe: 0 }, critical: "Ativa", conditions: [] });
  await page.reload();
  await page.getByRole("button", { name: "Morrendo: 1 de 3", exact: true }).waitFor();
  assert(
    (await page.getByRole("button", { name: /^Morrendo: [123] de 3$/ }).count()) === 3,
    "Three physical risk markers",
  );
  assert(
    (await page.getByRole("button", { name: /^Colapsando: [123] de 3$/ }).count()) === 3,
    "Three identity risk markers",
  );
  assert(
    (await page.getByRole("button", { name: /^Incapacitada/ }).count()) === 1,
    "Automatic incapacitation",
  );
  assert(
    (await page.locator(".tdv-condition-chip").filter({ hasText: "Colapsando" }).count()) === 1,
    "Automatic collapse",
  );
  assert(
    (await page.locator(".tdv-condition-chip").filter({ hasText: "Sucumbindo" }).count()) === 1,
    "Effort state without a general penalty",
  );
  await top();
  await geometry("instruments-zero");
  if (role === "mestre" && [320, 1440].includes(width)) {
    assert(
      await page.getByRole("button", { name: "Morrendo: 1 de 3", exact: true }).isDisabled(),
      "Zero PV alone is not a life threat",
    );
    for (const value of [1, 2, 3]) {
      await page.getByRole("button", { name: `Colapsando: ${value} de 3`, exact: true }).click();
      await saved(() => getRow().tdv2_data.crisisMarks?.collapse === value);
    }
    await geometry("instruments-risk-three");
    assert(getRow().tdv2_data.critical !== "Morta", "Risk marks never declare death automatically");
  }
  if (role === "espectador") {
    assert(
      await page.getByRole("button", { name: "Morrendo: 1 de 3", exact: true }).isDisabled(),
      "Readonly crisis marks",
    );
    assert(writes.length === 0, "Readonly never writes");
  }
  await context.close();
}
