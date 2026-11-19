# Chipinho Faminto - Arquitetura Computacional

Jogo feito em HTML, CSS e JavaScript para treinar os termos de Arquitetura Computacional (Sprint 3). Tem três modos: **Arrastar** (caixinhas), **Quiz** e **Estudar**.

O Chipinho é um robozinho comilão, dramático e que ama trocadilho de computador. Cada resposta certa enche a barriguinha dele de bits. Quando você erra, ele fica com cara de enjoado, mas logo se recupera.

Jogue aqui: https://SEU-USUARIO.github.io/arqcomp-cruzadinha/

## Como jogar

### Aba Arrastar (principal)

1. O jogo tem 4 rodadas. Em cada uma aparecem 4 pistas e 4 caixinhas com os termos.
2. Arraste cada caixinha até a pista que combina. No celular dá para tocar na caixinha e depois tocar na pista.
3. Clique em **Conferir**. As caixinhas certas ficam verdes e travadas.
4. Se errar, a caixinha volta para a bandeja e a **Caixa de detalhes** mostra uma **dica** (nunca a resposta). A cada novo erro na mesma pista vem uma dica mais detalhada (são 3 por palavra).
5. Se acertar, a **Caixa de detalhes** explica o conceito.
6. Clique em **Próxima rodada** para continuar e acompanhe o contador (ex.: "8 de 16 palavras") e a barriga do Chipinho enchendo.
7. Clique em **Reiniciar** para sortear tudo de novo.

### Aba Quiz

1. Leia a pergunta e clique em uma das 4 opções.
2. Clique em **Conferir**. A resposta certa fica verde, a errada fica vermelha e aparece uma explicação.
3. Clique em **Próxima** para continuar e em **Reiniciar** para sortear tudo de novo.

### Aba Estudar

Há um cartão para cada termo. Clique para ver a resposta e a explicação.

## Por que não dá para decorar as respostas

A cada partida o jogo sorteia:

- a ordem das 16 palavras e quais palavras caem em cada rodada;
- qual das 3 pistas de cada palavra aparece e a posição das caixinhas;
- no Quiz, o tipo da pergunta (pista para termo, ou termo para descrição);
- no Quiz, quais são as opções erradas e a posição da certa.

As dicas do modo Arrastar ficam no arquivo `script.js` (3 por palavra, cada uma mais detalhada que a anterior).

## Palavras e pistas

Cada palavra tem 3 pistas diferentes.

| Nº | Palavra | Pistas |
|----|---------|--------|
| 1 | CPU | O cérebro do computador, executa as instruções dos programas. / Chip principal que busca, interpreta e executa instruções. / Reúne ULA, UC e registradores em um só componente. |
| 2 | ULA | Parte da CPU que faz as contas e as operações lógicas. / Faz somas, subtrações e comparações dentro do processador. / Calcula e decide operações lógicas, como E e OU. |
| 3 | UC | Parte da CPU que comanda o que cada componente deve fazer. / Interpreta as instruções e coordena o trabalho dos outros componentes. / Dá as ordens para a ULA e para a memória no momento certo. |
| 4 | REGISTRADORES | Minúsculas memórias dentro do processador, rapidíssimas, guardam dados do momento. / Os armazenadores mais velozes de todos, ficam dentro da CPU. / Guardam operandos e resultados temporários durante cada instrução. |
| 5 | RAM | Memória principal e volátil onde ficam os programas em uso. / Perde todo o conteúdo quando a energia acaba; guarda o que está rodando. / Memória de trabalho do computador, de leitura e escrita rápidas. |
| 6 | ROM | Memória que só é lida e não perde os dados sem energia. / Guarda o programa de inicialização e só pode ser consultada. / Conteúdo gravado de fábrica, apenas lido, sem regravar no uso comum. |
| 7 | EEPROM | Memória não volátil que pode ser apagada com eletricidade, byte a byte. / Dá para regravar com pulsos elétricos, sem retirar o chip da placa. / Guarda configurações que mudam pouco e sobrevivem ao desligamento, regravável byte a byte. |
| 8 | FLASH | Memória não volátil usada em pen drives e cartões SD. / Apagada em blocos, é rápida e está em SSDs e celulares. / Memória sem partes móveis que mantém dados sem energia, comum em portáteis. |
| 9 | CACHE | Memória pequena e veloz perto da CPU, guarda o que é muito usado. / Fica entre o processador e a memória principal para acelerar acessos. / Guarda cópias de dados repetidos para a CPU não esperar. |
| 10 | MEMORIADEMASSA | Onde seus arquivos ficam de forma permanente, como no HD ou SSD. / Grande capacidade e permanente, porém mais lenta que a RAM. / Guarda sistema, fotos e programas mesmo com o computador desligado. |
| 11 | DMA | Deixa dispositivos trocarem dados com a RAM sem incomodar a CPU. / Controlador que move dados entre periféricos e a RAM sozinho, poupando a CPU. / Evita que a CPU fique ocupada copiando dados de um dispositivo para outro. |
| 12 | ADDRESSBUS | Caminho que indica qual posição da memória será lida ou escrita. / Só vai em um sentido: leva da CPU o local do acesso. / Por ele a CPU informa onde o dado está ou deve ficar. |
| 13 | DATABUS | Caminho de ida e volta por onde o conteúdo viaja entre os componentes. / Funciona nos dois sentidos, levando valores lidos ou gravados. / Por ele trafega a informação em si entre CPU e periféricos. |
| 14 | MICROCONTROLADOR | Chip pequeno que junta processador, memória e portas, usado em aparelhos embarcados. / Computador completo num só chip, comum em placas como o Arduino. / Pequeno circuito que roda um programa fixo em eletrodomésticos e carros. |
| 15 | DUALCORE | Processador com dois núcleos trabalhando juntos. / Dois núcleos permitem fazer duas tarefas ao mesmo tempo. / Nome do processador que traz um par de núcleos. |
| 16 | QUADCORE | Processador com quatro núcleos trabalhando juntos. / Quatro núcleos permitem quatro tarefas ao mesmo tempo. / Nome do processador que traz quatro núcleos. |

## Tecnologias

HTML, CSS e JavaScript puros, publicado com GitHub Pages.
