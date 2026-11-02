# DEC-030 — retomada após indisponibilidade do ambiente

Este arquivo é um checkpoint de continuidade, **não uma cópia do código local nem prova de publicação**. A conexão do ambiente caiu antes de enviar as alterações. O erro retornado foi: `environment_offline: Environment is not connected` (409 ao consultar exec-server). Não houve integração nem publicação desta rodada.

## Estado remoto confirmado em 02/11/2026

- Repositório: Gabriel2069/tadeon-nexus.
- Main/publicação anterior: `172eafa8d17dc98b026607f4c20e10cd9e48d44b`.
- PR 321: **rascunho**, para impedir que a composição anterior rejeitada seja integrada por engano.
- Head ainda existente da PR: `e90a4420fe1ee5577d4dc13155c5c69d079af83b`.
- Esta branch de checkpoint parte desse head e acrescenta apenas este registro.
- **O código novo ainda não foi enviado ao GitHub.** Não afirmar que a branch da PR contém a recomposição abaixo.

## Primeiro passo ao restabelecer o ambiente

Abrir `/workspace/scratch/f0442579afe5/tadeon`, conferir `git status`, branch e diff **antes de checkout, reset, pull ou limpeza**. A branch local era `feat/nex-046-playbook-recompose`, HEAD e90a442, com as mudanças na árvore de trabalho. Preservar o arquivo preexistente não rastreado `docs/v4/.Tadeon_Nexus_Especificacao_Final_V4.md.UZYZdu`.

A indisponibilidade impede confirmar se a árvore de trabalho continua recuperável. Não presumir que foi salva remotamente nem que foi perdida. Se os arquivos persistirem, continuar daí. Não misturar o antigo código e90 com a nova composição por merge cego.

## Direção atual do usuário — supera DEC-028/029

A ficha deve ser uma prancheta de personagem, prática, visual e interativa. **Expandido é o padrão**; jogo oferece perfis digital, híbrido e apoio físico. Prioridade por frequência: recursos fortes e diretos; vínculos compactos; Matrizes/Alinhavos bem proporcionados; desenvolvimento operacional; condições com efeitos concretos, sem penalidade automática por intensidade. Referência funcional: foto da ficha de Ordem enviada, especialmente densidade e menu lateral. Não copiar a marca, impor um rosto fictício ou restaurar cubos/formulário.

Equilíbrio e Tensão: vermelho/Medo a amarelo/Conhecimento. Dados opcionais saem do centro. Preservar todos os dados, ferramentas, permissões, CAS e edição histórica. Sem migration/backup adicional nesta rodada (DEC-024). Não declarar V4 completa, concessões iniciais gratuitas de Lavor ou conciliação física/offline por autoridade de servidor.

## Implementação que existia localmente

- Cabeçalho com um único nome editável, ferramentas secundárias em menu e estado de salvamento. `SheetExperienceBridge compact` reutiliza os mesmos controles de histórico, popout, presença e Nexus.
- `Section variant="folio"` remove moldura, emblemas e tecido redundante somente da ficha atual, mantendo recolhimento e estado.
- `TdvPlayPresence` comum aos modos: três recursos com arco proporcional, valor atual/máximo, +/− direto e ajuste maior no valor. Estados críticos dão acesso a Em cena. Equilíbrio em gradiente vermelho/amarelo, popup de ajuste e Tensão direta.
- Navegação contextual lateral por largura útil >=700px, horizontal abaixo disso, com SelectionPlate. Ficha pronta abre capacidades; criação abre Pessoa.
- Matrizes e Alinhavos sem cubos, nome e dado juntos; capacidades abrem consulta, desenvolvimento e dados opcionais. Busca ignora acentos. Jogo prioriza os seis Alinhavos praticados do exemplo e permite consultar todos os 21.
- Vínculos em contatos compactos; editor e mobilização permanecem. Retrato abstrato e mapa duplicado saem; Âncora mantém escolhas nativas e operações existentes.
- Repertório com ação Usar na própria prática, popup com prática selecionada, Costura sob demanda, escrita em linhas e saldo após custos. Expressões em curso são acessíveis junto do repertório, encerradas em dobra. Usar com sucesso fecha a operação e retorna à ficha.
- Desenvolvimento: barra reta de 20 passos, PU, quatro ações; capacidade pode abrir o mesmo investimento. Mesma validação/custo, incorporação obrigatória; reconhecimento transcendente só no avanço de Matriz de categoria IV.
- Perfis digital/híbrido/apoio físico guardados em sessão por pessoa/ficha; reabertura restaura perfil e destino. Valores físicos não são presumidos sincronizados.
- Condições na faixa de estados, popup de efeito/saída/ajuste; adicionar usa rascunho local, sem gravação de condição vazia ao cancelar.

### Condições — contrato mecânico novo

No `tdv2.ts`, foram acrescentados `conditionImpact`, `declareConditionImpact`, `capabilityConditions` e integração no `prepareTest` existente. O campo `effect` conserva prosa e usa declaração explícita na primeira linha:

```text
Fio declarado · Desproveito · Nexo
Descrição original preservada
```

Também aceita Impedimento. Só esse formato e nomes de MATRICES/ALINHAVOS canônicos são reconhecidos; nenhuma inferência de gravidade ou prosa. Selecionar o tipo sem escolher a capacidade não grava um efeito na primeira opção.

Cada Desproveito soma uma fonte negativa no Fio correspondente, cancela uma fonte positiva por vez e participa do limite líquido de uma categoria; Matriz Abalada soma no mesmo cálculo, Forçar vem depois. O Desproveito da prática da personagem não se transfere ao Tento próprio de auxiliar. Um impedimento declarado à capacidade não é contornado informando auxílio. Base, investimentos e recursos não são mutados. A saída remove estado/efeito; retirar a declaração recupera a prosa. Sem campo JSON novo ou migração.

## Arquivos alterados localmente

- `src/routes/sheet.$id.tsx`
- `src/components/sheet/sheet-ui.tsx`, `sheet-experience-bridge.tsx`
- `tdv2-sheet.tsx`, `tdv2-competencies.tsx`, `tdv2-fields.tsx`, `tdv2-play-presence.tsx`, `tdv2-procedures.tsx`, `tdv2-creation-loom.tsx`, `tdv2-test-panel.tsx` e teste correspondente.
- Novos `src/components/sheet/tdv2-conditions.tsx`, `tdv2-conditions.test.tsx` e `src/lib/tdv2-conditions.test.ts`.
- `src/lib/tdv2.ts`.
- Proprietários CSS: `src/styles.css`, `button.css`, `hero-backgrounds.css`, `page-hero-parity.css`, `sheet-premium.css`, `workspace.css`.
- `scripts/verify-tdv2.mjs` e novo `scripts/verify-playbook-states.mjs`.
- `docs/project-continuity.json` (DEC-030), mapas sincronizados e manifesto regenerado.
- Novos relatórios locais `docs/v4/FICHA_PRANCHETA_INTERATIVA.md` e `playbook-sheet-validation.json`. O JSON ainda indicava verificação em andamento; não marcá-lo como concluído sem resultados.

## Evidências efetivamente obtidas antes da queda

- `npm run check` passou: **170 suítes / 717 testes**, lint sem erros (dois avisos preexistentes de Fast Refresh), typecheck e build.
- Estilos: **57 módulos / 12 links**, sem aumento dos tetos de overrides ou novos !important.
- `npm audit --audit-level=high`: zero alto/crítico, 15 moderados.
- **42 verificações PostgreSQL/PGlite** isoladas passaram; legado inalterado.
- Fluxos preliminares 390/1440 passaram para jogo, recursos, investimento, leitura/condições, consulta histórica e edição histórica deliberada sem afetar TdV II.
- Uma rodada canônica preliminar de 50 estados passou em 390/1440; isso não substitui a rodada fria final.
- **A bateria final dos 15 tamanhos ainda não estava concluída.** Não reutilizar 377/387 estados de DEC-029 como prova deste código.

## Validação em andamento / pontos concretos a verificar

Raiz dos logs e capturas: `/workspace/scratch/f0442579afe5/validation`; logs recentes em `/tmp/playbook-*.log`.

- `playbook-certified-play` (porta 6220), `playbook-certified-reading` (6221), `playbook-certified-instruments` (6222): cenários dos 15 tamanhos, capturas e censo. Play e instrumentos ainda rodavam na última leitura; reading parou ao procurar o popup pelo nome antigo após editar o nome de um rascunho.
- O seletor dinâmico do novo rascunho foi corrigido no script: após preencher "Rascunho descartável", localizar o dialog "Condição Rascunho descartável", não "Condição 1". **Isso foi correção do teste, não evidência de defeito do componente.**
- Acrescentou-se verificação real de foco ao cancelar um rascunho. `playbook-draft-focus` (6223), log `/tmp/playbook-draft-focus.log`: resultado ainda desconhecido pela queda. Conferir antes de alterar o componente. Se falhar, devolver foco ao botão Adicionar, preservando o retorno normal ao chip em condições existentes; não inventar diagnóstico sem ler o resultado.
- `playbook-canonical-final` (6224), quatro tamanhos 320/390/820/1440: ainda sem conclusão observada. Verifica Mestre, proteção, Forçar, Resto, expressão/sustentação/Relaxamento, edição anterior, conversão e conflito CAS.
- A rodada curta `playbook-short-play` / `playbook-short-reading`, 360x780 e 568x320, passou após aguardar movimento e dois frames antes de medir o portal. As medidas imediatas anteriores capturavam posição transitória. Manter a exigência de encaixe; não afrouxar o limite do viewport.
- Em 320px, +/− dos recursos tinham <44px: corrigido por padding menor no proprietário e min-width44. Nome da Matriz passa à linha inteira nessa largura para evitar quebrar Cadência. A bateria posterior passou desse ponto.
- O popup de expressão sofria disputa da regra genérica `input:not(...)` em styles.css. O seletor agora exclui `.tadeon-dossier-field`; button.css mantém a escrita no seu proprietário. A suíte exige borda superior transparente e linha inferior visível. Passou nas vistas posteriores.
- O novo helper usa `getRow:()=>row` para ler a linha após o mock CAS, pois o mock reassina row; capturar o objeto antigo causava falso negativo de persistência.
- Salvar dentro de dialog usa o autosave existente, sem tentar clicar o botão de fundo bloqueado pelo modal.
- Não editar o frontend durante a bateria final; reiniciar uma rodada fria após defeitos reais.

Runtime nativo:
```sh
python ../run-audit.py verify-tdv2 NOME PORTA NEXUS_PLAY_VIEW_ONLY=1 NEXUS_AUDIT_VIEWPORTS=chapter50 NEXUS_SURFACE_CENSUS=1
```
Outras modalidades: NEXUS_SHEET_READING_ONLY=1, NEXUS_SHEET_INSTRUMENTS_ONLY=1, NEXUS_LAYOUT_ONLY=1. O script usa Playwright/Chromium já existentes em ../browser-runtime. PGlite foi instalado fora do projeto em /tmp/tadeon-postgres, versão 0.5.12. Nenhuma dependência do projeto foi alterada.

## Fechamento ainda necessário

1. Recuperar a árvore de trabalho; conferir logs finais, principalmente foco de rascunho, e reparar somente defeitos observados.
2. Completar as 15 dimensões, quatro larguras canônicas, layout, foco, somente leitura e movimento reduzido; inspecionar capturas finais.
3. Atualizar relatório/JSON com contagens reais, hashes, limites e imagens. Regenerar censo/mapas se o fonte mudar.
4. Commit/push do **código real recuperado** para a branch da PR 321, com lease/revisão atual reconfirmados. Reescrever título/corpo para a implementação final e tirar do rascunho somente quando estiver pronta para revisão.
5. Exigir Quality e os seis grupos do Visual review + agregador no HEAD exato; merge em main, Quality/deploy de main e HTTP200/SHA/pacote canônico.
6. Só então comunicar publicação. Não afirmar cobertura integral da V4, livro, hardware, contas reais ou FPS/INP.

