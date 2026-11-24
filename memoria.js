// =====================================================
// PAR PERFEITO - jogo da memória para estudar.
// Vire duas cartas: se forem um par (conceito + descrição, ou porta + nome), elas ficam abertas.
// Cada partida sorteia os pares e a posição das cartas.
// =====================================================

var Memoria = (function () {
  var modo = "conceitos";
  var M = null;          // partida em andamento
  var relogio = null;

  var NIVEIS = {
    facil:   { nome: "Fácil",   cor: "#7cf0c4", pares: { conceitos: 6, portas: 4 }, desc: "Poucas cartas para aquecer." },
    medio:   { nome: "Médio",   cor: "#ffd27a", pares: { conceitos: 8, portas: 5 }, desc: "Mais cartas e mais confusão." },
    dificil: { nome: "Difícil", cor: "#ff8aa8", pares: { conceitos: 10, portas: 7 }, desc: "Tabuleiro cheio. Memória de verdade." }
  };

  var CURTAS = {
    AND: "todas as entradas = 1", OR: "ao menos uma = 1", NOT: "inverte a entrada",
    NAND: "AND negado", NOR: "OR negado", XOR: "entradas diferentes", XNOR: "entradas iguais"
  };

  function el(id) { return document.getElementById(id); }
  function sortear(n) { return Math.floor(Math.random() * n); }
  function embaralhar(l) {
    var a = l.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = sortear(i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function padraoDaPorta(g) {
    var P = Portas.info[g];
    var s = "";
    if (P.n == 1) { return "S = " + P.f(0) + P.f(1); }
    s += P.f(0, 0) + "" + P.f(0, 1) + P.f(1, 0) + P.f(1, 1);
    return "S = " + s;
  }

  // ---------- sorteio dos pares ----------
  function montarPares(nivel) {
    var n = NIVEIS[nivel].pares[modo];
    var pares = [];
    if (modo == "conceitos") {
      var idx = embaralhar(palavras.map(function (p, i) { return i; })).slice(0, n);
      for (var i = 0; i < idx.length; i++) {
        var p = palavras[idx[i]];
        pares.push({
          a: '<b class="nome">' + esc(p.curto) + "</b><small>conceito</small>",
          b: '<span class="desc">' + esc(rotulos[p.resposta] || p.curto) + "</span>",
          hue: huesCategoria[p.categoria], resumo: p.curto + " = " + (rotulos[p.resposta] || "")
        });
      }
    } else {
      var gs = embaralhar(Portas.ordem).slice(0, n);
      for (var k = 0; k < gs.length; k++) {
        var g = gs[k];
        var comForma = Math.random() < 0.5;
        pares.push({
          a: comForma ? Portas.mini(g) : '<b class="padrao">' + padraoDaPorta(g) + "</b><small>tabela-verdade</small>",
          b: '<b class="nome">' + g + "</b><small>" + esc(CURTAS[g]) + "</small>",
          hue: 270, resumo: g + " (" + Portas.info[g].pt + "): " + Portas.info[g].regra
        });
      }
    }
    return pares;
  }

  // ---------- telas ----------
  function estrelasTotais() {
    var d = Perfil.dados.memoria || {};
    var t = 0;
    for (var k in d) { t += d[k]; }
    return t;
  }

  function estrelasHtml(n) {
    var s = "";
    for (var i = 0; i < 3; i++) { s += '<i class="' + (i < n ? "cheia" : "") + '">★</i>'; }
    return s;
  }

  function montarNiveis() {
    var raiz = el("mem-niveis");
    var d = Perfil.dados.memoria || {};
    raiz.innerHTML = "";
    var ks = ["facil", "medio", "dificil"];
    for (var i = 0; i < ks.length; i++) {
      var N = NIVEIS[ks[i]];
      var b = document.createElement("button");
      b.className = "nivel-cartao";
      b.style.setProperty("--cor", N.cor);
      b.style.animationDelay = (i * 0.08) + "s";
      b.setAttribute("data-nivel", ks[i]);
      b.innerHTML = '<span class="nivel-num">' + N.pares[modo] + "</span><span class='nivel-txt'><b>" + N.nome +
        "</b><small>" + N.pares[modo] + " pares · " + N.desc + "</small></span><span class='nivel-estrelas'>" +
        estrelasHtml(d[modo + "_" + ks[i]] || 0) + "</span>";
      raiz.appendChild(b);
    }
    el("mem-info").textContent = "★ " + estrelasTotais() + " de 18";
  }

  function escolherModo(m) {
    modo = m;
    el("mem-modo-c").classList.toggle("ativa", m == "conceitos");
    el("mem-modo-p").classList.toggle("ativa", m == "portas");
    montarNiveis();
  }

  function mostrar(qual) {
    el("mem-setup").classList.toggle("oculto", qual != "setup");
    el("mem-jogo").classList.toggle("oculto", qual != "jogo");
    el("mem-resumo").classList.toggle("oculto", qual != "resumo");
  }

  function abrir() {
    if (!Perfil.dados.memoria) { Perfil.dados.memoria = {}; }
    pararRelogio();
    M = null;
    montarNiveis();
    mostrar("setup");
  }

  function fechar() { pararRelogio(); }

  // ---------- partida ----------
  function iniciar(nivel) {
    var pares = montarPares(nivel);
    var cartas = [];
    for (var i = 0; i < pares.length; i++) {
      cartas.push({ par: i, lado: "a", html: pares[i].a, hue: pares[i].hue });
      cartas.push({ par: i, lado: "b", html: pares[i].b, hue: pares[i].hue });
    }
    cartas = embaralhar(cartas);
    M = { nivel: nivel, pares: pares, cartas: cartas, abertas: [], achados: 0, jogadas: 0, penal: 0, inicio: 0, bloqueio: false, espiou: false, fim: false, seq: 0 };
    mostrar("jogo");
    desenharGrade();
    atualizarStats();
    el("mem-espiar").disabled = false;
    el("mem-tempo").textContent = "0:00";
    somTocar("onda");
  }

  function desenharGrade() {
    var g = el("mem-grade");
    var n = M.cartas.length;
    var mobile = window.innerWidth < 600;
    var cols = mobile ? (n <= 12 ? 3 : 4) : (n <= 8 ? 4 : (n <= 12 ? 4 : (n <= 16 ? 4 : 5)));
    g.style.setProperty("--cols", cols);
    g.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var c = M.cartas[i];
      var b = document.createElement("button");
      b.className = "mcarta";
      b.setAttribute("data-i", i);
      b.style.setProperty("--h", c.hue);
      b.style.animationDelay = (i * 0.04) + "s";
      b.innerHTML = '<span class="mcarta-miolo"><span class="mface verso"><i></i></span><span class="mface frente ' + (c.lado == "a" ? "ladoA" : "ladoB") + '">' + c.html + "</span></span>";
      g.appendChild(b);
    }
  }

  function atualizarStats() {
    el("mem-jogadas").textContent = M.jogadas + M.penal;
    el("mem-pares").textContent = M.achados + " / " + M.pares.length;
  }

  function formatar(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function iniciarRelogio() {
    pararRelogio();
    M.inicio = Date.now();
    relogio = setInterval(function () {
      if (!M || M.fim) { pararRelogio(); return; }
      el("mem-tempo").textContent = formatar(Math.floor((Date.now() - M.inicio) / 1000));
    }, 500);
  }

  function pararRelogio() {
    if (relogio) { clearInterval(relogio); relogio = null; }
  }

  function cartaEl(i) {
    return el("mem-grade").querySelector('[data-i="' + i + '"]');
  }

  function virar(i, aberta) {
    var b = cartaEl(i);
    if (b) { b.classList.toggle("virada", aberta); }
  }

  function clicar(i) {
    if (!M || M.fim || M.bloqueio) { return; }
    var c = M.cartas[i];
    if (c.achada || M.abertas.indexOf(i) >= 0) { return; }
    if (!M.inicio) { iniciarRelogio(); }
    virar(i, true);
    somTocar("carta");
    M.abertas.push(i);
    if (M.abertas.length < 2) { return; }

    M.jogadas++;
    M.bloqueio = true;
    var a = M.abertas[0], b = M.abertas[1];
    var igual = M.cartas[a].par == M.cartas[b].par && M.cartas[a].lado != M.cartas[b].lado;
    setTimeout(function () {
      if (igual) { acertou(a, b); } else { errou(a, b); }
    }, 650);
    atualizarStats();
  }

  function centro(i) {
    var r = cartaEl(i).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function acertou(a, b) {
    M.cartas[a].achada = true; M.cartas[b].achada = true;
    cartaEl(a).classList.add("achada"); cartaEl(b).classList.add("achada");
    M.achados++;
    M.abertas = [];
    M.bloqueio = false;
    somTocar("acerto");
    var ca = centro(a), cb = centro(b);
    Fx.faiscas(ca.x, ca.y, 14, "255,216,107", 260, 0.9);
    Fx.faiscas(cb.x, cb.y, 14, "255,216,107", 260, 0.9);
    Fx.anel(cb.x, cb.y, "124,240,196", 90, 4);
    atualizarStats();
    if (M.achados == M.pares.length) { terminar(); }
  }

  function errou(a, b) {
    var ea = cartaEl(a), eb = cartaEl(b);
    ea.classList.add("erro"); eb.classList.add("erro");
    somTocar("erro");
    setTimeout(function () {
      ea.classList.remove("erro"); eb.classList.remove("erro");
      virar(a, false); virar(b, false);
      M.abertas = [];
      M.bloqueio = false;
    }, 600);
  }

  function espiar() {
    if (!M || M.fim || M.espiou || M.bloqueio) { return; }
    M.espiou = true;
    M.penal += 3;
    M.bloqueio = true;
    el("mem-espiar").disabled = true;
    atualizarStats();
    somTocar("dica");
    var abertasAntes = M.abertas.slice();
    for (var i = 0; i < M.cartas.length; i++) { if (!M.cartas[i].achada) { virar(i, true); } }
    setTimeout(function () {
      for (var j = 0; j < M.cartas.length; j++) {
        if (!M.cartas[j].achada && abertasAntes.indexOf(j) < 0) { virar(j, false); }
      }
      M.bloqueio = false;
    }, 1700);
  }

  function terminar() {
    M.fim = true;
    pararRelogio();
    var seg = M.inicio ? Math.floor((Date.now() - M.inicio) / 1000) : 0;
    var total = M.jogadas + M.penal;
    var n = M.pares.length;
    var est = total <= n * 1.7 ? 3 : (total <= n * 2.6 ? 2 : 1);
    var chave = modo + "_" + M.nivel;
    var d = Perfil.dados.memoria;
    if (est > (d[chave] || 0)) { d[chave] = est; }
    var cr = n + est * 2;
    Perfil.ganharCristais(cr);
    Perfil.ganharXp(est * 10);
    Perfil.salvar();
    Perfil.desenhar();
    somTocar("vitoria");
    Fx.confete(window.innerWidth, 100);
    setTimeout(function () {
      mostrar("resumo");
      el("mem-resumo-estrelas").innerHTML = estrelasHtml(est);
      el("mem-resumo-texto").innerHTML = "<b>" + total + "</b> jogadas · <b>" + formatar(seg) + "</b> · <b>+" + cr + "</b> cristais" +
        (M.espiou ? "<br><small>(espiar custa 3 jogadas)</small>" : "");
      var li = "";
      for (var i = 0; i < M.pares.length; i++) { li += "<li>" + esc(M.pares[i].resumo) + "</li>"; }
      el("mem-resumo-lista").innerHTML = li;
    }, 900);
  }

  function ligar() {
    el("mem-modo-c").onclick = function () { somTocar("clique"); escolherModo("conceitos"); };
    el("mem-modo-p").onclick = function () { somTocar("clique"); escolherModo("portas"); };
    el("mem-niveis").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-nivel]");
      if (b) { iniciar(b.getAttribute("data-nivel")); }
    });
    el("mem-grade").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-i]");
      if (b) { clicar(parseInt(b.getAttribute("data-i"), 10)); }
    });
    el("mem-espiar").onclick = espiar;
    el("mem-sair").onclick = function () { somTocar("clique"); abrir(); };
    el("mem-resumo-repetir").onclick = function () { somTocar("clique"); iniciar(M ? M.nivel : "facil"); };
    el("mem-resumo-niveis").onclick = function () { somTocar("clique"); abrir(); };
    window.addEventListener("resize", function () {
      if (M && !M.fim && !el("mem-jogo").classList.contains("oculto")) {
        // só redesenha a quantidade de colunas, sem perder o estado
        var n = M.cartas.length, mobile = window.innerWidth < 600;
        el("mem-grade").style.setProperty("--cols", mobile ? (n <= 12 ? 3 : 4) : (n <= 8 ? 4 : (n <= 16 ? 4 : 5)));
      }
    });
  }

  // _pares: usado só nos testes automáticos
  return { abrir: abrir, fechar: fechar, ligar: ligar, _pares: function () { return M ? M.cartas.map(function (c) { return c.par; }) : []; } };
})();
