# V4 — materiais e fechamento técnico das fases iniciais

O pedido vigente preserva a organização da ficha e pede mais presença nos materiais, nas cores, nos cantos e nos encaixes. DEC-024 continua adiando a restauração completa. Este lote não muda regras, permissões, esquema, payload de personagem ou ferramentas da Mesa.

## Diferenças e destino

| Área | Destino | Entrega |
| --- | --- | --- |
| Inventário e fontes | Preservar e integrar | Dossiê, Trilogia e Kit conservados; manifesto AST atualizado e cruzamento com censos de DOM e hashes de capturas. Fonte, montagem e operação continuam distintos. |
| Biblioteca | Ampliar | Seis famílias no laboratório real `/visual-audit?gallery=1`: Fólio, Instrumento, Trama, Lâmina, Palco e Acervo. Seleção, texto preservado, pendência, rejeição, retry, somente leitura e confirmação sintética. |
| Materiais compartilhados | Refinar | Tinta com grão vertical discreto, bordas iluminadas e raios por família; cor da rota e dos quadros internos chega aos cards por herança. Conteúdo permanece estável sob o cursor. |
| Entrada e cabeçalhos | Refinar | Luz de tecido mais presente, vidro contido no formulário e cor por área; controles e fluxos existentes preservados. |
| Usuários | Refinar | Cards individuais, autoria em bronze, papéis e confirmação conservados. Não restaurar registro único em linhas. |
| Offline | Refinar | Fólios violetas, margem de encadernação e leitura dos quatro recursos; conta/cargo continuam limitando o cache. |
| Envelope de utilidades | Corrigir | Removido o teto legado de 92rem em interface-layout.css; desktop-shell.css conserva a autoridade de 104rem. A matriz detectou a divergência em 1920px. Quatro !important antigos eliminados. |
| Backups e diagnóstico | Refinar | Bancada azul mineral para criação, histórico e importação; ações, confirmação, erro e retry existentes conservados. Sem migração ou backup novo. |
| Ficha | Refinar | Organização aprovada intacta; cantos assimétricos, costura, luz local e fios mais legíveis. Âncora verde, vínculos azul-esverdeado, recursos com pigmentos próprios e Equilíbrio azul. Mesmos campos, IDs e operações. |
| Identidade da publicação | Corrigir | SHA público definido explicitamente para cliente e SSR quando o workflow fornece um hash válido; ambiente local sem identidade confiável continua identificado como desenvolvimento. |

## Fechamento por fase

A fase 0 entrega o levantamento reproduzível de fonte, contratos e evidências montadas; a restauração parcial já foi documentada. Sua **certificação integral continua diferida**, incluindo backup completo, contas e dispositivos reais. Não transformar uma dispensa de backup em alegação de autorização, persistência ou audiência certificadas.

A fase 1 entrega a implementação da biblioteca no laboratório já existente, seus estados e fallback de movimento. Ela usa os proprietários CSS atuais; não cria folha nova, override com `!important`, segundo motor de seleção ou animação decorativa infinita. A textura é vetorial; não há raster decorativo novo. A confirmação do laboratório é explicitamente fictícia e não grava serviços externos.

A fase 2 aplica a biblioteca às superfícies de entrada e utilidades, preservando a navegação, rodas, busca, PWA, acesso, registro individual de usuários e todas as operações. O código existente de dados e autenticação é conservado. O roteiro de navegador exercita erro/retry de usuários, revisão/cancelamento de papel, offline vazio/povoado, histórico/importação, portais e navegação. Isso não substitui login real, e-mail de recuperação, instalação de PWA em hardware ou permissões entre contas reais.

A prancheta contém os 15 tamanhos do capítulo 50 e conserva 1366×768 como opção adicional. Os verificadores aceitam `NEXUS_AUDIT_VIEWPORTS=chapter50`; arquivos usam largura **e altura**, distinguindo 1024×768 de 1024×1366. Emulação de viewport não é certificação de dispositivo.

## Evidência e limites

`material-validation.json` liga contratos de rota/componente/ação/permissão/dados/testes às capturas montadas desta rodada. Cada captura conserva estado, dimensões, censo de controles e hashes. Controles presentes não são contados como callbacks executados. `scripts/link-v4-evidence.mjs` reproduz o cruzamento a partir dos diretórios de artefatos; imagens e censos completos acompanham a execução de navegador. A retenção de CI não equivale a hospedagem permanente das imagens.

A fase da Ficha Integral permanece aberta para estados densos e histórias longas. Visão de Partida, integração física/digital, transações e audiência de Mesa/Mestre/Nexus permanecem nas tarefas NEX-047 a NEX-050. Não duplicar esses motores nem confundir a Versão de Poder histórica com VP II.

Rollback: reverter o commit deste lote e sua continuidade. Não há migration, exclusão de registro ou nova escrita de domínio a desfazer.

## Capturas comparativas conservadas

| Vista | Antes | Depois |
| --- | --- | --- |
| Pessoa · 390×1000 | [antes](evidence/ficha-person-390-antes.png) | [depois](evidence/ficha-person-390-depois.png) |
| Pessoa · 1440×1000 | [antes](evidence/ficha-person-1440-antes.png) | [depois](evidence/ficha-person-1440-depois.png) |
| Instrumentos · 390×1000 | [antes](evidence/ficha-instruments-390-antes.png) | [depois](evidence/ficha-instruments-390-depois.png) |

Fixtures locais de mestre com dados fictícios. A coleta anterior usa Chromium 153; a final usa Chromium 141 correspondente ao Playwright 1.56.1. A comparação demonstra composição e material, sem medir FPS, INP ou hardware. A aba Pessoa conserva exatamente altura e início do primeiro quadro em 390 e 1440px. O resultado de 48 vistas final confirma ausência de overflow nas cinco abas e instrumentos em mestre/espectador.

A asserção textual antiga que exigia o teto de 92rem foi substituída pela verificação real entre rotas nos 15 tamanhos; não representa exclusão de comportamento do produto. O total unitário final passa de 695 para 694, acrescido das verificações de navegador. A recuperação de senha recebe também um ensaio isolado de link expirado, divergência entre senhas, pendência, rejeição com texto preservado e sucesso após retry, sem alterar senhas ou sessões reais.

## Resultado técnico final desta branch

Check completo aprovado: 164 suítes/694 testes, lint, tipos, build e arquitetura. Auditoria: zero alto/crítico e 15 moderados, sem mudança de dependências. A retirada da única asserção textual obsoleta está explicada acima; o comportamento ganhou verificação real de geometria. Um timeout de espera de um segundo no teste existente de troca de ator apareceu sob coleta concorrente; o check completo em série passou sem alterar esse teste.

Matriz local: 90 estados de shell em seis rotas, 150 de utilidades, 15 da biblioteca, 15 de login, 30 de recuperação e 48 da ficha; checagem adicional de cores forçadas. O cruzamento contém 334 registros ligados, dos quais 319 têm censo de DOM. As três divergências de envelope em 1920px foram corrigidas e conferidas novamente. Dez das 18 rotas têm montagem documentada nesta rodada; as outras oito estão listadas como não certificadas neste lote, conservando seus contratos e funções. Isso não é cobertura integral de callbacks ou contas.

A CI da PR acrescenta os cinco grupos completos de regressão, incluindo operações mecânicas, Mesa, navegação e motion. Integração e publicação são posteriores ao snapshot e exigem prova no SHA correspondente; a PR reúne esses resultados sem afirmar antecipadamente que a branch já está em produção.

A revisão final conserva a herança DOM da cor nos cards. Portais mantêm seu contexto nos proprietários já existentes; um Card interno não escreve o tom da rota sobre o pigmento do seu quadro. Nenhuma nova leitura de contexto é necessária no Card.

O ensaio adicional de herança altera o pigmento do contêiner e confere a cor computada no Card interno, restaurando o valor no fim. Ele passou em navegador local. O ambiente de coleta ficou indisponível durante a nova execução completa; a CI deve validar o SHA final antes da integração, sem substituir uma interrupção local por uma alegação de sucesso.
