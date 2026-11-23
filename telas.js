// =====================================================
// TELAS - tudo que é "interface" em volta do jogo: ícones, janelas, HUD e o perfil salvo.
// =====================================================

// ---------- Ícones (desenhos simples em SVG, para não precisar de arquivos de imagem) ----------
var iconesSvg = {
  espada: "M19 2h3v3l-9.5 9.5-3-3zM8.5 12.5l3 3-1.5 1.5 2 2-1.5 1.5-2-2-2 2-2.5-2.5 2-2-2-2 1.5-1.5 2 2z",
  livro: "M4 4h7q1 0 1 1v15q0-1-1-1H4zM20 4h-7q-1 0-1 1v15q0-1 1-1h7z",
  runa: "M12 2l8 10-8 10-8-10zM12 6.5l4.6 5.5-4.6 5.5L7.4 12z",
  cristal: "M12 2l6 6-6 14-6-14z",
  dica: "M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2zM9 20h6v2H9z",
  diario: "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6zM8 6v2h8V6zM8 10v2h8v-2zM8 14v2h5v-2z",
  reiniciar: "M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z",
  pausa: "M6 4h4v16H6zM14 4h4v16h-4z",
  som: "M3 9v6h4l5 4V5L7 9zM15 8.5a5 5 0 0 1 0 7l-1-1.2a3.4 3.4 0 0 0 0-4.6zM17.5 6a8.5 8.5 0 0 1 0 12l-1-1.2a6.9 6.9 0 0 0 0-9.6z",
  mudo: "M3 9v6h4l5 4V5L7 9zM15 9l1.2-1.2 2.3 2.3 2.3-2.3L22 9l-2.3 2.3 2.3 2.3-1.2 1.2-2.3-2.3-2.3 2.3L15 13.6l2.3-2.3z",
  voltar: "M15 4l-8 8 8 8 1.5-1.5L10 12l6.5-6.5z",
  chip: "M7 7h10v10H7zM9.5 9.5v5h5v-5zM9 2h2v3H9zM13 2h2v3h-2zM9 19h2v3H9zM13 19h2v3h-2zM2 9h3v2H2zM2 13h3v2H2zM19 9h3v2h-3zM19 13h3v2h-3z",
  chama: "M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-6 .5 1.5 1.5 2 2 2 0-3-1-5 1-8z"
};

function iconeSvg(nome, classe) {
  return '<svg class="ic ' + (classe || "") + '" viewBox="0 0 24 24" fill-rule="evenodd" aria-hidden="true"><path d="' + iconesSvg[nome] + '"/></svg>';
}

// troca cada <i data-icone="..."> pelo desenho
function iconesInjetar(raiz) {
  var lista = (raiz || document).querySelectorAll("i[data-icone]");
  for (var i = 0; i < lista.length; i++) {
    var nome = lista[i].getAttribute("data-icone");
    if (iconesSvg[nome]) {
      lista[i].outerHTML = iconeSvg(nome);
    }
  }
}

function $(id) {
  return document.getElementById(id);
}

// ---------- Perfil (salvo no navegador) ----------
var Perfil = (function () {
  var chave = "lumia-abismo-v1";
  var d = { xp: 0, cristais: 0, estudados: [], tutorial: false, mudo: false, seloPremio: false, portas: {} };

  function carregar() {
    try {
      var txt = localStorage.getItem(chave);
      if (txt) {
        var lido = JSON.parse(txt);
        for (var k in d) {
          if (lido[k] !== undefined) {
            d[k] = lido[k];
          }
        }
      }
    } catch (e) { /* sem salvar, o jogo funciona igual */ }
  }

  function salvar() {
    try {
      localStorage.setItem(chave, JSON.stringify(d));
    } catch (e) { /* ok */ }
  }

  function nivel() {
    return Math.floor(d.xp / 100) + 1;
  }

  function titulo() {
    return titulosNivel[Math.min(nivel() - 1, titulosNivel.length - 1)];
  }

  function ganharXp(n) {
    var antes = nivel();
    d.xp += n;
    salvar();
    return nivel() > antes;
  }

  function ganharCristais(n) {
    d.cristais += n;
    salvar();
  }

  function gastarCristais(n) {
    if (d.cristais < n) {
      return false;
    }
    d.cristais -= n;
    salvar();
    return true;
  }

  function estudar(id) {
    if (d.estudados.indexOf(id) < 0) {
      d.estudados.push(id);
      salvar();
    }
  }

  function zerar() {
    d.xp = 0; d.cristais = 0; d.estudados = []; d.tutorial = false; d.seloPremio = false; d.portas = {};
    salvar();
  }

  function desenhar() {
    $("perfil-titulo").textContent = titulo();
    $("perfil-nivel").textContent = nivel();
    $("perfil-xp").style.width = (d.xp % 100) + "%";
    $("perfil-cristais").textContent = d.cristais;
    $("perfil-estudados").textContent = d.estudados.length;
    $("cristais-num").textContent = d.cristais;
    $("selo-cristais").textContent = d.cristais;
  }

  carregar();
  return {
    dados: d, salvar: salvar, nivel: nivel, titulo: titulo, ganharXp: ganharXp, ganharCristais: ganharCristais,
    gastarCristais: gastarCristais, estudar: estudar, zerar: zerar, desenhar: desenhar
  };
})();

// ---------- Interface ----------
var UI = (function () {
  var timerToast = null;
  var animConceito = 0;
  var confirmaSim = null;

  function aberto(id) {
    return $(id).classList.contains("aberto");
  }
  function abrir(id) {
    $(id).classList.add("aberto");
  }
  function fechar(id) {
    $(id).classList.remove("aberto");
  }
  function algumAberto() {
    return document.querySelector(".modal.aberto") != null;
  }

  // telas inteiras: titulo, grimorio, selo (a Arena usa o HUD por cima do canvas)
  function tela(nome) {
    var telas = ["titulo", "grimorio", "selo", "portas"];
    for (var i = 0; i < telas.length; i++) {
      $("tela-" + telas[i]).classList.toggle("ativa", telas[i] == nome);
    }
    $("hud").classList.toggle("oculto", nome != "arena");
    Perfil.desenhar();
  }

  function toast(texto, ms) {
    var el = $("toast");
    el.textContent = texto;
    el.classList.add("mostra");
    clearTimeout(timerToast);
    timerToast = setTimeout(function () {
      el.classList.remove("mostra");
    }, ms || 2200);
  }

  function confirmar(titulo, texto, aoConfirmar) {
    $("confirma-titulo").textContent = titulo;
    $("confirma-texto").textContent = texto;
    confirmaSim = aoConfirmar;
    abrir("modal-confirma");
  }

  // ----- HUD -----
  function hudOnda(n, total, nome) {
    $("hud-onda-n").textContent = "Onda " + n + " de " + total;
    $("hud-onda-nome").textContent = nome;
  }
  function hudContador(acertos, total) {
    $("contador").textContent = acertos + " de " + total + " palavras";
    $("barra-prog").style.width = (acertos / total * 100) + "%";
  }
  function hudVidas(atual, max) {
    var el = $("vidas");
    if (max == null) {
      el.innerHTML = '<small style="color:#ffe39a">Modo Aprendiz</small>';
      return;
    }
    var h = "";
    for (var i = 0; i < max; i++) {
      h += iconeSvg("chama", i < atual ? "" : "apagada");
    }
    el.innerHTML = h;
  }
  function hudCristais(n, pulo) {
    $("cristais-num").textContent = n;
    $("selo-cristais").textContent = n;
    if (pulo) {
      var el = $("cristais-hud");
      el.classList.remove("pulo");
      void el.offsetWidth;
      el.classList.add("pulo");
    }
  }
  function pergunta(tipo, texto, ajuda) {
    var el = $("pergunta");
    $("pergunta-tipo").textContent = tipo;
    $("pergunta-texto").textContent = texto;
    $("pergunta-ajuda").textContent = ajuda || "";
    el.classList.remove("oculto");
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  }
  function perguntaOcultar() {
    $("pergunta").classList.add("oculto");
  }
  function perguntaFundo() {
    // altura de baixo do painel da pergunta: a Arena usa para posicionar os bugs
    var el = $("pergunta");
    return el.classList.contains("oculto") ? 70 : el.offsetTop + el.offsetHeight;
  }
  function dicas(lista) {
    var el = $("dicas");
    el.innerHTML = "";
    el.classList.toggle("oculto", lista.length == 0);
    for (var i = 0; i < lista.length; i++) {
      var d = document.createElement("div");
      d.className = "dica-item";
      d.setAttribute("data-n", i + 1);
      d.textContent = lista[i];
      el.appendChild(d);
    }
  }
  function combo(n) {
    var el = $("combo-hud");
    if (n < 2) {
      el.classList.add("oculto");
      return;
    }
    el.classList.remove("oculto");
    el.innerHTML = "Combo<b>x" + n + "</b>";
  }
  function faixaOnda(n, nome, historia) {
    $("faixa-onda-n").textContent = "Onda " + n;
    $("faixa-onda-nome").textContent = nome;
    $("faixa-onda-historia").textContent = historia;
    var el = $("faixa-onda");
    el.classList.remove("mostra");
    void el.offsetWidth;
    el.classList.add("mostra");
  }

  // ----- Carta do conceito (com o bug animado) -----
  function conceito(idx, ganhos, aoFechar) {
    var p = palavras[idx];
    $("conceito-cat").textContent = categorias[p.categoria].nome;
    $("conceito-nome").textContent = p.nome;
    $("conceito-expl").textContent = p.explicacao;
    $("conceito-lembrar").textContent = "Guarde: " + (rotulos[p.resposta] || p.curto) + ".";
    var g = "";
    for (var i = 0; i < ganhos.length; i++) {
      g += '<span class="ganho ' + ganhos[i].k + '" style="animation-delay:' + (0.3 + i * 0.15) + 's">' + ganhos[i].t + "</span>";
    }
    $("conceito-ganhos").innerHTML = g;
    abrir("modal-conceito");
    UI.aoFecharConceito = aoFechar;

    var cv = $("conceito-canvas");
    var c = cv.getContext("2d");
    var t0 = performance.now();
    cancelAnimationFrame(animConceito);
    function quadro(agora) {
      var t = (agora - t0) / 1000;
      c.clearRect(0, 0, 260, 260);
      desenharBicho(c, idx % 4, 130, 130, 1.25, t, huesCategoria[p.categoria], { fase: idx, aura: 0.55 });
      if (aberto("modal-conceito")) {
        animConceito = requestAnimationFrame(quadro);
      }
    }
    animConceito = requestAnimationFrame(quadro);
  }

  // ----- Diário (botão Conferir) -----
  // estados: array de 16 com "certa" | "ajuda" | "errou" | "pendente"
  function diario(estados) {
    var certas = 0;
    var h = "";
    for (var i = 0; i < palavras.length; i++) {
      var e = estados[i] || "pendente";
      if (e == "certa" || e == "ajuda") {
        certas++;
      }
      var rotulo = { certa: "certa", ajuda: "com ajuda", errou: "tentando", pendente: "" }[e];
      var classe = { certa: "certa", ajuda: "ajuda", errou: "errou", pendente: "" }[e];
      var nome = (e == "pendente" || e == "errou") ? "? ? ?" : palavras[i].nome;
      h += '<div class="diario-item ' + classe + '"><i class="ponto p-' + e + '"></i><b>' + (i + 1) + ". " + nome + "</b><small>" + rotulo + "</small></div>";
    }
    $("diario-lista").innerHTML = h;
    $("diario-contador").textContent = certas + " de " + palavras.length + " palavras";
    abrir("modal-diario");
  }

  function estrelas(elId, n, total) {
    var h = "";
    for (var i = 0; i < total; i++) {
      h += '<span class="' + (i < n ? "acesa" : "") + '" style="animation-delay:' + (0.3 + i * 0.25) + 's">★</span>';
    }
    $(elId).innerHTML = h;
  }

  function ligarBotoes() {
    $("confirma-nao").onclick = function () { somTocar("fechar"); fechar("modal-confirma"); };
    $("confirma-sim").onclick = function () {
      somTocar("clique");
      fechar("modal-confirma");
      if (confirmaSim) {
        confirmaSim();
      }
    };
    $("btn-conceito-ok").onclick = function () {
      somTocar("fechar");
      fechar("modal-conceito");
      if (UI.aoFecharConceito) {
        var f = UI.aoFecharConceito;
        UI.aoFecharConceito = null;
        f();
      }
    };
    $("btn-diario-ok").onclick = function () { somTocar("fechar"); fechar("modal-diario"); };
    $("btn-como-ok").onclick = function () {
      somTocar("fechar");
      fechar("modal-como");
      Perfil.dados.tutorial = true;
      Perfil.salvar();
    };
  }

  return {
    abrir: abrir, fechar: fechar, aberto: aberto, algumAberto: algumAberto, tela: tela, toast: toast, confirmar: confirmar,
    hudOnda: hudOnda, hudContador: hudContador, hudVidas: hudVidas, hudCristais: hudCristais,
    pergunta: pergunta, perguntaOcultar: perguntaOcultar, perguntaFundo: perguntaFundo, dicas: dicas, combo: combo,
    faixaOnda: faixaOnda, conceito: conceito, diario: diario, estrelas: estrelas, ligarBotoes: ligarBotoes,
    aoFecharConceito: null
  };
})();
