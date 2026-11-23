// =====================================================
// SCRIPT - liga tudo: tela, laço de animação, botões do menu e rotas entre telas.
// =====================================================

var tela = document.getElementById("cena");
var g = tela.getContext("2d");
var dpr = 1;
var W = 800, H = 600;
var cen = null;
var telaAtual = "titulo";
var retornoGrimorio = "titulo";
var ultimoQuadro = 0;
var tempo = 0;
var timerResize = null;

// ---------- tamanho da tela e cenário ----------
function ajustarTela() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  tela.width = Math.floor(W * dpr);
  tela.height = Math.floor(H * dpr);
  cen = cenarioCriar(W, H, dpr);
  Arena.redimensionar(W, H);
  Selo.redimensionar();
}

window.addEventListener("resize", function () {
  clearTimeout(timerResize);
  timerResize = setTimeout(ajustarTela, 160);
});

// ---------- rotas ----------
function irParaTela(nome, retorno) {
  telaAtual = nome;
  UI.tela(nome);
  if (nome == "grimorio") {
    retornoGrimorio = retorno || "titulo";
    Grimorio.abrir();
  } else if (nome == "selo") {
    Selo.abrir();
  } else if (nome == "arena") {
    Arena.layout();
  }
  somTocar("abrir");
}

function voltarDoGrimorio() {
  if (retornoGrimorio == "arena" || retornoGrimorio == "derrota") {
    var origem = retornoGrimorio;
    irParaTela("arena");
    Arena.retomar(origem);
  } else {
    irParaTela("titulo");
  }
}

// ---------- desenho da tela de título ----------
function desenharTitulo(g, t) {
  var chao = H * 0.87;
  var larga = W >= 900;
  var esc = larga ? Math.min(1.3, H / 520) : 0.7;
  var luz = 0.3 + 0.7 * (Perfil.dados.estudados.length / 16);
  desenharLumia(g, larga ? W * 0.83 : W * 0.82, chao, esc, t, { estado: "parado", luz: luz, olhos: "normal", virar: -1 });

  var bichos = larga
    ? [[1, 0.10, 0.34, 0], [2, 0.22, 0.66, 1], [0, 0.66, 0.2, 2], [3, 0.92, 0.3, 3]]
    : [[0, 0.1, 0.66, 0], [3, 0.9, 0.4, 3]];
  var chaves = ["processador", "memoria", "transferencia", "sistemas"];
  for (var i = 0; i < bichos.length; i++) {
    var b = bichos[i];
    desenharBicho(g, b[0], W * b[1], H * b[2], larga ? 0.8 : 0.55, t, huesCategoria[chaves[b[3]]], { fase: i * 2, aura: 0.35, espelho: i % 2 ? 1 : -1 });
  }
}

// ---------- laço principal ----------
function quadro(agora) {
  var dt = Math.min(0.05, (agora - ultimoQuadro) / 1000 || 0.016);
  ultimoQuadro = agora;
  tempo += dt;

  var dtJogo = UI.algumAberto() ? 0 : dt;
  Arena.atualizar(dtJogo, tempo);
  Fx.atualizar(dt);

  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  var tr = Fx.deslocamento();
  g.save();
  g.translate(tr.x, tr.y);

  var emArena = (telaAtual == "arena");
  var desloc = emArena ? Arena.A.desloc : tempo * 14;
  cenarioDesenharFundo(g, cen, tempo, desloc);
  if (emArena) {
    Arena.desenharTinta(g);
    Arena.desenharMundo(g, tempo);
  } else if (telaAtual == "titulo") {
    desenharTitulo(g, tempo);
  }
  cenarioDesenharFrente(g, cen, tempo, desloc);
  if (emArena) {
    Arena.desenharPlacas(g);
    Arena.desenharFala(g);
  }
  Fx.desenhar(g);
  g.restore();
  Fx.desenharClarao(g, W, H);

  requestAnimationFrame(quadro);
}

// ---------- entrada ----------
function posicao(ev) {
  var r = tela.getBoundingClientRect();
  return { x: ev.clientX - r.left, y: ev.clientY - r.top };
}

tela.addEventListener("pointerdown", function (ev) {
  if (telaAtual != "arena") { return; }
  var p = posicao(ev);
  Arena.mover(p.x, p.y);
  Arena.toque(p.x, p.y);
});
tela.addEventListener("pointermove", function (ev) {
  if (telaAtual != "arena") { return; }
  var p = posicao(ev);
  var i = Arena.mover(p.x, p.y);
  tela.style.cursor = i >= 0 ? "pointer" : "default";
});

document.addEventListener("keydown", function (ev) {
  if (ev.target && ev.target.id == "selo-input") { return; }
  if (telaAtual == "arena") {
    Arena.tecla(ev);
  } else if (telaAtual == "selo") {
    Selo.tecla(ev);
  } else if (ev.key == "Escape") {
    // fecha janelas abertas
    var abertos = document.querySelectorAll(".modal.aberto");
    if (abertos.length) { abertos[abertos.length - 1].classList.remove("aberto"); }
  }
});

// o navegador só deixa tocar som depois do primeiro toque
document.addEventListener("pointerdown", function primeiro() {
  document.removeEventListener("pointerdown", primeiro);
  if (somLigado) {
    somIniciar();
    musicaLigar();
  }
});

function atualizarIconeSom() {
  $("btn-som").innerHTML = iconeSvg(somLigado ? "som" : "mudo");
}

// ---------- partida ----------
function iniciarJogo() {
  somLigado = !Perfil.dados.mudo;
  iconesInjetar(document);
  atualizarIconeSom();
  UI.ligarBotoes();
  Arena.ligar();
  Selo.ligar();

  $("btn-jogar").onclick = function () { somTocar("abrir"); UI.abrir("modal-modo"); };
  $("btn-grimorio").onclick = function () { irParaTela("grimorio"); };
  $("btn-selo").onclick = function () { irParaTela("selo"); };
  $("btn-como").onclick = function () { somTocar("abrir"); UI.abrir("modal-como"); };
  $("btn-zerar").onclick = function () {
    somTocar("clique");
    UI.confirmar("Zerar o progresso?", "XP, cristais e cartas estudadas voltam ao começo.", function () {
      Perfil.zerar();
      Perfil.desenhar();
      UI.toast("Progresso zerado.");
    });
  };
  $("grim-voltar").onclick = voltarDoGrimorio;
  $("selo-voltar").onclick = function () { irParaTela("titulo"); };
  $("btn-som").onclick = function () {
    var ligado = somAlternar();
    Perfil.dados.mudo = !ligado;
    Perfil.salvar();
    atualizarIconeSom();
    if (ligado) { musicaLigar(); } else { musicaDesligar(); }
  };

  ajustarTela();
  Perfil.desenhar();
  UI.tela("titulo");
  requestAnimationFrame(quadro);
}

iniciarJogo();
