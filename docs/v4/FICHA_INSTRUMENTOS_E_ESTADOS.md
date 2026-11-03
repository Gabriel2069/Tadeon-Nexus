# DEC-033 · Instrumentos e estados da ficha

Base reconfirmada: main `6de0a770b443bec028444cd16f35114f16f42e42`, PR 323 publicada. Esta rodada atende NEX-046/NEX-047, sem certificar a V4 inteira. Backup geral continua diferido por instrução de Tadeu.

## Destinos e composição

| Antes | Destino atual | Conteúdo preservado |
| --- | --- | --- |
| Pessoa | Feição (`pessoa`) | Pessoa, narrativa, Âncora e Vínculos |
| Constituição/Ficha | Ação (`constituicao`) | Recursos, Matrizes, Alinhavos, condições e defesas |
| Cena (`acao`) | Ação (`constituicao`) | Proteção, consequências, recuperação e encerramento de cena |
| Expressão | Expressão (`expressao`) | Lavores, Tramas/Fragmentos, Selos e demais registros |
| Percurso | Transformação (`percurso`) | Desenvolvimento, PU, Marcos e correções autorizadas |

O card antes chamado Feição passa a Pessoa. A navegação usa quatro guias e a placa existente, arredondada/contida no trilho. Jogo usa os mesmos dados e apresenta as ferramentas integrais na janela contextual.

Vínculos mostram dois nós unidos por fio, estado e reciprocidade antes da edição. Menus de recursos, Equilíbrio, capacidades e operações recebem pigmentos, dados/símbolos e composição próprios, sem animação ambiente. Familiaridade tem símbolo próprio e não concede bônus. Leitura permanece disponível ao espectador; controles de gravação obedecem às permissões existentes.

## Mecânica e persistência

- `resourceModifiers` é opcional: inteiros assinados por recurso. Máximo efetivo = máximo de base + modificador, limitado a zero. Aumentar o máximo não cura; reduzir ajusta o atual quando necessário. As fórmulas independentes de defesa não mudam.
- `temporaryEffects` guarda Proveito, Desproveito ou bônus numérico por Matriz/Alinhavo. Os marcadores aparecem junto do dado. Proveito/Desproveito se cancelam e deslocam no máximo uma categoria; não autorizam d20 extraordinário. Bônus altera Enlace, preservando faces, Consonância, Desvio e falha 1/1. Testes registrados guardam seu modificador para reprodução estável. O fim da cena remove efeitos temporários.
- PV zero produz Incapacitada; PI zero produz Colapso. A saída dessas condições exige ação explícita, após restaurar o recurso. PE zero mostra Esforço esgotado sem impor penalidade genérica nem impedir ações ordinárias; esse indicador termina quando PE retorna.
- `crisisMarks` oferece três marcadores manuais de Morrendo/Colapsando. Não é uma regra nova de três falhas, não mata automaticamente e não substitui a janela de intervenção do livro. Risco produz borda/fundo estáticos de leitura forte, com rótulos além de cor.
- Não se regrava nenhuma ficha em massa. Campos novos são opcionais. A normalização dos estados ao consultar é pura; a leitura não grava. CAS, autorização, progressão e histórico de correções permanecem.
- Migration `20261102234203_tdv_resource_effects.sql`: substitui somente o validador privado, aceitando os campos aditivos e máximos modificados. Mantém SECURITY INVOKER, search_path vazio, ACLs e guarda de progressão. Não altera tabelas, papéis ou registros.
- `tabletop-view` continua usando o motor compartilhado, filtragem de audiência/RLS e JWT verificado. Sua publicação deve levar o schema atualizado: a versão estrita anterior rejeitaria os novos campos. Estados zero são derivados em memória, sem escrita pelo serviço.

## Evidências e limites

Antes da publicação: 172 suítes/730 testes locais; 70 verificações PostgreSQL isoladas, incluindo campos inválidos, máximos modificados e regressão proibida ao jogador. Gate completo e evidência visual do fonte final ficam na PR desta rodada. A passagem visual concentrada cobre quatro viewports (320×720, 568×320, 820×1180 e 1440×900), edição/leitura, quatro guias, extremos do trilho, menus, efeitos, jogo e recursos zerados. A passagem anterior continua disponível para diagnóstico, sem repetição automática integral em cada ajuste.

Fixtures e screenshots não certificam aparelhos físicos, latência real, contas reais, toda a Mesa, Nexus ou as demais fases V4. Não há alegação de ganho FPS/INP nesta rodada. O livro disponível de referência é `02_Livro_de_Regras(5)(1).docx`, textualmente idêntico à edição (5) já conferida; a menção a uma edição posterior indisponível não foi tratada como conteúdo conhecido.

## Reversão

Reverter a apresentação mantendo leitores dos campos opcionais, os cálculos de máximos e o validador compatível. Não retornar cegamente ao schema estrito anterior: fichas com campos novos ou recursos acima da base precisam continuar legíveis. Não apagar efeitos/modificadores, truncar recursos ou regravar dados como atalho. A Edge Function pode ter sua apresentação anterior recomposta conservando o motor/schema atual e JWT. Migrações aplicadas não são removidas; correções posteriores usam nova migration.


## DEC-034 · Contexto e manifestação

Narrativa (História, Personalidade, Objetivos, Observações) e História/memória passam de Transformação para Feição; mesmos componentes, callbacks e dados. O quadro Implicação sai da composição, mas creation.groupReason permanece intacto, inclusive nos registros legados. Marca organiza Gatilho, Manifestação e Resíduo em três inscrições, com ordem visual e tinta própria.

Proteção e Organizar recebem materiais específicos nos seus portais reais. Tramas/Fragmentos/Selos alteram o pigmento do quadro externo conforme a seleção. Os três marcadores manuais de risco passam por intensidade de borda, pigmento e preenchimento estáticos, sem loop e sem mudar as consequências mecânicas.

Reversão deste lote: reverter apenas os componentes/estilos de DEC-034; nenhum dado precisa ser removido ou convertido. Baseline publicado cd0751eecb82814be91d525be0d241f317a94617. Evidências finais e publicação na PR desta rodada; dispositivos físicos e contas reais continuam não certificados.


## DEC-035 · Painel de jogo

Cinco atalhos em faixa única adaptável, nomes acessíveis completos e rótulos compactos. Alinhavos têm busca local que ignora acentos, alcança também graus não treinados e retorna à seleção anterior ao limpar; sem gravar estado na ficha. Itens/expressões preservam as prévias compactas e agora mostram total e acesso explícito à coleção completa. Dano-base declarado aparece na leitura do item, sem cálculo novo. Âncora Abalada tem estado visível; vínculos vazios não inflam a contagem.

Sem mudança de regra, schema, autoridade ou banco. Reverter apenas apresentação e busca para o baseline publicado 0ebc56b283e814d2ab0229867f5b809a410ef76f; dados não requerem conversão. Evidência e publicação próprias na PR; aparelhos físicos/contas reais não certificados.


## DEC-036 · Encaixes estreitos

Recursos mantêm três colunas, com redução do espaço entre elas e retirada do preenchimento lateral nas larguras estreitas para caberem alvos independentes. Guias recompostas em duas linhas, nomes de Matrizes/Alinhavos acima dos dados, ações longas com quebra permitida e cabeçalho flexível. Popups preservam espaço para fechar. Nenhuma função ou informação removida. QA mede retângulos reais de alvos nos dois modos, além de overflow, portais e capturas. Baseline c0210373c2eac847b09f6c82d99f17e0a3241060; reverter somente apresentação DEC-036 se necessário. Sem alteração de banco. Dispositivos físicos e teclados nativos não certificados por emulação.
