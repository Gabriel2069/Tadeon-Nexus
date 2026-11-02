# Ficha interativa — DEC-030 / NEX-046

O pedido atual supera a estrutura de DEC-029: Ficha Integral expandida como padrão, recursos prioritários, capacidades proporcionadas, vínculos compactos e jogo por contexto. A foto de Ordem fornecida orienta densidade e navegação; a linguagem permanece Fio-Mestre. Não se impõe um retrato fictício à personagem.

## Resultado e destinos

| Uso | Composição montada | Dados e autoridade preservados |
| --- | --- | --- |
| Nome e ferramentas | Uma inscrição no cabeçalho; ferramentas secundárias em menu | Mesmo nome, salvar/CAS, histórico de sessão, presença, popout e Nexus |
| Recursos | Arcos proporcionais, atual/máximo e +/− direto; valor abre ajuste maior | `setResource`, mesmos PV/PI/PE, estados críticos e acesso à proteção |
| Equilíbrio/Tensão | Eixo vermelho/Medo → amarelo/Conhecimento, posição, consulta e tensão direta | Mesmo `addTension`: ±4 move uma unidade e zera, sem excedente ou bônus universal |
| Capacidades | Quatro pigmentos de Matriz; 21 Alinhavos em lista plana, busca e consulta contextual | Categorias/graus/dados e desenvolvimento do motor; base inicial d6/d4 e distribuição legal inalteradas |
| Pessoa | Pilares como inscrições, Âncora com seis escolhas nativas, vínculos compactos | Origem/Ofício/Convicção/Limite, Marca, oferta/cobrança, mobilização, Ancorar e Reassentar |
| Cena | Proteção, limites, recuperação e consequências sob demanda | Guarda, estabilização, fim de cena, recuperação, Forçar e Resto existentes |
| Repertório | Prática → Usar; Costura sob demanda; saldo após preço; operações ativas ao lado | Mesmo motor de expressão, custos, sustentação, Relaxamento, Refluxo e registros encerrados |
| Desenvolvimento | Barra de 20 Marcos, PU e quatro mudanças concretas; consulta da capacidade abre o mesmo investimento | Custo/escala/incorporação existentes, reconhecimento transcendente quando aplicável; sem nível paralelo |
| História e equipamento | Mesmos destinos em Pessoa, Percurso e Repertório | Narrativa, anotações, inventário, recipientes e campos legados conservados |
| Edição anterior | Registros históricos | URL/payload separados; correção anterior de leitura sem autosave preservada |

Menu contextual lateral por largura útil e faixa compacta no celular. A placa continua em SelectionPlate, sem mover os alvos. Os popups continuam usando foco, portal e colisão das primitivas existentes. Escrita aparece por ação, não como caixas permanentes em toda a leitura.

Digital prioriza capacidades; Híbrido abre o repertório; Apoio físico abre estado/proteção. Preferências de sessão são separadas por pessoa/ficha. Todos usam o mesmo personagem e callbacks. O tabuleiro físico não é presumido sincronizado; a interface identifica os valores como os da ficha digital.

## Condições

Livro II reconferido, hash `8846b485dc528e3998de9227a033bea746eb439d6519ea7f3362a7a8f9515c0f`. Condições têm Nome/Origem/Efeito/Saída; intensidade não determina penalidade universal. Não se infere mecânica de prosa.

A faixa de estados abre efeito, saída e ajuste. Adicionar é rascunho local até confirmar; cancelar não cria registro e devolve foco. Desproveito/Impedimento podem ser declarados para uma capacidade somente quando valem para todo uso dela. Efeitos situacionais permanecem descritos. Selecionar o tipo sem escolher a capacidade não aplica um efeito arbitrário à primeira opção.

A primeira linha do `effect` existente guarda uma declaração legível e exata: `Fio declarado · Desproveito · Nexo`, seguida da prosa preservada. Somente o formato e nomes canônicos são reconhecidos; retirar a declaração restitui a descrição. Clientes anteriores continuam conservando o texto, sem coluna ou campo JSON novo.

No `prepareTest` comum, fontes negativas cancelam positivas uma a uma e participam do limite de uma categoria por Fio; Matriz Abalada entra no mesmo cálculo e Forçar vem depois. Desproveito da prática da personagem não passa ao Tento próprio de auxiliar. Auxílio não contorna um impedimento da ação. Graus, investimentos e recursos não mudam por essa associação. Cumprir a saída remove o efeito. Não se duplica uma consequência como Condição e perda automática de recurso.

## Validação proporcional — solicitação mais recente

Tadeu pediu reduzir testes exaustivos e terminar. A nova direção de QA substitui três varreduras visuais sobrepostas de 15 tamanhos por uma passagem responsiva concentrada em 320×720, 568×320, 820×1180 e 1440×900, com edição/leitura, cinco guias e operações realmente alteradas. A regressão mecânica existente roda em celular/desktop. Os demais grupos compartilhados e Quality permanecem; não se repete a mesma bateria local após cada detalhe.

O helper verifica: 25 capacidades, alvos dos recursos, busca, efeitos/saídas de Condições, rascunho cancelado sem escrita, foco, tensão ±4, estado somente leitura, prática pré-selecionada e perfis por pessoa/ficha. O motor tem testes próprios para declaração, cancelamento de fontes, limite, auxílio e impedimento. Não se usam capturas antigas para certificar este fonte. Evidência e limites em `playbook-sheet-validation.json`; PR 321 registra SHA/gates/publicação exatos.

A manutenção removeu a árvore anterior não enviada. A implementação foi recomposta a partir do fonte e90 e registrada em checkpoint remoto antes de continuar. Os 717 testes do ambiente perdido não são citados como resultado deste novo fonte. As provas atuais têm contagens próprias.

Sem migrations, alterações de autorização, exclusão de dados ou escrita em contas reais. CSS corrigido nos proprietários, sem stylesheet ou !important novo. A regra genérica de campos deixa de disputar inscrições; dobras usam uma indicação direcional discreta. Não se infere FPS/INP de capturas.

## Limites e retorno

Permanecem pendentes: concessão inicial gratuita de Lavor por autoridade de servidor, aprovação/audiência/idempotência transacional e conciliação física/offline completa (NEX-048), hardware e contas reais. A amostra responsiva reduzida não certifica todos os 15 tamanhos. Não se declara V4 ou livro integralmente implementados.

Rollback: retornar componentes/estilos mantendo o schema opcional `creation` já introduzido. Conservar o leitor de declaração de Condição mantém seus efeitos; sem ele, o conteúdo continua legível mas apenas descritivo. Não apagar registros para retornar a interface. Um revert cego ao parser antigo estrito pode rejeitar metadados novos.
