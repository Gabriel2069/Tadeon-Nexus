# Ficha visual e Modo de jogo — DEC-028

O pedido de Tadeu é uma ficha prática e visual, com identidade por card e aba, base inicial d6/d4 e um modo de partida que substitua a VP como acesso principal. A referência enviada da ficha de Ordem orienta densidade, hierarquia e leitura imediata. Paleta, tipografia, símbolos e materiais continuam próprios do TdV.

## Diferenças e destinos

| Superfície | Resultado | Dados e funções |
| --- | --- | --- |
| Nova personagem / conversão revisável | Matrizes I/d6 e Alinhavos 0/d4 antes de distribuir; contadores mostram a alocação de criação | Nenhuma ficha salva é redefinida. Pacote legal permanece duas Matrizes III/d10 e duas II/d8, dois Alinhavos grau 2/d8 e quatro grau 1/d6. O perfil pronto passa a fixture explícita. |
| Cinco fólios integrais | Pigmento por aba, emblemas vetoriais por seção, costuras e cantos que variam conforme a função | Pessoa, Constituição, Ação, Expressão e Percurso mantêm os destinos de campos e operações. |
| Matrizes / Alinhavos | Instrumentos de dado com silhueta e valor; cor por Matriz e escolhas nativas | Mesmas escalas, custos e revisão de criação. Sem nível universal ou bônus inventado. |
| Repertório | Resumo com emblema, tipo, nome e dois campos reais antes da edição | Conteúdo completo, edição, criação, exclusão e uso existentes permanecem. Nenhum resumo substitui o payload. |
| Modo de jogo | Presença, PV/PI/PE e estados junto de Agir, Capacidades, Repertório, Relações e Percurso | Mesmo personagem, motor e callbacks de persistência. Equipamento/inventário estão na dobra identificada do Repertório. |
| Dois Fios | Dados e escolhas antes de detalhes; DT e rolagem direta; parâmetros avançados e contexto opcionais | Resultado transitório persiste ao alternar abas/modos. Registro narrativo não é obrigatório. |
| Dados físicos | Informar faces válidas dos dados finais e conferir o resultado | Mesmo `resolveTest`, validação, custos e falha crítica; sem sortear outras faces. Confirmação igual fica bloqueada até nova rolagem explícita ou alteração das escolhas. Não representa idempotência de servidor. |
| VP antiga | Menu Registros históricos → Forma de Poder histórica | URL, autorização, flag e payload preservados. Fichas TdV II não sincronizam o registro histórico na simples consulta. A operação da edição anterior continua existente. |
| Preferência de apresentação | Modo por conta/personagem na sessão do navegador; nova janela aceita `mode=game` | Não grava essa preferência no personagem. Falha de armazenamento não impede uso. |

Os SVGs são elementos declarativos leves, sem assets remotos, canvas, novos observadores ou animações ambientes. O painel de ação mantém uma instância entre trocas de aba, com ocultação da aba inativa. Não duplica o motor nem a cobrança de recursos. A apresentação histórica não se torna fonte de bônus para TdV II.

## Responsabilidade e preservação

A rota mantém estado, permissões, CAS e autosave. `SheetExperienceBridge` recebe o modo controlado para a edição atual e conserva sua operação anterior nos outros consumidores. `TdvPlayPresence` recebe dados e callbacks; não possui um livro-caixa paralelo. `TdvEmblem`/`TdvDie` só desenham informações. O material pertence a `sheet-premium.css`, campos a `button.css` e geometria do cabeçalho a `page-hero-parity.css`. Permanecem 57 módulos/12 links; nenhum `!important` novo.

A mudança é de código e apresentação, sem migration, exclusão de registro, redefinição de ficha ou escrita em conta real. Rollback: reverter a PR deste lote; payloads persistidos conservam o schema anterior. Rascunhos não concluídos continuam revisáveis. DEC-024 autoriza seguir sem exigir nova restauração completa para este lote.

## Fontes e evidências

O Livro II normativo já lido permanece a autoridade. A reedição do Livro do Jogador foi consultada na introdução/criação, e sua Nota Editorial foi lida integralmente: declara edição editorial sem mudança mecânica deliberada. Não se afirma leitura integral da reedição. A distribuição pronta era um exemplo; d6/d4 é a base anterior à distribuição, não o pacote final de criação.

`sheet-play-validation.json` registra provas locais e hashes de capturas. A suíte `play` do Visual review cobre os 15 tamanhos exatos do capítulo 50, edição/somente leitura, modo restaurado, repertório preenchido, conferência física e consulta histórica. Os cinco grupos anteriores continuam exigidos; `browser` agrega os seis. Quality verifica estilos, continuidade, manifesto, lint, tipos, testes, SQL isolado e build. Os resultados do fonte exato e da publicação devem constar na PR; nenhum check anterior certifica este lote.

## Limites e próximos passos residuais

Não certifica hardware ou contas reais, teclado virtual real, performance de campo/FPS/INP, todos os estados do capítulo 60 ou a V4 integral. A integração física deste lote confere faces no mesmo motor; aprovação do Mestre, eventos transacionais versionados/idempotentes, filtragem de audiência, conciliação offline/retry e integração física/híbrida completa continuam em NEX-048/NEX-047. Mesa/Mestre/Nexus conservam suas ferramentas, sem declarar implementada a fase 5. NEX-046 permanece ativo para os estados densos e a certificação remanescente. Não foi medido ganho percentual de desempenho.
