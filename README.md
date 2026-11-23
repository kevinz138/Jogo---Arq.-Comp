# Lumia e o Abismo dos Circuitos

ARQCOMP – Exercício 04 (Sprint 3) · jogo de estudo de Arquitetura Computacional, feito só com HTML, CSS e JavaScript puros (sem bibliotecas).

🔗 **Jogue aqui:** https://SEU-USUARIO.github.io/arqcomp-cruzadinha/

## Como jogar
1. Clique em **Jogar na Arena** e escolha o modo (**Aprendiz**: não perde vida · **Guardiã**: 3 chamas por onda).
2. Leia a **pista** no topo. Cada bug carrega uma plaquinha com um nome. Toque no bug certo (ou aperte as teclas **1 a 5**).
3. Errou? A Lumia **não entrega a resposta**: mostra uma **dica** mais forte a cada erro (botão **Dica** também funciona). As perguntas e as opções são sorteadas a cada partida.
4. Acertou? O bug vira cristais e abre uma carta explicando o conceito.
5. Botões: **Conferir** (diário com as palavras já acertadas e o contador "X de 16 palavras"), **Reiniciar** e **Pausa**.
6. **Grimório**: cartas de estudo dos 16 conceitos. **Selo Rúnico**: a cruzadinha clássica (digite as letras, **Conferir**, **Reiniciar**; letras podem ser compradas com cristais).

## As 16 palavras e suas pistas
| # | Palavra | Categoria | Pista |
|---|---------|-----------|-------|
| 1 | CPU | Processador | O cérebro do computador, executa as instruções dos programas. |
| 2 | ULA | Processador | Parte da CPU que faz as contas e as operações lógicas. |
| 3 | UC (Unidade de Controle) | Processador | Parte da CPU que comanda o que cada componente deve fazer. |
| 4 | Registradores | Processador | Minúsculas memórias dentro do processador, rapidíssimas, guardam dados do momento. |
| 5 | RAM | Memória | Memória principal e volátil onde ficam os programas em uso. |
| 6 | ROM | Memória | Memória que só é lida e não perde os dados sem energia. |
| 7 | EEPROM | Memória | Memória não volátil que pode ser regravada byte a byte, sem sair da placa. |
| 8 | Flash | Memória | Memória não volátil usada em pen drives e cartões SD. |
| 9 | Cache | Memória | Memória pequena e veloz perto da CPU, guarda o que é muito usado. |
| 10 | Memória de massa (armazenamento) | Memória | Onde seus arquivos ficam de forma permanente, como no HD ou SSD. |
| 11 | DMA | Transferência | Deixa dispositivos trocarem dados com a RAM sem incomodar a CPU. |
| 12 | Address bus (barramento de endereço) | Transferência | Caminho que indica qual posição da memória será lida ou escrita. |
| 13 | Data bus (barramento de dados) | Transferência | Caminho de ida e volta por onde o conteúdo viaja entre os componentes. |
| 14 | Microcontrolador | Sistemas | Chip pequeno que junta processador, memória e portas, usado em aparelhos embarcados. |
| 15 | Dual core | Sistemas | Processador com dois núcleos trabalhando juntos. |
| 16 | Quad core | Sistemas | Processador com quatro núcleos trabalhando juntos. |

## Arquivos
`index.html` · `style.css` · `dados.js` (palavras, pistas, dicas) · `arena.js` (jogo) · `cenario.js`, `personagens.js`, `efeitos.js` (arte e animações em canvas) · `som.js` (áudio sintetizado) · `telas.js`, `grimorio.js`, `selo.js`, `script.js`.
