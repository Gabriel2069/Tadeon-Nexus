# TADEON NEXUS — SISTEMA INTEGRAL DE EXPERIÊNCIA
## Especificação final cumulativa V4.0 · produto, arquitetura, direção de arte, composição, interface, mecânicas e jogo híbrido · TdV II

**Versão do dossiê:** 4.0 · 31 de outubro de 2026  
**Natureza:** documento diretor, integral e executável para implementação posterior no Work; **não** é uma alteração do repositório.  
**Projeto:** `Gabriel2069/tadeon-nexus`, branch `main` no momento da consulta.  
**Escopo:** toda a experiência Tadeon — Início/Arquivo, Ficha Integral, VP (modo de jogo), Mesa Nexus, Painel do Fio~Mestre, Nexus/Acervo, Kit Físico, autenticação, usuários, backups, offline, identidade visual, materialidade, hover, transições, responsividade, segurança, dados, migrações e validação.

> **Tese de produto.** O Tadeon não deve parecer um site que armazena formulários de RPG. Deve funcionar como um instrumento de leitura, intervenção e memória da Tessitura: a Ficha registra a pessoa; a VP acompanha suas decisões durante o jogo; a Mesa hospeda a situação; o Fio~Mestre conduz a transformação; o Nexus conserva relações e continuidades. São perspectivas de um mesmo sistema, não cinco aplicações desconectadas.

---



> **Evolução V3 → V4:** a **Parte IV (capítulos 45–63)** incorpora a revisão minuciosa da totalidade do produto, a rastreabilidade das rotas e guias identificadas no GitHub, a anatomia de cada classe de controle, composição e microinteração, matriz de regressão mecânica e um protocolo de implementação/teste que exige prova visual e funcional. **A Parte IV é cumulativa:** prevalece sobre orientações anteriores apenas quando detalha/aperfeiçoa apresentação ou execução; nenhuma regra, permissão ou recurso antigo se perde por prioridade editorial. A auditoria de arquivos é estática; só a implementação com testes de uso poderá certificar cobertura efetiva.

> **A evolução V2 → V3:** a **Parte III (capítulos 30–44)** acrescenta direção visual e experiência de todo o produto, sem abreviar a V2: identidade sistêmica, materiais, tecidos, fios, Liquid Glass criterioso, profundidade 2.5D, motion semântico, interação de mouse/toque/teclado, recomposição celular/tablet/desktop, especificações por área, conservação de funções, contratos de implementação, testes de arte e acessibilidade. **Esta é a especificação cumulativa, não um anexo separado.** Onde a Parte III for mais específica sobre design, ela prevalece em estética/composição, mas nunca altera ou apaga regra, mecânica, histórico, permissão e função definidos nas Partes I e II.

> **A evolução da V1 para a V2:** preserva integralmente o diagnóstico funcional e a arquitetura da versão anterior; acrescenta a **Parte II (capítulos 16–29)**, com direção autoral de materiais e formas, composições detalhadas desktop/tablet/celular, storyboard da VP, conservação das funções da Mesa, Fio~Mestre, Nexus, matriz mecânica e roteiro de implementação auditável. Quando uma orientação da Parte I for genérica e a Parte II for específica, aplicar a especificação específica sem eliminar funcionalidades.

## Mapa de leitura do dossiê

| Leitor / objetivo | Entrar por | Resultado esperado |
|---|---|---|
| Direção de produto | cap. 1–4 e 16 | tese, papéis, contrato físico e linguagem visual |
| Design da Ficha | cap. 5 e 17 | layouts/estados, seções, tipografia, componentes e mobile |
| Design da VP | cap. 6 e 18 | fluxo inteiro da intervenção, Fios, cartas, físico/digital |
| Mesa e mundo espacial | cap. 7 e 19 | inventário de ferramentas, projeto de palco e integrações |
| Painel do Mestre | cap. 8 e 20 | preparo/condução, ameaças, segredos, operações, investigação |
| Nexus e memória | cap. 9 e 21 | arquivamento, grafo, relações e publicidade por audiência |
| Engenharia, mecânicas e segurança | cap. 10–12, 22–25 | normativa, arquitetura, eventos, relações e autorização |
| Gestão e QA | cap. 13–15, 26–29 e 38–44 | provas, preservação funcional, excelência visual e pacotes de implementação |
| Direção e auditoria final V4 | cap. 45–50 | definição de pronto, cobertura de rotas/componentes, acabamento, anatomia de controles, motion e layout |
| Todas as páginas com V4 | cap. 51–57 | Registro, VP, Mesa, Mestre, Nexus, utilidades, login e arquivo |
| Regras, arquitetura e aceite V4 | cap. 58–63 | matriz mecânica, CSS/propriedade, QA, detalhes esquecidos e manifesto Work |
| Direção de arte V3 | cap. 30–33 | matéria, tecidos, Fios, vidro, composição, profundidade, hover e motion |
| Responsividade V3 | cap. 34–35 | celular compacto, tablet PC-first, shell, navegação, login, arquivo e utilidades |
| Telas e detalhes V3 | cap. 36–37 | Registro, VP, Mesa, Mestre, Nexus, estados e microinterações |

### Notas de precisão da V2

1. As **proporções, dimensões e desenhos de composição** são propostas de interface a serem refinadas com captura/ensaio, não medidas da regra de RPG.
2. A **Tensão** alcança o limiar físico `±4` para deslocar o **Equilíbrio** e reiniciar; o estado acumulado já transformado pode estar persistido como `−3..+3` no motor. Não criar estado persistido inválido para reproduzir a régua física.
3. **VP** no TdV II será *Visão de Partida* como proposta de rótulo, mantendo separada a *Versão de Poder* histórica da edição anterior.
4. A documentação de testes do repositório demonstra várias verificações automatizadas, mas **não equivale** a certificação universal de contas reais, hardware e restauração efetiva; os testes da Parte II permanecem obrigatórios.
5. As cores do Fio~Mestre são normativas; o kit físico documentado é concreto. Novos componentes e automatizações são **propostas de produto** e jamais reinterpretam silenciosamente o Livro II.

---

# 0. FONTES, AUTORIDADE E LIMITES

1. **Livro de Regras TdV II**, última cópia encontrada na Biblioteca `02_Livro_de_Regras(3).docx`, de 27/10/2026: autoridade normativa de criação, resolução, situação, transformações, instrumentos, personagens e ameaças.
2. **Urdidura do Vazio**, `01_Urdidura_do_Vazio(2).docx`: autoridade de cosmologia, Naturezas, Regências, Fios/Malhas, Dobras, Fragmentos, Selos e interpretação ontológica. Não transformar uma relação cosmológica em benefício mecânico por mera analogia.
3. **Fio~Mestre**, `03_Fio_Mestre(2).docx`: autoridade visual e editorial. Preservar símbolo oficial, orientação, cores, proporções e a gramática dos Fios; não recriar a arte por aproximação.
4. **Kit físico**, em particular `01_Tabuleiro_Individual_A3.pdf`, `18_Guia_Kit_Fisico_A4.pdf`, `TdV_Marcadores_v1_Guia_de_Uso_e_Producao.pdf`, `TdV_Catalogo_Visual_do_Kit.pdf` e `TdV_Kit_Complementar_Provas_Completas.pdf`.
5. **Código vivo**: repositório, em especial `src/routes/sheet.$id.tsx`, `src/routes/sheet.$id_.power.tsx`, `src/components/sheet/tdv2-sheet.tsx`, `src/components/sheet/sheet-experience-bridge.tsx`, `src/lib/tdv2*.ts`, `src/components/master/tdv2-master.tsx`, `src/routes/master-panel.tsx`, `src/components/tabletop/*`, `src/lib/tabletop/*`, migrações Supabase e `docs/tdv-ii-coverage.md`.

**Precedência:** regra expressa do Livro de Regras > adaptação operacional do site; cosmologia e cânone visual não autorizam bônus; componentes antigos não podem reviver regras substituídas. Nenhum número, custo, complicação, efeito ou automatismo novo será declarado canônico sem base textual explícita. O sistema auxilia decisões ficcionais sem fingir decidir pelo Narrador.

**Natureza das propostas:** quando este documento propõe nomes de interface, relações entre entidades, navegação, tecnologia ou indicadores visuais, são **decisões de produto**, não regras adicionais de TdV. O Work deve identificar qualquer suposição de negócio antes de persistir novo tipo de informação.

---

# 1. PRINCÍPIOS NÃO NEGOCIÁVEIS

**1.1. Conservação antes de expansão.** Não retirar ferramentas da Mesa, painéis da campanha, editores de história, inventário, recipientes, radar, NPCs, ameaças, investigação, neblina, câmera, andares, projeções, arquivos, modelos, handouts, notas, snapshots, links ou controles existentes. Reorganizar por contexto; não amputar funcionalidades por conveniência estética.

**1.2. Uma autoridade, múltiplas apresentações.** O mesmo personagem e o mesmo acontecimento aparecem diferentemente na Ficha, VP, Mesa, Painel e Nexus. A interface não mantém atributos, recursos ou consequências paralelos sem semântica própria.

**1.3. Física e digital são complementares.** O kit impresso é instrumento imediato do jogo presencial; o Tadeon guarda registros duráveis, versões, permissões e histórico. O papel não possui sincronização automática; o sistema não deve alegar leitura da prancha, dos marcadores ou das cartas sem uma ação real de conferência.

**1.4. Profundidade sob demanda.** Uma jogada simples cabe em uma interação breve; investigação, Costura de Malha, Selagem ou Canalização ampliam controles conforme a necessidade. **Não** reduzir complexidade escondendo ações inacessíveis.

**1.5. Interface autoral, sem template.** O projeto adota composições assimétricas motivadas, instrumentos específicos, proporções e camadas intencionais, não um grid repetitivo de cartões com degradês, runas e animações decorativas.

**1.6. Oportunidade antes do dado.** Se competência, acesso e tempo bastam e não existe incerteza relevante, a ação é resolvida pela ficção. O site não induz a rolar para toda interação.

**1.7. Segurança por fonte, não por aparência.** Se o jogador não pode acessar um segredo, não se envia esse segredo para a UI, mesmo oculto por CSS. Permissões devem ser filtradas no servidor.

**1.8. Acessível, responsivo, econômico.** Sem dependência de API paga; preservar arquitetura existente GitHub/Cloudflare/Supabase. `prefers-reduced-motion`, foco, teclado, leitores de tela, contraste, conexões instáveis e mobile são requisitos do produto, não polimentos opcionais.

---

# 2. MAPA DO PRODUTO E HIERARQUIA DE NAVEGAÇÃO

## 2.1. Os ambientes

- **Átrio / arquivo de personagens:** retoma campanhas, sessões e fichas; mostra convites, presença, avisos, atividades e links úteis. Deve ser entrada compacta e editorial, não um hero monumental.
- **Ficha Integral — Registro:** dossiê canônico completo do personagem. Lugar de criação, revisão, desenvolvimento, referências, equipamentos, história e memória. Pode ser editada fora da sessão, inclusive em modo somente leitura.
- **VP — modo Jogo:** espaço operacional do personagem durante a sessão. Complementa a prancha A3 e as cartas físicas; também opera sem kit quando necessário. Tem acesso a todo dado pertinente, mas mostra o essencial para agir. **Não** é uma segunda ficha independente.
- **Mesa Nexus:** palco espacial, compartilhamento de cena e instrumentos de intervenção; funciona em 2D, isometria/3D e com material narrativo, conforme os recursos existentes.
- **Painel do Fio~Mestre:** condução de sessão, cena, participantes, oposição, investigação, Selagem, revelações, eventos e preparo de campanha, com áreas privadas.
- **Nexus / Acervo:** livros e regras, grafo de relações, páginas de campanha, documentos, cronologia, personagens, lugares, descobertas, evidências, registros e vínculos; mistura biblioteca normativa e documentação ficcional apenas quando a natureza e o acesso ficam claros.
- **Ateliê de recursos / Assets:** miniaturas, imagens, modelos, fundos, handouts, cartas para impressão, arquivos e gerenciamento de mídia. Não fundir ferramentas de Asset com uma lista de itens da ficha.
- **Configuração e administração:** campanhas, membros, papéis, segurança, backups, importação, edições normativas e preferências visuais.

## 2.2. Navegação como teia com orientação firme

**Desktop:** navegação global compacta e estável; página usa sua própria faixa de contexto. A navegação lateral pode recolher; não deve atravessar o palco da Mesa. Menus radiais e movimentos de seleção preservam personalidade quando há espaço e propósito, mas itens críticos têm alternativa textual e indicação de foco.

**Mobile:** navegação inferior concisa com opção “Mais” em roda orbital já estabelecida, sem dezenas de ícones simultâneos. A área de conteúdo prioriza instrumento/tarefa corrente; painéis auxiliares são folhas, gavetas ou janelas acessíveis, não colunas gigantes empilhadas.

**Contexto persistente:** campanha, personagem em foco, sessão, cena, papel, conexão, estado de salvamento e versão das regras devem estar facilmente recuperáveis, mas apresentados em densidade mínima. Não repetir grandes títulos em cada painel.

## 2.3. Percursos principais

1. Personagem → Ficha Integral → VP → intervenção → consequência → histórico → Ficha/Nexus.
2. Mestre → campanha → preparo da cena → publicação parcial → Mesa → alteração relevante → revisão do Resto → próxima sessão.
3. Investigação → evidência recebida → hipótese do jogador → confirmação/contradição do mestre → intervenção → persistência da descoberta.
4. Carta física → localizar registro digital pelo nome/código → consultar caso completo → declarar uso → registrar custos/consequências → conferir estado com prancha.
5. Item ou pessoa no Nexus → vínculo com personagem/cena → abertura contextual do dossiê sem quebrar a Mesa.

---

# 3. A DECISÃO CENTRAL: DUAS EXPERIÊNCIAS DA MESMA FICHA

## 3.1. Registro e VP não são dois bancos de dados

**Ficha Integral** contém todos os dados e permite construção, evolução e revisão detalhada. **VP** é projeção operacional de uma mesma ficha. Alteração autorizada em qualquer uma deve refletir-se na outra conforme política de sincronização/confirmação. Não duplicar `tdv2_data`, não criar “pontos VP” e não tratar a VP como personagem secundário.

**Botão VP:** manter o rótulo curto **VP** por continuidade do hábito, acompanhado de tooltip e subtítulo **Visão de Partida** (nome proposto de interface). Há uma incompatibilidade histórica a tratar: na edição antiga `VP` significava “Versão de Poder”, com rota `/sheet/$id/power` e `power_form_data`. O novo modo **não** é evolução daquela Forma de Poder. A rota/registro antigo deve permanecer consultável com título **Forma de Poder · legado**, isolado, sem contribuir bônus ao TdV II. A nova VP receberá rota própria, sugerida `/sheet/$id/play`, com redirecionamentos conscientes e links seguros. Nunca sobrescrever o payload antigo.

O seletor atual “Jogo/Editar” do `SheetExperienceBridge` não pode continuar competindo com o novo VP: transformar em atalho consistente à VP ou absorvê-lo na navegação. A distinção será **Registro / VP**, não três interpretações de “modo jogo”.

## 3.2. Permissões e abertura

- Todo personagem TdV II concluído e acessível poderá **abrir** a VP; não depender da flag legada `power_form_enabled` usada para liberar Forma de Poder antiga.
- Personagem ainda em criação: acesso de consulta ao Registro, mas VP mecânica limitada e sinalização clara das pendências. Sem jogar com valores não validados.
- Membro com leitura sem edição: VP em modo observação; não permitir aplicação de recursos, custos, vínculos ou resultados.
- Mestre: pode entrar na VP em visualização do jogador ou vista administrativa, sem misturar segredos no modo compartilhável.
- A troca preserva contexto de sessão e rascunho; solicita salvamento ou preservação segura antes de abandonar edições pendentes.
- URL direta, retorno, botão sair, janela destacável, foco e estados de erro devem funcionar tanto no desktop quanto no mobile.

## 3.3. Modos de presença do kit

A VP oferece três perfis **de apresentação e sincronização**, nunca três regras mecânicas:

1. **Presencial · kit físico (preferencial quando escolhido pelo usuário):** prancha, marcadores e cartas são a superfície imediata; VP prioriza consulta profunda, Motor, histórico e vínculos. Estados físicos alterados não são presumidos atualizados digitalmente.
2. **Híbrido:** o grupo utiliza material físico e Mesa virtual para mapas/handouts; VP pode registrar ações ao vivo, com indicação do que precisa ser refletido fisicamente.
3. **Somente digital:** aparece um painel compacto adicional para estados que a prancha normalmente contém, sem desfigurar a arquitetura da VP. Não fazer o modo físico parecer incompleto.

O perfil é preferência por sessão/personagem e pode mudar sem perda de dados. Uma conta não deve alternar de perfil e ganhar uma cópia independente de recursos.

---

# 4. CONTRATO EXATO COM O KIT FÍSICO

## 4.1. Prancha A3 — 420 × 297 mm

A prancha individual já contém **Personagem/Feição; Origem/Ofício/Símbolo; PV/PI/PE atuais e máximos; dois Impulsos e uma Resposta; Posição Favorecida/Disputada/Exposta; três espaços para cartas 63 × 88 mm (Equipamento, Lavor/Trama, Outro recurso); Condições ativas; Âncora/Vínculo em jogo; Lembretes de cena**. Esse inventário é vinculante para decisões de interface. Não redesenhar a prancha sem solicitação; o projeto atual visa o site.

| Função | Instrumento físico | Ficha Integral | VP em sessão |
|---|---|---|---|
| Identidade | campo curto no topo | biografia, seis pilares, detalhes, retrato | cabeçalho compacto e contexto |
| PV, PI, PE | campos atuais/máximos | máximos, fórmulas, alterações, fontes, recuperação | consulta discreta; ajuste rápido se digital; diferenças pendentes se físico |
| Impulsos/Resposta | três marcadores | histórico e regras de cena, quando pertinente | consulta da rodada, solicitação/registro de gasto quando online; não precisa de segunda prancha se físico |
| Posição | marcação da prancha | registros de situações e contexto | posição contextual por oposição/frente; confirmar escopo |
| Cartas ativas | três nichos físicos | acervo completo de equipamento e expressões | busca, texto completo, custos, limites, uso e ligação com registro físico |
| Condições | marcador + ficha de condição | Nome, Origem, Efeito, Saída, intensidade, história | alerta contextual e ação de consulta/saída; visual legível |
| Âncora/Vínculo | nota transitória | história, natureza, estados, ações Abrir/Sustentar/Cobrar, Ancorar/Reassentar | mostrar relação em jogo e consequência acionável |
| Lembretes | escrita apagável | notas, registros duráveis, eventos | fila de pendências e captura opcional de Resto |

**Consequência:** VP não deve abrir com três barras enormes de PV/PI/PE e uma cópia em tela cheia dos três nichos de cartas. Esses elementos já estão fisicamente diante do jogador. A camada digital mostra contexto dinâmico e detalhe sob demanda.

## 4.2. Outras peças físicas e equivalências

- **Mapa livre de relações/pistas A4:** permite anotações e hipóteses sem expor a estrutura secreta. O Nexus digital guarda links, versões, evidências reveladas e propostas do jogador; não força correspondência geométrica linha a linha com o papel.
- **Diário de sessão A4:** memória breve e escolhas do jogador; o site guarda a narrativa completa com autoria e indicação de fatos confirmados, hipóteses e lembranças.
- **Superfície modular de cena A3:** Foco, Oposição, Passagem, Resto; não exige grade tática. A Mesa Nexus poderá ser um complemento opcional de mapas complexos, objetos e handouts, não pré-requisito da experiência presencial.
- **Marcadores de condição:** círculos = Leve; triângulos = Grave; losangos = Crítica. O site usa rótulo + forma + cor, jamais cor isolada; não pressupõe penalidade universal.
- **Estados críticos:** Incapacitada, À Beira, Colapso, Âncora Abalada, Guarda Quebrada. O site registra origem, evento e procedimento pertinente; marcador não cria regra adicional.
- **Trilhas:** Pressão 0–4; Compasso de Urgência configurado no intervalo 3–8; Tensão −4 a +4 com conversão em Equilíbrio e retorno a zero; Equilíbrio −10 a +10. Cada instrumento responde a pergunta diferente; não unificar contadores nem transformar Tensão em Pressão.
- **Escudo do Fio~Mestre e cartas de consulta:** referência imediata física. O digital aprofunda casos, mantém links a capítulo, exemplos, probabilidades e registro do caso atual.
- **Cartas de categorias:** categorias inventariadas: Armas, Itens, Consumíveis, Relíquias, Lavores, Tramas, Fragmentos, Ameaças, NPCs, Locais. O site cataloga instâncias e versões dessas categorias, mas não presume que cada carta impressa tenha sensores, IDs ou textos sincronizados.
- **Pasta do Jogador, pasta do Mestre, divisórias, cintas, caixa, identificadores e dossiês:** organização física; no site, índice e exportação/impresso, não um simulador de bolsos.

## 4.3. Sem sincronização fictícia

O material físico é uma **cópia/transitório**. Quando ações ocorrerem apenas sobre o tabuleiro, o Tadeon deve oferecer um **Acerto de Continuidade**: revisão manual de diferenças, de preferência no encerramento de cena ou sessão. A confirmação informa autor, horário, estado anterior, alteração e motivo, com oportunidade de desfazer rascunho. Se o Tadeon foi usado em tempo real, os números digitais são provisórios do turno e o usuário pode optar por conferi-los com a prancha; evitar criar um segundo sistema de contabilidade conflitante.

A interface pode mostrar “Conferir prancha” ou “Atualização digital pendente”, nunca “prancha sincronizada” sem entrada explícita. Não introduzir OCR obrigatório, câmera, QR físico presumido ou RFID.

---

# 5. FICHA INTEGRAL — ARQUITETURA EDITORIAL E FUNÇÕES

## 5.1. A função do Registro

A Ficha Integral é **arquivo durável**, não HUD de batalha. Ela reúne toda informação acessível da personagem e não expulsa conteúdos narrativos importantes para caber em um layout compactado. Necessita criar, consultar, pesquisar, editar, referenciar, exportar, imprimir, versionar, recuperar e rastrear mudanças conforme permissões.

### Composição desktop

- **Faixa de identificação**: nome, retrato/símbolo, campanha, edição, estado, acesso, salvamento e botão **VP**. A faixa acompanha a personalidade da personagem; não precisa de hero gigante.
- **Coluna do caráter** (assimétrica e não continuamente fixa): Feição, Âncora, Vínculos, Marca e um resumo de transformação pessoal. Tipografia de leitura mais literária; links orgânicos entre conceitos realmente relacionados.
- **Núcleo técnico**: instrumentação das quatro Matrizes, radar responsivo, 21 Alinhavos, Defesas, Guarda e recursos. Valores e estados com alinhamento preciso, linhas de referência e inspeção por detalhe.
- **Área de práticas**: inventário, recipientes, equipamentos, Lavores, Tramas, Fragmentos, Selos, Preparo e expressões, com organização por função e não por pilhas genéricas de cartões.
- **Percurso e memória**: Desenvolvimento, Marcos, PU, incorporações, repertório conquistado, história, descrições, notas, sessões e Resto/Permanências.
- **Índice de seções**: discreto, buscável, com âncoras e indicadores de pendência; usuário não deve atravessar milhares de pixels para editar um campo.

Composição de referência, não grid rígido:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← PERSONAGEM / CAMPANHA                        [VP] [buscar] [salvamento] │
├──────────────────────────┬────────────────────────────┬─────────────────┤
│ RETRATO / FEIÇÃO         │ CONSTITUIÇÃO               │ ÍNDICE / HOJE   │
│ Origem · Ofício          │ Radar de quatro Matrizes  │ Âncora         │
│ Convicção · Limite       │ Alinhavos por domínio      │ condições      │
│ Marca + seus resíduos    │ Defesas e Guarda          │ notas recentes │
├──────────────────────────┴────────────────────────────┴─────────────────┤
│ EXPRESSÃO — catálogo próprio, composições de cartas / registros          │
├───────────────────────────────────────┬─────────────────────────────────┤
│ TRAJETÓRIA / MARCOS / INCORPORAÇÕES   │ HISTÓRIA / NOTAS / VÍNCULOS     │
└───────────────────────────────────────┴─────────────────────────────────┘
```

## 5.2. Pessoa: seis pilares operacionais

**Origem:** descrição social e biográfica, mundos e instituições associados; links contextuais ao Nexus. **Ofício (Feição):** identidade e prática profissional — diferente do Alinhavo denominado Ofício. **Convicção:** continuidade pessoal que pode sustentar decisões. **Limite:** consequência qualitativa de transgredi-lo; jamais desvantagem universal. **Marca:** Gatilho, Manifestação, Resíduo, alcance interpretativo, momentos e referências; não presumir paranormalidade. **Vínculos:** envolvidos, natureza, estado, oferta, demanda, tensão, eventos e ações Abrir/Sustentar/Cobrar, com o grafo de relações opcional.

**Âncora:** pilar escolhido, descrição e estado íntegro/Abalado; Ancorar por Sustentar ou Redirecionar com registro da consequência preservada e do preço narrativo; Reassentar apenas mediante ação significativa. A representação visual deve mostrar o vínculo causal entre acontecimento, alteração e continuidade, sem uma barra fictícia de recarga.

**Detalhes pessoais preservados:** nome, idade, retrato, descrições físicas, história, personalidade, motivações, objetivos e observações preexistentes; não apagar o editor narrativo completo em nome do novo sistema. Privacidade configurável para notas pessoais.

## 5.3. Constituição

- Quatro Matrizes **Ímpeto, Cadência, Nexo, Lastro**, com grau/dado, variações e estado de Matriz Abalada quando aplicável.
- 21 Alinhavos canônicos, dados correspondentes, agrupamento por filtro e pesquisa; permitir localizar rapidamente sem exigir lista longa no mobile. Cuidado: Alinhavo 0 não deve ser mostrado como inexistência de competência.
- PV, PI, PE: atuais, máximos calculados, alterações expressas, custo, recuperação por janelas e fonte; estado esgotado e alertas sem diagnóstico inventado.
- Quatro Defesas e Guarda: valor, proteção ordinária até +2 combinada, fonte, cobertura total, estado de Guarda Quebrada; limiar singular por intervenção; nenhum bônus automático por vestimenta genérica.
- Condições: Nome, Origem, Efeito, Saída, Intensidade; forma visual relativa à intensidade; histórico e associação ao evento causal. Uma condição não é sinônimo de dano em recursos ou Marca.
- Equilíbrio −10…+10 e Tensão convertida ao atingir ±4; eixo sem codificação moral; não adicionar bônus universal por equilíbrio extremo.
- Estados críticos: 0 PV/Incapacitada, janela À Beira, estabilização e morte por situação declarada; 0 PI/Colapso e transformação permanente; 0 PE restringe ações custeadas, não ações ordinárias. Gatilhos especiais seguem o livro, jamais contador arbitrário de morte.

## 5.4. Ação, motor e situação

Reutilizar a autoridade `src/lib/tdv2.ts`: Fio de Prumo = Matriz, Fio de Tento = Alinhavo, Enlace, Ascendente, Retorno, Desvio, Consonância, falha crítica na dupla unidade, Proveito/Desproveito com compensação por Fio, Forçar com custo e autorização transcendente expressa para d20, condições de repetição e margem. Incluir disputa, Auxílio, Cooperação, Redobra, operações prolongadas e intervenção sem teste.

O Registro contém histórico consultável dos testes realmente ocorridos, suas fontes, eventuais custos e consequências. Não deve transformar o histórico em ranking de eficiência ou exibir probabilidades como autorização para uma ação ficcionalmente impossível.

## 5.5. Expressão e repertório

**Inventário:** armas (seis campos canônicos), ferramentas, recipientes, porte/acesso, Consumíveis, Relíquias, propriedade, manutenção, Integridade Apto/Danificado/Inutilizado. Os itens anteriores permanecem com os mesmos identificadores. Não exigir slots/proficiências antigos ou vida numérica universal de objetos.

**Lavores:** descrição, Vertente (Corpórea, Cônscia, Cinética, Canalizada), permissão, abordagem, limites, condições, incorporações e gastos de PU. Lavor incorporado tem documento de aquisição; texto de repertório não concede automaticamente capacidade.

**Costura de Malha:** participantes/práticas de Vertentes diferentes, contribuição de cada componente, condição/gatilho, efeito próprio, limitações e preços; um teste por intenção, salvo intervenções diferentes. **Cooperação** de jogadores é procedimento distinto e não deve ser confundido com Costura de Lavores.

**Tramas e Canalização:** acesso, Puxagem, Tecitura, Expressão, sustentação, Relaxamento, Refluxo, Assinatura, custos expressos e fontes. Os cinco movimentos são categorias conceituais, não cinco testes compulsórios nem cinco botões para gastar cinco ações.

**Selagem:** Diagnóstico, Acesso, Tecitura, Fixação e Resto/Permanência como roteiro assistido, não estágios com DT/Cargas universais. Dependências, componentes, Significância, âncoras, manutenção, estabilidade e ruptura devem ser registráveis quando relevantes à situação.

**Fragmentos:** origem, Assinatura, uso, conservação, suporte e limites; reparo material não implica restauração automática de função ou Assinatura.

**Preparo:** gesto, gatilho, mudança, consumo, estado e relação com a cena. Não dar ação gratuita nem acumular bônus ilimitados.

**Reputação:** Rede, Imagem, Peso, Cobrança, eventos e acesso; o Peso não é Rank nem oferece bônus universal.

## 5.6. Percurso

20 Marcos, 5% e 2 PU reconhecidos por Marco; Desenvolvimento de 0 a 100% e total 40 PU ao final da trajetória. Investimentos registrados com custo canônico e justificativa de incorporação; Matriz e Alinhavo só avançam dentro das permissões. O marco depende de transformação significativa reconhecida pelo Fio~Mestre, não de presença por sessão. Proibir gastos de PU para repetir dado ou recuperar recursos no meio da ação.

**Visual de percurso:** um “fio” editorial com marcos espaçados e acontecimentos associados; não usar árvore de talentos antiga como se fosse o mecanismo normativo. Permitir revelar cada incorporação em uma linha narrativa ligada ao estado atual da ficha.

## 5.7. Registro narrativo, Nexus e auditoria

História rica, sessões, notas pessoais e do grupo, marcas, relações, documentos, imagens, handouts, referências do livro, exportação, impressão e versão histórica. Diferenciar **fato estabelecido**, **hipótese**, **memória subjetiva** e **segredo do mestre**. Alterações importantes devem apresentar origem e data; evitar criar dez relatórios redundantes para a mesma mudança.

---

# 6. VP — VISÃO DE PARTIDA: ESPECIFICAÇÃO DE INTERAÇÃO

## 6.1. Função principal

A VP responde rapidamente: **“O que esta pessoa pode tentar agora? Que relações permitem a ação? Como o Motor resolve a incerteza? O que a Tessitura devolveu e o que precisa continuar registrado?”**

No presencial, a pessoa tem diante de si a prancha A3 e três cartas em destaque. O celular ou notebook deve trazer **profundidade invisível no papel**: texto completo das práticas, regras situacionais, custos, consultas, confirmação de intervenções, registro de consequência e acesso ao Nexus. A VP não deve competir com a ocupação física da mesa.

## 6.2. Composição da VP em desktop/tablet

**Trama de Intervenção** é o núcleo visual central, com dois Fios materializados por linhas distintas que convergem apenas quando existe uma rolagem/resultado. O estado inicial permanece calmo, com ação prioritária **Declarar intervenção** e atalhos **Consultar repertório**, **Registrar Resto**, **Ver cena**.

**Coluna estreita de participação** à esquerda: personagem, vínculo/Âncora relevante, cena e intervenções recentes. Os valores PV/PI/PE podem aparecer como texto de situação na faixa, sem blocos enormes que duplicam a prancha.

**Aba lateral flexível** à direita: dossiê de carta/item ativo, condição consultada, evidência compartilhada ou mensagem do mestre, abrindo apenas quando solicitada.

**Linha de memória** na base: eventos realmente relevantes, revelações e custos pendentes; recolhível para devolver área ao instrumento central.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PERSONAGEM ─ CAMPANHA ─ CENA      [Presencial▼] [Mesa] [Registro] [● salvo] │
├────────────────┬───────────────────────────────────────┬─────────────────────┤
│ PRESENÇA       │     DOIS FIOS / INTERVENÇÃO           │ CONSULTA CONTEXTUAL  │
│ Âncora ativa   │  intenção → abordagem → limiar        │ Carta selecionada    │
│ Vínculo        │     Prumo  ╲        ╱  Tento           │ texto, condição,     │
│ últimos fatos  │       [ resolver / registrar ]        │ preço, fonte         │
│                │  alcance · direção · encontro · resto │                     │
├────────────────┴───────────────────────────────────────┴─────────────────────┤
│ MEMÓRIA DA CENA · último resultado · pendências · Resto [expandir]             │
└──────────────────────────────────────────────────────────────────────────────┘
```

O desenho não obriga três colunas fixas; o módulo lateral pode tornar-se uma folha flutuante e a coluna pessoal pode recolher. Nada de 100% da tela tomado por painéis. A interface pode ter centro ligeiramente deslocado e fios reais conectando ações e consequências; somente conexões com semântica de dado.

## 6.3. Mobile: instrumento na mão do jogador

Composição sob medida, não empilhamento do desktop: **faixa curta com nome/cena/estado**, **um instrumento principal** ocupando a viewport, **dock inferior mínimo** com `Agir`, `Cartas`, `Memória`, `Mais`, e módulos apresentados em **um plano por vez**. `Voltar ao registro` e `Abrir a mesa` precisam ser alcançáveis, mas não disputar espaço com o Motor.

O gesto de abrir uma carta expande um fólio de consulta; confirmar a ação volta ao Motor conservando estado. A rolagem mostra primeiro os dois dados, depois leitura qualitativa/numérica e ações consequentes. Não renderizar cinco caixas de 300px uma sob outra. Sem dependência de hover; todos os controles atingem áreas de toque adequadas.

## 6.4. Fluxo exato de intervenção

**Etapa A — Intento:** permitir ação direta sem teste; quando há incerteza, registrar Intenção, Abordagem, alvo/frente, Ponto em Jogo e risco. Não solicitar todos os campos para uma ação sem consequência durável.

**Etapa B — Preparação contextual:** selecionar Matriz/Alinhavo autorizados, limiar/defesa único, Proveito/Desproveito por Fio com fontes identificadas, auxílio ou operação quando pertinente, Forçar e autorização d20 apenas nas condições do cânone. A VP oferece “de onde vem?” para cada alteração. Repertório, posição e equipamentos podem sugerir **possibilidades**, mas não conceder bônus por semelhança de palavras.

**Etapa C — Confirmação:** o mestre pode aprovar limiar, oposição e permissões quando o protocolo da mesa exigir. Em sessões presenciais, escolha **Rolar no Tadeon** ou **Usei dados físicos: registrar valores**; ambos passam pela mesma leitura matemática, sem rerrolagem para registrar um teste físico. Sem sessão ativa, permitir rascunho/local conforme permissão de ficha.

**Etapa D — Resultado:** mostrar Prumo, Tento, Enlace/DT, margem, Consonância, Ascendente, Retorno e Desvio numa representação integrada e legível. Não derivar dano, Retorno baixo, Refluxo ou benefício crítico extra fora das regras. Dupla unidade prevalece. A animação é confirmação de cálculo, não substituto de texto.

**Etapa E — Consequência:** apresentar escolhas estruturadas conforme o alvo e o evento (recursos, Guarda, condição, Posição, Pressão, equipamento, vínculo, informação, tempo, Costura, Resto), com **confirmação da autoridade competente**. Não aplicar em lote o que não foi consentido; uma consequência principal e exceções expressas. Registrar custos já debitados por ID de evento para impedir pagamentos duplicados.

**Etapa F — Persistência:** somente quando relevante, promover consequência a Resto/Permanência, relacionar cena/entidades, atualizar registros duráveis, notificar quem possui permissão e oferecer conferência física. Não impor um campo “Resto obrigatório” após toda rolagem.

**Etapa G — Próxima possibilidade:** retornar ao modo de ação com novo contexto, sem esquecer rascunhos e sem permitir repetição idêntica do teste até mudança real de situação.

## 6.5. Ações rápidas da VP

- **Consultar Fios:** escolher uma combinação, ver dado resultante, Proveitos por fonte e probabilidade exata como informação (não promessa de sucesso).
- **Auxiliar:** participar por Tento compatível com contribuição concreta; dono da ação e mestre validam; um único par de dados. **Cooperar** conserva ações distintas e seus resultados, sem somar Enlaces indevidamente.
- **Invocar repertório:** abrir carta física por categoria/nome/código de catálogo; ver texto integral, requisitos, preço, estado e duração. Usar Lavor/Trama/Fragmento/Selo conforme permissão, sem criar poder por ter carta.
- **Registrar condição:** origem, efeito, saída e intensidade; painel físico exibe marcador, VP exibe orientação e evento. Aplicar/remove apenas com causa coerente.
- **Âncora e Vínculos:** abrir, sustentar, cobrar, Ancorar, Reassentar; apresentar por que a relação importa e qual mudança ficará registrada.
- **Recuperar:** pausa, repouso ou recuperação plena conforme janela real; não repetir janela, exigir requisitos; distinguir recomposição física de reconstrução de Inteireza.
- **Integridade/Preparo:** uso de ferramenta, consumo, quebra, reparo parcial, gatilhos do preparo e custo declarado.
- **Intervenções de Mestre recebidas:** aceitar/revisar resultado, não preencher dados secretos; estado de solicitação pendente, concluída ou recusada sem suspense falso.
- **Memória e notas:** anotação breve, evidência vinculada, decisão importante, Resto pendente, observação do personagem.
- **Consulta imediata:** regra exata e referência no livro; conteúdo do Nexus com permissões e remissão por conceito.

## 6.6. Estados visuais mínimos da VP

`livre`, `declarando`, `aguardando_mestre`, `pronta_para_resolver`, `resolvendo`, `resultado_pendente`, `consequencia_aplicada`, `falha_concorrente`, `offline_rascunho`, `em_sincronizacao`, `somente_leitura` e `personagem_incompleto`. Cada estado tem controle acionável claro, sem tela vazia ou spinner infinito. Sucesso visual nunca é exibido antes da confirmação de persistência.

## 6.7. Cartas e repertório híbrido

O Tadeon registra cartas físicas por **tipo de conteúdo**, código opcional, edição, fonte normativa, título, descrição, condições, efeito, limites e referência ao registro da personagem. O catálogo digital não presume que modelos de papel tenham campos mecânicos idênticos: uma carta de Local pode ser puramente narrativa; uma carta de Trama pode possuir operação contextual.

**Seleção física** significa “o jogador colocou esta carta no nicho”, registrada digitalmente apenas se solicitado. Não inventar sensores nem obrigar a digitar um código a cada carta. Se houver futura impressão coordenada por identificadores, gerar o código de maneira opcional e editável, sem dependência de QR.

Na VP, o repertório deve abrir **por intenção de uso**: ação agora, preparo, sustentação, referência, item/estado, e por tipo. Buscas rápidas, favoritos **apenas de apresentação**, recentes e filtros não alteram a ficha canônica. Uma carta física antiga pode ter revisão normativa posterior: sinalizar edição e oferecer comparação, nunca atualizar texto/custo impresso silenciosamente.

---

# 7. MESA NEXUS — PALCO, SITUAÇÃO E CONTINUIDADE

## 7.1. Três formas de condução com a mesma cena

- **Presencial:** superfície A3 física pode ser palco primário; Mesa digital fornece imagens, mapas especiais, arquivos, referências e registro opcional. Não obrigar cada jogador a mover um token digital para realizar movimento físico.
- **Híbrida:** palco digital ou físico intercambiável; apresentar mudanças observáveis de forma explícita; compartilhamento de handouts, informações e intervenções digitais sem exigir que todos usem VP a cada turno.
- **Online:** Mesa digital primária com presença, token, câmera, 2D/isometria/3D, fog, camadas, rolagens, decisões, instrumentos e estado público autorizado.

## 7.2. Preservação funcional detalhada

Conservar criação/edição de cenas, campanhas, snapshots, restauração, histórico de geometria, camadas visíveis/ocultas e do mestre, entidades, tokens, links a fichas e Nexus, seleção/multisseleção, arraste, alinhamento, transformações, rotação, escala, desenho, medições, régua, pings, anotações, paredes, portas/portas secretas, obstruções, névoa de guerra por audiência, iluminação, regiões e gatilhos, múltiplos níveis/andares, câmera, projeções 2D/3D/isométricas, modelos nativos, mídia animada quando autorizada, áudio posicional existente, biblioteca de Assets, paletas, atalhos, menus radiais, handouts, salas, presença, permissões, reconexão, salvamento e edição de geometrias. Reorganização de toolbar não constitui autorização para remover recursos.

## 7.3. Mecânica contextual na Mesa

**Seleção de jogador:** mostrar ficha resumida permitida, recursos e condições, interação `Abrir VP`, `Declarar intervenção`, `Consultar carta`, `Registrar movimento` e `Ver informação pública`. A perspectiva do mestre possui inspector completo e propriedades reservadas.

**Objeto e região:** Posição não equivale a coordenada. Uma pessoa pode estar fisicamente perto e ainda Exposta em relação a uma ameaça. A cena pode registrar relação `personagem ↔ frente` e não apenas `token.x/y`. Regiões podem conter Pressão, gatilho, objetivo ou pistas, mas só se houver motivo ficcional.

**Situação:** objetivo, posição relativa por participante/frente, fontes de Pressão, urgência e condições de término. Registrar causalidade de alteração de Pressão e a Ruptura da frente; não avançar contador por toda falha.

**Rodada:** dois Impulsos, uma Resposta, iniciativa contextual Cadência + Iniciativa quando disputada; resposta ativa antes da consequência. Mostrar contadores aos participantes autorizados e reconciliar com físico. Não permitir consumo duplo sob concorrência.

**Repertórios e geometrias:** visualizar alcance, região ou trajetória de expressão quando a carta realmente define área; não inferir geometria de uma Trama por palavras genéricas. Preservar ferramentas táticas legadas como **projeção**, não considerar seu antigo cálculo autoridade mecânica TdV II.

**Consequências:** alterar ou criar condição/estado de recurso, objeto, posição ou relação após validação; uma alteração confirmada aparece na VP, na ficha e no cartão público de entidade quando apropriado.

**Handouts:** um documento revelado pode ser aberto pelo jogador e receber link para o mapa de hipóteses sem revelar metadados de mestre. Compartilhar evidência não revela automaticamente sua “camada profunda”.

## 7.4. Direção visual da Mesa

A cena é protagonista; chrome com vidro e instrumento, tecido em bordas/contexto, nada de textura animada sobre mapa e coordenadas. Dock de ações contextual, recolhível, com organização por `Cena`, `Manipular`, `Revelar`, `Conduzir`, `Inserir` — conforme papel e seleção. No desktop, editor lateral se houver largura; no mobile, ferramentas em camadas/painéis temporários e palco visível. Modo “tela limpa” não pode retirar acesso às ferramentas, apenas ocultar temporariamente chrome com recuperação clara.

---

# 8. PAINEL DO FIO~MESTRE — DIREÇÃO, NÃO FORMULÁRIO

## 8.1. Composição de condução

**Cena Agora** ocupa o centro operacional quando há sessão; no topo, campanha, cena, sessão, conexão, estado salvo e comandos mínimos. Em uma faixa lateral aparecem participantes, Posição/Impulsos/Resposta; em outra, Pressões, objetivos, oposição, urgência e notas reservadas. O Mestre rearranja janelas por presets sem perder o último layout; não reproduzir as mesmas colunas verticalmente no celular.

**Dois ritmos:** `Preparar` (cenas, NPCs, eventos, materiais, pistas, campanhas, relações, pré-visualizações) e `Conduzir` (abertura, rodada, revelação, resolução, consequências, pausa, encerramento). Ferramentas globais continuam acessíveis em ambos.

## 8.2. Inventário funcional obrigatório

- Campanhas, cenas, agenda/sequência, anotações, histórico, snapshots e sessão ao vivo.
- Elenco, fichas, atribuição de jogadores, permissões, participação, iniciativa manual e disputada; edição e visualização do estado sem exigir abrir uma ficha por ação.
- Figurantes/Adversários/Ameaças, inventário de presenças, vinculação à cena, Magnitude 0–4 sem bônus automático, intenção, capacidades, defesa, Guarda/recursos quando necessários, ação característica, dependência, vulnerabilidade, custo, modo de agir e condição de término.
- Frente de Pressão 0–4 com Fonte/Objeto/Escalada/Ruptura, causa e histórico; Compasso de Urgência separado, escolhido no intervalo 3–8; Posição individual frente a oposição específica.
- Conflito e leitura de oposição, aplicação física, condições, Guarda, 0 PV, 0 PI, 0 PE, recuperação, Redobra e decisões de consequência.
- Operações prolongadas, cooperação, Costura, expressões, Canalização, Selagem e sustentação; roteiro assistido sem etapas rígidas e sem tabelas fictícias.
- Investigação: pergunta, hipótese, contradição, pistas fundamentais, pistas aprofundadas, testemunhas, relações e próxima intervenção; desbloqueio de pista coerente por acesso, não por uma rolagem mandatória.
- Dobras, lugares, artefatos, Selos, Fragmentos, mundo, bibliografia de regras, Nexus, handouts, bibliotecas, arquivos, mapas e materiais de impressão.
- Interlúdios e recuperação, retomada de sessão, registros de Resíduo/Resto e preparação do próximo arco.
- Concessão de Marco do Desenvolvimento somente por autoridade do Mestre com incorporação e justificativa, acompanhado do saldo de PU.
- Observação, notificações, convidados, exportação, backups, revisões e auditoria de ações.

## 8.3. Modelagem específica das Ameaças

**Figurante** abre formulário pequeno: intenção, capacidade, consequência e presença. **Adversário** expande defesa, ação característica, estados pertinentes e eventual repertório. **Ameaça** abre dossiê com Identidade, Magnitude, Intenção, Ação, Defesa, Consequência, Dependência/Vulnerabilidade, além de Costuras e Pressões relacionadas. Uma entidade não ganha ficha humana completa por padronização de UI.

**Não usar o balanço antigo** de Rank médio e Magnitude somada como cálculo canônico da edição II. Se preservado por compatibilidade, rotular `edição anterior` e ocultar do planejamento II. O novo planejamento visualiza três eixos descritivos: capacidade de oposição, pressão de continuidade e complexidade de resolução, sempre com possibilidades de abordagem não bélicas.

## 8.4. Investigação e Teia

Painel privado tem evidências, fatos confirmados, contradições, hipótese, profundidade, gatilho de revelação e audiência. Jogador vê apenas o subconjunto revelado e suas próprias notas. Relações do jogador podem ser hipóteses erradas; não promover uma linha desenhada em fato de cânone. Permitir vincular documentos, locais, personagens, cenas, marcas e mudanças persistentes.

## 8.5. Encerramento: revisão de continuidade

Ao encerrar cena/sessão, revisar alterações de ficha aplicadas, custos pendentes, condições, trilhas, objetos, revelações, Vínculos pressionados, Âncora Abalada, Marcas, Restos, Permanências, investimentos elegíveis e ganchos futuros. Exibir **o que mudou e por quê**, não exigir preenchimento ritual de dezenas de itens. Gerar síntese editável, com escopos `pessoal`, `grupo` e `mestre`; publicar depois da confirmação, sem revelar spoilers.

---

# 9. NEXUS — ACERVO, TEIA, CONHECIMENTO E MEMÓRIA

O Nexus não é somente wiki de consulta. É a memória relacional que permite uma consequência de hoje tornar-se condição da próxima sessão. Preservar páginas, coleções, pastas, busca, grafo, relações, versões, importações, exportações e os vínculos já estabelecidos a fichas e Mesa.

**Distinguir naturezas de conhecimento**: (a) texto normativo publicado, (b) cosmologia canônica, (c) documento diegético ou testemunho, (d) hipótese de personagem, (e) verdade privada do Mestre, (f) improviso/proposta ainda não confirmada. Um grafo pode mostrar semelhança ou dependência, mas nunca provar ontologia por proximidade visual.

**Páginas contextuais**: pessoa, facção, local, objeto, Lavor, Trama, Fragmento, Selo, evento, pista, cena, campanha, marco. Cada página expõe campos apenas quando pertinentes. Relações com fichas e cena são bidirecionais por identificação, mas leitura tem RLS e escopo explícito.

**Linha de acontecimentos**: registro curto do evento, alteração autorizada, origem, audiência e relação com outras ocorrências. Permanência só existe quando aceita/confirmada; decisões sem Resto não produzem entrada artificial.

**Consultas durante sessão**: abertura rápida em folha/overlay sem navegar para fora da VP/Mesa; fonte, edição, trecho e nota de aplicação. O conteúdo integral do livro continua no acervo com suas licenças e autorias.

---

# 10. SISTEMA VISUAL — TESSITURA COMO COMPOSIÇÃO

## 10.1. Princípios de direção

- **Precisão + irregularidade intencional:** cada desvio do grid responde a uma relação, foco, risco ou descoberta; não espalhar blocos em posições arbitrárias sob o rótulo de organicidade.
- **Densidade modulada:** tela de Registro suporta prosa, atlas e diagramas; VP concentra instrumento e ação; Mesa preserva palco; Mestre combina monitor operacional e dossiês.
- **Superfícies com função:** marfim para leitura e documento; Vazio para estrutura e foco; tinta para texto técnico; vidro discreto apenas onde sugere instrumento sobre palco; materialidade de tecido/metal/papel contida, nunca ruído.
- **Estruturas diferentes para informações diferentes:** radar não é uma lista; Vínculos não são tabela de bônus; Marcos não são XP; Resto não é galeria de cartões; cartas têm proporção e hierarquia próprias.
- **Fios com procedência e destino:** origem → percurso → encontro → consequência → continuidade. Não usar linhas arbitrárias apenas para enfeitar bordas.

## 10.2. Paleta normativa, sem invenção

`Vazio #080A0E`, `Reflexo #E9E3D5`, `Tinta #22262D`, `Medo #74242D`, `Conhecimento #D9D7A4`, `Tempo #4F6E5D` são referências confirmadas nos materiais consultados. O Work deverá extrair os demais tokens diretamente do Fio~Mestre e do CSS existente; não inferir a cor oficial de Regências ou transformar Medo/Conhecimento em “ruim/bom”. Cor é reforço, sempre com texto/forma.

**Símbolo-mestre:** nunca recriar por CSS, Font Awesome ou SVG inventado; usar ativo oficial. Orientação institucional confirmada no manual: Medo acima à esquerda, Conhecimento abaixo à esquerda, Tempo à direita. Naturezas primordiais são três; Regências Extensão/Devir/Consistência não exigem três linhas institucionais novas.

## 10.3. Tipografia

Preservar e aperfeiçoar famílias e implementações do site (atualmente há tipografia expressiva Cormorant/Alegreya e infraestrutura de fontes locais) em alinhamento ao cânone, sem trocar toda a aplicação por `Arial`, sem aplicar fonte ornamental a valores técnicos. Para materiais editoriais, Fio~Mestre discrimina EB Garamond, Inter e PT Mono. Definir papéis (`display`, `leitura`, `interface`, `dados`, `arquivo`) e testar legibilidade real no celular. Metadados e números precisam de alinhamento tabular, bom contraste e densidade.

## 10.4. Matriz compositiva por área

| Ambiente | Metáfora útil | Composição | Evitar |
|---|---|---|---|
| Ficha Integral | atlas pessoal | assimetria documental, instrumentos e folios | único grid interminável de cards |
| VP | mesa de intervenção | dois Fios como instrumento central, consulta lateral e rastro inferior | copiar a prancha A3 e criar painel de combate genérico |
| Mesa | palco com instrumentos | cena ocupa quase tudo; chrome translúcido, dock contextual | ferramenta permanente cobrindo mapa |
| Mestre | bancada de direção | múltiplos planos, estados e janelas organizáveis | colunas gigantes com formulário por assunto |
| Nexus | arquivo e teia | biblioteca + leitura + grafo com relações legíveis | grafo caótico e ligações decorativas |

## 10.5. Motion semântico

**Tensão:** linha se aproxima da dependência real; **Dobra:** inflexão de percurso que abre detalhe; **Ancoragem:** consolidação após confirmação; **Revérbero:** eco breve de alteração persistida. Referências de duração do manual: microinterações ~160–280 ms, transições de contexto ~300–550 ms. Não aplicar o mesmo movimento a todos os elementos; reduzir ou eliminar em `prefers-reduced-motion`; priorizar transform/opacity, evitar filtros caros e renderização de centenas de nós.

Uma Consonância pode aproximar visualmente os fios quando há valores iguais, mas não sugerir triunfo automático; Desvio pode ser diferença geométrica orientada, sem exagero. Um Resto só é desenhado persistente se houver evento durável real. Não animar textura sobre informações críticas.

---

# 11. CONTRATOS DE ESTADO, DOMÍNIO E PERSISTÊNCIA

## 11.1. Autoridades existentes a preservar

`src/lib/tdv2.ts` para constituição, leitura dos Fios, recursos e validações; `src/lib/tdv2-play.ts` para procedimentos; `src/lib/tdv2-master.ts` e `tdv2-operations.ts` para condução. O schema `tdv2_data` permanece autoridade do personagem; `tdv2_state` conserva condução privada enquanto não houver migração gradual. Mesa usa Scene/Entities/LiveSession e suas permissões. A proposta adiciona **orquestração de acontecimentos**, não outro motor de regras.

## 11.2. Envelope de acontecimento (novo, conceitual)

```ts
interface TdvOccurrence {
  id: string; // UUID, usado para idempotência
  campaignId: string;
  sessionId?: string;
  sceneId?: string;
  actorId: string; // usuário autorizado
  subjectIds: string[]; // entidades com IDs estáveis
  kind: string; // valor enumerado e versionado
  intent?: string;
  sourceRefs: string[]; // carta, regra, objeto, ficha ou evidência
  visibility: 'private' | 'master' | 'party' | 'selected';
  stage: 'draft' | 'proposed' | 'approved' | 'applied' | 'rejected';
  proposedChanges: unknown; // DTO discriminado, validado no servidor
  appliedChanges?: unknown; // snapshot/delta confirmado
  beforeRevision: Record<string, number>;
  occurredAt: string;
  approvedBy?: string;
  reason?: string;
}
```

Esse envelope **não** autoriza persistir objetos arbitrários. O Work deve desenhar DTOs tipados discriminados, sanitização por categoria, validação contra regras/recursos, limites de tamanho, escrita transacional e políticas RLS. Tipos de evento iniciais: `test.resolved`, `cost.paid`, `resource.changed`, `condition.changed`, `position.changed`, `pressure.changed`, `link.changed`, `anchor.changed`, `expression.changed`, `item.changed`, `clue.revealed`, `rest.recorded`, `milestone.recognized`, `physical.reconciled`.

## 11.3. Estados e vistas

- **Ficha Integral** lê o estado durável autorizado e edita rascunhos com CAS/revisão. Não escreve em um campo duplicado de VP.
- **VP** deriva sua consulta do estado da ficha e da sessão. Alterações ficam pendentes ou confirmadas; rascunhos não são transmitidos como sucesso.
- **Mesa pública** recebe projeção estritamente autorizada por ator/audiência. Camadas privadas, segredos de ameaça, histórico secreto, hipóteses e dados pessoais nunca entram no payload do jogador.
- **Mestre** mantém autoridade sobre cena, condições de acesso, reconhecimento de Marcos, revelações, consequências reservadas e alterações da oposição.
- **Nexus** vincula identificadores estáveis e recebe somente fatos publicados/aprovados.
- **Físico** é estado observado por pessoa, nunca fonte com atualização automática presumida; reconciliação é evento humano explícito.

## 11.4. Concorrência e baixa conectividade

- Debitar recurso, consumir Impulso, aplicar consequência e publicar evento de maneira idempotente. Se dependem da mesma ação, preferir transação servidor atômica e revisão esperada.
- Duas abas ou dispositivos não podem consumir duas vezes um custo ou sobrescrever ficha silenciosamente. Em conflito, mostrar diferenças (valor remoto x rascunho) e ações seguras, nunca `last write wins` para recursos críticos.
- Ações offline de consulta funcionam com cache autorizado; modificações offline viram rascunhos explicitamente **não aplicados**. Operações sensíveis dependentes de estado de rodada e aprovações não devem ser simuladas como sucesso no servidor.
- Manter backup de payload anterior, logs de migração e restore ensaiado, não apenas exportação serializada. Respeitar chave de sessão, escopo de usuário e acesso de campanha.
- Mudanças realizadas sobre uma ficha continuam exibindo status `salvando/salvo/pendente/erro/conflito`, com retentativa segura e proteção contra navegação.

## 11.5. Permissões mínimas

| Operação | Dono da ficha | Membro do grupo | Fio~Mestre | Visitante/Observador |
|---|---|---|---|---|
| Ler ficha própria autorizada | sim | conforme compartilhamento | conforme campanha/permissão | somente projeção permitida |
| Editar Feição, inventário, notas | sim, sujeito a bloqueios de campanha | não por padrão | conforme função administrativa | não |
| Propor ação e custos | sim | sua personagem | sim | não |
| Alterar recurso alheio/consequência de cena | por fluxo validado | não diretamente | autoridade de cena | não |
| Revelar pista reservada / aprovar Marco | não | não | sim | não |
| Ver segredos e notas privadas do mestre | não | não | sim | não |
| Revisar diferenças da prancha física | dono, sujeita a validação | não por padrão | conferir/validar | não |

A matriz é especificação mínima de intenção; implementar conforme RLS real, sem supor que o front-end impõe segurança. O usuário que controla a própria ficha pode pedir alteração que exija autorização da campanha; nem todo clique vira aplicação irrevogável.

---

# 12. CICLOS DE USO E CENÁRIOS DE PONTA A PONTA

## 12.1. Sessão presencial com kit

O jogador abre a VP, escolhe `Presencial`, mantém a prancha A3 sobre a mesa. A mestre apresenta uma cena física e uma carta de Lavor. O jogador consulta a carta no VP, declara intervenção verbalmente, o mestre informa a dificuldade, dois dados físicos são rolados, e o usuário **registra valores**. O site lê o Motor, mas só executa alterações após confirmação da consequência. Na prancha o jogador ajusta PV/Impulsos; na VP fica o registro do acontecimento. Ao terminar a sessão, o **Acerto de Continuidade** confronta estado digital com a prancha e preserva alterações duráveis.

## 12.2. Sessão online

O mestre publica a cena no mapa. Um jogador seleciona token próprio, abre VP embutida e faz a declaração. O mestre confirma limiar; o Motor resolve, custos são deduzidos uma vez, a consequência é aplicada ao alvo, a Mesa recebe somente a projeção pública, e o Nexus registra Resto apenas se aprovado. Outro jogador conectado vê a mudança sem abrir a ficha confidencial.

## 12.3. Investigação híbrida

A mesa revela documento com imagem; os jogadores anotam hipóteses na Teia A4 e/ou Nexus. Uma pista fundamental acessível é entregue sem travar por dado. O mestre mantém a camada profunda reservada. Uma hipótese errada continua existindo como proposta do jogador e não vira fato canônico. Quando uma relação é confirmada, pode abrir novo meio de intervenção.

## 12.4. Colapso e Marca

Evento reduz PI a zero, aciona protocolo de Colapso e exige consequência significativa definida com o mestre; a ficha registra alteração de Marca/Feição ou novo estado pertinente. VP mostra consulta ao procedimento e o Resto. A Mesa mostra somente condições públicas cabíveis, sem diagnóstico automático nem texto privado da Marca. A prancha recebe o marcador físico correspondente.

## 12.5. Selagem e Trama sustentada

O mestre abre operação, participantes conectam fragmento, acesso e suporte; a VP consulta a Trama e seus custos; apenas testes que existam de fato são rolados. Sustentação cobra custo na janela devida uma vez; no Relaxamento, escolha coerente de Resto ou Refluxo sem tabela universal inventada. O Selo permanece vinculado a local/dependências e aparece em futuras sessões quando relevante.

---

# 13. IMPLEMENTAÇÃO EM FASES — SEM PERDER O PRODUTO ANTERIOR

## Fase 0 — Inventário e prova de base

Catalogar rotas, componentes, schemas, permissões, testes, CSS, ferramentas de Mesa/VP/Mestre e assets visuais; fotografar capturas desktop/mobile do produto existente, incluir abas com rolagens, dossiês de fichas antigas, Mesa 2D/3D, painel, Nexus, permissões e arquivo. Criar matriz `recurso -> proprietário -> dados -> edição -> acesso -> testes -> destino`. **Aceite:** nenhum elemento existente fica sem destino; backup verificado; snapshot do schema, migrações e dados antes da obra.

## Fase 1 — Domínio e compatibilidade

Separar claramente rotas v1/v2; migração aditiva com entidades de evento, DTOs, CAS/idempotência e visibilidade; nenhuma escrita em massa nas fichas antigas. Reutilizar motor canônico. Testar transação e conflitos. **Aceite:** nenhuma vantagem de Rank/PM/CP legados interfere no II, custo único por evento, gravações concorrentes protegidas, RLS exercitada.

## Fase 2 — Ficha Integral

Recompor sistema editorial, preservar dados e editores; configurar índice, Matrizes, 21 Alinhavos, recursos, Vínculos, Âncora, recuperação, expressão, inventário, descrição e Percurso; instrumentos responsivos e estados especiais. **Aceite:** personagem criado, editado, salvo, recarregado, migrado e exportado sem perda; todos os procedimentos acessíveis no desktop e celular.

## Fase 3 — VP e contrato físico

Nova rota e CTA VP para TdV II, sem apagar Forma de Poder antiga; perfis presencial/híbrido/digital; núcleo dos Fios, cartas de consulta, procedimentos, ações com resultados físicos/digitais, memória e Acerto de Continuidade. **Aceite:** sessão presencial com prancha não exige preencher tudo duas vezes e a VP digital funciona integralmente sem kit.

## Fase 4 — Mesa + Fio~Mestre integrados

Integração bidirecional, ações contextuais, contadores de rodada com autorização, consequências transacionais, operação privada/pública, pings, visibilidade, investigação, ameaças e sínteses. **Aceite:** fluxos online e híbridos sem divergência após reconexão, sem perda de ferramenta antiga, sem vazamento de segredo.

## Fase 5 — Nexus, memória e acabamento

Ligações bidirecionais reais; catálogo, grafo, timeline, publicação do Resto; aplicar diretrizes Fio~Mestre a todos os módulos; motion, tipografia, responsividade, desempenho e acessibilidade. **Aceite:** uma consequência percorrendo Ficha → VP → Mesa → Mestre → Nexus com versões/revisões, identidade coesa e dispositivos reais validados.

## Fase 6 — Auditoria de regressão e publicação

Build/lint/typecheck/testes; testes de navegador em larguras relevantes e celular real, roda “Mais”, focos, menus, popovers, drag/drop e mesa ao vivo; migração no banco correto e verificação publicada no domínio real; restore; revisão de dependências, custo zero e segurança. **Aceite:** evidências de publicação, relatório claro de limitações, rollback pronto e checklist assinado. Não chamar `CI green` de equivalência com sessão real.

---

# 14. CRITÉRIOS DE ACEITAÇÃO E TESTES OBRIGATÓRIOS

### Integridade canônica

- [ ] Duas fichas equivalentes resultam nos mesmos dados e leituras em Registro, VP e Mesa.
- [ ] Proveito/Desproveito, Forçar, d12→d20 e Forçar a 0 PE seguem exatamente o livro; nenhum valor é inventado.
- [ ] Dupla unidade, Consonância, Desvio, Ascendente/Retorno e margens preservam condições de leitura.
- [ ] Sem incerteza relevante, não se exige teste.
- [ ] Repetição idêntica é bloqueada até mudança real de situação; Redobra não reescreve dados antigos.
- [ ] Auxílio usa Prumo protagonista e Tento do auxiliar, sem terceiro dado; Cooperação mantém resultados distintos.
- [ ] Posição não concede bônus universal; Pressão não aumenta a cada falha; Urgência tem compasso independente.
- [ ] Equipamento sem proteção expressa não concede RD; Guarda Quebrada e cobertura total seguem o sistema.
- [ ] 0 PV/0 PI/0 PE, Âncora Abalada e Matriz Abalada não geram procedimentos caseiros.
- [ ] Recuperação é limitada por janelas reais, sem repetir custo ou benefício.
- [ ] Desenvolvimento concede 5%/2 PU por Marco com autorização; nenhum PU usado como recurso de ação.

### Kit físico e modos de uso

- [ ] VP presencial não recria uma segunda prancha A3 com recursos gigantes.
- [ ] Repertório consulta carta física 63×88 por nome/categoria, sem obrigar scan ou código.
- [ ] Registro de rolagem física lê dados fornecidos sem rerrolar; digital usa o mesmo Motor.
- [ ] Diferença entre prancha e estado digital exige reconciliação explícita, sem falsa atualização automática.
- [ ] O modo online continua completo quando o jogador não possui material físico.
- [ ] Forma de Poder legada abre em modo de arquivo e seus dados permanecem intactos.

### Produto, segurança e dados

- [ ] Todos os controles antigos de Mesa, Mestre, Ficha e Nexus são mapeados e não desapareceram.
- [ ] Dois dispositivos alterando um recurso concorrente produzem resolução segura, não perda silenciosa.
- [ ] Um pagamento ou gasto de Impulso recebe ID único e nunca é aplicado duas vezes.
- [ ] Jogadores não recebem pistas secretas em resposta JSON nem campos ocultos por CSS.
- [ ] Há foco de teclado, texto alternativo, reduzir movimento e experiência completa de toque.
- [ ] Mobile não é página de cartões gigantes empilhados; palco, Motor e consulta mantêm a hierarquia.
- [ ] A ficha exportada/importada conserva IDs, descrições, inventário e relações; backup real foi restaurado em ambiente de teste.
- [ ] O build publicado é confirmado no domínio de produção e corresponde ao commit aprovado.

---

# 15. INSTRUÇÃO DE TRABALHO PARA O WORK

1. Leia integralmente este documento, os três volumes normativos e os PDFs do kit físico. Leia `AGENTS.md`, `docs/PROJECT_MAP.md`, `docs/tdv-ii-coverage.md`, `docs/tdv-ii-migration.md` e o código real. Não parta do pressuposto de que documentação antiga equivale ao estado atual.
2. Faça auditoria antes de alterar: matriz de funcionalidades existentes por rota/componente, riscos de regressão, dados e políticas. Identifique conflitos de nomes — particularmente a VP antiga (`Versão de Poder`) versus a nova (`Visão de Partida`).
3. Divida em fases controladas e implante sem remoções. Em cada fase, entregue código funcional, design, testes, persistência, controle de versões e evidências visuais.
4. Não aplique mecanismos que não constem no Livro II. A Urdidura fundamenta ontologia; o Fio~Mestre fundamenta direção visual; o kit físico fundamenta complementaridade. Não misture as três ordens.
5. Nunca conclua uma fase afirmando apenas que o código foi criado; mostre validação no domínio publicado, testes de dispositivos, segurança e preservação de recursos.
6. Antes de criar qualquer componente novo, procure ferramenta equivalente já existente. Reutilize/integre, preservando sua função original. Não simplifique a Mesa retirando painéis e não substitua a ficha por formulário minimalista.
7. Trabalhe com linguagem visual **autoral** e composição orgânica de causa explícita. Faça revisão de hierarquia, contraste, densidade, performance, motion e acessibilidade em cada página. A experiência deve parecer um instrumento de TdV, não um dashboard com temas de fantasia.

**Definição de pronto:** o Tadeon deixa de depender de cópia manual entre Ficha, VP, Mestre, Mesa e Nexus para acontecimentos digitais confirmados; continua operando perfeitamente com o kit físico sem duplicação visual; mantém integralmente recursos anteriores; e permite concluir uma sessão presencial, híbrida ou online com registros consistentes, claros e seguros.

---

# PARTE II — DIREÇÃO EXECUTIVA DE EXPERIÊNCIA, DESIGN E IMPLEMENTAÇÃO · NOVA NA V2

> A Parte I estabelece a arquitetura, as funções e as regras de preservação. A Parte II transforma essas obrigações em **especificações de composição, comportamento, materialidade, hierarquia, estados, microinterações e fluxos executáveis**. Em divergência, prevalecem os livros canônicos para a mecânica e as decisões da V2 para a apresentação, desde que não reduzam dados, permissões ou ferramentas existentes. Todos os diagramas são esquemas de relações e não templates a serem copiados literalmente.

# 16. ESTÉTICA SISTÊMICA — O QUE FAZ O TADEON PARECER TADEON

## 16.1. Direção: “arquivo vivo, instrumento de Tessitura, palco de consequências”

A estética deve comunicar três ordens de experiência simultaneamente: **matéria** (suportes físicos, fibras, papel, metal e vidro), **relação** (fios que conectam funções e acontecimentos reais) e **tempo** (o presente deixando resíduos, versões e marcas). O projeto não é um site de fantasia medieval com texturas de pergaminho, nem uma dashboard futurista com linhas neon. É um **objeto editorial de ciência estranha e ofício antigo**, operado com a precisão de software contemporâneo.

A forma nasce da função: uma ficha de personagem pode ter estrutura de códice, mas seus controles precisam ter a eficiência de uma aplicação profissional; uma Mesa pode ter tecido e filamentos na moldura, mas a geometria, os tokens e os números precisam permanecer nítidos; um Nexus pode usar composições de teia, mas suas conexões devem representar relações persistidas. **O luxo visual vem de composição, contraste, ritmo, detalhe e intenção — não da quantidade de enfeites.**

### Cinco famílias compositivas (não cinco conjuntos de cards)

| Família | Matéria e anatomia | Uso legitimado | Variações que impedem repetição |
|---|---|---|---|
| **Fólio** | superfície de papel ou marfim, numeração, capitular/editorial, margem anotável, linhas finas de registro | história, Feição, documentos, fichas de condição, sessões | fólio estreito, fólio duplo, folha com nota marginal, folha com retrato rasgado por recorte de diagrama |
| **Instrumento** | vidro mineral pontual, metal fosco, escala gravada, ponteiro, marcação precisa | Motor, Matriz, Equilíbrio, Tensão, Pressão, compasso, iniciativa | escala linear, arco incompleto, par de eixos, ponteiros deslocados, instrumento radial quando sem perda de leitura |
| **Trama** | filamentos orientados que partem de nós reais, cruzamentos, profundidade discreta | Vínculos, Âncora, processos, eventos, operações, Nexus | linhas curvas, retas interrompidas, croquis de dependência, fios com nós e inscrições, teias agrupadas |
| **Lâmina** | plano compacto, recorte firme, tipografia funcional, feedback táctil | ações rápidas, filtros, seleção, pequenas confirmações | ação com borda fechada, aba inserida, seletor deslizante, ficha lateral, menu contextual sustentado |
| **Palco** | área livre dominante, bordas instrumentais, projeção, câmera, camadas | Mesa e visualização espacial | mapa tático, palco abstrato Foco/Oposição/Passagem/Resto, visualização 3D/isométrica, modo cinema |

**Restrição artística:** nunca distribuir as cinco famílias uniformemente numa tela como mosaico; cada página precisa de um **gesto dominante** próprio. Variação sem justificativa é desordem; repetição por conveniência é template.

## 16.2. Paleta completa, regimes e semântica

Extrair a totalidade do Fio~Mestre, preservando: Vazio `#080A0E`, Reflexo `#E9E3D5`, Tinta `#22262D`, Véu `#716B7B`, Metal neutro `#7A8187`, Papel `#F5F0E7`, Medo `#74242D`, Conhecimento `#D9D7A4`, Gelo `#F2EEC8`, Tempo `#4F6E5D` e Pátina `#2D493E`. Esses são **tokens canônicos de referência**, não convite para saturar toda interface. **Contraste WCAG deve ser calculado para cada combinação real**; não assumir que uma cor bonita tenha contraste suficiente para corpo de texto.

- **Regime Vazio:** ambiente de trabalho e sessão; Vazio em fundo; contorno Metal neutro muito atenuado; texto Reflexo; saliências iluminadas por superfície e não por glow. Usar na VP e nas bancadas, quando apropriado.
- **Regime Fólio:** leitura, histórico, edição longa; Papel e Reflexo como superfícies; Tinta no conteúdo; numeração e guias em Metal neutro. Usar na Ficha Integral e documentos.
- **Regime Umbral:** coexistência controlada de fundo Vazio com uma folha editorial; adequado a dossiês, encadeamentos e notas do Mestre. A transição deve ocorrer por recortes e sobreposição plausível, não por degradê genérico.
- **Naturezas:** Medo, Conhecimento e Tempo não são equivalentes a dano/benefício/neutralidade nem a erro/sucesso/pendente. Quando usados como voz da marca, manter sua função simbólica. Para estados de produto (erro, sucesso, atenção), criar tokens acessíveis separados e semanticamente neutros; evitar chamar um erro de “Medo”.
- **Regências:** Extensão, Devir e Consistência não recebem falsas cores institucionais ou marcas próprias obrigatórias. Uma entidade ficcional só assume o código correspondente quando sua fonte e identidade o justificam.

**Textura:** fibra e granulação ficam na amplitude de fundo e no entorno de fólio; jamais sobre valores técnicos, campos editáveis, rolagens ou mapa. Preferir detalhes vetoriais em SVG minificados e elementos CSS estáticos; evitar canvases de partículas contínuas em todas as páginas.

## 16.3. Tipografia como uma partitura

O Fio~Mestre fundamenta tipografia editorial (EB Garamond), uso técnico contemporâneo (Inter) e linguagem de dados (PT Mono); o site tem famílias expressivas próprias cuja continuidade também merece inspeção. **Não substituí-las em massa antes de auditar licenças, fontes já carregadas, peso, performance e alinhamento ao manual.**

Papéis tipográficos:

1. **Voz:** títulos raros, nomes de personagens e denominações do universo; serifada expressiva, contraste alto, poucas palavras. Letras com personalidade, não todas em caixa-alta.
2. **Narrativa:** história, Feição, texto de carta, dossiês, descrições; serifada editorial, altura de linha confortável, largura de leitura controlada, negrito discreto e itálico com parcimônia.
3. **Operação:** botões, campos, filtros, legenda, alertas e comandos; sans de alta legibilidade, títulos de seção relativamente pequenos e coerentes.
4. **Medida:** dados, modificadores, índices, custos, revisão, timestamps e versões; monoespaçada ou números tabulares, sinal e unidade sempre legíveis.
5. **Inscrição:** números de fólio, identificadores de capítulos, linhas de referência e marcas de arquivo; microtipografia com contraste e tamanho adequados, nunca exclusivamente decorativa.

**Escala de referência a testar**: nome principal 28–42px desktop/22–28px mobile, título de sessão 20–26/18–22, título de seção 17–21/16–19, texto narrativo 15–18/15–17, texto funcional 13–15/14–16, valores técnicos 15–26 conforme foco, metadados úteis nunca menores que 12px. Tamanhos efetivos dependem da família escolhida e da densidade do dispositivo. Não fazer `font-size: 10px` para encaixar uma ação.

**Ritmo editorial:** um título abre um campo de leitura; um número alto responde a uma pergunta; uma legenda acompanha um objeto. A quantidade de estilos por viewport deve ser limitada. Não colocar três famílias expressivas lado a lado competindo pelo nome da personagem.

## 16.4. Anatomia das superfícies

**Plano de fundo:** Vazio com geometria/fibra em baixíssimo contraste, sem animação perpétua. **Plano estrutural:** bordas finas, moldura de metal mineral/papel, divisões segundo agrupamento semântico. **Plano interativo:** filtros, campos e botões com saliência mínima, hover por relevo/reflexo; foco altamente visível. **Plano editorial:** fólio, retrato e texto mais iluminados que o entorno. **Plano flutuante:** apenas dados contextuais, com sombra de contato, limite claro, posicionamento responsivo e fechamento acessível. **Plano de estado:** avisos de conflito/pendência sempre legíveis acima das interações, nunca encobertos por partículas.

Raios dos cantos **variáveis por material**: páginas/documentos com recortes pequenos ou quase quadrados; instrumentos técnicos com cantos moderadamente arredondados; janelas flutuantes com arredondamento mais generoso e moldura perceptível. O mesmo `rounded-2xl` aplicado a tudo é proibido. Não combinar três sombras e bordas brilhantes em um mesmo componente.

**Fio visual:** linha de 1–2px em escalas normais, eventuais 3px apenas para foco/acessibilidade; nós representando ponto de origem/destino; curvas de Bézier com tangentes coerentes e continuidade perceptiva. O Fio nunca atravessa texto, ícone ou controle. Quando a relação cresce, usar agregação, separação por camada ou foco local; não criar espaguete visual.

## 16.5. Gramática da composição — a organicidade verificável

A organicidade deve surgir da assimetria **estrutural**, não de `position:absolute` arbitrário. Empregar trilhos proporcionais variáveis e módulos de conteúdo que respondem à largura disponível. Exemplos de relações desejadas: 36/64 no atlas narrativo, 24/52/24 na VP com consulta aberta, 15/70/15 na Mesa, 26/48/26 no Mestre; não transformar essas proporções em grid uniforme rígido. Um módulo pode atravessar trilhos apenas se sua importância ou relação semântica justificar.

Recursos compositivos permitidos: coluna editorial interrompida por instrumento; retrato atravessando a margem de um fólio sem cobrir dados; diagrama que nasce de uma anotação e termina numa consequência; navegação que acompanha a espinha do atlas; perfis em camadas que repousam sobre o palco; linhas de leitura oblíquas discretas; notas marginais que conectam fonte e interpretação. **Não** usar zigue-zagues, inclinações e ornamentos só para provar criatividade.

Estabelecer **hierarquia em repouso e em ação**. Em repouso, a tela é silenciosa e informativa. Em ação, apenas a superfície correspondente recebe profundidade. A transição entre elas é um rearranjo consciente do plano de atenção, não uma explosão de brilho.

## 16.6. Motion: dicionário completo de efeitos

| Nome de gesto | Gatilho verdadeiro | Movimento | Resultado percebido | O que não deve acontecer |
|---|---|---|---|---|
| **Tensão** | existe risco, compromisso ou dependência nova | aproximar duas linhas/nós, pequenas mudanças de curvatura | relação está prestes a produzir efeito | pulsação infinita de todas as linhas |
| **Enlace** | os dois Fios foram resolvidos | encontro progressivo com marca pontual e leitura textual | os resultados foram relacionados pelo Motor | transformar Consonância em triunfo |
| **Dobra** | abrir detalhe, operação ou outra camada de leitura | inflexão suave de borda/caminho e deslocamento localizado | contexto foi desdobrado, não substituído | rotação 3D do site inteiro |
| **Ancoragem** | servidor confirmou alteração durável | nó e traço estabilizam; pequeno assentamento de profundidade | decisão foi gravada | mostrar conclusão antes do commit |
| **Revérbero** | evento repercute em outra área autorizada | eco curto no destino e atualização legível | a consequência alcançou outro instrumento | propagação de partículas por várias páginas |
| **Descostura** | ação de desfazer rascunho ou soltar relação | linha recua da origem com redução de opacidade | vínculo provisório foi abandonado | sugerir que dado canônico foi apagado sem histórico |
| **Arrasto de Fólio** | navegação editorial contextual | deslocamento em plano e revelação por máscara simples | se abriu uma folha ligada à anterior | `flip book` obrigando esperar 2s |
| **Assentamento de Janela** | instrumento é convocado | translation + opacidade, escala mínima | janela se acomoda ao palco | janela saltar de local errático |
| **Presságio de Alteração** | usuário editou mas não salvou | marca de margem/indicador discreto | há escrita pendente | parecer salvamento confirmado |
| **Falha de Vínculo** | conflito/reconexão exigem atenção | fio interrompido com texto e retorno possível | há impedimento a resolver | animação de “erro mágico” sem instrução |

Referências de duração: 120–180ms para feedback de botão/seleção, 160–280ms para microinteração, 300–550ms para mudança de contexto; não somar durações de série que provoquem espera percebida. Manter animações em `transform` e `opacity` quando possível; derivar curvas de movimento por categoria, não por sorteio. Reconexão/rolagens não devem bloquear acessibilidade. `prefers-reduced-motion` remove travelling, morph e paralaxe, mantendo mudanças de estado claras. Arraste e rolagem dependem de gesto do usuário, não de animação autônoma.

## 16.7. Elementos proprietários a desenhar

**A. Régua de fio:** escala fina com marcações de valores e fonte; para dados, custos, oportunidades. **B. Nó de acontecimento:** ponto + inscrição + ligação de origem e consequência; representa evento com ID e data. **C. Carta desdobrável:** preserva proporção 63×88 em miniatura no catálogo e vira folha de consulta livre quando aberta. **D. Selo de registro:** indicador de origem/edição/aprovação, não runa fictícia. **E. Curva de Continuidade:** sequência de Marcos com impacto causal, sem parecer barra de experiência. **F. Cinta de Participação:** trilho de rodada compacto com dois Impulsos/Resposta. **G. Caixa de Enlace:** núcleo de dois dados e resultado. **H. Friso de Condições:** marcadores formais círculo/triângulo/losango com explicação ao abrir. **I. Fragmento documental:** citação da regra ou evidência com fonte/versão. **J. Cartografia de dependências:** grafo focado, com arestas codificadas (sustenta, impede, exige, contradiz, transforma), não apenas linhas.

Para cada elemento o Work criará um **componente-base, tokens, variantes, estados e prova desktop/mobile**. Componentes devem reutilizar a semântica e a lógica, não forçar todos os contextos a exibir a mesma proporção. Testar cada composição em 320, 390, 768/820, 1024, 1440 e telas grandes; simular textos longos, ausência de imagens, cinco ou mais marcadores, zoom 200%, dispositivos lentos e teclado.

# 17. FICHA INTEGRAL — PROJETO DESCRITIVO TELA A TELA

## 17.1. Estrutura-mãe: atlas do personagem

O Registro deve parecer **uma obra que se escreve conforme a pessoa existe**. Em vez de uma única página de cartões colados, usar capa/inicial compacta, índice claro, seções-fólio, instrumentos atravessando algumas páginas e vínculos entre os capítulos. Manter acesso rápido às cinco áreas canônicas: **Pessoa, Constituição, Ação, Expressão, Percurso**. Não chamar a Relação de quinta raiz do sistema; Relação permeia todas as áreas.

### Geometria desktop, largura de conteúdo real >= 1180px

```text
┌──────────────────── ESPINHA / NAVEGAÇÃO GLOBAL ESTREITA ──────────────────────┐
│  IDENTIDADE EM MOVIMENTO                 REGISTRO · EDIÇÃO II   [VP] [⋯] [SALVO]│
│  ╭── retrato recortado ──╮  NOME / designação      CAMPANHA • CENA se houver │
│  │ imagem original      │  episódio de abertura  índice de cinco capítulos │
│  ╰──────────────────────╯                                                  │
├───────────────────────────┬──────────────────────────────┬──────────────────┤
│ FÓLIO DA PESSOA           │ INSTRUMENTO RELACIONAL      │ NOTAS MARGINAIS  │
│ Origem • Ofício           │ Âncora / Marca / Vínculos   │ estado, fontes,  │
│ Convicção / Limite        │ eventos ligados             │ últimos rastros  │
│ história com respiro      │                              │                  │
├───────────────────────────┴──────────────────────────────┴──────────────────┤
│ CONSTITUIÇÃO — INSTRUMENTO DE QUATRO MATRIZES + ALINHAVOS, COM FOCO PRÓPRIO │
└────────────────────────────────────────────────────────────────────────────┘
```

**Observação:** a figura não determina proporções rígidas nem exige que todas as seções estejam abertas simultaneamente. A capa pode ocupar altura curta e se recolher com o fluxo; o índice dos cinco capítulos pode permanecer no cabeçalho do Registro, sem duas ou três barras fixas.

**Cabeçalho:** 1) voltar ao Arquivo; 2) nome e campanha; 3) situação da ficha (em preparação, íntegra, conflito, somente leitura); 4) comando principal VP; 5) ações secundárias agrupadas (pesquisa, impressão, exportação, histórico, salvar, partilhar conforme permissão). Sem hero de metade da tela. O retrato é editorial e configurável, não exigido para criar personagem. Não repetir data, campanha e nome em cada painel.

**Índice flutuante de seção:** opcional no desktop e transformado em seletor compacto no mobile; destaca área ativa, pendências reais e seção expandida. Registra a posição de leitura por usuário, sem arrastar o scroll permanentemente com lógica pesada.

### Composição tablet 768–1179

A primeira dimensão a adaptar não é o número de colunas, mas a **prioridade do ato**. Retrato e identidade tornam-se faixa horizontal assimétrica; Âncora e Marca formam dois fólios justapostos com largura mínima legível; Alinhavos podem migrar para seletor de domínio mantendo o radar visível. Notas marginais passam a abas de suporte e não terceiro eixo permanente. O índice é um rail horizontal que não consome duas linhas inteiras se uma é suficiente.

### Composição mobile 320–767

Primeiro contato em uma tela típica: faixa de volta + nome + VP + estado, um recorte mínimo do retrato, capítulo selecionado, e a **primeira informação efetivamente utilizável**, não 400px de ornamentos/hero. Abaixo, uma superfície principal de leitura/edição com alternância contextual. Subgrupos de conteúdo são **folhas internas** e controles por passo; não aumentar `min-width` de tabelas para produzir scroll horizontal nem renderizar o desktop em tijolos verticais. Uma seção pode ocupar o espaço inteiro com um painel de notas convocado por botão, com caminho de retorno inequívoco. Teclado virtual não deve ocultar botões Salvar/Concluir.

## 17.2. Capítulo Pessoa — “O que ainda sustenta esta pessoa?”

**Composição:** um fólio central de prosa, uma margem viva de relações e um retrato/inscrição que funciona como âncora visual. Origem, Ofício, Convicção e Limite são quatro entradas textuais **com formatos diferenciados**: Origem = relato contextual com linha de proveniência; Ofício = prática/identidade e eventual lugar institucional; Convicção = tese do personagem apresentada como uma frase forte; Limite = linha de fratura sem indicador de penalidade automática. As quatro entradas não devem ser quatro textareas enormes do mesmo tamanho.

**Marca:** trio Gatilho → Manifestação → Resíduo em forma de percurso dividido em três ritmos. O primeiro nó guarda a condição que a fez emergir; o segundo recebe a descrição do acontecimento; o último destaca o que ficou. Se a Marca não está manifestada, preservar o espaço editorial como informação neutra, não mostrar cartão vazio com incentivo para fabricar uma Marca. A Marca pode estar conectada a pessoa, objeto, lugar e cena via Nexus, nunca associada automaticamente a paranormalidade ou bônus.

**Âncora:** margem em relevo fino, com identificação do pilar, texto breve do retorno à própria continuidade e estado Assentada/Abalada. No estado Abalada, o traço que parte do pilar interrompe-se em um ponto explicável e oferece “Ver acontecimento” e “Propor Reassentamento”; não transformar em barra de cooldown. A interface do procedimento Ancorar exige a consequência plausível e a diferença entre Sustentar/Redirecionar, preservando o preço. Em leitura, histórico de usos e mudanças aparece numa dobra de fólio, não como contador de cargas.

**Vínculos:** cada vínculo tem Nó, Natureza, Oferta, Demanda, Tensão e estado Presente/Tensionado/Ferido/Rompido/Costurado; o grafo mostra entidades reais. A ação Abrir/Sustentar/Cobrar recebe contexto e evento. Visual principal: uma **teia focada no personagem**, com nós selecionáveis que abrem dossiê ao lado; os pontos mais importantes surgem por relação, não por tamanho aleatório. Uma alternativa textual ordenada deve sempre existir; a posição dos nós pode ser lembrada por usuário sem falsificar a semântica do vínculo. Relações conflitantes não podem ser coloridas como moralmente más; rótulo/traço/explicação ganham prioridade.

**Descrição e vida:** preservar editor rico de história, aparência, personalidade, objetivos, traços, motivações, notas, imagens e quaisquer seções legadas já existentes. No desktop, a história recebe largura de leitura de aproximadamente 60–75 caracteres, com notas marginais e referências. No mobile, inserir editor completo por tela dedicada, não textarea de 5 linhas com scroll interno impossível. Registrar fontes e links do Nexus sem transformar todo parágrafo em grafismo automático.

**Animações:** entrar em um Vínculo muda apenas o foco daquela linha; abrir a Marca revela três campos como uma dobra de documento; Ancorar confirmado assenta o nó e marca o Resto. Nenhuma animação deve encobrir a descrição escrita durante o save.

## 17.3. Capítulo Constituição — “Do que é feita a possibilidade?”

**Matrizes:** quatro e somente quatro — Ímpeto, Cadência, Nexo, Lastro. Usar instrumento único com quatro eixos e marcas legíveis; o radar pode ser quadrangular, desde que seja honesto com os dados. Cada eixo mostra grau, dado (d4/d6/d8/d10/d12; d20 apenas pelo contexto excepcional pertinente), derivação e explicação. O radar **não** deve ocupar toda a viewport móvel; abrir em detalhe quando selecionado. A seleção deve refletir-se nos Alinhavos possíveis e nas Defesas derivadas sem criar valores independentes.

**Alinhavos (21, verificação nominal):** Atletismo, Luta, Pontaria, Furtividade, Engenharia, Ciências, Medicina, Ofício, Percepção, Sobrevivência, Investigação, Condução, Diplomacia, Persuasão, Intimidação, Encenação, Sociedade, Tática, Iniciativa, Canalização, Selagem. Cada um precisa de grau 0–4, dado correspondente e ligação ao Motor; `Ofício` Alinhavo é distinto de `Ofício` da Feição. Dar busca, filtros por prática e favoritos **de consulta**, mas não alterar o conjunto canônico de 21. A apresentação sugerida é uma pauta de índices: categoria à esquerda, graus alinhados à direita, um pequeno traço de cada nível, painel desdobrado ao selecionar. Na tela de 390px, mostrar 5–7 entradas úteis por quadro sem exigir rolagem dentro de cada item.

**Criação:** composição das quatro Matrizes `3,3,2,2`, dois Alinhavos grau 2, quatro grau 1, os demais grau 0; validação legível em linha, diffs das seleções e ação explícita Concluir Criação. Nunca aplicar valores do modelo de exemplo como imposição narrativa; permitir escolher a distribuição. A incompletude precisa apontar o campo afetado e como corrigi-lo.

**Recursos:** uma tripla pauta de números PV/PI/PE, com máximo, atual e origem de fórmula; apresentação reduzida no modo físico. Como são recursos diferentes, não representar tudo por barras idênticas. PV responde a Vitalidade, PI a Inteireza, PE a Esforço; o domínio visual mostra consequências e contextos, não uma pseudo-medida de “vida total”. Fórmulas derivadas do motor atual: PV `6 + 2×Ímpeto`, PI `6 + Nexo + Lastro`, PE `5 + Nexo + Lastro`; manter livro como autoridade se houver divergência e provar com testes. `0 PV`, `0 PI`, `0 PE` têm protocolos diferentes. Um toque no valor abre histórico de custos/recuperações com fonte; editar requer autorização e causa clara.

**Defesas/Guarda:** quatro Defesas — Resistência, Evasão, Lucidez, Firmeza — com valores derivados; painel de comparação sem “classificação de defesa melhor”. Resistência é ligada a PV, Evasão a Cadência, Lucidez/ Firmeza a seus limiares canônicos conforme o Motor; **não criar cálculo alternativo**. Guarda com fonte de proteção (até +2 ordinário, quando cabível), modificador expresso, cobertura total e guarda quebrada. Exibir separadamente **defesa/limiar**, **proteção expressa** e **situação de cobertura**; não inventar RD equivalente por usar armadura.

**Condições:** friso com formas do kit físico (círculo/triângulo/losango = Leve/Grave/Crítica) e explicação textual, usando Nome, Origem, Efeito, Saída. Aumentar tamanho do marcador pelo foco apenas, não pela intensidade de modo enganoso. A condição abre como ficha horizontal com 4 áreas úteis; há fluxo de mudança de intensidade, saída verificada e histórico. Se cinco ou mais condições estiverem ativas, agrupar com contador e painel de consulta; não ocupar 1000px de altura. **Intensidade não determina penalidade numérica universal.**

**Equilíbrio e Tensão:** tratar como dois instrumentos em diálogo, nunca uma barra comum. Equilíbrio é eixo `−10…+10`, Medo/Conhecimento como orientação sem moralidade e sem bônus geral; Tensão é contador `−4…+4` como instrumento físico de transição, com valor interno de acúmulo anterior ao limiar e conversão no limiar. **Atenção de modelagem:** schema atual persiste Tensão no intervalo `−3…+3`, porque atingir `±4` desloca Equilíbrio e reinicia Tensão; visualização pode mostrar marca-limiar `±4` sem persistir um estado inexistente. Entrada com salto não deve criar perda arbitrária do restante sem conferência da regra; testar o caso de variações >1 antes de declarar comportamento normativo. Exibir **origem da Tensão** e evento que alterou Equilíbrio. Não desenhar o eixo como medidor de corrupção/virtude.

**Estado crítico e recuperação:** mostrar a cadeia de procedimento e a fonte, nunca só um rótulo assustador. 0 PV/Incapacitada, À Beira, estabilização, eventual morte conforme circunstância; 0 PI/Colapso; 0 PE e modalidade restrita de Forçar; Matriz Abalada; Âncora Abalada; Guarda Quebrada. Recuperar por Pausa breve/Repouso profundo/Recuperação plena com janela real e condições, custo e justificativa. A UI não deve induzir “descansar” várias vezes numa sequência sem mudança efetiva.

## 17.4. Capítulo Ação — “O Fio encontra resistência”

O capítulo Ação hospeda **consulta normativa e ferramentas do Motor**, não a obrigação de realizar todas as rolagens pelo Registro. Abrir com um instrumento compacto de dois Fios, seguido por operações pertinentes: teste direto, disputa, Auxílio, Cooperação, Redobra, intervenção física, situação/posição, condições de repetição, proteção e recuperação. Na VP essas ações tornam-se prioritárias e contextuais; no Registro permanecem auditáveis.

**Motor:** Fio de Prumo recebe Matriz, Fio de Tento recebe Alinhavo — ou Tento compatível de auxiliar quando o procedimento permitir —, Proveito/Desproveito por Fio e fonte, Forçar por Fio com PE/contrapartida, d20 excepcional autorizado, resultados originais, Enlace, Ascendente, Retorno, Desvio e Consonância. O instrumento nunca transforma números em enredo automático. Tela deve distinguir “o cálculo permite” de “a ficção autoriza”. A dupla unidade é tratada segundo a prioridade canônica; não inventar crítico dobrando dano.

**Intervenção física:** a consequência não é sinônimo de perda de PV; oferecer aplicações autorizadas por evento: dano 1–3 ou fonte singular, manobra sem dano, condições, posicionamento, acesso, proteção, Guarda, integridade de objeto e mudança de frente. RD somente quando explícita; não aplicar proteção duas vezes. O campo “alvo” pode ser token, pessoa, objeto ou descrição livre, com seleção segura e correspondente visibilidade.

**Dossiê de testes:** relação cronológica por cena, com intenção, abordagem, o que estava em jogo, risco, Fios originais, resultados interpretados, fonte de modificações, custo e consequência. O evento original nunca é alterado depois de aprovado; uma Redobra ou correção é nova ocorrência ligada. Para consulta, permitir filtros por cena, operação, personagem, tipo de consequência e referência.

## 17.5. Capítulo Expressão — “O que a pessoa sabe tecer, portar e preservar”

A Expressão precisa de **quatro anatomias visuais diferentes** e um acervo pesquisável, não dez grades de cartões iguais.

**A — Repertório em cartas:** miniaturas reais de 63×88mm proporcionais, prévias editoriais de nome/natureza/origem e estado; o toque abre fólio extenso de consulta. Categorias: Lavores, Tramas, Costuras, Fragmentos, Selos e outros registros legítimos. Os custos e limites são apresentados em campos independentes da descrição poética, com referência à edição.

**B — Oficina de equipamentos:** inventário orientado por utilidade e contexto (portado, acessível, guardado, dentro de recipiente, consumível, danificado, inativo). Preservar recipientes, relações entre itens, quantidades, imagens, nomes e IDs; não aplicar peso/slot universal a objetos cujas regras não o impõem. A arma usa seus seis campos canônicos, conferidos no livro; estados Apto/Danificado/Inutilizado são de Integridade. Abrir um objeto não requer navegar para longe do dossiê.

**C — Tear de expressão:** para Lavores, Tramas, Costura de Malha e Preparo. Cada prática aparece como sequência semântica, com início, requisito, sustentação, custo/condição e saída. Etapas conceituais de Canalização não são cinco testes nem cinco pagamentos. Refluxo, sustentação, Relaxamento e Assinatura aparecem só quando pertinentes. Costura mostra múltiplas Vertentes e contribuição de cada uma, sem fabricar terceira rolagem ou “combo automático”.

**D — Arquivo de persistências:** Selos, Fragmentos, Relíquias, Reputação, Resto, acontecimentos. Selo vincula suporte, dependências, estados e Resto; Fragmento diferencia material, função e Assinatura; Reputação registra Rede, Imagem, Peso, Cobrança sem Rank/bônus universal; Preparo registra gesto/gatilho/mudança/consumo sem ação grátis.

**Tarefas e permissões:** abrir, duplicar como **modelo de conteúdo** (não como instância de personagem), editar, citar, vincular ao Nexus, marcar ativo/em uso, comparar revisão de carta impressa, exportar para impressão quando há template, arquivar sem apagar histórico. Mesmo se a pessoa não possuir baralho físico, o repertório funciona integralmente.

## 17.6. Capítulo Percurso — “O que permaneceu depois de mudar”

**Duas linhas editoriais dialogam**: à esquerda, Marcos reconhecidos; à direita, incorporações concretas. Cada Marco guarda evento e incorporação; avanço de 5% e reconhecimento de 2 PU; máximo 20 Marcos → 100% → 40 PU reconhecidos ao longo da trajetória, não 40 PU livres simultaneamente se houver investimentos. Gastos formam uma segunda trilha pontuada com custo, alvo, regra, razão e vínculo ao acontecimento.

**Composição:** uma curva de continuidade com pontos de natureza distinta e trechos de narrativa; alternar temporalidade por episódios, não cards lado a lado. O usuário consegue localizar “de onde veio este dado?” clicando no valor atual da Matriz ou no Lavor incorporado. A apresentação de PU mostra **reconhecido, gasto, disponível**; custos canônicos: Alinhavo 2 PU, Matriz conforme grau e condição transcendente, Lavor 4/6, Ampliação 3–7 conforme regra explicitada. Não fazer marketplace de talentos.

**Operações:** propor Marco, submeter/reconhecer conforme papel, revisar incorporação, investir PU, ver prévia de alteração, registrar mudança de ficção, retirar lançamento errado por correção auditável com autorização. Marcos não são distribuídos automaticamente por finalizar sessão. Construir indicadores de percurso significativos: um personagem pode ter pouco Desenvolvimento e muita mudança narrativa; a UI não deve reduzi-lo a percentual.

## 17.7. Estados estruturais e organização do Registro

**Lendo:** campos como texto editorial e valores compactos, controles de editar discretos. **Editando:** limites, ajuda da regra e salvamento à vista; pode editar múltiplos campos sem reaplicar cálculos indevidamente. **Em revisão:** investimentos incongruentes, conversão legada, permissões e campos faltantes recebem indicação localizada, nunca um “erro genérico” que force recriar a ficha. **Somente leitura:** manter navegação e seleção/copiar, ocultar/neutralizar ações mutantes. **Conflito:** mostrar diferenças antes de substituir dados remotos; permitir baixar rascunho e revisar manualmente. **Offline:** dados autorizados cacheados; edição apenas rascunho explícito com reconciliação, se permitido. **Em jogo:** a Ficha pode ser consultada sem alterar automaticamente o perfil visual da VP.

**Encontrabilidade:** busca por valores, registros, documentos e nomes; atalhos de edição significativos; índice da seção atual; links internos e retorno ao ponto anterior; histórico de alterações por ficha e sessão; exportação humana (PDF/print) e estruturada (JSON com versão). Impressão deixa a interface editorial limpa e inclui data/edição, com opção de campos selecionados; não pode exportar segredos para espectadores.

# 18. VP — A VISÃO DE PARTIDA COMO INSTRUMENTO AUTORAL

## 18.1. O que deve aparecer primeiro

Ao entrar na VP durante sessão, o usuário **não está cadastrando dados**. Está prestes a agir, consultar uma carta ou interpretar uma consequência. A tela deve abrir com três informações reconhecíveis em menos de dois segundos de leitura: **quem está em foco**, **em qual cena/situação**, **qual ação está pronta**. A VP não apresenta mural de 15 indicadores; oferece um núcleo de ação e deixa o resto como instrumento convocável.

**Nome de produto:** conservar “VP” no botão, apresentação “Visão de Partida” no cabeçalho. O botão alterna Registro ↔ VP com estado preservado, sem redirecionamento confundido com a antiga “Versão de Poder”. A antiga `/sheet/$id/power` deve ter destino de arquivo `Forma de Poder · edição anterior`; não reescrever `power_form_data`. O `SheetExperienceBridge` já oferece `Jogo/Editar` e deve ser **unificado**, não coexistir com um segundo alternador. Abrir VP não exige flag antiga de liberação de forma.

## 18.2. Arquitetura funcional em cinco instrumentos (não abas iguais)

1. **Agir:** composição central de declaração/intervenção/resolução; acesso direto aos pares de Fios, Auxílio e resultado.
2. **Repertório:** carta em foco, consulta de requisitos, custo, sustentação, fonte e edição; busca na coleção real.
3. **Situação:** condições, relações, Âncora, posição relativa, pessoas, frente, ameaças públicas, dados da cena autorizados; painel contextual, não um novo dashboard.
4. **Memória:** últimos eventos, notas de jogador, custos, decisões, Resto pendente/confirmado, diferenças com kit físico; coesão entre cenas.
5. **Ferramentas:** dados físicos/digitais, consulta de regra, recuperação, prontidão, reconciliação, impressão, ajustes de acessibilidade, ligação com Mesa e Nexus.

Os cinco instrumentos são destinos semânticos; no celular mostrar quatro destinos prioritários `Agir`, `Cartas`, `Memória`, `Mais`, com `Situação` dentro da consulta contextual/`Mais` ou acessível por gesto direto a partir da cena. Nunca se exigir mais de duas ações para abrir Condição, Âncora ou contato do Mestre em uma sessão.

## 18.3. VP desktop: geometria com hierarquia em repouso

Largura útil a partir de 1200px: **cabeçalho compacto (~60–76px) + faixa de contexto (~35–48px)**, palco da VP ocupa quase toda a altura restante. Trilho de presença lateral esquerdo **~210–270px** apenas quando há conteúdo; instrumento central em aproximadamente **52–62% da largura disponível**; painel de consulta de **~280–380px** aparece por demanda e desloca o centro sem comprimi-lo além da legibilidade. Faixa de continuidade inferior **~54–92px** recolhida, podendo virar timeline exploratória. As medidas são guias de composição, não hard-code; respeitar zoom e container queries.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ◂ REGISTRO   PERSONAGEM / CAMPANHA        CENA • SESSÃO     [PRESENCIAL⌄] [MESA] [⋯]│
├────────────────────┬─────────────────────────────────────┬──────────────────────────────┤
│ PRESENÇA           │ TRAMA DE INTERVENÇÃO               │ FÓLIO CONVOCADO               │
│ retrato minúsculo  │                                     │ [carta / condição / regra]    │
│ Âncora se relevante│       PRUMO           TENTO          │ título / fonte / custo         │
│ vínculo em cena    │          ╲         ╱               │ texto / efeitos / limites     │
│ últimas mudanças  │       INTENÇÃO — ABORDAGEM          │ ações cabíveis / apontamentos │
│                   │              ENLACE                 │                              │
│                   │       [DECLARAR INTERVENÇÃO]        │                              │
│                   │         consultar / recuar          │                              │
├────────────────────┴─────────────────────────────────────┴──────────────────────────────┤
│ RASTRO DA SESSÃO  ·  evento mais recente  ·  diferenças físicas  ·  Resto [expandir]    │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Sem carta selecionada:** o fólio contextual deve recolher e o centro respirar. **Ao abrir carta:** o fólio surge com boa largura e comportamento de leitura própria, não push inteiro da VP para baixo. **Ao escolher Vínculo:** o trilho esquerdo expande pontualmente com a relação, e o instrumento central exibe a decisão contextual. **Ao ler resultado:** Prumo/Tento permanecem visíveis ao lado da leitura, o centro não substitui tudo por um toast.

**Centro vazio (repouso):** não colocar botão enorme em contêiner gigante. Compor uma chamada de ação curta, o instrumento gráfico em baixa ênfase, os três atalhos realmente usados e a última ocorrência em uma linha. A ausência de sessão ativa deve ser comunicada, mas a consulta do repertório permanece acessível.

## 18.4. VP mobile: composição desenhada, não empilhada

Atuar com uma mão e com o celular parcialmente ocupado sobre a mesa. Deve ser possível abrir uma carta por busca, voltar ao Motor e registrar o resultado com baixo esforço. Margens laterais suficientes para toque e segurança; cabeçalhos reduzidos e dock inferior respeitando safe area. O teclado deve empurrar/informar o layout sem recortar confirmação.

```text
┌─────────────────────────────┐
│ ◂  PERSONAGEM        [⋯]    │  altura mínima; sem capa gigante
│ CENA ATIVA · PRESENCIAL     │  estado de rede/salvo visível ao tocar
├─────────────────────────────┤
│        INTENÇÃO             │
│    [resumo da abordagem]     │  área prioritária
│                             │
│    PRUMO    ╲  ╱   TENTO     │
│              ◎              │  instrumento central
│    ENLACE / PONTO EM JOGO    │
│                             │
│    [DECLARAR / RESOLVER]     │  CTA único claro
│  registro físico | digital   │
├─────────────────────────────┤
│ último evento • ver rastro   │
├─────────────────────────────┤
│  AGIR  CARTAS MEMÓRIA  MAIS  │  safe area + tabbar compacta
└─────────────────────────────┘
```

**Carta aberta:** tela vira fólio de consulta otimizado, com nome e texto completos, selo de edição/registro, custos e botão contextual, sem impedir retorno ao contexto. **Rolagem em andamento:** instrumento ocupa o plano principal; trocar de aba preserva rascunho e oferece retorno. **Painel de resultado:** número e significado legíveis; o usuário pode revisar dados de dados físicos digitados antes de confirmar. **Situação digital:** abre como painel próprio com PV/PI/PE, Impulsos/Resposta, Posição/Condições, mas não domina o modo Presencial. **Notificação do Mestre:** aviso não invasivo com leitura completa ao tocar; não interromper um campo preenchido.

**Ergonomia:** alvos de toque >=44×44px onde viável; botões críticos longe das bordas de gestos sistêmicos; rolagem interna de fólio somente quando necessária e com foco restaurado ao fechar; zoom textual do SO suportado; sem hover como única forma de descobrir custo; sem bloqueio da tela por animações. Prever horizontal/landscape para tablet e phones de tela larga.

## 18.5. VP tablet e janela destacada

Tablet em paisagem: instrumento central + fólio desdobrável à direita; presença vira uma faixa vertical compacta. Tablet retrato: instrumento ocupa maior parte; fólio abre em folha sobreposta, não em metade estreita. Janela popout de ficha/VP mantém título, autenticação, filtros de audiência, contexto, edição e salva/reconcilia corretamente; o popout não pode ter regras divergentes. O jogo online poderá abrir VP e Mesa lado a lado em monitores diferentes, com realtime e visibilidade controlada.

## 18.6. Intervenção: storyboard minucioso de 10 estados

**00 · Estado livre:** mostrar personagem, cena, CTA “Declarar intervenção”, três atalhos priorizados por contexto. Sem rolagem automática. **01 · Declaração:** campo curto “O que quer mudar?” + “Como?”; alvo/objeto/posição escolhidos quando relevantes; exibir o ponto em jogo sem forçar narrativa longa. **02 · Suficiência:** escolha explícita do Mestre/usuário autorizado: ficção resolve diretamente, precisa de outra condição, ou há risco/oposição que exige teste. A primeira opção registra mudança durável apenas se necessário; não abre o Motor por ritual. **03 · Aproximação:** Matriz/Alinhavo, fontes, acesso, limiar/defesa único, Proveito/Desproveito por Fio, Forçar, Ajuda compatível, custo declarado; toda modificação apresenta “fonte”. **04 · Prévia:** mostrar Prumo e Tento finais antes de jogar, custo previsto e condição de autorização (d20 excepcional, Fio em 0 PE, posição). **05 · Resolução:** escolha dados digitais ou resultado físico. Rolagem física aceita faces compatíveis com os dados; nunca “simular” que foram rolados no site. **06 · Leitura:** resultados originais lado a lado, Enlace, DT, margem, Ascendente/Retorno, Desvio, Consonância e crítica conforme Livro II; mostrar transcrição textual na mesma hierarquia. **07 · Proposta:** intervenção ainda não está aplicada; exibir possibilidade e consequência descrita por responsável. **08 · Confirmação:** custo/rodada/estado/segredo via transação aprovada uma única vez; somente aqui Ancoragem de motion. **09 · Resto:** se relevante, guardar fato e links; caso contrário retomar ação, preservando histórico da resolução.

**Erros:** se a cena mudou durante a declaração, o sistema informa *o que* ficou desatualizado e oferece atualizar antes de rolar; se houve rolagem física, valores originais devem permanecer no rascunho da proposta; se uma aprovação expira, não debitar custo retroativamente. Um resultado jamais deve ser apagado para fingir uma nova rolagem. Um comando de “desfazer” não é rerrolagem: gera compensação/correção com permissão e histórico.

## 18.7. O instrumento dos Fios — desenho e apresentação matemáticos

O desenho central contém **dois trajetos visualmente diferentes** ligados por uma leitura comum: Prumo com pequeno rótulo da Matriz, Tento com rótulo do Alinhavo; um local de convergência representa o Enlace. Não codificar o sucesso pela cor da Natureza. Antes da rolagem, os Fios ficam separados e etiquetados com dados (por exemplo `d8` e `d6`); depois, revelam faces individuais, somatório, referência e interpretação. **Consonância:** encontro geométrico sutil se faces iguais; não pintar dourado de triunfo. **Desvio:** separação orientada com número/sinal (Prumo−Tento); não confundir com grau de fracasso. **Ascendente/Retorno:** marcos do maior/menor resultado, claros sem sobrepor Enlace. **Dupla unidade:** estado expressamente diferente, sem fogos digitais; leitura prioritária segundo regra.

**Visual da dificuldade:** DT/defesa única como limite/linha de referência, com espaço para origem; nunca mostrar “chance de vitória 73%” como tradução universal do risco ficcional. Probabilidade exata, quando disponível, em folio de consulta opt-in com premissas e fontes; não transformar em navegação principal.

**Auxílio:** o traçado de Tento recebe uma pequena inscrição do auxiliar e seu grau compatível; o diagrama continua com **dois e somente dois Fios**. **Cooperação:** participantes com instrumentos paralelos e resultados distintos que se encontram num objetivo, não em um único Enlace somado. **Forçar:** engrossar pontualmente o segmento afetado e exibir PE/contrapartida, com confirmação antes do lance; d12→d20 mostra permissão excepcional obrigatória. **Proveito/Desproveito:** sinais curtos antes da face, com tooltip/inscrição de fontes e Fio afetado, nunca +1 universal no resultado final.

## 18.8. Repertório e cartas na VP — a coleção física como interface

O repertório físico usa a escala nominal 63×88 mm; a VP não deve mostrar 3 cartões enormes de mesma proporção lado a lado num celular. Crie um **Índice de Cartas** com busca por nome, categoria, código opcional, fonte, situação de uso, recente, guardado/portado, ativo/sustentado, estado da Integridade. Tipos existentes da coleção: Armas, Itens, Consumíveis, Relíquias, Lavores, Tramas, Fragmentos, Ameaças, NPCs e Locais; o catálogo digital pode mostrar também Selos, Preparos e Costuras como registros especializados sem sugerir que já há baralho impresso de cada um.

Miniatura: proporção preservada quando representa carta física; title legível e uma marca editorial de categoria. **Fólio aberto:** título; edição; “o que representa”; requisitos/limites; efeito/custo apenas se houver regra correspondente; ativação/sustentação/Relaxamento; história/contexto; referência normativa; vínculo com entidade/Nexus; ações contextuais permitidas. A transição não é flip 3D excessivo: a carta **desdobra-se em informação**, como uma ampliação de leitura.

**Seleção “Em minha prancha”** é uma declaração manual opcional de presença física nos nichos Equipamento, Lavor/Trama, Outro Recurso. Não significa equipamento ativo mecanicamente quando não declarado nem muda recursos. Em modo digital, oferecer espelho compacto desses três nichos como consulta, não como fonte única do inventário. A carta pode ficar em prateleira/biblioteca, em prontidão, sustentada ou já usada, com semânticas distintas.

## 18.9. Situação em jogo — sobreposição, não HUD em duplicata

**Presencial:** a VP mostra alertas resumidos (Condição alterada, Âncora Abalada, carta em sustentação, autorização pendente) e permite abrir a instrução completa; PV/PI/PE e ações ficam na prancha. **Híbrido:** leitura curta dos últimos estados digitais com selo “Conferir com a prancha” quando houve divergência. **Digital:** painel de operação compacta de recursos, Impulsos/Resposta, Posição contextual e Condições, em módulos de baixa altura. **Espectador:** apenas dados públicos permitidos; não copiar ficheiro completo para renderizar o HUD.

Instrumentos operacionais de situação: ver frente/ameaça que determina Posição; consultar condição Nome/Origem/Efeito/Saída; obter a fonte da proteção/Guarda; conferir estado de sustentação e janela já paga; Âncora/Vínculo relacionado à cena; último acontecimento com custo; botão para pedir decisão do Mestre quando necessário.

## 18.10. Memória e Resto: estrutura emocional sem perder operação

A memória deve ter um **friso contínuo** com marcadores de eventos: tentativa, decisão, consequência, vínculo transformado, custo, revelação, Resto/Permanência. Eventos de cada categoria têm forma e marcação distintas e podem relacionar-se por fio; não apresentar 30 cartões idênticos. Todo evento que aparece tem proveniência e autor; rascunho é diferente de fato aplicado. Último resultado curto fica na base da VP; abrir mostra uma sequência com contexto, possibilidade de comentário, ligação ao Nexus e comparação de antes/depois.

**Registrar Resto:** solicita o que efetivamente permanece, em quem/onde, qual é a fonte, qual audiência, quem confirma. Não sugerir automaticamente que todo teste gera Permanência. **Memória subjetiva:** o jogador pode escrever interpretação própria sem convertê-la em fato do mundo. **Corrigir:** eventuais reparações não apagam fato histórico; criar nota/ocorrência de retificação com permissão.

## 18.11. Modo físico: Acerto de Continuidade em 4 movimentos

A prancha não transmite valores. (1) **Conferir instrumento:** escolher PV, PI, PE, Impulsos/Resposta, Posição, Condições, Âncora e cartas em uso. (2) **Comparar:** mostrar valor digital, valor informado pelo usuário na prancha, diferença, última atualização e fonte; **nunca** inferir valor físico. (3) **Explicar e confirmar:** registrar momento, situação, justificativa e autor; se o estado remoto mudou, pedir revisão. (4) **Assentar:** atualizar registro autorizado, produzir evento `physical.reconciled`, atualizar a próxima sessão e deixar rastro. O acerto pode ser parcial; não obrigar conferir dez campos se só PE mudou.

**Evitar dupla cobrança:** se uma alteração já foi aplicada digitalmente durante a sessão, a conferência física não reaplica o mesmo custo. Permitir marcar “prancha refletida”, “a prancha ainda está diferente”, “desconhecido” separadamente. **Não substituir imprecisão física por automatização falsa:** a tela pode facilitar a anotação, mas a autoridade de conferência é humana.


# 19. MESA NEXUS — O PALCO DEVE ESTAR SEMPRE NO CENTRO

## 19.1. Tese de interface

A Mesa não é uma página de painéis com um pequeno mapa no meio. É um palco espacial cujo contorno recebe os instrumentos necessários à cena. Tudo que não ajuda o usuário a ver, selecionar, mover, revelar ou intervir na situação deve ficar fora do campo principal até ser convocado. A Mesa existente já tem motor de renderização, ferramentas de câmera, cenas, estrutura espacial e recursos de direção sofisticados: o redesign precisa **dar identidade a esse motor**, não substituí-lo por um mockup estético.

**Primeira dobra da tela:** 1) a cena em foco ocupa 70–85% da superfície desktop quando nenhum editor está aberto; 2) topo contém sessão, cena, estado do servidor, audiência e controles de apresentação; 3) lateral esquerda fica rail de ferramentas indispensáveis, agrupadas e rotuladas; 4) lateral direita é folha de inspeção **que só aparece com seleção/edição**; 5) base agrupa ações de sessão e contexto da seleção. Nenhuma barra pode ocupar metade da altura da cena apenas por conter muitos controles.

### Mesa desktop — jogador

```text
┌────────────────────────────── CONTEXTO / SESSÃO ──────────────────────────────┐
│  ◂  CENA                         [2D / 3D] [personagem] [rede] [⋯]             │
├───────┬─────────────────────────────────────────────────────────┬────────────┤
│ TOOL  │                                                         │ CONTEXTO   │
│ RAIL  │                   PALCO DA CENA                          │ aparece    │
│       │                 mapas / tokens / objetos                 │ após       │
│       │                                                         │ selecionar │
│       │                                                         │ alvo/carta │
│       │                                                         │            │
├───────┴─────────────────────────────────────────────────────────┴────────────┤
│ [Mover] [Intervir via VP] [Consultar alvo] [Ping] [Ver handout] [⋯]           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mesa desktop — Fio~Mestre

A mesma cena visual permanece, mas o Mestre pode alternar **Conduzir / Compor / Revelar / Ensaiar**; em Conduzir, ferramentas de edição profundas desaparecem do palco e ficam disponíveis num comando explícito. **Compor** abre oficina lateral de layers, paredes, modelos e arquivos. **Revelar** dá prioridade a audiência, FOV, neblina, documentos e transições. **Ensaiar** permite pré-visualizar exatamente o que um jogador autorizado enxergaria, mas **sem mudar a sessão pública** nem expor segredos no canal de jogador.

## 19.2. Mesa em celular

A tela móvel não é o desktop responsivo via colunas verticais. A cena é praticamente toda a viewport; cabeçalho de uma linha para sair/cena/rede; na parte inferior, uma **tira de ação** com um comando principal contextual, seleção e “Ferramentas”. Câmera e mapa podem ser controlados por gesto, mas toda operação crítica também tem botão acessível. Um token selecionado abre uma folha curta com nome, informação pública, movimentação disponível e `Abrir VP`; dados longos abrem folha maior e fechável. Para o Mestre, um botão “Direção” convoca janelas empilháveis em **um nível ativo por vez**, com retorno fácil à cena. **Não** colocar listas de NPCs, pistas e parede permanente em um celular de 390px.

**Gestos:** toque seleciona; toque novamente abre detalhe; arraste move apenas quando modo e permissão estão claros; pinch controla zoom sem arrastar objeto por engano; gesto longo abre menu contextual com alternativa textual; panning não consome uma ação do jogo. Evitar menus circulares sobre elementos pequenos do mapa e sobre teclas do sistema. Uma ação destrutiva de ambiente não é acionada por gesto ambíguo.

## 19.3. Preservação funcional em grupos explícitos

> O Work deve abrir cada componente mencionado, criar prova de uso e registrar proprietário/destino antes de qualquer refatoração. Abaixo está a cobertura **mínima** observada no repositório; não é lista exaustiva de botões que substitui auditoria de navegador.

| Grupo de função existente | Componentes/módulos a conferir | O destino visual e funcional na V2 | Evidência de preservação |
|---|---|---|---|
| **Cenas e continuidade** | `scene-manager`, `tabletop-persistence-service`, `tabletop-session-service`, route/workspace | seletor de cenas, criação/renomeação, ordenação, salvar, abrir, restaurar, versionar e desfazer quando suportado | alternar 3 cenas sem perder câmera/tokens/revisões |
| **Participantes e sessões** | `tabletop-live-session`, `tabletop-participant-*`, `use-tabletop-realtime` | ingresso, presença, permissão, vínculo personagem/token, reconexão e estado da sala | dois usuários com atualizações autorizadas |
| **Tokens e entidades** | `tabletop-engine`, `interaction-controller`, `entity-renderer`, `tabletop-entity-dossier` | criação, seleção, multisseleção, posição, rotação, escala, imagem/miniatura, ligação ao Nexus/ficha | manipular entidades sem perder IDs/ancoragem |
| **Câmera e projeção** | `camera-controller`, `tabletop-projection`, `tabletop-view-preference-service` | mover, aproximar, enquadrar, opções 2D/isométrica/3D e preferências pessoais | personagem/objeto em cada projeção |
| **Geometria e grade** | `geometry`, `grid-renderer`, `tabletop-advanced-grid-runtime`, `tabletop-grid-origin-runtime` | opções de grade, escala, origem, snap, medição, distâncias e ausência de grade | cenas com grade e sem grade |
| **Camadas, estruturas e pisos** | `layer-manager`, `tabletop-levels`, `tabletop-structure-editor`, `tabletop-structure-vertical` | andares, elevação, paredes, portas, portas secretas, cobertura/oclusão e edição arquitetural | selecionar e editar sem deslocar coordenadas |
| **Névoa, luz e audiência** | `tabletop-fog-geometry-bridge`, `tabletop-visibility-service`, `tabletop-fog-audience-runtime`, `tabletop-gpu-visibility-field` | esconder/revelar, line of sight, preview da audiência, iluminação conforme motor, distinção GM/jogador | segredo não visível para jogador, mesmo via payload |
| **Modelos e assets** | `tabletop-creative-dock-bridge`, `tabletop-native-model-*`, `tabletop-gltf`, `tabletop-asset-flow` | importar, selecionar, aplicar e inspecionar modelos/imagens e regiões sem UI gigante por padrão | asset novo e legado no mapa |
| **Desenho e edição** | `tabletop-drawing`, `tabletop-tool-overlay`, `tabletop-editor-panel`, `tabletop-semantic-transform` | desenho, geometria, transformações, edição de objetos e ferramentas de mapa | modo edição sem quebrar sessão de jogo |
| **Áudio/atmosfera** | `tabletop-spatial-audio-bridge`, `tabletop-atmosphere-bridge` | recursos opcionais do diretor, com controle de performance e acessibilidade | áudio não dispara sem gesto/perm. quando exigido |
| **Direção de cena** | `tabletop-director-state`, `tabletop-director-timeline-bridge`, `tabletop-director-enhancement-bridge` | cues, cronologia, enquadramento, reprodução/revelação de cena e notas de direção | diretor pode preparar e executar cue |
| **Zonas e automação** | `tabletop-regions`, `tabletop-region-automation-bridge`, `tabletop-smart-setup-*` | zonas, triggers existentes, presets/guias, com preview e explicação de efeitos reais | não automatizar mecânica TdV ausente |
| **Navegação contextual** | `tabletop-progressive-interface-bridge`, `tabletop-radial-actions-bridge`, `tabletop-floating-layout-bridge` | ações por seleção, menus contextuais, janelas corretamente contidas, navegação de teclado | fluxo completo em touch e teclado |
| **Integração Nexus** | `tabletop-cross-surface-bridge`, `tabletop-nexus-capture-bridge`, `tabletop-integration-tools-bridge`, `tabletop-deep-link-locator-bridge` | vincular páginas, arrastar itens permitidos, capturar cena e localizar entidades | vínculo abre destino real com permissão |
| **Jogada e movimento** | `tabletop-player-interaction-bridge`, `tabletop-player-runtime`, `tabletop-tactical-preview` | mover próprio token, visualizar alcance/área quando fontes permitirem, consultar repertório e chamar VP | jogador não controla token alheio |
| **Arquivos e handouts** | `tabletop-master-handout-service`, `tabletop-handout-viewer`, `tabletop-rich-media-runtime` | handouts com público definido, imagem/documento/áudio permitido, leitura sem baixar segredo | revelação parcial e revisão de acesso |
| **Confiabilidade e performance** | `tabletop-preflight-bridge`, `tabletop-adaptive-performance-bridge`, `tabletop-reliability-editor-bridge`, `tabletop-spatial-streaming` | diagnóstico, nível de qualidade, watchdog de canvas, carregamento progressivo | não engasgar em mapa grande/3D |
| **Histórico e conflito** | `command-history`, `tabletop-scene-fingerprint-guard`, `tabletop-urgent-reconciliation-bridge` | desfazer/refazer quando aplicável, revisão de cena, conflitos de persistência e resolução auditável | sem perder edição recente de outro usuário |
| **UI e repertório da Mesa** | `tabletop-view-bar`, `tabletop-composition-panel`, `tabletop-visibility-panel`, `tabletop-placeables-inspector-bridge` | controle completo exposto pela escolha de modo e seleção, nunca removido por novo chrome | abrir todos os editores sem overflow |

**Atenção:** a documentação `docs/tabletop-workspace-map.md` descreve proprietários de estado e localiza bridges, mas uma bridge listada não é prova de funcionamento ou de backend concluído. Se um export estiver sem implementação, registrar como lacuna/legado, não declarar que “já funciona”. A V2 deverá mostrar **estado real de disponibilidade** para todas as funções.

## 19.4. Intervenção TdV II sobre a Mesa

A interação com o mundo é uma sequência: **selecionar → declarar → consultar VP → resolver se houver teste → confirmar consequências → projetar estado permitido**. A Mesa não deve criar Motor paralelo; usa o mesmo serviço de resolução e DTO de ocorrência. Quando um token representar personagem, o comando Intervir abre sua VP com alvo e cena já preenchidos, **sem** copiar a ficha completa para o cliente de todos. Quando a intervenção nasce na VP, um alvo selecionado na Mesa pode ser resolvido por referência estável. Após confirmação, aplicar a mudança exata à ficha/entidade/oposição/estado de cena.

A extensão geométrica de uma expressão (círculo, segmento, polígono, cone, trajetória) pode ser pré-visualizada **somente se a fonte efetiva tiver alcance/área**. Não inventar regras de grid, dano por área ou alcance genérico para Tramas que são narrativas. Converter unidades com a grade/projeção da cena, respeitando escala e níveis; o preview não é uma autorização de resultado. Bloquear alvo invisível/inacessível segundo permissões e a ficção, não apenas por pixel.

**Posição ≠ coordenada:** Favorecida, Disputada e Exposta pertencem à relação personagem/frente/oposição. Um token num quadrado alto não recebe Posição Favorecida automaticamente; um personagem pode estar Exposto em uma frente e Favorecido em outra. O visor de Posição mostra **perante quem e por quê**, com período de validade. **Pressão, Urgência, Tensão e Equilíbrio** são trilhas diferentes, nem uma cor nem um marcador global único.

**Round:** contadores públicos podem ser projetados em tokens vinculados, como já existe parcialmente no TdV II; o Work deve especificar mão dupla segura, sem inventar que projeção pública atual é uma transação bidirecional. Gastar Impulso/Resposta exige ação válida, autorização, versão e persistência; em sessão offline preservar proposta e não fingir confirmação. Uma intervenção de custo 2 Impulsos usa um acontecimento único e não duplica consequência. Uma Resposta só existe antes do desfecho quando apropriado; a UI deve tornar essa janela inequívoca.

## 19.5. Preparação e representação espacial de situações não táticas

A **Superfície de Cena A3** física usa quatro campos: Foco, Oposição, Passagem e Resto. Na Mesa, implementar **modo de situação abstrata** com os mesmos conceitos apenas como apoio, sem tornar obrigatório um mapa de quadrados. A disposição pode ser um campo central com linhas de relação entre Foco e Oposição, Passagem como canal de acesso, Resto na borda de consequência. O usuário pode inserir entidades, anotações, cartas, evidências e posições relativas, com geometria não métrica e sem falsa distância tática. Se alternar de mapa tático para superfície abstrata, oferecer duas vistas/representações da mesma cena, **não** converter coordenadas de maneira destrutiva.

**Handouts:** revelar documento, som ou imagem como peça de cena; audiência pode ser grupo, personagem, mestre; revisão e retirada de acesso são operações explícitas. O estado “publicado” deve aparecer no painel do Mestre e ser recuperável em histórico. Um documento de investigação pode ter camada perceptível e camada reservada, sendo entregues como DTOs diferentes ao cliente do jogador.

## 19.6. Composição de cena e motion

**Aproximação de foco:** a câmera pode suavemente recentrar entidade solicitada pelo Mestre; não sequestrar câmera pessoal do jogador sem consentimento. **Nova frente:** linha fina e texto surgem na margem de situação, não sobre o meio do mapa. **Consequência no alvo:** um Revérbero só no token/objeto alterado e no friso de evento, com restrição de audiência. **Revelação:** neblina altera área visível conforme serviço de visibilidade, sem expor antes entidades secretas em renderização oculta. **Mudança 2D/3D:** transição de câmera controlada sem perder coordenadas selecionadas. **Conflito de edição:** congelar operação específica, mostrar qual revisão mudou, oferecer reconciliação, sem perder desenho temporário.

**Qualidade:** desligar pós-processamento caro em dispositivos fracos, limitar draw calls e SVGs simultâneos, compartilhar texturas de entidades, usar LOD/streaming em modelos, prever WebGL context loss e restauração, cancelar trabalho de efeitos ao desmontar. Performance de mapa tem precedência sobre decoração.

# 20. PAINEL DO FIO~MESTRE — BANCADA DE CONDUÇÃO, NÃO DASHBOARD

## 20.1. Natureza dupla: preparar e conduzir

O Painel possui **dois estados estruturais** que compartilham dados: **Preparar** (campanha, personagens, cenas, NPCs, ameaças, investigação, arquivos e operações) e **Conduzir** (cena ao vivo, tempo, intervenção, participantes, oposição, evidências e consequências). Não misturar a árvore inteira de campanha com a operação urgente de uma Resposta. A vista padrão deve respeitar a última atividade do usuário e ter retorno claro à navegação completa — o site atual já conserva a campanha/abas legadas e essa amplitude não pode ser reduzida.

### Mestre em condução — desktop

```text
┌─────────────────────── CENA / CAMPANHA / SESSÃO ───────────────────────────────┐
│  Preparar  [CONDUZIR]  Revisar     [Publicar] [Revelar] [Mesa] [Salvo/pendente]│
├───────────────────┬───────────────────────────────────┬──────────────────────┤
│ PARTICIPANTES     │ FRENTE / SITUAÇÃO ATIVA           │ OPOSIÇÃO E SEGREDO   │
│ ordem de atuação  │ objetivo • acesso • risco        │ ameaça / intenções  │
│ 2 Impulsos / Resp.│ pressão • urgência • estado      │ defesas • vulnerab. │
│ recurso apenas    │ evento / autorização             │ fatos e dependências│
│ quando necessário │ [avançar cena / propor mudança]  │ [abrir dossiê]      │
├───────────────────┴───────────────────────────────────┴──────────────────────┤
│ ATRITO / CONSEQUÊNCIAS / REVELAÇÕES  ▷  Resto, condições, evidências, notas   │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Visual:** bancada escura, leituras e papéis marfim/metal, uma linha da frente em evidência; a lista de participantes deve parecer uma fita ordenável, não tabela estreita. Uma oposição selecionada abre um **dossiê de ameaça com silêncio visual**, só seus campos relevantes e os efeitos de frente; dados privados do Mestre não aparecem em modo de projeção.

**Mestre no mobile:** a prioridade é `Cena` com contadores e uma grande ação contextual `Intervir`. Fitas `Participantes`, `Oposição`, `Revelações`, `Arquivo` abrem por seleção; apenas uma folha de operação profunda por vez. O Mestre consegue registrar rolagem, gastar Impulso, revelar handout, alterar Pressão e salvar Resto sem procurar um botão num catálogo de 1000px. O painel de composição de cenário complexo deve ficar disponível, mas pode recomendar desktop sem **bloquear** ações essenciais.

## 20.2. Roteiro da cena, tempo e risco

**Scene Head:** nome, objetivo/ponto em jogo, situação de início, oposição, condição de término, Resto, data de sessão e notas privadas. A cena possui histórico e revisões; ações de abrir, arquivar e concluir são explícitas. **Frentes de Pressão:** cada uma tem fonte, objeto, escala 0–4, causa observável da mudança, condição de Ruptura, consequência se completar, audiência; várias frentes podem coexistir sem se unirem a uma barra geral. **Compasso de Urgência:** comprimento configurável 3–8 casas e disparador real; ao completar altera mundo/situação, não apaga pistas. **Tensão/Equilíbrio:** da pessoa ou relação pertinente, não confundidos com frente. **Posição:** relativa a uma oposição identificada. **Acompanhamento de ação:** dois Impulsos/Resposta por rodada, custo de dois quando permitido, iniciativa Cadência + Alinhavo Iniciativa e critérios de desempate; manter possibilidade de iniciativa manual quando a mesa preferir.

**Ações rápidas do Mestre:** criar uma frente; declarar risco; rolar oposição; aprovar proposta do jogador; gastar/reservar resposta quando aplicável; aplicar consequência; mudar Posição; avançar Urgência com causa; registrar Resto; vincular evidência; conduzir operação; trocar cena; iniciar próxima rodada; guardar síntese; reabrir histórico. Mostrar **resultado antes do commit** quando afeta fichas e audiência, incluindo alvos múltiplos.

## 20.3. NPCs, Figurantes, Adversários e Ameaças

Cada classe tem forma informacional própria. **Figurante:** identidade e função narrativa, vínculo/objetivo, modo de interação, nenhum preenchimento de ficha completa obrigatório. **Adversário:** intenção, capacidade relevante, ação característica, Fios de intervenção, defesa pertinente, Guarda/recursos apenas se importarem, consequência e saída; pronto para uma oposição. **Ameaça:** estrutura persistente, dependências/vulnerabilidades, Magnitude 0–4 como escala estrutural, custos/condições de acesso, efeitos sobre frente, continuidade e condição de término. A Magnitude não se converte em bônus universal nem substitui a pergunta “como isto pode ser enfrentado?”.

**Dossiê de ameaça visual:** nome no topo, intenção em prosa, esquema de dependências logo abaixo, três instrumentos laterais pequenos (capacidade, pressão/continuidade, complexidade de resolução). Esses três eixos servem **à análise do mestre**, não viram sistema novo de pontuação. Um “nó vulnerável” só fica visível para jogadores quando revelado. Para ameaças sem PV, mostrar condição de derrota/ruptura; para ameaça física com recursos, mostrar recursos derivados/registrados. Não obrigar HP em ameaças conceituais nem balancear encontros por soma antiga de Rank.

**Catálogo:** organizar NPCs, ameaças, monstros antigos e presenças de campanha; converter só com confirmação, preservar nomes/IDs/anotações e não transformar equivalentes aproximados em dados TdV II. Em biblioteca de modelos, diferenciar `modelo`, `instância`, `ocorrência na cena` e `página do Nexus` com links estáveis.

## 20.4. Investigação e revelação

**Visual de investigação:** teia documentada que nasce de uma pergunta; pistas fundamentais acessíveis ficam num trilho principal de **percepção**, com caminhos de aprofundamento dependentes de ação; hipóteses dos jogadores aparecem em camada claramente **proposta**; informações reservadas habitam a bancada privada, nunca o DTO público. Cada evidência inclui origem, aparência, conteúdo perceptível, camada profunda (se houver), quem recebeu, qual hipótese sustenta/contesta, data, cenário, estado de publicação. **Não** criar teste obrigatório para pista fundamental que já está ao alcance.

**Operações:** revelar a um jogador, revelar ao grupo, apresentar como handout, ligar à cena, adicionar interpretação, registrar contestação, atualizar hipótese, citar no Nexus, marcar como confrontada. Prever ações reversíveis no nível da **visibilidade futura**, mas sem apagar o fato de que alguém já viu um documento; registro histórico de divulgação é crucial. Ao trocar de jogador para Mestre, viewport é distinta; nunca só CSS para esconder conteúdo.

## 20.5. Selagem, Canalização e operações prolongadas

**Selagem:** instrumento de preparação em forma de cadeia aberta — Diagnóstico, Acesso, Tecitura, Fixação, Resto/Permanência. A UI apresenta esses conceitos como **etapas de descrição**, nunca como cinco testes obrigatórios, cinco custos ou progressão temporal universal. Vincular suporte, participantes, efeito esperado, condições, dependências, riscos, assinatura e manutenção. Regras explícitas definem testes reais; se a ficção resolve uma etapa diretamente, registrar sem rolar.

**Canalização:** Aproximação, Tração/Puxagem, Tecitura, Expressão, Relaxamento; a expressão pode ser direta, rolada, sustentada e interrompida conforme circunstância. O sistema deve vincular `pullEventId`, janelas já pagas, custo PE/PI, sustentação, estado Relaxada/Interrompida e Refluxo, mantendo o mesmo evento de custo para impedir cobrança dupla. Uma expressão sustentada tem **cronologia de janelas concretas**, não cronômetro universal de manutenção.

**Prolongadas e coordenação:** sequência de mudanças verificáveis, acesso, objetivo, etapas cumpridas, contribuições e histórico; falha não apaga progresso anterior; êxito que abrange duas etapas precisa da margem elevada e de uma ação que realmente alcance ambas — do mesmo modo que motor atual em operações; não distribuir etapas por clique sem declaração. **Perseguição:** trajeto, objetivo e acesso/rota/diferença relativa, sem supor grade tática ou velocidade fixa para todas as cenas.

**Apresentação:** um único tear de operação com “passado / presente / dependência / resolução” e duas camadas de visualização: operacional curta e dossiê completo. A linha não fica automaticamente “verde” porque etapa foi preenchida; mostrar resultado, evidência e condição de saída.

## 20.6. Sessão, história e interlúdios

Não deixar o Mestre perder o que o painel antigo oferece: **sessões, folhas de condução, notas, pistas, NPCs, monstros/ameaças, investigação, interlúdios, fissuras e dobras, cenas, arquivos, manuais, iniciativa manual, parâmetros de edição legada e ajustes de campanha**. Esses grupos merecem navegação completa no modo Preparar e busca global. `Salvar sessão` é operação durável: não pode ser condição exclusiva para registrar histórico se ações intermediárias já foram confirmadas, nem apagar outras trilhas. O ato de fechar cena gera uma **revisão curta**: mudanças ainda não aplicadas, divergências físicas, condições, pistas/revelações, vínculos, operações sustentadas, Resto, próximos acessos. Síntese para mestre, grupo e pessoa são **publicações distintas** filtradas por permissão.

## 20.7. Divulgação, pré-visualização e confiança

Toda ação pública possui seleção de audiência **antes** de revelar conteúdo; preview “o que o jogador verá” deve ser construído da mesma projeção segura que seria entregue ao público, não de dados completos mascarados. Distinguir **rascunho local**, **salvo no Mestre**, **publicado ao grupo**, **revelado a pessoa**, **registrado no Nexus**. Mudança de Pressão privada não deve aparecer na Mesa porque houve broadcast genérico; revelar uma ameaça não entrega os detalhes secretos de suas dependências. Se a transmissão falhar, deixar evento pendente e oferecer retentativa idempotente.

# 21. NEXUS E ARQUIVO — UMA TEIA EM QUE CADA NÓ TEM HISTÓRIA

## 21.1. Distinções de conhecimento

O Nexus deve oferecer ao menos: **(a)** normas e documentos canônicos; **(b)** cosmologia, tratados e fontes do cenário; **(c)** arquivos diegéticos; **(d)** registros de personagem e situação; **(e)** evidência perceptível; **(f)** hipóteses/teorias; **(g)** decisões confirmadas; **(h)** documentação reservada do Mestre. Etiquetar *natureza do conhecimento* e *audiência* separadamente: um documento canônico pode ser público, uma hipótese pode ser privada e um testemunho pode ter conteúdo enganoso sem se converter em fato. Pesquisa, grafo e busca precisam respeitar essa distinção.

## 21.2. Composição: biblioteca, leitura, relações

Desktop: um índice/pastas discreto à esquerda, **fólio de leitura no centro**, painel de relações à direita que se recolhe; grafo pode assumir foco completo quando a tarefa é cartografia, mas a prosa continua acessível por seleção. A moldura alterna Papel/Tinta no fólio e Vazio/filamentos na camada relacional. Não posicionar cada nó como globo brilhante da mesma cor e tamanho. Usar diferença de espessura de aresta por categoria **apenas quando semanticamente definida**; rótulo de relação sempre disponível.

Mobile: busca e campo de leitura dominam; grafo abre como mapa local de 1–2 saltos com legenda e foco, não como rede total minúscula. As relações importantes podem aparecer como **caminho textual** entre dois nós, reduzindo custo cognitivo. Árvore de pastas, biblioteca e grafo continuam três visões da mesma coleção, não três bancos de dados.

## 21.3. Entidades e conexões

Famílias: personagens, NPCs, ameaças, locais, facções, objetos, armas, relíquias, tramas, lavores, fragmentos, selos, cenas, acontecimentos, pistas, documentos e Marcos. A mesma entidade pode aparecer na Mesa como token, no Mestre como registro privado e no Nexus como página pública **quando revelada**; usar IDs estáveis e relações tipadas (`localizado_em`, `participa_de`, `contradiz`, `evidencia`, `sustenta`, `depende_de`, `transformou`, `revelado_para`, etc.). Não gravar relação ficcional nova por semelhança algorítmica de termos, nem publicar segredo por link automático.

**Proveniência:** registrar autor, fonte, versão e status para cada relação importante. Uma linha entre dois nós pode ser “hipótese de X” e outra “fato aprovado”, coexistindo sem colapsar numa verdade única. Relações profundas continuam pesquisáveis por filtros e acesso. A ficha preserva Vínculos com estados canônicos, mas o grafo não substitui o procedimento mecânico de Abrir/Sustentar/Cobrar.

## 21.4. Continuidade e consulta contextual

O Nexus recebe uma ocorrência **durável** aprovada e produz entrada de linha do tempo apenas no escopo permitido. Um Resto pode estar ligado a cena, lugar, objeto e personagem; uma sessão posterior que abra um desses nós recebe indicação contextual “relaciona-se ao acontecimento X”, não um efeito automático. A consulta do livro durante VP/Mesa usa janela de referência com nome da seção, fonte e versão exata; uma fonte da edição anterior mostra aviso antes de aplicar regra incompatível. **Não** construir recomendador mágico de ações canônicas nem depender de IA paga; busca textual, índices e relações explícitas já dão enorme valor.

## 21.5. Conservação do Nexus atual

Preservar: pastas, páginas, templates, bibliotecas, árvore, grafo, busca, filtros, rascunhos, leituras, links de ficha, links de Mesa, importação/exportação, versionamento e acessos. Reutilizar serviços de conhecimento e grafo já presentes; não criar um “Nexus V2” paralelo com componentes copiados. Os comandos de arrastar entre Nexus, Ficha e Mesa devem continuar seguros e com indicação clara da origem e destino. Relações automáticas do sistema exigem autorização de escrita e audiência.

# 22. MOTOR, MECÂNICAS E FRONTEIRAS — MATRIZ DE INTEGRIDADE V2

Esta seção é **checklist técnico de verificação**, não um livro de regras alternativo. Para casos duvidosos, abrir a seção exata da cópia mais recente do Livro II e documentar expectativa/teste. O Work não deverá criar tabelas suplementares para preencher lacunas normativas.

| Família | Obrigação funcional completa | Risco clássico de implementação | Contrato de teste |
|---|---|---|---|
| Arquitetura | quatro raízes Pessoa, Ação, Situação, Transformação; Relação transversal; intenção, abordagem e Ponto em Jogo | criar “quinta raiz” ou rolar sem risco | navegação e Motor não alteram a definição |
| Feição | Origem, Ofício, Convicção, Limite, Marca, Vínculos e Âncora | repetir Ofício como Alinhavo, bônus por Convicção | criação, edição, vínculos e eventos funcionam sem bônus arbitrário |
| Marca | Gatilho, Manifestação, Resíduo | tratar como maldição/paranormalidade universal | Marca não manifestada é válida quando permitido |
| Vínculos | Nó, Natureza, estados, Oferta, Demanda, Tensão, Abrir/Sustentar/Cobrar | converter relação em +1 fixo | evento de relação muda contexto, não dado arbitrário |
| Âncora | Ancorar Sustentar/Redirecionar; consequência continua; Âncora Abalada; Reassentar por ação relevante | cancelar consequência, “resfriamento por rodada” | impacto e Resto registrados, reuso exige reassentar |
| Constituição | 4 Matrizes, 21 Alinhavos, distribuição inicial, dados canônicos | transportar atributos antigos; gerar d20 comum | validação antes de ready, excepcional explícito |
| Recursos | máximos PV/PI/PE, atuais, custo, fonte, recuperação | misturar PV/PI/PE; recuperar em loop | fórmulas e janelas testadas |
| Defesa e Guarda | Resistência/Evasão/Lucidez/Firmeza; limiar único; proteção expressa; cobertura total | armadura dá RD automaticamente; 2 defesas somadas | um cálculo por evento e fontes justificadas |
| Dois Fios | Prumo, Tento, Enlace, Ascendente, Retorno, Desvio, Consonância, dupla unidade | usar só soma, gerar bônus da Consonância | enumerar todos pares de dados suportados |
| Proveitos | Proveito/Desproveito por Fio, fontes e compensação | +1 no resultado final; empilhar sem limite | cada fonte presente, alteração só no dado |
| Forçar | avanço de Fio, custo 1 PE e transição d12→d20 com regra/custo excepcional, 0 PE só quando permitido | d20 livre, Forçar grátis repetido, custo de Trama dispensado | casos d12/d20, PE 0 e contrapartida |
| Rolagem | digital e física alimentam mesma leitura; originals não mudam | dados digitados diferentes, rerrolar silencioso | equivalência de resultados/faces |
| Repetição | intervenção idêntica só com mudança real da situação | permitir spam até sucesso | assinatura de contexto e mudança significativa |
| Redobra | nova continuidade sem refazer dados/custo | segunda rolagem com prêmio | evento novo ligado ao teste original |
| Disputa | confronto por leitura canônica e decisão de empate | empate sempre como vitória | tabela de comparação testada |
| Auxílio | Prumo protagonista + Tento auxiliar compatível, dois dados e justificativa | rolar terceiro dado / usar melhor de dois sem regra | resultados com helper x sem helper |
| Cooperação | contribuições distintas e resultados preservados | somar Enlaces ou apagar fracasso alheio | operações com participantes paralelos |
| Operações | prolongadas, Coordenação, Perseguição, mudança verificável, etapa já cumprida | todo estágio exige rolagem, falha apaga progresso | ficção direta e teste na mesma operação |
| Ação de cena | 2 Impulsos + 1 Resposta/rodada, custo 1/2, iniciativa Cadência + Iniciativa | três ou mais respostas, movimento grátis universal | rodada, consumo, reinício, ordem e manual |
| Posição | Favorecida/Disputada/Exposta em relação a frente definida | Posição derivada de x/y do mapa | mesma coordenada pode ter relações distintas |
| Pressão | frentes 0–4 com Fonte, Objeto, Escalada, Ruptura | avanço automático por todo fracasso | causa obrigatória para avançar |
| Urgência | compasso 3–8 independente, altera mundo ao completar | apagar pistas ou confundir com Pressão | fechamento conserva achados |
| Conflito físico | dano 1–3 ou fonte singular, manobra, proteção, consequência principal, Guarda | PV/PI duplo, RD inventada, crítico duplicado | cenários de dano, manobra e estado |
| Tensão/Equilíbrio | acumulação Tensão até ±4, deslocamento Equilíbrio e reset; eixo −10/+10 | moralidade, bônus, acumular excedente sem regra | limiares ±3→±4; validação de saltos |
| Condições | Nome/Origem/Efeito/Saída/Intensidade Leve/Grave/Crítica | nível vira penalidade universal | alterar intensidade sem recalcular inventos |
| Estados | 0 PV/À Beira; 0 PI/Colapso; 0 PE; Matriz Abalada, Âncora Abalada, Guarda Quebrada | relógio de morte, cura instantânea de Marca | protocolos e ações autorizadas |
| Recuperação | Pausa breve, Repouso profundo, Recuperação plena, janelas reais e requisitos | repetir sem perigo novo; curar PI sem reconstruir | 3 profundidades e janela única |
| Objetos | arma com seis campos canônicos; Integridade Apto/Danificado/Inutilizado; porte, acesso, reparo | slots/HP genéricos e habilidades herdadas | item muda de estado sem perda de fonte |
| Preparo | gesto/gatilho/mudança/consumo, sem acúmulo universal | aplicar bônus automático em todo teste | gatilho usado uma vez conforme regra |
| Lavor | quatro Vertentes, incorporação, uso e custos canônicos | toda carta dá poder, “classe” inventada | comprado/incorporado x apenas registrado |
| Costura de Malha | práticas de Vertentes diferentes, contribuição, limitação, preço e efeito próprio | confundir com Cooperação | fluxo de Malha independente de múltiplos testes inventados |
| Trama | acesso, Puxagem, Tecitura, Expressão, sustentação, Relaxamento, Refluxo, Assinatura | 5 testes obrigatórios e Refluxo universal | custo por acontecimento/janela única |
| Selagem | Diagnóstico/Acesso/Tecitura/Fixação/Resto; dependência/manutenção | DT por etapa ou “Cargas” sem fonte | etapas conceituais e eventos reais |
| Fragmentos | origem, suporte, uso, conservação, função e Assinatura | reparo restaura magia automaticamente | reparo material separado de função |
| Reputação | Rede/Imagem/Peso/Cobrança com acontecimentos | Peso = Rank ou bônus em Persuasão | acesso na ficção sem modificador implícito |
| Reconhecimento | 20 Marcos, 5%/2 PU, investimentos Matriz/Alinhavo/Lavor/Ampliação e incorporação | XP por sessão, compra sem Marco | PU reconhecido/gasto/disponível reconciliado |
| Ameaças | Figurante/Adversário/Ameaça, Magnitude 0–4, estrutura, vulnerabilidade, condição de término | orçamento universal de combate Rank | perfis sem PV também concluíveis |
| Investigação | pista fundamental com acesso, aprofundamento opcional, hipótese/conflito | rolagem barra pista essencial | jogadores recebem a pista em acesso válido |
| Publicação | camada pública x privada, evento/mudança aprovada | segredos no JSON ocultos por CSS | testes com usuário sem cargo |
| Físico-digital | prancha, cartas, marcadores, diário e teia; reconciliação humana | sincronização alegada sem input | conferência manual e ausência de dupla cobrança |

### Critérios de não invenção: exemplos explícitos

- A interface **pode** destacar a Matriz que o jogador escolheu; **não pode** escolher automaticamente a Matriz “mais alta” e chamá-la de permitida em qualquer abordagem.
- **Pode** lembrar que condição Grave existe; **não pode** inferir −2 em todos os testes por essa intensidade.
- **Pode** sugerir consultar uma carta da coleção; **não pode** presumir acesso à Trama por possuir sua miniatura visual.
- **Pode** mostrar mapa com grid; **não pode** transformar cada passo espacial em custo de Impulso universal.
- **Pode** oferecer que o Mestre avance Pressão; **não pode** avançar Pressão em toda falha de dados.
- **Pode** desenhar Linha da Teia; **não pode** criar relação canônica somente porque duas páginas compartilham palavras.
- **Pode** fazer cálculo de probabilidade; **não pode** classificar ação ficcionalmente inacessível como disponível por sua chance numérica.


# 23. SISTEMA TÉCNICO INTEGRADO — AUTORIDADES, EVENTOS, TRANSAÇÕES E VISTAS

## 23.1. Arquitetura recomendada sem criar uma aplicação paralela

O Tadeon já possui separação de domínios: `src/lib/tdv2.ts` (estado canônico da personagem, constituição e teste), `tdv2-play.ts` (procedimentos), `tdv2-master.ts` (estado de condução), `tdv2-operations.ts` (operações), `tdv2-round.ts` (projeção pública), `src/components/sheet/*`, `src/components/master/*`, `src/lib/tabletop/*`, `src/components/tabletop/*`, serviços de conhecimento, Supabase/RLS e CSS com proprietários documentados. A V2 **não** propõe uma segunda biblioteca de regras ou uma “ficha do VP” independente. Propõe uma camada **única de orquestração, ocorrência, projeção e permissão**, integrando módulos existentes.

### Responsabilidades, sem sobreposição

| Camada | É proprietária de | Não deve possuir |
|---|---|---|
| **Livro/catálogo normativo** | regras e fontes versionadas, referências | dados secretos/estado de cena mutável |
| **Motor TdV II** | cálculo, validação e proposta de alterações compatíveis | audiência, CSS, estados de janelas e network retry |
| **Ficha** | `tdv2_data` do personagem, metadados, editor e revisão | estado de token, iniciativa global ou “pontos VP” |
| **Orquestração de ocorrência** | identidade da ação, autorização, commit e idempotência | cópia permanente de todo o estado de cada área |
| **Mestre/sessão** | cena, frentes, participantes, oposição, segredos, rodadas | reimplementação de fórmulas da ficha |
| **Mesa** | geometria, entidades, visibilidade, movimento e projeção | cálculo alternativo do Motor e leitura de dados privados |
| **Nexus** | nós, textos, relações, proveniência, publicação | autoridade automática para modificar recursos |
| **VP** | composição e rascunhos da interação de jogo | banco próprio do personagem, atualização sem confirmação |
| **Kit físico** | estado observado/transitório, sem API | sincronização automatizada fictícia |

## 23.2. Modelo de ocorrência tipado e imutabilidade lógica

Uma intervenção precisa de um **ID estável**, `campaignId`, `sessionId`, `sceneId`, ator, personagens/entidades afetados, origem do comando, fontes normativas e recursos, audiência, estado e revisão. Fases: `rascunho → proposta → pendente de autorização → aprovada → aplicada` ou `recusada/cancelada/conflito`; a existência de fases é produto, não regra de RPG.

**Separar três coisas**: (a) descrição do que jogador pretende; (b) leitura matemática do resultado; (c) conjunto de alterações efetivas. Uma leitura de Enlace pode existir sem mudança aplicada; uma mudança de cena pode ocorrer por ficção direta sem dado. Não persistir `changes: any` como um passe livre: usar DTO discriminado por `type`, validação Zod/servidor, escopo permitido e fonte; cada mutação sabe qual revisão leu e quais recursos pode alterar. Possíveis famílias: `TEST_RESOLVED`, `RESOURCE_CHANGED`, `ROUND_SPENT`, `POSITION_CHANGED`, `CONDITION_CHANGED`, `GUARD_CHANGED`, `EXPRESSION_STARTED`, `EXPRESSION_SUSTAINED`, `EXPRESSION_RELAXED`, `LINK_CHANGED`, `ANCHOR_CHANGED`, `ITEM_INTEGRITY_CHANGED`, `PRESSURE_CHANGED`, `URGENCY_CHANGED`, `EVIDENCE_REVEALED`, `REST_RECORDED`, `MILESTONE_RECOGNIZED`, `PHYSICAL_RECONCILED`. Nomes finais podem ser ajustados aos serviços existentes, preservando versionamento.

**Assinar semanticamente** o pedido com `requestId` para idempotência; `eventId` para custo já debitado; `sourceRevision` para CAS; `authority` para quem confirmou; `auditAt`/`timestamp` para memória; `projectionVersion` para canais. Em eventos de custo e estado crítico, **uma única RPC transacional** deve validar autoria, ficha, saldo, rodada e mudanças antes de gravar. Se a ação for repetida por retry, retornar o mesmo resultado aplicado sem gastar novamente.

## 23.3. Três leituras de uma única ocorrência

1. **Documento mestre completo**, com fontes privadas, intenção e decisões autorizadas. Nunca serializá-lo integralmente para o jogador.
2. **Projeção de personagem/jogador**, incluindo dados pessoais e fatos compartilháveis, sem dependências ou pistas privadas do Mestre.
3. **Projeção pública da Mesa**, com somente estado renderizável: token, sinalização pública de rodada/posição, efeitos visíveis, texto permitido, referências mínimas e revisão.

A filtragem é **server-side**. RLS/Supabase Edge Functions devem fazer cumprir acesso, não confiar na variável visual `isMaster` passada pelo React. `realtime` envia somente ID/revisão ou projeção já autorizada; a UI do jogador busca o novo estado filtrado, sem receber snapshot mestre. Testar dados no tráfego de rede, não apenas ausência no DOM. A simulação de audiência do Mestre deve fazer a mesma consulta segura com identificação de papel.

## 23.4. Reconciliar granularidade de ficha e Mesa

A ficha atual persiste `character_sheets.tdv2_data`, a condução `game_settings.tdv2_state`, a Mesa seus próprios snapshots e `tdv2_round`. Não copiar integralmente o estado da ficha para o token. Para cada evento, registrar origem, alvos e projeções. Ao modificar PV, atualizar a ficha; o token pode refletir **somente** um estado público autorizado, se a campanha o decidir. Ao alterar geometria, atualizar a Mesa; não reescrever histórico de personagem. Ao registrar Resto, publicar no Nexus **após** confirmação e checagem de audiência. Um mesmo evento pode modificar múltiplas entidades; usar transação sempre que consistência atômica for obrigatória e explicitar quando uma projeção é eventual.

## 23.5. Compatibilidade e migração sem perda

**Edição:** `rules_version` precisa permanecer identificável em listagens, links, backups e exportações. `power_form_enabled`/`power_form_data` são históricos e não autorizam VP II; preservar leitura da antiga Forma de Poder. A edição antiga mantém seus PS/PA/Rank/Exposição/métodos sem contaminar II. A ficha II não assume equivalência automática a partir de atributos antigos, inventário ou danos. Conservar todos os campos legados que não possuem equivalência mecânica num dossiê de continuidade com origem explícita.

**Plano de migração:** criar tabelas/campos aditivos; gerar cópia de segurança e restaurar em ambiente de teste; verificar FKs e RLS; validar 0–N instâncias por campanha, sessão, ficha e token; fasear rollout por flag; preservar URLs já distribuídas; oferecer migração revisável sem escrita massiva em usuários. Nenhuma operação de leitura deve mutar automaticamente uma ficha histórica. `AGENTS.md`, `docs/PROJECT_MAP.md`, `project-continuity.json`, `style-architecture.json` e `docs/tdv-ii-*` têm contratos existentes: seguir seus respectivos proprietários em vez de gerar documentação concorrente.

## 23.6. Offline, concorrência e resolução de conflitos

**Quatro estados de persistência visíveis:** `local sem aplicação`, `aguardando envio`, `confirmado pelo servidor`, `conflito/erro`. Um rascunho em modo offline **não** consome Impulso no servidor nem revela um handout; pode guardar intenção, valores de dados físicos e notas para revisão. Ao reconectar, revalidar ficha/rodada/cena/autorizações. Se a autorização mudou, apresentar conflito contextual com alternativas: revisar, guardar rascunho, cancelar. Recursos e custos não podem usar last-write-wins. Dados narrativos podem receber merge assistido por campos quando seguro, mas jamais sobrescrever notas sem revisão.

**Exemplos testáveis:** dois dispositivos gastando 1 PE no mesmo instante; Mestre avança rodada quando jogador declara Resposta; usuário fecha VP enquanto resultado está pendente; sinal cai após servidor confirmar mas antes do cliente receber ACK; um mesmo evento de custo é retransmitido; carta/Trama é alterada entre consulta e confirmação; jogo físico conferido após mudanças digitais. Cada um precisa resultado consistente e caminho de recuperação legível.

## 23.7. Arquivamento de cena antes de limpar estado transitório

O Work deve inspecionar cuidadosamente qualquer ação existente de “Encerrar cena” que apaga `scene.tests`, `paidEvents`, flags `forcedAtZero`, estados temporários e dados de repetição. O correto é **arquivar primeiro os acontecimentos que mereçam continuidade**, publicar apenas o que foi autorizado, gerar checkpoint, fechar janelas de sustentação segundo regra e somente depois reiniciar os controles transitórios apropriados. Não carregar dívida de PE ou bloqueio de repetição para cena nova se o livro determinar reinício; tampouco apagar o evento histórico que prova a origem da alteração. **Não arquivar automaticamente segredos junto com resumo público.**

## 23.8. Operação, ambiente e custos

Reaproveitar GitHub + Cloudflare + Supabase e os componentes existentes. O produto não deve depender de API paga, serviço de IA por uso, processamento desnecessário de mídia ou consulta comercial para funções essenciais. CDN, armazenamento e banco devem possuir limites e observabilidade proporcional ao plano gratuito utilizado; antes de integrar mapas/áudio/modelos, verificar permissões, cotas e fallback offline. Erros e ações do usuário precisam de telemetria sem dados sensíveis de história e fichas; logs não devem gravar tokens de acesso, textos secretos ou notas pessoais completas.

## 23.9. Acessibilidade e qualidade de interação

- Todos os modos operacionais acessíveis por teclado, toque e leitor de tela: navegação, drag/drop alternativo, menus radiais, seleção de dados, folhas e flutuantes. Esc/foco/retorno após fechar são obrigatórios.
- Áreas de toque adequadas, contraste mensurado, texto ampliável, alto zoom e baixo movimento. Não usar cor sozinha para os Fios ou a intensidade de condições; forma e rótulo acompanham.
- `aria-live` distingue status de salvamento, mudanças remotas e resultado, sem anunciar cada frame do motor gráfico. Rótulos são nomes reais de controles, não ícones sem legenda.
- Animação de rolagem admite saltar e modo sem movimento; fonte da informação e número final permanecem acessíveis.
- Tabelas grandes possuem modo de leitura e busca, não dependem de rolagem horizontal em celular; o foco permanece dentro de diálogo modal e retorna à origem.
- Imagens, retratos e mapas possuem texto alternativo funcional quando necessário. Canvas complexo tem lista/árvore textual alternativa de entidades e ferramentas prioritárias.
- Não automatizar voz/áudio, vibração ou alertas sonoros sem opção e consentimento de sessão. Evitar áudio espacial sem controle independente de volume e mute.

# 24. FLUXOS REAIS — HISTÓRIAS DE USO COM EVENTOS E LAYOUT

## 24.1. Criação do personagem em 8 movimentos

**1 — Abrir ficha:** fólio de identidade com informação de edição e status de criação. **2 — Escrever Feição:** campos respeitam tipologia própria, sinalizam incompletude sem exibir formulário infinito. **3 — Estabelecer Âncora e Vínculo:** ver grafo focado e requisito sem inventar bônus. **4 — Distribuir Matrizes:** visão de quatro eixos com prévia de dados e recursos. **5 — Distribuir Alinhavos:** quadro de 21 com busca e contagem dos graus permitidos. **6 — Completar repertório/história inicial:** itens e narrativa preservados, referências vinculáveis. **7 — Revisar:** painel editorial aponta pendências por campo, distribuições, custos e inconsistências. **8 — Concluir:** gravação segura e mudança visível de `em preparação` para `pronta`; VP fica disponível. Sem sacrificar campos existentes ou assumir que um retrato é obrigatório.

## 24.2. Intervenção simples sem teste

Jogador seleciona alvo e declara intenção; Mestre reconhece suficiência ficcional; o sistema oferece registrar **apenas a mudança que persistirá**. Se nada durável mudou, a ação fecha sem um evento mecânico artificial. Na Mesa, o jogador pode observar mudança de posição espacial, handout revelado ou outra consequência, mas não verá rolagem inventada. VP retorna ao repouso com opção de nota breve.

## 24.3. Intervenção com Fios e custo

Abrir Agir → declarar intenção/abordagem/ponto → fonte da combinação Matriz/Alinhavo → Proveito/Desproveito → eventual Forçar/Auxílio → revisar custo → rolar digital ou registrar físico → ver os dois dados → Mestre propõe consequência → aprovar/aplicar → persistir ID de custo → atualizar ficha/token/cena públicos quando autorizado → memória e possível Resto. **Teste de regressão:** dados idênticos em VP, painel e ficha; apenas um gasto; retorno do app mantém resultado original mesmo se a rede cai.

## 24.4. Auxílio e Cooperação em cena compartilhada

No Auxílio, o protagonista escolhe a ação e o auxiliar oferece contribuição concreta e Tento compatível; a VP mostra um único Enlace com duas fontes de dado. Mestre valida acesso/contexto. Na Cooperação, dois protagonistas registram contribuições e resultados próprios; a UI mostra os caminhos lado a lado associados a um objetivo comum. Se um falhar, o resultado continua visível e a consequência não é apagada pelo êxito alheio. A Mesa projeta apenas decisões públicas; nunca expõe o conteúdo completo da ficha auxiliar a terceiros.

## 24.5. Uma Trama sustentada atravessando três cenas

Cena A: acesso e Puxagem declarados, custo pago uma vez com origem. Cena A/B: sustentação com janela identificada; o site impede cobrar a mesma janela novamente; efeito em curso continua ligado ao local/personagem. Cena B: novo evento modifica risco, exigindo decisão legítima; não impõe rerrolagem periódica automática. Cena C: Relaxamento ou interrupção registrado, consequência e eventual Refluxo conforme fonte, sem reembolso automático. O Nexus liga eventual Resto ao acontecimento que continua; painel do Mestre mostra o que ainda requer atenção. Reconciliação física confere apenas campos divergentes.

## 24.6. Cena de investigação sem bloquear a história

Mestre prepara pergunta, pistas fundamentais e camadas profundas. Publica um documento comum. Jogador recebe o conteúdo perceptível na Mesa e o link no Nexus. A Teia de Descobertas física recebe hipótese; no digital ela pode ser digitada como hipótese do grupo, não fato. Um teste relevante pode aprofundar, acelerar ou alterar custo/risco, mas não bloquear pista já alcançada. Mestre confirma ou contesta; a hipótese original permanece no histórico. Nova relação abre intervenção futura.

## 24.7. Conflito com Ameaça estrutural e sem PV obrigatório

Mestre define intenção, capacidades, dependências, Magnitude e condição de término. Mesa publica frente e oposição visível, mas oculta vulnerabilidade não descoberta. Jogadores mudam acesso, pressionam pontos estruturais, sustentam recursos e aceitam consequências. A vitória deriva da resolução do objetivo/condição de término, não de reduzir um HP inventado. Um participante sofre condição; sua VP mostra Origem/Efeito/Saída. Ameaça pode ficar ferida/transformada como situação durável, com Resto no Nexus.

## 24.8. Desconexão durante a rodada

Jogador prepara ação; conexão cai antes da confirmação. Estado exibido “rascunho local — ainda não aplicado”; nenhuma animação de sucesso. Mestre avança rodada; ao reconnect, server informa versão; ação fica pendente e requer revalidação. Se já tinha sido aplicada e ACK não chegou, o mesmo `requestId` devolve o commit existente; não consome Impulso duas vezes. Layout de erro preserva intenção e resultado físico digitado.

## 24.9. Encerramento presencial e reconciliação

Mestre chama síntese; cada jogador confere a prancha apenas onde necessário; o site compara valores informados com estado durável. Conflitos são corrigidos por eventos auditáveis. O Mestre escolhe Resto público, privado e de pessoa, atribui causas, fecha sustentação/operações conforme a situação e guarda ganchos. Ao iniciar próxima sessão, as condições, vínculos e consequências persistentes aparecem em contexto, sem reabrir a rodada antiga.

# 25. MATRIZ DE EXPERIÊNCIA POR DISPOSITIVO, PAPEL E ESTADO

## 25.1. Tamanhos de referência para ensaio, não breakpoints cegos

| Viewport / contexto | Registro | VP | Mesa | Mestre | Nexus |
|---|---|---|---|---|---|
| 320–359px | um fólio por capítulo; títulos compactos, editor de texto separado | Motor ocupa tela; ações curtas e dock | canvas predominante, ferramenta única ativa | comando de cena, folhas de operação | leitura e busca, grafo focado |
| 360–430px | capa curta, índice e texto legível | foco em ação; carta em folha completa | mapa quase fullscreen, seleção por toque | cena + participante em uma folha | fólios e relações contextuais |
| 431–767px | módulos lado a lado só quando cabem | instrumento + friso; consultas em overlay | mapa e barra contextual reduzida | operação por etapas sem empilhamento | leitura central e navegação compacta |
| 768–1023px | dois eixos compositivos + margem móvel | Motor e consulta podem alternar | cena + dock; editor dialog | cena e participantes com dossiê rebatível | árvore/folio com grafo em alternância |
| 1024–1439px | atlas de duas zonas com índice lateral | esquerda compacta/centro/consulta | cena 70%+, editor por demanda | três planos com hierarquia | índice/folio/grafo opcional |
| 1440px+ | atlas com respiro editorial e índices | três planos reais, sem esticar textos | palco grande, painel de comando contido | multi-instrumentos em bancada | leitura central com espaço de relações |
| landscape curto | reduzir cabeçalho/rodapé; priorizar leitura | formulário/rolagem sem área perdida | mapa com overlay curto | cena em foco, janelas comprimíveis | fólios escaláveis e busca |
| zoom 200% / fonte grande | truncar metadados, não texto canônico | fechar automaticamente colunas que esmagam Motor | permitir painel flutuante fora do mapa | reduzir simultaneidade sem esconder ferramentas | troca de grafo por lista navegável |

**Regra:** use container queries e conteúdo mínimo real, não apenas media query por resolução total. Largura de viewport não equivale a largura disponível dentro da janela popout.

## 25.2. Papéis e visibilidade

| Papel e contexto | Consultar | Propor | Aplicar | Publicar | Observação |
|---|---|---|---|---|---|
| Proprietário de personagem | dados próprios e compartilhados | ações/edições permitidas | conforme autoridade do recurso e validação | somente conteúdo autorizado | não inspeciona segredos do Mestre |
| Outro jogador | conteúdo público/grupo | hipóteses e cooperação autorizada | não modifica ficha alheia | apenas onde há permissão | não recebe payload completo de aliados |
| Fio~Mestre | informações da campanha sob sua jurisdição | preparar e corrigir | decisões e estados de condução | revelações/sínteses conforme audiência | modo preview usa projeções seguras |
| Espectador/convidado | apenas audiência definida | no máximo observações permitidas | não | não | navegação sem botões mutantes |
| Usuário desconectado | cache local legítimo | rascunho, quando autorizado | não afirmar commit remoto | não | reconciliação após reconexão |
| Conta legada | registros da edição correspondente | conforme controles legados | não mistura motor II | restrito pela edição | arquivos nunca convertidos no carregamento |

Essa tabela é intenção de política; o Work deve compará-la com roles e RLS reais antes de escrever, pois os nomes atuais de papéis podem diferir.

## 25.3. Estado vazio, parcial, cheio, erro, em jogo

Para **cada componente novo e modificado**, desenhar e testar cinco estados: `vazio legítimo`, `rascunho parcial`, `conteúdo extenso`, `erro/conflito`, `em uso na sessão`. Exemplo de vínculo sem história não deve mostrar espaço de 400px; vínculo com mil palavras não pode cortar texto; ausência de retrato recebe símbolo editorial neutro; carta com dez dependências precisa continuar legível; cinco condições em 320px viram friso resumido acessível; Mesa sem cena mostra ferramenta para criar/entrar, não fundo imponente sem CTA; falha de carregamento apresenta ação de retorno, não spinner eterno.

**Cada botão** precisa responder: “qual é a ação?”, “qual dado modifica?”, “qual confirmação requer?”, “como sei que terminou?”, “como recupero?”. Proibir controles decorativos que parecem clicáveis e nada fazem.

# 26. SISTEMA DE QUALIDADE — O QUE SERÁ COBRADO DO WORK

## 26.1. Provas de design obrigatórias por ambiente

Para Ficha, VP, Mesa, Mestre e Nexus, produzir: 1 screenshot desktop 1440px em estado normal; 1 mobile 390px na mesma tarefa; 1 mobile 320px com texto ampliado; 1 estado de painel/folha aberta; 1 estado de conteúdo cheio; 1 estado de erro/conflito; vídeo curto ou sequência de frames de microinteração com duração comprovável; inspeção de contraste e foco. **Não** considerar uma imagem bonita do cabeçalho como prova de que a ficha é utilizável.

**Revisão editorial em três passagens:**

- **Composição:** existe gesto central, hierarquia e uso legítimo de espaço vazio? Uma superfície cresce só porque grid está assim? Há repetição visual de cards de mesma anatomia? O primeiro conteúdo útil chega cedo?
- **Experiência:** um jogador consegue consultar carta, gastar recurso, declarar intervenção e retornar à cena sem uma sequência longa? Foco e rascunhos sobrevivem a troca de contexto? Controles maiores não atrapalham mapa?
- **Identidade:** a marca oficial foi preservada? Materiais, tipografia, cores e gestos realmente se relacionam ao Fio~Mestre? O resultado parece TdV mesmo se removemos o nome do site?

## 26.2. Auditoria de regressão funcional — ficha

- [ ] Arquivo de fichas: criar, duplicar apenas quando autorizado, renomear, abrir, pesquisar, filtrar, excluir/arquivar com segurança, importar/exportar, status e edições diferenciadas.
- [ ] Metadados e descrição legada integralmente preservados; texto rico/longas histórias, retrato, informações pessoais e notas.
- [ ] Feição: seis pilares; Marca completa ou não manifestada; Âncora, Abalada e Reassentamento; Vínculos com estados, ofertas/demandas/tensões.
- [ ] Matrizes `3,3,2,2` iniciais; Alinhavos `2×2 + 4×1`, resto 0; dado por grau; 21 nomes sem duplicação.
- [ ] PV/PI/PE e máximos, Defesas, Guarda, proteção/cobertura, Equilíbrio/Tensão, condições, estados críticos, recuperação e custos.
- [ ] Ação: dois Fios, fontes, DT, efeitos das faces, Dupla unidade, Desvio, Auxílio, Cooperação, disputa, Redobra, operações, narrativa sem teste.
- [ ] Repertório: armas, itens, consumíveis, relíquias, recipientes, inventário e gestão, Lavores, Tramas, Costura, Fragmentos, Selos, Preparo, Reputação, Resto.
- [ ] Marcos, Desenvolvimento, PU, investimentos, aprovações, trilha histórica e manutenção de IDs.
- [ ] Salvar, autosave, rascunho, conflito, histórico por sessão, links Nexus, popout, readonly, permissões, offline e impressão.
- [ ] Forma de Poder da edição anterior intacta, consultável, sem bônus nas novas fichas.

## 26.3. Auditoria de regressão funcional — Mesa

- [ ] Selecionar/renomear/ordenar/criar/excluir/arquivar cenas com controles da aplicação atual.
- [ ] Presenças, convites, sessão realtime, tokens próprios, movimento autorizado, reconexão, projeções públicas e estado de quem está online.
- [ ] Canvas 2D/isométrico/3D, câmera, zoom, pan, enquadramento, ângulo, snap, escala, origem da grade, coordenadas.
- [ ] Tokens, imagens, modelos GLTF e nativos, seleção/multisseleção, nível, transformações, alinhamento, comandos contextuais, render/detecção.
- [ ] Paredes, portas, portas secretas, estruturas verticais, camadas, pisos, telhados/coberturas, níveis, iluminação/visibilidade/oclusão.
- [ ] Névoa, permissões por audiência, geometria de revelação/ocultação, player view e preview do diretor.
- [ ] Desenho, régua, medição, regiões, automações existentes, pings, etiquetas, assets, handouts e compartilhamento.
- [ ] Direção, timeline, efeitos, clima/atmosfera, áudio espacial opt-in, preferências de vista, configurações, qualidade adaptativa.
- [ ] Reordenar objetos, undo/redo onde suportado, salvar, snapshot, versão esperada, erros e conflito concorrente sem perda.
- [ ] Interação VP ↔ token ↔ frente ↔ condição ↔ evento e Mesa abstrata, sem inventar regras de grid.

## 26.4. Auditoria de regressão funcional — Mestre e Nexus

- [ ] Painel completo de campanha, navegação legada, sessões, interlúdios, fissuras, dobras, notas e parâmetros antigos.
- [ ] Cadastro/edição de NPCs, monstros, adversários, ameaças, presenças e catálogos; migração revisada.
- [ ] Frente, Pressão, Urgência, Posição, participantes, dois Impulsos, Resposta, iniciativa manual/automática, conflitos.
- [ ] Operações prolongadas, perseguições, Selagem, Canalização, sustentação, repertório e Resto.
- [ ] Investigações, hipóteses, pistas fundamentais/profundas, evidências e handouts com audiência correta.
- [ ] Pré-visualização de jogador, revelação parcial, autorização de ação, correção e publicação de síntese.
- [ ] Nexus: árvore, páginas, pastas, bibliotecas, templates, leitura, busca, grafo, relações, import/export e vínculos existentes.
- [ ] Memória da Tessitura: acontecimento, fonte, histórico, alteração durável, audiência, navegação entre superfícies e correção.

## 26.5. Segurança, persistência, desempenho e vida real

- [ ] Testes automatizados de motor preservados e ampliados com cenários de dupla unidade, Proveito/Desproveito, Forçar, 0 PE, janela, custo, Auxílio, operação, Pressão e condição.
- [ ] Teste PostgreSQL com migrations aditivas, triggers, constraints, FKs, papel de jogador/espectador/mestre e RLS efetiva.
- [ ] Teste de rede: player não recebe segredo no JSON, websocket/realtime ou cache offline; mudança de cargo revoga acesso.
- [ ] Dois navegadores autênticos e duas contas reais, não apenas fixtures, testam jogar, editar, desconectar e reconectar.
- [ ] Repetir evento sem custo duplicado; duas alterações concorrentes sem overwrite; rascunho preservado ao fechar popup.
- [ ] Restauração **real** em ambiente de teste a partir de backup exportado; validação de dados de edição antiga.
- [ ] Testar navegação a 320/390/820/1024/1440, densidade de dados, teclado virtual, landscape, zoom, reduce motion e leitor de tela.
- [ ] Testar FPS e tempos de interação na Mesa com cenas volumosas e 3D de baixo poder, sem decoração cara e com fallback.
- [ ] Confirmar build/lint/types/testes e deploy real em Cloudflare correspondente ao commit, não apenas HTTP 200 de build antigo.
- [ ] Não modificar schema legado, assets e CSS proprietários sem registrar migração, justificativa e evidência de regressão.

## 26.6. Critérios visuais quantitativos sem empobrecer a arte

Valores orientativos a revisar empiricamente: alvo de toque cerca de 44px; texto funcional não ficar microscópico, mesmo em 320px; primeira ação útil visível sem rolar extensamente após cabeçalho; overlays não ocultarem mais que o necessário do mapa; Fio/legenda com contraste acessível; reflow sem overflow lateral ao zoom; linhas de texto legíveis, sem largura exagerada; animações finitas com alternativa de redução. **Não estabelecer “tela só pode ter quatro cards” como critério**, pois conteúdo e necessidade variam. A sofisticação deve ser julgada também pela capacidade de mostrar densidade de maneira ordenada.

## 26.7. Inventário de faltas a procurar durante a implementação

A V2 cobre requisitos documentais, mas a implementação exige auditoria ativa de lacunas. Procurar especialmente:

1. Campo de alvo/entidade estável em todos os fluxos (Ficha, Mesa e Mestre) — não depender de nomes de texto.
2. Controle claro de público e segredo em cada handout, pista, condição e evento.
3. Fila de aprovação e retorno ao jogador para ações com consequência/custo.
4. Vínculo de janela de sustentação e custo já pago entre sessões.
5. Registro de fontes e versões de cartas impressas divergentes do catálogo atual.
6. Consulta com edição legada preservada em todas as URLs e backups.
7. Tratamento de sessões com NPC sem ficha completa e ameaça sem PV.
8. Histórico de ações do Mestre para restauração/correção sem apagar consequências.
9. Pontes de VP com operação prolongada, perseguição e Selagem, não apenas ataque.
10. Modo situação abstrata sem grade, tão funcional quanto o mapa tático.
11. Mensagens de erro/ausência sem bloquear acesso a material já autorizado.
12. Controles de economia de ações representando corretamente rodada e janela de Resposta.
13. Recuperação com janela real e impedimento de repetir sem situação nova.
14. Percurso de importação/exportação com IDs estáveis e autorizações.
15. Acerto físico-digital evitando recontabilizar evento já aplicado.
16. Regras de acesso da carta que não são determinadas por mera posse física.
17. Visibilidade de um vínculo e de sua história em fichas de membros distintos.
18. Posição por **frente**, diferente de posição x/y do token e da posição na prancha.
19. Consistência entre dois popouts de VP da mesma personagem.
20. Forma de poder legada e botão VP novo sem conflito de interpretação.
21. Ficha com alterações simultâneas narrativas e mecânicas, sem perder uma delas no autosave.
22. Recuperação de render da Mesa após contexto gráfico perdido.
23. Armazenamento seguro de fotos, handouts e links com arquivos privados.
24. Busca e catálogo com nomes acentuados e aliases (Ímpeto, Âncora, Fio~Mestre).
25. Design de diferenças entre dado de regra, dado do personagem, condição de cena e hipótese do mundo.

# 27. PLANO PARA O WORK — EXECUÇÃO EM PACOTES COM PROVA DE QUALIDADE

## Pacote A — inventário, documentação e base

Ler o repositório atual; levantar rotas, screens, bridges, estado, schema, migrations, CSS proprietários, assets e eventos; registrar **matriz `função → fonte de dados → proprietário → edição → público → estado → destino V2 → teste`**. Comparar com este documento e `docs/tdv-ii-coverage.md`. Gerar capturas antes de alterar; marcar recursos não implementados mesmo que tenham componente. Criar baseline reproduzível e backup restaurável em ambiente de teste.

**Entregas:** inventário assinado de funções, mapa de riscos, plano de migração, mapa das janelas e telas atuais, captura em 320/390/820/1440 e prova de backup. **Bloqueador:** qualquer função atual sem destino.

## Pacote B — design system autoral em peças antes de páginas

Definir tokens de fonte, cor, espaçamento, radius/material, sombras, borda, mecanismos de fio e interações; criar protótipos funcionais de Fólio, Instrumento, Trama, Lâmina, Palco, Caixa de Enlace, Marcador de Condição, Carta Desdobrável, Nó de Acontecimento, Janela/Sheet e Dock. Testar estados normais, cheio, vazio, erro, readonly, teclado, foco, reduzir movimento. Reutilizar estilo existente e Fio~Mestre; não começar com refatoração massiva de todas as páginas.

**Entregas:** biblioteca de componentes e provas comparadas desktop/mobile. **Bloqueador:** identidade visual indistinta de qualquer dashboard genérico.

## Pacote C — domínio e contratos de ocorrência

Validar schemas, edição, Motor, RLS, DTOs, idempotência, transações, source revisions, projeções e visibilidade. Implementar caminhos pequenos e seguros para evento→ficha, evento→mestre, evento→Mesa e evento→Nexus com testes. Não colocar conversão de dados antigos como efeito colateral do carregamento. Guardar histórico antes de limpar estado da cena.

**Entregas:** testes unit/integration/Postgres/realtime das principais mutações e papéis. **Bloqueador:** custo duplicável ou segredo público.

## Pacote D — Ficha Integral completa

Compor capa/índice e cinco capítulos com as anatomias descritas, preservar riqueza narrativa, inventário e estado de criação. Integrar consultas e elementos gráficos reais com Motor. Rever conteúdo longo, editor, snapshots, dados pessoais, exportação, readonly e histórico. **Não** lançar uma Ficha visualmente bonita mas incompleta.

**Entregas:** ficha criada, finalizada, editada, exportada e reaberta sem perda, com contraste e composição aprovados 320/390/1440. **Bloqueador:** desaparecimento de qualquer seção ou instrumento legado.

## Pacote E — VP e contrato com o kit físico

Unificar modo Jogo/Editar; conservar Forma de Poder antiga como histórico; implementar nova VP/rota, cinco instrumentos, Motor de intervenção, leitura de dados físicos e digitais, repertório, contexto, memória, restrições de papel, acerto físico e versão de carta. Aplicar composição orgânica e motion com mock de estado antes de API, depois ligar ao backend real.

**Entregas:** sessão presencial real ensaiada com prancha A3, três cartas e marcadores; sessão digital equivalente. **Bloqueador:** dupla ficha com recursos conflitantes ou VP que só funciona com papel.

## Pacote F — Mesa e Fio~Mestre

Conectar tokens, contexto e acontecimentos; manter todos os bridges, editores, movimentos, modelos, visibilidades, prévias, assets e recursos do diretor. Compor Cena/Preparar/Conduzir, operações de pressão/urgência e investigação, e publicar informações sem vazamento. Implementar modo situação abstrata de Foco/Oposição/Passagem/Resto como **visto separado** da mesma cena.

**Entregas:** campanha com cenas, mapas, 3D e handouts, dois usuários reais, fluxos híbridos, estado persistente e screenshot de todas as ferramentas. **Bloqueador:** perder qualquer controle existente ou projetar dado reservado.

## Pacote G — Nexus e Memória da Tessitura

Conectar permanências reais, relações tipadas, visões de arquivo e cronologia; melhorar páginas contextuais e busca, mantendo árvore, grafo, bibliotecas e drag/drop. Diferenciar fato, hipótese, registro do Mestre e norma. Fazer síntese de sessão com versões por audiência.

**Entregas:** evento aprovado percorre VP→Ficha→Mesa→Mestre→Nexus; vínculo abre de volta à origem. **Bloqueador:** publicação automática de segredo ou duplicação de fato.

## Pacote H — revisão visual extrema e publicação

Auditar cada tela com o mesmo rigor de design editorial: proporção, contraste, fluidez, reutilização, motion, densidade, recorte, tipografia e singularidade. Criar 3 rodadas verificáveis **sem reduzir funções**: 1) composição, 2) instrumentação e microinterações, 3) refinamento/QA. Rodar regressão completa e testes reais; publicar pelo pipeline atual com commit, migração, verificação e rollback.

**Entregas:** relatório de aceitação com screenshots e vídeos; checklist de recursos preservados; falhas restantes claramente documentadas; URL publicada correspondente ao commit aprovado. **Bloqueador:** afirmar “pronto” baseado somente em teste unitário ou estética de mock.

## 27.1. O que entregar a cada PR

1. Escopo e referência ao capítulo exato desta especificação.
2. Arquivos afetados e proprietários atuais, inclusive CSS.
3. Funções antigas preservadas e novas introduzidas; o que não foi concluído.
4. Capturas e diferenças visuais nas larguras de referência.
5. Matriz de papéis e permissão da nova ação.
6. Testes de regra/domínio/integração/e2e/visual pertinentes e logs de falha.
7. Evidência de migração/restauração quando houver schema.
8. Decisões criativas e por que a composição escolhida não é um template genérico.
9. Instrução de rollback e commit de publicação.

**Conduta do Work:** pode executar mudanças em lotes quando autorizado pelo usuário e ferramentas permitirem; nunca criar uma função fictícia para agradar à especificação. Caso alguma proposta exceda norma, orçamento, capacidade do repositório ou prioridade, registrar decisão e limite com alternativa segura.

# 28. VERIFICAÇÃO CRÍTICA FINAL DA V2

## 28.1. Perguntas obrigatórias antes de dizer que a V2 foi implementada

- O Registro contém **tudo** que define e acompanha o personagem, inclusive os campos narrativos antigos, inventário/recipientes e todas as mecânicas do Livro II?
- A VP abre pelo botão VP no TdV II sem confusão com “Forma de Poder” legada e sem o `Jogo/Editar` concorrente?
- A VP presencial **complementa** a prancha A3 e cartas 63×88, e a VP digital mantém todas as capacidades mesmo quando não há papel?
- Um resultado em dados físicos e o mesmo resultado em dados digitais têm leitura idêntica no Motor, com custo/autoridade corretamente tratados?
- Uma consequência aprovada modifica a ficha e a cena correspondente **uma vez**, com visibilidade e história apropriadas?
- O mesmo acontecimento pode ser visto em Ficha, Mestre, Mesa e Nexus sem gerar quatro versões não sincronizadas?
- O Mestre pode conduzir personagens, NPCs e Ameaças sem precisar de PV em tudo nem recuperar Rank antigo?
- O modo de situação abstrata funciona sem grade, e o palco 2D/3D existente continua acessível?
- Uma investigação fornece pistas fundamentais alcançadas, preservando hipóteses dos jogadores sem revelar verdades ocultas?
- A Teia é legível, seus fios têm semântica, os símbolos oficiais são corretos e os movimentos são distintos por propósito?
- A versão mobile mostra funções úteis antes da terceira rolagem de página e não é uma fila interminável de cartões gigantes?
- O Estado carregado, o histórico de sessão e as permissões resistem a logout, troca de aba, duas conexões simultâneas e reconexão?
- Há relatório real de testes de jogador/mestre, backup restaurado e publicação compatível com o código aprovado?

Se alguma resposta for “não”, **o escopo dessa etapa não está concluído**.

## 28.2. Resoluções que a implementação deve preservar

**Nome VP:** Visão de Partida é proposta editorial e pode ser renomeada posteriormente, mas a distinção operacional entre Registro integral e modo Jogo complementar é requisito fixo. **Âncora/Marca:** não são medidores de energia. **Relação:** atravessa todas as raízes, não cria quinto atributo. **Cartas:** possuir papel não dispensa requisitos narrativos ou mecânicos. **Mapa:** posição geográfica não deriva Posição canônica. **Fios:** desenho não cria dano, bônus, sucesso ou acesso. **Eventos:** animação não equivale a persistência. **Memória:** fato aprovado difere de anotação e hipótese. **UI:** o design não tem autorização para eliminar ferramentas. **Mestre:** a privacidade é uma fronteira de dados, não de visibilidade CSS. **Kit físico:** precisa de conferência humana, não de sincronização presumida.

## 28.3. Lacunas e confirmações ainda necessárias no Work

A pesquisa para esta V2 leu documentação e fontes do repositório, mas **não certifica** que cada ponte funciona em conta real, que todos os controles têm acessibilidade adequada, ou que houve recuperação verdadeira a partir de backup. Como o repositório segue evoluindo, a primeira tarefa do Work deve comparar commit atual, código/estilos, esquemas, permissões e os livros da Biblioteca. Dúvidas legítimas de interpretação de regra precisam ser registradas com trecho/fonte do Livro II antes de alterar o Motor. O escopo de UI/funcionalidade pode ser amplo; o escopo da norma **não** deve ser ampliado por suposição.

---

# 29. MANIFESTO DE EXECUÇÃO — INSTRUÇÃO MESTRA PARA O WORK

> **Implementar o Tadeon Nexus como instrumento completo de Tessitura do Vazio II.** Ler a Parte I (requisitos fundamentais) e a Parte II (composição e funcionamento detalhados), além dos livros e kit físico. Auditar antes de modificar. Conservar sem exceção todas as funções úteis já existentes em Ficha, Forma de Poder legada, Mesa, Mestre, Nexus, acervo, assets, permissões, navegação e sessões. Unificar dados e Motor sem impor novos procedimentos mecânicos. Construir Registro integral e VP operacional complementar à prancha física. Conceber cada tela com direção artística autoral e relações visuais semanticamente corretas, oferecendo layout e interação próprios para desktop, tablet e celular. Validar, não supor: fonte normativa, testes, RLS, sincronização, real-time, offline, recuperação, uso presencial, desempenho e publicação.
>
> **Qualidade exigida:** a estética deve revelar a natureza do sistema; a engenharia deve preservar o que acontece; a navegação deve deixar a pessoa agir sem pensar na estrutura do software. Cada interface precisa ser bela por causa daquilo que torna possível — nunca apesar disso.

**Fim do dossiê V2.0.**

---

# PARTE III — V3.0 · DIREÇÃO DE EXPERIÊNCIA, MATÉRIA, MOTION E COMPOSIÇÃO INTEGRAL

> **Esta Parte III é a nova camada mandatória de direção de arte, interface e execução da V3.** Mantém integralmente os contratos funcionais, mecânicos, narrativos e de segurança das Partes I e II, mas substitui orientações visuais mais genéricas quando especifica geometria, estados, hierarquia, efeitos e comportamento responsivo. **A beleza não justifica ocultar, remover ou mudar uma função.** Todas as medidas visuais abaixo são especificações de projeto a prototipar; nenhuma é uma regra de TdV.

## 30. DIREÇÃO CRIATIVA FUNDADORA — O INSTRUMENTO VIVO

### 30.1. Ambição e distinção

**Frase de direção:** *A Tessitura não foi representada pelo site; ela é a maneira como o site se organiza, se abre, se dobra, responde e permanece.*

O Tadeon deve proporcionar a solidez operacional, previsibilidade, delicadeza tátil, atenção à tipografia e à animação de um aplicativo maduro, sem parecer uma cópia de interface Apple, uma dashboard de SaaS, um terminal futurista ou um grimório medieval genérico. A referência Apple é **qualidade de interação e acabamento**: precisão do espaçamento, feedback imediato, movimento contínuo e compreensível, estado preservado, foco e acessibilidade, capacidade de adaptação entre formatos de janela. A assinatura visual pertence exclusivamente a TdV: trama, passagem de fios, fibras, papel, tecido, tinta, costura, desgaste controlado, peso e luminosidade contida.

**A hipótese estética:** usar o contraste entre *matéria macia* (tecido que respira, fios que cedem, capas de papel), *estrutura precisa* (linhas tensas, braços instrumentais, eixos, marcações) e *um plano óptico intermediário* (vidro fosco, bordas refrativas extremamente discretas). O resultado é uma interface medievo-futurista de objetos que parecem feitos e manuseados, não de partículas brilhantes projetadas no vazio.

Não é “muito movimento”: é **movimento que revela estrutura**. Não é “muito glass”: é **vidro onde há comando sobre matéria**. Não é “muitos cards”: é **uma gramática de superfícies com formas e funções diferentes**. Não é “muita textura”: é **materialidade com escala e sensibilidade de contraste**. A meta é conseguir reconhecer uma tela do Tadeon mesmo removendo logotipo e palavras.

### 30.2. Os cinco critérios simultâneos de uma composição aprovada

1. **Autoria perceptível:** a peça poderia pertencer ao TdV e não a uma biblioteca genérica de dashboard?
2. **Legibilidade operacional:** em cinco segundos o jogador identifica onde está, o que ocorre, qual ação importa e seu estado?
3. **Continuidade estrutural:** a transição explica o que se abriu, de onde veio e para onde vai o contexto?
4. **Economia de tela:** mostra simultaneamente informações relevantes, sem sacrificar alvo tátil, contraste ou leitura?
5. **Resistência ao mundo real:** funciona com 320 px, tablet vertical, zoom de texto, câmera, dados volumosos, desconexão e redução de movimento?

Uma tela reprovada em qualquer critério deve ser retrabalhada; um layout bonito em captura isolada não basta.

### 30.3. Quatro distâncias de leitura

- **Longe, a 2–3 metros (mesa projetada):** cena, movimento, escolhas em disputa, situação, estado da conexão. Nunca exigir microtexto para o essencial.
- **Braço estendido (tablet sobre a mesa):** controles, prontuário, ferramentas e ações rápidas; gestos amplos e erro reversível.
- **Mão (celular):** síntese instrumental, dados importantes e aprofundamento por lâminas ou pontos de entrada; nenhuma coluna interminável de painéis de desktop.
- **Mesa de trabalho (desktop):** simultaneidade de contextos, associação por proximidade, arrastar, soltar, comparar, janelas e teclado.

### 30.4. Caráter editorial

A personalidade deve ser **severa sem ser fria, fabulosa sem fantasia de biblioteca pronta, tecnológica sem neon gratuito**. O site parece um arquivo que aprendeu a se mover. O silêncio entre movimentos também é parte do desenho: superfícies repousam. Efeitos não disputam atenção com uma decisão difícil ou um registro emocional.

### 30.5. Convenções nomenclaturais e limites do cânone

- O símbolo de TdV e a Trilogia do Anterior continuam sob Fio~Mestre; nunca redesenhá-los a partir de aproximações.
- **Medo, Conhecimento e Tempo** são Naturezas primordiais, não categorias de interface que autorizem um gradiente tricolor em toda tela. O uso deve corresponder a contexto real da obra; estados de erro/sucesso do software precisam de indicadores legíveis próprios e não converter Naturezas em juízos morais.
- **VP** significa *Visão de Partida* como proposta de produto da V2. A **Versão de Poder** histórica permanece arquivada e identificada como legada. Não criar terceira versão concorrente por acidente.
- Fios decorativos, linhas de vínculo e linhas mecânicas não devem ser confundidos: **linha decorativa** não aceita clique, **linha relacional** representa vínculo verdadeiro, **linha instrumental** representa dados ou procedimento real.

## 31. MATERIALIDADE DIGITAL — UM DESIGN SYSTEM PROPRIETÁRIO

### 31.1. As sete matérias e suas funções

| Matéria / nome de projeto | Aparência, profundidade e textura | Uso autorizado | Uso indevido |
|---|---|---|---|
| **Véu de Fundo** | preto-azulado quase têxtil, relevo de fibras largo, variação tonal lenta nas extremidades | palco global atrás do conteúdo, login e grandes transições | textura ruidosa atrás de texto corrido |
| **Tecido de Estrutura** | trama de urdidura discretíssima, direção identificável a olho atento, sombra de costura | margens, separadores, composição de fundos e capas | repetir o mesmo patch de textura em cada cartão |
| **Fólio** | marfim em modo claro ou carvão fosco no escuro; grão fino impresso | narrativas, dossiês, documentos, edição de texto | vidro transparente sob formulário longo |
| **Lâmina** | superfície com borda mais rígida, espessura sugerida por linha interna e sombra curta | recurso, seleção, ação, condição, carta, instrumento compacto | sombra flutuante excessiva em todos os objetos |
| **Vidro do Véu** | refração suave, transparência seletiva, borda iluminada fina | navegação, comandos flutuantes, controles que passam sobre conteúdo, janelas transitórias | fundo de todos os cards, texto longo em glass, Mesa sob vidro permanente |
| **Metal de Junção** | filetes, encaixes, bornes e anéis mínimos com patina | dobradiças, divisórias, articulação de Fios e controles de precisão | moldura dourada ornamental em todo painel |
| **Tinta Viva** | traço vetorial com espessura calibrada e tensão direcional | gráficos, trajetórias, tensões, animações semânticas, vínculo e seleção | rastro animado infinito ou “cabos” sem relação com dados |

**Hierarquia de planos:** cenário/fundo `z0` → estrutura de leitura `z1` → objeto focal `z2` → interação contextual `z3` → navegação material `z4` → diálogo/alerta `z5`. A elevação **é relacional**, não uma lista de sombras cada vez maiores. A Mesa usa renderização espacial própria e não herda um `z-index` global que quebre menus, canvas e portais.

### 31.2. A anatomia em corte

Uma superfície premium é composta, de fora para dentro, por: (a) sombra de contato não borrada demais; (b) espessura visual perceptível apenas na borda de luz; (c) plano do material, com cor calibrada; (d) microtrama de baixo contraste; (e) elementos de conteúdo; (f) brilho direcional ou filete de foco, **somente ao interagir**. Não usar as seis camadas em todas as peças: o Fólio pode dispensar brilho e a Lâmina pode dispensar textura.

**Perfil de uma lâmina pequena:** raio externo assimétrico entre 10–15 px por eixo, borda de 1 px com contraste delicado, sombra de contato vertical de 3–8 px visuais, textura que não altere contraste do texto; ao pressionar, a sombra encurta, a lâmina desce 1 px e o reflexo se concentra. **Perfil de controle em Vidro:** borda externa luminosa de até 1 px, transparência limitada, conteúdo sempre sobre tintura de contraste estabilizada, brilho direcional deslocado suavemente no hover/focus, sem texto enxergando fundo turbulento.

### 31.3. Textura de tecidos: escalas e geração

Definir três escalas distintas e reutilizáveis, cada qual com um único proprietário visual:

- **Macrotrama (80–220 px por ritmo visual):** pregas longas, variações de inclinação e ângulos de tensão; uso limitado a hero, casulo lateral e transição principal. Pode ser SVG estático ou malha CSS/SVG com no máximo duas camadas de movimento indireto.
- **Mesotrama (12–44 px):** fios cruzados percebidos sob luz rasante e nas bordas de superfície; usar em transições entre capítulos, planilhas de regras e instrumentos especiais.
- **Microgrão (1–3 px renderizados):** material sem padrão evidente, variando de acordo com densidade de tela; usar textura otimizada em atlas ou SVG estático, com opacidade mínima validada. Evitar `feTurbulence` animado em tela inteira.

A trama deve ser **suavemente orientada** em um sentido predominante (0°, 20° ou 65° por região) e nunca uma textura de linho uniforme na tela toda. Cruzamentos apenas surgem onde fazem sentido: em junturas, bordas e campos relacionais. Fios soltos nos cantos têm começo/fim em peças estruturais, jamais atravessam botões ou texto. Nos 40–80 px ao redor de blocos densos de leitura, textura pode cair a quase zero.

### 31.4. Fundo vivo com contenção

Desenhar uma **arquitetura atmosférica de três fundos**, não um background diferente por componente:

1. **Base imóvel:** `#080A0E` com gradiente direcional quase imperceptível. Deve parecer bom com animações desligadas.
2. **Tecido periférico:** duas grandes regiões gráficas ancoradas fora do eixo central, com recortes oblíquos, sombra dobras e filetes que sugerem um campo têxtil. Uma região pode se mover 1–4 px em ciclo longo (18–35 s) quando a tela está ociosa, com `transform` e sem alterar tamanho do layout; outra permanece fixa.
3. **Efeito contextual:** luz que acompanha a mudança de seção, cena, seleção ou modal, sem colorir o resto do site. Desligado ao editar textos, usar camera/mesa com movimento contínuo ou apresentar informação confidencial.

**Regra de densidade:** ao rolar texto, o fundo permanece estável ou quase estável; conteúdo nunca parece flutuar sobre um vídeo. Nunca passar uma sombra animada sobre rosto, fotos, textos de documentos ou coordenadas do mapa.

### 31.5. Liquid Glass na linguagem TdV

A referência Apple descreve Liquid Glass como camada funcional para navegação e controles que pairam **sobre** o conteúdo, e não como material de toda a camada de leitura. A adaptação TdV usa isso de forma criteriosa:

- **Glass primário:** barra global, paleta de comandos, navegador radial, controles de câmera, pequenos visores flutuantes, troca Registro/VP, títulos em janelas de diálogo.
- **Glass transitório:** inspector aberto, seletor de destino, pesquisa e ações sobre a Mesa; aparece com blur progressivo, estrutura leve e legibilidade estabilizada.
- **Material opaco:** narrativas, tabelas, dossiês, formulários, log de efeitos, painel de criação. Uma longa leitura **não** deve ser uma folha translúcida.
- **Transparência adaptativa:** reduzir blur, alpha e sobreposição em aparelhos modestos, usuários com preferência por reduzir transparência, cena visualmente agitada ou baixo contraste detectável. Fundo sólido equivalente obrigatório.

Material óptico precisa **responder ao ambiente**: em repouso, a borda é baixa; ao foco, ganha uma lâmina de luz e enfatiza profundidade; ao expandir, o painel parece soltar da superfície, sem saltar. Não usar `backdrop-filter` em dezenas de descendentes sobrepostos; priorizar uma superfície material por agrupamento visual.

### 31.6. Profundidade 2.5D e quase 3D

A profundidade é uma sugestão espacial controlada: bordas de extrusão de 1–3 px, pequena diferença de perspectiva entre planos, oclusão de fios pelos objetos, sombra de contato curta e materiais que mudam conforme a luz. Diferenciar **3D cênico** (Mesa) de **2.5D de interface** (instrumentos). A presença de modelos 3D na Mesa não autoriza perspectiva em campos editáveis ou textos.

Para ponteiro fino, um instrumento focal pode inclinar até ~1,5–2,5° no hover e elevar 1–3 px, em uma transformação combinada de curto curso; jamais deslocar o ponto clicável ou causar perda de `pointerenter`. Em toque, o comportamento equivalente é uma compressão de 0,98–0,995 e mudança de luz, sem tilt durante rolagem. Desabilitar perspectiva na leitura, no estado editável, em tabelas e onde a precisão de clique ou alvo for afetada.

### 31.7. Tokenização de materiais

Criar **tokens semânticos**, em vez de colar dezenas de hex/radius por componente:

```css
/* Contrato ilustrativo V3: adaptar à nomenclatura existente após auditoria */
:root {
  --tdv-void: #080A0E;
  --tdv-reflex: #E9E3D5;
  --tdv-ink: #22262D;
  --tdv-veil: #716B7B;
  --tdv-metal: #7A8187;
  --tdv-paper: #F5F0E7;
  --tdv-fear: #74242D;
  --tdv-knowledge: #D9D7A4;
  --tdv-time: #4F6E5D;
  --tdv-radius-leaf: 14px 5px 13px 6px;
  --tdv-radius-instrument: 17px 7px 15px 7px;
  --tdv-motion-snap: 130ms;
  --tdv-motion-focus: 210ms;
  --tdv-motion-fold: 380ms;
  --tdv-motion-scene: 540ms;
}
```

Os hex são do Fio~Mestre. Valores de raio e duração são propostas de interface, não exigências canônicas. O Work deve preservar tokens existentes (`--tadeon-*`) quando equivalentes e criar aliases controlados, não substituir tudo por uma segunda árvore de variáveis. Exigir contrastes AA para conteúdo e controles; a paleta canônica pode permanecer como acento visual, mas texto pequeno não será pintado numa combinação que falhe contraste.

## 32. GEOMETRIA ORGÂNICA — FORMAS QUE EXPLICAM FUNÇÕES

### 32.1. Biblioteca de seis composições, e não um sistema universal de cartões

1. **Fólio editorial:** uma folha contínua de leitura, título enraizado, observações marginais, borda de corte e navegação contextual. Ideal para Ficha > Pessoa, história, regra e documento.
2. **Bancada instrumental:** área central para instrumento e duas áreas secundárias de ajustes/efeitos; assimetria 62/38 ou 58/42; ideal para Constituição, Ação, VP e Mestre.
3. **Teia relacional:** nós dispostos por significado, trajetórias curvadas com ponto de conexão e agrupamentos; ideal para Vínculos, investigação, Atlas do Nexus e histórico.
4. **Palco espacial:** canvas protagonista com comandos periféricos, inspeção por lâmina, sobreposição de contexto, nunca ‘canvas dentro de card’ como miniatura; ideal para Mesa.
5. **Acervo encadernado:** lombadas, capas, fileiras de arquivos com profundidade e seleção; ideal para Arquivo de Personagens, Biblioteca, campanhas e backups.
6. **Lâminas de decisão:** apresentações compactas contextuais que deslizam a partir de um elemento real; ideal para cartas, custos, consequências, ações e confirmação.

A escolha é **semântica**: a composição muda com a natureza do que a pessoa está fazendo. Elementos vizinhos mantêm conexões de borda, linha ou alinhamento, mas não precisam compartilhar largura, altura ou a mesma ordem de grade. Repetição de cards somente onde uma coleção de entidades realmente precisa ser comparada.

### 32.2. Gramática de bordas e articulações

Combinar bordas curvas e ângulos sem aleatoriedade: o grande painel pode ter dois cantos macios e dois pouco arredondados; a lâmina sobreposta muda a curvatura inversa para parecer encaixada. **Não fazer um arco em todo componente.** Para blocos de leitura, usar arestas mais retas e estáveis; para comandos, volumes mais suaves e manipuláveis; para perigos, tensão de contorno sem transformar tudo em vermelho.

Os conectores devem ter uma função real: costura entre dois campos que compartilham estado, fio entre personagem e Âncora, caminho entre origem e destino em grafo, pequeno arco entre preparação e resultado. Quando duas peças não estão relacionadas, separar por respiro, não uni-las por ornamento.

### 32.3. Anatomia editorial das telas

Cada página possui, nessa ordem lógica e não necessariamente vertical: **marca de localização** (onde estou), **título** (o objeto), **gesto dominante** (a principal ação possível), **instrumento focal** (o conteúdo de trabalho), **vizinhança relevante** (contexto/inspector), **saída e conservação** (salvar, histórico, desfazer, status). Os seis elementos devem ser encontrados sem pesquisa visual mesmo que apareçam em regiões assimétricas.

Projetar *silhueta* antes do detalhe. Uma captura em escala de cinza e reduzida deve mostrar o centro funcional da página, as regiões relacionais e a navegação; se tudo parecer tijolo do mesmo tamanho, reprovar. Uma captura com textos de 200% deve preservar leitura e ação sem recortes.

### 32.4. Proporções, ritmo e respiro

- Escala interna preferencial: 4, 8, 12, 16, 20, 24, 32 e 40 px; variações de 6/10/18/28 para ajustes óticos, não grade rígida.
- Módulos operacionais compactos: 32–48 px de altura visual, com alvo interativo >=44 ×44 CSS px nos comandos primários; redução de altura visual não reduz área tocável.
- Títulos: duas camadas no máximo no chrome; subtítulo longo deslocado para o corpo, não hero de 300 px em todas as páginas.
- Margens responsivas: celular 12–16 px, tablet 16–24 px, desktop 24–40 px, com controle do máximo de comprimento das linhas.
- Texto longo: ideal 60–80 caracteres por linha em desktops, com atenção à largura efetiva da fonte; o campo de narração pode expandir sob demanda.
- Densidade: **compacta por padrão em modo Jogo e Mesa**, confortável por padrão em leitura e edição, personalizável em usuário. Evitar o padrão “sala cheia de caixas gigantes” em qualquer ambiente.

### 32.5. Sistema de tipografia

Respeitar as fontes efetivas do Fio~Mestre e as fontes disponíveis no projeto. Diferenciar quatro registros: **Título de capítulo** (serif editorial com peso contido), **nome próprio/documental** (serif ou variação display em escala calibrada), **comando e rótulo** (sans legível e firme), **dado técnico** (mono opcional apenas onde alinhamento tabular ajuda). Monoespaçada **não é** solução universal para controles pequenos; a delicadeza não pode sacrificar leitura.

- Não usar títulos enormes para decorar: H1 em desktop normalmente `clamp(1.45rem, 1.7vw, 2.1rem)`, em celular `1.3–1.65rem`; hero excepcional possui escala própria.
- Lócus de dados: números com `font-variant-numeric: tabular-nums`, `line-height` estável, rótulo curto legível sem depender de placeholder.
- Hierarquia consistente: 1 título de página, 1 título de instrumento, pequenos rótulos, conteúdo; não sete níveis de fonte mudando a cada componente.
- Itálico poético reservado para epígrafe, inscrição ou trecho de ficção; botões e regras usam linguagem direta.
- Palavras editáveis jamais embutidas em SVG decorativo se puderem ser HTML acessível.

### 32.6. Iconografia e símbolos

Preservar sigilos já implementados e a orientação dos Fios. Construir uma **família complementar autoral** de pictogramas operacionais: folha/pessoa, fio/matriz, agulha/ação, malha/expressão, anel/percurso, lente/investigação, dobra/mesa, sinete/continuidade. Traço comum: extremidades atenuadas, espessura ótica consistente, uma dobra ou ponto de junção pontual; testar a 16, 20 e 24 px. Nunca usar ícones Lucide como marca do universo: podem existir como utilitários, mas símbolos narrativos precisam de personalidade e não repetir formas genéricas.

Não usar só ícone para comando perigoso; rótulo ou tooltip acessível; no modo toque acesso por tocar ou pressionar, não apenas passar cursor.

### 32.7. Objetos exemplares desenhados sob medida

- **Régua de Equilíbrio:** eixo duplo com linha contínua e cursor de peso; marcação Medo/Conhecimento sem representar moralidade; movimento só em mudança confirmada.
- **Agulha de Ação:** dois trajetos Prumo/Tento aproximam-se e se cruzam na leitura do Enlace; o ponto de encontro reflete valores reais, não dramatiza falso êxito.
- **Trilho de Pressão:** filetes paralelos, tensão de uma frente, origem/escalada/ruptura sem converter falha em avanço arbitrário.
- **Porta de Vínculo:** junção entre pessoa e nó, status visível com texto e morfologia; fio cortado não é uma linha piscando para “Rompido”, mas um estado estável.
- **Arquivo com lombada:** lista ou card que exibe identidade sem ser um box padrão, com borda de encadernação e detalhes de manuseio.
- **Janela de Resto:** lâmina fina que recolhe um acontecimento e o conecta a pessoa, cena e Nexus; sua luz pára quando o estado é persistido.


## 33. MOTION DESIGN — QUANDO A TESSITURA SE MOVE

### 33.1. Uma única linguagem temporal para todo o site

Definir seis **verbos de movimento** — não seis efeitos independentes em cada módulo:

1. **Assentar:** um objeto chega ao lugar, perde velocidade e ganha sombra de contato. Usado ao abrir painel, encerrar edição, posicionar carta e retornar de diálogo.
2. **Desdobrar:** uma superfície revela conteúdo adjacente mantendo borda/ponto de origem reconhecível. Usado em seções da Ficha, filtros, inspeções e notas.
3. **Tensionar:** uma linha se estica para anunciar vínculo, alvo, risco ou conexão. Usado em relação, seleção de token, preparo de rolagem e operação em curso; não aplicado sem relação verdadeira.
4. **Costurar:** duas regiões anteriormente separadas passam a compartilhar estado visível. Usado em link do Nexus, carta associada, evidência conectada, evento persistido e sessão vinculada.
5. **Reverberar:** pequena confirmação de acontecimento real: foco luminoso curto, deslocamento de 1–2 px, retorno e quietude. Usado ao salvar, gastar recurso, aplicar consequência ou completar vínculo, **sem confundir com sucesso ficcional**.
6. **Dobrar:** transição entre superfícies irmãs e mudança de escala/contexto: Registro ↔ VP, ficha ↔ Mesa, nó ↔ dossier, lista ↔ detalhe. O conteúdo antigo parte em direção definida e o novo ocupa a mesma região lógica; preservar scroll e foco quando apropriado.

**A identidade do movimento é a coerência do gesto.** Mesmo uma animação bonita deve desaparecer se concorre com informação, prejudica leitura ou não comunica uma mudança.

### 33.2. Orçamento temporal base (proposta)

| Escala | Duração alvo | Curva de referência | Exemplos |
|---|---:|---|---|
| resposta de pressão | 90–150 ms | ease-out curta | botão, tecla, item selecionado |
| hover, foco, borda e brilho | 160–240 ms | `cubic-bezier(.2,.8,.2,1)` | lâmina, navegação, controle |
| menus, popovers, tooltips | 180–290 ms | início rápido/assentamento suave | comando, inspector, menu radial |
| revelar/fechar seção | 280–430 ms | `cubic-bezier(.22,1,.36,1)` | folha, card de carta, propriedades |
| transição entre superfícies | 380–560 ms | “dobra” em duas fases discretas | página/aba principal, ficha→VP |
| evento narrativo significativo | 450–720 ms **no máximo** | sem mola exagerada | Marco, Âncora, Resto |
| ambiente ocioso periférico | 18–35 s, sem sincronizar múltiplas superfícies | vai-e-volta quase imóvel | respiração de tecido periférico |

Durações não bloqueiam ação nem gravação. O usuário pode tocar o próximo comando durante a animação. Não animar `height:auto` por loop de medição, filtros de blur gigantes ou mudanças de layout com layout thrash. Usar transform/opacity de forma preferencial; técnicas de transição compartilhada quando suportadas, com fallback instantâneo e foco preservado.

### 33.3. Hover: arquitetura obrigatória em cinco estados

Todo elemento interativo principal especificará estados **repouso → hover (cursor fino) → foco por teclado → pressionado/toque → indisponível**; ações mutáveis também terão **pendente → sucesso confirmado ou erro**. Hover **não** é `brightness(1.1)` universal. Ele muda de acordo com o tipo de objeto:

| Objeto | Hover com ponteiro fino | Foco/teclado | Toque e pressão | Estado inativo |
|---|---|---|---|---|
| navegação principal | luz rasante caminha 4–8 px + legenda estável | anel claramente contrastado, sem tilt | compressão curta e transição de seleção | texto estável, sem glow |
| lâmina de ação | elevação 1–2 px + espessura perceptível | filete visível e acessível | sombra aproxima-se da base | motivo de indisponibilidade disponível |
| cartão de personagem | lombada recebe tensão, conteúdo não mexe | contorno ao redor do cartão e atalho exibido | abre diretamente, sem hover obrigatório | não aplicado quando visualizável |
| nó da Teia | fio correspondente acentua e nós diretamente ligados ganham detalhe | anel de foco e lista textual de conexões | toque seleciona, toque secundário abre | fios não relacionados perdem contraste de modo legível |
| carta do repertório | canto superior desprende no máximo 2 px e mostra faixa de ação | borda dupla e nome completo | abre lâmina contextual/segura | conta disponibilidade da operação, não esconde carta |
| ferramenta da Mesa | silhueta do ícone muda conforme ação; tooltip sob comando | contorno alto, tooltip acessível | toque seleciona, toque prolongado abre contexto se adequado | motivo explícito: falta permissão, sessão etc. |
| régua/slider | realce do cursor, trilha estática | foco no controle, leitura de valor | arraste com captura adequada e feedback do valor | dado legível, sem editar |
| texto vinculável | sublinhado animado por direção de leitura + destino | underline persistente | navega com feedback | sem cor enganosa |
| registro longo | revelar ação ao lado **sem deslocar texto** | comando sempre alcançável por Tab | menu Mais sempre aparente onde sem hover | leitura permanece estável |
| ação destrutiva | vermelho contextual contido + legenda do impacto | foco inequívoco | exige confirmação quando irreversível | desabilitação justificada |

**Regra contra repetição:** um instrumento não anima 6 propriedades ao mesmo tempo. Em geral, escolher uma propriedade espacial, uma ótica e um indicador semântico. Nada de todos os cards subirem 4 px ao passar mouse, como estética padrão.

### 33.4. Toque, stylus e trackpad

`@media (hover:hover) and (pointer:fine)` para tilt, parallax e hover rico. No toque, **cada ação relevante precisa de gatilho visível** e de alternativa ao menu de contexto por botão. A stylus pode abrir anotações/desenho, mas não substitui input. Gestos horizontais devem ser confinados a coleções, trilhas ou panes e não sequestrar scroll vertical nativo. Na Mesa, zoom/pan/rotate respeitam o modo de ferramenta e evitam movimentar token involuntariamente. Arrastar carta ou nó deve poder ser substituído por menu **Associar a…**. Swipe para revelar ações pode ser conveniência, nunca único caminho.

### 33.5. Foco, abertura e fechamento de janelas

Uma lâmina nasce visualmente do seu **ponto de chamada**: se o usuário toca um fragmento, a janela se desdobra próximo do fragmento; se o painel vem de item da Mesa, sua origem é o token/controle, sem interferir na geometria da cena. Ao fechar, anima de volta à origem somente se o alvo ainda existe; caso contrário usa fade curto. Ao voltar, foco retorna ao invocador. Scroll interno da janela é independente; impedir scroll de fundo apenas enquanto o diálogo modal existe. Não medir posição do elemento com `querySelector` global se o componente já conhece ref/estado. Usar portais conhecidos com medidas de viewport já existentes.

### 33.6. Transições entre páginas: continuidade sem teatralização

- **Início → Arquivo:** a peça do arquivo recebe foco; cabeçalho se transforma em indicador de seção, sem recarregar toda a cena de fundo.
- **Arquivo → Ficha:** a lombada abre uma superfície de fólio; o nome permanece reconhecível entre frames, sem foto voando.
- **Ficha → VP:** o conteúdo informativo cede espaço a um instrumento de ação; conservar a identidade e recursos. Não dobrar página inteira como um livro animado por 2 segundos.
- **VP → Mesa:** a superfície do instrumento recolhe para o canto lateral e revela o palco; personagem selecionado continua selecionado na Mesa quando vinculado.
- **Mesa → Mestre:** palco permanece espacialmente reconhecível quando embutido, muda o aparato de controle; não resetar câmera.
- **Nexus árvore → leitura → grafo:** preservar nó selecionado e breadcrumb; troca de representação, não troca de dado.
- **Modo offline → reconexão:** indicador fica em estado pendente, não simular sincronização sem confirmação real.

Proibir transição automática no erro crítico, alerta de segurança, morte de personagem, divulgação de segredo e aplicação de custo não confirmada: nesses casos preferir estabilidade e clareza.

### 33.7. Motion do sistema RPG: significação rigorosa

**Prumo e Tento:** o usuário declara intenção e abordagem; duas trajetórias se aproximam visualmente durante a preparação e se fixam na leitura. O estado mostra dado original, alterações, custo e leitura; não animar um “resultado” antes de receber o resultado verdadeiro. **Consonância:** coincidência recebe filete breve; não significa êxito ou vantagem universal. **Desvio:** divergência de Fios abre espaço gráfico entre rotas; não presume falha. **Ascendente/Retorno:** destacar o maior/menor valor na apresentação, sem repetir jogada. **Proveito/Desproveito:** indicar em qual Fio incide, antes da resolução. **Forçar:** fio ganha uma costura provisória após confirmação do custo. **Resto:** fragmento de linha se fixa ao registro da cena depois de persistir.

**Âncora Abalada:** alterar o estado do emblema com tensão e pequena assimetria; permanecer estático depois. Reassentar devolve contorno contínuo após evento real. **Condição:** círculos/triângulos/losangos da coleção física representam Leve/Grave/Crítica; jamais usar cor como único identificador nem traduzir intensidade em penalidade fixa. **Pressão:** frente 0–4, ponteiro acompanha avanço por causa registrada, não por falha automática. **Tensão/Equilíbrio:** limiar ±4 gera mudança pontual do Equilíbrio e Tensão retorna a zero no estado canônico, sem exibir persistência inválida.

### 33.8. Sound design opcional, sem áudio automático

É admissível projetar feedback sonoro mínimo e original, **somente por opção do usuário** e após interação, para salvar/abrir/costurar, separado do áudio espacial da Mesa. Padrão: silencioso. Nunca tocar áudio continuamente, música ou efeito de horror por evento de regra. Deve haver desativação central, respeito a redução sensorial e nenhuma transmissão de som sem consentimento. Se o recurso não acrescentar feedback claro, não implementá-lo.

### 33.9. Redução de movimento e estabilidade

`prefers-reduced-motion: reduce`: substituir deslocamentos, parallax, tilt, tecido vivo e transições complexas por alteração rápida de opacidade/estado ou transição instantânea. Não ocultar conteúdo/ação atrás de animação não executada. `prefers-reduced-transparency` ou preferência do próprio site: material opaco sólido. `forced-colors`: foco por contorno de sistema, ícones vetoriais legíveis e sem dependência de box-shadow. Suspender animações decorativas em aba oculta, baixa potência ou durante pan/zoom contínuo na Mesa. **Nenhuma animação obrigatória para concluir mecânica.**

## 34. RESPONSIVIDADE DESENHADA — CELULAR COMPACTO, TABLET POTENTE, DESKTOP PROFUNDO

### 34.1. Princípio não negociável

**Responsivo não significa reduzir colunas em sequência até uma.** Significa **recompor o modo de trabalho**. Em vez de `grid-template-columns: repeat(1, 1fr)` como solução universal, desenhar redistribuição dos elementos com mesma intenção: pares instrumentais, trilhos horizontais, pequenos grupos 2×2, lâminas laterais, capas compactas, conteúdos progressivos, navegação por segmento e separação de edição/operação.

**Tablet deve preservar o máximo possível da experiência de PC, inclusive comparação lado a lado, inspeção, comandos e cena dominante.** A redução para o modo compacto só ocorre quando uma determinada composição não cabe na **largura útil do próprio contêiner**, nunca por marca genérica de dispositivo. Uma janela de iPad em 520 px usa formato compacto sem ser “celular”; um telefone em paisagem pode comportar duas regiões. Usar container queries, `minmax(0,1fr)`, `clamp`, `ResizeObserver` local quando necessário, safe area e medida real das toolbars.

### 34.2. Estados de composição por largura útil — protótipo a testar

| Largura do workspace | Composição esperada | Navegação / inspeção |
|---:|---|---|
| **320–359 px** | microbancada compacta; até 2 pequenos instrumentos lado a lado quando legíveis, grupo de 3 recursos em trilho | dock curto e lâminas em viewport; nenhuma coluna com min-width acima do container |
| **360–479 px** | composição de bolso: instrumento central, dois fragmentos laterais ou trilhos | dock de 4 destinos, inspector como folha sobreposta; detalhes por revelação |
| **480–679 px** | compacto largo ou paisagem: alguns pares 56/44, regiões 2×N quando cabem | controles visíveis como faixa; evitar full-height sheets injustificados |
| **680–819 px** | tablet compacto / janela intermediária: duas regiões 60/40 nos contextos com texto curto | inspector lateral ou camada secundária, sem abolir desktop prematuramente |
| **820–1023 px** | **tablet funcional:** duas colunas de trabalho; palco Mesa livre; registros com índice adjacente | rails compactos, inspector de 240–300 px, sobreposição quando necessário |
| **1024–1279 px** | tablet grande / desktop reduzido: layout pleno de duas regiões e terceira região contextual quando viável | sidebar recolhível, escolha de densidade |
| **1280–1599 px** | desktop amplo: conteúdo central + instrumentos laterais | inspeção persistente e janela contextual independente |
| **>=1600 px** | estação avançada: três planos informativos, sem espalhar toda informação horizontalmente | limite de linhas de texto, colunas com larguras fixas sensatas |

Esses intervalos são **cenários de prova**, não uma coleção rígida de media queries; implementar pelo ponto de ruptura de cada composição. Validar também 568, 667, 744, 768, 834, 1024, 1180 e janelas livremente redimensionadas.

### 34.3. Mobile: matriz de densidade sem miniaturização

- Cabeçalho de seção com **até duas linhas de identidade**, não hero ornamental enorme. Nome da personagem + status de jogo cabe em 1–2 linhas; epígrafe decorativa é dispensada no modo Jogo.
- Recursos em **trio horizontal** com largura igual, rótulo PV/PI/PE, atual/máx e toque para detalhes. Em 320 px reservar ~90 px por instrumento mais espaçamentos. Valor nunca substituído só por ícone.
- Matrizes em **arranjo 2×2** com valor e nome completo abreviado apenas quando acordado e tooltip acessível; radar em módulo próprio com proporção quadrada limitada por altura.
- Alinhavos em pares de linhas curtas, filtros por categoria e pesquisa; oferecer **visão completa de lista** sem criar 21 cartões gigantes.
- Âncora e Vínculos: um resumo relacional dentro de uma folha; toque revela detalhe como janela, não empurra a narrativa 800 px para baixo.
- Inventário e cartas: faixas horizontais com borda do próximo item visível, ou lista densa com ícone e dois dados; nunca carrossel que oculte ações de exclusão/edição.
- Diários, histórias e textos longos: leitura com `max-width` adequado e editor em tela apropriada, sem duplicar header; teclado nunca cobre ação de salvar ou última linha.
- Divisão da Mesa: palco com máxima área útil, ferramentas em gaveta lateral ou dock inferior, ficha em “lâmina de partida” sobreposta parcialmente, não em coluna abaixo de 1.000 px de mapa.
- Menu: três destinos orbitais existentes no “Mais” permanecem; o menu radial não deve cobrir botão de confirmação/alerta. A navegação principal não se torna um muro de 6 linhas.

### 34.4. Tablet: direção PC-first, sem forçar desktop completo

O tablet é um meio de operação **tátil com espaço útil**, não um celular alargado. Projetar a partir da largura do painel e das interações de dedo/stylus. Em 834 × 1194 px (retrato), usar duas regiões quando a semântica exigir (ex.: Ficha Pessoa: dossier 58%, relação 42%; Nexus: árvore estreita 30%, leitura 70%); em 1194 × 834 (paisagem), preservar área central de 65–75% e inspector de 25–35%, sidebar recolhível. Inspeções flutuam se sua permanência reduzir excessivamente a leitura. Regiões podem alternar **sobreposição transparente e dock**, mas sua relação precisa estar clara.

- Rail de navegação pode encolher para ícone + rótulo curto; não colapsar para menu hamburger no primeiro breakpoint.
- Janela de recurso pode assumir 30–45% da área à direita em vez de modal full-screen; no tablet em retrato estreito, uma folha deslizante de 45–55% ou sheet com largura fixa.
- Histórico e inventário em painel de altura controlada, com scroll interno local apenas quando a densidade justificar; evitar três áreas scrolláveis concorrentes.
- Mesa: inspector de 260–320 px, palco sempre com largura útil grande; toolbar de edição com grupos recolhíveis e ícones+texto no contexto, não 40 ícones horizontais minúsculos.
- Nexus: grafo sem render duplicado; pausar layout do grafo enquanto pane redimensiona; manter nó selecionado e rótulo legível.
- Modo teclado/trackpad no tablet: habilitar hover contextual e atalhos onde for fisicamente detectável, sem fazê-los obrigatórios no modo toque.

### 34.5. Desktop: riqueza espacial com limites

O desktop suporta **informação simultânea e caminhos curtos**, não mais ornamentação. Cada tela possui área focal e no máximo dois eixos persistentes de contexto. Painéis arrastáveis apenas quando realmente úteis; janelas guardam posição/dimensões por usuário e área e devem ser reenquadradas se a resolução diminuir. Atalhos de teclado, comando global, minimizar/restaurar, inspector adjacente, múltiplas vistas dos mesmos dados com uma autoridade. O layout não espalha inputs a 1800 px de distância nem cria linhas de texto de 180 caracteres.

### 34.6. Exemplos de recomposição real

**Registro › Pessoa**

```text
DESKTOP >=1280                    TABLET 820                  CELULAR 390
┌──────────────┬──────────────┐    ┌───────────┬──────────┐     ┌────────────────────┐
│ Fólio       │ Vínculos     │    │ Fólio     │ Âncora + │     │ Nome · estado      │
│ Feição      │ e Âncora     │    │ Feição     │ vínculos │     ├─────────┬──────────┤
│ e história  │ em teia      │    │ história   │ resumo   │     │ Origem  │ Ofício   │
├──────────────┴──────────────┤    └───────────┴──────────┘     ├─────────┴──────────┤
│ Marcas · Resto · anotações  │    ┌──────────────────────┐     │ Âncora • toque     │
└─────────────────────────────┘    │ História/Marcas      │     │ História legível    │
                                  └──────────────────────┘     └────────────────────┘
```

**VP › Ação**

```text
DESKTOP                          TABLET 820                  CELULAR 390
┌─────────┬────────────┬────────┐  ┌─────────────┬────────┐    ┌────────────────────┐
│ Cena    │ Motor      │ Carta  │  │ Motor       │ Carta  │    │ Fios / resultado   │
│/frente  │ Prumo/Tento│ detal. │  │ principal   │ detal. │    ├─────────┬──────────┤
│         ├────────────┤        │  ├─────────────┴────────┤    │ Carta   │ Contexto │
│         │ custo/Resto│        │  │ contexto · custo     │    ├─────────┴──────────┤
└─────────┴────────────┴────────┘  └──────────────────────┘    │ Resto · recolhível │
                                                               └────────────────────┘
```

**Mesa**: desktop/tablet → palco mantém protagonista e inspector lateral; celular → palco inteiro, linha de comando suspensa e lâmina contextual sobreposta que recua ao arrastar mapa. A tela nunca vira “barra superior / painel de 500 px / mapa de 200 px”.

### 34.7. Regras de caixa e viewport

Usar `dvh`/safe-area na hora certa, viewport visual para teclado e menus; não fixar painéis com alturas `100vh` ignorando barras do navegador. Limitar a altura de diálogos a viewport disponível, reservar scroll do conteúdo e ações importantes num rodapé de diálogo que permanece visível. Janela não deve atravessar Dynamic Island, entalhe, notch, cantos arredondados ou home indicator. Reajustar quando teclado abre e preservar input ativo. Não fazer autofocus em celulares quando causaria teclado prematuro e deslocamento.

### 34.8. Padrões proibidos com critérios de reprovação

- Um cartão com largura 100% e altura de 260 px para representar um valor numérico de duas palavras.
- Cinco seções de 800 px empilhadas no modo Jogo sem navegação ou acesso por intenção.
- Scroll horizontal não indicado contendo ação importante ou conteúdo único.
- Botão de fechar/Salvar atrás de navegação fixa, teclado ou safe area.
- Dois menus horizontais de 5 destinos ocupando duas linhas grandes em 390 px.
- Tablet 1024 px que se comporta exatamente como telefone 390 px.
- Campo editável em overlay glass transparente sobre imagem com contraste variável.
- `overflow:hidden` que oculta o trecho inferior de um documento, menus, foco ou seleção.
- Duplicar navegação/ferramentas em diferentes interfaces para simular organização.
- Romper identidade de uma aba ao trocar para outra por uma animação completamente diferente.

## 35. SHELL, SISTEMA DE NAVEGAÇÃO E ATMOSFERA COMPARTILHADA

### 35.1. O shell como arquitetura persistente

O usuário deve reconhecer os elementos persistentes ao trocar de área: **marca TdV, localização atual, navegação, estado de sessão/salvamento, ações rápidas e acesso ao próprio perfil**. A moldura não pode se reconstruir inteiramente a cada rota; animar só a substituição do instrumento central e do signo contextual. Preservar `AppLayout`, `PageHeader`, `WorkspaceActions`, os símbolos e o sistema de materiais existentes, refatorando responsabilidades, não duplicando componentes.

**Barra principal desktop:** uma estrutura de vidro do Véu com espessura fina, altura visual contida, identidade à esquerda, contexto em posição orgânica e ações relacionadas à direita. Em transição entre páginas, o pequeno elemento de posição desliza dentro do trilho; não executar uma animação do logotipo toda vez. **Sidebar:** fio contínuo de navegação que percorre o conjunto de destinos, com linhas de agrupamento e destaque da seleção. Quando compacta, ícone continua com nome disponível em tooltip/foco; ícones não ficam órfãos.

**Dock móvel:** forma compacta e articulada, com material mais opaco do que se imagina, evitando conteúdos ilegíveis sob transparência. Estado selecionado atravessa trajetos entre destinos em até ~230 ms. “Mais” conserva os três destinos orbitais documentados (Offline, Usuários, Saúde/Backup do arquivo), com abertura em leque limitada ao espaço seguro. Os destinos ocultos não serão inacessíveis por conta de papel/permissão; podem ser desabilitados com descrição. O menu fecha ao selecionar, Escape, foco externo ou navegação. Foco volta ao gatilho.

### 35.2. Elementos de fundo por área: unidade + personalidade

Definir um **motivo próprio** para cada seção, desenhado uma vez como SVG/atlas vetorial reutilizável. Os motivos são de baixo contraste e **não ocupam o centro da leitura**:

| Área | Motivo de fundo | Movimento permitido |
|---|---|---|
| Entrada/Login | “Limiar”: dois panos convergentes, pequena fenda de luz, selo estável | abertura única de 500 ms; idle quase imóvel |
| Início/Arquivo | “Urdidura guardada”: fios paralelos que se reúnem num ponto de arquivo | deslocamento periférico lento, pausa ao scroll intenso |
| Ficha Registro | “Fólio suspenso”: vinco, sombra diagonal do papel, fibras discretas | reação ao abrir capítulo, não ao digitar |
| VP | “Dois Fios”: linhas de preparo em posição de repouso | responde ao estado de teste, sem rolagem fictícia |
| Mesa | “Véu de contorno”: auréola/tecido apenas fora do canvas | periférico, desativado em mapa carregado |
| Mestre | “Tear de direção”: tensores e linhas de frente discretas nas margens | muda com seleção de frente, não com cada hover |
| Nexus | “Constelação costurada”: nós e laçadas com relação documental | destaca ligações reais, permanece estável na leitura |
| Usuários/Backup/Offline | “Instrumentação”: filetes, lacres, régua de estado | feedback de sistema, sem drama fantástico |

A mesma linguagem de grão, sombra e luz é preservada; apenas a **estrutura do motivo** muda. Proibir fundos randômicos, fundos com vídeo, imagens de castelo/espada/estrela copiadas e nebulosas genéricas. Todo fundo precisa de variante *static fallback* e de teste com 200% de zoom.

### 35.3. Barra de estado e presença

Criar uma linguagem uniforme para: **salvo, pendente, salvando, offline local, aguardando reconciliação, conflito, falha, acesso negado, sala ativa, sincronização**. Usar rótulos legíveis e ícones distinguíveis. Exemplo: `Salvo há instantes`, `Alterações locais`, `Conflito: revisar versões`. O feedback não implica sucesso antes da confirmação. Em jogo presencial, exibir `Modo físico: conferência pendente` quando apropriado. Uma interrupção de conexão não apaga o instrumento; ele entra num estado de operação restrita claramente descrito.

### 35.4. Paleta de comandos universal

Buscar por **personagem, cena, ficha, campanha, local, conhecimento, carta, ação e ferramenta** respeitando visibilidade. Abrir por botão/atalho documentado, com foco imediato ao campo (exceto mobile quando teclado não deve abrir de surpresa), resultados agrupados por contexto e marcadores de alcance. Uso de glass no shell exterior; resultados em material opaco. Comandos destrutivos exigem confirmação; comandos proibidos não aparecem como se fossem válidos. Não usar IA externa para pesquisa básica ou ações existentes: busca determinística/local e backend autorizado primeiro.

### 35.5. Perfis visuais e personalização sem fragmentação

Oferecer preferências **Densidade** (compacta/confortável), **Reduzir movimento**, **Reduzir transparência**, **Fundo vivo** (desligado/baixo/padrão), **Contraste reforçado** e **Som de interface** (desligado por padrão, se existir). Defaults coerentes por área: VP/Mesa compacta; Registro/Nexus leitura confortável. Preferências de apresentação são por usuário, com fallback e armazenamento sem carregar segredo; não alterar cores oficiais ou regras. Cada preferência precisa de preview, persistência explícita e saída segura caso storage falhe.

### 35.6. Login, autenticação e recuperação

**Login:** não uma tela genérica de SaaS com um card no centro de um degradê. Construir o **Limiar**: tela com malha têxtil que converge para uma fenda oblíqua à esquerda ou topo; em primeiro plano uma placa opaca compacta, com nome do mundo e autenticação clara. Desktop: área de arte ~52% e formulário ~48% com coluna do formulário de 350–430 px; tablet: composição lado a lado quando houver largura, arte reduzida e identidade em coluna estreita; celular: painel compacto na primeira dobra, fio e pequena assinatura na margem — jamais hero gigante antes dos campos. Estado de senha visível/oculta, caps-lock quando detectável, erro específico sem expor informações sensíveis, recuperação, mostrar senha, preenchimento automático, teclado adequado, carregando sem layout shift.

**Recuperação de senha:** mesmo ambiente, estágio diferente da passagem; não animar mudança de senha como ritual mágico. Mostrar confirmação de envio apenas após servidor; não inventar endereço. Fluxo de sessão expirada retoma destino pretendido quando seguro, com explicação. Acessibilidade completa e `autocomplete` apropriado. Garantir contraste e botões alcançáveis a 320 px.

### 35.7. Início e arquivo de personagens

O **Início** não deve ser um dashboard de números aleatórios. Uma “Área em Foco” editorial compacta informa campanha ativa, próxima entrada natural e últimos acontecimentos autorizados; abaixo, um corredor de **fios persistentes** apresenta personagens e acessos, com lombadas de arquivo e elementos narrativos distintos. Desktop: peça editorial assimétrica e galeria que ocupa largura útil; tablet: peça editorial reduzida e galeria com duas a três peças por linha dependendo da largura da coleção; celular: hero ≤180–220 px de conteúdo visual útil em primeiro acesso e fichas em pares compactos quando legíveis, com alternativa de lista densa. Cartões têm **identidade, última alteração, edição e destino**, não gigantescas ilustrações inventadas. Hover faz a lombada receber foco de luz e sugerir abertura; toque abre sem exigir gesto de virar.

**Arquivo:** pesquisa, ordenação, propriedade, criação, duplicação quando suportada, exclusão autorizada, edição da versão antiga e conversão revisável. Destruição requer diálogo claro com impacto e fallback; controles de busca e filtro ficam numa faixa compacta com resultado contável. A grade não passa de uma coluna enorme por padrão no celular; em 320 px usa lista densa ou duas mini-lâminas quando dados couberem, nunca reduz tipografia a 9 px.

### 35.8. Usuários, ferramentas, backup, offline, instalação

Essas telas não devem parecer um apêndice sem personalidade. **Usuários** recebe uma mesa de identidades individuais: cada usuário é um registro compacto, com papel, status, permissões e ações; preserva hierarquia de autorização; excluir membro não é click divertido. **Ferramentas/Backup/Saúde** recebe uma bancada de instrumentos de manutenção: exportar, importar, validar, conferir integridade, histórico e restauração; estado operacional e riscos visíveis. **Offline** é uma mesa de leitura local: quais recursos realmente estão disponíveis, quais são somente cache, quantas operações aguardam conexão e qual ação depende da rede. **Instalação/PWA**, quando existente, é um convite pequeno, não um modal que bloqueia sessão.

Visualmente: metal de junção e tecido neutro, sem o dramaticismo de uma “ameaça” para um erro de rede. Em mobile, ações de backup/importação devem ter estado persistente e confirmação de progressão; evitar empilhar alertas gigantes. Em tablet, a manutenção pode ter dois painéis: operações à esquerda e registro/auditoria à direita.


## 36. DIREÇÃO ARTÍSTICA TELA POR TELA — REGISTRO, VP, MESA, MESTRE E NEXUS

### 36.1. Ficha Integral — o atlas encadernado, não um formulário

**Silhueta geral:** o cabeçalho apresenta o nome próprio como título de documento, com referência à edição e ao estado de salvamento; abaixo, uma estreita guia de cinco áreas que lembra cinco abas de um arquivo costurado. Em desktop, essa guia pode ser horizontal compacta com indicador que desliza por um trilho de filete; em tablet, manter cinco guias com títulos curtos ou agrupamento dinâmico sem abandonar a navegação; em celular, a seleção pode ser grade de 3+2 chips baixos ou régua compacta rolável com indicador de vizinhos, **não cinco botões largos em uma coluna**. A transição conserva texto digitado e posição do foco.

**A página não deve repetir cinco vezes o mesmo layout.** Cada área possui sua própria anatomia:

1. **Pessoa — fólio vivo:** uma coluna ampla para a narrativa da Feição e uma lâmina relacional para Âncora/Vínculos. Os quatro pilares de texto (Origem/Ofício/Convicção/Limite) não são quatro cards idênticos: dois aparecem como campos em par dentro do fólio; outros dois são inscrições vinculadas ao corpo narrativo. A Marca surge como três marcas sequenciais (Gatilho, Manifestação, Resíduo), com um marcador discreto de completude que não força criação de fenômeno. Ao selecionar um Vínculo, a relação se destaca na teia lateral e a lista oferece **Abrir, Sustentar, Cobrar**, com causa, estado e consequência. Uma Âncora Abalada mostra uma costura aberta no emblema, sem pulsação incessante. A história longa usa leitura editorial e editor expansível; não cortar parágrafos em pequenas caixas. **Celular:** dois pilares curtos lado a lado, Âncora em faixa de largura completa de 70–110 px e Vínculos em lista compacta com abertura em lâmina; história abaixo, sem ocupar a primeira dobra inteira.
2. **Constituição — laboratório de possibilidades:** o radar das **quatro Matrizes** é peça focal, não uma figura de canto nem um gráfico gigantesco. Ao redor ficam quatro lâminas com dado/valor, agrupadas em duas linhas; ao selecionar Matriz, os Alinhavos relacionados podem ser destacados como sugestão de leitura, **sem supor um vínculo mecânico obrigatório**. Os **21 Alinhavos** são apresentados em tabela compacta com agrupamentos filtráveis e pesquisa, nome e grau legíveis; oferecer ordenação alfabética e por grau, sem presumir ‘classe’. Constituição derivada mostra máximos de PV/PI/PE, Defesas, Guarda, cobertura e fontes; valores calculados não são editáveis por duplicação. **Celular:** 2×2 Matrizes, radar 160–230 px no próprio módulo e lista de Alinhavos em pares quando nomes cabem, alternando para uma coluna densa somente dentro do submódulo de Alinhavos se necessário; não transformar a página toda em coluna gigante. **Tablet:** radar 40% + painel de Matrizes/Defesas 60%; Alinhavos em faixa inferior 2 colunas.
3. **Ação — bancada de resolução:** a intenção ocupa campo superior pequeno, o motor de Prumo/Tento domina área central de tamanho contido, ajustes em faixa lateral e leitura do resultado em painel que só surge após resolução. O registro distingue custo antecipado, alteração dos dados, par escolhido, DT, Enlace/Ascendente/Retorno/Desvio/Consonância e consequência. O histórico de testes fica condensado e encontra o evento original. Condições, recuperação, Ancorar, estados críticos, Equilíbrio/Tensão, recursos e Defesas são pontos de entrada para operações específicas, **não mecanismos numéricos inventados**. **Celular:** motor central ~180–250 px; recursos em trio fixado ao contexto, ajustes em lâmina curta, resultado substitui o preparo sem alongar infinitamente. **Tablet:** duas regiões lado a lado, 60% motor/resultado e 40% intervenções/custos.
4. **Expressão — coleção articulada:** Lavores, Tramas, Fragmentos, Selos, Preparo, Armas, Equipamentos, Costuras e objetos do inventário aparecem como **famílias de repertório**, cada qual com ícone e material específico mas mesma anatomia documental: nome, campos canônicos, disponibilidade, origem, vínculo à cena e ações legítimas. O arsenal não ganha slots de MMORPG; as cartas virtuais exibem frente concisa e reverso técnico completo. Tramas ativas têm fio de sustentação, custo por janela **quando declarado**, interromper/relaxar sem reembolso e Assinatura/Refluxo conforme regra e ficção; Selagem tem operação contextual, sem cinco testes automáticos. Inventário mantém recipientes, peso/porte/acesso quando existentes, organização e edição; não confundir quantidade física com origem do Lavor. **Celular:** barra de categorias compacta, itens em linhas baixas e dois blocos de repertório em paralelo quando apropriado; detalhe abre lâmina; livros de regras acessíveis por vínculo, não popup obrigatório. **Tablet:** biblioteca 34–40% e detalhe 60–66%, permitindo comparação de duas cartas.
5. **Percurso — estrada dos Marcos:** timeline de 20 Marcos em grupos visuais pequenos com progresso de 5% por evento, 2 PU cada, distinção entre reconhecimento, incorporação e investimento. A narrativa em primeiro plano impede percepção de ‘árvore de XP’ desconectada da ficção. Investimentos exibem custo, requisito, origem, confirmação e saldo; nenhuma aquisição sem crédito. Relacionar mudanças com Feição, Âncora, repertório e Resto. **Celular:** linha de percurso vertical fina com grupos compactos, não 20 cards grandes; progresso em arco segmentado pequeno e tabela de investimentos em linhas, com opção de abrir detalhe. **Tablet:** coluna de percurso contínua + folha de investimento lateral.

**Microinterações exclusivas:** abertura de página como fólio; estatísticas acionam indicadores sem efeito de roleta; ao alterar Feição, uma pequena costura de campo registra `pendente`, só assentando ao salvar; em Marco reconhecido a nova entrada se encaixa na linha cronológica; em Vínculo relacionado a outra ficha, fio liga somente quando houver correspondência persistida e permissão.

**Estados obrigatórios:** rascunho da criação, criação incompleta com pendências, somente leitura, prontidão, erro de edição, conflito entre versões, importação da ficha v1 e preservação dos dados legados. Uma condição crítica altera o destaque contextual, **não cobre todos os controles com nevoeiro vermelho**.

### 36.2. VP — a mesa digital no plano da mão

**Tese visual:** uma bancada menor, mais ágil e mais material do que o Registro. A VP não serve para preencher criação; ela serve à pergunta: **O que minha personagem consegue fazer agora, com que meios, em qual situação, e o que fica depois?**

**Primeira visão no modo presencial:** nome e cena em linha curta; estado de conectividade; consulta da intervenção atual e possíveis repertórios/carta em foco; botão claro de ação do Motor; indicação de recursos com `espelho físico / registro digital` se houve alteração não reconciliada. Não colocar na tela um tabuleiro A3 digital com três slots de cartas vazios e trilha de recursos gigantes. A prancha física já possui PV, PI, PE, dois Impulsos, Resposta, Posição, condições, Âncora e cartas; o site deve revelar **regras, detalhes, fontes, testes, decisões e memória**.

**Anatomia desktop:** a região central é o Motor de dois Fios (48–58% do espaço de trabalho), à esquerda um **contexto de cena** estreito (intenção, risco, posição, acesso), à direita uma **carta/rastreio** (Lavor/Trama/Fragmento/arma selecionada); abaixo, uma linha contínua com custo, resultado e Resto. Evitar três grandes painéis isolados: o Motor deve atravessar as regiões por duas linhas gráficas discretas que unem contexto e desdobramento. Se nenhum dado relacional estiver vinculado, as linhas somem.

**Anatomia tablet:** núcleo com Motor 60–65% e carta/condições 35–40%; contexto aparece em trilho superior fino; histórico abre inspector lateral. Se espaço apertar, o Motor permanece de largura natural e o detalhe da carta vira lâmina sobreposta, **não uma terceira coluna espremida**.

**Anatomia celular:** quatro acessos compactos **Agir / Repertório / Situação / Memória**; no estado principal, Motor e três recursos têm prioridade, com indicador pequeno do custo e resultado. O repertório abre pequeno catálogo horizontal ou lista densa; **duas cartas lado a lado** somente na largura em que haja legibilidade, com seleção de detalhe. Uma janela de resultado ocupa a posição do Motor e mantém reabrível a leitura anterior sem trocar de rota. O jogador deve conseguir preparar e concluir uma intervenção com a mão, sem alcançar um CTA na parte superior de uma tela de 1.500 px.

**Storyboard visual rigoroso:**

- **00 · Espera:** dois Fios relaxados, sem resultados simulados, contexto breve. Repertório mostra carta ativa apenas se realmente associada.
- **01 · Intenção:** a lâmina de intenção surge da bancada; foco no texto/seleção, possibilidade de resolução direta por ficção.
- **02 · Abordagem:** um filete aponta para Matriz e Alinhavo escolhidos; só aparece relação depois de seleção válida.
- **03 · Risco e oposição:** a leitura de contexto é estável, com presença clara de DT e fonte/autoridade quando há teste; sem DT fictícia para ação direta.
- **04 · Ajustes:** linhas ganham marcações de Proveito/Desproveito por Fio, Matriz Abalada, Auxílio compatível e Forçar; custo mostrado antes da confirmação, sem efeito aplicado prematuramente.
- **05 · Revisão:** a bancada organiza uma síntese de *o que será feito*; mostra custos, fonte, autoria e possibilidade de cancelar.
- **06 · Resolver:** animação curta vinculada ao momento de resolução real; dados revelados sem manipular sorte ou esconder números originais.
- **07 · Interpretar:** tabela/inscrição do Enlace, Ascendente, Retorno, Desvio, Consonância, margem e leitura; efeitos não inventados e papel do Fio~Mestre explícito quando necessário.
- **08 · Consequência:** decisão de custo, dano, Resto, condição ou registro real com *aplicar/solicitar confirmação*; distinguir interpretação da rolagem de alteração de estado.
- **09 · Continuidade:** evento confirmado entra no histórico e projeta apenas informações autorizadas na Mesa/Nexus. A assinatura visual se assenta; não transformar um mero `toast` em confirmação de persistência que ainda não ocorreu.

**Carta em foco:** entrada menor que a carta física, mas com proporção editorial 63×88 de referência no modo de visualização. A face digital oferece nome, categoria, disponibilidade, texto curto e indicadores canônicos; o verso é leitura e campos completos. No modo físico há **consulta do correspondente**, não uma cópia obrigatória do material já posicionado na prancha. Se cartas físicas não corresponderem a registros digitais, oferecer reconciliação com identificação manual; não alegar digitalização automática.

**Múltiplos modos:** presencial (com peças), híbrido (físico + ações digitais), totalmente digital (controles de prancha disponíveis como apoio), somente leitura (espectador ou acesso restrito), offline (operação local explicitamente limitada). Uma preferência muda **apresentação**, não cria recursos paralelos ou regras extras. Se o jogador trocar do digital para presencial no meio da cena, acerto de continuidade preserva autoria, tempo e divergências.

**Passagem VP→Registro:** objeto principal permanece referenciado (carta, Âncora, condição, evento). Retorna ao Registro já na seção correta e, quando voltar à VP, o contexto de intervenção fica preservado se ainda válido. A mudança não confunde edição de repertório com execução de efeito.

### 36.3. Mesa Nexus — o palco sem moldura pesada

A Mesa precisa transmitir presença espacial. A cena ocupa **o máximo de tela possível**, o instrumento de navegação paira sobre bordas e os painéis só entram onde ajudam a ação. **Não reproduzir a geometria de uma dashboard em volta do canvas.** O fundo de tecido aparece na moldura externa e no espaço sem mapa; nunca sobre mapa, luz, tokens, névoa ou leitura de coordenadas.

**Camadas visuais do palco:** (1) mundo 2D/3D existente, (2) projeções geométricas persistidas e efeitos reais, (3) visibilidade/fog autorizados, (4) seleção e foco operacional, (5) linha de comando e inspector. As camadas não devem reordenar-se por hover de CSS. A composição do painel deve responder ao **tipo de ferramenta em uso**: seleção, desenho, geometria, névoa, portas, paredes, alturas, luz, assets, cena, áudio e controles do diretor; manter ações existentes alcançáveis.

**Barra do palco:** controle de projeção (2D/isométrico/3D quando suportado), presets de câmera, enquadrar, zoom, snap, desfazer/refazer, status da sala e salvar. Material em Vidro do Véu, com ícones nítidos e sombra curta sobre o mapa. A barra não precisa apresentar todos os botões sempre: grupos por intenção e ações contextuais levam às demais ferramentas, mas o caminho completo deve ser documentado e testado. Tooltips exibem o nome e o atalho. A seleção de ferramenta deve mostrar persistência de estado, nunca hover confundido com seleção.

**Inspector de entidade:** uma lâmina vertical que nasce do token e mostra identificação, relação com ficha/Nexus, recursos/condições e operações autorizadas. A partir dela: abrir Registro, abrir VP, focalizar token, consultar inventário, entregar handout, associar conhecimento, mover, investigar, marcar estado. Cada botão aparece somente se aplicável e autorizado; sem expor campos privados ao jogador. Ao trocar token, o inspector atualiza sem “flip” completo; nome e vínculo têm transição de continuidade.

**Mestre na Mesa:** revelar inspector de criação/edição sem sacrificar o palco, com lado direito entre 260–380 px e largura adaptativa. Ferramentas criativas complexas (luz, paredes, níveis, névoa, região, composição, modelos) entram como bancada lateral que pode expandir e ser destacada; mapa permanece manipulável com overlay correto. Ao salvar uma mudança, a posição/câmera do usuário não se altera. **Visual 3D** é prioridade de render da cena e de seus modelos, não um motivo para embutir toda a UI em perspectiva WebGL.

**Jogador na Mesa:** dock tático compacto oferece selecionar, mover, consultar ação/carta e interagir conforme autorização. Se há habilidade/efeito com geometria espacial, preview mostra raio/cone/linha conforme os dados reais, alvo e camada correta, com confirmação e limites. A ação não é considerada resolvida apenas por mostrar o template. Integrar Motor do TdV II sem reusar automaticamente as regras antigas de poder/Rank. Preservar desenho, níveis, mural, handouts e chat/áudio já existentes no produto, quando ativos.

**Mobile:** mapa começa amplo, controles horizontais ocupam no máximo 1–2 pequenas faixas, menu secundário abre uma folha parcialmente sobreposta e recua ao pan. O usuário pode esconder UI e reabrir por gesto e botão persistente. O token selecionado recebe menu radial ou lâmina inferior compacta; confirmar movimento exige feedback claro e não consome automaticamente Impulso se a regra não foi aplicada. Gestos não disputam rolagem de página. **Tablet:** manter duas regiões (palco dominante + inspector) até quando 260 px de inspector prejudicarem o alvo; depois, usar sheet flutuante no canto com largura limitada, sem derrubar o palco para baixo.

**Direção visual:** mapa e miniaturas são as estrelas; os fios nas margens parecem bordas tecidas do mundo e não efeitos de vídeo. Neblina e sombras da cena pertencem ao motor; CSS da interface não adiciona neblina artificial que prejudique leitura. O sistema reduz fundo vivo e blur quando o render da Mesa já usa GPU intensivamente.

### 36.4. Painel do Fio~Mestre — o tear de direção

O Mestre não precisa de uma parede de formulários. A interface deve dar a sensação de **operar um mecanismo de cena** com visão do todo, decisões precisas, privacidade e acesso aos detalhes sem deslocar a atenção.

**Dois estados principais com navegação comum:**

- **Preparar:** material opaco editorial, com pasta de campanha/abertura, participantes, NPCs, Figurantes, Adversários, Ameaças, objetivos, ligações, documentos, pistas, frentes e contingências. A composição parece um gabinete de evidências: biblioteca à esquerda, plano da sessão no centro, referências e nota reservada à direita. Cards somente onde são fichas de entidade repetidas.
- **Conduzir:** palco da cena em foco, trilho de tempo/rodada, coluna de participantes e intervenções, Pressão e Urgência como instrumentos; ações de Revelar, Aumentar Pressão, Anotar, Fazer Avançar, Publicar e Salvar de maneira clara. A informação privada é fisicamente distinguida de informação publicável por rótulo e borda, não apenas vermelho/verde.

**Desktop 1440:** faixa de identidade compacta; da esquerda para a direita, painel de elenco/rodada ~22%, área de cena/objetivo ~50–55%, banco de consequências/pressões ~23–28%. O inspector pode se sobrepor ao lado direito quando examinar uma Ameaça sem reduzir brutalmente o centro. A sessão não deve ter seis colunas iguais ou um hero de 200 px antes do primeiro controle.

**Tablet 820–1024:** `coluna de cena ~65% + trilho de participantes ~35%` quando houver largura, com Pressão como instrumento horizontal junto à cena e demais inspetores por lâmina. Em retrato estreito, alternar painel do elenco e consequência em um rail, preservando duas regiões úteis. **Mobile 390:** prioridade para Agora (objetivo, posição, risco, rodada), participantes como **faixa horizontal de pequenas lâminas** com 2 Impulsos + Resposta, pressão em régua compacta, ação dominante visível; investigações, dossiês e preparos abrem folhas, não são empilhados eternamente.

**Expressão dos mecanismos:** Pressão é uma frente de 0–4 ligada à fonte, objeto, escalada e Ruptura; Urgência é compasso próprio (3–8 quando escolhido), ambos distintos de Tensão pessoal. Posição e iniciativa ganham marcadores claros, sem inventar modificadores. Participantes mostram 2 Impulsos, 1 Resposta, alteração de estado e autorização de publicação. Ao avançar rodada, os marcadores renovam com deslocamento curto, não com chuva de partículas. **Ameaça estrutural:** apresentar objetivo, capacidade, dependências/vulnerabilidades e condição de término; não impor PV ou orçamento universal por padrão.

**Condução de investigação:** teia privada de pistas fundamentais/profundas e hipóteses, com uma vista do que é perceptível ao jogador e outra do que é reservado. A linha que liga uma evidência a uma hipótese é uma relação criada, não uma conclusão automática do site. Revelar um handout mostra uma **prévia exata por papel** antes de publicar, com efeito de folha que atravessa a separação entre Mestre e Jogador somente após confirmação. **Condução de Selagem/Canalização:** estados conceituais em folha de operação com etapa/resultado, sem obrigar cinco rolagens. **Encerramento da sessão:** Resto, Permanência, mudanças, reconciliar, arquivo e próximo fio; capturar histórico antes de limpar transitórios.

**Motion próprio do Mestre:** um instrumento pressiona outro por uma linha de tensão mínima. Transição entre Preparar/Conduzir recolhe a mesa de planejamento e abre o palco de decisão, preservando dados. O Maestro não é um painel arcade com leds piscando; informação crítica mantém quietude e prioridade.

### 36.5. Nexus — biblioteca, teia, leitura e autoria

A palavra “Nexus” pede um arquivo vivo, mas a interface não pode se tornar um grafo decorativo que substitui um acervo. **Três leituras do mesmo conhecimento:** árvore/pastas para localização, fólio para ler e editar, teia/grafo para relações. A unidade não exige que as três apareçam simultaneamente na tela pequena.

**Desktop:** esquerdo 18–24% para árvore/filtros/bibliotecas; centro 48–60% para leitura/edição; direito 20–30% para relações, histórico, assets e propriedades, com possibilidade de recolher conforme largura. No modo Grafo, o grafo expande e a leitura vira inspector contextual, não mais uma coluna comprimida. **Tablet 820:** árvore estreita 26–32% + leitura 68–74%; relações/histórico em inspector flutuante ou dividindo a leitura quando conteúdo permite. Em 1024+: 2 panes + inspetor temporário. **Mobile:** barra compacta **Explorar / Ler / Relações**, seleção persistente, árvore navegável em folha e leitura editorial de largura integral; grafo em modo focado, arrasto sem rolar todo o documento, botão textual para abrir lista de arestas acessíveis. Evitar infinitos `knowledge-card` de altura 300 px.

**Mecânica visual da Teia:** nós têm categorias e estados reais, labels com abreviação só ao zoom baixo, agrupamento espacial determinístico ou algoritmo estabilizado; fio destacado no hover/focus liga apenas relações persistidas. Selecionar nó não desloca violentamente todos os outros; a câmera reenquadra com duração limitada e opção de desativar. Abrir relação mostra origem, tipo, destino, autoria, evidência/proveniência e permissão; não revelar spoilers no rótulo do nó ao usuário que não pode ler o conteúdo. Para narrativa do jogador, distinguir fato visto, relato, hipótese e cânone. A edição em leitura preserva markdown, backlinks, versões, ativos e rascunhos; nada de reescrever texto porque a pessoa mudou da árvore para o grafo.

**Documentos:** aparência de fólio, opção de modo leitura sem chrome excessivo, epígrafes e figuras com legenda e alt, índice local e breadcrumbs. O editor é funcional (seleção, colar, links, desfazer, alterações pendentes); textura sumida perto do cursor e nenhuma animação de dobra durante a digitação. **Biblioteca:** arquivos são lombadas ou registros documentais compactos; pesquisa e filtros têm resposta rápida, exibem contagem e estado; histórico se apresenta como estratigrafia de versões em lista densa, não como “cards de log”.

**Conexões com os demais ambientes:** uma ocorrência de cena pode gerar entrada no Nexus mediante ato autorizado de captura; abrir um personagem leva ao Registro; abrir evidência publicada leva ao handout; o Mestre pode ver forma reservada, o jogador não recebe essa informação no payload. As relações precisam ser corrigíveis e editáveis; não transformar cada menção textual em aresta canônica sem consentimento.

### 36.6. Telas de operação excepcionais

**Caixa de seleção/Busca Global:** linha fina de metal, corpo opaco, resultados por área; seleção atual com foco, sem desfoque do texto. **Confirmação destrutiva:** composição curta, impacto e reversibilidade em linguagem direta; botão seguro em posição previsível; a ação perigosa nunca obtém destaque de urgência falso. **Conflito de versão:** uma mesa de comparação das duas alterações, nomes de campos, horário/fonte, opções de manter/recarregar/mesclar autorizado; nunca resolver automaticamente sobrescrevendo informação narrativa. **Importação:** prévia do que entra, origem, compatibilidade e itens pulados; nenhum dado substituído silenciosamente. **Erro:** título objetivo, ação de retorno, referência técnica copiável se disponível; tecido fica quieto, sem animação teatral. **Carregamento:** skeleton reproduz a silhueta final do layout, não blocos genéricos todos iguais; sem shimmer permanente em máquina fraca. **Vazio:** narrativa curta conectada à função, ação clara e ilustração própria de linha/folha, nunca stock art ou cartões falsos. **Acesso negado:** explicação sem detalhar conteúdo secreto.

## 37. CATÁLOGO DE MICROINTERAÇÕES — O CUIDADO DOS PEQUENOS DETALHES

A revisão visual do Work deve percorrer **cada** item deste catálogo em repouso, hover, foco, toque, abertura, estado pendente, erro e redução de movimento, quando aplicável.

| Componente | Descanso e desenho | Interação e animação | Coerência/checagem |
|---|---|---|---|
| botão principal | placa de tinta/metal com brilho interno fino | depressão 1 px, tensão de borda e confirmação sem pulso duplo | comando real; 44 px de alvo |
| botão secundário | plano fosco, sem contorno exuberante | foco no filete; hover altera luz, não escala global | não competir com primário |
| ícone de ação | traço ótico consistente | direção de 1–2 px ou rotação mínima só quando semântica permite | label no toque/foco |
| checkbox | marcador de incisão e fundo estável | preenchimento até estado confirmado; não trocar valor antes de salvar quando remoto | `aria-checked` correto |
| radio / segmento | opções unidos por trilho visual contínuo | indicador desliza por caminho mínimo (fantasminha) | roving focus e estados |
| select | lâmina com aba de abertura | folha abre a partir do trigger, conteúdo opaco | viewport/teclado/foco seguros |
| campo de texto | linha de margem editorial | foco ilumina bordo, textura some perto de edição | caret legível; sem autoescala |
| textarea longa | fólio com respiro e largura de linha | expande por intenção, sem salto na posição do cursor | rascunho/autosave consistente |
| slider | cursor material com trilha fina | segue dedo/cursor sem latência perceptível | valor visível durante arraste |
| chip | peça pequena com nome legível | muda filete, indica seleção sustentada | sem cortar nome essencial |
| tooltip | etiqueta de papel/vidro opaco | aparece sem mover alvo; some com Escape/saída | não conter informação indispensável |
| toast | lâmina de assinatura que se assenta | breve entrada, autoexpira ou permanece no erro crítico | anúncio acessível; nunca fonte única da confirmação |
| modal | folha solta a partir da origem, corpo opaco | desdobra/fold curto | foco preso, Escape, retorno e safe area |
| drawer | desliza por trilho lateral/inferior com sombra de contato | recolhe para origem | não deslocar mapa e editor por surpresa |
| acordeão | vinco visível com seta discreta | desdobramento gradual sem travar scroll | conteúdo acessível aberto |
| abas | régua com ponto de costura móvel | deslocamento curto de marcador | scroll e seleção preservados |
| item de galeria | lombada + nome e metadados | lombada ganha luz e pouca espessura | abrir por clique/toque/tecla |
| carta | proporção reconhecível, família visual própria | levanta quina mínima e abre verso técnico | não exigir virar para ler um custo crítico |
| token | vínculo visual com personagem, seleção sutil | anel de alvo e inspector contextual | não ocultar fog, não mover sem autorização |
| fio do grafo | linha curva conforme relação | realce local, não animar todo grafo | relação verdadeira, ao contrário de fundo |
| navegador do histórico | entradas como estratos em linha | linha conecta versões selecionadas | restauração não presumida |
| recurso PV/PI/PE | mini instrumento com número tabular | valor interpola visualmente só após confirmação | custo real, sem double charge |
| Impulso/Resposta | forma do marcador físico em microescala | invertida/assentada após uso validado | 2/1 no round, sem acúmulo |
| régua Pressão | tensão direcional e escala 0–4 | cursor caminha após causa registrada | nenhum avanço automático por falha |
| régua Urgência | compasso legível 3–8 | muda com evento da ficção | não duplicar Pressão |
| Âncora | emblema vinculado ao pilar | quebra de costura e reparo sem glow infinito | Abalada/Reassentada com ação real |
| Condição | círculo, triângulo ou losango com ficha | destaque da intensidade e origem | sem bônus/penalidade universal |
| Guarda e proteção | campo técnico, fonte e estado quebrado | ruptura curta estática | limiar único e fonte explícita |
| Gráfico das Matrizes | quatro vértices/arestas, sem ornamento excessivo. | vértice selecionado destaca rótulo | eixo correto, sem teste extra |
| Teia de Vínculos | nós alinhados por relação, não só fantasia | foco liga pares e abre dossier | estado e permissão preservados |
| prontidão da ficha | pequeno lacre ao lado do título | assentamento após validação | erros continuam acessíveis |
| Marco | inscrição na linha do percurso | surge ao ser reconhecido | 5%/2 PU, sem crédito prematuro |
| link Nexus→Mesa | pequena costura de origem/destino | linha assenta após persistir | sem segredo no payload público |
| handout publicado | papel assume canal do jogador | desdobra após confirmação e autorização | preview por papel obrigatório |
| comparação de versões | duas superfícies e ponte entre diferenças | realce de conflito selecionado | não mesclar automaticamente |
| indicador offline | símbolo neutro, texto explícito | mudança curta de estado, nada pulsando | offline não equivale a salvo remoto |

### 37.1. Reversibilidade e desfazer

A elegância inclui correção. Onde o domínio permite: botão Desfazer após manipulação espacial, voltar à posição anterior na Mesa, cancelar operação em preparo, abandonar edição sem alterar persistência, revisar custos antes de aplicar, restaurar rascunho local com transparência. **Nunca** oferecer `Desfazer` para operações imutáveis/canonizadas sem mecanismo verdadeiro; nesse caso oferecer **registrar correção** com autoria/justificativa. Undo de interface e reversão de um evento de jogo são entidades distintas.

### 37.2. Conduta de hover versus narratividade

Hover de um registro de personagem **não** deve contar sua história; indica ação e destino. Hover de um Vínculo **não** inventa uma reação; destaca a aresta. Hover de um custo **não** aplica o gasto; abre fonte e justificativa. Hover de um dado **não** rola; mostra parâmetros. Hover da Mesa **não** descobre área sob neblina sem permissão. A personalidade surge do feedback preciso, não do “site vivo” tomando decisões narrativas.

### 37.3. Menu radial, janelas fantasma e seleção móvel

Preservar a sensação desejada de **indicador que caminha de um destino para outro**: seleção tem uma peça própria que percorre o intervalo de modo previsível, em vez de cada aba aparecer/desaparecer sem conexão. O indicador pode curvar-se levemente por gravidade visual da borda, sem fazer uma volta de 360°. Menus radiais possuem número limitado de opções primárias e as demais são organizadas em categorias textuais; não criar rodas com 12 ícones ilegíveis. Se não há espaço de raio seguro, usar menu de lâminas compacto. Sua entrada respeita mão e safe area. Com leitor de tela a estrutura é menu de ações normal, não geometria semântica.

### 37.4. A arte do estado vazio

Para **nenhuma personagem**, desenhar dois fios suspensos ao lado de uma lombada sem inscrição; chamada para criar sem caixa de propaganda. Para **nenhum Vínculo**, um pequeno nó aberto na borda do fólio e botão de registro; não uma imagem enorme. Para **sem cena ativa**, palco limpo com orientação de retorno, não um cenário fictício que pareça mapa real. Para **sem resultados**, fios em repouso sem números inventados. Para **sem rede**, arquivo em pausa, lista dos dados realmente disponíveis. Para **erro**, desenho calmo, explicação e caminho de recuperação. Cada estado é desenhado para o **formato real de sua seção** — microvazio dentro de um inspector não usa hero full-screen.

### 37.5. A atenção ao conteúdo excepcional

- Nome de personagem de 120 caracteres: duas linhas controladas, tooltip ou expansão, nunca clip sem alternativa.
- Texto de história de 20.000 caracteres: editor/visualização fluem sem travar, índice e salvamento seguro.
- Listas com 200 registros: virtualização somente onde o desempenho pedir, preservando foco e pesquisa acessível.
- Carta sem imagem: tipografia e símbolo garantem identidade. Carta com imagem: evitar corte na informação e respeitar autoria do asset.
- Dois vínculos com mesmo nome: identificar por origem/ID e evitar confundir relações.
- 10 fichas abertas: presença, autosave e isolamento por `sheetId`/usuário; nenhum rascunho vazando de uma para outra.
- Custo declarado em múltiplas etapas: deduplicação por evento; interface mostra fonte e já pago.
- Multi-janelas: versão divergente exige reconciliação, não um efeito de salvamento otimista escondendo conflito.


## 38. ENGENHARIA VISUAL — COMO ENTREGAR ESSA QUALIDADE SEM CRIAR UM SITE FRÁGIL

### 38.1. Diagnóstico da base de estilos observada

O repositório já possui componentes de materiais, filamentos, cabeçalhos e animações: `MaterialSurface`, `FabricFilaments`, `PageHeader`, `SelectionPlate`, `MobileMoreMenu`, `useMaterialLight`, `ContinuityHero`, interfaces da Mesa, Nexus e Mestre. A arquitetura documenta proprietários específicos de layout, movimento e superfície; a V3 **não autoriza recriar versões paralelas** desses componentes. O arquivo `docs/PROJECT_MAP.md` é gerado de `project-continuity.json` e a distribuição dos estilos tem contrato no `style-architecture.json`. O Work deve usar as fontes de verdade, não editar o mapa gerado como se fosse o arquivo de decisão.

A inspeção de algumas folhas CSS mostra camadas históricas com muitas declarações `!important` e seletores específicos, além de regras globais de hover em botões e superfícies. Isso **não prova quebra visual na produção**, mas indica risco real de efeito acumulado, seletor duplicado e aparência diferente por rota. Antes de adicionar “V3-visual-final.css” gigantesco, o Work deverá **inventariar e consolidar autores**: qual módulo é dono da textura, material, motion, layout, navegação, status e efeito de cada componente; retirar regras obsoletas por testes de regressão e sem supor que uma classe não usada em um fluxo esteja morta.

### 38.2. Matriz de propriedade recomendada

| Domínio visual/funcional | Autoridade existente | V3 pode fazer | V3 não pode fazer |
|---|---|---|---|
| shell, identidade, navegação | `AppLayout`, `PageHeader`, `selection-plate`, `navigation-layout.css`, `page-hero-parity.css` | unificar material, densidade, hierarquia, transição e hover | montar segundo header global ou duplicar navegação |
| fundo, tecido e filamentos | `FabricFilaments`, `experience-surfaces.css`, `hero-backgrounds.css` e fontes documentadas | criar um motor visual **passivo** de camadas e motivações | injetar DOM por observer global ou manter loops de partículas sobre páginas |
| luz e matéria | `MaterialSurface`, `useMaterialLight` | tokens semânticos e variantes por tipo de superfície | cada tela criar cálculo de luz próprio ou efeito concorrente |
| motion | módulos `motion-*` e contratos de `PROJECT_MAP` | substituir seletor legado por APIs/variants consolidados | somar mais uma folha `!important` sem remover duplicação |
| Ficha | `sheet.$id.tsx`, `tdv2-sheet.tsx`, `sheet-*` | recompor os instrumentos e layout mantendo estado na rota | persistir segunda cópia dos valores em componentes visuais |
| VP | nova experiência TdV II sobre o mesmo registro e motor | separar modo jogo de legado e de Registro | reciclar `sheet.$id_.power.tsx` de modo que regras antigas se tornem canônicas |
| Mesa | `TabletopEngine`, `tabletop-workspace`, bridges, persistência/câmera | novos painéis de comando e ornamentação externa | alterar mundo/snap/câmera por CSS ou reiniciar sessão ao navegar |
| Mestre | `master-panel`, `tdv2-master`, navegação existente | instrumentos e organização por intenção | gravar estado paralelo à autoridade de jogo |
| Nexus | `NexusWorkspace`, serviços e reading panes | compor árvore/leitura/grafo de forma adaptativa | reconstruir grafo com estado independente da seleção |
| popovers, dialogs e viewport | primitivos Radix e bridge de viewport já presentes | unificar design e transição, refinar viewport | medir globalmente, duplicar overlay ou quebrar foco |

### 38.3. Arquitetura de efeitos por custo e prioridade

**Tiers de apresentação** (não paywall, apenas perfil de render):

- **Tier 0 — Essencial:** sólido, legível, estático e plenamente funcional. Deve ser completo e visualmente digno. Usado com redução de movimento, dispositivos antigos e falhas de recurso gráfico.
- **Tier 1 — Materiais:** texturas estáticas otimizadas, bordas, sombras, gradientes finos, ícones vetoriais. Padrão para todos.
- **Tier 2 — Motion:** transições curtas, shared selection, fio contextual, abertura de janelas, hero periférico leve. Ativado quando dispositivo e preferência permitem.
- **Tier 3 — 2.5D focal:** tilt de um ou dois elementos, luz local, reflexo e relevo perceptível. Restrito a desktop/ponteiro fino e poucas áreas especiais; não disponível durante cena complexa.
- **Tier 4 — 3D cênico:** funcionalidades existentes da Mesa, com qualidade adaptativa própria e sem acoplamento ao material do shell.

A aplicação pode reduzir **apenas a apresentação**, sem desabilitar ações/recursos fundamentais por Tier. Tier escolhido por preferência, suporte e sinais de performance, sem usar heurística invasiva de hardware ou coletar dados indevidos. A seleção de qualidade visual nunca deve criar comportamento RPG diferente entre usuários.

### 38.4. Pipeline de texturas e assets visuais

Construir **biblioteca autoral** com origem rastreável: `weave-macro`, `weave-meso`, `paper-grain`, `ink-laminate`, `metal-join`, `thread-path`, `fold-mask`, `focus-reflection`. Preferir SVG limpo para linhas/contornos e WebP/AVIF de pequeno tamanho para textura real; versões @1x/@2x somente quando detalhe necessário; evitar base64 grande em CSS global. Para cada asset, registrar propósito, arquivo mestre, tamanho, fallback, se anima, requisito de contraste e lugar de aplicação. Nenhum uso de texturas com marcas d’água nem imagens stock disfarçadas.

Repetir a mesma textura de grão em múltiplas superfícies somente com orientação/escala coerente e gerenciamento de cache; **não baixar uma imagem diferente para cada card**. Proteger de redução de contraste por composição de camadas. Textura decorativa sempre `aria-hidden` e `pointer-events:none`; não entra na ordem de foco. No Canvas da Mesa, textura de UI não deve interceptar hit test.

### 38.5. Render e animação sem regressão

- **Evitar** CSS `filter: blur()` animado sobre grandes áreas, `backdrop-filter` em 15 cards sobrepostos, animações permanentes de `box-shadow` cobrindo viewport, múltiplos canvases próprios sobrepostos ao mapa.
- **Preferir** `opacity`, `transform`, transição de cor/borda em área reduzida; para linhas, `stroke-dashoffset`/transforms apenas quando o número de nós e elementos for limitado.
- Transformações 3D de interface devem criar camada composta apenas quando ativa; `will-change` não fica permanente em todos os componentes.
- O layout do texto não deve ser recalculado por requestAnimationFrame. Qualquer medição de popup ou container usa observers conhecidos, reduzidos e desmontados corretamente.
- Grafo: manter posição dos nós ao selecionar, cancelar forças durante mudança de pane, não rodar simulação pesada em background se o grafo não aparece.
- Mesa: suspender atmosfera do shell quando Canvas/3D usa GPU significativa; se houver queda de FPS, reduzir efeito de UI primeiro, nunca reduzir a legibilidade do mapa.
- Não introduzir WebGL novo para efeitos de fios do shell enquanto SVG/CSS estático resolve; não instalar pacote pesado de animação sem análise de bundle e compatibilidade.

### 38.6. Percepção de rapidez

Operações com latência precisam de feedback **imediato e verdadeiro**. Após tocar em Abrir, a janela pode aparecer com skeleton correspondente ao formato real; dados só são exibidos quando autorizados/carregados. `Save` otimista só se houver protocolo de rollback e distinção clara entre rascunho local e confirmação remota. A transição não deve esperar rede para começar a revelar a navegação, mas também não deve anunciar sucesso antes da rede. Em uma operação TdV, custo e consequência persistem de maneira atômica ou geram erro/reconciliação; animação visual não é a transação.

### 38.7. Segurança da camada de apresentação

Gradientes, vidro ou blur **nunca substituem controle de acesso**. Nenhum dado reservado em DOM/estado do cliente para papel não autorizado. `aria-label`, tooltip, meta tags, histórico, cache offline, índice de pesquisa, snapshots de Mesa e payload de realtime precisam passar pelas mesmas regras de permissão. Um blur que oculta nome de pista não é segurança. O Mestre deve visualizar a **prévia do jogador** quando publica handout/nota, e o backend deve filtrar antes de enviar. A V3 não mexe na mecânica de autorização sem plano próprio, migração, testes e rollback.

### 38.8. Acessibilidade premium é requisito de arte

- Texto pequeno e corpo em contraste suficiente sobre materiais reais; adotar WCAG 2.2 nível AA como mínimo de referência. As metas de contraste usuais são **4,5:1 para texto comum**, **3:1 para texto grande** e **3:1 para componentes/elementos gráficos essenciais**, ressalvadas condições específicas da norma.
- Alvos principais de toque **44×44 px** como padrão de conforto; controles densos menores visualmente podem ter área clicável expandida, sem sobreposição.
- Foco de teclado visível, com anel de 2 px e contraste adequado, distinto de hover; `Escape`, Tab, Shift+Tab, Enter e setas funcionam onde pertinentes.
- `prefers-reduced-motion` e opção de desligar fundo vivo/perspectiva. `prefers-contrast`/forced-colors quando disponíveis.
- Tipografia responde a zoom de 200–400%, sem cortar textos ou impedir ações, com redistribuição contextual quando a composição dupla deixa de caber.
- Slides, diálogos e popovers anunciam título/estado e respeitam `aria-expanded`, `aria-controls` e `aria-live` seletivos. Evitar anunciar cada pequena etapa gráfica ao leitor de tela.
- Canvas/grafo têm representação equivalente em listas e controles com nomes, não dependem exclusivamente de hover ou linhas.
- Efeitos de paralaxe não provocam vertigem; nenhuma piscada intermitente ou grande oscilação de tela. A apreciação estética não deve exigir sensibilidade normal a movimento/transparência.

### 38.9. Integridade do estilo ao longo do tempo

Montar uma pasta de **contratos de design** com: tokens, mapas de propriedade CSS, inventário de componentes, tabela de estados, variantes de superfície e motion, referência canônica dos símbolos, testes de snapshot por breakpoint, checklist de regressão de visual, exemplos aprovados. Não congelar toda a direção de arte em um só arquivo CSS gigante. Criar “pranchas de laboratório” internas (Storybook ou rota de auditoria já existente) para comparar tipografia/material em fundos diferentes, hover/foco/disabled e uso em 320/390/820/1024/1440 px. Testes precisam capturar pixels/render real, não somente conferir classes CSS.

## 39. AVALIAÇÃO ARTÍSTICA, FUNCIONAL E RESPONSIVA — O QUE SIGNIFICA APROVAR A V3

### 39.1. Matriz de cenários obrigatórios de captura

Em cada ambiente verificar: **320 × 720, 360 × 780, 390 × 844, 430 × 932, 568 × 320 (paisagem), 768 × 1024, 820 × 1180, 834 × 1194, 1024 × 768, 1024 × 1366, 1180 × 820, 1280 × 800, 1440 × 900, 1920 × 1080**. Repetir com zoom/texto 200% e, para os casos críticos, 400%; testar também janela reduzida de tablet. Dimensões são **fixtures** de projeto, não promessa de aparelhos específicos.

| Ambiente / condição | Composição que precisa ficar correta | Comportamento a comprovar |
|---|---|---|
| login com teclado aberto | fenda artística preservada fora do campo, formulário compacto acessível | revelar/ocultar, erro, enviar, foco, senha, safe area |
| início com 0/1/20 personagens | hero proporcional, arquivo denso e elegante | filtros, criação, navegação, titularidade |
| arquivo com nome e texto longos | lombadas compactas sem truncamento irreversível | abrir, converter edição, excluir autorizado |
| Ficha Pessoa com Vínculos numerosos | fólio e teia em equilíbrio, mobile em partes compactas | editar, relacionar, acionar Âncora, salvar |
| Constituição com 21 Alinhavos | radar legível, números e lista sem gigante scroll | grau, consulta, investimento, estados |
| Ação com teste/sem teste | Fios com layout estável, nenhum campo tapado | parâmetros, resolução, custos, resultado e registro |
| Expressão com muitos registros | categorias densas e comparáveis | inventário, cartas, selos, sustentar, relaxar |
| Percurso com 0/20 Marcos | timeline compreensível e escala real | PU, reconhecer, investir, auditabilidade |
| VP presencial/digital/offline | motor compacto e painel de carta útil | carta física/digital, recursos, acerto, reconciliação |
| Mesa vazia/pesada/2D/3D | palco dominante, HUD discreto | seleção, câmera, fog, portas, assets, colisão |
| Mesa mobile com token selecionado | canvas ainda operável após abrir inspector | mover, preview, confirmar, voltar, desfazer |
| Mestre conduzindo rodada cheia | participantes e pressões visíveis sem parede de cards | impulso, resposta, iniciativa, pressão, salvar |
| Mestre divulgando evidência | limites entre privado e público evidentes | prévia jogador, publicar, histórico |
| Nexus grande/sem relações | grafo com seleção estável, leitura clara | árvore, editor, filtro, link, privacidade |
| Usuários, backup e offline | instrumentos compactos, texto legível | permissões, exportar/importar, estado real |
| diálogos encadeados | sem múltiplos overlays opacos travados | foco, escape, ação, retorno e teclado |

### 39.2. Métricas de operação e composição — limites de projeto

1. **Primeira dobra no celular:** cabeçalho e navegação não podem consumir quase toda a tela; o usuário deve ver uma ação relevante ou parte substancial do instrumento sem rolar. Meta inicial de ensaio: cabeçalho local ≤120–160 px na maioria das telas, salvo hero excepcional; medir por conteúdo visível, não só CSS.
2. **Tabela e lista:** nenhum dado curto isolado em caixa com altura >160 px sem justificativa visual; o registro deve ser legível numa faixa compacta.
3. **Tablet:** Ficha, Mestre, Nexus e VP devem manter **ao menos duas regiões informativas simultâneas** quando a largura útil >=820 px, salvo modo leitura/imersão escolhido. Mesa deve preservar palco dominante. A regra é verificada por fluxo real e largura de contêiner.
4. **Mesa:** área útil de cena alvo ≥65% do workspace em tablet/desktop com inspector fechado, e prioridade máxima em celular; confirmar pela captura/área manipulável, não por porcentagem abstrata de CSS.
5. **Excessos de efeitos:** em cada tela deve existir **um único objeto focal** e no máximo duas regiões periféricas de motion decorativo; nenhuma animação ambiente em texto longo ou no canvas.
6. **Pontos de interação:** feedback local deve iniciar imediatamente, idealmente <100 ms na maioria dos controles; uso não depende da duração da animação.
7. **Sem deslocamento indevido:** abrir/fechar painel preserva posição de scroll, texto e câmera onde a semântica pede continuidade.
8. **Zero duplicações causadas por UI:** evento/custo não pode ser aplicado duas vezes por clique rápido, reconexão, replay de animação ou conflito.
9. **Sem colapso por orientação:** ao girar tablet, o usuário não perde seleção, rascunho, foco ou sala; o layout troca configuração com continuidade.
10. **Sem desaparecimento de funções:** toda ferramenta anterior possui destino, teste funcional e documentação de acesso, incluindo estados de papel.

### 39.3. Orçamento de performance e qualidade percebida

Metas para orientar, **não garantia antecipada**: manter 60 fps em navegação/motion sob hardware comum com Tier 1–2, reduzir ornamentos antes de comprometer Canvas; evitar tarefas longas >50 ms no caminho de uma interação; reduzir re-render da Ficha ao digitar e do grafo ao selecionar; lazy-load de rotas/editores 3D, prefetch só quando útil; LCP/CLS/INP sob monitoramento comparativo por perfil de hardware; sem aumento grande de bundle por usar biblioteca 3D só para glass/fios. Capturar flame charts/memória em Mesa com dezenas/centenas de elementos, trocas de cena, mudanças de vidro e múltiplas abas; medir pelo menos duas classes de dispositivo real quando possível. Informar claramente se só houve teste em emulação.

### 39.4. Auditoria de homogeneidade e personalidade

Antes da aprovação, confrontar **seis capturas de telas diferentes** lado a lado. Checar unidade de acabamento (espessura da borda, contraste, atmosfera, tipografia e motion), mas **diferença de silhueta funcional** (biblioteca não igual a fichário; Mesa não igual a painel; VP não igual a Ficha). Se todos os layouts forem 3 colunas de cards quadrados com o mesmo gradiente, o sistema falhou autoralmente. Se cada área parecer uma marca diferente, falhou na coesão. A avaliação inclui julgar espaços vazios, ritmo, foco, densidade, corte de imagens e equilíbrio dos volumes.

### 39.5. Lista de anti-padrões proibidos

- **Glass Everywhere:** todos os textos sobre painéis transparentes e borrados.
- **Neon cosmos genérico:** auroras, partículas e gradientes sem função narrativa.
- **Runas automáticas:** caracteres inventados que parecem pertencentes à escrita do mundo, mas não têm cânone.
- **Card farm:** listas de 30 caixas com bordas e sombras idênticas.
- **Mobile bricks:** cada item estica a largura inteira e aumenta o documento de modo absurdo.
- **Tablet de celular:** iPad com 1000 px que apresenta a mesma coluna única de 390 px.
- **Hover como função:** comando só existe quando mouse passa.
- **Motion como espera:** usuário aguarda animação para concluir rolagem/seleção/salvamento.
- **Custo ilusório:** interface consome PE/PI no visual antes de operação atômica.
- **Fio falso:** elementos decorativos aparentam relação real, mas não têm significado.
- **Moralização por cor:** Medo vermelho como erro, Conhecimento amarelo como acerto, Tempo verde como “correto” por convenção.
- **Segredo por opacidade:** conteúdo privado no cliente escondido por CSS.
- **CSS de cobertura:** novas folhas específicas com `!important` resolvendo uma tela e quebrando seis outras.
- **Reescrever site:** apagar módulos existentes para conseguir consistência rapidamente.

### 39.6. Provas de aceite obrigatórias para cada tela

**Prova A — silhueta:** screenshot em escala de cinza na largura-alvo; centro funcional reconhecível em 3 s. **B — material:** sem transparência ilegível, luz/tecido/metal adequados; versão com efeitos desligados ainda bela. **C — operação:** todas as ações essenciais visíveis, alcançáveis e testadas no próprio fluxo. **D — motion:** abrir, fechar, focar, pairar, pressionar, salvar e erro coerentes; versão reduced motion íntegra. **E — responsividade:** 390/820/1024/1440 não diferem só em número de colunas; composições preservam semântica. **F — estabilidade:** sem overflow, salto, perdida de foco, perda de dados e queda grave de FPS. **G — identidade:** presença editorial TdV verificável sem logotipo. **H — comparação:** aprovação por comparação lado a lado com tela anterior e com outras áreas da V3.

### 39.7. Matriz de correção: categoria antes da mudança

Se a tela estiver feia ou confusa, primeiro classificar o problema: **hierarquia** (foco errado), **geometria** (volumes e proporções), **tipografia** (ritmo, contraste, comprimento), **materialidade** (textura/transparência), **motion** (gestos incoerentes), **densidade** (quantidade/forma), **estado** (feedback incorreto), **responsividade** (recomposição insuficiente), **domínio** (regra/fluxo mal representado). Não fazer correção por “mais glow”, “mais cards” ou “mais espaço” sem diagnóstico. Cada PR de polimento deve apresentar antes/depois e justificativa.

## 40. ROTEIRO DE IMPLEMENTAÇÃO V3 — ORDEM DE TRABALHO QUE PROTEGE O PRODUTO

### 40.1. Preparação e baseline congelável

1. Fotografar **todas as áreas e subáreas atuais** em 320, 390, 820, 1024, 1440, com densidade e roles distintos; fazer inventário navegável das funções e destinos. Incluir Login, Início, Arquivo, Ficha v1/v2, registro legada VP, Mesa Mestre/Jogador, Nexus, Ferramentas, Usuários, Backup e Offline.
2. Guardar baseline de CSS, navegação e funcionalidades; registrar versão/commit, migrações, flags e caminhos de rollback. Validar se os módulos mencionados continuam presentes no último commit antes de atuar.
3. Rodar suíte atual, qualidade de build, teste de RLS/migrações quando possível e testes de fluxo; distinguir provas de emulação de aparelho real. **Não mudar regra do livro** numa etapa só estética.
4. Construir tabela “elemento atual → autoridade → destino V3 → teste → status”. Nenhum item pode ser marcado “removido” sem demonstrar que realmente não faz nada e obter aprovação do contrato funcional.

### 40.2. Laboratório de componentes antes de reformar páginas

Produzir uma rota de comparação/galeria de design com, no mínimo: cinco matérias (Fundo, Fólio, Lâmina, Vidro, Tinta), três níveis de textura, três fundos por contexto, 15 controles em cinco estados, dois painéis de modal/drawer, dois gráficos, carta física/digital, um fio de relação, uma seleção móvel e um instrumento com 2.5D. Apresentar capturas estáticas e motion curtos, inclusive reduced motion e contraste reforçado. **Aprovar linguagem primeiro**, depois espalhar pelo site. Limitar o uso de 3D focal às peças onde ele realmente produz maior clareza.

### 40.3. Refatoração estrutural não destrutiva

Consolidar tokens, superfícies e regras de motion na autoridade existente. Retirar seletores históricos que disputam a mesma propriedade somente após mapear importações e provar regressão. Preservar nomes públicos/classnames quando outros módulos dependem deles ou fazer migração atômica com testes. Não alterar RLS nem engine por causa de design. Melhorar perf de layout/porta/viewport com testes de foco e safe area.

### 40.4. Implementação em ondas visuais (ordem recomendada)

**Onda 1 — Casulo comum:** shell, navegação desktop/mobile/tablet, cabeçalhos, estado/salvamento, popups, login, paleta e motion de base. Entrega: consistência perceptível mesmo sem modificar telas profundas.

**Onda 2 — Fólio e acervo:** Início, galeria de personagens, Ficha Integral Pessoa/Constituição/Percurso, tipografia narrativa, mini-instrumentos e organização de histórico. Entrega: demonstração de layout orgânico e mobile compacto.

**Onda 3 — Instrumentos de jogo:** Ficha Ação/Expressão e VP, cartas, dois Fios, custo, Resto e modo híbrido. Entrega: toda ação simples e complexa com representações semânticas e dados corretos.

**Onda 4 — Palco:** Mesa Mestre/Jogador, câmeras/visibilidade/portas/editor, controle radial, inspector e uma demonstração tablet/celular com palco dominante; evitar mexer no motor espacial sem necessidade. Entrega: fluidez e preservação completa.

**Onda 5 — Tear de condução:** Mestre Preparar/Conduzir, cenas/pressões, NPCs/ameaças, operações, investigações, preview de revelações e encerramento. Entrega: jornada contínua sem menus ou painéis desconectados.

**Onda 6 — Teia de memória:** Nexus, biblioteca, grafo, leitura, relação, histórico, importação/backup/offline e utilidades. Entrega: identidade coesa e distinção entre conhecimento, interpretação e segredo.

**Onda 7 — Polimento integral:** comparação entre telas, gaps de hover, movimento, luz, precisão de ícones, microtextura, densidade e transições; eliminar efeitos redundantes e reduzir custos. Entrega: qualidade autoral verificável.

Cada onda deve incluir PR pequeno o bastante para revisão, protótipo com dados reais autorizados ou fixtures fiéis, vídeo de interação, capturas em breakpoints, testes de regras e controle de regressão. Mesclar apenas após demonstrar que **não reduziu funções existentes**.

### 40.5. Padrão de entrega por PR para o Work

Cada PR deverá descrever: intenção da mudança; módulos afetados; preservação funcional (inventário antes/depois); decisões de layout e material; estados implementados; screenshots desktop/tablet/mobile; gravações de hover/focus/toque/transição; prova de leitura acessível; reduced motion; testes mecânicos caso haja impacto no fluxo; benchmark de performance relevante; riscos e limitações; rollback. Evitar frases vagas como “ficou mais premium”: explicar em que lugar, com qual lógica geométrica e qual ganho de uso.

### 40.6. Definição de pronto da V3

A V3 só está pronta quando o uso completo é **contínuo** e não quando todas as páginas têm estilo novo. Um jogador abre o site, acessa personagem, alterna Registro/VP, consulta carta, participa de cena na Mesa, registra resultado e Resto, retorna ao Registro e encontra continuidade; o Mestre conduz rodada, revela conhecimento com prévia de audiência, encontra consequência e a conserva no Nexus; tudo funciona em celular, tablet e desktop; a estética permanece do mesmo mundo em todos esses momentos; e nenhuma ferramenta anterior desapareceu.

---

## 41. ANEXO A — CENAS DE REVISÃO VISUAL, MICRODIREÇÃO E RITMO

Estas cenas são **briefs de composição** para designers, não histórias que alteram o cenário:

**Cena de abertura / “O Limiar”** — Primeira entrada, tela de 390 px: uma fenda fina deslocada à esquerda, fibras discretas não animadas atrás do título, campos de login na primeira dobra, CTA com largura adequada; ao toque o plano do botão cede 1 px, um filete percorre a borda e a tela passa ao Início sem flash branco. Erro de senha mostra mensagem simples estática; o tecido não “se assusta”. Tablet 834 px usa dois planos simultâneos, arte contida e campos visíveis sem scroll.

**Cena de arquivo / “A Lombada”** — Arquivo contém 11 personagens. Em desktop, capas/lombadas variam por dados autorizados, não cor aleatória. Ao hover, uma única peça ganha filete e volume. Ao clicar, o cartão não vira fisicamente 180°, pois isso atrasaria: a Ficha abre no fólio, preservando o nome em continuidade. Em celular, 11 registros são encontrados em duas pequenas lâminas por linha quando a informação cabe, ou lista densa; não são 11 cartões de 300 px empilhados.

**Cena da Feição / “O Nó”** — A ficha mostra um Vínculo Tensionado. Fio lateral tem uma curvatura estável, não anima. Ao focar pelo teclado, a relação acende sutilmente, leitor de tela anuncia nome, estado e destino. Ao abrir, a lâmina apresenta origem/oferta/cobrança/tensão e operações autorizadas. Em modo Jogo, a consulta pode ser feita sem passar pelo fólio de edição. A cor não impõe penalidade universal.

**Cena de decisão / “O Cruzamento”** — O jogador declara abordagem; Prumo e Tento já estão definidos, mas não rolados. Uma linha de Fio avança até posição de preparo; custo e ajustes aparecem antes de confirmar. A resolução revela dois valores verdadeiros; a Consonância, se houver, ganha uma única reverberação sem dizer “sucesso”. Ao aplicar consequência, uma lâmina registra mudança e é recolhida para o histórico; se falhar persistência, a lâmina mostra conflito e não se assenta como concluída.

**Cena da Mesa / “O Palco e a Lâmina”** — Token selecionado em um mapa com fog. Um inspector surge lateralmente sem mover câmera. Ao selecionar outra entidade, o inspector substitui texto e mantém tamanho, mapa permanece no mesmo ponto. Em tablet 820 px, o palco continua maior; em celular 390 px, a lâmina inferior ocupa no máximo parte da visão e se recolhe ao pan. Nenhuma linha de decoração revela a geometria de áreas ocultas.

**Cena da ameaça / “A Frente”** — Mestre acompanha uma frente de Pressão 2/4 e compasso de Urgência. O trilho de Pressão vibra levemente **apenas ao confirmar** uma causa de avanço; a Urgência permanece independente. Ao revelar evidência, uma comparação público/privado aparece e exige confirmação. A publicação gera Resto/auditoria; não abre documento secreto por acidente.

**Cena da memória / “A Costura”** — No Nexus, um fato de sessão é ligado a uma organização e uma pessoa. Dois fios fixam o caminho **depois** de persistir; o grafo mantém posições para não desorientar. Na leitura, a relação é um link textual com contexto e fonte. Para personagem sem permissão, a própria relação/identificador pode nem estar presente no retorno da API.

**Cena da interrupção / “A Continuidade Suspensa”** — Jogador perde rede ao gastar PE. O site não mostra `gasto confirmado`. A operação pendente recebe rótulo e origem; se for seguro armazenar rascunho, salva local como pendente sem alterar registro oficial. Na reconexão, o sistema verifica ID da ocorrência e versão, evitando deduplicação incorreta. O layout permanece estável, não reinicia a partida e não perde texto.

**Cena da adaptação / “O Mesmo Instrumento em Outro Espaço”** — Mestre abre em desktop, depois tablet 834 retrato, depois telefone 390. Em todos os casos, o objetivo atual aparece acima da primeira dobra, o participante selecionado permanece selecionado e a cena segue acessível. Tablet tem cena + elenco simultaneamente; telefone tem cena + trilho compacto de personagens e lâmina contextual. A interface não reconstrói a decisão como uma sequência de blocos altos.

## 42. ANEXO B — MODELOS DE APROVAÇÃO POR ATRIBUTO VISUAL

Para evitar “gostei/não gostei” sem diagnóstico, cada tela recebe avaliação em oito eixos (escala de 1 a 5): **autoria**, **proporção**, **hierarquia**, **textura e matéria**, **motion semântico**, **densidade**, **responsividade**, **clareza funcional**. Um eixo <4 exige correção; nota média ≥4,5 é alvo de qualidade estética, não argumento para ignorar problemas funcionais. Os eixos devem ser avaliados por humanos com capturas reais, não apenas por testes automáticos ou pontuação simulada. Acessibilidade, regra canônica, segurança e preservação são **portões eliminatórios**, independentemente da média.

**Modelo de comentário de review:** “Em 390 px a Ficha Pessoa mostra apenas título + quatro cartões antes de apresentar a Âncora; isso falha densidade e hierarquia. Recompor Origem/Ofício em par, converter Âncora em faixa de 84 px e abrir narrativa por fólio abaixo; manter ações visíveis. Testar novamente em 320/390/820/1440, com teclado e zoom.” **O comentário não é:** “Adicionar mais glass ou glow”.

**Modelo de defeito de motion:** “A animação da Mesa desloca o mapa ao abrir inspector, causando perda de ponto focal. Alterar inspector para overlay lateral até uma largura mínima, preservar câmera/seleção e reduzir transição a 280 ms; não mexer no motor.” **Modelo de defeito de regra:** “Preview geométrico aplicou dano ao selecionar carta, antes de confirmação; separar preview, autorização, resolução e evento, com teste de idempotência.”

## 43. ANEXO C — REFERÊNCIAS EXTERNAS DE QUALIDADE, SEM IMPORTAÇÃO ESTÉTICA

- **Apple Human Interface Guidelines — Materials:** https://developer.apple.com/design/human-interface-guidelines/materials — material translúcido como camada para navegação/controles, distinta da camada de leitura; adaptar princípio, não copiar design proprietário.
- **Apple Human Interface Guidelines — Layout:** https://developer.apple.com/design/human-interface-guidelines/layout — hierarquia clara, estruturas adaptáveis, janelas de iPad redimensionáveis e atraso do colapso para compacto enquanto a disposição plena ainda couber.
- **Apple Human Interface Guidelines — Split Views:** https://developer.apple.com/design/human-interface-guidelines/split-views — panes simultâneos no tablet, ajuste progressivo e inspectors proporcionais.
- **WCAG 2.2, W3C:** https://www.w3.org/TR/WCAG22/ — foco, contraste, alvos, teclado, movimento, reflow e alternativas.

Nenhuma dessas referências substitui o Fio~Mestre, a identidade TdV, a arquitetura existente ou a norma RPG. A V3 reinterpreta princípios de acabamento e adaptação para a Tessitura.

---

## 44. MANIFESTO DE EXECUÇÃO V3 — INSTRUÇÃO DIRETORA PARA O WORK

> **Implementar a V3 do Tadeon Nexus** usando este arquivo integral (Partes I, II e III) como documento diretor, o Livro de Regras II como única autoridade mecânica, a Urdidura como fundamento cosmológico e o Fio~Mestre como identidade canônica. A fase V3 aprofunda coesão, beleza, personalidade, usabilidade e fluidez de todo o site: superfícies físicas, tecidos e fios, liquid glass apenas na camada de comando, 2.5D contido, motion coerente, layouts assimétricos e interfaces próprias por função. **Não refazer do zero, não eliminar ferramentas, não criar estados mecânicos falsos, não sacrificar segurança nem dados.**
>
> Primeiramente inventariar rotas, CSS, componentes e funções existentes. Implementar laboratórios de componentes e composições por largura útil antes de expandir a estética para páginas. Preservar `PROJECT_MAP`, `style-architecture`, RLS, migrações, motores, idempotência, autorização e regras. Priorizar Ficha Registro e VP, Mesa, Mestre, Nexus, Início, Usuários, Backup, Offline e autenticação. Construir famílias visuais Fólio, Bancada, Teia, Palco, Acervo e Lâmina; cada família precisa de estado normal, hover, foco, toque, reduced motion, sólido sem transparência, composição 320/390/820/1024/1440 e prova de função. O tablet mantém a experiência do desktop sempre que a largura útil permitir; celular recompõe instrumentos com pares compactos, trilhos e overlays, não uma coluna de cartões gigantes. Documentar cada decisão, comparar capturas antes/depois, corrigir CSS legado com proprietário único, testar aparelho/conta real quando disponível e não declarar pronta uma fase sem prova.
>
> **Critério final:** o usuário deve identificar a assinatura TdV em cada tela, perceber continuidade material e espacial ao navegar, conseguir agir com fluidez em qualquer tamanho de tela e reconhecer que tudo pertence a um único instrumento — não a várias páginas padronizadas embrulhadas num tema visual.

**ENCERRAMENTO DA PARTE III.** Os conteúdos normativos e funcionais das Partes I e II permanecem incorporados integralmente. Onde a V3 for mais específica sobre aparência, densidade, hierarquia, motion e composição, ela guia o design sem revogar regra, campo, acesso, ferramenta ou histórico.

---

# PARTE IV — V4.0 · REVISÃO FINAL DE SISTEMA, DIREÇÃO DE ARTE E EXPERIÊNCIA

> **Estado:** especificação diretora final proposta, 31/10/2026. **Não equivale a implementação concluída**. A V4 engloba integralmente as Partes I–III. Suas decisões específicas prevalecem apenas em arte, interação, ergonomia, navegação e engenharia visual; não substituem regras do Livro II, não eliminam recursos, não alteram permissões silenciosamente. Toda divergência de dados/mecânica deve ser resolvida em favor da fonte canônica, com testes antes de publicar.
>
> **Fundamento da auditoria:** leitura do dossiê integral V3, documentação de arquitetura do projeto e consulta à árvore `main` do repositório `Gabriel2069/tadeon-nexus` (788 arquivos de código/documentação/infraestrutura, conforme a árvore consultada), com inspeção dirigida de rotas, ficha, Mesa, Mestre, Nexus, navegação, materiais e CSS. **Não afirmar que cada linha de todos os 788 arquivos foi executada ou inspecionada manualmente**: o plano desta Parte exige que o Work conclua a rastreabilidade e os testes de execução em seu ambiente antes de certificar cobertura total.

## 45. A DEFINIÇÃO DE PRONTO MAIS EXIGENTE DO TADEON

### 45.1. Tese final

O Tadeon não pode parecer um painel de administração sobre o qual se aplicaram símbolos, gradientes e animações. Sua composição precisa derivar dos objetos fictícios que ele representa: **fólio** para guardar uma identidade; **tecido** para sustentar uma relação; **fio** para expressar uma intervenção ou dependência; **lâmina** para oferecer uma ferramenta; **vidro** para revelar comandos que pairam sobre a matéria; **palco** para exibir o que existe e pode mudar; **selo** para fixar algo que permanece. Esses elementos jamais equivalem automaticamente a mecânicas: são linguagem visual, não novos poderes.

A qualidade é simultânea: beleza autoral, leitura e uso rápidos, lógica mecânica exata, segurança, continuidade de dados, acessibilidade, fidelidade do universo, economia de recursos do navegador e responsividade arquitetônica. **Se um efeito visual deteriora qualquer uma dessas dimensões, ele não é sofisticado; é defeito de produto.**

### 45.2. A avaliação de uma tela em nove planos

Toda tela, inclusive utilitária, deverá passar pelos nove planos abaixo. São perguntas executivas, não comentários inspiracionais:

1. **Plano de presença:** ao abrir, a superfície declara inequivocamente qual ambiente é? Há uma assinatura própria, feita de composição e matéria, não um grande título genérico? O primeiro elemento que chama atenção é a ação do usuário?
2. **Plano de orientação:** consigo reconhecer onde estou, a quem se refere o conteúdo, qual campanha/personagem/cena está ativa, qual é meu papel e como retornar? Há breadcrumbs somente onde ajudam e um histórico real de navegação?
3. **Plano de anatomia:** cada seção tem posição justificada, hierarquia, eixo de alinhamento, densidade e limite de largura? A composição assimétrica tem tensão controlada, não desorganização gratuita?
4. **Plano de operação:** quais são as três ações mais relevantes neste contexto? Estão próximas do objeto sobre o qual atuam? O restante está disponível em contexto, comando ou inspector?
5. **Plano de estado:** carregando, vazio, bloqueado, somente leitura, pendente, salvo, erro, conflito, offline, antigo/canônico, privado/publicado, selecionado e foco estão desenhados e verbalizados?
6. **Plano temporal:** entrada, hover, toque, navegação, salvar, cancelar, desfazer, transição, bloqueio e falha possuem comportamento coerente? Nenhuma animação anuncia uma transação não confirmada?
7. **Plano relacional:** o que foi alterado aqui repercute corretamente na Ficha, na VP, na Mesa, no Mestre e no Nexus? A ligação é bidirecional apenas quando o contrato autoriza?
8. **Plano responsivo:** o layout conserva sua qualidade em 320, 390, 744, 820, 1024, 1280 e 1440 pixels, além de alturas curtas, zoom, janela flutuante e teclado aberto? **Celular não é desktop empilhado; tablet não é celular aumentado.**
9. **Plano de integridade:** é possível provar visualmente, por teste e por diff, que não se perdeu texto, regra, ferramenta, permissão, referência histórica, estado de câmera ou dado?

### 45.3. Proibições de acabamento

Não usar uma fileira infinita de cards do mesmo tamanho, hero alto em todas as rotas, halo circular atrás de todo ícone, mesma ilustração orbital repetida, iluminação roxa genérica, animação contínua para transmitir falsa riqueza, `backdrop-filter` cobrindo telas inteiras, bordas destacadas sem hierarquia, um `grid-cols-1` mobile como solução universal, miniaturas ilegíveis de interfaces desktop, tab bar que obriga rolagem para encontrar guias, labels que desaparecem em favor de ícones ambíguos, popups que mudam lugar a cada abertura, animação que interfere em elementos de mapa ou dados, texturas escuras que aniquilam a leitura. Não criar gráficos meramente decorativos onde faltam dados.

### 45.4. Vocabulário da melhoria

Cada alteração proposta deve receber uma classificação: **PRESERVAR**, **CORRIGIR**, **REFINAR**, **RECOMPOR**, **INTEGRAR**, **AMPLIAR**, **APOSENTAR APENAS COM PROVA DE NULIDADE**. Exemplo: um botão raro pode ser **RECOMPOR** para um menu contextual, nunca «removido porque polui a estética». Uma regra legada pode ser **ISOLAR** da edição II, nunca apagar seu registro. O Work deverá documentar o antes/depois e localizar o recurso equivalente.

## 46. AUDITORIA DE COBERTURA DO REPOSITÓRIO E DAS GUIAS

### 46.1. Inventário de camadas consultado

Na árvore `main` examinada há 19 arquivos em `src/routes/` — contando rotas internas, auxiliares e técnicas —, 61 itens em `src/styles/` (incluindo testes), 50 componentes em `src/components/tabletop/`, 29 em `src/components/sheet/`, 12 em `src/components/master/`, 17 em `src/components/knowledge/`, 55 primitives em `src/components/ui/` e 129 arquivos em `src/lib/tabletop/`. Estes números são **contagens da árvore de referência**, não um censo de funções comprovadamente ativas. A rota de visual-audit, os endpoints técnicos e arquivos de teste também entram na revisão; não são páginas comuns de usuário.

| Rota / unidade | Papel e telas abrangidas | Design V4 obrigatório | Contrato de continuidade / verificação |
|---|---|---|---|
| `/` — `src/routes/index.tsx` | entrada, campanhas, criação, arquivo e retomada de personagens | átrio de fios, hierarquia editorial, galeria e ações de retorno | filtros, autoria, exclusão, nova ficha, vazios, estados de erro e revisão de edição |
| `/login` | entrada, identidade e credenciais | pórtico contido, matéria de tecido, formulário legível e seguro | autenticar, persistência da sessão, revelar senha, foco, erro e teclado |
| `/reset-password` | recuperação | continuidade gráfica do pórtico, informação e etapas claras | link, validade, nova senha, retorno seguro, expiração e erros |
| `/sheet/$id` | ficha Integral II, ficha histórica, editores, popout e modo legado Jogo | fólio vivo, instrumentos, composição multizona, compactação real | criação, edição, todos os campos, salvamento, conflito, legado, história, inventário, Nexus |
| `/sheet/$id/power` | antiga Versão de Poder, acessível historicamente | enquadramento documental de edição anterior, nunca VP II | registro preservado; não herdar bônus/tabela antiga; não confundir rotas ou botão VP |
| `/tabletop` | Mesa: jogador, mestre, sala, cenas, assets, edição, 2D/3D | palco central, comandos flutuantes e inspetores com pesos diferentes | nenhuma ferramenta de cena removida; autorizações, multiplayer, performance e fog preservados |
| `/master-panel` | campanha, ferramentas históricas, Mestre II e cenários | tear de direção, guias inteligíveis, comando de sessão e preparação | todas as guias da campanha e `tdv2-master` mantidas; dados privados isolados |
| `/nexus` | acervo, árvore, grafo, leitura, criação e relacionamentos | biblioteca com luz de leitura e teia relacional | edição, versionamento, backlinks, permissão, buscas, arquivos, canvas de grafo |
| `/nexus-tools` | backups, importações, saúde/diagnósticos | cofre operacional, sobriedade e clareza de riscos | exportar, restaurar com prévia, baixar, excluir com confirmação, diagnósticos reais |
| `/offline` | leitura local, fichas/cache, Mestre local | edição de bolso com origem temporal evidente | nenhum falso «ao vivo»; proveniência, última atualização, limitações, sincronização explícita |
| `/manage-users` | gestão de acessos e papéis | tabela/arquivo compacto, não mural de cards | pesquisar, filtrar, revisar, alterar, excluir quando autorizado, confirmar impacto |
| `/visual-audit` | laboratório interno de interface | bancada de controle comparativo e cenários | cada padrão em todos os estados e larguras; não vazar debug em navegação regular |
| `src/routes/__root.tsx` | shell global e orquestração | superfícies persistentes; sem reanimar toda a interface a cada rota | auth, rotas, modais, toast, scroll, popups, integração e foco |
| `/mcp`, `/.mcp/*`, OAuth, `.well-known` | endpoints e autorização técnica | não são páginas a embelezar; mensagens de erro acessíveis quando houver UI | rotas e política intocadas sem necessidade; testes de segurança e regressão |
| `sitemap.xml` | índice técnico | sem aplicação de UI | manter resposta válida, sem conteúdo privado |

**Matriz de guias internas do Mestre:** a navegação `master-panel-navigation.tsx` e a composição `master-panel.tsx` devem ser documentadas por valor real de `MASTER_TAB_META`, agrupamento e permissão. No Mestre TdV II foram identificadas as guias `Cena e rodada`, `Resolução e operações`, `Pessoas e ameaças`, `Investigação e Selagem`, `Referência` e `Arquivos e miniaturas` quando habilitadas. Preservar também seções legadas da campanha: sessão, investigações, intervalos, fissuras/dobras, notas, parâmetros, iniciativa livre, fichas, documentos, NPCs, ameaças e outros recursos montados pela rota. **Não substitua a navegação da campanha apenas pelas seis guias do Mestre II:** uma é visão de campanha, a outra é bancada normativa.

**Matriz de guias da Ficha II:** Pessoa; Constituição; Ação; Expressão; Percurso. Cada guia necessita edição, modo somente leitura, vazios, conflito, ferramentas contextuais, revisão histórica, integração e comportamento de altura variável. A guia legada de Ficha/Árvore/Descrição deve continuar no caminho de edição anterior quando aplicável, não como regra II.

**Matriz de modos Mesa:** direção/editor e jogador/participante; seleção, pan, medição, movimentação, habilidades/aplicações, câmera 2D/3D/isométrica quando disponível, biblioteca criativa, editor de arquitetura e visibilidade, inspector de entidade, funções de sessão e presença; o modo progressivo de controles não elimina o acesso a nenhuma ferramenta do workspace completo.

**Matriz de Nexus:** árvore, lista, busca, filtros (tipo/status/visibilidade/relação), coleção, leitura, edição, grafo local/geral, páginas abertas, propriedades, relações, histórico, assets, favoritos, versões, portabilidade e ligação com Mesa/Ficha. São contextos diferentes, não um único painel com os mesmos componentes em sequência.

### 46.2. Classificação por propriedade de código

| Domínio | Componentes ou arquivos âncora | Decisão V4 |
|---|---|---|
| Shell e heads | `app-layout.tsx`, `page-header.tsx`, `workspace-actions.tsx`, `protected-shell.tsx` | uma anatomia de navegação e cabeçalho; variante contextual, sem recriar cabeçalhos paralelos |
| Marca e matéria | `brand-mark.tsx`, `section-symbols.tsx`, `fabric-filaments.tsx`, `material-surface.tsx`, `use-material-light.ts` | autoridade única de marca, vetores oficiais e luz; sem novos efeitos globais concorrentes |
| Menus/seleção | `selection-plate.tsx`, `mobile-more-menu.tsx`, `global-search.tsx` | seleção móvel, menu radial acessível, foco e geometrias coerentes |
| Popups e viewport | `visual-viewport-popup-bridge.tsx`, `route-popup-frame.ts`, `popup-presence.tsx`, `dialog.tsx`, `select.tsx`, `sheet.tsx` | um cálculo confiável de viewport e uma camada correta de foco/colisão |
| Arquivo e dashboard | `continuity-hero.tsx`, `character-archive.tsx`, `index.tsx` | reduzir hero, qualificar capas/lombadas, filtro contextual e hierarquia do primeiro viewport |
| Ficha | `tdv2-sheet.tsx`, `tdv2-test-panel.tsx`, `tdv2-procedures.tsx`, `tdv2-retained-tools.tsx`, `sheet-experience-bridge.tsx`, `sheet.$id.tsx` | integração Registro/VP; conservar história e instrumentos; desempenho no mobile |
| VP histórica | `sheet.$id_.power.tsx` | registro antigo explicitamente rotulado; nova VP não reutiliza regras de poder legadas |
| Motor TdV | `tdv2.ts`, `tdv2-play.ts`, `tdv2-operations.ts`, `tdv2-master.ts`, `tdv2-round.ts` | autoridade única de regra; UI nunca cria cálculo divergente |
| Mestre | `master-panel.tsx`, `master-panel-navigation.tsx`, `tdv2-master.tsx`, `tdv2-procedures.tsx`, `master-hub.tsx`, `session-workspace.tsx` | conservar guias originais e conectar II sem duplicação de estados |
| Mesa | `tabletop-workspace.tsx`, `tabletop-participant-workspace.tsx`, `tabletop-progressive-interface-bridge.tsx`, `tabletop-editor-panel.tsx` | palco único, controle por contexto, nada de engine paralela |
| Mesa lógica | `src/lib/tabletop/*` | manter `TabletopEngine`, serviços de persistência, realtime, visibilidade, projeção e performance como autoridades existentes |
| Nexus | `nexus-workspace.tsx`, `knowledge-reading-panes.tsx`, `knowledge-tree.tsx`, `knowledge-graph*.tsx`, `knowledge-service.ts` | desacoplar geometria de leitura, preservar grafo e segurança por audiência |
| Utilidades | `manage-users.tsx`, `nexus-tools.tsx`, `offline.tsx`, `asset-library-panel.tsx` | visual de cofre/ferramenta; feedback rigoroso em ações irreversíveis |
| CSS | `src/styles/*`, `styles.css`, `docs/style-architecture.json` | arrumar fonte de verdade por responsabilidade; diminuir conflitos, não inflar `!important` |
| Infra | `supabase/migrations/*`, funções, Cloudflare, backups, MCP, PWA | dados e permissões intactos; migrations aditivas, versionadas e testáveis |

### 46.3. Um requisito de rastreabilidade que não admite exceção

Gerar antes do primeiro PR um **inventário manifestado**. Para cada elemento de interface encontrado por inspeção do código e navegação real, registrar: `route`, `role`, `edition`, `mode`, `component`, `action`, `reads`, `writes`, `permission`, `source`, `desktopAccess`, `tabletAccess`, `mobileAccess`, `keyboardAccess`, `legacyDestination`, `targetPlacement`, `risk`, `testId`, `screenshot`. Itens ausentes da V4 não podem ser eliminados por omissão; devem entrar no manifesto e receber classificação. Completar `MASTER_TAB_META`, actions, dropdowns e todos os módulos de Mesa pelo código real, não por suposição.

Não usar «todas as funções estão cobertas» como frase sem prova. A cobertura só é total quando a relação entre evento, interface e teste está fechada, os caminhos legados têm decisão de destino e as capturas verificam acesso em diferentes larguras.

## 47. DIREÇÃO DE ARTE V4 — A MATÉRIA COMO ARQUITETURA

### 47.1. Regra estética mais exigente

A V3 estabeleceu sete materiais; a V4 especifica **como cada material participa da hierarquia**. **O cenário é tecido; o conteúdo é papel/tinta; a operação é metal/vidro; o acontecimento é fio em tensão.** A composição aproxima-se de um ateliê de instrumentos e de um arquivo impossível, não de uma estação espacial neon ou painel medieval genérico. A personalidade surge de relações visuais recorrentes: junção do fólio, dobra lateral, linha que atravessa uma separação, janela que se suspende como lâmina, filamento que termina em ponto documentado, costura como conexão entre duas fontes de informação. A imagem deve parecer *necessária* ao comportamento da tela.

**Material de base:** Vazio `#080A0E` no ambiente escuro; papel `#F5F0E7` e Reflexo `#E9E3D5` para leitura; tinta `#22262D`; Véu `#716B7B`, metal `#7A8187`; acentos Medo `#74242D`, Conhecimento `#D9D7A4`, Tempo `#4F6E5D`, preservando os significados canônicos. Cor de categoria de UI não vira natureza física por semelhança. A cor de Medo não significa moralidade negativa nem erro de formulário; sucesso de salvamento não se colore automaticamente como Tempo. Usar cor semântica operacional separada e com contraste.

### 47.2. O fundo deve conter profundidade, não competir com o assunto

**Camada 0, universo:** superfície sólida escura e estável; degradações cromáticas sutis e de grande raio, sem círculos de neon evidentes. Deve continuar bonita se desligadas as camadas animadas.

**Camada 1, urdidura:** textura direcional com tramas macro pouco frequentes e filamentos muito finos; no Início pode ocupar a periferia, na Ficha aparece como tecido de encadernação, no Mestre como linhas tensionadas no canto da bancada, no Nexus como percurso de vínculos atrás do explorador. A trajetória varia por ambiente, nunca a mesma imagem colada por cima.

**Camada 2, matéria de superfície:** grão real de papel, discreto e sem padrões em mosaico perceptíveis; tecido com microtrama projetada em contraste baixo; lâmina de metal com brilho ao longo da borda; vidro em espessura legível. Os efeitos respondem à direção da luz sem animar constantemente todos os elementos.

**Camada 3, ações:** filamentos de ligação surgem quando um objeto está selecionado ou há relação real; não ficam cruzando tabelas ou texto. O fio nunca deve representar uma ligação inexistente por «beleza».

**Camada 4, comando flutuante:** grupos de controle em material translúcido quase físico, com refração muito discreta, borda em duas intensidades, microparalaxe apenas sob ponteiro fino e halo de foco. A regra de materialidade moderna da Apple faz distinção entre vidro de navegação/controle e conteúdo; adotá-la como princípio funcional, não copiar a marca ou as formas do iOS.

### 47.3. Metas visuais por tipo de matéria (valores de partida, não norma do RPG)

| Matéria | Impressão desejada | Estado/base recomendado | Interação | Erro a evitar |
|---|---|---|---|---|
| Tecido de palco | profundo, tecido tenso, quase insondável | trama muito baixa, brilho tangencial em extremidades | reage ao contexto da cena, nunca ao cursor sobre a área toda | imagem gif infinita, moiré, reduzir contraste |
| Fólio | papel denso, manuseável, legível | opacidade sólida, grão microscópico, sombra de lombada | desdobra sem deformar o texto | borda de pergaminho caricata, curling exagerado |
| Lâmina | utensílio metálico preciso | superfície fria, corte fino, altura moderada | deslocamento de 1–2 px, encaixe com feedback | bevel grosseiro, botões todos metálicos |
| Vidro do Véu | membrana flutuante que acolhe comandos | blur localizado/fallback sólido, rim-light sutil | selecionado move um brilho contido, sem sacrificar label | todo card virar vidro, contraste pobre |
| Fio | relação, percurso, dívida ou operação | SVG ancorado por IDs e pontos reais | tensão, desencontro, costura, estabilização em estados verificáveis | linha ornamental com direção errada |
| Metal de Junção | dobradiça entre regiões | borda pontual, reflexo mínimo | enfatiza onde painel se separa ou é redimensionado | sombra repetida em todo bloco |
| Tinta Viva | anotação e estado confirmado | texto/pictograma de alta nitidez | revela consequência, não pisca | brilho do texto, tipografia fosforescente |

### 47.4. Personalidade por topologia, sem uma página igual à outra

- **Átrio:** uma trama de entrada e galerias em forma de arquivos; elementos não alinhados em uma grade rígida de cards de dashboard. 
- **Ficha Integral:** disposição de atlas com margem editorial, páginas de leitura e instrumentos de inspeção; a relação imagem/texto deriva do dado disponível.
- **VP:** instrumento focal com dois Fios, consultas curtas que emergem da escolha, registro de consequência como fenda lateral; nada de reproduzir as guias da Ficha em tamanho menor.
- **Mesa:** área espacial realmente grande, com ferramentas em órbita periférica; fosco controlado fora do Canvas, nenhum efeito de fundo sobre medição.
- **Mestre:** bancada de direção e camadas de informação de densidades distintas, privacidade visualmente evidente.
- **Nexus:** biblioteca e teia com paginação de leitura, grafo e propriedades em planos próprios; fio relacional conecta apenas entidades existentes e visíveis.
- **Utilidades:** instrumentos de controle com seriedade visual — seguros, enxutos, com status inequívocos.

### 47.5. Acabamento geométrico: composicional, não arbitrariamente redondo

Trabalhar com quatro famílias de terminação: **corte** (bordas majoritariamente retilíneas, cantos pontualmente arredondados), **dobra** (um canto ou aba assimétrica para indicar abrir/contínuo), **lâmina** (arco mais pronunciado apenas em controles flutuantes), **nó** (encontro de linhas com marcador). Escolher por função; não randomizar radii. Aproximações iniciais: 4–8 px em módulos de dados; 10–16 px em painéis; 18–26 px em dock/janelas; círculos apenas para tokens, cursores de recurso ou ações radialmente justificadas. Ajustar em protótipos por escala e densidade, nunca aplicar o mesmo radius global.

Alinhamento editorial exige **eixos invisíveis compartilhados**: origem do título, primeira linha do corpo, eixo do instrumento, cortes de seção, base dos controles. A assimetria ocorre porque um foco é maior, não porque cada card foi deslocado alguns pixels. Cada página precisa de uma grade interna que se veja ao ativar o modo de diagnóstico; verificar relações entre margem, texto, coluna e rail. Usar grid e flex reais, não posicionamento absoluto para estrutura informacional.

### 47.6. Tipografia: transição do universo para a ação

A titulação de capítulo pode usar serifada editorial com carácter do universo (famílias aprovadas no Fio~Mestre e já existentes no projeto); texto corrente permanece legível em telas densas, sem depender de letras muito ornamentadas. Métricas inicialmente propostas: título de página em desktop `clamp(1.5rem,2.4vw,2.35rem)` e mobile `1.35–1.75rem`; seção `1.05–1.4rem`; texto comum `0.875–1rem` conforme densidade, mas nunca microtexto crítico; metadata `0.7–0.8rem` apenas quando não constituir instrução ou decisão; números/tabulações com `tabular-nums`. Não usar Cinzel para parágrafos, nem oito famílias diferentes. Foco na precisão dos números e na distinção de resumos, notas e ações.

### 47.7. Iconografia autoral e imagem

Preservar **marcas vetoriais oficiais** e seus vazios geométricos. Criar uma família de ícones instrumentais (pilar, vínculo, costura, lâmina de mesa, evidência, tempo, selagem) por vetor com espessura coerente, em vez de substituir tudo por ícones de pacote aleatórios. Lucide continua legítimo em utilidades onde legibilidade prevalece. Ícones de 16–20 px em controles densos, 20–24 px em ações primárias, símbolos editoriais maiores apenas onde comunicam ambiente. Nenhuma imagem de estoque genérica de «fantasia», pergaminho, torre ou constelação será usada para preencher espaço. Assets devem ter procedência; fotografia/arte de personagem deve ser fornecida/selecionada e nunca inventada sem intenção.

### 47.8. Critério da arte em três distâncias

A 3 metros, cada área é reconhecível por massa cromática e estrutura; a 60 cm, entende-se a hierarquia; a 20 cm, os detalhes de linha/textura recompensam o olhar. Uma peça que só é impressionante em zoom 400% do Figma mas desaparece ou gera ruído no celular não está aprovada. O fundo deve ser relevante mesmo sem movimento. A qualidade dos detalhes não autoriza reduzir usabilidade.

## 48. COMPONENTES UNIVERSAIS — AUDITORIA ATÉ O ÚLTIMO CONTROLE

Esta é a especificação de estados de **cada classe de componente**, não a imposição de uma mesma forma a todas as páginas. Implementar na biblioteca existente; toda nova variante deve ser semanticamente justificada e não abandonar teclado, leitor de tela ou uso por toque.

### 48.1. Botões: seis estratos, todos com contrato de feedback

1. **Ação primária** — única prioridade visual no contexto. Relevo de lâmina/vidro, label explícito, ícone se acrescentar orientação. Estado normal estabelece contraste; hover desloca reflexão 6–12 px *dentro do botão*, sem mexer no layout; `active` comprime até 0,985 com resposta curta; `pending` mostra ação em processamento e proíbe duplo envio; `confirmed` mostra mensagem, e **só quando o servidor confirmar**. Desabilitado mantém texto legível e informação do motivo em descrição acessível.
2. **Ação secundária** — contorno e plano superficial, densidade semelhante; não competir com a primária. Hover expande suavemente a linha de junção e altera ênfase, não produz glow chamativo. Deve manter área de toque suficiente.
3. **Ação contextual** — material leve junto ao objeto (item, personagem, token, evidência); surge por seleção, foco ou clique; nunca depender exclusivamente de hover. Ícone + nome em tooltip/popover. Em toque, abrir explicitamente ou oferecer menu de ação.
4. **Ação de perigo** — excluir, revogar, perder progresso, sobrescrever; não copiar semântica de Medo como se fosse «vermelho do erro canônico». Confirmar consequências reais, tipar alvo, oferecer reversão quando possível, impedir clique acidental e alertar se sincronização estiver pendente.
5. **Ação silenciosa** — ícone sem fundo, próxima de campo/título; opacidade e borda aumentam no hover/foco; fica disponível por toque/teclado. Controles de fechar/remover precisam de target suficiente mesmo que o glyph seja pequeno.
6. **Ação de jogo** — rolar, gastar Impulso, Ancorar, Forçar, revelar carta, aplicar consequência; a ação sempre tem prévia de custo, sujeito, modo e estado. Nunca tocar/rolar duas vezes por efeito de atraso. Prover confirmação apropriada antes de gastar recurso irreversível ou publicar algo.

**Inventário de estados:** `rest / hover / pressed / focused / selected / dragging / valid / warning / disabled / pending / optimistic-draft / remote-confirmed / error / retry / read-only / offline / conflict`. Cada variante tem desenho no laboratório, em fundo de Vazio, Fólio e Mesa; demonstrar que `selected` é distinguível de `hover` e de `focus`. O efeito de luz não substitui borda ou texto do estado.

### 48.2. Cards, painéis, folios, listas e linhas

**Card não é o elemento universal da UI.** Usá-lo para unidade isolada, como personagem, objeto de catálogo ou evento. Em listas densas preferir linhas articuladas; em leitura usar fólio; em Mesa painel leve/inspector; em relações usar nós e conexões. Regras por objeto:

- Personagem no arquivo: silhueta de lombada, número de fio, nome legível, contexto de campanha/edição, progresso adequado e ação Abrir. Layout de galeria responsivo com variação intencional de largura, sem cartões aleatórios que comprometam varredura. Edição/controle de acesso e deletar ficam agrupados com separação tátil.
- Pessoa/NPC no Mestre: linha densa com retrato/sigilo opcional, intenção/status, relação com cena e acesso rápido; expandir em inspector ou janela sem criar outro cartão na mesma página.
- Condição: forma física (círculo/triângulo/losango) e rótulo completo, origem, efeito, saída e intensidade; gráfico pode reforçar, nunca substituir palavra. Sem pena numérica não autorizada.
- Carta: respeitar proporção 63×88 mm ao exibir frente gráfica digital, mas **não forçar** 63×88 mm na tela mobile ao consultar texto longo. Front visual abre lâmina informativa legível; verso deve ser reservado para informação realmente ocultável. Cartas físicas recebem identificador e data; impressão datada não assume sincronização.
- Documento: superfície de leitura com margens editoriais, resumo/versão, origem, proveniência, acesso e ações na borda do fólio. Comentário/hipótese diferencia-se de fato canônico e de anotação de Mestre.
- Lista/tabela: densidade alta, alinhamento decimal, row hover localizado, seleção com contraste, ações reveladas sem deslocar colunas, cabeçalho legível, filtros que não prendem viewport; scroll apenas onde indispensável e com orientação de overflow.
- Filtro-chip/etiqueta: identifica estado, não substitui botão de controle. Não usar 12 badges coloridos simultâneos; agrupamento de filtros não vira ruído visual.

### 48.3. Cabeçalhos e anatomia da primeira dobra

Há **cinco anatomias de head**, derivadas do componente existente `PageHeader`, sem duplicar código:

1. **Head de Átrio:** entrada que cumprimenta e oferece a principal continuidade. Compacto por default; arte periférica e texto contextual, sem ocupar dois terços do mobile.
2. **Head de Registro:** nome da personagem, edição, campanha, estado de salvamento e alternância Ficha/VP. O nome pode crescer em 1–2 linhas sem esmagar os controles; corpo da ficha rola; não congelar um hero alto.
3. **Head de Palco/Mesa:** identidade discreta, nome da cena, presença/realtime e controles de sessão; maior parte da altura preservada para canvas. O inspector deve ser independente da altura do head.
4. **Head de direção:** campanha, sessão ativa, contexto de cena, progresso de gravação e separação visual privado/publicado. Guia do Mestre não desaparece ao mudar subpainel.
5. **Head de Acervo/Utilidade:** título e contexto do workspace, ações de criação ou recuperação, indicadores de fonte/versão. Em documentos, o título pode ocupar o próprio fólio, evitando duplicação com head global.

Todos: ícone oficial da seção com tamanho calculado, eyebrow útil (sem slogan redundante), baseline de título, ações previsíveis, menu mais acessível, foco e estado. Se ações não cabem, movê-las para overflow com prioridade definida; não reduzir a fonte até 10 px. `Salvar` deve aparecer de forma inequívoca quando existe rascunho; ícones isolados só com tooltip/label. Medir altura depois de fontes carregarem, sem CSS `top` mágico que varie por rota.

### 48.4. Menus de navegação — um sistema de comportamento

**Desktop:** barra lateral pode reduzir a coluna visual sem eliminar nomes de destinos de forma irrecuperável. Item ativo mostra placa/filamento móvel que transita da posição anterior; ícone ancorado e texto não escorrega. No hover, resposta sutil; em foco, linha inequívoca; menus expansíveis conservam estado, mas não flutuam sem âncora. Indicador de campanha não deve mudar a seleção de seção quando usuário só troca de ficha.

**Tablet largo:** preferir barra lateral compacta com opção de expansão sobre conteúdo, ou barra de trabalho superior + rail. Permitir duas ou três áreas simultâneas quando o conteúdo necessário couber. Sidebar jamais se torna obrigatoriamente drawer de telefone pelo simples fato de `width < 1024`.

**Mobile:** dock inferior de destinos essenciais e menu `Mais` radial existente com três pontos orbitais — manter sua identidade, porém revisar arco, alcance com polegar, zona de colisão, sobreposição ao teclado, toque fora, gesto voltar, fechamento central, retorno de foco e modo reduzido. Rotas secundárias ficam em menu acessível por lista compacta se a disposição radial não comportar todos os destinos; **não** adicionar raios infinitos. O dock abre caminho para a ação principal da tela, não precisa mostrar tudo ao mesmo tempo.

**Navegação cruzada:** ficha ↔ VP mantém personagem; Mesa ↔ Ficha mantém participante selecionado; Mestre ↔ Mesa mantém campanha/cena; Nexus ↔ referência mantém documento/entidade e permissão. Os enlaces preservam retorno quando razoável, não recriam estados de autenticação ou variantes históricas.

### 48.5. Guias, tabs, segmented control e seleção móvel

Uma guia selecionada é uma placa que se desloca entre pontos, com movimento de «fantasma» discreto e conservação do texto; não é um underline teleportando. Quando o usuário escolhe outra guia: 1) placa desliza ou cruza com dobra curta; 2) conteúdo antigo sai com opacidade/translate mínimo; 3) novo entra já na posição correta; 4) foco é preservado ou movido segundo intenção e tecnologia assistiva; 5) estado de edição é conservado; 6) scroll em guias longas só é restaurado quando previsível. A placa deve respeitar `prefers-reduced-motion` e não executar movimento contínuo quando a navegação é indireta.

**Regras de tabs:** distinguir navegação estrutural de filtro local; não colocar cinco etiquetas truncadas numa única linha de 320px. Usar distribuição proporcional em duas linhas, trilho horizontal curto com indicação de lados ou seletor híbrido quando necessário. Para Ficha II preservar cinco áreas; para Mestre não achatar menu completo em tabs II; para Nexus árvore/lista/grafo são modos de conteúdo, não ações perigosas. Ícones + palavras onde reconhecer apenas glyph é difícil.

### 48.6. Inputs, selects, steps, sliders e editores

Input tem quatro estados básicos legíveis: repouso (plano rebaixado), foco (borda de encaixe + caret inequívoco), valido (sem glow teatral), erro (mensagem próxima com causa/recuperação). Nunca usar float label que cobre conteúdo ou placeholder como único rótulo. Contadores e recursos numéricos têm `+` e `−` delimitados, valor ao centro, máximo/contexto visível; segurar para repetir não pode consumir custo RPG sem confirmação. O botão de limpar campo não deve ocupar área de outro controle. Textarea narrativa expande até limite, preserva scroll e cursor e não reexecuta efeito gráfico a cada tecla. Select deve ter lista legível, busca em catálogos extensos, foco consistente, portal alinhado e sem recortar em teclado/viewport. Slider requer valor numérico acessível; Tensão/Equilíbrio não se confundem nem devem permitir alteração direta fora das regras sem operação autorizada.

**Edição de vínculos:** cada registro deve exibir relação, condição atual e texto longo; ações `editar`, `vincular ao Nexus`, `registrar evento`, `alterar estado`, `remover` precisam ser distinguíveis. `Remover` jamais deve equivaler à mudança ficcional de `Rompido`. Todos os campos com salvamento serializado e proteção de conflito, sem perda ao trocar de guia.

### 48.7. Diálogos, drawers, popovers, menu contextual, tooltip, toasts

- **Dialog de confirmação:** tamanho proporcional ao conteúdo, foco inicial não destrutivo, fechamento por X/Escape/clique fora quando seguro; ações em ordem estável; estado `saving/conflict` mantém instrução clara. Se existem custos ou perda, conteúdo descreve precisamente.
- **Drawer/inspector:** no desktop, nasce de uma aresta real da bancada; no tablet, pode persistir simultaneamente; no mobile, lâmina parcial com três pontos de altura conforme informação; preferir dentro da viewport visual real. Arraste para fechar não pode perder dados sem aviso.
- **Popover:** nasce do gatilho, abre sem deslocar o documento e respeita bordas/safe areas; não duplicar `backdrop-filter` que causa black boxes no navegador móvel.
- **Tooltip:** expõe nome e atalho após atraso curto com ponteiro fino; em touch, usar labels visíveis, menu/info de ajuda ou long-press como extra **não exclusivo**.
- **Toast:** uma frase de estado e ação de recuperação; aparecimento curto, seguro em safe area, não bloquear botão global; erros persistentes não desaparecem sem alternativa de acesso. Salvar remoto confirmatório difere de `rascunho local`.
- **Comando e busca:** `Command` paleta global encontra destinos e operações permitidas, agrupa resultados por área e contexto, não mostra segredos ou ações proibidas por papel. Escape retorna foco; Enter executa ação uma vez; item com risco pede confirmação.

### 48.8. Menus contextuais da Mesa e do Acervo

Menu contextual deve filtrar pelo estado real de seleção, por papel e pela ferramenta ativa; comandos não aplicáveis ficam indisponíveis **com motivo**, ou ausentes quando seriam vazamento. Cada item deve ter ícone claro, label e agrupamento previsível. Em touch, abrir por botão de contexto/seleção; no canvas, pressionar e segurar é opcional, nunca única forma. A seleção persistente do token não deve desaparecer quando o menu é aberto. Fechar menu não move câmera nem token.

### 48.9. Tabelas e gráficos funcionais

Recursos, perfil de Matrizes e Alinhavos, pressão de frente, desenvolvimento/PU, integridade de objetos e evolução de Vínculos são passíveis de representação gráfica **quando baseados em dados verdadeiros**. Radar de quatro Matrizes não deve sugerir atributos da edição antiga; elemento central visual pode apoiar leitura, mas as quatro dimensões e números continuam acessíveis. Pressão e Compasso têm perguntas diferentes; não plotar uma só curva unificadora. Grafo de Nexus precisa de lista textual equivalente. Hover de gráfico revela dado/causa/fonte; foco e toque oferecem acesso correspondente, não deixam valor inacessível.

## 49. MOTION SYSTEM V4 — COREOGRAFIA, FÍSICA E HONESTIDADE

### 49.1. Gramática de movimento e duração

Todos os movimentos partem dos verbos da V3: **Assentar, Desdobrar, Tensionar, Costurar, Reverberar, Dobrar**. Em V4, acrescentar uma *árvore de causa* para cada animação: que evento a inicia, qual estado exato representa, se é reversível, o que faz em erro, em redução de movimento e quando tab está em background. Propostas iniciais:

| Movimento | Duração alvo em dispositivo fluido | Componente | Significado |
|---|---:|---|---|
| micropress/release | 90–160 ms | botões, toggle e itens | feedback tátil imediato |
| hover/revelação local | 160–240 ms | fila, linha, iconografia | affordance, não decisão persistida |
| placa de seleção | 180–320 ms | guias, sidebar, segmentados | mudança de foco/contexto |
| abrir/fechar lâmina | 260–440 ms | popover grande, drawer, inspector | nova camada de contexto |
| transição entre rotas | 160–300 ms | shell e área de conteúdo | continuidade sem bloquear interações |
| evento de Fios | 320–600 ms | motor de teste, vínculos | exibir operação/consequência confirmada |
| cena especial | 450–850 ms, opcional | abertura de cena/revelação | acontecimento extraordinário, não rotina |
| atmosfera de tecido | deslocamento quase imperceptível, pausável | fundo periférico | presença passiva sem distrair |

Estas são **metas experimentais**, não parâmetros normativos. Reduzir/retirar se atrapalham teclado, Canvas, CPU, estilo ou leitura. Nunca usar animação para mascarar indisponibilidade do serviço.

### 49.2. Hover em seis fases observáveis

**Anterior:** layout parado, controle identificável. **Approach:** ponteiro aproxima de alvo grande e luz local responde apenas se há interação útil. **Hover:** 1–2 px de elevação ou rotação parcial de brilho, mudança de borda e sugestão de ação. **Press:** contração leve, sem deslocar componentes adjacentes. **Commit:** feedback de ação pendente; só concluir após servidor. **Exit:** retorno coerente à origem; se selecionado, conserva identidade estável e não volta ao repouso. Hover de texto corrido não precisa de movimento; inline link ganha sublinhado, ícone de navegação pode deslocar 1–2 px, mas não sacudir.

### 49.3. Fio com movimento físico discreto

Ao ativar uma relação real: nasce no ponto de origem, toca a junção, dirige-se ao alvo. A animação deve obedecer **âncoras de DOM/SVG** e recalcular de forma limitada após resize; não desenhar filamento que atravessa botões ou texto. Ao mudar um Vínculo de Presente para Tensionado, o fio pode estreitar seu arco e escurecer sutilmente; «Rompido» pode apresentar interrupção geométrica **sem apagar o registro**; «Costurado» une por um nó registrável. Ao finalizar uma operação, a linha desacelera e Assenta; em erro de rede, permanece um draft visual distinguível e não um evento confirmado. Não animar linhas sem ligação de dados verificada.

### 49.4. Textile motion: tecido que se move sem se tornar wallpaper

Usar microdeformações localizadas em tecido no **limite externo da cena ou no shell**; fundo de Ficha pode revelar um desvio de fibra ao mudar de área, seguido de repouso. A tessitura pode responder ao resize com parallax máximo de poucos pixels; durante scroll de texto e rolagens não aplicar ondas. Em mobile, preferir textura estática + uma única transição de região, evitando `filter` e WebGL ornamental. Em tablet a integração com Pencil/trackpad permite reflexo local no objeto selecionado, não uma física de tecido na página inteira.

### 49.5. Light as a material property

Uma fonte virtual dominante por workspace, coerente entre cabeçalho e borda de vidro; não pôr luz em cada botão com orientações contraditórias. Fólio recebe luz difusa; vidro, rim-light; metal, linha estreita; fio, saturação baixa. Se a página é repleta de miniaturas/imagens, reduzir fundos animados. A iluminação não deve indicar que um campo tem benefício, perigo ou permissão se não houver esse estado.

### 49.6. Transições entre páginas e janelas

**Trocar Ficha→VP:** preservar nome/avatar e mostrar transição de encadernação para bancada; não reinicializar personagem. **VP→Mesa:** a ação/contexto permanece como chip de origem autorizado e a Mesa abre em cena selecionada, sem autorizar movimento por transição. **Mesa→Nexus:** o local/objeto selecionado pode abrir seu fólio correspondente se usuário tem acesso, retornando com posição de câmera preservada. **Mestre→Mesa:** preservar cena e seleção, sem reabrir sala duplicada. `Esc`/back retornam ao contexto anterior, não fecham a aplicação.

**Não** implementar transitions via snapshots com dados privados reaproveitados entre papéis, Canvas clonado que consome GPU, `document.startViewTransition` sem verificação de suporte ou animação que pausa operações de tempo real. Melhor crossfade localizado que transition sofisticada com perda de estado.

### 49.7. Motion dos dois Fios e da operação

Pré-rolagem: o jogador visualiza intenção, abordagem, Matriz/Alinhavo, DT declarada e custos relevantes; o fio ainda não «ganhou» nem «perdeu». Rolagem: mostrar valores originais de Prumo e Tento e o resultado; uma Consonância visualmente indica igualdade sem multiplicar efeitos. Desvio pode aparecer como separação/ângulo mensurável **sem interpretar automaticamente como bônus ou maldição**. Crítico (duplo 1) tem assinatura forte, porém curta, sem tremores agressivos ou flashes. Resto/Devolução/Rastro/Permanência podem gerar fio para registro quando o resultado ficcional já foi decidido; aprovação do Mestre precede publicação. Forçar e pagamentos são exibidos uma única vez por `eventId`; nunca produzir segundo som/efeito que pareça segunda cobrança. Com `prefers-reduced-motion`, a operação continua compreensível apenas com texto e mudanças instantâneas de estado.

### 49.8. Acessibilidade dos efeitos

Respeitar `prefers-reduced-motion`, reduzir transparência quando compatível, alto contraste, `forced-colors`, suspender loops em background. Nenhum flicker acima de limites seguros, nem paralaxe involuntária em toque. Animações de elementos com foco não devem arrancar o foco. Para mudanças de cenas importantes, anunciar texto relevante uma vez com `aria-live` apropriado; não narrar cada frame. A qualidade «nível Apple» inclui ausência de enjoos, desorientação e saltos de layout.

## 50. RESPONSIVIDADE V4 — UMA COMPOSIÇÃO POR CONTEXTO, NÃO POR CLASSE DE DISPOSITIVO

### 50.1. O critério é a largura útil do instrumento

Definir cada workspace com **container queries**, não apenas `@media width` do viewport. O mesmo tablet pode comportar duas colunas em tela cheia e uma coluna adaptada quando janela ocupa metade da tela; um celular paisagem pode dar ao palco uma proporção larga, mas menos altura. Calcular largura útil depois do shell, sidebar e inspector. Adotar mínimos intrínsecos e `minmax(0,1fr)`; não criar scroll horizontal de página inteira por um bloco. Proporções e breakpoints abaixo são **protótipos sujeitos a captura**, e não equivalências com classes de dispositivo.

| Espaço útil de um workspace | Anatomia ideal | Exemplo de uso |
|---:|---|---|
| 280–359 px | microcolunas de 2 itens quando dados são curtos; instrumento único quando complexo; títulos 1–2 linhas | 2 recursos lado a lado, 2 ações compactas; sem carta/trama cortada |
| 360–519 px | editorial móvel com pares compactos, trilhos e inspeção em lâmina | recursos em trio compacto; Matriz 2×2; lista de Alinhavos por grupos |
| 520–719 px | composição móvel ampla, 2 regiões pequenas ou palco + barra lateral contraída | mapa e inspector por transição; guias com identificação integral |
| 720–879 px | tablet estreito: área principal + inspector pequeno, ou dois painéis flexíveis | Nexus lista + leitura, Mesa palco + toolbar, Ficha foco + contexto |
| 880–1100 px | tablet expandido: **PC-first** com duas regiões persistentes e 3ª sob demanda | Ficha fólio + painel de instrumento; Mestre cena + oposição |
| 1101–1399 px | desktop compacto com 2–3 regiões em proporções justificadas | Mesa + inspector + menu, Nexus árvore + leitura + relações |
| ≥1400 px | bancada editorial completa, max-width de leitura e áreas periféricas | palco grande, navegação, folha, acompanhamento persistente |

**Exceção por altura:** em 1024×600 ou mobile paisagem, evitar cabeçalhos/docks altos e reduzir o tamanho da área reservada aos comandos. Nunca esconder a ação crítica atrás do teclado virtual.

### 50.2. Microcomposição mobile: substituto dos tijolinhos

Abaixo de 430 px, garantir composição simultânea onde faz sentido: Matrizes em 2×2 com números legíveis; PV/PI/PE em 3 instrumentos compactos **se** cada um tem label e valor completos; duas ações lado a lado com largura mínima suficiente; informações de cena em duas metades assimétricas; horizontal scroll *apenas dentro de repertórios comparáveis* com itens parcialmente visíveis para indicar continuação. Estrutura textual densa recebe resumo e expansão local; não cortar textos narrativos. Cards de mídia podem ser 2 colunas por critério de densidade, não por obrigação. Ficha mobile não pode obrigar 30 telas de rolagem só por ter convertido todos os grupos em blocos de 100%.

### 50.3. Tablet deve preservar a sofisticação e a potência do PC

Tablet é **bancada plena em janela variável**. Entre 768–1100 px: preservar menu lateral como rail quando possível; inspector de 240–320 px **se** conteúdo principal mantém mínimo; Ficha com colunas de 55:45 ou 60:40 em áreas cabíveis; VP com dois Fios como protagonista e carta em painel lateral; Mesa com Canvas ≥65–75% da área horizontal útil quando ferramenta lateral aberta, ajustável; Nexus com árvore 220–260 px e leitura flexível, grafo em modo espacial com inspector sobreponível. Em retrato, preferir dois painéis que possam mudar de peso, não empilhar a interface inteira. Permitir `drag`/resize de divisor quando suportado; guardar preferências por workspace e usuário, sem salvar largura de uma janela como regra para todas.

### 50.4. Regras de compactação e ações persistentes

- `head` mobile compacto (identidade + status + alternância essencial) e conteúdo aparece na primeira dobra; em Mesa, título vira barra curta.
- Uma barra inferior de 44–60 px, respeitando safe area; nunca cobrir input, token ou botão de confirmar. A VP pode usar barra de ação temporária durante intervenção, sem segunda dock permanente ocupando a mesma zona.
- `position: sticky` apenas para controles cuja referência é necessária; sticky de cabeçalho não pode consumir 25–40% da altura da janela.
- Popups com largura calculada pelo viewport visual e margem mínima; caso teclado abra, recuperar foco, reencaixar sem piscar/teleportar.
- Nunca confiar em hover para revelar a ação principal; toques têm estados explícitos, com feedback e alvo confiável.
- Texto com idioma variando e zoom 200–400% deve crescer e redistribuir; é preferível reflow elegante a truncar campo essencial.
- Canvas de Mesa usa touch-action apropriado por ferramenta, diferencia scroll de página, pan, pinch, mover token e pressionar itens; prevenir movimentação por scroll involuntário.

### 50.5. Conjunto de verificações de viewport (mesma UI, todos os papéis)

Capturar em `320×720`, `360×780`, `390×844`, `430×932`, `568×320`, `744×1133`, `768×1024`, `820×1180`, `834×1194`, `1024×768`, `1024×1366`, `1180×820`, `1280×800`, `1440×900`, `1920×1080`. Testar 200% e 400% de zoom, fonte ampliada, janela tablet em 50% e 1/3, safe area, teclado aberto, conexões lentas, modo de alta redução de transparência e contraste. Comparar conteúdo/ações presentes, não apenas ausência de overflow. Avaliar a hierarquia por captura: quantos pixels até a primeira ação útil, área real de mapa, quantidade de comandos acionáveis sem procurar escondido e legibilidade dos instrumentos.

## 51. O ÁTRIO, LOGIN E ARQUIVO — PRIMEIRA IMPRESSÃO COM PERSONALIDADE

### 51.1. Dashboard como mesa de entrada de arquivo, não grade de métricas

**Primeiro plano:** título curto, saudação discreta, ação `Retomar`, campanha/última sessão quando há vínculo acessível, indicadores de sincronização quando necessários. Uma trama de filamentos parte do cabeçalho e se desfaz na borda do arquivo; **não simular estados de campanha** se faltam dados. O hero `continuity-hero.tsx` deve ceder área à ação e ao conteúdo na primeira dobra; reduzir altura em 320–430 px até a primeira ficha/relevância ser visível. O adorno do hero pode concentrar a composição artística, mas a identidade não termina nele.

**Segundo plano:** arquivo de personagens como catálogo de lombadas: cartão/fólio retrabalhado com categoria de edição, campanha associada, nome e contexto. A assinatura de cada personagem pode nascer de seu nome/arte previamente atribuída; sem imagem, usar sistema tipográfico e um filamento identitário baseado em campos existentes, jamais gerar retrato automático. As peças podem ter razão geométrica variável entre destacado e compacto, mas altura de linhas e alinhamento textual devem ser consistentes. O usuário deve encontrar rapidamente sua própria ficha, podendo ver só as que possui/autorizadas conforme dados atuais.

**Terceiro plano:** recentes, atalhos para Mesa, Nexus e Mestre segundo permissão, status de sessão e eventuais avisos que mereçam atenção. Não criar widget fantasioso de «última alteração do universo» sem fonte. Um painel vazio não vira grande caixa com símbolo genérico; oferecer o próximo gesto que realmente existe (`Criar ficha`, `Abrir Mesa`, etc.).

**Microinterações:** card revela uma segunda linha de ação em hover ou seleção explícita; passagem do fio para detalhes sem trocar de tamanho; abrir ficha tem transição entre lombada selecionada e fólio; excluir solicita confirmação, mostra se o alvo pertence ao usuário e não anima sua extinção antes da confirmação remota. Busca com resultado 0 mantém filtro visível e oferece limpar. Ordenação conserva foco e posição do catálogo.

### 51.2. Criar personagem

Modal/janela: origem de campanha, nome, responsável quando permitido, edição e consequência de escolher TdV II, sem coletar 30 campos de uma só vez. A criação inicia um **rascunho** e a Ficha guia revisão de Feição/Matrizes/Alinhavos; o usuário não deve sentir que personagem está pronta quando só escolheu nome. Não inferir conversão automática de Rank, exposição, dano ou Forma de Poder antiga. O botão `Criar` distingue rascunho local, envio e conclusão. Se falha, não fechar janela e perder nome. Mostrar permissão/autoria e caminho de voltar.

### 51.3. Login, erro de autenticação, recuperação

**Composição:** fundo de tecido profundo, cortina/linha de abertura em apenas um lado, logotipo/símbolo correto, nome da obra com assinatura tipográfica e formulário assentado em fólio/vidro opaco. O formulário deve ocupar largura pequena a média, sem uma enorme arte empurrando o input abaixo da primeira dobra no celular. Em tablet horizontal, a arte pode ter ~40% e o formulário ~60%; em retrato menor, arte comprime em friso lateral/superior.

**Estados obrigatórios:** carregamento inicial, credencial incorreta sem revelar qual campo falhou, senha visível/oculta com toggle `aria-pressed`, erro de rede, login pendente, conta bloqueada se suportado, redirecionamento seguro ao destino, reset solicitado, link expirado, senha alterada, retorno à aplicação. Não revelar dados de usuário em título de página antes de autenticar. Transição autenticada não deve exibir flashes de dados de sessão anterior.

## 52. FICHA INTEGRAL — AUDITORIA VISUAL E MECÂNICA DOS CINCO FÓLIOS

### 52.1. Forma geral do Registro

**Desktop:** cabeçalho compacto relativo, largura narrativa controlada (leitura de texto longo não deve percorrer 1300 px), coluna de presença da personagem que não disputa foco, régua de navegação entre cinco folios, folha central de 56–68% da área útil conforme abertura da região de detalhes e painel auxiliar de até 300–360 px, quando apropriado. Em uma área larga, **não** manter permanentemente cinco cards de mesma largura: a identidade pode ter uma grande coluna editorial e uma área estreita de Âncora/estado; Constituição, uma bancada de atributos e instrumentos; Expressão, um catálogo com inspeção.

**Tablet:** manter pelo menos dois planos de leitura quando cabe; a relação 60:40 é ponto de partida, e uma coluna mais estreita não pode afogar tabela de Alinhavos. Inspector pode tornar-se aba lateral retrátil. **Mobile:** explorar espaço horizontal — 2×2 Matrizes, recursos em grupos compactos, guias em duas linhas quando preciso —, usar desdobramentos para conteúdo narrativo, sem reduzir controles a textos de 9px. Os dados não devem surgir tão abaixo do cabeçalho que pareça uma página vazia.

**Fundo específico:** papel ou tecido escuro com marca de dobra lateral e fio residual; a textura para baixo da massa de leitura é estável. Iluminação segue lombada/encadernação e só acentua bordas; não colocar uma roda de magia atrás da biografia.

### 52.2. Pessoa — estrutura e relações

**Composição:** título/nome e símbolo no eixo principal; quatro pilares Origem, Ofício, Convicção, Limite como segmentos editoriais unidos por linhas de margem, com densidades ajustadas ao comprimento. Marca ocupa uma dobradura própria de três elementos **Gatilho → Manifestação → Resíduo**, sem pressupor sobrenaturalidade. No lado contextual, a Âncora aparece como peça articulada de um pilar real, não como sexto atributo numérico. Vínculos ocupam teia relacional com vista lista igualmente boa; no celular, lista ordenada e micrografo opcional, nunca grafo esmagado em 280px.

**Gestos:** tocar Vínculo abre contexto com Natureza, Estado, Oferta, Cobrança e Tensão; pode ligar a nó do Nexus autorizado. A linha reage ao estado: Presente, Tensionado, Ferido, Rompido, Costurado; a mudança registra evento ficcional e não cria bônus. Ao invocar Âncora: preview de consequência concreta, opção Sustentar/Redirecionar, explicação do que ainda permanece e confirmação; após aplicar, status Abalada; Reassentar exige ação significativa e registro. Não usar botão `Restaurar Âncora` sem contexto. Formulários preservam o rascunho ao alternar guias e não reordenam Vínculos durante digitação.

**Campos auxiliares preservados:** nome do jogador, descrição física, traços, história, referências, ilustrações se presentes, vínculos documentais, fotos/arte do personagem e seções de narrativa mais antigas que continuam relevantes. Nenhum dado prévio do `SheetDescriptionPanel` ou `Tdv2DossierDetails` é descartado simplesmente porque não pertence aos quatro pilares centrais.

### 52.3. Constituição — instrumentos, não números soltos

**Matrizes:** painel de quatro partes com marca própria para Ímpeto, Cadência, Nexo, Lastro. O radar deve ter eixos equilibrados e leitura textual completa; um número de grau referencia o dado correspondente (d4/d6/d8/d10/d12 e d20 apenas excepcional). Em mobile, quatro instrumentos 2×2 com indicador de grau e dado, radar recolhido por seletor ou disposto lado a lado com 2×2 quando houver largura. Não desenhar sistema de cinco atributos/Rank na edição II.

**Alinhavos:** 21 entradas agrupadas por afinidade de uso **somente como taxonomia de interface**, mantendo a lista canônica e a possibilidade de localizar cada uma diretamente. Dentro de 360–430px, duas colunas de linhas curtas onde labels couberem, ou grupos editáveis densos com um grupo principal e inspector; nunca mostrar 21 cards altos. Busca rápida `Encontrar Alinhavo`, mostrar grau/integração com Prumo/Tento, investimentos e revisão. Ao investir, fonte PU, elegibilidade, custo, incorporação e valor resultante ficam juntos.

**PV/PI/PE:** trio de recursos com aspecto de instrumento de bordo, número grande central e máximo textual, tendência só se houver eventos. Ajustar valor não deve disparar transação de combate invisível; consumo/recuperação exige causa quando apropriado. Quatro Defesas, Guarda, proteção/cobertura e condição de Guarda Quebrada são grupos distintos com origem/cálculo/efeito. Equipamento não concede automaticamente proficiência ou RD fora da regra. Estado de 0PV, 0PI e 0PE apresenta procedimento correto, não barra vermelha com contagem de morte inventada.

**Equilíbrio/Tensão:** o melhor desenho é um eixo do Medo ao Conhecimento com campo central de mediação; o cursor físico/digital do Equilíbrio não equivale a bem/mal, Tensão é acumulador distinto. Em ±4 de Tensão há um deslocamento de ±1 em Equilíbrio e Tensão volta a zero segundo a regra. Em UI, animar **depois** do cálculo validado; não persistir 4 como Tensão estável se schema só admite −3..3. O valor não concede modificador geral. Área sempre possui descrição legível do procedimento.

### 52.4. Ação — oficina de intervenção

**Motor de dois Fios:** leitor de intenção e abordagem, seleção de Matriz e Alinhavo, situação e risco, DT declarada quando o teste cabe, Prumo/Tento, Proveito/Desproveito, Forçar, Auxílio, custo, leitura de margens, Enlace/Ascendente/Retorno/Desvio/Consonância, dupla unidade crítica, opções de Resto e histórico. Deve caber numa bancada única em desktop, e em mobile ser um instrumento progressivo cujo resumo acompanha a etapa, **sem obrigar rolar por ação trivial**.

**Procedimentos:** disputa, prolongada, posição, preparos, aproximação, cobertura, recursos, recuperação, condições, Ancorar, estabilização, crítica, participação em resposta. Diferenciar ato rápido e resolução avançada; a modalidade avançada não é espaço para adicionar bônus. Se teste falha, mostrar o que a regra efetivamente estabelece e deixar consequência ficcional para aprovação; não inventar «−2 PE por falha» ou «recebe Tensão» automática.

**Microvisuais:** cada Fio segue uma geometria própria; Prumo e Tento convergem em um resultado documental, e a divergência preserva os valores originais. Dois dados sempre continuam dois dados; Auxílio substitui o Tento compatível onde a regra prevê, não injeta terceiro dado. O botão `Forçar` mostra o dado antes/depois e seu custo; d12→d20 requer fonte de excepcionalidade explicitamente documentada. Um Proveito só altera o Fio definido, e se há Proveito e Desproveito não aplicá-los como bônus cumulativos independentes sem a regra.

### 52.5. Expressão — cartas como repertório e operações

**Coleções preservadas:** Lavores, Tramas, Fragmentos, Selos, Armas, Equipamentos, Preparo, Costura, Reputação e Resto, além de inventário/recipientes, documentos, itens antigos compatíveis e anexos. Criar um **índice de categorias com identidade visual por função**, uma faixa de itens compactos e uma lâmina de consulta. No celular, catálogo em duas faixas ou lista rica de linhas; consulta de carta em painel legível separado; não forçar uma grade de cartas físicas minúsculas. O espaço `Repertório ativo` da prancha A3 não é limite de inventário digital nem significa apenas três itens existentes.

**Operações:** Lavor possui regras de incorporação/vertente/custo; Trama apresenta acesso, Puxagem, expressão, sustentação, relaxamento, preço, refluxo e Assinatura com cobrança única por evento/janela; Fragmento distingue suporte, função e conservação; Selo permite Diagnóstico/Acesso/Tecitura/Fixação/Resto e não gera cinco testes obrigatórios; Preparo registra gesto, gatilho, mudança e consumo. Equipamentos apresentam porte, acesso, integridade, reparo e propriedades conforme cadastro, nunca defesa gerada apenas por estética do item. Costura reúne contribuições de Vertentes diferentes quando os requisitos forem cumpridos, sem somar dados de todas as fontes.

### 52.6. Percurso — a personagem em transformação

O avanço é **linha de continuidade narrativa**, não barra de XP gamificada: vinte Marcos no máximo, 5% e 2 PU cada um, investimentos documentados e critérios de incorporação. Os Marcos formam pontos conectados com descrições reais, não apenas número. Em desktop, timeline de episódios com rail de PU e leitura; tablet, episódios compactos e inspector; celular, trilho vertical lateral e episódios denso-compactos, com agrupamento por arco se existir. Mostrar o saldo de PU com razão verificável. Investir apresenta custo real e preview de alteração na Constituição; só aplicar após validação. Histórico da personagem, reputações, redes de relação, acontecimentos, notas, restauração de versão, marcos de sessão e material ligado ao Nexus ficam aqui ou em índice correspondente com acesso inequívoco.

### 52.7. Ficha integral: checklist do componente real

Preservar `Tdv2Sheet` e cinco tabs; `TdvTestPanel`; procedimentos de recuperação, vínculos, condições, guardas, Expressão; `Tdv2Belongings`; `Tdv2DossierDetails`; `SheetDescriptionPanel`; histórico `SheetExperienceBridge`; presença e janelas popout; links ao Nexus; edição somente leitura; estado de autosave/conflito; conversão supervisionada. **O modo Jogo atual em `SheetExperienceBridge` deve ser unificado com a nova VP:** redirecionar ou reusar um mesmo componente de apresentação sem duplicar motor e rascunho; diferenciar claramente de `sheet.$id_.power.tsx` da edição anterior. O Work escolhe a estratégia com menor risco depois de verificar chamadas e links existentes, registra redirects/compatibilidade.

## 53. VP — VISÃO DE PARTIDA COMO PEÇA MAIS CARACTERÍSTICA DO PRODUTO

### 53.1. A composição final: bancada compacta com centro verdadeiro

**No desktop:** centro de intervenção ocupa a maior parte do palco da VP; nome do personagem/cena e condições gerais numa faixa curta no topo; à esquerda, intenção, abordagem, eixo Prumo e capacidades selecionadas; à direita, Tento, carta/efeito e consulta contextual; os Fios encontram-se num ponto central cujo tamanho não supera o texto principal; abaixo, prévia de custo/efeito, registro de resultado e Resto. Uma lâmina de consulta pode trocar-se de lado quando a carta é longa. Não usar 3 colunas fixas se a intenção tiver descrição extensa.

**No tablet:** mantém-se dois Fios simultâneos quando cabe, com carta como inspector retrátil/expansível; mapear 60:40 ou centro/rail. Mesmo no tablet em retrato preservar ao menos a comparação dos dois Fios lado a lado — um eixo de cada vez só no mobile estreito.

**No celular:** identidade/salvamento em linha; três recursos em faixa compacta se cabem; instrumento central dos Fios com valores claros em duas metades; barra de ações contextual `Agir · Cartas · Memória · Mais`, mas não outra navegação duplicada do shell quando impedir acesso à cena. A preparação da rolagem é por estágios/lamelas, com resumo de escolhas visível. A carta abre lâmina de consulta, nunca empurra o painel de intervenção três telas para baixo. O jogador pode tocar um card de carta para ver detalhes e retornar ao estado de intervenção preservado.

### 53.2. Modo presencial x digital x leitura offline

**Presencial híbrido:** a prancha A3 acompanha PV/PI/PE, 2 Impulsos, Resposta, Posição, Condições, Âncora e repertório com cartas físicas 63×88 mm. VP complementa: cálculo/consulta, resultados dos dois Fios, custos já pagos, operações complexas, documentos, histórico e reconciliação física/digital. **Não** exibir duplicação gigante de recursos só porque existem na prancha; valores atuais permanecem acessíveis sem substituir a peça física.

**Digital completo:** os mesmos dados em UI controlável, com gasto de ação/recurso, posição, condições e cartas digitais. Não há regras alternativas para compensar falta de papel; só muda apresentação e meio de entrada.

**Offline:** dados locais claramente datados e escopo de leitura/rascunho explícito; não fazer ação remota fingindo sincronização, não conceder confirmação do Mestre sem rede, não sobregravar estado mais novo. A reconciliação ao voltar deve distinguir alterações física, local e remota, com escolha contextual e registro do autor.

### 53.3. Fluxo de intervenção V4, com resposta visual por estado

| Fase | O jogador vê | Ação/resultado | Movimento correto |
|---|---|---|---|
| 0. Presença | personagem, cena, status, recurso e condição | saber onde age e que permissões possui | instrumentos assentados; sem loop obrigatório |
| 1. Intenção | ação em linguagem natural, objetivo | declara o que quer obter | fio de intenção deixa margem do fólio |
| 2. Abordagem | como faz e qual acesso possui | decide se ação direta/sem dado cabe | ramos de opção revelados, sem parecer teste exigido |
| 3. Risco | obstáculo, oposição, ponto em jogo | contextualiza a eventual DT | nó de tensão surge apenas com incerteza real |
| 4. Capacidades | Matriz, Alinhavo, auxílio, fonte de exceção | escolhe Prumo e Tento | dois instrumentos se posicionam, sem rolar |
| 5. Ajustes | Proveito/Desproveito por Fio, Forçar, custo | valida custo uma única vez | fio reage à alteração, previsão explícita |
| 6. Confirmar | prévia imutável da operação, custo e actor | rola/aciona uma vez | press/commit curto, não repete durante latency |
| 7. Leitura | valores brutos, resultado, comparação, Consonância, margens | interpreta a leitura matemática | fios convergem/divergem sem criar bônus |
| 8. Consequência | decisão e mudança ficcional, aprovação quando necessária | aplica estado autorizado, gera evento | fio assenta em registro confirmado |
| 9. Resto | aquilo que persiste, vínculos, Selos, efeito em Mestre/Nexus | cria memória audível/visível segundo acesso | costura de continuidade para entidade real |
| 10. Retorno | recursos atuais, histórico abreviado, pronto para novo gesto | evita repetição idêntica sem mudança de cena | bancada volta ao repouso preservando trilha |

### 53.4. Cartas, atalhos e kit físico

O catálogo de cartas espelha **categorias documentadas** (Armas, Itens, Consumíveis, Relíquias, Lavores, Tramas, Fragmentos, Ameaças, NPCs, Locais) com índice visual e permissões; categorias do Mestre não ficam publicamente visíveis por simples existência de divisória física. A carta digital abre frente e consulta detalhada, parâmetros e uso permitido; **nunca** mostrar verso secreto a jogador sem autorização. Atalho `Localizar carta física` é proposta futura de organização manual por identificador, não alegação de leitura automática, RFID ou QR existente. Permitir guardar favoritos para a VP sem criar inventário duplicado.

### 53.5. O botão VP, navegação e compatibilidade

Botão **VP** significa **Visão de Partida** na edição II por proposta aprovada na especificação; o rótulo expandido aparece em primeira visita, tooltip e leitor de tela. A antiga **Versão de Poder** permanece num endereço/documento histórico identificável como «Edição anterior · registro» e só quando liberado pela autorização aplicável. `Jogo`/`Editar` atual deve ser harmonizado com VP sem perder preferências e conteúdo; não deixar usuários entrar numa suposta VP nova que, por baixo, usa bônus antigos. O link para abrir VP precisa funcionar com Ficha em leitura, popout, tablet, Mesa e retorno; não exigir permissão de edição para consultar o modo Jogo quando leitura for autorizada.

### 53.6. Provas de qualidade da VP

A VP passa nos seguintes cenários: ação sem risco resolvida diretamente; teste normal; Auxílio de uma pessoa; Prumo/Tento com Consonância; Forçar a PE 0 com contrapartida e limite por cena; custo de Trama e Forçar sem dupla cobrança; rolagem com latência e clique repetido; resposta antes da consequência; condições e recursos físicos modificados ao final da sessão; tablet com carta e dois Fios simultâneos; mobile em paisagem; personagem em outra sessão; mudar de personagem; perda de rede depois da rolagem; mestre observa evento sem receber dados privados indevidos; versão antiga abre apenas caminho histórico.

## 54. MESA NEXUS — RESTAURAÇÃO DE TODA A POTÊNCIA E REDESENHO DO PALCO

### 54.1. Composição: o mapa precisa respirar

A Mesa não é «uma página com um card de Canvas». **O Canvas é o palco**; comando e edição devem orbitar seu contorno. Em desktop largo: rail de ferramentas de cena à esquerda de até 48–64 px, palco ocupando o maior retângulo útil, barra de contexto superior pequena (cena, sessão, convidados, sync e câmera), inspector à direita de aproximadamente 280–360 px **somente quando há seleção/edição útil**, painel de baixo mínimo para eventos da rodada quando acionado. Não forçar três colunas permanentes nem exibir bordas complexas envolvendo o Canvas inteiro.

**Tablet:** preservar palco ≥65% da largura útil quando inspector lateral estiver aberto, em condições dimensionais favoráveis; inspector em lâmina quando isso não couber. Dock flutuante retrátil para seleção, pan, medida e comandos; à direita, controle de visão e câmera acessível com um toque, sem tapar token na borda. Em paisagem, posicionar instrumentos nos lados curtos/longos com bom alcance; tablet retrato deve continuar parecendo uma Mesa de PC compactada, não um telefone exagerado.

**Mobile:** Canvas inicialmente ocupa quase toda a altura disponível; barra de cena com nome curto, status da sala e ação voltar; dock inferior contextual e ferramentas agrupadas; ao selecionar token, apresentar *lâmina de entidade* de altura parcial, cujo primeiro estado mostra ações comuns e a ficha-resumo. Arrastar para expandir revela as operações avançadas sem destruir a área de mapa; fechar restaura foco/seleção conforme regra. Controles de câmera e zoom podem aparecer em flotação lateral com targets grandes, mas não simultaneamente com janelas que os cobrem.

**Material:** Canvas não recebe textura do shell por cima, porque prejudica geometria, cores e hit-testing. O entorno pode ter tecido denso e discretos cortes metálicos; os overlays são vidro fosco com opacidade suficiente e contraste estável. Movimento de filamentos não deve rodar em cima de grade ou token em tempo real.

### 54.2. Inventário obrigatório: motor e edição espacial

O Work deve conferir **montagem, acesso, efeitos, serviço e teste** para todos os grupos. Esta matriz é prescritiva e não prova que cada função esteja disponível ao usuário hoje; a existência de arquivo bridge não garante que o módulo esteja ativo.

| Instrumento | Preservação e aprimoramento | Interface e teste concretos |
|---|---|---|
| Seleção de entidade | seleção simples/múltipla quando existente, foco, mover/renomear e inspector | halo contido, sem esconder geometria; mobile seleciona por toque e reabre inspector sem mover token |
| Pan, zoom, câmera, enquadramento | vistas, presets, fit/center, preferências e retorno | ícones + números, orientação visível; alterações de câmera não persistem posição da entidade |
| Projeções 2D/isométrica/3D | `tabletop-view-bar`, renderer e câmera atual | transição de perspectiva sem duplicar palco, sem perder seleção nem coordenada |
| Fundo, grid e snap | grade, escala, origem e aparência, medição | grid legível em claro/escuro, sem confundir célula com Posição narrativa |
| Tokens e placeables | criação, categorias, nome, associação, dimensões, rotação e camada | inspector com previews e ações associadas; histórico real de movimentação |
| Estruturas | paredes, portas, estados, aberturas, segredos, verticalidade | editor contextual e trilho de estados; prévia do jogador distinta da edição do Mestre |
| Níveis e profundidade | camadas/andares, teto, foreground e visibilidade | seletor de andar compacto, sem paredes visíveis erroneamente em público |
| Névoa e percepção | FOW, fog geometry, audiência, luz, linha de visão | Mestre verifica exatamente o que o jogador recebe; fog não vaza em miniatura, undo ou log |
| Desenho e medida | traço, caneta, formas, cores, régua, ferramenta corrente | gestos touch e mouse distinguíveis; desativar drawing não altera snap/câmera |
| Biblioteca criativa | assets 2D, SVG, imagens, modelos GLTF e presets | carregar sob demanda, preview, tamanho e licença, espaço em buffer de GPU limitado |
| Modelos nativos/3D | glTF, descarte de recursos, performance adaptativa | pausar/limitar em background; fallback acessível; sem manter canvas duplicado |
| Arranjo e transformação | alinhamento, distribuição, camadas, agrupamentos, rotação, escala | ghost de preview, commit com versão, undo após mudança local, sem reordenar itens sem razão |
| Região e automação espacial | gatilhos de área, efeitos, audiência, regras de região | linguagem de estado clara; evento de região não vira mecânica TdV automática sem fonte |
| Cena e persistência | carregar, salvar, duplicar, ordenar, snapshots quando disponíveis | status draft/local/remoto, conflito sem sobrescrever, restaurar cena em teste real |
| Sessão viva | sala, participantes, presença, sincronização, reconexão | status conciso, contagem verdadeira, permissões; event reconciliação na retomada |
| Handouts | preparar, pré-visualizar, compartilhar e recolher com escopo | preview do jogador, não vazar segredo em thumbnail/URL/download/cache |
| Áudio, atmosfera e timeline | trilhas existentes, cues, som espacial quando implementado | opt-in de reprodução e volume, mute, pausa ao fundo, visual silencioso completo |
| Smart setup / presets | criação assistida, configuração, preflight | resultado explicável; desativar ferramenta não remove personalização antiga |
| Exportar/capturar | snapshot e ligação com Nexus | captura da cena respeita fog e audiência; dados sensíveis são filtrados antes do export |
| Undo/redo | histórico de comandos do motor | não usar «desfazer UI» para simular rollback de banco transacional não suportado |
| Papel Mestre/Jogador | workspaces próprios, projeção pública, edição autorizada | mesma cena sob pontos de vista diferentes, estados dos comandos coerentes |

### 54.3. Auditoria explícita dos bridges de Mesa

Os arquivos abaixo aparecem no repositório e devem ganhar uma linha própria no manifesto real, com decisão `ativo`, `legado`, `não montado` ou `experimental`, **sem presumir uso por mera presença no código**. Cada um deve receber reteste de UI nos três formatos e verificação de efeito sobre o Motor:

| Família | Bridges/áreas a rastrear | Critério de qualidade V4 |
|---|---|---|
| Sessão, estado, suporte | `tabletop-live-session`, `realtime-status`, `tabletop-preflight`, `tabletop-reliability-editor`, `tabletop-urgent-reconciliation` | status de rede verdadeiro; sem salvar falso, sem loop de retry, no máximo uma origem de verdade |
| Visão e render | `tabletop-adaptive-performance`, `tabletop-atmosphere`, `tabletop-floating-layout`, `tabletop-native-model`, `tabletop-roof-foreground`, `tabletop-spatial-streaming` | palco nítido, performance adaptativa, camadas liberadas, sem blur de UI sobre mapa |
| Edição de espaço | `tabletop-fog-geometry`, `tabletop-editor-panel`, `tabletop-visibility-panel`, `tabletop-placeables-inspector`, `tabletop-semantic-transform` | edição por contexto, preview, commit e conflito rastreáveis |
| Acesso contextual | `tabletop-progressive-interface`, `tabletop-radial-actions`, `tabletop-player-interaction`, `tabletop-entity-dossier`, `tabletop-integration-tools`, `tabletop-deep-link-locator`, `tabletop-locate` | todos os comandos continuam encontráveis; mobile tocável, com retorno de seleção |
| Direção de cena | `tabletop-director-entry`, `tabletop-director-workspace`, `tabletop-director-remote`, `tabletop-director-enhancement`, `tabletop-director-timeline` | não criar segunda cena; comandos coerentes de privado/publicado |
| Conteúdo e biblioteca | `tabletop-creative-dock`, `tabletop-smart-setup`, `tabletop-composition-panel`, `tabletop-handout-viewer`, `tabletop-nexus-capture` | ativos reais, handouts seguros e controles que não cobrem o palco |
| Integração e drop | `tabletop-cross-surface`, `tabletop-unified-drop`, `tabletop-final-interaction` | transferência explícita, ID/permissão, preview, desfazer quando possível |
| Infra de montagem | `tabletop-route-experience`, `tabletop-stage-portal`, `tabletop-deferred-enhancements`, `tabletop-participant-entry`, `tabletop-master-entry` | não criar portais duplicados; ordem de render correta; módulos opcionais testados |

**Arquitetura sob revisão:** `TabletopEngine`, `interaction-controller`, `realtime-transport`, `tabletop-persistence-service`, `visibility-service`, `tabletop-view-preference-service`, `tabletop-spatial`, `camera-controller`, `entity-renderer`, `scene-manager`, `layer-manager`, `tabletop-smart-setup-v2`, `tabletop-gltf` e auxiliares. Reutilizar autoridades existentes, guardas de versão e protocolos. Visual não deve escrever diretamente no estado do Canvas fora das interfaces do Motor.

### 54.4. Operação de TdV II em cima do mapa

Ao selecionar token vinculado a personagem, oferecer ficha-resumo com recursos/estados, relação com a cena, intervenções disponíveis e VP. O jogador pode declarar intenção, selecionar alvo/área e ver **prévia** da geometria, mas a autorização de efeito mecânico depende da origem canônica. O shape de ataque/poder legado não se torna automaticamente alcance de Lavor/Trama II: ler texto da fonte e tratar exceção. Quando fizer sentido, mapa mostra alvo/cobertura/obstáculo, e mestre decide consequência. **Posição Favorecida/Disputada/Exposta é relativa à frente/oposição, não tile/coordenada**; inspector mostra a frente em texto, sem impor via hexágono ou altura.

Protocolo proposto `Selecionar → Consultar → Declarar → Prévia → Confirmar → Resolver → Aplicar → Publicar → Persistir`, com distribuição de autorização por ator. Nunca debitar PE simplesmente porque um template gráfico foi arrastado. Não aplicar estado da ficha só porque a animação atingiu o token.

### 54.5. Testes de Mesa com ameaças de regressão

- Alternar projeção com token selecionado, depois editar visibilidade e retornar sem descolar peça.
- Mestre desenha área de neblina; jogador não vê contorno/resumo privado nem ao tirar screenshot autorizado.
- Duas pessoas movem/edita a mesma peça; conflito acusa versão, recupera a cena sem duplicação ou teleport.
- Jogador mobile com inspector aberto consegue pan/zoom de maneira deliberada, sem disparar uso de poder; landscape com teclado não cobre `Cancelar`.
- Cena com dezenas/centenas de entidades conforme fixture de carga escolhida pelo Work, 3D e sombras: reduzir **efeito de UI** antes de cortar capacidade de interação/legibilidade.
- Realtime reconecta e recarrega resumo sem alterar dado do Mestre; abrir/fechar gaveta não reautentica a sala.
- Câmera e seleção se mantêm ao abrir Nexus e voltar; fullscreen e embedded não geram outro Motor concorrente.

## 55. FIO~MESTRE — UMA BANCADA DE DIREÇÃO REVISADA POR TODAS AS GUIAS

### 55.1. O Mestre não é uma coleção de formulários gigantes

**Áreas de operação:** Preparação (campanha, frentes, pessoas, ameaças, NPCs, cenários, investigações, cenas, documentos e contingências); Condução (cena, tempo, participantes, iniciativa, Impulsos/Resposta, pressão, urgência, oposição, intervenção, revelação, registro e encerramento); Referência (Livro II, consultas, Defesas, DT, tabelas e arquivos) e Arquivo/Continuidade (sessões anteriores, notas, histórico, rest/os, relatórios e revisão). Estas são **perspectivas de navegação**, não novos bancos paralelos. Preservar tanto as abas do painel geral quanto as do `Tdv2MasterPanel` já montadas.

**Desktop:** o «tear de direção» tem centro da cena ocupando o eixo dominante, participantes/pressões numa região de acompanhamento compacta e inspector de oposição/revelação/contexto que se abre à direita; bancada de preparação não precisa mostrar simultaneamente todos os formularios. O head contém sessão/campanha, status privado, salvar, e opção de prévia pública. A linha de cena pode receber fio visual que conecta um participante à oposição apenas quando existe relação de dados.

**Tablet:** preservar centro de condução e lista de participantes simultaneamente se largura útil comportar; inspector de ameaça em lâmina ou coluna de largura ajustável. A barra de ações de Mestre deve caber sem scroll infinito; selecionar «Preparar/Conduzir» reorganiza a bancada sem trocar de sistema.

**Mobile:** primeira dobra mostra cena ativa, rodada, botão de próximo passo e pressão relevante; participantes em lista compacta de linhas, não seis fichas gigantes; cada ameaça abre inspector que ocupa parte do viewport. Menus de segredo e revelação exigem confirmação inequívoca, não gesture ambígua.

### 55.2. Cena e rodada — controles e estados

**Cena:** título, frente/objetivo em disputa, intenção e limites da oposição, condição de término, status, situação inicial, Posição relevante, pressão e urgência. Seleção de cena da Mesa quando há vínculo, com opção de condução apenas privada. **Não** enviar segredo num campo projetado em token. Identificador da cena e data do contexto ficam discretos, porém acessíveis.

**Iniciativa:** Cadência + Alinhavo Iniciativa quando usada pela regra, desempates conforme motor; manter iniciativa livre/manual como ferramenta histórica quando necessária. Apresentação em trilho vertical/linha dependendo da largura: retrato pequeno com iniciativa, nome, Posição e recursos; aberto mostra ações gastas e detalhes. **2 Impulsos e 1 Resposta por rodada** aparecem em ícones/valores textuais, uso via comando explícito, zero não se apresenta como ação ainda disponível; Resposta deve ocorrer antes da consequência quando pertinente. Novo round renova sem carregar ações velhas, não avança pressão automaticamente.

**Pressão/urgência:** frente 0–4 com Fonte, Objeto, Escalada, Ruptura e histórico; Compasso de Urgência 3–8 com mudança do mundo ao completar. Pressão não é Tensão do personagem; o desenrolar do Compasso não apaga pistas adquiridas. Animação de cursor é um deslizamento curto com confirmação de causa e registro. O mestre precisa conseguir corrigir erro dentro da política de eventos, não desabilitar rollback silenciosamente.

### 55.3. Resolução e operações

Em `tdv2-procedures.tsx` e `tdv2-operations.ts` conferir criação de Prolongada, Selagem, Canalização, Coordenação e Perseguição, com nome, objetivo, DT quando necessária, frente vinculada, etapas, participantes, abordagens, evidência e histórico. **Etapas são um mapa narrativo/operacional, não obrigação de um teste por nome**. Um movimento pode preencher mais de uma etapa apenas quando abrangência e regra permitem. Mostrador visual de etapa tem tramas abertas/fechadas, identificador de evidência e texto; não preencher automaticamente por clique «Avançar» sem intervenção.

O motor de oposição recebe valores originais dos Fios e autorização. Em conflito físico, limitar efeito principal, conferir RD/cobertura/origem e estados críticos conforme regra; alvo não pode receber mesmo dano em dupla atualização entre Mesa/Mestre/Ficha. Exibir preview do custo/condição, com decisão do Mestre separada do sorteio. Eventos persistidos incluem ator, entidade, cena, origem de regra e publicação.

### 55.4. Pessoas, figurantes, adversários, ameaças

**Figurante:** ficha leve em uma linha e contexto narrativo; só os campos necessários à função. **Adversário:** capacidades relevantes, intenção, posição, pressão, possíveis efeitos. **Ameaça:** estrutura e dependências, Magnitude 0–4, consequências, vulnerabilidades e condição real de término. **Não** impor PV universal ou Rank como orçamento. Vista visual de ameaça pode ter vários componentes/dependências em grafo de junções — elegante e funcional — com forma de quebrar vínculo e atualização da cena. Uma ameaça sem tokens é legítima.

**NPCs históricos:** não esquecer repositórios antigos de NPC/monstro que o Mestre ainda usa; separá-los por edição e compatibilizar referências, não converter seis campos antigos automaticamente nos de II. A interface deve mostrar o que foi reconhecido e o que continua sob revisão.

### 55.5. Investigação, Selagem e informação privada

**Investigação:** pergunta central, hipóteses, contradições, pistas fundamentais, pistas aprofundadas, vínculos de causa, acessos e próxima intervenção; interface em duas ou três superfícies: teia privada do Mestre, dossiê de evidência e prévia do jogador. Pista fundamental acessível não pode ser bloqueada por rolagem. Revelar transforma audiência e adiciona um evento, **não apaga texto privado do Mestre**.

**Selagem:** Selo com seus campos, acesso, gestos e condições; o mapa de Diagnóstico, Acesso, Tecitura, Fixação, Resto acompanha evidência e pertinência, sem impor cinco rolagens ou DT por etapa. Campo de manutenção/persistência é diferente de evento de lançamento. Layout deve diferenciar preparação da execução e da conservação.

**Revelação de handout:** preview de conteúdo efetivamente **filtrado no backend** como jogador, com lista de destinatários; botão publicar contextual exige escopo e confirmará só após servidor; não usar apenas blur visual para esconder segredo. Manter versão e possibilitar retirada segundo política, sem prometer «apagar da memória de quem viu».

### 55.6. Sessão e continuidade

Encerrar sessão exige um quadro que reúne: eventos aprovados ainda pendentes, gastos/estados materiais, Restos, Vínculos alterados, Âncoras abaladas, Selos e expressões em curso, pressões/urgências, revelações, documentos compartilhados e diferenças da prancha física. O Mestre decide o que vira registro canônico. Fechar cena não deve limpar `scene.tests` e `paidEvents` sem antes arquivar os eventos relevantes; não tratar `Salvar sessão` como sinônimo de «histórico completo», pois o histórico atual de diffs pode captar apenas momentos de salvamento. O término gera uma recapitulação legível e vinculável no Nexus, com dados privados segregados.

### 55.7. Microdecisões visuais da bancada

Ação do Mestre pode usar selo gráfico discreto para «fixar» uma consequência; porém não usar efeito triunfal em todo salvar. Foco em pressão mostra fio da fonte ao objeto; aumentar pressão ajusta um cursor com causa; falha de rede não completa o cursor. Trocar de seção preserva rascunho/snapshot. Tab de referência usa linguagem de consulta, não uma grande janela central inoperante. Inspeção de NPC tem índice por letra/estado e busca; inspeção de ameaça destaca dependências. Etiquetas «privado», «a preparar», «publicado para jogadores» têm hierarquia visual e verbal claras.

## 56. NEXUS — BIBLIOTECA, GRAFO E TEXTO COMO MATÉRIA VIVA

### 56.1. Uma arquitetura de três planos

**Plano A — explorar:** árvore/lista/coleção, workspace, campanha, filtros e busca. **Plano B — ler/escrever:** documento com margens, título e leitura, editor seguro, notas, referências, links e seleção textual. **Plano C — relacionar/verificar:** metadados, versões, histórico, relações, backlinks, anexos, status e visibilidade. O grafo pode ocupar plano central em seu modo próprio. Não empilhar os três em sequência no mobile; em tablet **preservar A+B simultâneos** em largura útil razoável e tornar C contextual; em desktop A+B+C com divisores redimensionáveis.

**Matéria:** arquivo de papel/tinta, capa/índice no explorador, linhas de vínculos no grafo e vidro apenas nos comandos de edição. Texto de consulta é soberano; imagem de fundo não atravessa parágrafo com contraste insuficiente. Papel claro opcional no fólio, com a aplicação escura ao redor; harmonizar com Fio~Mestre, não transformar Nexus em Notion preto com estrelas.

### 56.2. Funções do código que precisam de cobertura explícita

`nexus-workspace.tsx` e componentes correlatos incluem: workspace/campanha ativos, árvore/lista, busca e ordenação, filtros de tipo/status/visibilidade/relação, coleções, páginas abertas, edição/rascunho, leitor, grafo conectado/geral, propriedades, aliases, etiquetas, relações e direção, backlinks, histórico/versionamento, anexos, favoritos, exportação/portabilidade, ligações de ficha e localizador na Mesa. Cada ação tem: estado, destino, gravação, papel, solução de mobile, tooltip/foco/teclado e teste.

**Ler:** foco tipográfico na coluna, referências e backlinks diferenciados, navegação por títulos que não colide com head. Livro de Regras e tratados são indexados com proveniência; um trecho do cânone não pode ser editado como se fosse nota do jogador sem regras de autoria. **Escrever:** editor com rascunho local/versionado, toolbar na seleção sem sobrepor texto, prévia de Markdown seguro, inserção de imagem autorizada, retorno de cursor e proteção do conteúdo ao alternar página.

**Relacionar:** fio visual ancorado em entidades reais; selecionar nó centraliza/inspeciona sem rearranjar agressivamente o grafo; filtros por status e audiência, foco por teclado, vista lista de arestas para acessibilidade e baixa performance. Relação de pista/hipótese deve diferenciar fato canônico, interpretação do jogador e segredo do Mestre — sobretudo na teia de descobertas.

### 56.3. Imagens, documentos e anexos

Imagens de personagem/cena/evidência não são ornamentos intercambiáveis; cada uma tem fonte, audiência, descrição, crop/posição definidos pelo autor quando disponível. Thumbnails preservam aspecto sem cortar texto de handout. Abrir documento revela metadados e opção de download apenas se autorizado. Carregar preview deve mostrar skeleton no tamanho certo, sem deslocar fólio. Elemento com mídia pesada usa lazy-loading. Ao trocar de página, cancelar respostas obsoletas e preservar rascunho. A busca de um objeto não pode indexar conteúdo secreto para público indevido.

### 56.4. Ponte com físico e sessão

A Teia de Descobertas A4 é proposição dos jogadores; o Nexus não mistura automaticamente seus nós com o dossiê secreto de evidência do Mestre. O diário A4 é memória de campo; digital recebe registro curado, não presume OCR de papel. Notas de Mesa/Handouts podem se transformar em documentos ou relações aprovadas. O fio entre «evento de jogo» e «documento de conhecimento» guarda autor, origem, data, público e revisão; **não produz canonização automática**.

## 57. UTILIDADES, AUTORIZAÇÃO, OFFLINE E FALHAS — O ACABAMENTO INVISÍVEL

### 57.1. Usuários

Em `/manage-users` usar uma lista/tabela compacta com busca no topo e filtros por papel, seleção acessível, ações contextualizadas e detalhes na lateral em tablet/desktop. No mobile, linhas com nome, papel e ação mais importante sem cards monumentais; propriedades avançadas em drawer. Alterar papel/excluir tem confirmação com impacto no acesso e auditoria. Estado vazio e carregamento não transferem informações de contas ocultas. A cor do papel é sutil; o texto explícito determina a permissão.

### 57.2. Ferramentas e backup

Em `/nexus-tools`, **Backup** e **Diagnósticos** devem permanecer guias distintas. Backup como cofre com três etapas: criar cópia, histórico de pontos e importar/restaurar. Cada ponto mostra data, escopo, versão, origem e estado quando fonte permite; baixar/excluir têm ações reais e confirmação. `Importar` exige prévia de conflito, edição, itens afetados, permissões e destino; não apresentar «restaurado» antes de restaurar e reabrir o resultado. Em telas estreitas usar timeline/linhas com metadados, nunca tabela de 10 colunas cortada.

Diagnósticos é bancada de saúde: falhas reais e eventos de app, explicação humana, detalhes técnicos expansíveis, tentar novamente quando possível. Não usar gráfico verde fictício de «saúde 100%» sem medição. Capas/símbolos coerentes, porém peso visual baixo para não reduzir clareza de erros.

### 57.3. Offline e PWA

`/offline` deve mostrar claramente: de que dispositivo vem a cópia, quando foi obtida, quais fichas/cenas/áreas estão disponíveis, o que **não** está disponível e quais ações exigem reconexão. Abas `Fichas` e `Mestre` existentes permanecem. Nunca usar ícone de salva/checado para um draft sem sincronização. Ao reconectar, comparar revisões, apresentar conflitos sem sobrescrever, conservar histórico local até confirmação de servidor. PWA, atualização de Service Worker e instalação precisam de prompts discretos e explícitos; não atualizar shell durante intervenção de Mestre ou rolagem pendente sem oferecer segurança de salvamento.

### 57.4. Estados do sistema e erros inesperados

Criar uma família de telas de estado com mesma anatomia editorial: ícone factual, título com causa compreensível, resumo, `Tentar novamente`, `Guardar rascunho` quando possível, `Voltar`, `Detalhes técnicos` sob demanda. O estado 404, acesso negado, falha de sessão, dados inválidos, offline, versão incompatível e conflito têm cores/ícones diferentes, mas nenhum transforma erro em cena dramática teatral. Erro de componente lazy não deve tornar o site inteiro branco; oferecer fallback e preservar o resto.

### 57.5. Metadados, ícones de aba, carregamento, acessibilidade

Favicon e `section-symbols` devem usar marca oficial ou derivação autorizada sem reinventar símbolo em SVG de conveniência. Metadata não inclui dados privados de usuário/personagem. Skeleton reproduz geometria final para evitar CLS. Search global usa dados autorizados, sem persistir nomes sensíveis em cache indevido. Anúncios de toast `role=status` e `aria-live` são limitados e pertinentes; evitar múltiplas notificações por um só evento. `prefers-reduced-motion` é regra em overlays, não só em páginas normais. Estados de validação são legíveis mesmo sem cor.

## 58. CONFERÊNCIA MECÂNICA FINAL — MATRIZ DE REGRESSÃO DO LIVRO II

As regras abaixo são **invariantes de implementação** extraídas da cobertura do Livro de Regras II e das rotinas já existentes; nenhuma animação, novo nome de botão ou visual pode alterá-las. No Work, confrontar novamente com o **último Livro II da Biblioteca** e produzir testes de motor e de interface para cada linha; não inferir regra a partir do campo que a UI passou a mostrar.

| Domínio | O que deve existir e permanecer correto | Erro a evitar e teste de prova |
|---|---|---|
| Arquitetura | quatro raízes Pessoa/Ação/Situação/Transformação; Relação transversal | desenhar Relação como quinta raiz ou bônus implícito |
| Feição | Origem, Ofício, Convicção, Limite, Marca, Vínculos; Âncora em pilar | transformar Marca em «classe mágica» automática; perder contexto e texto antigo |
| Marca | Gatilho, Manifestação, Resíduo | ativação por barra genérica, condição paranormal inventada |
| Vínculos | Nó/Natureza/Estado/Oferta/Cobrança/Tensão, estados Presente/Tensionado/Ferido/Rompido/Costurado | bônus de amizade, exclusão por romper, mudança sem acontecimento |
| Âncora | Sustentar/Redirecionar com consequência persistente, Abalada e Reassentamento significativo | apaga consequência, cura automática por repouso, uso quando abalada |
| Constituição | 4 Matrizes, 21 Alinhavos; dados canônicos; 4 Defesas e Guarda | importação de atributos/Rank anteriores sem revisão e limiares somados |
| Recursos | PV, PI, PE com máximos derivados, gastos e recuperação permitidos | negativos de PV, recuperação sem janela real, bônus material inventado |
| Ação | dois dados Prumo/Tento; Enlace, Ascendente, Retorno, Desvio, Consonância | terceiro dado ao auxiliar, Consonância como dano duplo |
| Falha crítica | duas unidades nos dados originais | critical por valor de soma baixo ou sucesso automático por máximo alto |
| Modificações | Proveito/Desproveito no Fio pertinente, excepcionalidade explícita | bônus aditivo genérico, d20 sem fonte |
| Forçar | custo de PE, degrau conforme regra, a 0 PE uma vez por cena com contrapartida | Forçar com PE 0 gratuito, duplicar pagamento, gerar sucesso garantido |
| Teste necessário | só quando acesso/risco/oposição justificam | exigir rolagem para encontrar pista fundamental acessível ou tarefa resolvível |
| Repetição | intervenção idêntica não repetida sem mudança real | botão `Rolar novamente` contorna a regra |
| Auxílio | Prumo do protagonista e Tento compatível de um auxiliar, dois dados | terceiro dado, soma de graus, modificação social automática |
| Cooperação/Costura | papéis e abordagens distintas; Costura de Lavores conforme Vertentes/requisitos | confundir coordenação de personagens com Costura da Malha |
| Desenvolvimento | 20 Marcos×5% e 2 PU por Marco; investimento com incorporação | «XP» acumulável sem Marco, saldo negativo de PU, avanço grátis |
| Iniciativa | Cadência + Iniciativa e desempate do motor quando aplicável | herdar atributo de iniciativa de edição legada |
| Rodada | 2 Impulsos e 1 Resposta; ações 1/2; Resposta antes da consequência | acumular impulsos, 2 Impulsos tratados como duas ações obrigatórias |
| Posição | Favorecida/Disputada/Exposta relativa à frente | bônus universal por label; converter coordenada X/Y em Posição |
| Pressão | frente 0–4, Fonte/Objeto/Escala/Ruptura e causa explícita | qualquer falha avança uma casa automaticamente |
| Urgência | compasso configurável 3–8, mudança do mundo ao completar | apagar pista já obtida, confundir com Pressão ou dano |
| Tensão/Equilíbrio | Tensão cruza ±4, desloca Equilíbrio ±1 e zera; Equilíbrio −10..+10 | persistir 4 de tensão ou conceder buffs morais |
| Dano/Defesas | um limiar e consequência por intervenção, dano e fontes expressos | duas aplicações do mesmo dano em canais diferentes; RD sem origem |
| Guarda | fonte, proteção/cobertura limitada, quebrada e cobertura total conforme regra | bônus de equipamento antigo, impor defesa extra por interface |
| Incapacitada/À Beira | janela e estabilização conforme regra, cuidado contextual | contagem universal de morte, PV negativo ou cura espontânea |
| Colapso 0 PI | procedimento próprio e limitação de Inteireza | copiar procedimento de 0 PV |
| 0 PE | restrições e exceção de Forçar com contrapartida | impedir toda atuação ficcional ou permitir gasto negativo |
| Recuperação | breve/profunda/plena com janela, cuidados, reconstrução quando exigidos | botão recuperar que zera histórico, condição ou Âncora |
| Condições | nome, origem, efeito, saída, intensidade Leve/Grave/Crítica | penalidade automática apenas por cor/forma |
| Equipamentos | arma/objeto com propriedades, porte, acesso, Integridade e reparo | «slot» que garante competência, objeto com PV universal |
| Preparo | gesto, gatilho, alteração e consumo | ação «preparar» concede dado extra cumulativo |
| Lavores | incorporação 4/6 PU, vertentes, custo e contexto | classe fechada criada por visual; custos inventados por categoria |
| Tramas | campos, acesso, Puxagem, Tecitura, expressão, sustentação, Relaxamento, Refluxo, Assinatura | cinco testes obrigatórios; custo repetido na mesma janela, reembolso ao relaxar |
| Selos | Diagnóstico/Acesso/Tecitura/Fixação/Resto como operação situada | DT fixa universal por etapa, cinco rolagens por obrigação |
| Fragmentos | suporte, conservação, uso, função, assinatura | reparar material restaura automaticamente função ou história |
| Perseguição/prolongada | etapas, progresso preservado, mudança real e abrangência permitida | falha apaga todo trabalho; etapa avança sem evidência |
| Investigação | pista fundamental acessível, hipóteses e contradição | segredo entregue ao cliente errado, rolagem bloqueia o fundamental |
| Ameaças | Figurante/Adversário/Ameaça, Magnitude 0–4, dependências/objetivo | Rank de orçamento, Magnitude como flat bonus, PV obrigatório |
| Memória | Resto, Permanência, Redobra, custos e eventos originais preservados | rerrolagem disfarçada, repetição de eventos, apagamento na troca de cena |

### 58.1. Invariantes de dupla publicação

Eventos que aparecem na VP, Mesa e Mestre têm **uma fonte operacional**. A projeção de rodada em token apresenta apenas dados públicos permitidos (por exemplo Impulsos/Resposta/Posição quando autorizados); não replica fichas inteiras ou segredos. Se uma ação custa PE, o `eventId` de pagamento é único; atualização de ficha e publicação dependente do Mestre devem evitar dupla contagem. Desfazer visual reverte somente apresentação; desfazer operação requer compensação autorizada e trilha auditável.

### 58.2. O problema dos limiares e de cenas/rodadas

Em `tdv2.ts`, Tensão persistida está entre −3 e +3 após o limiar e nova operação reconfigura Equilíbrio; a régua física inclui ±4 como gatilho. **UI deve representar passagem pelo limiar como evento**, não novo valor persistente. Testes e pagamentos de cena podem estar armazenados no contexto temporário; o Work deve primeiro gravar histórico durável antes de limpar esse contexto. `Encerrar cena` não equivale a apagar tudo. A rodada do Mestre e o round público precisam ter conexão versionada e separar estados privados de públicos.

### 58.3. Fonte de verdade e precedência de decisões

A lei de cada mecânica é Livro II; documentação de cobertura ajuda a localizar implementação; motor calcula; UI apresenta e recebe intenção; Mestre decide onde a ficção exige; eventos registram consequências aprovadas; Nexus indexa cópia autorizada. **Nunca**: UI calcula um dano independente do motor, Mesa decide resultado só pelo shape de área, o grafo aumenta grau por número de links, cor da Natureza concede modificador ou agenda de motion altera recurso.

## 59. ENGENHARIA DA QUALIDADE — MODULARIDADE, CSS E CONTROLE DE ESTADO

### 59.1. Consolidar autoridade de aparência sem reescrever o produto

O repositório mantém dezenas de folhas em `src/styles/` e um `docs/style-architecture.json` que lista **tetos** de `!important`/raízes e ordem de controle. Os números desse arquivo são limites de migração, não medição de uso atual. A V4 **proíbe** adicionar nova folha «final-polish-v4.css» no fim da importação para vencer todas as anteriores. Alterar o componente e seu CSS proprietário, identificar regra concorrente, migrar seletor obsoleto, remover override redundante e só então medir comportamento em todas as rotas.

**Propriedade prescrita:** `navigation-layout.css` controla navegação principal; `mobile-more-radial.css` controla geometria do menu Mais; `page-hero-parity.css` e `hero-backgrounds.css` controlam head e fundo de abertura; `experience-surfaces.css` controla superfícies compartilhadas e tecido contextual; `sheet-layout.css` e `sheet-premium.css` controlam estrutura/material da ficha; `tabletop-workspace.css` e estilos específicos de Mesa controlam palco/HUD; `master-panel-navigation.css` guia o Mestre; `nexus-material.css` e estilos específicos a leitura/grafo; `motion-foundation.css`, `motion-interactions.css`, `motion-composition.css` controlam motion apenas nas responsabilidades registradas. Não mover `camera` ou `fog` para CSS ou efeito global.

### 59.2. Checklist de CSS para cada PR visual

Identificar declaração antiga, qual seletor vence, `specificity`, `!important`, `@media`, `container`, camada visual, portal, estado/hover/focus e responsabilidade de arquivo. O commit deve mostrar redução/neutralidade de overrides e declarar se alterou o contrato do design system. Não gerar 200 classes baseadas em `:has` de ids de formulário para casos especiais. Inspecionar pseudo-elementos: `::before/after` do fundo não podem interceptar toque nem produzir stacking context que oculta popover. `z-index` usa escala finita documentada, em vez de `9999` arbitrário.

### 59.3. Proposta de tokens de camada, z e opacidade

| Plano | Função | Comportamento |
|---|---|---|
| 0 | fundo/tecido ambiental | `pointer-events:none`, sem conteúdo privado |
| 1 | documento/Canvas | texto e objetos interativos; plano majoritário |
| 2 | estados locais, hover/seleção | apenas dentro da superfície/objeto |
| 3 | rail/toolbar permanente | controle acima do documento, sem cobrir áreas críticas |
| 4 | inspector/drawer | foco contextual, colisão com viewport |
| 5 | popover/menu | acima de inspector conforme hierarquia |
| 6 | dialog/confirm | controle de foco, backdrop moderado |
| 7 | toast/sistema | avisos sem bloquear ações, safe areas |

A escala é **lógica**, implementada com tokens/documentação, não números literais obrigatórios. Portals usam `MaterialToneContext` ou equivalente existente para não mudar tema abruptamente. O Canvas possui seu próprio regime de camadas; não sobrepor layers DOM sem preservar hit test.

### 59.4. Arquitetura de componentes e preservação de dados

Reutilizar `PageHeader`, `MaterialSurface`, `FabricFilaments`, `SelectionPlate`, `AppLayout`, controles Radix existentes, `TabletopEngine`, serviços de conhecimento e `tdv2*.ts`. Se um novo componente visual exige `useEffect` para observar DOM externo, justificar por que não recebe estado/medida via React, limitar a instância e documentar desmontagem. Evitar DOM query global, mutação de classe em nós que não pertencem ao componente, overlays duplicados e manipulação de scroll que depende da altura mágica do cabeçalho.

**Contrato transacional proposto:** cada operação de jogo terá `operationId`, `actorId`, `characterId?`, `campaignId`, `sceneId?`, `ruleVersion`, `expectedRevision`, `intent`, `validatedChanges`, `visibility`, `createdAt`, `committedAt?`, `status`, `origin` e `sourceReferences`. O banco aplica mudanças atômicas/idempotentes; o frontend reconcilia com revisão. Esse modelo é **proposta**, requer engenharia e migração aditiva; não criar tabela sem examinar `game_settings`, `character_sheets` e políticas Supabase existentes. Não delegar ao cliente filtragem de segredo.

**Retenção:** dados da edição anterior, nome da ficha, história, inventário, containers, arma, descrição, links, associação com Mesa e Nexus, versões, backup e história de sessão não desaparecem na migração. A V4 só reorganiza como isso aparece. Testes de snapshot e restauração real devem provar isso.

### 59.5. Performance: gráficos de alta qualidade com GPU moderada

**Orçamento por viewport**: um único sistema de textura de fundo; o Canvas da Mesa tem prioridade de GPU; evitar filtros animados de tela inteira e dois canvases de atmosfera. Blur localizado em dock/dialog; imagem/texture de baixa dimensão repetível, sem carga grande; asset WebP/AVIF e SVG vetorial otimizado; fontes com subset/preload realmente necessário; lazy-load de grafo/3D/documentos pesados; pausa quando fora da viewport. Em laptop/tablet com GPU fraca, reduzir parallax e desabilitar blur primeiro, sem diminuir capacidade de ação. Medir long tasks, CLS, INP, LCP, consumo de memória, FPS de Canvas e duração de transição com entradas reais. Valores-limite do Work serão definidos por baseline de hardware/cenários, não supor 60 FPS em toda máquina.

### 59.6. Segurança, privacidade e confiabilidade

Aplicar RLS e RPCs às mesmas fronteiras já existentes. Dados privados **não** podem estar presentes em payload de jogador, DOM escondido, `aria-label`, preview de imagem, metadata, URL de asset, backup ou `realtime`. Diferenciar papel e edição no serviço, não só na rota. Testar simultaneidade e revogação de acesso enquanto uma janela está aberta. Nunca confiar no limite de classes CSS para esconder ações proibidas. Gravação só indica sucesso quando confirmado; conflito preserva rascunho exportável; importação tem prévia; otimizações não desabilitam integridade do salvamento. Painel do Mestre não pode publicar notas privadas ao arrastar objeto para Nexus sem audiência definida.

### 59.7. QA técnico existente como obrigação, não garantia futura

`docs/tdv-ii-validation.json` registra testes históricos e CI, mas não comprova automaticamente o novo código. Reexecutar checks de tipos, lint, unitários, CSS, migrações locais, testes de editor, visual diff, navegador autenticado com papéis e dispositivos; acrescentar provas de restauração e uso real. O Work deve registrar commit, versão das regras, flags, outputs de CI, capturas e o que **não** foi possível certificar. Não dar por publicada a reforma por ter HTTP 200 na landing page.

## 60. O ATELIÊ DE VALIDAÇÃO — PROVAR, NÃO ADJETIVAR, A QUALIDADE

### 60.1. Cenários que qualquer revisão deve cobrir

Toda área e todo elemento precisam ser vistos em quatro modos de existência: **vazio**, **típico**, **denso** e **excepcional**. Os dois extremos são frequentemente onde morre o acabamento. «Denso» deve incluir nomes de personagem longos, Vínculos em número alto, 21 Alinhavos, dezenas de itens, múltiplas ameaças, 20 Marcos, um Nexus grande, uma Mesa com muitos tokens e campos textuais longos. «Excepcional» inclui sessão offline, conflito de revisão, personagem em estado crítico, Mestre em publicação de segredo, falta de permissão, migração legada e falha de upload.

### 60.2. Matriz de verificação de cada componente

Cada controle recebe *teste funcional* (de fato executa), *teste de permissão* (quem pode), *teste visual* (cor/relevo/tipografia/material), *teste de interação* (mouse/toque/teclado), *teste de persistência* (não perde alterações), *teste responsivo* (não some/quebra), *teste de regressão* (não duplica nem altera outro lugar), *teste de acessibilidade* (nome/foco/estado) e *teste de desempenho* (não causa travamento). Uma classe CSS presente no DOM **não é prova de qualidade visual**. Um print bonito não é prova funcional. Um unit test verde não é prova de uso por teclado/mobile.

### 60.3. Galeria obrigatória de referências internas

Criar ou aprimorar `/visual-audit` para exibir, com fixtures sintéticas e sem dados reais:

- Vazio/Tecido/Fólio/Lâmina/Vidro/Metal/Tinta em fundo escuro, leitura clara e Mesa com canvas.
- Cabeçalhos das cinco anatomias, normal/long title/salvamento pendente.
- Navegação desktop expandida/contraída, tablet rail, mobile dock e menu Mais radial em aberto/fechado.
- Botões primários/segundo plano/contextuais/destrutivos/ação RPG em todos os estados; ícones e labels.
- Tabs, placa móvel, seleção múltipla, lista, tabela, card, row, slider, stepper, campo, textarea e select.
- Dialog e drawer com texto curto/longo, foco, teclado aberto, erro e conflito; popover em extremos da janela.
- Fios relacionais em Presente/Tensionado/Ferido/Rompido/Costurado e operação pendente/confirmada/erro.
- Âncora assentada/abalada, Tensão em limiar, Condição Leve/Grave/Crítica e dois dados com resultados originais.
- Carta em preview (63×88), carta longa em consulta, documento de evidência com versão privada e pública.
- Mapa vazio/denso, Fog, token selecionado, luz/3D e inspector aberto.
- Fluxo sem movimento e sem transparência, alto contraste, idioma com textos maiores e zoom.

Cada prancha deve mostrar **qual é a fonte de autoridade** do componente e sua classe/CSS proprietário. Capturar e comparar diffs entre branch e baseline; designers devem revisar screenshots lado a lado, não aceitar autovalidação do código.

### 60.4. Revisão com rubrica ponderada — critério proposto

A rubrica exige simultaneamente excelência criativa e correção, sem deixar que um número compense vazamento de dados:

| Eixo | Peso | Pergunta de reprovação |
|---|---:|---|
| Autoria, composição e personalidade | 20 | Poderia trocar o logotipo e virar qualquer dashboard de IA? |
| Profundidade funcional e ergonomia | 20 | Algum instrumento existe mas ficou mais difícil ou impossível de operar? |
| Fidelidade mecânica e conservação | 20 | Alguma regra/atributo/ação antiga foi reinterpretada ou sumiu? |
| Responsividade tablet/mobile | 15 | Tudo virou pilha vertical, controle gigante ou popup que cobre o trabalho? |
| Motion, microinteração e materialidade | 10 | Há animação bonita sem função, hover sem toque equivalente ou vidro que reduz leitura? |
| Acessibilidade e legibilidade | 10 | Foco, contraste, leitura, áreas de toque e redução de movimento foram comprovados? |
| Performance e engenharia de manutenção | 5 | O acabamento depende de overrides frágeis, trabalho contínuo de GPU ou estado duplicado? |

**Gates absolutos acima da rubrica:** vazamento de segredo, perda de dados, mecânica errada, ausência de função essencial, página inoperante em viewport-alvo ou inacessibilidade grave **reprovam o lote independentemente da pontuação estética**. Como meta editorial, qualquer eixo abaixo de 80% exige correção; qualidade final aspira a pelo menos 90/100, sem tratar a escala como medição científica.

### 60.5. Auditoria visual «sem logotipo»

Aplicar o teste de autoria: retirar título e marca dos screenshots de Início, Ficha, VP, Mesa, Mestre, Nexus e utilidades. O Tadeon deve continuar identificável pelo ritmo, pela proporção de folios e lâminas, pelos Fios de relação, pela materialidade de tecidos e pelas junções. Porém as telas **não podem parecer clones umas das outras**: cinco vistas de uma identidade, não o mesmo card em cinco fundos. Se 60% da composição consiste em `rounded-xl border bg-card`, repensar arquitetura em vez de aumentar glitter.

### 60.6. Critérios de fechamento por ambiente

| Ambiente | Evidência de aceite mínima | Falha que exige retorno |
|---|---|---|
| Login | capturas mobile com teclado aberto; login/logout/reset manual | campo encoberto, feedback falso, scroll exagerado |
| Dashboard | 0/1/20 fichas; nomes longos; filtro/titularidade | hero maior que conteúdo útil; ações sem acesso |
| Ficha Pessoa | 0/20 Vínculos; Marca/Âncora; salvar, navegar e voltar | perda de narrativa ou estado incoerente |
| Constituição | quatro Matrizes, 21 Alinhavos, 3 recursos, 4 Defesas, Equilíbrio | área central ilegível ou matemática divergente |
| Ação | 8 cenários de rolagem e operação sem rolagem | custo duplicado, terceiro dado, CTA confuso |
| Expressão | 10 categorias e item complexo com descrição longa | dados escondidos, caixa impossível no mobile |
| Percurso | 0–20 Marcos, investimentos, PU, timeline | progressão parecendo XP clássico |
| VP | presencial/digital/offline, normal/crítico/Forçar/Carta | duplica prancha e não acrescenta operação |
| Mesa | mestre/jogador, fog, 2D/3D, muitos tokens, mobile | oculta função, Canvas pequeno, vazamento de segredo |
| Mestre | todas as tabs, rodada, pressão, ameaça, pista, selagem | campanha geral ou ferramentas históricas desapareceram |
| Nexus | busca, árvore, grafo, relações, editor, versão, permissões | relação não aparece/segredo em payload |
| Utilidades | usuário, backup, importar/restaurar, offline, diagnosticar | ação irreversível escondida ou estado falso |

### 60.7. Rito de revisão final do site real

Passo 1 — auditoria do código/rotas (manifesto completo). Passo 2 — testes unitários, tipagem, build, SQL/RLS e versão do motor. Passo 3 — navegar com dados sintéticos reais pelo navegador, em Mestre/Jogador/Espectador e edição antiga/nova. Passo 4 — capturas com dispositivos e estados; inspeção manual de alinhamento, tipografia, sombra, textura, foco e efeitos. Passo 5 — sessão de jogo encadeada (criação→VP→Mesa→Mestre→Nexus→encerramento). Passo 6 — testar conflito, offline, reconexão, recuperar backup em ambiente isolado e rollback. Passo 7 — validar produção e abrir o site real nos mesmos dispositivos. Passo 8 — revisão artística externa ao autor do PR, incluindo comparação «sem logotipo». Passo 9 — relatório de perdas/falhas, corrigir e repetir até aceitação.

## 61. INVENTÁRIO DOS DETALHES QUE MAIS FREQUENTEMENTE FICAM ESQUECIDOS

1. **Scrollbars e trilhos**: finos, visíveis quando úteis, não alterar largura de coluna quando aparecem, trackpad e toque fluidos; sem esconder possibilidade de scroll em lista lateral.
2. **Ícones em disabled/read-only**: explicação no tooltip/popover; não apenas opacidade cinza impossível de ler.
3. **Estados de loading da Ficha**: skeleton refletindo folio; não inicializar ficha nova falsa durante fetch para evitar sobrescrita.
4. **Seleção de texto**: cor/tinta de seleção legível em papel e fundo escuro; copiar trecho sem arrastar mapa.
5. **Hover em controles dentro de campo**: ícone não ocupa caret nem bloqueia input; foco não sacode layout.
6. **Nomes/labels longos**: text-wrap e quebra apropriada, no `MasterTab`, cards, Vínculos, campanhas, itens, rotas de Nexus, dropdowns.
7. **Modais perto da borda**: viewport visual, teclado, barras de sistema, popout, safe area; nenhum botão de cancelar escondido.
8. **Ao alternar seção**: scroll/foco contextual correto; preservar rascunho; não reiniciar WebGL ou serviço por cosmética.
9. **Ao voltar da VP**: pessoa e estado de rolagem legítimo preservados; evitar duplicar histórico ou gasto.
10. **No Mestre com duas janelas**: estado de conflito explícito e recuperação sem overwrite; uma janela não finge autoridade sobre a outra.
11. **Na Mesa com luz/fog**: screenshot e canvas de jogador respeitam audiência; portal/overlay não interfere com render.
12. **No modo tablet caneta**: hit targets para stylus, não exigir hover; diferencia desenho de arrasto de painel.
13. **Arrastar cards entre áreas**: preview de destino, validação e cancelamento; não abrir arquivo privado ao cruzar público.
14. **Barra inferior mobile**: inset de teclado, safe area, espaço do indicador do sistema, eventual `visualViewport` e múltiplos popups.
15. **Numéricos**: `tabular-nums`, texto de máximos, rótulos, sentido de avanço, arredondamento de visual não afeta cálculo.
16. **Mudança de tema/preferência**: sem flash de tema anterior, sem mudar semântica de cor e com persistência por usuário/dispositivo quando apropriado.
17. **Cache e snapshots**: ícone de atualizado não indica dado antigo; timestamp em texto útil; não vazar status de personagem restrito.
18. **Áudio e movimento**: nenhum som automático; mute/redução persistentes; evitar vibração virtual, strobe e efeitos de tela inteira.
19. **Tabela de 21 Alinhavos**: 21 itens localizáveis sem mostrar 21 enormes cards; leitura de valores contra fonte real.
20. **História e descrições herdadas**: não excluir do DOM de edição, nem migrar sem perguntar como se convertem ao cânone II.
21. **No Núcleo do Nexus**: links quebrados, alias duplicado, relacionamentos inversos e permissões testados; não usar grafo como única vista.
22. **Campo Mestre privado**: não incluir segredo em HTML de prévia de jogador e esconder via `display:none`.
23. **Botão primário duplo**: se existe CTA no head e no corpo, um deve ser contextual/espelhado com mesmo estado, não gravar duas vezes.
24. **Erro de animação**: se animação interrompe ao alternar de guia, o estado final deve ser correto; evitar elemento invisível mas capturando clique.
25. **Imagem**: crop, fundo e aspect ratio respeitam peça; imagem sem fonte clara cai em placeholder tipográfico autoral, não asset randômico.
26. **Diferença entre Âncora e Vínculo**: posição editorial relacionada, mas estados e procedimentos próprios, não o mesmo slider.
27. **Diferentes Naturezas**: cores não criam afinidade mecânica, não inventar natureza extra pelo visual.
28. **Proveito/Desproveito**: efeito visual ancorado no Fio pertinente, não um `+1` universal colorido.
29. **Tensão e Pressão**: trilhas separadas em telas separadas, sem copiar mesmo componente e rótulo.
30. **Preview versus confirmação**: toda operação que altera ficha/Mesa/Mestre precisa de semântica visual de rascunho, pendente e confirmado.
31. **Fontes e ícones**: licenças/procedência, não anexar arquivos de fontes ao usuário; uso correto das famílias aprovadas.
32. **Back e Escape**: onde há modal, fecha modal; onde há subpane, volta ao pane; não perde página original nem faz navegar para raiz inadvertidamente.
33. **Apoio a teclado**: foco em botões/menus, navegação por tab, atalhos só quando não colidem com editor ou leitor de tela.
34. **Escopo de sessão**: sair da Mesa não interrompe sessão alheia; fechar janela local não finaliza rodada pública.
35. **Abertura de ficha histórica**: nenhum estado «VP II» é produzido a partir de `power_form_data` sem migração aprovada.
36. **Área do editor de mapa**: preflight e smart setup não escondem editor normal; confirmação não é cancelamento silencioso.
37. **Ferramentas de proteção**: foco, visibilidade, assets, autorização de publicação, rollback e import não são «polimento» descartável.
38. **Responsividade real**: aferir largura do container com sidebar aberta e fechada, não apenas 390px com shell ausente.
39. **Fonte de efeito de UI**: CSS de movimento não altera `max-height` de formulário que guarda texto ou reposiciona popup em loop.
40. **Selo de conclusão**: relatório final deve anexar evidência, não chamar o trabalho de perfeito por mera apreciação estética.

## 62. ROTEIRO DE EXECUÇÃO V4 — PRs PEQUENOS, RESULTADO COESO

### Fase 0 — Congelamento e mapa de segurança

**Saídas:** commit-base, export e restore de teste, mapa de todas as rotas e guias, manifesto funcional de componentes, fotografia visual por estado, inventário de assets/símbolos, regras de autoridade, `master-panel` legado e II, lista de acessos por papel. Nenhuma mudança de grande superfície começa antes disso. Classificar cada problema pela matriz PRESERVAR/CORRIGIR/REFINAR/RECOMPOR/INTEGRAR/AMPLIAR.

### Fase 1 — Design System, sem mexer em mecânica

Refinar `MaterialSurface`, `PageHeader`, `SelectionPlate`, `FabricFilaments`, botões, prompts, inputs, dialogs, tooltips, mini-menu, ícones e tokens; preparar /visual-audit com fixtures, motion e versões reduzidas. Corrigir contrastes, stacking, foco e viewport. Consolidar CSS fonte por arquivo, removendo override duplicado e evitando folha terminal universal. **Aprovar biblioteca visual antes de propagar**.

### Fase 2 — Shell e utilidades

Login, reset, Início, arquivo, gestão de usuários, backup, offline, diagnósticos, estados de erro, instalação/atualização da PWA; navegação desktop/tablet/mobile, menu radial, busca global, popups. Nesta fase o site inteiro precisa parecer uma mesma aplicação coerente, inclusive «cantos menos glamourosos».

### Fase 3 — Ficha Integral

Recomposição de cinco folios, história e campos herdados, Matriz/Alinhavos, recursos, Âncora/Vínculo, tab transitions, Expressão/catálogo e Percurso; revisar leitura, edição, salvamento e conflito. Confirmar que não existe regra/arma/inventário perdida. Mobile com pares compactos; tablet com estrutura bifocal.

### Fase 4 — VP e Operação TdV II

Unificação dos modos Jogo/VP; isolamento histórico da Versão de Poder; cenários físico/digital/offline; instrumento de dois Fios; consultas e cartas; custos, aprovação e histórico. Sessões em fluxo inteiro e testes de regras em paralelo. O Work só deve publicar esta fase depois de validar que não há nova autoridade concorrente de dados.

### Fase 5 — Mesa, Mestre, Nexus como um sistema

Refinar palco/HUD/inspector mantendo funções; bancada de Mestre em preparação e condução preservando todas as guias gerais/II; Nexus como biblioteca/grafo/leitura e ligações autorizadas; sincronizar eventos e contexto com desenho de privacidade. Revisar captura de cena, fog, presença e projeção. No mobile do Mestre e Mesa, verificar o viewport real com mapa/toolbar/inspector simultâneos.

### Fase 6 — Corte fino e prova integral

Testar eventos reais, performance e responsividade, acessibilidade, screenshots comparativos e checklist de 40 pontos; reduzir duplicidade de CSS, superfícies sem função e animações excessivas; garantir line-height, truncamento, toque, safe area e alinhamento de todas as guias. Validar restauração, conflito, papéis e legado com dados isolados. Repetir até o relatório final não ter falhas críticas/altas.

### 62.1. Contrato de cada PR

Um PR informa: `scope`, `routes`, `components`, `current-to-target map`, `functions preserved`, `rules untouched / changed (with citation)`, `data impacts`, `security impacts`, `visual before/after`, `mobile/tablet/desktop captures`, `hover/focus/pressed/disabled/selected demos`, `reduced-motion`, `accessibility`, `performance`, `tests`, `risk`, `rollback`, `docs updated`. Sem vídeo/animação demonstrada quando houve alteração relevante de motion, **não** declarar aprovado. Não publicar novas migrations ou mudar autorização sem revisão de segurança e testes próprios.

### 62.2. Ordem de decisão quando estética entra em conflito

1. Segurança e preservação dos dados.
2. Regra canônica e integridade transacional.
3. Operabilidade, acesso, foco e leitura.
4. Responsividade e estabilidade temporal.
5. Personalidade visual e emoção.
6. Refinos decorativos finais.

**Isso não significa empobrecer a estética**: significa que a beleza emerge da organização correta. Um instrumento sem coerência não fica bonito com mais blur; uma tela com elementos gigantes não melhora com um fundo artístico.

## 63. MANIFESTO FINAL PARA O WORK — INSTRUÇÃO DE IMPLEMENTAÇÃO

> **Leia integralmente a Especificação Tadeon Nexus V4.0, incluindo as Partes I, II, III e IV.** Parta da árvore real mais recente de `Gabriel2069/tadeon-nexus` e dos três livros da Trilogia do Anterior, com o Kit Físico. Não recomece o projeto, não reescreva o Motor TdV II sem necessidade e não substitua as ferramentas existentes por uma interface menor sob pretexto de limpeza.
>
> Inicie pelo manifesto de rotas/componentes/ações e pela captura de baseline. Confronte cada tela, guia, botão, menu, campo, carta, instrumento, evento, documento, camada de Mesa e estado de salvamento com o código real. Identifique módulos montados, órfãos, experimentais e legados; preserve tudo que é funcional até que haja destino equivalente comprovado. Não confunda presença de arquivo com recurso ativo. Qualquer omissão detectada entra como item de trabalho.
>
> Crie um Tadeon profundamente autoral: tecido e tinta para conteúdo; vidro contido para comando; Fios reais para relações; matéria física com luz, profundidade e microrelevo; composição editorial assimétrica com eixos precisos, janelas e lâminas inteligentes; motion semântico, hover e toque com equivalência. Abandone repetição de cards, grades genéricas e grandes cabeçalhos que comem o celular. No tablet, preserve quantas regiões simultâneas a largura útil permitir, incluindo split view e janela redimensionada.
>
> Preserve versões históricas, segurança, autoria, dados, RLS, história, inventários, cenas e ferramentas. A Ficha Integral registra a personagem; VP acompanha a partida e complementa a prancha/carta física; Mesa apresenta a situação; Fio~Mestre conduz e aprova consequências; Nexus conserva memória e relações. Uma única autoridade normativa, múltiplas apresentações. O Livro II determina testes, custos, condições, impulsos, pressão, selos, tramas e progressão; o design nunca cria bônus.
>
> Trabalhe por fases pequenas. Cada PR deve exibir antes/depois, capturas de celular/tablet/desktop, vídeo de motion quando necessário, testes de mouse/teclado/toque, regras, segurança e rollback. Corrija CSS proprietário em vez de criar última camada de overrides. Valide com usuários/roles e cenários reais, sem supor que um teste unitário basta. Não publique como final até que o manifesto esteja fechado, não haja regressões e todos os ambientes tenham aprovação funcional, mecânica e artística.
>
> **A assinatura final é a Tessitura.** O usuário deve sentir que toca um universo, mas também que maneja uma ferramenta precisa. A experiência é sofisticada quando ele compreende e executa cada ação com menos esforço, enquanto todos os seus detalhes visuais permanecem memoráveis.

---

# APÊNDICE V4 — ORDEM DE LEITURA EXECUTIVA

**Designer/direção de arte:** 45, 47–50, 51–57, 60–61. **Engenharia frontend:** 46, 48–50, 59–62. **Engenharia de jogo:** 52–55, 58–59. **Engenharia de dados/segurança:** 46, 54–59, 62. **QA/produção:** 46, 58–63. **Product owner:** 45, 46.3, 60, 62, 63.

> **Nota de revisão:** a V4 é um documento diretor de proposta e critérios de aceite. O estado descrito do repositório resulta de auditoria estática e documentação consultada, não de teste manual certificado em todas as contas, navegadores, dispositivos e telas. Diferenças entre o estado consultado e a versão de implementação deverão ser resolvidas no Work, com uma nova auditoria de rastreabilidade antes de alterar componentes. A direção de arte é definitiva como intenção, mas dimensões de layout continuam hipóteses a validar por protótipo e capturas; nenhum número de UI deve ser interpretado como regra de jogo.


### Referências de projeto e normas externas consultadas para a V4

- **Tadeon (árvore de código e documentação)**: https://github.com/Gabriel2069/tadeon-nexus — ramo `main`, árvore observada `b5555c53622ad15cefbea35a535f7a68af2217a8`, 788 arquivos. Para implementação, reconfirmar o commit-base.
- **Livro de Regras II**, **Urdidura do Vazio** e **Fio~Mestre** na Biblioteca do projeto: autoridade canônica, conceitual e editorial; conservar versões e data dos documentos no manifesto do Work.
- **Kit físico complementar**: `01_Tabuleiro_Individual_A3.pdf`, `18_Guia_Kit_Fisico_A4.pdf`, `TdV_Marcadores_v1_Guia_de_Uso_e_Producao.pdf`, `TdV_Catalogo_Visual_do_Kit.pdf`.
- **Apple Human Interface Guidelines, Materials**: https://developer.apple.com/design/human-interface-guidelines/materials — vidro como camada de controles/navegação, não como material indiscriminado do conteúdo.
- **Apple Human Interface Guidelines, Layout**: https://developer.apple.com/design/human-interface-guidelines/layout — adaptação por espaço útil e tamanho de janela; manter layout completo quando cabe.
- **W3C WCAG 2.2**: https://www.w3.org/TR/WCAG22/ — referência para contraste, foco, toque, zoom e navegação assistiva. Estas normas não exigem copiar a identidade visual da Apple.
