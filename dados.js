// =====================================================
// DADOS DO JOGO - Lumia e o Abismo dos Circuitos
// Aqui ficam as 16 palavras, as pistas, as dicas e o tabuleiro da cruzadinha.
// =====================================================

// Categorias (servem para escolher bugs "parecidos" na Arena e para filtrar no Grimório)
var categorias = {
  processador:   { nome: "Processador",   icone: "🧠", cor: "#d8344a" },
  memoria:       { nome: "Memória",       icone: "💾", cor: "#1fa8a0" },
  transferencia: { nome: "Transferência", icone: "🔀", cor: "#e0a52c" },
  sistemas:      { nome: "Sistemas",      icone: "⚙️", cor: "#8a63d2" }
};

// Cada palavra tem:
//   nome        -> como aparece no jogo
//   curto       -> versão curta para caber na plaquinha do bug
//   resposta    -> grafia da atividade (maiúsculas, sem acento, sem espaço)
//   categoria   -> uma das categorias acima
//   pistas      -> 3 pistas (até 15 palavras, sem entregar a resposta)
//   dicas       -> 3 dicas que ficam mais fortes (NUNCA dizem a resposta)
//   explicacao  -> aparece depois que o jogador acerta
var palavras = [
  {
    nome: "CPU", curto: "CPU", resposta: "CPU", categoria: "processador",
    pistas: [
      "O cérebro do computador, executa as instruções dos programas.",
      "Chip principal que busca, interpreta e executa instruções.",
      "Reúne ULA, UC e registradores em um só componente."
    ],
    dicas: [
      "Pense no 'chefe' que manda em todo o computador.",
      "Tem três partes: uma calcula, uma controla e outra guarda dados rápidos.",
      "Sigla de 3 letras que começa com C."
    ],
    explicacao: "CPU significa Unidade Central de Processamento. Ela é formada pela ULA, pela UC e pelos registradores."
  },
  {
    nome: "ULA", curto: "ULA", resposta: "ULA", categoria: "processador",
    pistas: [
      "Parte da CPU que faz as contas e as operações lógicas.",
      "Faz somas, subtrações e comparações dentro do processador.",
      "Calcula e decide operações lógicas, como E e OU."
    ],
    dicas: [
      "Pense na 'calculadora' que fica dentro do processador.",
      "Além de somar e subtrair, ela compara valores: maior, menor, igual.",
      "Sigla de 3 letras que começa com U."
    ],
    explicacao: "ULA é a Unidade Lógica e Aritmética. Ela faz somas, subtrações, comparações e operações lógicas."
  },
  {
    nome: "UC (Unidade de Controle)", curto: "UC", resposta: "UC", categoria: "processador",
    pistas: [
      "Parte da CPU que comanda o que cada componente deve fazer.",
      "Interpreta as instruções e coordena o trabalho dos outros componentes.",
      "Dá as ordens para a ULA e para a memória no momento certo."
    ],
    dicas: [
      "Pense num 'maestro' que dá as ordens para todo mundo.",
      "Lê cada instrução e avisa a ULA e a memória o que fazer.",
      "Sigla de só 2 letras que começa com U."
    ],
    explicacao: "A Unidade de Controle busca e interpreta as instruções e coordena os outros componentes."
  },
  {
    nome: "Registradores", curto: "Registradores", resposta: "REGISTRADORES", categoria: "processador",
    pistas: [
      "Minúsculas memórias dentro do processador, rapidíssimas, guardam dados do momento.",
      "Os armazenadores mais velozes de todos, ficam dentro da CPU.",
      "Guardam operandos e resultados temporários durante cada instrução."
    ],
    dicas: [
      "Pense em 'gavetinhas' minúsculas dentro do processador.",
      "São as memórias mais rápidas de todas, mas guardam pouquíssimo.",
      "Palavra no plural, com 13 letras, que começa com R."
    ],
    explicacao: "São as memórias mais rápidas do computador e ficam dentro da CPU. Guardam dados e resultados do momento."
  },
  {
    nome: "RAM", curto: "RAM", resposta: "RAM", categoria: "memoria",
    pistas: [
      "Memória principal e volátil onde ficam os programas em uso.",
      "Perde todo o conteúdo quando a energia acaba; guarda o que está rodando.",
      "Memória de trabalho do computador, de leitura e escrita rápidas."
    ],
    dicas: [
      "Pense na 'mesa de trabalho' do computador.",
      "Quando o computador desliga, tudo o que estava nela some.",
      "Sigla de 3 letras que começa com R e termina com M."
    ],
    explicacao: "RAM é a memória de acesso aleatório. Ela é volátil: quando o computador desliga, tudo é perdido."
  },
  {
    nome: "ROM", curto: "ROM", resposta: "ROM", categoria: "memoria",
    pistas: [
      "Memória que só é lida e não perde os dados sem energia.",
      "Guarda o programa de inicialização e só pode ser consultada.",
      "Conteúdo gravado de fábrica, apenas lido, sem regravar no uso comum."
    ],
    dicas: [
      "Pense num 'livro' que você só pode ler, não escrever.",
      "Guarda o programa que liga o computador e não some sem energia.",
      "Sigla de 3 letras que começa com R e tem O no meio."
    ],
    explicacao: "ROM é a memória somente de leitura. Ela é não volátil e guarda programas fixos, como os de inicialização."
  },
  {
    nome: "EEPROM", curto: "EEPROM", resposta: "EEPROM", categoria: "memoria",
    pistas: [
      "Memória não volátil que pode ser regravada byte a byte, sem sair da placa.",
      "Pode ser alterada pelo próprio circuito, sem retirar o chip da placa.",
      "Guarda configurações que mudam pouco e sobrevivem ao desligamento, regravável byte a byte."
    ],
    dicas: [
      "Pense numa ROM que aprendeu a ser apagada e regravada.",
      "O apagamento é feito com eletricidade, sem tirar o chip da placa.",
      "Sigla de 6 letras que começa com EE."
    ],
    explicacao: "EEPROM é uma ROM programável e apagável eletricamente. Dá para regravar sem tirar o chip da placa."
  },
  {
    nome: "Flash", curto: "Flash", resposta: "FLASH", categoria: "memoria",
    pistas: [
      "Memória não volátil usada em pen drives e cartões SD.",
      "Apagada em blocos, é rápida e está em SSDs e celulares.",
      "Memória sem partes móveis que mantém dados sem energia, comum em portáteis."
    ],
    dicas: [
      "Pense no que existe dentro de pen drives e cartões SD.",
      "Apaga e grava dados em blocos, sem nenhuma peça girando.",
      "Palavra em inglês de 5 letras que começa com F."
    ],
    explicacao: "A memória Flash é parecida com a EEPROM, mas é apagada em blocos. Por isso é rápida e barata."
  },
  {
    nome: "Cache", curto: "Cache", resposta: "CACHE", categoria: "memoria",
    pistas: [
      "Memória pequena e veloz perto da CPU, guarda o que é muito usado.",
      "Fica entre o processador e a memória principal para acelerar acessos.",
      "Guarda cópias de dados repetidos para a CPU não esperar."
    ],
    dicas: [
      "Pense num 'atalho' guardado pertinho da CPU.",
      "Guarda o que é muito usado para a CPU não esperar pela RAM.",
      "Palavra de 5 letras que começa com C."
    ],
    explicacao: "A cache fica entre a CPU e a RAM. Ela deixa o acesso aos dados mais usados bem mais rápido."
  },
  {
    nome: "Memória de massa (armazenamento)", curto: "Memória de massa", resposta: "MEMORIADEMASSA", categoria: "memoria",
    pistas: [
      "Onde seus arquivos ficam de forma permanente, como no HD ou SSD.",
      "Grande capacidade e permanente, porém mais lenta que a RAM.",
      "Guarda sistema, fotos e programas mesmo com o computador desligado."
    ],
    dicas: [
      "Pense no 'armário' onde seus arquivos ficam guardados para sempre.",
      "HD e SSD são exemplos; é enorme, permanente e mais lenta que a RAM.",
      "O nome tem 3 palavras e começa com 'Memória'."
    ],
    explicacao: "É a memória de grande capacidade e não volátil, como HD e SSD. É mais lenta que a RAM."
  },
  {
    nome: "DMA", curto: "DMA", resposta: "DMA", categoria: "transferencia",
    pistas: [
      "Deixa dispositivos trocarem dados com a RAM sem incomodar a CPU.",
      "Controlador que move dados entre periféricos e a RAM sozinho, poupando a CPU.",
      "Evita que a CPU fique ocupada copiando dados de um dispositivo para outro."
    ],
    dicas: [
      "Pense num 'atalho' que liga os dispositivos direto à memória.",
      "Deixa a CPU livre para outras tarefas enquanto os dados são copiados.",
      "Sigla de 3 letras que começa com D."
    ],
    explicacao: "DMA é o Acesso Direto à Memória. A CPU fica livre para fazer outras tarefas enquanto os dados são transferidos."
  },
  {
    nome: "Address bus (barramento de endereço)", curto: "Address bus", resposta: "ADDRESSBUS", categoria: "transferencia",
    pistas: [
      "Caminho que indica qual posição da memória será lida ou escrita.",
      "Só vai em um sentido: leva da CPU o local do acesso.",
      "Por ele a CPU informa onde o dado está ou deve ficar."
    ],
    dicas: [
      "Pense no 'endereço da rua': diz ONDE a informação está.",
      "Só vai em um sentido: da CPU para a memória.",
      "Nome em inglês, com 'bus' no final, que começa com A."
    ],
    explicacao: "O barramento de endereço leva o endereço da CPU até a memória. Ele só vai em um sentido."
  },
  {
    nome: "Data bus (barramento de dados)", curto: "Data bus", resposta: "DATABUS", categoria: "transferencia",
    pistas: [
      "Caminho de ida e volta por onde o conteúdo viaja entre os componentes.",
      "Funciona nos dois sentidos, levando valores lidos ou gravados.",
      "Por ele trafega a informação em si entre CPU e periféricos."
    ],
    dicas: [
      "Pense numa 'estrada de duas mãos' que leva o conteúdo.",
      "Funciona nos dois sentidos: serve para ler e para gravar.",
      "Nome em inglês, com 'bus' no final, que começa com D."
    ],
    explicacao: "O barramento de dados transporta os dados e funciona nos dois sentidos: lê e escreve."
  },
  {
    nome: "Microcontrolador", curto: "Microcontrolador", resposta: "MICROCONTROLADOR", categoria: "sistemas",
    pistas: [
      "Chip pequeno que junta processador, memória e portas, usado em aparelhos embarcados.",
      "Computador completo num só chip, comum em placas como o Arduino.",
      "Pequeno circuito que roda um programa fixo em eletrodomésticos e carros."
    ],
    dicas: [
      "Pense num computador inteiro dentro de um chip minúsculo.",
      "Está em eletrodomésticos, carros e em placas como o Arduino.",
      "Palavra de 16 letras que começa com M."
    ],
    explicacao: "É um computador inteiro em um só chip. Aparece em eletrodomésticos, carros e placas como o Arduino."
  },
  {
    nome: "Dual core", curto: "Dual core", resposta: "DUALCORE", categoria: "sistemas",
    pistas: [
      "Processador com dois núcleos trabalhando juntos.",
      "Dois núcleos permitem fazer duas tarefas ao mesmo tempo.",
      "Nome do processador que traz um par de núcleos."
    ],
    dicas: [
      "Pense em um processador com uma 'dupla' de núcleos.",
      "Consegue fazer duas tarefas ao mesmo tempo.",
      "Nome em inglês que começa com D e termina com 'core'."
    ],
    explicacao: "Dual core quer dizer dois núcleos. Eles podem executar duas tarefas ao mesmo tempo."
  },
  {
    nome: "Quad core", curto: "Quad core", resposta: "QUADCORE", categoria: "sistemas",
    pistas: [
      "Processador com quatro núcleos trabalhando juntos.",
      "Quatro núcleos permitem quatro tarefas ao mesmo tempo.",
      "Nome do processador que traz quatro núcleos."
    ],
    dicas: [
      "Pense em um processador com um 'quarteto' de núcleos.",
      "Consegue fazer quatro tarefas ao mesmo tempo.",
      "Nome em inglês que começa com Q e termina com 'core'."
    ],
    explicacao: "Quad core quer dizer quatro núcleos. Dá para executar até quatro tarefas ao mesmo tempo."
  }
];

// Procura o índice de uma palavra pela resposta (ex.: "RAM" -> 4)
function indiceDaResposta(resposta) {
  for (var i = 0; i < palavras.length; i++) {
    if (palavras[i].resposta == resposta) {
      return i;
    }
  }
  return -1;
}

// Tabuleiro da cruzadinha (Selo Rúnico): 16 palavras, todas cruzadas.
// p = palavra, r = linha onde começa, c = coluna onde começa, d = H (horizontal) ou V (vertical)
var tabuleiro = {
  linhas: 16,
  colunas: 13,
  palavras: [
    { p: "REGISTRADORES",    r: 8,  c: 0,  d: "H" },
    { p: "MICROCONTROLADOR", r: 0,  c: 5,  d: "V" },
    { p: "MEMORIADEMASSA",   r: 1,  c: 8,  d: "V" },
    { p: "ADDRESSBUS",       r: 13, c: 3,  d: "H" },
    { p: "DATABUS",          r: 2,  c: 12, d: "V" },
    { p: "QUADCORE",         r: 2,  c: 1,  d: "H" },
    { p: "DUALCORE",         r: 2,  c: 10, d: "V" },
    { p: "EEPROM",           r: 15, c: 2,  d: "H" },
    { p: "FLASH",            r: 0,  c: 3,  d: "V" },
    { p: "DMA",              r: 10, c: 7,  d: "H" },
    { p: "CACHE",            r: 4,  c: 1,  d: "V" },
    { p: "CPU",              r: 11, c: 11, d: "V" },
    { p: "ROM",              r: 6,  c: 4,  d: "H" },
    { p: "RAM",              r: 5,  c: 0,  d: "H" },
    { p: "ULA",              r: 3,  c: 10, d: "H" },
    { p: "UC",               r: 11, c: 10, d: "H" }
  ]
};

// Títulos que a Lumia ganha conforme sobe de nível (100 XP por nível)
var titulosNivel = [
  "Aprendiz da Chama",
  "Portadora da Luz",
  "Guardiã Atenta",
  "Tecelã de Circuitos",
  "Mestra da Lanterna",
  "Arquimaga dos Bits"
];

// Frases da Lumia (ela é séria, direta e um pouquinho poética)
var falasLumia = {
  hub: [
    "O Abismo dos Circuitos está escuro. Cada conceito que você aprende acende um pedacinho do Núcleo.",
    "Comece pela Arena: bugs carregam nomes, e só um deles combina com a pista.",
    "Errar não é problema. Eu sempre mostro uma dica, nunca a resposta pronta.",
    "O Grimório guarda tudo o que já enfrentamos. Vale uma visita antes da batalha.",
    "Cristais compram letras no Selo Rúnico. Ganhe-os derrotando bugs."
  ],
  acerto: [
    "A chama cresce. Bom trabalho.",
    "Certo. A luz agradece.",
    "Assim se acende um caminho.",
    "Preciso admitir: isso foi bem feito.",
    "Esse bug nem teve tempo de piscar."
  ],
  erro: [
    "A chama tremeu. Leia a dica, com calma.",
    "Ainda não. A sombra ganhou essa rodada.",
    "Respire. Cada dica nos aproxima da resposta.",
    "Errar também ilumina, se você aprender com isso."
  ],
  caminhando: [
    "Sigo a luz.",
    "Mais um degrau na escuridão.",
    "Há outro bug à frente. Eu sinto."
  ]
};

// =====================================================
// ONDAS (as fases da Arena). Cada onda é uma categoria de palavras.
// "tinta" é uma cor transparente que muda o clima do cenário em cada onda.
// =====================================================
var ondas = [
  { nome: "Cidadela do Processador", categoria: "processador", tinta: "",
    historia: "No coração do Abismo, a CPU dá as ordens. Descubra quem comanda quem." },
  { nome: "Biblioteca das Memórias", categoria: "memoria", tinta: "rgba(30,170,160,0.16)",
    historia: "Aqui cada memória guarda segredos: umas esquecem tudo, outras lembram para sempre." },
  { nome: "Estradas de Dados", categoria: "transferencia", tinta: "rgba(255,140,60,0.16)",
    historia: "Informação precisa de caminhos. Siga as estradas que ligam todas as peças." },
  { nome: "Forja dos Sistemas", categoria: "sistemas", tinta: "rgba(90,70,220,0.2)",
    historia: "Os grandes chips nascem aqui. Quantos núcleos cabem em uma máquina?" }
];

// Rótulos curtos: aparecem na plaquinha dos bugs quando a pergunta é "qual descrição combina?"
var rotulos = {
  CPU: "Cérebro do PC",
  ULA: "Faz contas e lógica",
  UC: "Dá as ordens",
  REGISTRADORES: "Gavetas na CPU",
  RAM: "Memória de trabalho",
  ROM: "Só de leitura",
  EEPROM: "Regrava byte a byte",
  FLASH: "Apaga em blocos",
  CACHE: "Atalho da CPU",
  MEMORIADEMASSA: "Guarda arquivos",
  DMA: "Copia sem a CPU",
  ADDRESSBUS: "Diz o endereço",
  DATABUS: "Leva os dados",
  MICROCONTROLADOR: "PC em um chip",
  DUALCORE: "2 núcleos",
  QUADCORE: "4 núcleos"
};

// Cor base (0 a 360) dos bugs de cada categoria
var huesCategoria = { processador: 352, memoria: 172, transferencia: 38, sistemas: 275 };

// Mais falas da Lumia
falasLumia.inicio = [
  "Leia a pista lá em cima. Só um bug carrega o nome certo.",
  "Toque no bug que combina com a pista. Eu cuido da luz.",
  "Respire. Aqui ninguém corre: pense, escolha e ataque."
];
falasLumia.combo = [
  "Sequência perfeita! A lanterna está brilhando mais.",
  "Isso é ritmo. Continue assim.",
  "Impressionante. A sombra está recuando."
];
falasLumia.ondaFim = [
  "Mais um trecho do Abismo iluminado.",
  "A luz alcança cantos que nunca vimos.",
  "Sinto o Núcleo respondendo à nossa lanterna."
];
falasLumia.dicaPedida = [
  "Uma dica não é derrota. É um atalho para entender.",
  "Escute com atenção: a dica aponta o caminho.",
  "Pedir ajuda também é uma boa estratégia."
];
