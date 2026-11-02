/** One focused pass: layout + the changed operations, with isolated rows supplied by verify-tdv2. */
export async function verifyInteractive({
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
  makeCharacter,
}) {
  const tab = (name) => page.getByRole("tab", { name, exact: true }).click();
  const top = () =>
    page.evaluate(() => {
      scrollTo(0, 0);
      const main = document.getElementById("tadeon-main");
      if (main) main.scrollTop = 0;
    });
  const fit = async (popup) => {
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every(
          (a) =>
            a.playState !== "running" || !Number.isFinite(a.effect?.getComputedTiming().endTime),
        ),
    );
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );
    const b = await popup.boundingBox();
    assert(
      b && b.x >= -1 && b.y >= -1 && b.x + b.width <= width + 1 && b.y + b.height <= height + 1,
      "Popup within viewport: " + JSON.stringify(b),
    );
  };
  const close = async (popup) => {
    await page.keyboard.press("Escape");
    await popup.waitFor({ state: "detached" });
  };
  // Measure resting hit regions, not the transient scale of route arrival.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.playState !== "running" ||
          !Number.isFinite(animation.effect?.getComputedTiming().endTime),
      ),
  );
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  assert(
    (await page.locator(".tadeon-tdv2-sheet").getAttribute("data-presentation")) === "edit",
    "Expanded default",
  );
  assert((await page.locator(".tdv-character-name").count()) === 1, "Single character identity");
  assert((await page.locator(".tdv-test-panel").count()) === 0, "No central rolling motor mounted");
  assert((await page.locator(".tdv-competency").count()) === 25, "All 25 canonical capabilities");
  const targets = await page
    .locator(
      ".tdv-resource-step,.tdv-resource-value,.tdv-competency__die,.tdv-domain-tension button",
    )
    .evaluateAll((es) =>
      es.map((e) => {
        const b = e.getBoundingClientRect();
        return [b.width, b.height];
      }),
    );
  assert(
    targets.every(([w, h]) => w >= 43.9 && h >= 43.9),
    "44px controls: " + JSON.stringify(targets),
  );
  for (const [label, state] of [
    ["Constituição", "capacities"],
    ["Pessoa", "person"],
    ["Ação", "scene"],
    ["Expressão", "repertoire"],
    ["Percurso", "development"],
  ]) {
    await tab(label);
    await top();
    await geometry("interactive-" + state);
  }
  await tab("Constituição");
  const capability = page.getByRole("button", { name: /Consultar Nexo ·/ });
  await capability.click();
  let popup = page.getByRole("dialog", { name: "Capacidade Nexo", exact: true });
  await fit(popup);
  await geometry("interactive-capability");
  assert(
    (await popup.getByRole("button", { name: "Dados opcionais", exact: true }).isDisabled()) ===
      (role === "espectador"),
    "Readonly capability boundary",
  );
  await close(popup);
  assert(await capability.evaluate((e) => e === document.activeElement), "Return focus");
  await page.getByRole("searchbox", { name: "Buscar Alinhavo", exact: true }).fill("investigacao");
  assert(
    (await page.locator(".tdv-alinhavos .tdv-competency").count()) === 1,
    "Accent-folded search",
  );
  await page.getByRole("button", { name: "Limpar busca", exact: true }).click();
  if (role === "mestre") {
    await tab("Pessoa");
    const before = writes.length;
    await page.getByRole("button", { name: "Editar Origem", exact: true }).click();
    let inline = page.getByRole("textbox", { name: "Origem", exact: true });
    await inline.fill("Rascunho cancelado");
    await inline.press("Escape");
    assert(writes.length === before, "Escape cancels inline text");
    await page.getByRole("button", { name: "Editar Origem", exact: true }).click();
    inline = page.getByRole("textbox", { name: "Origem", exact: true });
    await inline.fill("O cais restaurado");
    await inline.press("Control+Enter");
    await saved(() => getRow().tdv2_data.face.origin === "O cais restaurado");
    assert(
      await page.getByRole("button", { name: "Editar Origem", exact: true }).isVisible(),
      "Inline returns to reading",
    );
    await tab("Percurso");
    await page.getByRole("button", { name: "Conceder Marco · +5% e 2 PU", exact: true }).click();
    await saved(() => getRow().tdv2_data.milestones.length === 1);
    await tab("Constituição");
    await page.getByRole("button", { name: /^Consultar Luta ·/ }).click();
    popup = page.getByRole("dialog", { name: "Capacidade Luta", exact: true });
    assert(
      (await popup.getByText("2 PU · saldo 2 PU", { exact: true }).count()) === 1,
      "Actual advancement price and balance",
    );
    await popup.getByRole("button", { name: "Avançar Luta", exact: true }).click();
    await saved(() => getRow().tdv2_data.investments.length === 1);
    await page.getByRole("button", { name: /^Consultar Luta ·/ }).click();
    await page
      .getByRole("dialog", { name: "Capacidade Luta", exact: true })
      .getByRole("button", { name: "Reverter Luta", exact: true })
      .click();
    await saved(() => getRow().tdv2_data.investments.length === 0);
    await tab("Percurso");
    await page.getByRole("button", { name: "Correções e permissões", exact: true }).click();
    popup = page.getByRole("dialog", { name: "Correções e permissões", exact: true });
    await fit(popup);
    await geometry("interactive-master-controls");
    await popup.getByRole("button", { name: "Reverter último Marco", exact: true }).click();
    await saved(() => getRow().tdv2_data.milestones.length === 0);
    assert(getRow().tdv2_data.corrections.length === 2, "Marco correction archived");
    await close(popup);
    await tab("Expressão");
    assert(
      await page.getByRole("heading", { name: "Lavores", exact: true }).isVisible(),
      "Lavores have their own home",
    );
    assert(
      await page.getByRole("heading", { name: "Tramas e Fragmentos", exact: true }).isVisible(),
      "Tramas/Fragmentos have their own home",
    );
    for (const [action, title, name] of [
      ["Adicionar arma", "Nova arma", "Lâmina de teste"],
      ["Adicionar item", "Novo item", "Corda de teste"],
    ]) {
      await page.getByRole("button", { name: action, exact: true }).click();
      popup = page.getByRole("dialog", { name: title, exact: true });
      await fit(popup);
      await geometry(action === "Adicionar arma" ? "interactive-weapon" : "interactive-inventory");
      await popup.getByRole("textbox", { name: "Nome", exact: true }).fill(name);
      await popup.getByRole("button", { name: "Adicionar", exact: true }).click();
      await saved(() => getRow().tdv2_data.records.some((record) => record.name === name));
    }
    for (const kind of ["Trama", "Fragmento"]) {
      if (kind === "Fragmento") await page.getByRole("button", { name: /^Fragmentos/ }).click();
      await page.getByRole("button", { name: "Adicionar " + kind, exact: true }).click();
      popup = page.getByRole("dialog", { name: "Adicionar " + kind, exact: true });
      await fit(popup);
      await popup.getByRole("textbox", { name: "Nome", exact: true }).fill("Expressão " + kind);
      await geometry("interactive-add-" + kind.toLowerCase());
      await popup.getByRole("button", { name: "Adicionar", exact: true }).click();
      await saved(() => getRow().tdv2_data.records.some((r) => r.name === "Expressão " + kind));
    }
    await tab("Ação");
    await page.getByRole("button", { name: "Proteção e cobertura", exact: true }).click();
    popup = page.getByRole("dialog", { name: "Proteção e cobertura", exact: true });
    await fit(popup);
    await geometry("interactive-protection");
    await close(popup);
    await tab("Constituição");
    await page.getByRole("button", { name: "Retirar 1 PV", exact: true }).click();
    await saved(() => getRow().tdv2_data.resources.pv === 9);
    for (let i = 0; i < 4; i++)
      await page.getByRole("button", { name: "Tensão +1", exact: true }).click();
    await saved(() => getRow().tdv2_data.equilibrium === 1 && getRow().tdv2_data.tension === 0);
    const previous = writes.length;
    await page.getByRole("button", { name: "Condição", exact: true }).click();
    popup = page.getByRole("dialog", { name: "Condição 1", exact: true });
    await fit(popup);
    await popup.getByLabel("Nome da condição 1", { exact: true }).fill("Rascunho");
    popup = page.getByRole("dialog", { name: "Condição Rascunho", exact: true });
    await popup.getByRole("button", { name: "Cancelar", exact: true }).click();
    await popup.waitFor({ state: "detached" });
    assert(writes.length === previous, "Cancelling draft does not persist");
    assert(
      await page
        .getByRole("button", { name: "Condição", exact: true })
        .evaluate((e) => e === document.activeElement),
      "Draft cancellation returns focus",
    );
    await page.getByRole("button", { name: "Condição", exact: true }).click();
    popup = page.locator(".tdv-condition-popup");
    await popup.getByLabel("Nome da condição 1", { exact: true }).fill("Sobressalto");
    await popup.getByLabel("Efeito da condição 1", { exact: true }).fill("Concentração instável");
    await popup.getByLabel("Saída da condição 1", { exact: true }).fill("Recuperar a calma");
    await popup.getByLabel("Aplicação na ficha", { exact: true }).selectOption("Desproveito");
    assert(getRow().tdv2_data.conditions.length === 0, "No effect before target/confirmation");
    await popup.getByLabel("Capacidade afetada", { exact: true }).selectOption("Nexo");
    await popup.getByRole("button", { name: "Adicionar condição", exact: true }).click();
    await saved(() =>
      getRow().tdv2_data.conditions[0]?.effect.startsWith("Fio declarado · Desproveito · Nexo"),
    );
    assert(
      (await page.locator('[data-capability="Nexo"]').getAttribute("data-affected")) === "true",
      "Condition affects capability",
    );
    await page.getByRole("button", { name: /Sobressalto/ }).click();
    popup = page.getByRole("dialog", { name: "Condição Sobressalto", exact: true });
    await fit(popup);
    await geometry("interactive-condition");
    await popup.getByRole("button", { name: "Saída cumprida", exact: true }).click();
    await saved(() => getRow().tdv2_data.conditions.length === 0);
  } else {
    assert(
      await page.getByRole("button", { name: "Retirar 1 PV", exact: true }).isDisabled(),
      "Readonly resources disabled",
    );
    assert(
      await page.getByRole("button", { name: "Condição", exact: true }).isDisabled(),
      "Readonly condition changes disabled",
    );
  }
  await page.getByRole("button", { name: "Modo de jogo", exact: true }).click();
  assert(
    (await page.getByRole("region", { name: "Painel de jogo", exact: true }).count()) === 1,
    "Dedicated cockpit mounted",
  );
  assert(
    (await page.locator(".tdv-sheet-tabs").count()) === 0,
    "No integral card stack in cockpit",
  );
  assert(
    (await page.locator(".tdv-game-skills .tdv-competency").count()) === 6,
    "Trained skills prioritized",
  );
  await page.getByRole("button", { name: "Todos os Alinhavos", exact: true }).click();
  assert(
    (await page.locator(".tdv-game-skills .tdv-competency").count()) === 21,
    "All skills available",
  );
  await geometry("interactive-digital-cockpit");
  await page.getByRole("button", { name: "Equipamento", exact: true }).click();
  popup = page.getByRole("dialog", { name: "Instrumentos da personagem", exact: true });
  await fit(popup);
  await geometry("interactive-cockpit-tools");
  await close(popup);
  await page.getByRole("button", { name: "Híbrido", exact: true }).click();
  await top();
  await geometry("interactive-hybrid");
  if (role === "mestre") {
    await page.getByRole("button", { name: /^Ler os vestígios do cais/, exact: true }).click();
    popup = page.getByRole("dialog", { name: "Ler os vestígios do cais", exact: true });
    await fit(popup);
    await geometry("interactive-expression");
    await popup.getByRole("button", { name: "Costurar com outra prática", exact: true }).click();
    assert(
      await popup
        .getByRole("checkbox", { name: "Lavor: Ler os vestígios do cais", exact: true })
        .isChecked(),
      "Actual work preselected",
    );
    await close(popup);
  }
  await page.getByRole("button", { name: "Apoio físico", exact: true }).click();
  await top();
  await geometry("interactive-physical");
  await page.reload();
  await page.getByRole("button", { name: "Ficha integral", exact: true }).waitFor();
  assert(
    (await page
      .getByRole("button", { name: "Apoio físico", exact: true })
      .getAttribute("aria-pressed")) === "true",
    "Scoped profile memory",
  );
  assert((await page.locator(".tdv-game-panel").count()) === 1, "Profile restored to cockpit");
  if (role === "mestre" && [320, 1440].includes(width)) {
    const fresh = makeCharacter();
    fresh.face = getRow().tdv2_data.face;
    fresh.creation = { groupReason: "Proteger o cais", familiarities: [], reviewed: true };
    resetCharacter(fresh);
    await page.goto(page.url().split("?")[0] + "?mode=edit");
    await page.getByRole("button", { name: "Ficha integral", exact: true }).click();
    await page.getByRole("button", { name: "Concluir criação TdV II", exact: true }).waitFor();
    await tab("Constituição");
    assert(
      (await page.locator('.tdv-matrices [data-grade="1"]').count()) === 4,
      "Creation starts four d6 matrices",
    );
    const pick = async (name, grade, matrix) => {
      while (
        (matrix ? getRow().tdv2_data.matrices[name] : (getRow().tdv2_data.alinhavos[name] ?? 0)) <
        grade
      ) {
        const previous = matrix
          ? getRow().tdv2_data.matrices[name]
          : (getRow().tdv2_data.alinhavos[name] ?? 0);
        await page.getByRole("button", { name: new RegExp("^Distribuir " + name + " ·") }).click();
        await page
          .getByRole("dialog", { name: "Capacidade " + name, exact: true })
          .getByRole("button", { name: "Avançar " + name, exact: true })
          .click();
        await saved(
          () =>
            (matrix
              ? getRow().tdv2_data.matrices[name]
              : (getRow().tdv2_data.alinhavos[name] ?? 0)) ===
            previous + 1,
        );
      }
    };
    await pick("Ímpeto", 3, true);
    await pick("Cadência", 3, true);
    await pick("Nexo", 2, true);
    await pick("Lastro", 2, true);
    for (const [name, grade] of [
      ["Engenharia", 2],
      ["Investigação", 2],
      ["Atletismo", 1],
      ["Percepção", 1],
      ["Sociedade", 1],
      ["Iniciativa", 1],
    ])
      await pick(name, grade, false);
    await page.getByRole("button", { name: /^Familiaridades ·/ }).click();
    popup = page.getByRole("dialog", { name: /^Familiaridades ·/ });
    await fit(popup);
    await geometry("interactive-familiarities");
    await popup.getByRole("button", { name: /Luta/ }).click();
    await close(popup);
    await page.getByRole("button", { name: "Concluir criação TdV II", exact: true }).click();
    await saved(() => getRow().tdv2_data.ready);
    assert(
      (await page.getByRole("button", { name: /^Distribuir Nexo ·/ }).count()) === 0,
      "Completed creation locks distribution",
    );
  }
  if (role === "espectador") assert(writes.length === 0, "Readonly no writes");
  await context.close();
}
