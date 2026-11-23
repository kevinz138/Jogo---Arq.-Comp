// =====================================================
// LABORATÓRIO LÓGICO - aprenda as portas lógicas (AND, OR, NOT, NAND, NOR, XOR, XNOR)
// Duas abas: "Aprender" (guia com chaves que você liga e desliga) e "Fases"
// (desafios sorteados em 3 níveis de dificuldade).
// Tudo é desenhado em SVG por este arquivo, sem imagens.
// =====================================================

var Portas = (function () {

  // ---------- as 7 portas ----------
  var PORTAS = {
    AND: {
      nome: "AND", pt: "E", n: 2,
      f: function (a, b) { return a & b; },
      regra: "A saída só vale 1 quando TODAS as entradas valem 1.",
      vida: "Só abre o cofre se você tiver a chave E souber a senha.",
      pista: "Só uma linha tem saída 1, e é aquela em que todas as entradas valem 1."
    },
    OR: {
      nome: "OR", pt: "OU", n: 2,
      f: function (a, b) { return a | b; },
      regra: "A saída vale 1 quando PELO MENOS UMA entrada vale 1.",
      vida: "A luz da sala acende se o interruptor da porta OU o do corredor for ligado.",
      pista: "Só uma linha tem saída 0, e é aquela em que todas as entradas valem 0."
    },
    NOT: {
      nome: "NOT", pt: "NÃO", n: 1,
      f: function (a) { return a ? 0 : 1; },
      regra: "Inverte a entrada: 0 vira 1 e 1 vira 0 (por isso se diz que a saída é negada).",
      vida: "É o 'contrário': se está chovendo, NÃO está sol.",
      pista: "Ela só tem uma entrada, e a saída é sempre o contrário dela."
    },
    NAND: {
      nome: "NAND", pt: "NÃO-E", n: 2,
      f: function (a, b) { return (a & b) ? 0 : 1; },
      regra: "É um AND com a saída negada: só vale 0 quando TODAS as entradas valem 1.",
      vida: "O cofre só 'falha' quando você tem a chave E a senha.",
      pista: "Só uma linha tem saída 0, e é aquela em que todas as entradas valem 1."
    },
    NOR: {
      nome: "NOR", pt: "NÃO-OU", n: 2,
      f: function (a, b) { return (a | b) ? 0 : 1; },
      regra: "É um OR com a saída negada: só vale 1 quando TODAS as entradas valem 0.",
      vida: "O alarme só fica quieto se NENHUM sensor detectar movimento.",
      pista: "Só uma linha tem saída 1, e é aquela em que todas as entradas valem 0."
    },
    XOR: {
      nome: "XOR", pt: "OU exclusivo", n: 2,
      f: function (a, b) { return a ^ b; },
      regra: "A saída vale 1 quando as entradas são DIFERENTES entre si.",
      vida: "Interruptor de escada: cada um dos dois inverte a lâmpada.",
      pista: "Duas linhas têm saída 1, e nelas as entradas são diferentes entre si."
    },
    XNOR: {
      nome: "XNOR", pt: "NÃO-OU exclusivo", n: 2,
      f: function (a, b) { return (a ^ b) ? 0 : 1; },
      regra: "É um XOR negado: a saída vale 1 quando as entradas são IGUAIS.",
      vida: "Detector de empate: dá 1 quando os dois lados mostram o mesmo valor.",
      pista: "Duas linhas têm saída 1, e nelas as entradas são iguais entre si."
    }
  };
  var ORDEM = ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"];

  // desenho de cada porta (medidas locais, a porta tem 50 de altura)
  var FORMA = {
    AND:  { w: 54, pinX: 0, pins: [13, 37], corpo: "M0,1 H30 A24,24 0 0 1 30,49 H0 Z" },
    NAND: { w: 64, pinX: 0, pins: [13, 37], corpo: "M0,1 H30 A24,24 0 0 1 30,49 H0 Z", bolha: 59 },
    OR:   { w: 56, pinX: 8, pins: [13, 37], corpo: "M0,1 C22,1 42,10 56,25 C42,40 22,49 0,49 C12,36 12,14 0,1 Z" },
    NOR:  { w: 66, pinX: 8, pins: [13, 37], corpo: "M0,1 C22,1 42,10 56,25 C42,40 22,49 0,49 C12,36 12,14 0,1 Z", bolha: 61 },
    XOR:  { w: 64, pinX: 5, pins: [13, 37], corpo: "M0,1 C22,1 42,10 56,25 C42,40 22,49 0,49 C12,36 12,14 0,1 Z", desloc: 8 },
    XNOR: { w: 74, pinX: 5, pins: [13, 37], corpo: "M0,1 C22,1 42,10 56,25 C42,40 22,49 0,49 C12,36 12,14 0,1 Z", desloc: 8, bolha: 69 },
    NOT:  { w: 58, pinX: 0, pins: [25], corpo: "M0,3 L48,25 L0,47 Z", bolha: 53 }
  };

  var NIVEIS = {
    facil: { nome: "Fácil", cor: "#7cf0c4", total: 6, desc: "Uma porta só. Ache a saída e reconheça AND, OR e NOT.",
             tipos: ["saida", "saida", "saida", "id", "id", "id"] },
    medio: { nome: "Médio", cor: "#ffd27a", total: 6, desc: "Circuitos com 2 ou 3 portas, mais NAND e NOR, e chaves para ligar.",
             tipos: ["saida", "saida", "id", "id", "ligar", "ligar"] },
    dificil: { nome: "Difícil", cor: "#ff8aa8", total: 6, desc: "Circuitos maiores com XOR e XNOR e portas escondidas para descobrir.",
               tipos: ["saida", "saida", "ligar", "ligar", "faltando", "faltando"] }
  };

  var falas = {
    acerto: ["Isso aí! A luz passou!", "Circuito perfeito!", "Você pensa como uma porta lógica!", "Boa! Próxima!"],
    erro: ["Quase! Leia a dica.", "Respire e pense de novo.", "Sem pressa: cada dica ajuda.", "Confira a regra da porta."],
    inicio: "Siga os fios: o que brilha vale 1."
  };

  // ---------- utilidades ----------
  function sortear(n) { return Math.floor(Math.random() * n); }
  function escolher(l) { return l[sortear(l.length)]; }
  function embaralhar(lista) {
    var l = lista.slice();
    for (var i = l.length - 1; i > 0; i--) {
      var j = sortear(i + 1);
      var t = l[i]; l[i] = l[j]; l[j] = t;
    }
    return l;
  }
  function el(id) { return document.getElementById(id); }

  // ---------- circuitos (árvores de portas) ----------
  function montarArvore(nPortas, pool) {
    if (nPortas == 0) { return { tipo: "in" }; }
    var g = escolher(pool);
    if (g == "NOT") {
      var f = montarArvore(nPortas - 1, pool);
      if (f.tipo == "porta" && f.g == "NOT") { return montarArvore(nPortas, pool); }
      return { tipo: "porta", g: g, filhos: [f] };
    }
    var esq = sortear(nPortas);
    return { tipo: "porta", g: g, filhos: [montarArvore(esq, pool), montarArvore(nPortas - 1 - esq, pool)] };
  }

  function coletar(no, folhas, portas) {
    if (no.tipo == "in") { folhas.push(no); return; }
    for (var i = 0; i < no.filhos.length; i++) { coletar(no.filhos[i], folhas, portas); }
    portas.push(no);
  }

  function profundidade(no) {
    if (no.tipo == "in") { return 0; }
    var m = 0;
    for (var i = 0; i < no.filhos.length; i++) { m = Math.max(m, profundidade(no.filhos[i])); }
    return m + 1;
  }

  function criarCircuito(nPortas, pool, maxFolhas) {
    for (var tentativa = 0; tentativa < 200; tentativa++) {
      var raiz = montarArvore(nPortas, pool);
      var folhas = [], portas = [];
      coletar(raiz, folhas, portas);
      if (folhas.length > maxFolhas || folhas.length < (nPortas == 1 ? 1 : 2) || profundidade(raiz) > 3) { continue; }
      var letras = "ABCDE";
      for (var i = 0; i < folhas.length; i++) { folhas[i].nome = letras.charAt(i); }
      return { raiz: raiz, folhas: folhas, portas: portas };
    }
    // plano B: uma porta só
    var r = { tipo: "porta", g: "AND", filhos: [{ tipo: "in", nome: "A" }, { tipo: "in", nome: "B" }] };
    return { raiz: r, folhas: [r.filhos[0], r.filhos[1]], portas: [r] };
  }

  function calcular(no, vals, trocaPorta) {
    if (no.tipo == "in") { no.v = vals[no.nome]; return no.v; }
    var args = [];
    for (var i = 0; i < no.filhos.length; i++) { args.push(calcular(no.filhos[i], vals, trocaPorta)); }
    var g = (trocaPorta && trocaPorta.no === no) ? trocaPorta.g : no.g;
    no.v = PORTAS[g].f(args[0], args[1]);
    return no.v;
  }

  function combinacoes(nomes) {
    var linhas = [];
    var total = 1 << nomes.length;
    for (var i = 0; i < total; i++) {
      var v = {};
      for (var k = 0; k < nomes.length; k++) {
        v[nomes[k]] = (i >> (nomes.length - 1 - k)) & 1;
      }
      linhas.push(v);
    }
    return linhas;
  }

  function nomesDas(circ) {
    var n = [];
    for (var i = 0; i < circ.folhas.length; i++) { n.push(circ.folhas[i].nome); }
    return n;
  }

  function expressao(no, topo) {
    if (no.tipo == "in") { return no.nome; }
    if (no.g == "NOT") { return "NOT " + expressao(no.filhos[0], false); }
    var s = expressao(no.filhos[0], false) + " " + no.g + " " + expressao(no.filhos[1], false);
    return topo ? s : "(" + s + ")";
  }

  // ---------- desenho SVG ----------
  var LARG_FOLHA = 58, GAP = 52, COL = 74, ESP = 72;

  function posicionar(circ) {
    var cont = 0;
    function pos(no) {
      if (no.tipo == "in") { no.py = 32 + cont * ESP; cont++; no.px = 0; no.d = 0; return; }
      var soma = 0, d = 0;
      for (var i = 0; i < no.filhos.length; i++) {
        pos(no.filhos[i]);
        soma += no.filhos[i].py;
        d = Math.max(d, no.filhos[i].d);
      }
      no.py = soma / no.filhos.length;
      no.d = d + 1;
      no.px = LARG_FOLHA + GAP + (no.d - 1) * (COL + GAP);
    }
    pos(circ.raiz);
    var D = circ.raiz.d;
    circ.lampX = circ.raiz.px + COL + 46;
    circ.largura = circ.lampX + 30;
    circ.altura = 32 + (circ.folhas.length - 1) * ESP + 52;
    circ.profMax = D;
  }

  function fio(x1, y1, x2, y2, v, atraso, fluxo) {
    var xm = (x1 + x2) / 2;
    var d = "M" + x1 + "," + y1 + " C" + xm + "," + y1 + " " + xm + "," + y2 + " " + x2 + "," + y2;
    var cls = v === 1 ? "fio ligado" : (v === 0 ? "fio desligado" : "fio neutro");
    var s = '<path class="' + cls + '" d="' + d + '" style="animation-delay:' + atraso + 's"/>';
    if (v === 1 && fluxo !== false) {
      s += '<path class="fluxo" d="' + d + '" style="animation-delay:' + atraso + 's"/>';
    }
    return s;
  }

  function corpoPorta(g, x, y, oculta) {
    var f = FORMA[g];
    var s = '<g transform="translate(' + x + "," + (y - 25) + ')">';
    if (oculta) {
      s += '<rect class="porta-oculta" x="0" y="0" width="64" height="50" rx="12"/>' +
           '<text class="porta-interroga" x="32" y="35" text-anchor="middle">?</text></g>';
      return s;
    }
    s += '<g class="porta-forma">';
    if (f.desloc) {
      s += '<path class="porta-corpo" transform="translate(' + f.desloc + ',0)" d="' + f.corpo + '"/>';
      s += '<path class="porta-arco" d="M0,1 C12,14 12,36 0,49"/>';
    } else {
      s += '<path class="porta-corpo" d="' + f.corpo + '"/>';
    }
    if (f.bolha) { s += '<circle class="porta-corpo" cx="' + f.bolha + '" cy="25" r="5"/>'; }
    s += "</g></g>";
    return s;
  }

  // o: { valores: mostra valores das chaves; mostrar: mostra valor das portas; atrasos: animação em cascata;
  //      chave: chaves clicáveis; oculta: nó escondido; lampada: 0/1/null; nomes: mostra nome das portas }
  function svgCircuito(circ, o) {
    posicionar(circ);
    var raiz = circ.raiz;
    var fios = "", corpos = "", selos = "";
    var cascata = o.atrasos ? 0.55 : 0;

    function conhecido(no) {
      if (no.tipo == "in") { return o.valores ? no.v : null; }
      return o.mostrar ? no.v : null;
    }

    function visitar(no) {
      if (no.tipo == "in") {
        var v = o.valores ? no.v : null;
        var cls = "chave-pilula " + (v === 1 ? "um" : (v === 0 ? "zero" : "")) + (o.chave ? " clicavel" : "");
        corpos += '<g class="' + cls + '"' + (o.chave ? ' data-chave="' + no.nome + '"' : "") + ' transform="translate(0,' + (no.py - 15) + ')">' +
          '<rect class="pilula" x="0" y="0" width="' + LARG_FOLHA + '" height="30" rx="15"/>' +
          '<text class="pilula-letra" x="18" y="20" text-anchor="middle">' + no.nome + "</text>" +
          '<text class="pilula-valor" x="42" y="21" text-anchor="middle">' + (v === null ? "·" : v) + "</text>" +
          (o.chave ? '<rect class="pilula-anel" x="-3" y="-3" width="' + (LARG_FOLHA + 6) + '" height="36" rx="18"/>' : "") +
          "</g>";
        return;
      }
      var f = FORMA[no.g];
      var oculta = (o.oculta === no);
      for (var i = 0; i < no.filhos.length; i++) {
        var c = no.filhos[i];
        visitar(c);
        var cx = c.tipo == "in" ? LARG_FOLHA : c.px + (o.oculta === c ? 64 : FORMA[c.g].w);
        var atraso = (c.d || 0) * cascata;
        fios += fio(cx, c.py, no.px + (oculta ? 0 : f.pinX), no.py + (no.filhos.length == 1 ? 0 : (i == 0 ? -12 : 12)), conhecido(c), atraso);
      }
      corpos += '<g class="porta-grupo' + (o.atrasos ? " surge" : "") + '" style="animation-delay:' + (no.d * cascata - 0.1) + 's">' + corpoPorta(no.g, no.px, no.py, oculta);
      if (o.nomes && !oculta) {
        corpos += '<text class="porta-nome" x="' + (no.px + f.w / 2) + '" y="' + (no.py + 44) + '" text-anchor="middle">' + no.g + "</text>";
      }
      corpos += "</g>";
      if (o.mostrar && no !== raiz && !oculta) {
        selos += '<g class="selo-valor ' + (no.v ? "um" : "zero") + (o.atrasos ? " surge" : "") + '" style="animation-delay:' + (no.d * cascata + 0.05) + 's" transform="translate(' + (no.px + f.w + 15) + "," + (no.py - 13) + ')">' +
          '<circle r="9"/><text y="4" text-anchor="middle">' + no.v + "</text></g>";
      }
    }
    visitar(raiz);

    // fio até a lâmpada
    var fr = FORMA[raiz.g];
    var vl = o.lampada === undefined ? conhecido(raiz) : o.lampada;
    var rx = raiz.px + (o.oculta === raiz ? 64 : fr.w);
    fios += fio(rx, raiz.py, circ.lampX - 17, raiz.py, vl, raiz.d * cascata + 0.05);

    var lamp = '<g class="lampada ' + (vl === 1 ? "acesa" : (vl === 0 ? "apagada" : "")) + '" transform="translate(' + circ.lampX + "," + raiz.py + ')">' +
      '<circle class="lamp-halo" r="26"/><circle class="lamp-bulbo" r="17"/>' +
      '<path class="lamp-raio" d="M-8,-4 L-3,4 L0,-2 L3,4 L8,-4"/>' +
      '<text class="lamp-letra" y="44" text-anchor="middle">S</text></g>';

    return '<svg class="circuito" viewBox="0 0 ' + circ.largura + " " + circ.altura + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Circuito lógico">' +
      fios + corpos + selos + lamp + "</svg>";
  }

  // desenho de uma porta isolada (usa nos botões e na tabela)
  function svgPortaMini(g) {
    var f = FORMA[g];
    return '<svg class="porta-mini" viewBox="-4 -2 ' + (f.w + 8) + ' 54" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(0,-25) translate(0,25)">' +
      corpoPorta(g, 0, 25, false).replace('translate(0,0)', "translate(0,0)") + "</g></svg>";
  }

  function htmlTabela(nomes, linhas, fSaida, destaque) {
    var s = '<table class="tabela-verdade"><thead><tr>';
    for (var i = 0; i < nomes.length; i++) { s += "<th>" + nomes[i] + "</th>"; }
    s += '<th class="col-s">S</th></tr></thead><tbody>';
    for (var r = 0; r < linhas.length; r++) {
      var igual = destaque;
      if (destaque) {
        for (var k = 0; k < nomes.length; k++) { if (destaque[nomes[k]] !== linhas[r][nomes[k]]) { igual = null; } }
      }
      s += "<tr" + (igual ? ' class="atual"' : "") + ">";
      for (var c = 0; c < nomes.length; c++) { s += "<td>" + linhas[r][nomes[c]] + "</td>"; }
      var sv = fSaida(linhas[r]);
      s += '<td class="col-s ' + (sv ? "um" : "zero") + '">' + sv + "</td></tr>";
    }
    return s + "</tbody></table>";
  }

  // =====================================================
  // ABA APRENDER
  // =====================================================
  var guia = {}; // estado das chaves de cada cartão

  function circuitoDaPorta(g) {
    var n = PORTAS[g].n;
    var folhas = [{ tipo: "in", nome: "A" }];
    if (n == 2) { folhas.push({ tipo: "in", nome: "B" }); }
    var raiz = { tipo: "porta", g: g, filhos: folhas };
    return { raiz: raiz, folhas: folhas, portas: [raiz] };
  }

  function desenharCartaoGuia(g) {
    var P = PORTAS[g];
    var est = guia[g];
    var circ = est.circ;
    var vals = est.vals;
    calcular(circ.raiz, vals);
    var nomes = nomesDas(circ);
    el("guia-svg-" + g).innerHTML = svgCircuito(circ, { valores: true, mostrar: true, chave: true, nomes: false });
    el("guia-tab-" + g).innerHTML = htmlTabela(nomes, combinacoes(nomes), function (l) { return P.f(l.A, l.B); }, vals);
  }

  function montarGuia() {
    var raiz = el("pt-guia");
    raiz.innerHTML = "";
    for (var i = 0; i < ORDEM.length; i++) {
      var g = ORDEM[i];
      var P = PORTAS[g];
      var cart = document.createElement("article");
      cart.className = "guia-cartao";
      cart.style.animationDelay = (i * 0.06) + "s";
      cart.innerHTML =
        '<header><h3>' + P.nome + ' <small>' + P.pt + "</small></h3></header>" +
        '<p class="guia-regra">' + P.regra + "</p>" +
        '<div class="guia-svg" id="guia-svg-' + g + '" data-porta="' + g + '"></div>' +
        '<div class="guia-tab" id="guia-tab-' + g + '"></div>' +
        '<p class="guia-vida"><b>No dia a dia:</b> ' + P.vida + "</p>";
      raiz.appendChild(cart);
      var circ = circuitoDaPorta(g);
      guia[g] = { circ: circ, vals: { A: 1, B: 0 } };
      if (P.n == 1) { guia[g].vals = { A: 0 }; }
      desenharCartaoGuia(g);
    }
  }

  function cliqueGuia(ev) {
    var alvo = ev.target;
    while (alvo && alvo !== el("pt-guia") && !(alvo.getAttribute && alvo.getAttribute("data-chave"))) { alvo = alvo.parentNode; }
    if (!alvo || !alvo.getAttribute) { return; }
    var nome = alvo.getAttribute("data-chave");
    if (!nome) { return; }
    var cartao = alvo.closest(".guia-svg");
    var g = cartao.getAttribute("data-porta");
    guia[g].vals[nome] = guia[g].vals[nome] ? 0 : 1;
    somTocar("tecla");
    desenharCartaoGuia(g);
  }

  // =====================================================
  // ABA FASES
  // =====================================================
  var PJ = null; // partida em andamento

  function estrelasTotais() {
    var d = Perfil.dados.portas || {};
    return (d.facil || 0) + (d.medio || 0) + (d.dificil || 0);
  }

  function montarNiveis() {
    var raiz = el("pt-niveis");
    var d = Perfil.dados.portas || {};
    raiz.innerHTML = "";
    var chaves = ["facil", "medio", "dificil"];
    for (var i = 0; i < chaves.length; i++) {
      var k = chaves[i], N = NIVEIS[k];
      var est = d[k] || 0;
      var b = document.createElement("button");
      b.className = "nivel-cartao";
      b.style.setProperty("--cor", N.cor);
      b.style.animationDelay = (i * 0.08) + "s";
      b.innerHTML = '<span class="nivel-num">' + (i + 1) + "</span><span class='nivel-txt'><b>" + N.nome + "</b><small>" + N.desc +
        "</small></span><span class='nivel-estrelas'>" + estrelasHtml(est) + "</span>";
      b.setAttribute("data-nivel", k);
      raiz.appendChild(b);
    }
    el("portas-info").textContent = "★ " + estrelasTotais() + " de 9";
  }

  function estrelasHtml(n) {
    var s = "";
    for (var i = 0; i < 3; i++) { s += '<i class="' + (i < n ? "cheia" : "") + '">★</i>'; }
    return s;
  }

  function iniciarNivel(k) {
    var N = NIVEIS[k];
    PJ = { nivel: k, fase: 0, total: N.total, tipos: embaralhar(N.tipos), limpas: 0, d: null, resolvido: false, dicaAtual: 0, erros: 0, limpo: true, fim: false };
    el("pt-niveis").classList.add("oculto");
    el("pt-resumo").classList.add("oculto");
    el("pt-jogo").classList.remove("oculto");
    somTocar("onda");
    falar(falas.inicio, "normal");
    proximaFase();
  }

  function sairDoNivel() {
    PJ = null;
    el("pt-jogo").classList.add("oculto");
    el("pt-resumo").classList.add("oculto");
    el("pt-niveis").classList.remove("oculto");
    montarNiveis();
  }

  function proximaFase() {
    PJ.fase++;
    if (PJ.fase > PJ.total) { terminar(); return; }
    PJ.resolvido = false; PJ.dicaAtual = 0; PJ.erros = 0; PJ.limpo = true;
    PJ.d = gerar(PJ.tipos[PJ.fase - 1], PJ.nivel);
    desenharFase();
  }

  // ---------- geradores de desafios ----------
  function poolDoNivel(k) {
    if (k == "facil") { return ["AND", "OR", "NOT"]; }
    if (k == "medio") { return ["AND", "OR", "NOT", "NAND", "NOR"]; }
    return ORDEM.slice();
  }

  function sorteioValores(nomes) {
    var v = {};
    for (var i = 0; i < nomes.length; i++) { v[nomes[i]] = sortear(2); }
    return v;
  }

  function gerar(tipo, nivel) {
    if (tipo == "saida") { return gerarSaida(nivel); }
    if (tipo == "id") { return gerarId(nivel); }
    if (tipo == "ligar") { return gerarLigar(nivel); }
    return gerarFaltando(nivel);
  }

  function gerarSaida(nivel) {
    var nPortas = nivel == "facil" ? 1 : (nivel == "medio" ? 2 + sortear(2) : 3 + sortear(2));
    var pool = poolDoNivel(nivel);
    var circ, vals, resp;
    // 1 porta de entrada de duas chaves; em fácil aceita NOT também
    for (var t = 0; t < 50; t++) {
      circ = criarCircuito(nPortas, pool, 5);
      vals = sorteioValores(nomesDas(circ));
      resp = calcular(circ.raiz, vals);
      break;
    }
    return { tipo: "saida", circ: circ, vals: vals, resp: resp };
  }

  function gerarId(nivel) {
    var pool = nivel == "facil" ? ["AND", "OR", "NOT"] : ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"];
    var certa = escolher(pool);
    var outras = embaralhar(pool.filter(function (g) { return g != certa; }));
    var qtd = nivel == "facil" ? 2 : 3;
    var opcoes = embaralhar([certa].concat(outras.slice(0, qtd)));
    return { tipo: "id", gate: certa, opcoes: opcoes, circ: circuitoDaPorta(certa) };
  }

  function gerarLigar(nivel) {
    var nPortas = nivel == "medio" ? 2 + sortear(2) : 3 + sortear(2);
    var pool = poolDoNivel(nivel);
    for (var t = 0; t < 100; t++) {
      var circ = criarCircuito(nPortas, pool, nivel == "medio" ? 4 : 5);
      var nomes = nomesDas(circ);
      var todas = combinacoes(nomes);
      var meta = sortear(2);
      var alcanca = [];
      for (var i = 0; i < todas.length; i++) {
        if (calcular(circ.raiz, todas[i]) == meta) { alcanca.push(i); }
      }
      if (alcanca.length == 0 || alcanca.length == todas.length) { continue; }
      var inicio;
      for (var q = 0; q < 20; q++) {
        inicio = todas[sortear(todas.length)];
        if (calcular(circ.raiz, inicio) != meta) { break; }
      }
      if (calcular(circ.raiz, inicio) == meta) { continue; }
      return { tipo: "ligar", circ: circ, meta: meta, vals: JSON.parse(JSON.stringify(inicio)), toques: 0 };
    }
    return gerarLigar(nivel);
  }

  function tabelaDoCircuito(circ, trocaPorta) {
    var nomes = nomesDas(circ);
    var linhas = combinacoes(nomes);
    var saidas = [];
    for (var i = 0; i < linhas.length; i++) { saidas.push(calcular(circ.raiz, linhas[i], trocaPorta)); }
    return { nomes: nomes, linhas: linhas, saidas: saidas };
  }

  function gerarFaltando(nivel) {
    var pool2 = ["AND", "OR", "NAND", "NOR", "XOR", "XNOR"];
    for (var t = 0; t < 300; t++) {
      var circ = criarCircuito(2 + sortear(2), ORDEM, 3);
      var duas = circ.portas.filter(function (p) { return p.g != "NOT"; });
      if (duas.length == 0) { continue; }
      var alvo = escolher(duas);
      var real = tabelaDoCircuito(circ);
      // quais trocas dariam a mesma tabela? só aceitamos se todas as erradas forem diferentes
      var erradas = [];
      for (var i = 0; i < pool2.length; i++) {
        if (pool2[i] == alvo.g) { continue; }
        var outra = tabelaDoCircuito(circ, { no: alvo, g: pool2[i] });
        if (outra.saidas.join("") != real.saidas.join("")) { erradas.push(pool2[i]); }
      }
      if (erradas.length < 3) { continue; }
      // saída constante não ensina nada
      if (real.saidas.join("").indexOf("0") < 0 || real.saidas.join("").indexOf("1") < 0) { continue; }
      // o circuito de verdade precisa voltar ao normal
      calcular(circ.raiz, combinacoes(real.nomes)[0]);
      var opcoes = embaralhar([alvo.g].concat(embaralhar(erradas).slice(0, 3)));
      return { tipo: "faltando", circ: circ, alvo: alvo, opcoes: opcoes, tabela: real, certa: alvo.g };
    }
    return gerarFaltando(nivel);
  }

  // ---------- textos de dica (nunca entregam a resposta) ----------
  function dicasDe(d) {
    if (d.tipo == "saida") {
      var primeira = d.circ.portas[0];
      var a = primeira.filhos[0], b = primeira.filhos[1];
      var ent = primeira.filhos.length == 1 ? "A porta " + primeira.g + " recebe " + a.v + "." :
        "A porta " + primeira.g + " recebe " + a.v + " em cima e " + b.v + " embaixo.";
      if (d.circ.portas.length > 1) {
        ent = "Comece pela porta mais à esquerda (" + primeira.g + "): " + (primeira.filhos.length == 1 ? "ela recebe " + a.v + "." : "ela recebe " + a.v + " e " + b.v + ".");
      }
      return ["Siga os fios da esquerda para a direita: resolva primeiro as portas ligadas direto às chaves.",
              "Regra da " + primeira.g + ": " + PORTAS[primeira.g].regra, ent];
    }
    if (d.tipo == "id") {
      return ["Olhe a coluna S: quantas linhas têm saída 1 e quantas têm 0?", PORTAS[d.gate].pista, "Vou riscar uma opção que com certeza está errada."];
    }
    if (d.tipo == "ligar") {
      var raiz = d.circ.raiz;
      return ["Comece pela última porta (" + raiz.g + "), a que liga na lâmpada: o que ela precisa receber?",
              "Regra da " + raiz.g + ": " + PORTAS[raiz.g].regra,
              "Mude uma chave por vez e veja quais fios mudam de cor até chegar na portinha final."];
    }
    var al = d.alvo;
    return ["Teste uma opção por vez: ponha a porta no lugar do '?' e confira se TODAS as linhas da tabela batem.",
            "Procure uma linha em que as entradas da porta escondida sejam diferentes entre si (por exemplo 1 e 0): ela separa muitas portas.",
            "Vou riscar uma opção que com certeza está errada."];
  }

  // ---------- desenho da fase ----------
  function pergunta(d) {
    if (d.tipo == "saida") { return "Qual valor chega na lâmpada S? Os fios que brilham valem 1."; }
    if (d.tipo == "id") { return "Esta é a tabela-verdade de uma porta. Qual porta é essa?"; }
    if (d.tipo == "ligar") { return "Ligue e desligue as chaves (toque nelas) para deixar a lâmpada " + (d.meta ? "ACESA (1)" : "APAGADA (0)") + "."; }
    return "Uma porta está escondida no '?'. Qual porta faz a tabela inteira bater?";
  }

  function desenharFase() {
    var d = PJ.d;
    var N = NIVEIS[PJ.nivel];
    el("pt-titulo-fase").textContent = N.nome + " · Fase " + PJ.fase + " de " + PJ.total;
    var pr = "";
    for (var i = 1; i <= PJ.total; i++) {
      pr += '<span class="ponto' + (i < PJ.fase ? " feito" : (i == PJ.fase ? " atual" : "")) + '"></span>';
    }
    el("pt-progresso").innerHTML = pr;
    el("pt-pergunta").textContent = pergunta(d);
    el("pt-dicabox").className = "pt-dicabox oculto";
    el("pt-proxima").classList.add("oculto");
    el("pt-dica").disabled = false;
    el("pt-dica").classList.remove("oculto");

    var palco = el("pt-circuito"), tab = el("pt-tabela"), op = el("pt-opcoes");
    tab.innerHTML = ""; op.innerHTML = "";
    tab.classList.add("oculto");

    if (d.tipo == "saida") {
      calcular(d.circ.raiz, d.vals);
      palco.innerHTML = svgCircuito(d.circ, { valores: true, mostrar: false, nomes: true, lampada: null });
      op.innerHTML = '<button class="btn btn-resp" data-resp="0"><b>0</b><small>apagada</small></button><button class="btn btn-resp" data-resp="1"><b>1</b><small>acesa</small></button>';
    } else if (d.tipo == "id") {
      var P = PORTAS[d.gate];
      var nomes = nomesDas(d.circ);
      palco.innerHTML = '<div class="id-palco"><div class="id-porta">' + svgPortaIsolada("?") + '</div></div>';
      tab.classList.remove("oculto");
      tab.innerHTML = htmlTabela(nomes, combinacoes(nomes), function (l) { return P.f(l.A, l.B); });
      for (var i2 = 0; i2 < d.opcoes.length; i2++) {
        var g = d.opcoes[i2];
        op.innerHTML += '<button class="btn btn-resp btn-porta" data-resp="' + g + '">' + svgPortaMini(g) + "<b>" + g + "</b><small>" + PORTAS[g].pt + "</small></button>";
      }
    } else if (d.tipo == "ligar") {
      calcular(d.circ.raiz, d.vals);
      palco.innerHTML = svgCircuito(d.circ, { valores: true, mostrar: true, chave: true, nomes: true });
    } else {
      palco.innerHTML = svgCircuito(d.circ, { valores: false, mostrar: false, nomes: true, oculta: d.alvo, lampada: null });
      tab.classList.remove("oculto");
      tab.innerHTML = htmlTabela(d.tabela.nomes, d.tabela.linhas, function (l) {
        for (var i3 = 0; i3 < d.tabela.linhas.length; i3++) { if (d.tabela.linhas[i3] === l) { return d.tabela.saidas[i3]; } }
      });
      for (var i4 = 0; i4 < d.opcoes.length; i4++) {
        var g2 = d.opcoes[i4];
        op.innerHTML += '<button class="btn btn-resp btn-porta" data-resp="' + g2 + '">' + svgPortaMini(g2) + "<b>" + g2 + "</b><small>" + PORTAS[g2].pt + "</small></button>";
      }
    }
    palco.classList.remove("balanca");
  }

  function svgPortaIsolada() {
    return '<svg class="circuito" viewBox="0 0 110 70" xmlns="http://www.w3.org/2000/svg"><path class="fio neutro" d="M0,22 H30 M0,48 H30 M94,35 H110"/>' +
      corpoPorta("AND", 30, 35, true) + "</svg>";
  }

  // ---------- respostas ----------
  function responder(resp) {
    if (!PJ || PJ.resolvido) { return; }
    var d = PJ.d;
    var certo;
    if (d.tipo == "saida") { certo = (parseInt(resp, 10) === d.resp); }
    else if (d.tipo == "id") { certo = (resp == d.gate); }
    else { certo = (resp == d.certa); }
    if (certo) { acertou(resp); } else { errou(resp); }
  }

  function marcarBotao(resp, classe) {
    var bs = el("pt-opcoes").querySelectorAll("[data-resp]");
    for (var i = 0; i < bs.length; i++) {
      if (bs[i].getAttribute("data-resp") == String(resp)) {
        bs[i].classList.remove("errado", "certo");
        void bs[i].offsetWidth;
        bs[i].classList.add(classe);
      }
    }
  }

  function errou(resp) {
    PJ.erros++;
    PJ.limpo = false;
    marcarBotao(resp, "errado");
    if (PJ.d.tipo != "saida") {
      var b = el("pt-opcoes").querySelector('[data-resp="' + resp + '"]');
      if (b) { b.disabled = true; }
    }
    somTocar("erro");
    Fx.tremer(0.4);
    mostrarDica(Math.min(3, Math.max(PJ.dicaAtual, PJ.erros)));
    falar(escolher(falas.erro), "triste");
  }

  function mostrarDica(n) {
    var d = PJ.d;
    var txt = dicasDe(d);
    if (n > 3) { n = 3; }
    if (n <= PJ.dicaAtual && el("pt-dicabox").className.indexOf("oculto") < 0) { return; }
    PJ.dicaAtual = Math.max(PJ.dicaAtual, n);
    var html = "";
    for (var i = 0; i < PJ.dicaAtual; i++) {
      html += '<p class="dica-linha"><b>' + (i + 1) + '</b><span>' + txt[i] + "</span></p>";
    }
    el("pt-dicabox").innerHTML = '<div class="dica-titulo">Dica da Lumia</div>' + html;
    el("pt-dicabox").className = "pt-dicabox";
    if (PJ.dicaAtual >= 3 && (d.tipo == "id" || d.tipo == "faltando")) { riscarUma(); }
    if (PJ.dicaAtual >= 3) { el("pt-dica").disabled = true; }
    somTocar("dica");
  }

  function riscarUma() {
    var d = PJ.d;
    var certa = d.tipo == "id" ? d.gate : d.certa;
    var bs = el("pt-opcoes").querySelectorAll("[data-resp]:not([disabled])");
    var cand = [];
    for (var i = 0; i < bs.length; i++) { if (bs[i].getAttribute("data-resp") != certa) { cand.push(bs[i]); } }
    if (cand.length > 1) {
      var b = escolher(cand);
      b.disabled = true;
      b.classList.add("riscado");
    }
  }

  function pedirDica() {
    if (!PJ || PJ.resolvido || PJ.dicaAtual >= 3) { return; }
    PJ.limpo = false;
    mostrarDica(PJ.dicaAtual + 1);
  }

  function explicacao(d) {
    var s = "";
    if (d.tipo == "saida" || d.tipo == "ligar") {
      var portas = d.circ.portas;
      s += '<div class="dica-titulo">Passo a passo</div>';
      for (var i = 0; i < portas.length; i++) {
        s += '<p class="dica-linha"><b>' + (i + 1) + "</b><span>" + expressao(portas[i], true) + " = <strong>" + portas[i].v + "</strong></span></p>";
      }
      var ult = portas[portas.length - 1];
      s += '<p class="dica-linha regra"><b>i</b><span>' + ult.g + ": " + PORTAS[ult.g].regra + "</span></p>";
    } else {
      var g = d.tipo == "id" ? d.gate : d.certa;
      s += '<div class="dica-titulo">É a porta ' + g + " (" + PORTAS[g].pt + ")</div>" +
        '<p class="dica-linha regra"><b>i</b><span>' + PORTAS[g].regra + "</span></p>" +
        '<p class="dica-linha regra"><b>★</b><span>' + PORTAS[g].vida + "</span></p>";
    }
    return s;
  }

  function acertou(resp) {
    var d = PJ.d;
    PJ.resolvido = true;
    if (PJ.limpo) { PJ.limpas++; }
    var cr = PJ.limpo ? 3 : 1;
    Perfil.ganharCristais(cr);
    var subiu = Perfil.ganharXp(PJ.limpo ? 8 : 4);
    Perfil.desenhar();
    somTocar("acerto");
    somTocar("cristal");
    Fx.confete(window.innerWidth, 40);
    falar(escolher(falas.acerto), "feliz");

    if (d.tipo != "ligar") { marcarBotao(resp, "certo"); }
    var palco = el("pt-circuito");
    if (d.tipo == "saida") {
      palco.innerHTML = svgCircuito(d.circ, { valores: true, mostrar: true, atrasos: true, nomes: true });
    } else if (d.tipo == "faltando") {
      palco.innerHTML = svgCircuito(d.circ, { valores: false, mostrar: false, nomes: true, lampada: null });
      // mostra o circuito inteiro funcionando com uma linha da tabela
      var ex = d.tabela.linhas[d.tabela.linhas.length - 1];
      calcular(d.circ.raiz, ex);
      palco.innerHTML = svgCircuito(d.circ, { valores: true, mostrar: true, atrasos: true, nomes: true });
    } else if (d.tipo == "id") {
      var ex2 = { A: 1, B: 1 };
      calcular(d.circ.raiz, ex2);
      palco.innerHTML = '<div class="id-palco certo">' + svgCircuito(d.circ, { valores: true, mostrar: true, atrasos: true, nomes: true, chave: false }) + "</div>";
    }
    // texto de explicação
    var box = el("pt-dicabox");
    box.className = "pt-dicabox certo";
    box.innerHTML = explicacao(d) + '<p class="ganho">+' + cr + " cristais" + (PJ.limpo ? " · sem dicas!" : "") + "</p>";
    el("pt-dica").classList.add("oculto");
    var prox = el("pt-proxima");
    prox.classList.remove("oculto");
    prox.textContent = PJ.fase >= PJ.total ? "Ver resultado" : "Próxima fase";
  }

  function cliqueChave(ev) {
    if (!PJ || PJ.resolvido || PJ.d.tipo != "ligar" || PJ.d.travado) { return; }
    var alvo = ev.target;
    while (alvo && alvo !== el("pt-circuito") && !(alvo.getAttribute && alvo.getAttribute("data-chave"))) { alvo = alvo.parentNode; }
    if (!alvo || !alvo.getAttribute) { return; }
    var nome = alvo.getAttribute("data-chave");
    if (!nome) { return; }
    var d = PJ.d;
    d.vals[nome] = d.vals[nome] ? 0 : 1;
    d.toques++;
    somTocar("tecla");
    var saida = calcular(d.circ.raiz, d.vals);
    el("pt-circuito").innerHTML = svgCircuito(d.circ, { valores: true, mostrar: true, chave: true, nomes: true });
    if (saida == d.meta) {
      d.travado = true; // trava as chaves enquanto a lâmpada acende
      // o jogador chegou lá: avisa depois de um respiro, para ver a lâmpada mudar
      setTimeout(function () {
        if (PJ && PJ.d === d && !PJ.resolvido) {
          acertou(null);
          el("pt-circuito").innerHTML = svgCircuito(d.circ, { valores: true, mostrar: true, nomes: true, atrasos: true });
        }
      }, 450);
    }
  }

  function terminar() {
    var acertosLimpos = PJ.limpas;
    var est = acertosLimpos >= 5 ? 3 : (acertosLimpos >= 3 ? 2 : 1);
    var d = Perfil.dados.portas;
    var antes = d[PJ.nivel] || 0;
    if (est > antes) { d[PJ.nivel] = est; }
    var bonus = est * 2;
    Perfil.ganharCristais(bonus);
    Perfil.ganharXp(est * 10);
    Perfil.salvar();
    Perfil.desenhar();
    somTocar("vitoria");
    Fx.confete(window.innerWidth, 110);
    el("pt-jogo").classList.add("oculto");
    var R = el("pt-resumo");
    R.classList.remove("oculto");
    var N = NIVEIS[PJ.nivel];
    var msg = est == 3 ? "Você é uma porta lógica ambulante!" : (est == 2 ? "Muito bem! Mais um pouco e fica perfeito." : "Terminou! Treine de novo para ganhar mais estrelas.");
    el("pt-resumo-titulo").textContent = "Nível " + N.nome + " completo!";
    el("pt-resumo-estrelas").innerHTML = estrelasHtml(est);
    el("pt-resumo-texto").innerHTML = msg + "<br><b>" + acertosLimpos + " de " + PJ.total + "</b> fases sem usar dicas ou errar · <b>+" + bonus + "</b> cristais";
    falar(msg, est >= 2 ? "feliz" : "normal");
    montarNiveis();
  }

  // ---------- Lumia (animada ao lado das fases) ----------
  var lum = { g: null, t: 0, estado: "parado", olhos: "normal", ate: 0, ativo: false, fala: "", falaAte: 0 };

  function falar(texto, humor) {
    lum.falaAte = lum.t + 6;
    lum.fala = texto;
    if (humor == "feliz") { lum.estado = "festa"; lum.olhos = "feliz"; lum.ate = lum.t + 1.6; }
    else if (humor == "triste") { lum.estado = "dano"; lum.olhos = "triste"; lum.ate = lum.t + 1.1; }
    var f = el("pt-fala");
    if (f) { f.textContent = texto; f.classList.remove("pop"); void f.offsetWidth; f.classList.add("pop"); }
  }

  function laco() {
    if (!lum.ativo) { return; }
    lum.t += 0.016;
    if (lum.t > lum.ate) { lum.estado = "parado"; lum.olhos = "normal"; }
    var c = el("pt-lumia");
    if (c && c.offsetParent !== null) {
      if (!lum.g) { lum.g = c.getContext("2d"); }
      var g = lum.g;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, c.width, c.height);
      desenharLumia(g, c.width / 2, c.height - 14, 0.62, lum.t, { estado: lum.estado, luz: 0.9, olhos: lum.olhos, virar: 1, cast: 0, dano: lum.estado == "dano" ? 0.6 : 0 });
    }
    requestAnimationFrame(laco);
  }

  // ---------- abas e ligações ----------
  function aba(nome) {
    el("pt-aba-aprender").classList.toggle("ativa", nome == "aprender");
    el("pt-aba-fases").classList.toggle("ativa", nome == "fases");
    el("pt-aprender").classList.toggle("oculto", nome != "aprender");
    el("pt-fases").classList.toggle("oculto", nome != "fases");
    somTocar("clique");
    if (nome == "fases" && !PJ) { montarNiveis(); }
  }

  function abrir() {
    if (!Perfil.dados.portas) { Perfil.dados.portas = {}; }
    if (!el("pt-guia").children.length) { montarGuia(); }
    montarNiveis();
    sairDoNivel();
    aba("aprender");
    if (!lum.ativo) { lum.ativo = true; requestAnimationFrame(laco); }
    falar("Toque nas chaves para ver como cada porta reage.", "normal");
  }

  function fechar() {
    lum.ativo = false;
  }

  function tecla(ev) {
    if (!PJ || el("pt-jogo").classList.contains("oculto")) { return; }
    if ((ev.key == "Enter" || ev.key == " ") && PJ.resolvido) { ev.preventDefault(); el("pt-proxima").click(); return; }
    if (PJ.resolvido) { return; }
    if (ev.key == "h" || ev.key == "H") { pedirDica(); return; }
    var bs = el("pt-opcoes").querySelectorAll("[data-resp]");
    if (PJ.d.tipo == "saida" && (ev.key == "0" || ev.key == "1")) { responder(ev.key); return; }
    var n = parseInt(ev.key, 10);
    if (PJ.d.tipo != "saida" && n >= 1 && n <= bs.length && !bs[n - 1].disabled) { responder(bs[n - 1].getAttribute("data-resp")); }
  }

  function ligar() {
    el("pt-aba-aprender").onclick = function () { aba("aprender"); };
    el("pt-aba-fases").onclick = function () { aba("fases"); };
    el("pt-guia").addEventListener("click", cliqueGuia);
    el("pt-niveis").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-nivel]");
      if (b) { iniciarNivel(b.getAttribute("data-nivel")); }
    });
    el("pt-opcoes").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-resp]");
      if (b && !b.disabled) { responder(b.getAttribute("data-resp")); }
    });
    el("pt-circuito").addEventListener("click", cliqueChave);
    el("pt-dica").onclick = function () { pedirDica(); };
    el("pt-proxima").onclick = function () { somTocar("clique"); proximaFase(); };
    el("pt-sair").onclick = function () { somTocar("clique"); sairDoNivel(); };
    el("pt-resumo-repetir").onclick = function () { somTocar("clique"); iniciarNivel(PJ ? PJ.nivel : "facil"); };
    el("pt-resumo-niveis").onclick = function () { somTocar("clique"); sairDoNivel(); };
  }

  return { abrir: abrir, fechar: fechar, tecla: tecla, ligar: ligar, aba: aba };
})();
