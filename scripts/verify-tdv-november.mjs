// Called by verify-tdv2 with NEXUS_AUDIT_SCOPE=november. REST is intercepted.
export async function verifyNovember({ page, role, geometry, assert, writes, getRow, saved }) {
  const button = name => page.getByRole("button", { name, exact: true });
  const tab = name => page.getByRole("tab", { name, exact: true }).click();
  const close = async () => { await page.keyboard.press("Escape"); await page.locator('[data-slot="dialog-content"]:visible').last().waitFor({state:"hidden"}); };
  await tab("Transformação");
  await button("Comparar com o Caderno de novembro").click();
  const comparison = page.getByRole("dialog", { name: "Comparar com o Caderno de novembro" });
  await comparison.getByRole("slider").focus();
  await page.keyboard.press("End");
  assert((await comparison.innerText()).includes("100 PU"), "Projection reaches Marco 20");
  assert(writes.length === 0, "Projection has no writes");
  await geometry("comparacao");
  await close();
  await tab("Expressão");
  await button("Consultar equipamentos").click();
  const arsenal = page.getByRole("dialog", { name: "Consultar equipamentos" });
  await arsenal.getByRole("searchbox").fill("binoculos");
  assert((await arsenal.getByRole("heading", {name:"Binóculos"}).count()) === 1, "Accent-insensitive catalog search");
  await geometry("arsenal");
  if (role === "jogador") {
    await button("Adicionar à ficha").click();
    await saved(() => getRow().tdv2_data.records.some(r => r.name === "Binóculos" && r.fields["Edição"] === "v0.9"));
  } else {
    if (role === "espectador") assert(await button("Adicionar à ficha").count() === 0, "Readonly catalog");
    await close();
  }
  await button("Modo de jogo").click();
  await page.locator(".tdv-test-entry").scrollIntoViewIfNeeded();
  await geometry("jogo");
  const prepare = button("Preparar teste");
  if (role === "espectador") {
    assert(await prepare.isDisabled() && writes.length === 0, "Spectator consults without committing a test");
    return;
  }
  await button("Híbrido").click();
  await prepare.click();
  const dialog = page.locator(".tdv-roll-dialog");
  assert(await dialog.getByRole("checkbox",{name:"Usar dados físicos"}).isChecked(), "Hybrid starts with physical faces");
  await dialog.getByLabel("Face física de Prumo").fill("5");
  await dialog.getByLabel("Face física de Tento").fill("3");
  await button("Conferir dados físicos").click();
  assert((await dialog.locator(".tdv-result").innerText()).includes("Enlace 8"), "Shared engine reads both physical faces");
  assert(await button("Conferir dados físicos").isDisabled(), "No duplicate physical confirmation");
  await dialog.locator(".tdv-result").scrollIntoViewIfNeeded();
  await geometry("enlace");
  await close();
  await button("Digital").click();
  await prepare.click();
  assert(!(await dialog.getByRole("checkbox",{name:"Usar dados físicos"}).isChecked()), "Digital generates its faces");
  await button("Rolar os dois Fios").click();
  await dialog.locator(".tdv-result").waitFor();
  await close();
  if (role === "mestre") {
    await page.goto(new URL("/master-panel?tab=balance",page.url()).href);
    const trace = page.getByRole("region", {name:"Traçado dos Encontros"});
    await trace.scrollIntoViewIfNeeded();
    assert((await trace.getByRole("status").innerText()).includes("7,76 rodadas"), "Reference rhythm");
    await geometry("tracado");
    await trace.getByLabel("Alvo ao alcance das intervenções").uncheck();
    assert((await trace.innerText()).includes("Sem acesso por dano direto"), "Inaccessible state");
  }
}

export async function verifyNovemberPlay({ page, role, assert, saved, getRow, geometry }) {
  await page.getByRole("tab", { name: "Transformação", exact: true }).click();
  assert((await page.locator(".tdv-development-instrument").innerText()).includes("10 PU na criação"), "Dated development");
  await page.getByRole("button", { name: "Modo de jogo", exact: true }).click();
  await page.getByRole("button", { name: "Híbrido", exact: true }).click();
  await page.getByRole("button", { name: "Preparar teste", exact: true }).click();
  const dialog = page.locator(".tdv-roll-dialog");
  await dialog.getByLabel("Registrar a próxima rolagem").check();
  await dialog.getByLabel("Intenção", { exact: true }).fill("Ler o selo");
  await dialog.getByLabel("Abordagem", { exact: true }).fill("Examinar a inscrição");
  await dialog.getByLabel("Existe risco ou oposição relevante").check();
  await dialog.getByText("Proveito, Desproveito e Forçar", { exact: true }).click();
  await dialog.getByLabel("Forçar um Fio").selectOption("Prumo");
  await dialog.getByLabel("DT ou Defesa", { exact: true }).fill("8");
  await dialog.getByLabel("Face física de Prumo").fill("5");
  await dialog.getByLabel("Face física de Tento").fill("3");
  await dialog.getByRole("button", { name: "Conferir dados físicos · 1 PE" }).click();
  await dialog.getByText(/Enlace 8 \/ DT 8/).waitFor();
  await geometry("enlace-novembro");
  await page.keyboard.press("Escape");
  await saved(() => getRow().tdv2_data.resources.pe === 9 && getRow().tdv2_data.scene.tests.length === 1);
  await page.reload();
  await page.locator(".tdv-character-name").waitFor();
  if (!(await page.locator(".tdv-game-panel").count())) await page.getByRole("button", { name: "Modo de jogo", exact: true }).click();
  await page.getByText(/Último registro · Nexo 5 · Investigação 3/).waitFor();
  if (role === "mestre") {
    await page.goto(new URL("/master-panel?edition=tdv2", page.url()).href);
    await page.getByText("Adicionar personagens TdV II", { exact: true }).click();
    await page.getByText("9 PE · Ler o selo", { exact: true }).scrollIntoViewIfNeeded();
    await geometry("leitura-mestre-novembro");
  }
}
