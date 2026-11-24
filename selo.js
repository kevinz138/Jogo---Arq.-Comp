// =====================================================
// SELO RÚNICO - a cruzadinha do jogo.
// Digite as letras direto nas casas. Conferir mostra quais palavras estão certas ou erradas.
// =====================================================

var Selo = (function () {
  var cel = {};        // casas do tabuleiro: "linha,coluna" -> { r, c, letra, user, dada, marca, palavras, num, el }
  var lista = [];      // as 16 palavras do tabuleiro
  var sel = null;      // casa selecionada
  var dir = "H";
  var marcas = [];     // por palavra: "" | "certa" | "errada"
  var feitas = 0;
  var montado = false;
  var custoLetra = 5;

  function chave(r, c) {
    return r + "," + c;
  }

  // ---------- gerador de cruzadinhas: cada tabuleiro é diferente ----------
  var tabuleiroFixo = tabuleiro; // plano B, caso o sorteio não consiga encaixar tudo

  function sortear(n) { return Math.floor(Math.random() * n); }

  function podeColocar(grade, w, r0, c0, d) {
    var dr = d == "V" ? 1 : 0, dc = d == "H" ? 1 : 0;
    var antes = grade[(r0 - dr) + "," + (c0 - dc)];
    var depois = grade[(r0 + dr * w.length) + "," + (c0 + dc * w.length)];
    if (antes || depois) { return -1; }
    var cruz = 0;
    for (var k = 0; k < w.length; k++) {
      var r = r0 + dr * k, c = c0 + dc * k;
      var g = grade[r + "," + c];
      if (g) {
        if (g.ch != w.charAt(k) || g.dirs[d]) { return -1; }
        cruz++;
      } else if (grade[(r + dc) + "," + (c + dr)] || grade[(r - dc) + "," + (c - dr)]) {
        return -1;
      }
    }
    return cruz;
  }

  function colocar(grade, w, r0, c0, d) {
    for (var k = 0; k < w.length; k++) {
      var key = (r0 + (d == "V" ? k : 0)) + "," + (c0 + (d == "H" ? k : 0));
      if (!grade[key]) { grade[key] = { ch: w.charAt(k), dirs: {} }; }
      grade[key].dirs[d] = true;
    }
  }

  function tamanhoDaGrade(grade) {
    var r0 = 1e9, r1 = -1e9, c0 = 1e9, c1 = -1e9;
    for (var k in grade) {
      var p = k.split(",");
      var r = +p[0], c = +p[1];
      r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c);
    }
    return { r0: r0, c0: c0, lin: r1 - r0 + 1, col: c1 - c0 + 1 };
  }

  function tentarCruzadinha(textos) {
    var ordem = textos.map(function (t) { return { t: t, k: t.length + Math.random() * 5 }; })
      .sort(function (a, b) { return b.k - a.k; }).map(function (o) { return o.t; });
    var grade = {}, postas = [];
    var d0 = Math.random() < 0.5 ? "H" : "V";
    colocar(grade, ordem[0], 0, 0, d0);
    postas.push({ p: ordem[0], r: 0, c: 0, d: d0 });
    for (var i = 1; i < ordem.length; i++) {
      var w = ordem[i];
      var melhor = null, melhorNota = 1e9;
      for (var d = 0; d < 2; d++) {
        var dir = d == 0 ? "H" : "V";
        for (var key in grade) {
          var pos = key.split(",");
          for (var k = 0; k < w.length; k++) {
            if (grade[key].ch != w.charAt(k)) { continue; }
            var r0 = +pos[0] - (dir == "V" ? k : 0);
            var c0 = +pos[1] - (dir == "H" ? k : 0);
            var cruz = podeColocar(grade, w, r0, c0, dir);
            if (cruz < 1) { continue; }
            colocar(grade, w, r0, c0, dir);
            var t = tamanhoDaGrade(grade);
            // desfaz: refaz a grade sem essa palavra
            var nota = Math.max(t.lin, t.col) * 3 + t.lin * t.col / 20 - cruz * 2 + Math.random() * 6;
            for (var u = 0; u < w.length; u++) {
              var kk = (r0 + (dir == "V" ? u : 0)) + "," + (c0 + (dir == "H" ? u : 0));
              delete grade[kk].dirs[dir];
              if (!grade[kk].dirs.H && !grade[kk].dirs.V) { delete grade[kk]; }
            }
            if (nota < melhorNota) { melhorNota = nota; melhor = { p: w, r: r0, c: c0, d: dir }; }
          }
        }
      }
      if (!melhor) { return null; }
      colocar(grade, melhor.p, melhor.r, melhor.c, melhor.d);
      postas.push(melhor);
    }
    var tam = tamanhoDaGrade(grade);
    if (tam.lin > 18 || tam.col > 18) { return null; }
    for (var j = 0; j < postas.length; j++) { postas[j].r -= tam.r0; postas[j].c -= tam.c0; }
    return { linhas: tam.lin, colunas: tam.col, palavras: postas, area: tam.lin * tam.col };
  }

  function gerarTabuleiro() {
    var textos = tabuleiroFixo.palavras.map(function (w) { return w.p; });
    var melhor = null;
    for (var t = 0; t < 150; t++) {
      var r = tentarCruzadinha(textos);
      if (r && (!melhor || r.area < melhor.area)) { melhor = r; }
      if (melhor && t >= 12) { break; }
    }
    return melhor || tabuleiroFixo;
  }

  function semProgresso() {
    for (var k in cel) {
      if (cel[k].user || cel[k].dada) { return false; }
    }
    return true;
  }

  function montarDados() {
    cel = {};
    lista = [];
    for (var i = 0; i < tabuleiro.palavras.length; i++) {
      var w = tabuleiro.palavras[i];
      var item = { p: w.p, r: w.r, c: w.c, d: w.d, idx: indiceDaResposta(w.p), cels: [], num: 0 };
      for (var k = 0; k < w.p.length; k++) {
        var r = w.r + (w.d == "V" ? k : 0);
        var c = w.c + (w.d == "H" ? k : 0);
        var key = chave(r, c);
        if (!cel[key]) {
          cel[key] = { r: r, c: c, letra: w.p.charAt(k), user: "", dada: false, marca: "", palavras: [], num: 0, el: null };
        }
        cel[key].palavras.push(i);
        item.cels.push(key);
      }
      lista.push(item);
    }
    // numeração: pela ordem de leitura (de cima para baixo, esquerda para direita)
    var inicios = {};
    var chaves = [];
    for (var j = 0; j < lista.length; j++) {
      var k0 = chave(lista[j].r, lista[j].c);
      if (!inicios[k0]) {
        inicios[k0] = true;
        chaves.push(k0);
      }
    }
    chaves.sort(function (a, b) {
      var A = cel[a], B = cel[b];
      return A.r - B.r || A.c - B.c;
    });
    for (var n = 0; n < chaves.length; n++) {
      cel[chaves[n]].num = n + 1;
    }
    for (var m = 0; m < lista.length; m++) {
      lista[m].num = cel[chave(lista[m].r, lista[m].c)].num;
    }
    marcas = [];
    for (var z = 0; z < lista.length; z++) {
      marcas.push("");
    }
    feitas = 0;
  }

  function tamanhoCasa() {
    var caixa = $("selo-grade-caixa");
    var disp = Math.max(240, (caixa.clientWidth || window.innerWidth) - 16);
    var porLargura = Math.floor((disp - 3 * (tabuleiro.colunas - 1)) / tabuleiro.colunas);
    var tam = porLargura;
    if (window.innerWidth > 760) {
      // em telas largas a grade fica ao lado das pistas: limita também pela altura
      var porAltura = Math.floor((window.innerHeight - 250 - 3 * (tabuleiro.linhas - 1)) / tabuleiro.linhas);
      tam = Math.min(tam, porAltura);
    }
    return Math.max(22, Math.min(44, tam));
  }

  function montarGrade() {
    var g = $("selo-grade");
    g.innerHTML = "";
    var tam = tamanhoCasa();
    g.style.setProperty("--cel", tam + "px");
    g.style.gridTemplateColumns = "repeat(" + tabuleiro.colunas + ", " + tam + "px)";
    for (var r = 0; r < tabuleiro.linhas; r++) {
      for (var c = 0; c < tabuleiro.colunas; c++) {
        var d = cel[chave(r, c)];
        var b = document.createElement("button");
        if (!d) {
          b.className = "celula vazia";
          b.tabIndex = -1;
        } else {
          b.className = "celula";
          b.setAttribute("data-k", chave(r, c));
          b.onclick = clicouCasa;
          d.el = b;
        }
        g.appendChild(b);
      }
    }
  }

  function montarListas() {
    var h = $("selo-lista-h"), v = $("selo-lista-v");
    h.innerHTML = ""; v.innerHTML = "";
    var ordenadas = [];
    for (var i = 0; i < lista.length; i++) {
      ordenadas.push(i);
    }
    ordenadas.sort(function (a, b) { return lista[a].num - lista[b].num; });
    for (var k = 0; k < ordenadas.length; k++) {
      var w = lista[ordenadas[k]];
      var li = document.createElement("li");
      li.setAttribute("data-w", ordenadas[k]);
      li.innerHTML = "<b>" + w.num + '</b><span>' + palavras[w.idx].pistas[0] + " <small>(" + w.p.length + " letras)</small></span>";
      li.onclick = function () {
        selecionarPalavra(parseInt(this.getAttribute("data-w"), 10));
        somTocar("runa");
      };
      (w.d == "H" ? h : v).appendChild(li);
    }
  }

  function palavraAtual() {
    if (!sel) {
      return -1;
    }
    var d = cel[chave(sel.r, sel.c)];
    for (var i = 0; i < d.palavras.length; i++) {
      if (lista[d.palavras[i]].d == dir) {
        return d.palavras[i];
      }
    }
    return d.palavras[0];
  }

  function selecionarPalavra(i) {
    var w = lista[i];
    dir = w.d;
    // vai para a primeira casa ainda vazia da palavra (ou a primeira)
    var alvo = w.cels[0];
    for (var k = 0; k < w.cels.length; k++) {
      if (!cel[w.cels[k]].user) {
        alvo = w.cels[k];
        break;
      }
    }
    sel = { r: cel[alvo].r, c: cel[alvo].c };
    atualizar();
    focarEntrada();
  }

  function clicouCasa() {
    var d = cel[this.getAttribute("data-k")];
    var mesma = sel && sel.r == d.r && sel.c == d.c;
    sel = { r: d.r, c: d.c };
    var tem = { H: false, V: false };
    for (var i = 0; i < d.palavras.length; i++) {
      tem[lista[d.palavras[i]].d] = true;
    }
    if (mesma && tem.H && tem.V) {
      dir = dir == "H" ? "V" : "H";
    } else if (!tem[dir]) {
      dir = tem.H ? "H" : "V";
    }
    somTocar("runa");
    atualizar();
    focarEntrada();
  }

  function focarEntrada() {
    try {
      $("selo-input").focus({ preventScroll: true });
    } catch (e) { /* tudo bem */ }
  }

  function proximaCasa(passo) {
    var w = lista[palavraAtual()];
    var pos = w.cels.indexOf(chave(sel.r, sel.c));
    var np = pos + passo;
    if (np >= 0 && np < w.cels.length) {
      var d = cel[w.cels[np]];
      sel = { r: d.r, c: d.c };
    }
  }

  function digitar(letra) {
    if (!sel) {
      UI.toast("Toque em uma casa primeiro.");
      return;
    }
    var d = cel[chave(sel.r, sel.c)];
    if (!d.dada) {
      d.user = letra;
      limparMarcasDaCasa(d);
      somTocar("tecla");
      d.el.classList.remove("bate");
      void d.el.offsetWidth;
      d.el.classList.add("bate");
    }
    proximaCasa(1);
    atualizar();
  }

  function apagar() {
    if (!sel) { return; }
    var d = cel[chave(sel.r, sel.c)];
    if (d.user && !d.dada) {
      d.user = "";
      limparMarcasDaCasa(d);
    } else {
      proximaCasa(-1);
      var d2 = cel[chave(sel.r, sel.c)];
      if (!d2.dada) {
        d2.user = "";
        limparMarcasDaCasa(d2);
      }
    }
    atualizar();
  }

  // se a pessoa mexe em uma casa, a conferência antiga daquela palavra some
  function limparMarcasDaCasa(d) {
    d.marca = "";
    for (var i = 0; i < d.palavras.length; i++) {
      marcas[d.palavras[i]] = "";
      for (var k = 0; k < lista[d.palavras[i]].cels.length; k++) {
        var o = cel[lista[d.palavras[i]].cels[k]];
        if (o.marca == "errada") {
          o.marca = "";
        }
      }
    }
  }

  function mover(dr, dc) {
    if (!sel) { return; }
    var d = cel[chave(sel.r + dr, sel.c + dc)];
    if (d) {
      sel = { r: d.r, c: d.c };
      var tem = false;
      for (var i = 0; i < d.palavras.length; i++) {
        if (lista[d.palavras[i]].d == dir) { tem = true; }
      }
      if (!tem) {
        dir = dir == "H" ? "V" : "H";
      }
      atualizar();
    }
  }

  function tecla(ev) {
    if (UI.algumAberto()) { return; }
    var k = ev.key;
    if (/^[a-zA-Z]$/.test(k) && !ev.ctrlKey && !ev.metaKey) {
      ev.preventDefault();
      digitar(k.toUpperCase());
    } else if (k == "Backspace") {
      ev.preventDefault();
      apagar();
    } else if (k == "ArrowRight") { ev.preventDefault(); mover(0, 1); }
    else if (k == "ArrowLeft") { ev.preventDefault(); mover(0, -1); }
    else if (k == "ArrowDown") { ev.preventDefault(); mover(1, 0); }
    else if (k == "ArrowUp") { ev.preventDefault(); mover(-1, 0); }
    else if (k == "Enter") { ev.preventDefault(); conferir(); }
    else if (k == " ") { ev.preventDefault(); if (sel) { dir = dir == "H" ? "V" : "H"; atualizar(); } }
  }

  function conferir() {
    somTocar("clique");
    var certas = 0, vazias = 0;
    // zera marcas antigas
    for (var key in cel) { cel[key].marca = ""; }
    for (var i = 0; i < lista.length; i++) {
      var w = lista[i];
      var ok = true, algo = false;
      for (var k = 0; k < w.cels.length; k++) {
        var d = cel[w.cels[k]];
        if (d.user) { algo = true; }
        if (d.user != d.letra) { ok = false; }
      }
      if (ok) {
        marcas[i] = "certa";
        certas++;
        for (var a = 0; a < w.cels.length; a++) { cel[w.cels[a]].marca = "certa"; }
      } else if (algo) {
        marcas[i] = "errada";
      } else {
        marcas[i] = "";
        vazias++;
      }
    }
    // casas erradas: pinta só as que estão em palavras erradas e não pertencem a uma palavra certa
    for (var j = 0; j < lista.length; j++) {
      if (marcas[j] == "errada") {
        for (var m = 0; m < lista[j].cels.length; m++) {
          var c = cel[lista[j].cels[m]];
          if (c.marca != "certa" && c.user && c.user != c.letra) { c.marca = "errada"; }
        }
      }
    }
    feitas = certas;
    atualizar();
    if (certas == lista.length) {
      vitoria();
    } else if (certas > 0) {
      somTocar("acerto");
      UI.toast(certas + " de " + lista.length + " palavras certas. Toque numa palavra vermelha e veja a dica.");
    } else {
      somTocar("erro");
      UI.toast("Ainda nenhuma palavra completa. Use as pistas, com calma!");
    }
  }

  function vitoria() {
    somTocar("vitoria");
    var extra = "";
    if (!Perfil.dados.seloPremio) {
      Perfil.dados.seloPremio = true;
      Perfil.ganharCristais(10);
      Perfil.ganharXp(30);
      extra = " +10 cristais e +30 XP!";
      UI.hudCristais(Perfil.dados.cristais);
    }
    UI.toast("Selo Rúnico completo!" + extra, 4500);
    var i = 0;
    for (var key in cel) {
      (function (d, atraso) {
        setTimeout(function () {
          d.el.classList.remove("bate");
          void d.el.offsetWidth;
          d.el.classList.add("bate");
        }, atraso);
      })(cel[key], (i++) * 25);
    }
  }

  function revelarLetra() {
    if (!sel) {
      UI.toast("Toque em uma casa para revelar a letra dela.");
      return;
    }
    var d = cel[chave(sel.r, sel.c)];
    if (d.dada || d.user == d.letra) {
      UI.toast("Essa casa já está certa.");
      return;
    }
    if (!Perfil.gastarCristais(custoLetra)) {
      UI.toast("Faltam cristais. Cace bugs na Arena para ganhar mais!");
      somTocar("erro");
      return;
    }
    d.user = d.letra;
    d.dada = true;
    limparMarcasDaCasa(d);
    somTocar("cristal");
    Perfil.desenhar();
    atualizar();
  }

  function reiniciar() {
    for (var key in cel) {
      cel[key].user = ""; cel[key].dada = false; cel[key].marca = "";
    }
    for (var i = 0; i < marcas.length; i++) { marcas[i] = ""; }
    feitas = 0;
    sel = null;
    dir = "H";
    atualizar();
  }

  function atualizar() {
    var atual = palavraAtual();
    var noAtual = {};
    if (atual >= 0) {
      for (var k = 0; k < lista[atual].cels.length; k++) { noAtual[lista[atual].cels[k]] = true; }
    }
    for (var key in cel) {
      var d = cel[key];
      var el = d.el;
      var classes = "celula";
      if (noAtual[key]) { classes += " palavra"; }
      if (sel && sel.r == d.r && sel.c == d.c) { classes += " sel"; }
      if (d.marca) { classes += " " + d.marca; }
      el.className = classes;
      el.innerHTML = (d.num ? '<span class="num">' + d.num + "</span>" : "") + d.user;
    }
    var lis = document.querySelectorAll(".lista-pistas li");
    for (var i = 0; i < lis.length; i++) {
      var w = parseInt(lis[i].getAttribute("data-w"), 10);
      lis[i].className = (w == atual ? "ativa " : "") + (marcas[w] || "");
    }
    var contagem = 0;
    for (var m = 0; m < marcas.length; m++) { if (marcas[m] == "certa") { contagem++; } }
    $("selo-contador").textContent = contagem + " de " + lista.length + " palavras";

    var pista = $("selo-pista");
    if (atual < 0) {
      pista.textContent = "Toque em uma casa para começar. Toque de novo para trocar a direção.";
    } else {
      var w2 = lista[atual];
      var txt = w2.num + (w2.d == "H" ? " Horizontal" : " Vertical") + " (" + w2.p.length + " letras): " + palavras[w2.idx].pistas[0];
      if (marcas[atual] == "errada") {
        txt += "  Dica: " + palavras[w2.idx].dicas[0];
      }
      pista.textContent = txt;
    }
  }

  function novoTabuleiro() {
    tabuleiro = gerarTabuleiro();
    sel = null;
    montarDados();
    montarListas();
    montarGrade();
    atualizar();
  }

  function abrir() {
    // cada vez que você chega com o tabuleiro vazio, ele é sorteado de novo
    if (!montado || semProgresso()) {
      tabuleiro = gerarTabuleiro();
      sel = null;
      montarDados();
      montarListas();
      montado = true;
    }
    montarGrade();
    atualizar();
    Perfil.desenhar();
  }

  function ligar() {
    $("selo-conferir").onclick = conferir;
    $("selo-letra").onclick = revelarLetra;
    $("selo-reiniciar").onclick = function () {
      somTocar("clique");
      UI.confirmar("Limpar o tabuleiro?", "Todas as letras serão apagadas.", reiniciar);
    };
    $("selo-novo").onclick = function () {
      somTocar("clique");
      if (semProgresso()) { novoTabuleiro(); return; }
      UI.confirmar("Sortear outro tabuleiro?", "As letras do tabuleiro atual serão perdidas.", novoTabuleiro);
    };
    $("selo-aba-h").onclick = function () { aba("h"); };
    $("selo-aba-v").onclick = function () { aba("v"); };
    $("selo-input").addEventListener("input", function () {
      var v = this.value;
      this.value = "";
      for (var i = 0; i < v.length; i++) {
        if (/[a-zA-Z]/.test(v.charAt(i))) {
          digitar(v.charAt(i).toUpperCase());
        }
      }
    });
    $("selo-input").addEventListener("keydown", function (ev) {
      if (ev.key == "Backspace" || ev.key == "Enter" || ev.key.indexOf("Arrow") == 0) {
        tecla(ev);
      }
    });
    aba("h");
  }

  function aba(qual) {
    $("selo-aba-h").classList.toggle("ativa", qual == "h");
    $("selo-aba-v").classList.toggle("ativa", qual == "v");
    $("selo-lista-h").style.display = qual == "h" ? "" : "none";
    $("selo-lista-v").style.display = qual == "v" ? "" : "none";
  }

  return { abrir: abrir, ligar: ligar, tecla: tecla, redimensionar: function () { if (montado) { montarGrade(); atualizar(); } } };
})();
