# Ficha como instrumento — DEC-029 / NEX-046

Tadeu rejeitou a solução anterior: trocar cores e símbolos de cabeçalho não bastou para transformar o formulário em ficha. Esta rodada muda a apresentação do conteúdo e sua operação. Os cinco fólios, permissões, motor, dados, custos e ferramentas preservam seus destinos.

| Área | Composição e operação |
| --- | --- |
| Feição | Retrato vetorial de fios com seis nós vinculados aos pilares realmente estabelecidos. Origem, Ofício, Convicção e Limite têm leitura tipográfica natural e edição com aplicar/cancelar. Marca continua opcional e explicitamente não manifestada. |
| Âncora | Rosa de seis pilares com seleção nativa ao redor de um selo tecido. Estado Assentada/Abalada vem da personagem; escolha, Sustentar/Redirecionar e Reassentar mantêm regras e callbacks. |
| Vínculos | Atlas com nomes/relações reais. Tocar um nó abre o respectivo fólio, leva-o à vista e move o foco ao resumo; oferta, cobrança e estados continuam disponíveis, inclusive em somente leitura. Não cria ou grava um vínculo por abrir sua leitura. |
| Constituição | Radar e dados canônicos preservados. Alinhavos têm leitura de prática, ação e dado; familiaridades opcionais não são grau nem benefício. |
| Recursos | Três recipientes distintos: Vitalidade, Inteireza e Esforço, preenchidos pelo valor atual/máximo real. Os ajustes continuam nas operações existentes. O modo de jogo usa a versão compacta. |
| Equilíbrio | Duas tramas se encontram no valor bipolar; ponteiro e marcas de tensão vêm do estado real. Escala não é vida ou bônus universal. Ajustes continuam visíveis; explicações têm dobra própria. |
| Motor | Medidor calculado de probabilidade contra a DT, usando `probabilityProfile`. Diagrama mostra como os dois Fios formam o Enlace e encontram o limiar. Resultado completo, leitura crítica e confirmação física permanecem. |
| Expressão | Tipos de repertório têm tratamento próprio. Lavores mostram os cinco elementos mais Nome em leitura, sem substituir dados por resumos inventados. O editor completo permanece disponível. Registrar um Lavor não o adquire. |
| Percurso | Fio sinuoso com nós de Marcos reais. Desenvolvimento/PU continuam derivados pelo motor. História, Personalidade, Objetivos e Observações têm leitura e edição deliberada; contador de palavras e hero de redação deixam a apresentação atual, permanecendo na edição anterior. |
| Nome | Sai a caixa permanente repetindo aparência de formulário. Texto e edição sob demanda usam o mesmo fluxo de salvamento. |

## Conciliação da criação com o Livro II

A fonte normativa é `02_Livro_de_Regras(4).docx`, já lida, hash `8846b485dc528e3998de9227a033bea746eb439d6519ea7f3362a7a8f9515c0f`. Foram reconferidos o procedimento oficial de oito passos e os elementos do Lavor. Os seis elementos já existiam nos dados; a lacuna visual era expô-los como campos genéricos.

A criação oferece oito destinos reais: Feição, Matrizes, Alinhavos, Recursos, Defesas, Equipamento/Lavores, Implicação e Revisão. Novos rascunhos preservam a base d6/d4 e exigem a distribuição legal antes de concluir. Recursos e defesas mostram cálculos derivados, sem alocação manual paralela.

Metadados opcionais `creation` guardam razão concreta para entrar na primeira situação, até quatro familiaridades de Feição e revisão final. A revisão confere permissões ficcionais, equipamento, Condições iniciais e capacidade; não autoriza poder ou gasto. Novos rascunhos precisam de implicação e revisão para concluir. Fichas antigas concluídas permanecem válidas. Rascunhos antigos sem metadados recebem a revisão completa em memória; ela é persistida somente por ação do usuário, sem redefinição ou migração em massa. Na conclusão, recursos vão aos máximos pelo `finishCreation` existente.

Familiaridades identificam apenas Alinhavos de grau 0; não alteram dado, grau ou PU. A seleção libera a vaga ao elevar o Alinhavo na criação. Depois da criação, familiaridades são exibidas como formação inicial, sem repetir d4 como se fosse o dado atual após investimentos. Marca pode permanecer não manifestada, conforme o livro. Equipamentos continuam nas ferramentas existentes da Expressão, e Condições iniciais em Ação.

O cenário pode conceder Lavores iniciais explicitamente e igualmente ao grupo. A interface explica essa regra e não fabrica concessão gratuita, aprovação do Mestre ou PU retroativo. A concessão inicial gratuita operacional, com autoridade de servidor, continua uma lacuna da etapa transacional NEX-048; a compra/incorporação existente permanece. Este relatório não declara toda a criação digital ou o livro integralmente implementados.

A leitura histórica também deixa de produzir writes de normalização. O rascunho só fica disponível após a hidratação, respostas antigas são invalidadas e o payload é comparado à projeção carregada antes de salvar. Mudanças reais continuam usando o autosave existente; sincronização legada é apresentada em memória e só é persistida com edição real. O teste espera além do debounce e exige zero writes na consulta. Em 390/1440, também edita deliberadamente a forma histórica, confirma persistência e verifica que a ficha atual não foi alterada; recarregar não repete gravações.

## Validação e limites

`living-sheet-validation.json` guarda evidências locais, hashes e plano dos gates do fonte exato. O Visual review preserva os seis grupos e o agregador. A suíte play amplia as capturas para Âncora, atlas de vínculos, recursos e Equilíbrio, nos 15 viewports do capítulo 50. A regressão de criação exige implicação/revisão e confirma salvamento conjunto de história/dossiê.

Os desenhos são SVG local sem observadores, dependências ou animações ambientes. CSS é corrigido em `sheet-premium.css`/`button.css`; escalas visuais antigas substituídas são retiradas. Não se infere FPS/INP de capturas ou contagem de vetores. Foco, portais, somente leitura e movimento reduzido são cobertos por fixtures, não por hardware/contas reais.

Sem migrations, exclusão de registros ou escrita em conta real. DEC-024 continua vigente. Rollback: reverter a apresentação mantendo a definição opcional de `creation` no schema de leitura. O parser anterior rejeita chaves de topo desconhecidas; um revert integral e cego não é um rollback compatível com novos rascunhos salvos. Exportar os payloads completos antes de regressão. Manter o schema novo ao retornar os componentes anteriores conserva os metadados sem apagar registros. Nenhuma migração automática foi aplicada.

Permanecem pendentes: concessões iniciais autorizadas pelo servidor, eventos transacionais/idempotentes e conciliação física/offline completa (NEX-048), demais estados densos e dispositivos/contas reais. Integração/publicação e SHA final são registrados na PR, sem confundir screenshots locais com produção.

O ambiente local ficou indisponível no fechamento. A composição, capturas e regressão locais foram preservadas; os ajustes finais de foco, familiaridades e leitura histórica exigem os gates do novo fonte no GitHub. Nenhum resultado anterior é usado para certificar esse código final.
