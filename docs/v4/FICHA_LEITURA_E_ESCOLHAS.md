# DEC-031 — leitura, escolhas e operações da ficha

Pedido: refinamento da PR 321, com informações como função primária da ficha e operações ocasionais em comandos. A identidade aprovada permanece: tecido, tinta e vidro contido, Cormorant/Alegreya/PT Mono. Fonte de regras reconferida: `02_Livro_de_Regras(4).docx`, recebido em 01/11; núcleo de criação e progressão coincide com a edição (3). A referência de produção antes deste lote é `f447350d9b8f8696b822de978c43800bcc554ef3`.

## Destinos e comportamento

| Área | Resultado | Dados preservados |
|---|---|---|
| Navegação | Placa calcula coordenadas locais descontando escala ancestral; coluna de ícones permanece ancorada ao recolher | Rotas, teclado, foco, redução de movimento |
| Matrizes/Alinhavos | Silhuetas de dados autorais; nomes maiores; duas colunas à esquerda e radar à direita quando há largura; ramos com cores correspondentes | Categorias/graus e investimentos |
| Recursos | Neon contido, arco/barra mais espessos; Esforço verde | Valores, máximos, custos e controle direto |
| Quadros | Material escuro translúcido e cantos comuns à narrativa; símbolos Lucide simples, títulos concisos, marca d'água discreta e margens internas | Todo conteúdo das cinco guias |
| Escrita | No próprio quadro; blur/Ctrl+Enter confirma, Escape cancela | Nome, narrativa, Feição e campos extras |
| Proteção | Guarda dominante, defesas expostas, cobertura e modificadores por comando | Todos os campos e cálculos existentes |
| Vínculos/Âncora/Cena | Informações permanecem na ficha; mobilizar, Ancorar, recuperação e consequência em operações temporárias | Funções e consequências existentes |
| Lavores | Quadro próprio e compra/incorporação contextual, com custo/saldo | Registros e histórico de aquisição |
| Tramas/Fragmentos | Quadro próprio inclui Selos; uso contextual e expressões em curso | Registros, sustentação, Relaxamento, Refluxo |
| Armas/Inventário | Registros compactos com dados reais, edição inline, criação composta em duas regiões; reparo e organização mantidos | Todos os campos inclusive extras/legados, IDs e recipientes |
| Condições/Equilíbrio | Borda graduada pela maior gravidade, chips com forma/espessura/cor; tonalidade do fundo segue Equilíbrio | Gravidade não fabrica penalidades; motor de declaração anterior intacto |

## Criação e progressão

- Rascunhos começam d6/d4. Matrizes distribuem seis avanços até 3/3/2/2, sem terceira d10. Alinhavos têm duas vagas d8 e quatro d6. Devolver libera a escolha; isto não gera PU.
- Oito passos visíveis e compactos; familiaridades opcionais (até quatro, sem bônus) em janela de seleção; revisão final contextual. A criação concluída não deixa distribuição/Pilar livremente editáveis.
- Desenvolvimento: conceder Marco é um botão de +5%/2 PU, até 100%/40 PU. Não exige formulário de acontecimento. O livro continua exigindo reconhecimento ficcional, sem impor um diário.
- PU usa o motor existente: Matriz 3/4/5/6/7 conforme avanço, Alinhavo 2, Lavor 4/6, ampliação 3–7; incorporação e transcendência continuam verificadas. Sem novas moedas ou bônus universais.
- Mestre reverte o último Marco não gasto ou o último investimento. Correções arquivam o registro anterior; máximos reduzidos limitam recursos sem curar.
- Mestre pode autorizar o proprietário a conceder Marcos ou rever escolhas iniciais. O banco usa a autorização da versão anterior da linha, mantém RLS/CAS e impede autoautorização, remoção/rewrite de Marcos por jogador e alteração de investimentos anteriores.
- Revisão de criação concluída é um rascunho local integral: só salva uma distribuição válida, sem investimentos ativos. Revogar a autorização bloqueia alterações antigas no servidor.

## Verificação proporcional e publicação

O pedido explícito mantém QA reduzido. O driver atual substitui as passagens UI sobrepostas: quatro composições, mestre/espectador, cinco guias e os fluxos alterados. Testes unitários de domínio, autorização/CAS e PostgreSQL permanecem; o roteiro UI antigo que dependia de formulários/removidos foi substituído pelo driver atual. Para PR estreita de ficha/navegação, Visual review executa navegação e ficha; PRs que alteram outros proprietários mantêm seis grupos. Não são desativados Quality ou o gate de produção de main.

Validação inicial local: typecheck, lint sem erros, estilos sem crescimento de overrides, dez testes focados e 52 verificações PostgreSQL passaram. A execução local do Chromium foi bloqueada pelo ambiente ao criar sockets; a prova renderizada deve vir do CI deste fonte, com capturas inspecionadas antes do merge. Resultados finais e publicação ficam na PR; não confundir esta implementação com deploy.

Migração aditiva de função: `20261102153325_tdv_sheet_authorized_corrections.sql`; sem regravar fichas, tabelas ou permissões RLS. Aplicação em produção somente após validar o fonte. Rollback visual preserva os campos opcionais `progression`/`corrections` e seu guard; não voltar ao parser antigo que descartaria os arquivos de correção. A função anterior está na migração de origem; restaurá-la revoga delegação, sem apagar registros.

Permanecem fora desta certificação: hardware/contas reais, todos os 15 tamanhos V4, FPS/INP, integração física/offline transacional completa e concessões gratuitas de Lavores iniciais do cenário (NEX-048). Não foi criada árvore universal de pré-requisitos que o livro não define; aquisições respeitam o texto do Lavor e o motor de PU.
