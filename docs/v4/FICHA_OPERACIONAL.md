# Ficha operacional segundo o Livro de Regras

A ficha deve permitir consultar a personagem, decidir e operar suas capacidades. A nova direção de Tadeu retira a obrigação de preencher uma descrição para cada rolagem e troca campos genéricos por instrumentos que mostram o significado dos valores. A organização aprovada em cinco fólios permanece; o lote preserva dados, permissões, ferramentas e a Versão de Poder histórica.

A fonte anexada `02_Livro_de_Regras(4).docx` tem SHA-256 `8846b485dc528e3998de9227a033bea746eb439d6519ea7f3362a7a8f9515c0f`, idêntico à fonte normativa já integralmente lida e registrada. Foram reconferidas as seções Constituição, Escada dos Dados, Criação, Motor e Desenvolvimento. Não foi criada uma interpretação paralela das regras.

| Regra do livro | Apresentação e operação |
| --- | --- |
| Alinhavos 0–4: Comum/d4, Iniciado/d6, Praticado/d8, Profissional/d10, Especialista/d12 | Lista única das 21 competências, com grau, estado, trilha e dado juntos. Tocar no dado abre os dois Fios; nenhuma família mecânica foi criada. |
| Matrizes 0 e I–V, de d4 a d20 | Categoria e dado explícitos; 0 aparece como limitação e V como transcendente. O radar permite títulos e leituras próprios da edição atual. |
| Dois Fios, Matriz conforme abordagem e Alinhavo conforme prática | Um único painel usa o Motor existente. O atalho não impõe uma associação entre uma Matriz e um Alinhavo. |
| Nem toda ação exige anotação de Resto | Rolagem comum permanece no resultado local. Custos, falha crítica, Forçar a 0 PE e eventos declarados continuam alterando a personagem quando necessário. Registro de contexto é uma opção explícita para a próxima rolagem. |
| Desenvolvimento 0–100%, em 20 Marcos de 5%; 2 PU por Marco | Régua com origem e 20 passos, faixa de trajetória e saldo de PU. A prévia de investimento mostra o dado seguinte, o custo e o saldo. As faixas não se tornam níveis universais ou bônus novos. |
| PV, PI e PE com limites e consequências próprios | Valor e disponibilidade permanecem visíveis. Tocar no valor abre ajustes de um ponto ou de um valor exato, usando `setResource`; não há contadores concorrentes. |

## O que deixa de ocupar a leitura principal

Os quatro campos de contexto do Motor deixam de ser exigidos na rolagem rápida da ficha. O registro detalhado continua disponível por escolha; seus protocolos de duplicidade permanecem quando utilizado. A operação contextual do Mestre e das expressões conserva seu comportamento anterior.

Recuperação e efeitos de cena ficam numa dobra explícita da aba Ação. As mesmas operações e controles permanecem ali. Anotações vazias ficam recolhidas; anotações existentes continuam abertas e preservadas. Nenhum histórico, Resto, nota ou investimento salvo é apagado por este lote.

Os campos de escrita da ficha usam o fólio como superfície e revelam seus limites ao receber foco. Matrizes, Alinhavos, recursos e Desenvolvimento têm instrumentos próprios. A edição inicial das competências continua limitada à distribuição oficial; aumentar capacidades prontas continua exigindo investimento e incorporação.

## Persistência e autoridade

Uma rolagem sem efeito e sem contexto retorna a mesma personagem. O painel mostra o resultado sem marcar uma alteração inexistente. O Motor continua responsável pelos custos, pelos efeitos críticos e pela contabilidade de eventos. O salvamento e os conflitos da ficha continuam nos serviços existentes. Não há mudança de schema, migração, conversão em massa ou autorização.

A novidade é uma ficha de consulta e operação, com registro seletivo. Ela não presume que um nome de equipamento concede um efeito extraordinário nem automatiza a interpretação do Narrador. A integração de autoridade entre ficha, Mesa e Mestre segue nas fases próprias da V4; não é declarada concluída por uma melhoria desta interface.

## Validação e rollback

A validação cruza testes de comportamento com operações reais em fixtures, capturas nas larguras suportadas, edição/leitura, teclado e redução de movimento. `sheet-operational-validation.json` registra os resultados e limites observados; fixture não certifica conta ou aparelho real.

Rollback: reverter os commits do lote. Os dados mantêm o formato anterior, inclusive os registros que deixam de ser obrigatórios na interface. Não existe rollback de banco.

## Evidência visual

| Vista | Prova |
| --- | --- |
| Constituição · 390×844 · antes | [Captura da base publicada](evidence/operational-constitution-390-before.png) |
| Constituição · 390×844 · depois | [Grau, categoria, estado e dado](evidence/operational-constitution-390-after.png) |
| Rolagem por competência · 390×844 | [Motor sem formulário narrativo obrigatório](evidence/operational-roll-390.png) |
| Percurso · 390×844 | [Marcos e PU](evidence/operational-development-390.png) |
| Constituição · 1440×900 | [Composição ampla](evidence/operational-constitution-1440.png) |

As comparações usam dados fictícios e Chromium 141/Playwright 1.56.1. O check local aprovou 165 suítes/697 testes, lint, tipos e build. Os instrumentos passaram por 75 estados em 15 viewports exatos e dois cargos; foram verificados alvos de pelo menos 44px, rótulos sem corte, rolagem, edição de recursos e leitura. A CI deve completar as suítes mecânicas e visuais no SHA final antes de integrar. Não se declara cobertura de todos os cenários extraordinários ou aparelhos reais.

A espera de captura consulta o estado atual das animações finitas e falha em 10 segundos se elas não assentarem. Ela substitui a espera de promessas `finished` antigas, que podiam permanecer pendentes após recolher uma área ou trocar de aba. As verificações de geometria, foco, escrita e leitura permanecem.
