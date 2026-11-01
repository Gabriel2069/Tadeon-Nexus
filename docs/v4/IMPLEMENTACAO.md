# V4 — auditoria de implementação

A V4 é o mandato vigente. **DEC-024:** Tadeu autorizou adiar os requisitos pendentes de backup e prosseguir com mudanças visíveis e reversíveis. O primeiro lote recompõe a Ficha Integral como atlas; as evidências da fase 0 abaixo são o registro anterior, sem certificação integral. Não há mudança de regras, autorização ou banco. O [dossiê completo](Tadeon_Nexus_Especificacao_Final_V4.md) foi incorporado sem redução; o [registro de fontes](source-ledger.json) identifica as nove fontes lidas por hash. O Livro II coincide com a fonte normativa já registrada no projeto (`8846b485…`). A fila continua exclusivamente em `docs/project-continuity.json` (NEX-043 em diante).

## Base conferida

GitHub `main`: `b5555c53622ad15cefbea35a535f7a68af2217a8`, árvore `d9138838aaf0503c03f42b19997d712851ba9ba1`. A última publicação registrada é o [workflow 40854332205](https://github.com/Gabriel2069/tadeon-nexus/actions/runs/40854332205), aprovado nesse SHA. Uma consulta nova ao endpoint público retornou HTTP 200, porém com marcador `development`: **a identidade da implantação atual não foi reconfirmada**. O registro histórico não substitui essa prova.

O projeto Supabase `nkxpstyfrzufsnowjrdi` está `ACTIVE_HEALTHY`, com as migrações TdV II `20261027093709` e `20261027191353`. A inspeção remota foi somente leitura. Nenhum personagem foi convertido ou salvo nesta etapa.

[Resultados estruturados](phase-0-validation.json): baseline de 162 suítes/688 testes e build aprovados; 41 verificações SQL isoladas; auditoria completa com zero alto/crítico e 15 registros moderados, incluindo cadeias transitivas. Não foi aplicado `audit fix --force`.

## O que os inventários provam

`npm run check:surfaces` recusa um inventário de fonte desatualizado; `node scripts/audit-v4-surfaces.mjs --write` o atualiza para revisão explícita do diff. O commit-base e o Git conservam a comparação anterior. Esse gate não certifica execução nem substitui o manifesto operacional.

O [manifesto de fonte](surface-manifest.json) registra 18 rotas, 317 módulos, 31 bridges e 1.620 referências a callbacks/navegação. Cada módulo conserva hash, imports, referências JSX, ações, guardas encontradas e acessos a persistência; cada rota aponta para esses registros. O ID de arquivo do TanStack e a URL pública são distintos: `/sheet/$id_/power` corresponde a `/sheet/$id/power`.

Imports, JSX e campos `disabled` **não provam** montagem, execução de ação ou autorização no servidor. O grafo de imports é uma aproximação conservadora e inclui código condicional. Imports dinâmicos acompanham o alias usado em JSX. O bridge `tabletop-director-enhancement-bridge.tsx` não possui importador no código inspecionado; seu arquivo não pode ser contado como função disponível. Os demais não foram declarados descartáveis.

O [cruzamento operacional](route-contracts.json) liga cada rota a componentes, grupos de ações, permissões, dados persistentes, testes e evidência renderizada. A certificação individual de cada callback, campo, menu e audiência continua pendente; o manifesto não converte esses campos em “aprovado” por inferência.

A [baseline de navegador](runtime-baseline.json) registra 28 vistas de sete áreas e 99 estados/fluxos TdV II, em 320/390/820/1440 × 1000 px, com papéis sintéticos de mestre/espectador e verificações existentes de escrita/leitura, foco e movimento reduzido. Foram coletados 127 censos do DOM montado, com links e hashes das capturas. Os controles renderizados são evidência separada dos callbacks encontrados no código.

A coleta só aceita `localhost`/`127.0.0.1`, não exporta valores de campos e é opt-in por `NEXUS_SURFACE_CENSUS=1`. No CI, fica no mesmo artefato das screenshots (retenção de sete dias). Referências locais no JSON não são um arquivo permanente de imagens. A fixture básica do Nexus cobre ausência de workspace; não certifica corpus povoado. A matriz completa dos capítulos 50/60 ainda não foi executada.

## Backup e restauração

Foi obtido o [backup independente 41298570432](https://github.com/Gabriel2069/tadeon-nexus/actions/runs/41298570432), criado em 01/11/2026, artefato `13079628573`. O digest do ZIP e o SHA-256 interno do dump foram conferidos. Dump: `f89e46719bdbe172175dba6fa347776e459861e68c91e59a9911e69e08e6864f`. Dados e imagens de banco ficam fora do repositório e dos logs públicos.

Ensaio real em PostgreSQL isolado (PGlite): as **52 tabelas públicas da aplicação, 3.665 registros**, definições e checks inline foram carregados do dump; a imagem binária foi exportada e reaberta; os hashes de conteúdo de todas as tabelas coincidiram. O script reproduzível é `scripts/verify-v4-application-restore.mjs`. Ele não se conecta a um servidor e não imprime linhas, credenciais ou hashes individuais de tabelas.

Isso **não é uma restauração completa de Supabase**: serviços Auth/Realtime/Storage, roles/policies/triggers/RPCs operacionais e bytes de objetos não estão certificados. O projeto possui **12 objetos em um bucket privado**, cinco registros de assets Supabase e zero registros de assets R2. O dump conserva metadados, não os bytes desses objetos. O conector disponível não oferece download autenticado desses arquivos; não foram abertas políticas nem criadas URLs públicas para contornar isso. A restauração completa e a cópia desses objetos permanecem bloqueios explícitos para migrações em produção.

Reprodução local, com PostgreSQL `pg_restore` compatível e PGlite instalado fora da aplicação:

```sh
NEXUS_PGLITE_MODULE=file:///caminho/pglite/dist/index.js \
NEXUS_PG_RESTORE=/caminho/pg_restore \
node scripts/verify-v4-application-restore.mjs /copia-privada/tadeon-nexus.dump
```

O comando devolve apenas um resumo. Uma falha não aprova migração. A validação SQL existente cobre um esquema de teste com guardas e papéis, não transforma este ensaio de dados em prova de autorização real.

## Diferenças e destino exigido

| Atual | Tratamento | Destino V4 / evidência necessária |
| --- | --- | --- |
| Ficha Integral com cinco abas, narrativa, inventário e vínculos | Preservar / recompor | Cinco fólios, mesmos IDs/payloads, microcomposições e testes por campo; conservar consulta anterior e conflitos |
| Nenhuma rota `/sheet/$id/play` | Ampliar / integrar | Visão de Partida com os mesmos dados/motor, independente de `power_form_enabled` |
| Forma de Poder histórica em `/sheet/$id/power`, título ainda usa VP | Preservar / corrigir | Identificação inequívoca como legado; conservar URL, flag e `power_form_data`; não reutilizar seu motor na nova VP |
| Leitura da Forma de Poder pode executar sincronização e UPDATE | Corrigir | Abrir não escreve; revisão/aceitação explícita e identidade/CAS no escritor; teste contra gravação ao carregar |
| “Encerrar cena” zera `scene.tests` e `paidEvents` diretamente | Corrigir / integrar | Arquivar acontecimentos relevantes antes da limpeza; evento versionado/idempotente com audiência; nunca apagar o Resto por reset |
| Recursos da ficha e orçamento de rodada têm escritores distintos | Integrar | Autoridade transacional única, revisão esperada, aprovação e retry sem dupla cobrança; propostas separadas de fatos confirmados |
| Dois Fios digitais já operacionais; registro físico não tem percurso próprio | Ampliar | Conferir faces contra dados finais, preservar rolagem, mesma leitura e custos; sem nova rolagem no retry |
| Ausência de modos físico/híbrido/digital e conciliação explícita | Ampliar | Preferência de apresentação e conferência humana por revisão, sem sincronização fictícia |
| Mestre tem 16 guias gerais e condução TdV II incorporada | Preservar / recompor | Preparação/condução sobre o mesmo estado; todas as ferramentas continuam alcançáveis |
| Mesa tem motor, ferramentas, bridges lazy, roda, 3D e estado privado de vista | Preservar / refinar | Palco e chrome com proprietários atuais; provar cada montagem e comando; não apagar ferramentas para inserir o novo fluxo |
| Nexus possui árvore/grafo/documento, rascunhos e portabilidade | Preservar / integrar | Explorar/ler/relacionar; natureza do conhecimento separada de audiência; Resto publicado por consentimento, com filtragem no servidor |
| Texto de domínio usa limite compartilhado de 12.000 caracteres | Corrigir com revisão de schema | Compatibilizar história de 20.000 caracteres e estados densos do capítulo 60; nunca truncar conteúdo existente |
| Marca vetorial do site e selo dos livros são ativos diferentes | Preservar / conferir | Inventário e procedência; usar referência oficial quando pertinente, sem redesenhar, girar ou inventar versão oficial |
| Backup da interface é parcial; dump independente existe | Preservar / ampliar | Distinguir cópia de fichas/configurações de recuperação de infraestrutura e arquivos; ensaio completo antes de migrações |
| Metadados de publicação divergem da consulta nova | Corrigir / certificar | Mesmo SHA no workflow, artefato e endpoint, com verificação nova antes de rollout |

Nenhuma dessas diferenças foi marcada como resolvida apenas por estar documentada.

## Autoridades e contrato de preservação

`character_sheets.tdv2_data` continua a personagem canônica. `tdv2.ts`, `tdv2-play.ts`, `tdv2-master.ts`, `tdv2-operations.ts` e `tdv2-round.ts` permanecem as autoridades existentes a evoluir, sem engine paralelo. `game_settings.tdv2_state` é privado; projeções da Mesa não podem transportar esse payload integral. A coleção de eventos deverá validar no servidor ator, campanha, sessão, cena, audiência, revisões, pedido idempotente e mudanças atômicas.

A ficha retém Pessoa, Constituição, Ação, Expressão e Percurso. O Mestre retém `dashboard`, `session`, `scenes`, `initiative`, `rules`, `npcs-v2`, `threats`, `investigation`, `interludes`, `folds`, `balance`, `catalog`, `assets`, `pinned`, `notes` e `data`, além das guias da condução TdV II. A Mesa retém seleção simples/coletiva, composição/repetição, undo/redo, grade/encaixe, câmera 2D/isométrica/3D, modelos, ambiente, camadas/níveis/oclusão, paredes/portas, fog/audiência, assets, áudio opt-in, director/timeline, preparação, presença/sessão/reconexão, histórico/snapshots, arrasto, régua/pings, captura e passagem de contexto. Destino equivalente e prova são necessários antes de retirar qualquer montagem.

Tecido/tinta no conteúdo, vidro nos comandos, Fios nas relações. Famílias: Fólio, Instrumento/Bancada, Trama/Teia, Lâmina, Palco e Acervo. A biblioteca visual será validada primeiro em `/visual-audit`; nenhuma propagação geral foi feita nesta fase. CSS permanece nos proprietários existentes; 57 módulos/12 links e nenhum novo `!important` nesta etapa.

## Certificação pendente e rollback

Pendentes: matriz de 15 viewports do capítulo 50, zoom 200/400%, teclado real, safe areas e janela parcial de tablet; estados densos e excepcionais do capítulo 60; sessão encadeada criação→VP→Mesa→Mestre→Nexus→encerramento; contas reais mestre/jogador/espectador entre campanhas, OAuth e audiência no transporte/cache; hardware e performance; restauração completa de serviços/arquivos; revisão artística independente.

O lote inicial de auditoria acrescentou instrumentação, fontes e evidência. O lote visível autorizado por DEC-024 está descrito abaixo. Rollback: reverter os commits correspondentes e os registros associados da continuidade; não há rollback de banco, pois nenhuma migração foi criada/aplicada. Não declarar a V4 integralmente concluída com o manifesto aberto. Os próximos lotes estão na fila canônica, não neste documento como segunda fila.


## Primeiro lote visível — NEX-046 / DEC-024

A ficha passa a apresentar cinco fólios indexados, tinta com margem de costura e instrumentos distintos para recursos e Equilíbrio. Pessoa recompõe Feição e Âncora em duas regiões a partir de 700px úteis; o dossiê pessoal ocupa a faixa seguinte. No celular, os campos continuam em pares e a consulta à Âncora precede a operação recolhida, alcançável por um disclosure explícito. Todos os campos e operações permanecem; os callbacks de Ancorar/Reassentar, recursos e Tensão são os existentes.

Constituição apresenta três recursos com nível proporcional e cores legíveis, radar/Matrizes por largura útil, régua bipolar de Equilíbrio e sete marcas de Tensão. Os valores são projeções do motor atual; não há bônus ou gastos novos. As cinco abas conservam SelectionPlate e os controles mantêm foco, leitura e redução de movimento existentes.

O CSS muda em sheet-premium.css, com variáveis de extensão na superfície já proprietária, sem nova folha ou !important. Os materiais da edição anterior usam os fallbacks originais. A operação de Âncora tem um passo adicional de abrir a dobra; o verificador cobre abrir, Ancorar, gravar, Reassentar e gravar novamente. A restauração completa permanece pendente e não é declarada concluída por este lote.

Validação local do lote visível em [visible-validation.json](visible-validation.json): 163 suítes/693 testes, check/audit, 48 vistas dos cinco fólios/instrumentos em 320/390/820/1440px, mestre/espectador e movimento normal/reduzido; 99 estados/fluxos operacionais com Ancorar/Reassentar, gravar, recursos, Tensão, registros e conflitos. A exclusão dos seletores do modo Jogo antigo deixa o material e o espaçamento da ficha atual com seu proprietário; a edição anterior conserva seus seletores. Em 390px a Pessoa passa de 2130 para 1936px na mesma fixture; isso mede composição, não desempenho físico. A fonte permanece sem migration e sem novo !important.
