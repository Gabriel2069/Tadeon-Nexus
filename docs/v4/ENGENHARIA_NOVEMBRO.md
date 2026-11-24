# Tadeon Nexus · Primeiro lote de Engenharia

Base de trabalho em 24/11/2026 · `587d248a4095f559521b92e092b179d15560fb17` · Plano TN-ENG-20261123-v2.0.

| Superfície | Comportamento implementado |
| --- | --- |
| Ficha, guia Transformação | Comparação com as reservas e os créditos de novembro a partir do Marco da personagem. O cálculo mantém os graus, reforços e modificadores da ficha. Os valores atuais continuam ligados à edição salva. |
| Expressão e inventário | Busca por nome ou propriedade no Arsenal v0.9, 30 armas e 30 equipamentos. A inclusão guarda uma cópia com identificador, edição e propriedades do registro. O espectador tem acesso à consulta. |
| Jogo | Atalho para o teste com Prumo e Tento, entrada de faces físicas e rolagem digital. A leitura recente identifica os Fios e a origem dos dados. Ficha e Jogo usam a mesma função de custo e os mesmos limites de progressão. |
| Mestre, Traçado dos Encontros | Estima rodadas de dano direto a partir de Guarda, PP, oportunidades, dados e redução. Permite registrar a hipótese nas notas. Seis ataques de 2d8 com d12 e d12 contra Guarda 13 e 227 PP dão 29,25 PP esperados por rodada e uma razão de 7,76 rodadas. |
| Mestre, rascunho da campanha | Cada gravação envia os campos editados e exige a versão lida. Se outra janela salvar primeiro, o painel conserva o rascunho e exibe o conflito. Trocas de edição passam pela proteção de saída. Uma resposta atrasada perde efeito quando outro rascunho é carregado. |

## Reprodução

- Rodar `npm run check` e `npm audit --audit-level=high`.
- Rodar `node scripts/verify-tdv2-postgres.mjs` com PGlite fornecido por `NEXUS_PGLITE_MODULE`. O roteiro inclui duas edições baseadas no mesmo instante de leitura, a preservação do estado TdV e uma tentativa de gravação com papel de jogador.
- Com Chromium e Playwright configurados, rodar `node scripts/verify-tdv2.mjs` com `NEXUS_AUDIT_SCOPE=november` e viewports `[[320,720],[390,844],[820,1180],[1440,900]]` em `NEXUS_AUDIT_VIEWPORTS`. O cenário usa uma personagem sintética.
- Rodar `node scripts/verify-master-workspace.mjs` com `NEXUS_AUDIT_WIDTHS=[1440,320]`. Duas páginas editam o mesmo registro em uma API de teste. O roteiro confere o texto de ambas após a disputa.

## Ficha jogável no ambiente de ensaio

A criação no dashboard de desenvolvimento aceita a revisão TDV-2026-11-23 quando configurada com VITE_TDV_NOVEMBER_CREATION=true. A personagem recebe 10 PU na criação, seguido de 4 PU por Marco e 2 adicionais a cada novo Patamar. A Ficha mantém a edição de origem ao salvar. O Jogo usa o mesmo motor para Enlace físico e digital. O painel privado do Mestre lê o último teste e o saldo de PE da personagem.

O roteiro de PostgreSQL carrega scripts/fixtures/tdv-novembro.sql somente no banco de teste. Confere o registro do resultado, a cobrança de 1 PE, a recusa da repetição com versão desatualizada e a leitura conforme o papel. O roteiro de navegador usa NEXUS_AUDIT_SCOPE=november-play para jogar, salvar, recarregar e conferir a leitura do Mestre. A criação de produção continua na Fundação VIII.

A habilitação no banco real depende da reconciliação do esquema e da revisão operacional completa. Desvio com dois Prumos, Arremate com Corte e rodada por etapas continuam pendentes. Os resultados de navegador usam serviços simulados. O playtest em mesa e a inspeção em dispositivos físicos têm verificações próprias.
