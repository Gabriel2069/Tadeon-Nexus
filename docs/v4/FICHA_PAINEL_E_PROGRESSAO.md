# DEC-032 · Painel e progressão

Base: main 5a1757ce92a91a88004ce6e340d68df01ae28590 (PR 322 publicada).

- Integral conserva guias, campos e operações. Jogo monta um painel próprio de capacidades, limiares e itens/práticas; as guias integrais ficam numa janela de ferramentas. Sem novo motor ou dados paralelos.
- Cores históricas das Matrizes restauradas; proteção usa escudo posicional e quatro limiares distintos. Guarda quebrada não apaga Evasão.
- Tramas e Fragmentos alternam no mesmo quadro; Selos continuam acessíveis. Adição só persiste ao confirmar o popup, como armas/inventário.
- Clique na capacidade apresenta próximo dado, custo e saldo; jogador só avança, mestre corrige. SQL impede regravar investimentos e reduzir distribuição inicial; antigas autorizações de reabertura não permitem regressão do jogador.
- Criação continua exigindo duas d10/duas d8 e dois Alinhavos d8/quatro d6. Descrições e revisão continuam disponíveis, sem bloquearem selagem. Marco pode selar pacote válido sem curar recursos. Distribuições reais inválidas exigem correção explícita do mestre.
- Carga: volume, mãos ocupadas, suporte e porte/acesso; sem reconstruir capacidade numérica antiga. Registros e campos legados permanecem.

Validação: gates locais e passagens visuais de CI registrados na PR. Fixtures não certificam aparelhos físicos, rede real ou a totalidade V4.
Rollback: reverter o commit visual e restaurar as duas funções SQL anteriores; não apagar registros ou apagar campos de carga. A restauração do validador antigo exige antes avaliar fichas numericamente seladas com descrições vazias, sem inventar seus textos.
