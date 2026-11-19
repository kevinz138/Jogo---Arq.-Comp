// Chipinho Faminto - Arquitetura Computacional
// Três modos: Arrastar (novo), Quiz e Estudar

// Lista das 16 palavras.
// Cada palavra tem: nome, resposta (grafia da atividade), várias pistas
// (até 15 palavras cada), 3 dicas (usadas no modo Arrastar quando o jogador erra,
// sem entregar a resposta) e uma explicação que aparece depois de acertar.
var palavras = [
  {
    nome: "CPU", resposta: "CPU",
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
    nome: "ULA", resposta: "ULA",
    pistas: [
      "Parte da CPU que faz as contas e as operações lógicas.",
      "Faz somas, subtrações e comparações dentro do processador.",
      "Calcula e decide operações lógicas, como E e OU."
    ],
    dicas: [
      "Pense na 'calculadora' que fica dentro do processador.",
      "Além de somar e subtrair, ela compara valores: maior, menor, igual.",
      "Sigla de 3 letras que começa com U; no nome aparecem 'Lógica' e 'Aritmética'."
    ],
    explicacao: "ULA é a Unidade Lógica e Aritmética. Ela faz somas, subtrações, comparações e operações lógicas."
  },
  {
    nome: "UC (Unidade de Controle)", resposta: "UC",
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
    nome: "Registradores", resposta: "REGISTRADORES",
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
    nome: "RAM", resposta: "RAM",
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
    nome: "ROM", resposta: "ROM",
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
    nome: "EEPROM", resposta: "EEPROM",
    pistas: [
      "Memória não volátil que pode ser apagada com eletricidade, byte a byte.",
      "Dá para regravar com pulsos elétricos, sem retirar o chip da placa.",
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
    nome: "Flash", resposta: "FLASH",
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
    nome: "Cache", resposta: "CACHE",
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
    nome: "Memória de massa (armazenamento)", resposta: "MEMORIADEMASSA",
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
    nome: "DMA", resposta: "DMA",
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
    nome: "Address bus (barramento de endereço)", resposta: "ADDRESSBUS",
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
    nome: "Data bus (barramento de dados)", resposta: "DATABUS",
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
    nome: "Microcontrolador", resposta: "MICROCONTROLADOR",
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
    nome: "Dual core", resposta: "DUALCORE",
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
    nome: "Quad core", resposta: "QUADCORE",
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

// ================= VARIÁVEIS GERAIS =================
var modo = "arrastar"; // qual modo está valendo: "arrastar" ou "quiz"

// Variáveis do quiz
var ordem = [];        // ordem embaralhada das perguntas
var posicao = 0;       // em qual pergunta estamos
var acertos = 0;       // quantas acertou no quiz
var opcoes = [];       // as 4 opções da pergunta atual
var tipo = "pista";    // "pista" (pista -> termo) ou "termo" (termo -> descrição)
var escolhida = -1;    // número da opção que o jogador clicou
var conferiu = false;  // true depois de clicar em Conferir

// Pegando os elementos da página (comuns)
var abaArrastar = document.getElementById("aba-arrastar");
var abaJogar = document.getElementById("aba-jogar");
var abaEstudar = document.getElementById("aba-estudar");
var telaArrastar = document.getElementById("tela-arrastar");
var telaJogar = document.getElementById("tela-jogar");
var telaEstudar = document.getElementById("tela-estudar");
var elContador = document.getElementById("contador");
var elBarriga = document.getElementById("svg-barriga");
var elChipinho = document.getElementById("chipinho");
var elFala = document.getElementById("fala");

// Elementos do quiz
var elNumero = document.getElementById("numero");
var elEnunciado = document.getElementById("enunciado");
var elPergunta = document.getElementById("pergunta");
var elOpcoes = document.getElementById("opcoes");
var elMensagem = document.getElementById("mensagem");
var elExplicacao = document.getElementById("explicacao");
var botaoConferir = document.getElementById("btn-conferir");
var botaoProxima = document.getElementById("btn-proxima");
var botaoReiniciar = document.getElementById("btn-reiniciar");
var elCartoes = document.getElementById("cartoes");

// Embaralha uma lista (sorteio de verdade a cada partida)
function embaralhar(lista) {
  for (var i = lista.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var guardado = lista[i];
    lista[i] = lista[j];
    lista[j] = guardado;
  }
  return lista;
}

// Sorteia uma das pistas de uma palavra
function sortearPista(palavra) {
  var numero = Math.floor(Math.random() * palavra.pistas.length);
  return palavra.pistas[numero];
}

// ----- Personalidade do Chipinho -----
// Ele é dramático, comilão e adora trocadilho de computador!
var frasesInicio = [
  "Minha barriga de bits tá roncando! Me alimenta com respostas! 🍽️",
  "Bom dia! Digo... bom BYTE! Tô morrendo de fome de conhecimento!",
  "Ligado e faminto! Qual será o primeiro petisco?"
];

var frasesProxima = [
  "Próxima! Meu cooler tá salivando!",
  "Mais uma, mais uma! Eu aguento até 1 terabyte!",
  "Tô com o processador a mil! Manda a próxima!",
  "Será que esse petisco é doce ou salgado? 🤔"
];

var frasesAcerto = [
  "NHAC! Que byte delicioso! 😋",
  "Hmmm, esse acerto tinha gostinho de overclock!",
  "Isso! Minha barriguinha agradece! 💗",
  "NHAM NHAM! Você cozinha bem demais!"
];

var frasesErro = [
  "Blergh! Esse bit estava podre! 🤢 Lê a explicação!",
  "Erro 404: sabor não encontrado! Mas você aprende rapidinho!",
  "Meu cooler engasgou... tudo bem, errar faz parte!",
  "Ai, deu tela azul na minha barriga! Vamos tentar de novo!"
];

// Frases só do modo Arrastar
var frasesArrastarInicio = [
  "Arraste as caixinhas até as pistas certas! Eu fico de olho aqui... 👀",
  "Hora do petisco! Encaixe cada caixinha na pista que combina!",
  "Ligado e faminto! Monta o quebra-cabeça de bits pra mim!"
];

var frasesDica = [
  "Hmm, essa caixinha não combina! Olha a dica que eu separei! 🔍",
  "Quase! Mas o sabor não bate... leia a dica com calma!",
  "Blergh, esse não é o petisco! A dica vai te ajudar! 💡",
  "Ops! Tela azul na pista. Dica chegando!"
];

var frasesRodada = [
  "Rodada completa! NHAC NHAC! Vem a próxima bandeja!",
  "Que banquete! Minha barriguinha tá crescendo! 💗",
  "Mais quatro petiscos pra conta! Bora pra próxima!"
];

// Sorteia uma frase da lista
function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Muda o rosto do Chipinho: normal, feliz ou triste
function mudarHumor(humor) {
  elChipinho.setAttribute("class", humor);
}

// Faz o Chipinho falar
function dizer(texto) {
  elFala.textContent = texto;
}

// Muda o rosto de novo mesmo se for igual ao anterior (reinicia a animação)
function mudarHumorDeNovo(humor) {
  mudarHumor("normal");
  elChipinho.getBoundingClientRect(); // truque para o navegador "perceber" a troca
  mudarHumor(humor);
}

// Atualiza contador e a barriga do Chipinho (de acordo com o modo ativo)
function atualizarPlacar() {
  var total = palavras.length;
  var pontos = acertos;
  if (modo == "arrastar") {
    pontos = acertosA;
  }

  elContador.textContent = pontos + " de " + total + " palavras";

  // a barriga enche com os acertos (largura máxima = 64)
  var largura = (pontos / total) * 64;
  elBarriga.setAttribute("width", largura);
}

// ================= MODO QUIZ (o que já existia) =================

// Mostra uma pergunta nova
function mostrarPergunta() {
  var indiceCerto = ordem[posicao];
  var certa = palavras[indiceCerto];

  // sorteia o tipo da pergunta
  if (Math.random() < 0.5) {
    tipo = "pista";
  } else {
    tipo = "termo";
  }

  // sorteia 3 palavras erradas
  var outras = [];
  for (var i = 0; i < palavras.length; i++) {
    if (i != indiceCerto) {
      outras.push(i);
    }
  }
  outras = embaralhar(outras);

  // monta as 4 opções (guarda o índice da palavra e o texto)
  var indices = embaralhar([indiceCerto, outras[0], outras[1], outras[2]]);
  opcoes = [];
  for (var k = 0; k < indices.length; k++) {
    var p = palavras[indices[k]];
    var texto = "";
    if (tipo == "pista") {
      texto = p.nome;
    } else {
      texto = sortearPista(p);
    }
    opcoes.push({ indice: indices[k], texto: texto });
  }

  escolhida = -1;
  conferiu = false;

  elNumero.textContent = "Pergunta " + (posicao + 1) + " de " + palavras.length;

  if (tipo == "pista") {
    elEnunciado.textContent = "Qual termo combina com esta pista?";
    elPergunta.textContent = sortearPista(certa);
  } else {
    elEnunciado.textContent = "Qual descrição combina com este termo?";
    elPergunta.textContent = certa.nome;
  }

  elMensagem.textContent = "";
  elExplicacao.style.display = "none";
  botaoProxima.style.display = "none";
  botaoConferir.style.display = "inline-block";

  // o Chipinho volta ao normal e comenta a pergunta nova
  mudarHumor("normal");
  if (posicao == 0) {
    dizer(sortear(frasesInicio));
  } else {
    dizer(sortear(frasesProxima));
  }

  // cria os botões das opções
  elOpcoes.innerHTML = "";
  for (var m = 0; m < opcoes.length; m++) {
    var botao = document.createElement("button");
    botao.textContent = opcoes[m].texto;
    botao.id = "opcao-" + m;
    botao.onclick = function () {
      escolher(this.id);
    };
    elOpcoes.appendChild(botao);
  }

  atualizarPlacar();
}

// Quando o jogador clica numa opção
function escolher(id) {
  if (conferiu) {
    return;
  }

  escolhida = Number(id.replace("opcao-", ""));

  for (var i = 0; i < opcoes.length; i++) {
    document.getElementById("opcao-" + i).className = "";
  }
  document.getElementById("opcao-" + escolhida).className = "selecionada";
  elMensagem.textContent = "";
}

// Botão Conferir do quiz
function conferir() {
  if (conferiu) {
    return;
  }

  if (escolhida == -1) {
    elMensagem.textContent = "Escolha uma opção primeiro.";
    return;
  }

  conferiu = true;

  var indiceCerto = ordem[posicao];
  var certa = palavras[indiceCerto];

  // marca a opção certa de verde
  for (var i = 0; i < opcoes.length; i++) {
    if (opcoes[i].indice == indiceCerto) {
      document.getElementById("opcao-" + i).className = "certa";
    }
  }

  if (opcoes[escolhida].indice == indiceCerto) {
    acertos++;
    elMensagem.textContent = "Acertou!";
    mudarHumor("feliz");
    dizer(sortear(frasesAcerto));
  } else {
    document.getElementById("opcao-" + escolhida).className = "errada";
    elMensagem.textContent = "Errou. A certa está em verde.";
    mudarHumor("triste");
    dizer(sortear(frasesErro));
  }

  // explicação para ajudar a estudar
  elExplicacao.textContent = certa.nome + ": " + certa.explicacao;
  elExplicacao.style.display = "block";

  botaoConferir.style.display = "none";

  if (posicao == palavras.length - 1) {
    mostrarFim();
  } else {
    botaoProxima.style.display = "inline-block";
  }

  atualizarPlacar();
}

// Botão Próxima do quiz
function proxima() {
  posicao++;
  mostrarPergunta();
}

// Mensagem final do quiz
function mostrarFim() {
  var total = palavras.length;
  var texto = "Fim! Você acertou " + acertos + " de " + total + " palavras. ";

  if (acertos == total) {
    texto = texto + "Perfeito!";
  } else if (acertos >= 12) {
    texto = texto + "Muito bem, falta pouco!";
  } else {
    texto = texto + "Veja a aba Estudar e tente de novo.";
  }

  elMensagem.textContent = texto;

  // fala final do Chipinho
  if (acertos == total) {
    mudarHumor("feliz");
    dizer("BARRIGA CHEIA! 16 petiscos deliciosos! Você é meu chef favorito! 🎉");
  } else if (acertos >= 12) {
    dizer("Quase estourei de tão cheio! Só faltou uma sobremesa! 🍰");
  } else {
    dizer("Ainda tô com fominha... Dá uma olhada na aba Estudar e volta! 📖");
  }
}

// Botão Reiniciar do quiz: sorteia tudo de novo
function reiniciar() {
  var numeros = [];
  for (var i = 0; i < palavras.length; i++) {
    numeros.push(i);
  }
  ordem = embaralhar(numeros);
  posicao = 0;
  acertos = 0;
  mostrarPergunta();
}

// ================= MODO ARRASTAR (novo) =================

var porRodada = 4;                                 // pistas por rodada
var totalRodadas = palavras.length / porRodada;    // 16 / 4 = 4 rodadas

var ordemA = [];          // ordem embaralhada das 16 palavras
var rodadaA = 0;          // rodada atual (0 a 3)
var acertosA = 0;         // quantas palavras já foram encaixadas certo
var dePrimeira = 0;       // acertos sem precisar de dica
var errosPalavra = [];    // quantas vezes cada palavra recebeu dica
var rodadaTerminou = false;

// Variáveis do arrasto
var caixaSelecionada = null; // caixinha escolhida por toque
var caixaArrastada = null;   // caixinha sendo arrastada agora
var fantasma = null;         // cópia que acompanha o mouse/dedo
var moveu = false;           // true se o jogador realmente arrastou
var inicioX = 0;
var inicioY = 0;
var deslocX = 0;
var deslocY = 0;
var larguraFantasma = 0;

// Elementos do modo Arrastar
var elRodadaInfo = document.getElementById("rodada-info");
var elAlvos = document.getElementById("alvos");
var elBandeja = document.getElementById("bandeja");
var elDetalhes = document.getElementById("detalhes-conteudo");
var elPrimeira = document.getElementById("acertos-primeira");
var botaoConferirA = document.getElementById("btn-conferir-a");
var botaoProximaA = document.getElementById("btn-proxima-a");
var botaoReiniciarA = document.getElementById("btn-reiniciar-a");

// Escreve na caixa de detalhes
function mostrarDetalhes(html, rolar) {
  elDetalhes.innerHTML = html;
  if (rolar) {
    // garante que o jogador veja a caixa (importante no celular)
    document.getElementById("detalhes").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function detalhesIniciais() {
  mostrarDetalhes(
    "<p>Arraste cada caixinha até a pista que combina e clique em <b>Conferir</b>.</p>" +
    "<p>Se errar, eu <b>não</b> mostro a resposta: aparece uma <b>dica</b> aqui. " +
    "Se acertar, você vê a explicação do conceito. 😉</p>",
    false
  );
}

// Começa o modo Arrastar do zero (sorteia tudo)
function iniciarArrastar() {
  var numeros = [];
  errosPalavra = [];
  for (var i = 0; i < palavras.length; i++) {
    numeros.push(i);
    errosPalavra.push(0);
  }
  ordemA = embaralhar(numeros);
  rodadaA = 0;
  acertosA = 0;
  dePrimeira = 0;

  novaRodadaA();
  detalhesIniciais();
  mudarHumor("normal");
  dizer(sortear(frasesArrastarInicio));
}

// Monta uma rodada nova: 4 pistas + 4 caixinhas
function novaRodadaA() {
  rodadaTerminou = false;
  limparSelecao();
  elAlvos.innerHTML = "";
  elBandeja.innerHTML = "";

  var inicio = rodadaA * porRodada;
  var indices = [];
  for (var i = 0; i < porRodada; i++) {
    indices.push(ordemA[inicio + i]);
  }

  // as pistas (alvos)
  for (var a = 0; a < indices.length; a++) {
    criarAlvo(indices[a], a + 1);
  }

  // as caixinhas, em ordem embaralhada
  var ordemCaixas = embaralhar(indices.slice());
  for (var c = 0; c < ordemCaixas.length; c++) {
    criarCaixinha(ordemCaixas[c], c);
  }

  elRodadaInfo.textContent = "Rodada " + (rodadaA + 1) + " de " + totalRodadas;
  botaoConferirA.style.display = "inline-block";
  botaoProximaA.style.display = "none";
  atualizarPlacar();
  atualizarPrimeira();
}

function atualizarPrimeira() {
  elPrimeira.textContent = "De primeira (sem dicas): " + dePrimeira;
}

// Cria um cartão de pista com o espaço para encaixar
function criarAlvo(indice, numeroNaTela) {
  var alvo = document.createElement("div");
  alvo.className = "alvo";
  alvo.setAttribute("data-indice", indice);
  alvo.setAttribute("tabindex", "0");

  var numero = document.createElement("span");
  numero.className = "num-alvo";
  numero.textContent = numeroNaTela;

  var texto = document.createElement("p");
  texto.className = "texto-alvo";
  texto.textContent = sortearPista(palavras[indice]);

  var encaixe = document.createElement("div");
  encaixe.className = "encaixe";

  alvo.appendChild(numero);
  alvo.appendChild(texto);
  alvo.appendChild(encaixe);

  alvo.onclick = function () {
    clicouAlvo(this);
  };
  alvo.onkeydown = function (evento) {
    if (evento.key == "Enter" || evento.key == " ") {
      evento.preventDefault();
      clicouAlvo(this);
    }
  };

  elAlvos.appendChild(alvo);
}

// Cria uma caixinha com o nome do termo
function criarCaixinha(indice, posicaoCor) {
  var caixa = document.createElement("div");
  caixa.className = "caixinha cor" + (posicaoCor % 4);
  caixa.textContent = palavras[indice].nome;
  caixa.setAttribute("data-indice", indice);
  caixa.setAttribute("tabindex", "0");
  caixa.setAttribute("role", "button");

  caixa.onpointerdown = comecarArrasto;
  caixa.onclick = function (evento) {
    evento.stopPropagation(); // não deixa o clique "vazar" para a pista
  };
  caixa.onkeydown = function (evento) {
    if (evento.key == "Enter" || evento.key == " ") {
      evento.preventDefault();
      evento.stopPropagation();
      selecionarCaixa(this);
    }
  };

  elBandeja.appendChild(caixa);
}

// ----- Selecionar por toque (alternativa ao arrastar) -----
function limparSelecao() {
  if (caixaSelecionada != null) {
    caixaSelecionada.classList.remove("selecionada");
  }
  caixaSelecionada = null;
}

function selecionarCaixa(caixa) {
  if (caixa.classList.contains("travada") || rodadaTerminou) {
    return;
  }
  if (caixaSelecionada == caixa) {
    limparSelecao();
    return;
  }
  limparSelecao();
  caixaSelecionada = caixa;
  caixa.classList.add("selecionada");
  dizer("Agora toque na pista que combina com essa caixinha! 👆");
}

function clicouAlvo(alvo) {
  if (caixaSelecionada != null && !rodadaTerminou) {
    colocar(caixaSelecionada, alvo);
    limparSelecao();
  }
}

elBandeja.onclick = function () {
  if (caixaSelecionada != null && !rodadaTerminou) {
    colocar(caixaSelecionada, elBandeja);
    limparSelecao();
  }
};

elBandeja.onkeydown = function (evento) {
  if ((evento.key == "Enter" || evento.key == " ") && caixaSelecionada != null) {
    evento.preventDefault();
    colocar(caixaSelecionada, elBandeja);
    limparSelecao();
  }
};

// ----- Arrastar com mouse ou dedo -----
function comecarArrasto(evento) {
  var caixa = evento.currentTarget;

  if (caixa.classList.contains("travada") || rodadaTerminou) {
    return;
  }
  if (evento.pointerType == "mouse" && evento.button != 0) {
    return; // só o botão esquerdo do mouse
  }

  caixaArrastada = caixa;
  moveu = false;
  inicioX = evento.clientX;
  inicioY = evento.clientY;

  var retangulo = caixa.getBoundingClientRect();
  deslocX = evento.clientX - retangulo.left;
  deslocY = evento.clientY - retangulo.top;
  larguraFantasma = retangulo.width;

  evento.preventDefault();
}

// Descobre qual pista (ou a bandeja) está embaixo do mouse/dedo
function acharLugar(x, y) {
  var elemento = document.elementFromPoint(x, y);
  while (elemento != null && elemento != document.body) {
    if (elemento.classList.contains("alvo") || elemento.id == "bandeja") {
      return elemento;
    }
    elemento = elemento.parentElement;
  }
  return null;
}

function limparDestaques() {
  var destacados = document.querySelectorAll(".destaque");
  for (var i = 0; i < destacados.length; i++) {
    destacados[i].classList.remove("destaque");
  }
}

function removerFantasma() {
  if (fantasma != null) {
    document.body.removeChild(fantasma);
    fantasma = null;
  }
  if (caixaArrastada != null) {
    caixaArrastada.classList.remove("arrastando");
  }
  limparDestaques();
}

document.onpointermove = function (evento) {
  if (caixaArrastada == null) {
    return;
  }

  var dx = evento.clientX - inicioX;
  var dy = evento.clientY - inicioY;

  // só começa a arrastar depois de mexer um pouquinho (senão é um toque)
  if (!moveu) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
      return;
    }
    moveu = true;
    limparSelecao();
    fantasma = caixaArrastada.cloneNode(true);
    fantasma.classList.add("fantasma");
    fantasma.style.width = larguraFantasma + "px";
    document.body.appendChild(fantasma);
    caixaArrastada.classList.add("arrastando");
  }

  fantasma.style.left = (evento.clientX - deslocX) + "px";
  fantasma.style.top = (evento.clientY - deslocY) + "px";

  // destaca o lugar onde vai soltar
  limparDestaques();
  var lugar = acharLugar(evento.clientX, evento.clientY);
  if (lugar != null && !lugar.classList.contains("certa")) {
    lugar.classList.add("destaque");
  }

  // rola a página se chegar perto da borda
  if (evento.clientY < 70) {
    window.scrollBy(0, -12);
  } else if (evento.clientY > window.innerHeight - 70) {
    window.scrollBy(0, 12);
  }
};

document.onpointerup = function (evento) {
  if (caixaArrastada == null) {
    return;
  }

  var caixa = caixaArrastada;

  // se não mexeu, foi só um toque: seleciona a caixinha
  if (!moveu) {
    caixaArrastada = null;
    selecionarCaixa(caixa);
    return;
  }

  var lugar = acharLugar(evento.clientX, evento.clientY);
  removerFantasma();
  caixaArrastada = null;

  if (lugar != null) {
    colocar(caixa, lugar);
  }
};

document.onpointercancel = function () {
  removerFantasma();
  caixaArrastada = null;
};

// Coloca a caixinha numa pista (ou devolve para a bandeja)
function colocar(caixa, lugar) {
  var origem = caixa.parentElement;

  if (lugar.id == "bandeja") {
    elBandeja.appendChild(caixa);
    return;
  }

  if (lugar.classList.contains("certa")) {
    return; // essa pista já está resolvida
  }

  var encaixe = lugar.querySelector(".encaixe");
  var ocupante = encaixe.firstElementChild;

  // se já tinha outra caixinha, ela troca de lugar com a que veio
  if (ocupante != null && ocupante != caixa) {
    origem.appendChild(ocupante);
  }
  encaixe.appendChild(caixa);
}

// ----- Conferir (modo Arrastar) -----
function blocoCerto(numeroPista, indice) {
  return '<div class="bloco certo"><b>✅ Pista ' + numeroPista + ' — ' + palavras[indice].nome + '</b>' +
         '<p>' + palavras[indice].explicacao + '</p></div>';
}

// A dica NUNCA diz qual é a resposta; só vai ficando mais detalhada
function blocoDica(numeroPista, indice) {
  var nivel = errosPalavra[indice];
  if (nivel > 3) {
    nivel = 3;
  }

  var lista = "";
  for (var i = 0; i < nivel; i++) {
    var classe = "";
    if (i == nivel - 1) {
      classe = ' class="nova"';
    }
    lista += "<li" + classe + ">" + palavras[indice].dicas[i] + "</li>";
  }

  var html = '<div class="bloco"><b>🔍 Pista ' + numeroPista + ' — essa caixinha não combina. Dica ' + nivel + ' de 3</b>' +
             "<ul>" + lista + "</ul>";

  if (errosPalavra[indice] > 3) {
    html += "<p>Já mostrei todas as dicas dessa pista. Releia com calma e compare com as outras caixinhas!</p>";
  }

  return html + "</div>";
}

function devolverComErro(caixa, alvo) {
  elBandeja.appendChild(caixa);
  caixa.classList.add("volta");
  alvo.classList.add("errou");
  setTimeout(function () {
    caixa.classList.remove("volta");
    alvo.classList.remove("errou");
  }, 500);
}

function conferirA() {
  if (rodadaTerminou) {
    return;
  }
  limparSelecao();

  var alvos = elAlvos.children;
  var blocos = "";
  var preenchidos = 0;
  var certasAgora = 0;
  var erradasAgora = 0;

  for (var i = 0; i < alvos.length; i++) {
    var alvo = alvos[i];

    if (alvo.classList.contains("certa")) {
      continue; // já estava certa
    }

    var caixa = alvo.querySelector(".encaixe").firstElementChild;
    if (caixa == null) {
      continue; // nada encaixado nessa pista
    }

    preenchidos++;
    var indiceAlvo = Number(alvo.getAttribute("data-indice"));
    var indiceCaixa = Number(caixa.getAttribute("data-indice"));

    if (indiceAlvo == indiceCaixa) {
      alvo.classList.add("certa");
      caixa.classList.add("travada");
      acertosA++;
      certasAgora++;
      if (errosPalavra[indiceAlvo] == 0) {
        dePrimeira++;
      }
      blocos += blocoCerto(i + 1, indiceAlvo);
    } else {
      errosPalavra[indiceAlvo]++;
      erradasAgora++;
      devolverComErro(caixa, alvo);
      blocos += blocoDica(i + 1, indiceAlvo);
    }
  }

  // nenhuma caixinha foi encaixada ainda
  if (preenchidos == 0) {
    mostrarDetalhes("<p>Ainda não tem caixinha nas pistas! Arraste uma até a pista que combina e clique em Conferir. 🙂</p>", true);
    dizer("Minha barriga tá vazia... arrasta uma caixinha pra uma pista! 🍽️");
    return;
  }

  // resumo + blocos
  var resumo = "";
  if (erradasAgora == 0) {
    resumo = "<p><b>Tudo certo nessa conferência!</b> Leia a explicação:</p>";
  } else {
    resumo = "<p><b>Acertou " + certasAgora + " e errou " + erradasAgora + ".</b> " +
             "As caixinhas erradas voltaram para a bandeja. Use as dicas (não mostro a resposta!):</p>";
  }
  mostrarDetalhes(resumo + blocos, true);

  // reação do Chipinho
  if (erradasAgora == 0) {
    mudarHumorDeNovo("feliz");
    dizer(sortear(frasesAcerto));
  } else if (certasAgora == 0) {
    mudarHumorDeNovo("triste");
    dizer(sortear(frasesDica));
  } else {
    mudarHumorDeNovo("normal");
    dizer("Alguns petiscos estavam ótimos! Nos outros, leia as dicas. 🔍");
  }

  atualizarPlacar();
  atualizarPrimeira();
  verificarRodada();
}

// Vê se a rodada acabou (as 4 pistas certas)
function verificarRodada() {
  var certas = elAlvos.querySelectorAll(".alvo.certa").length;
  if (certas < porRodada) {
    return;
  }

  rodadaTerminou = true;
  botaoConferirA.style.display = "none";

  if (rodadaA < totalRodadas - 1) {
    botaoProximaA.style.display = "inline-block";
    dizer(sortear(frasesRodada));
  } else {
    mostrarFimArrastar();
  }
}

// Botão Próxima rodada
function proximaA() {
  rodadaA++;
  novaRodadaA();
  mostrarDetalhes("<p><b>Rodada " + (rodadaA + 1) + "!</b> Leia as pistas e arraste as caixinhas até o lugar certo.</p>", false);
  mudarHumor("normal");
  dizer(sortear(frasesProxima));
}

function mostrarFimArrastar() {
  var total = palavras.length;
  var texto = "Fim de jogo! Você encaixou " + acertosA + " de " + total + " palavras, " +
              dePrimeira + " delas de primeira (sem dicas). ";

  if (dePrimeira == total) {
    texto += "Perfeito, sem nenhuma dica!";
    dizer("BARRIGA CHEIA e sem nenhuma dica! Você é meu chef favorito! 🎉");
  } else if (dePrimeira >= 12) {
    texto += "Muito bem, quase sem dicas!";
    dizer("Quase estourei de tão cheio! Só faltou uma sobremesa! 🍰");
  } else {
    texto += "Dá uma olhada na aba Estudar e tente de novo com menos dicas.";
    dizer("Barriga cheia! Mas ainda dá pra aprender mais... aba Estudar! 📖");
  }

  mudarHumorDeNovo("feliz");
  elDetalhes.innerHTML = "<p><b>🏁 " + texto + "</b></p>" + elDetalhes.innerHTML;
  document.getElementById("detalhes").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ================= MODO ESTUDAR =================
function criarCartoes() {
  elCartoes.innerHTML = "";

  for (var i = 0; i < palavras.length; i++) {
    var cartao = document.createElement("div");
    cartao.id = "cartao-" + i;
    cartao.onclick = function () {
      virarCartao(this.id);
    };
    mostrarFrente(cartao, i);
    elCartoes.appendChild(cartao);
  }
}

function mostrarFrente(cartao, i) {
  cartao.className = "cartao";
  cartao.innerHTML =
    '<div class="numero-cartao">' + (i + 1) + '</div>' +
    '<p class="texto-cartao">' + palavras[i].pistas[0] + '</p>' +
    '<p class="toque">toque para ver a resposta</p>';
}

function mostrarVerso(cartao, i) {
  cartao.className = "cartao virado";
  cartao.innerHTML =
    '<div class="numero-cartao">' + (i + 1) + '</div>' +
    '<div class="titulo-cartao">' + palavras[i].nome + '</div>' +
    '<p class="texto-cartao">' + palavras[i].explicacao + '</p>';
}

function virarCartao(id) {
  var cartao = document.getElementById(id);
  var i = Number(id.replace("cartao-", ""));

  if (cartao.className == "cartao") {
    mostrarVerso(cartao, i);
  } else {
    mostrarFrente(cartao, i);
  }
}

// ================= ABAS =================
function mostrarSoEssa(nome) {
  telaArrastar.style.display = "none";
  telaJogar.style.display = "none";
  telaEstudar.style.display = "none";
  abaArrastar.className = "";
  abaJogar.className = "";
  abaEstudar.className = "";

  if (nome == "arrastar") {
    telaArrastar.style.display = "block";
    abaArrastar.className = "ativa";
  } else if (nome == "quiz") {
    telaJogar.style.display = "block";
    abaJogar.className = "ativa";
  } else {
    telaEstudar.style.display = "block";
    abaEstudar.className = "ativa";
  }
}

function irParaArrastar() {
  mostrarSoEssa("arrastar");
  modo = "arrastar";
  atualizarPlacar();
}

function irParaJogar() {
  mostrarSoEssa("quiz");
  modo = "quiz";
  atualizarPlacar();
}

function irParaEstudar() {
  mostrarSoEssa("estudar");
}

// Ligando os botões
botaoConferir.onclick = conferir;
botaoProxima.onclick = proxima;
botaoReiniciar.onclick = reiniciar;
botaoConferirA.onclick = conferirA;
botaoProximaA.onclick = proximaA;
botaoReiniciarA.onclick = iniciarArrastar;
abaArrastar.onclick = irParaArrastar;
abaJogar.onclick = irParaJogar;
abaEstudar.onclick = irParaEstudar;

// Começa tudo (o modo Arrastar por último, para o Chipinho falar dele)
criarCartoes();
reiniciar();
iniciarArrastar();
