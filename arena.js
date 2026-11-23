// =====================================================
// ARENA - o jogo principal.
// A Lumia caminha pelo Abismo, bugs aparecem com plaquinhas de nome na cabeça
// e a pessoa escolhe qual combina com a pista. Errou? Ganha uma dica (nunca a resposta).
// =====================================================

var Arena = (function () {
  var A = {
    ativo: false, terminou: false, modo: "aprendiz",
    estado: "parado", tEstado: 0, relogio: 0, t: 0,
    w: 800, h: 600, retrato: false, chao: 500, u: 1,
    onda: -1, rodada: 0, ordem: [],
    estados: [],          // por palavra: pendente | errou | ajuda | certa
    vidas: 3, combo: 0, melhorCombo: 0, cristaisGanhos: 0, cristaisVisiveis: 0,
    q: null, bichos: [], hover: -1, alvo: -1,
    dicasMostradas: 0, errosPalavra: 0,
    desloc: 0, velDesloc: 14,
    lumia: { x: 120, esc: 1, festaAte: 0, danoAte: 0, cast: 0, luz: 0.3 },
    chama: { x: 150, y: 400 },
    proj: null, fala: null,
    tinta: { de: [0, 0, 0, 0], para: [0, 0, 0, 0], mix: 1 },
    area: { x0: 0, x1: 0, y0: 0, y1: 0, cols: 3, rows: 2, cw: 200, ch: 120 },
    primeiraOnda: []
  };

  // ---------- utilidades ----------
  function aleatorio(n) {
    return Math.floor(Math.random() * n);
  }
  function embaralhar(lista) {
    var l = lista.slice();
    for (var i = l.length - 1; i > 0; i--) {
      var j = aleatorio(i + 1);
      var tmp = l[i]; l[i] = l[j]; l[j] = tmp;
    }
    return l;
  }
  function limitar(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function easeOutBack(x) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
  function lerp(a, b, k) {
    return a + (b - a) * k;
  }
  function lerpCor(a, b, k) {
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)];
  }
  function lerCor(txt) {
    var m = /rgba?\(([^)]+)\)/.exec(txt || "");
    if (!m) {
      return [0, 0, 0, 0];
    }
    var p = m[1].split(",");
    return [+p[0], +p[1], +p[2], p.length > 3 ? +p[3] : 1];
  }
  function palavrasDaOnda(o) {
    var lista = [];
    for (var i = 0; i < palavras.length; i++) {
      if (palavras[i].categoria == ondas[o].categoria) {
        lista.push(i);
      }
    }
    return lista;
  }
  function acertos() {
    var n = 0;
    for (var i = 0; i < palavras.length; i++) {
      if (A.estados[i] == "certa" || A.estados[i] == "ajuda") {
        n++;
      }
    }
    return n;
  }
  function trocar(estado) {
    A.estado = estado;
    A.tEstado = 0;
  }
  function falar(lista, ms) {
    var txt = typeof lista == "string" ? lista : lista[aleatorio(lista.length)];
    A.fala = { txt: txt, ate: A.relogio + (ms || 3.2), ini: A.relogio };
  }

  // ---------- layout (adapta a celular em pé e computador) ----------
  function layout() {
    var W = A.w, H = A.h;
    A.retrato = W < 700 || H > W * 1.05;
    A.chao = H * 0.87;
    var L = A.lumia;
    L.esc = limitar(Math.min(H / 560, W / 700), 0.6, 1.1);
    L.x = A.retrato ? Math.max(48, W * 0.16) : Math.max(90, W * 0.12);

    var nOpc = A.retrato ? 4 : 5;
    var a = A.area;
    a.cols = A.retrato ? 2 : 3;
    a.rows = Math.ceil(nOpc / a.cols);
    a.x0 = A.retrato ? 8 : Math.max(L.x + 80 * L.esc + 10, 300);
    a.x1 = W - 10;
    a.y0 = UI.perguntaFundo() + 8;
    a.y1 = A.retrato ? A.chao - 150 * L.esc - 4 : A.chao - 16;
    a.cw = (a.x1 - a.x0) / a.cols;
    a.ch = (a.y1 - a.y0) / a.rows;
    A.u = limitar(a.cw / 215, 0.72, 1.1);
    A.nOpc = nOpc;
  }

  // posição "de repouso" de cada bug na grade (a última linha fica centralizada)
  function posicaoCelula(i) {
    var a = A.area;
    var n = A.bichos.length || A.nOpc;
    var linha = Math.floor(i / a.cols);
    var col = i % a.cols;
    var naLinha = (linha == a.rows - 1) ? n - linha * a.cols : a.cols;
    var xIni = a.x0 + (a.cols - naLinha) * a.cw / 2;
    var esc = limitar(Math.min((a.ch - 37 * A.u - 10) / 108, a.cw / 150), 0.42, 1.0);
    return {
      x: xIni + col * a.cw + a.cw / 2,
      y: a.y0 + linha * a.ch + 37 * A.u + 8 + 54 * esc,
      esc: esc
    };
  }

  // ---------- perguntas (sorteadas, não dá para decorar) ----------
  function montarPergunta(idx) {
    var p = palavras[idx];
    var tipo = Math.random() < 0.55 ? "pista" : "descricao";
    var nDist = A.nOpc - 1;

    // distratores: primeiro da mesma categoria (mais difícil e mais didático), depois de outras
    var mesma = [], outras = [];
    for (var i = 0; i < palavras.length; i++) {
      if (i == idx) { continue; }
      (palavras[i].categoria == p.categoria ? mesma : outras).push(i);
    }
    mesma = embaralhar(mesma);
    outras = embaralhar(outras);
    var dist = mesma.slice(0, Math.min(3, nDist));
    var resto = embaralhar(mesma.slice(dist.length).concat(outras));
    while (dist.length < nDist) {
      dist.push(resto.shift());
    }
    var opcoes = embaralhar([idx].concat(dist));

    var q = { idx: idx, tipo: tipo, opcoes: opcoes };
    if (tipo == "pista") {
      q.rotulo = "Pista";
      q.texto = p.pistas[aleatorio(p.pistas.length)];
      q.ajuda = "Qual bug carrega o nome certo?";
    } else {
      q.rotulo = "Descrição";
      q.texto = "Qual descrição combina com " + p.nome + "?";
      q.ajuda = "Leia as plaquinhas e escolha uma.";
    }
    return q;
  }

  function textoDaOpcao(q, i) {
    var p = palavras[i];
    return q.tipo == "pista" ? p.curto : (rotulos[p.resposta] || p.curto);
  }

  // ---------- fluxo do jogo ----------
  function iniciar(modo) {
    A.modo = modo;
    A.ativo = true;
    A.terminou = false;
    A.estados = [];
    for (var i = 0; i < palavras.length; i++) {
      A.estados.push("pendente");
    }
    A.onda = -1;
    A.combo = 0;
    A.melhorCombo = 0;
    A.cristaisGanhos = 0;
    A.cristaisVisiveis = Perfil.dados.cristais;
    A.bichos = [];
    A.proj = null;
    A.fala = null;
    A.lumia.festaAte = 0;
    A.lumia.danoAte = 0;
    Fx.limpar();
    UI.perguntaOcultar();
    UI.dicas([]);
    UI.combo(0);
    UI.hudContador(0, palavras.length);
    UI.hudCristais(A.cristaisVisiveis);
    proximaOnda();
  }

  function proximaOnda() {
    A.onda++;
    if (A.onda >= ondas.length) {
      fim();
      return;
    }
    var o = ondas[A.onda];
    A.ordem = embaralhar(palavrasDaOnda(A.onda));
    A.rodada = 0;
    A.vidas = 3;
    A.tinta.de = lerpCor(A.tinta.de, A.tinta.para, A.tinta.mix);
    A.tinta.para = lerCor(o.tinta);
    A.tinta.mix = 0;
    UI.hudOnda(A.onda + 1, ondas.length, o.nome);
    UI.hudVidas(A.vidas, A.modo == "guardia" ? 3 : null);
    UI.perguntaOcultar();
    UI.dicas([]);
    UI.faixaOnda(A.onda + 1, o.nome, o.historia);
    somTocar("onda");
    A.bichos = [];
    trocar("intro");
    layout();
  }

  function repetirOnda() {
    var o = ondas[A.onda];
    var lista = palavrasDaOnda(A.onda);
    for (var i = 0; i < lista.length; i++) {
      A.estados[lista[i]] = "pendente";
    }
    A.ordem = embaralhar(lista);
    A.rodada = 0;
    A.vidas = 3;
    A.combo = 0;
    UI.combo(0);
    UI.hudContador(acertos(), palavras.length);
    UI.hudVidas(A.vidas, 3);
    UI.faixaOnda(A.onda + 1, o.nome, o.historia);
    A.bichos = [];
    trocar("intro");
  }

  function novaRodada() {
    var idx = A.ordem[A.rodada];
    A.q = montarPergunta(idx);
    A.dicasMostradas = 0;
    A.errosPalavra = 0;
    A.bichos = [];
    UI.perguntaOcultar();
    UI.dicas([]);
    UI.combo(A.combo);
    trocar("andando");
  }

  function surgir() {
    var q = A.q;
    UI.pergunta(q.rotulo, q.texto, q.ajuda + " (toque, ou tecla 1 a " + q.opcoes.length + ")");
    layout();
    A.bichos = [];
    for (var i = 0; i < q.opcoes.length; i++) {
      var id = q.opcoes[i];
      A.bichos.push({
        idx: id, texto: textoDaOpcao(q, id), tipo: id % 4, hue: huesCategoria[palavras[id].categoria],
        atraso: 0.25 + i * 0.13, surgiu: false, escala: 0, estado: "normal", vermelho: 0, saida: 0,
        px: 0, py: 0, esc: 1, rect: null, fase: i * 1.9, certo: id == q.idx
      });
    }
    trocar("surgindo");
  }

  function escolher(i) {
    if (A.estado != "jogando" || i < 0 || i >= A.bichos.length) {
      return;
    }
    var b = A.bichos[i];
    if (b.estado != "normal") {
      return;
    }
    A.alvo = i;
    A.proj = null;
    somTocar("clique");
    trocar("disparando");
  }

  function pedirDica() {
    if (A.estado != "jogando") {
      return;
    }
    if (A.dicasMostradas >= 3) {
      UI.toast("Você já viu as 3 dicas desta palavra. Releia a pista com calma!");
      return;
    }
    A.dicasMostradas++;
    UI.dicas(palavras[A.q.idx].dicas.slice(0, A.dicasMostradas));
    somTocar("dica");
    falar(falasLumia.dicaPedida);
    var c = A.chama;
    Fx.estrelas(c.x, c.y, 6, 30);
  }

  function acertou(b) {
    var idx = A.q.idx;
    var primeira = (A.errosPalavra == 0 && A.dicasMostradas == 0);
    A.estados[idx] = primeira ? "certa" : "ajuda";
    if (primeira) {
      A.combo++;
      A.melhorCombo = Math.max(A.melhorCombo, A.combo);
    } else {
      A.combo = 0;
    }
    var xp = primeira ? 10 + Math.min(A.combo - 1, 4) * 2 : 5;
    var cr = primeira ? 3 + (A.combo >= 3 ? 1 : 0) : 1;
    var subiu = Perfil.ganharXp(xp);
    Perfil.ganharCristais(cr);
    Perfil.estudar(idx);
    A.cristaisGanhos += cr;
    A.ganhosAtuais = [{ k: "xp", t: "+" + xp + " XP" }, { k: "cri", t: "+" + cr + " cristais" }];
    if (A.combo >= 2) {
      A.ganhosAtuais.push({ k: "comb", t: "Combo x" + A.combo });
    }
    if (subiu) {
      A.ganhosAtuais.push({ k: "xp", t: "Nível " + Perfil.nivel() + "!" });
    }

    b.estado = "certo";
    somTocar("acerto");
    Fx.anel(b.px, b.py, "255,230,170", 150 * b.esc, 6);
    Fx.anel(b.px, b.py, "150,240,255", 100 * b.esc, 3);
    Fx.faiscas(b.px, b.py, 36, "255,226,140", 320, 1.1);
    Fx.bits(b.px, b.py, 16, "190,255,235");
    Fx.estrelas(b.px, b.py, 8, 60 * b.esc);
    Fx.clarao("255,240,200", 0.35);
    Fx.tremer(0.35);
    var alvo = alvoCristal();
    Fx.cristais(b.px, b.py, cr * 2, alvo, function () {
      A.cristaisVisiveis++;
      UI.hudCristais(Math.min(A.cristaisVisiveis, Perfil.dados.cristais), true);
      somTocar("cristal");
    });
    Fx.texto(b.px, b.py - 70 * b.esc, "+" + xp + " XP", "#ffe9a8", 26);
    if (A.combo >= 2) {
      Fx.texto(b.px, b.py - 100 * b.esc, "COMBO x" + A.combo + "!", "#ffb35c", 30);
      somTocar("combo");
    }
    A.lumia.festaAte = A.relogio + 1.5;
    A.lumia.luz = 0.25 + 0.75 * acertos() / palavras.length;
    falar(A.combo >= 3 ? falasLumia.combo : falasLumia.acerto);
    UI.hudContador(acertos(), palavras.length);
    UI.combo(A.combo);
    UI.dicas([]);
    trocar("resolvendoCerto");
  }

  function alvoCristal() {
    var r = document.getElementById("cristais-hud").getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function errou(b) {
    var idx = A.q.idx;
    if (A.estados[idx] == "pendente") {
      A.estados[idx] = "errou";
    }
    A.errosPalavra++;
    A.combo = 0;
    UI.combo(0);
    b.estado = "errado";
    b.vermelho = 1;
    somTocar("erro");
    Fx.tremer(0.8);
    Fx.clarao("255,60,90", 0.3);
    Fx.faiscas(b.px, b.py, 14, "255,120,140", 200, 0.7);
    Fx.texto(b.px, b.py - 60 * b.esc, "Ainda não!", "#ff9aa8", 24);
    A.lumia.danoAte = A.relogio + 0.7;
    // a dica aparece sozinha: cada erro mostra uma dica mais forte (nunca a resposta)
    A.dicasMostradas = Math.max(A.dicasMostradas, Math.min(3, A.errosPalavra));
    UI.dicas(palavras[A.q.idx].dicas.slice(0, A.dicasMostradas));
    somTocar("dica");
    falar(falasLumia.erro);
    if (A.modo == "guardia") {
      A.vidas--;
      UI.hudVidas(A.vidas, 3);
      if (A.vidas <= 0) {
        trocar("resolvendoDerrota");
        return;
      }
    }
    trocar("resolvendoErro");
  }

  function depoisDoConceito() {
    A.rodada++;
    if (A.rodada >= A.ordem.length) {
      fimDeOnda();
    } else {
      novaRodada();
    }
  }

  function fimDeOnda() {
    var lista = palavrasDaOnda(A.onda);
    var primeira = 0;
    for (var i = 0; i < lista.length; i++) {
      if (A.estados[lista[i]] == "certa") {
        primeira++;
      }
    }
    var r = primeira / lista.length;
    var estrelas = r >= 0.9 ? 3 : (r >= 0.5 ? 2 : 1);
    if (A.onda >= ondas.length - 1) {
      fim();
      return;
    }
    trocar("ondaFim");
    UI.perguntaOcultar();
    $("ondafim-nome").textContent = ondas[A.onda].nome;
    UI.estrelas("ondafim-estrelas", estrelas, 3);
    $("ondafim-texto").textContent = primeira + " de " + lista.length + " de primeira. " +
      falasLumia.ondaFim[aleatorio(falasLumia.ondaFim.length)];
    somTocar("vitoria");
    Fx.confete(A.w, 50);
    UI.abrir("modal-ondafim");
  }

  function fim() {
    A.terminou = true;
    trocar("fim");
    UI.perguntaOcultar();
    UI.dicas([]);
    var primeira = 0, rever = [];
    for (var i = 0; i < palavras.length; i++) {
      if (A.estados[i] == "certa") {
        primeira++;
      } else {
        rever.push(palavras[i].nome);
      }
    }
    var estrelas = primeira >= 13 ? 3 : (primeira >= 8 ? 2 : 1);
    UI.estrelas("fim-estrelas", estrelas, 3);
    $("fim-numeros").innerHTML =
      "<div><b>" + acertos() + "/16</b><small>palavras</small></div>" +
      "<div><b>" + primeira + "</b><small>de primeira</small></div>" +
      "<div><b>x" + A.melhorCombo + "</b><small>melhor combo</small></div>" +
      "<div><b>" + A.cristaisGanhos + "</b><small>cristais</small></div>";
    $("fim-rever").innerHTML = rever.length == 0
      ? "Perfeito! Nenhuma palavra para rever."
      : "Para rever no Grimório: <b>" + rever.join(", ") + "</b>";
    somTocar("vitoria");
    Fx.confete(A.w, 120);
    A.lumia.festaAte = A.relogio + 99;
    UI.abrir("modal-fim");
  }

  // ---------- atualização a cada quadro ----------
  function atualizar(dt, t) {
    A.t = t;
    if (!A.ativo) {
      return;
    }
    A.relogio += dt;
    A.tEstado += dt;
    A.tinta.mix = Math.min(1, A.tinta.mix + dt / 2.5);

    var andando = (A.estado == "intro" || A.estado == "andando");
    var alvoVel = andando ? 240 : 14;
    A.velDesloc += (alvoVel - A.velDesloc) * Math.min(1, 3 * dt);
    A.desloc += A.velDesloc * dt;

    var L = A.lumia;
    L.cast = Math.max(0, L.cast - dt * 3.5);
    if (A.estado == "disparando" && A.tEstado < 0.25) {
      L.cast = Math.min(1, A.tEstado / 0.2);
    }
    if (andando && Math.random() < dt * 3.4) {
      somTocar("passos");
    }

    for (var i = 0; i < A.bichos.length; i++) {
      var b = A.bichos[i];
      b.vermelho = Math.max(0, b.vermelho - dt * 1.6);
    }

    if (A.estado == "intro") {
      if (A.tEstado > 3.4) {
        if (A.rodada == 0 && A.onda == 0) {
          falar(falasLumia.inicio);
        }
        novaRodada();
      }
    } else if (A.estado == "andando") {
      if (A.tEstado > 1.0) {
        surgir();
      }
    } else if (A.estado == "surgindo") {
      if (A.tEstado > 0.3 + A.bichos.length * 0.13 + 0.45) {
        trocar("jogando");
        A.alvoHover = -1;
      }
    } else if (A.estado == "disparando") {
      var b2 = A.bichos[A.alvo];
      if (A.tEstado > 0.2 && !A.proj) {
        somTocar("tiro");
        A.proj = { x: A.chama.x, y: A.chama.y, x0: A.chama.x, y0: A.chama.y, t: 0 };
      }
      if (A.proj) {
        A.proj.t += dt / 0.35;
        var k = Math.min(1, A.proj.t);
        var e = k * k * (3 - 2 * k);
        A.proj.x = lerp(A.proj.x0, b2.px, e);
        A.proj.y = lerp(A.proj.y0, b2.py, e) - Math.sin(k * Math.PI) * 40;
        if (Math.random() < 0.9) {
          Fx.faiscas(A.proj.x, A.proj.y, 1, "255,226,140", 40, 0.4);
        }
        if (k >= 1) {
          A.proj = null;
          somTocar("impacto");
          if (b2.certo) {
            acertou(b2);
          } else {
            errou(b2);
          }
        }
      }
    } else if (A.estado == "resolvendoCerto") {
      for (var j = 0; j < A.bichos.length; j++) {
        if (A.bichos[j].estado != "certo") {
          A.bichos[j].saida = Math.min(1, A.bichos[j].saida + dt * 2.4);
        }
      }
      if (A.tEstado > 0.35 && A.bichos[A.alvo].estado == "certo" && !A.bichos[A.alvo].sumiu) {
        A.bichos[A.alvo].sumiu = true;
      }
      if (A.tEstado > 1.3) {
        trocar("conceito");
        UI.conceito(A.q.idx, A.ganhosAtuais, depoisDoConceito);
        somTocar("carta");
        UI.perguntaOcultar();
      }
    } else if (A.estado == "resolvendoErro") {
      if (A.tEstado > 0.55) {
        trocar("jogando");
      }
    } else if (A.estado == "resolvendoDerrota") {
      if (A.tEstado > 1.0) {
        trocar("derrota");
        somTocar("derrota");
        UI.abrir("modal-derrota");
      }
    }
  }

  // ---------- desenho ----------
  function desenharTinta(g) {
    var c = lerpCor(A.tinta.de, A.tinta.para, A.tinta.mix);
    if (c[3] > 0.005) {
      g.fillStyle = "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + c[3] + ")";
      g.fillRect(0, 0, A.w, A.h);
    }
  }

  function desenharMundo(g, t) {
    var L = A.lumia;
    var estado = "parado", olhos = "normal", dano = 0;
    if (A.relogio < L.festaAte) {
      estado = "festa"; olhos = "feliz";
    } else if (A.relogio < L.danoAte) {
      estado = "dano"; olhos = "triste"; dano = (L.danoAte - A.relogio) / 0.7;
    } else if (A.estado == "intro" || A.estado == "andando") {
      estado = "andando";
    }
    var luz = A.ativo ? L.luz : 0.4;
    if (A.estado == "intro") {
      luz = Math.max(luz, 0.35);
    }
    var pos = desenharLumia(g, L.x, A.chao, L.esc, t, {
      estado: estado, luz: luz, cast: L.cast, olhos: olhos, virar: 1, dano: dano,
      piscar: estado == "dano"
    });
    if (pos && pos.x != null) {
      A.chama.x = pos.x;
      A.chama.y = pos.y;
    }

    // bugs
    for (var i = 0; i < A.bichos.length; i++) {
      var b = A.bichos[i];
      var c = posicaoCelula(i);
      var tempo = A.tEstado - b.atraso;
      if (A.estado == "surgindo") {
        if (tempo < 0) { b.escala = 0; continue; }
        b.escala = easeOutBack(limitar(tempo / 0.5, 0, 1));
        if (!b.surgiu) {
          b.surgiu = true;
          somTocar("surge");
          Fx.anel(c.x, c.y, "200,170,255", 90 * c.esc, 3);
          Fx.faiscas(c.x, c.y, 8, "210,180,255", 140, 0.6);
        }
      } else if (b.escala < 1 && b.surgiu) {
        b.escala = 1;
      }
      if (b.sumiu) {
        continue;
      }
      var wx = Math.sin(t * 0.7 + b.fase) * A.area.cw * 0.05;
      var wy = Math.sin(t * 1.1 + b.fase * 1.3) * 5;
      var sx = 1, sy = 1;
      var tremer = b.estado == "errado" ? Math.sin(A.relogio * 60) * 6 * b.vermelho : 0;
      b.px = c.x + wx + tremer;
      b.py = c.y + wy;
      b.esc = c.esc;
      var alfa = 1 - b.saida;
      if (b.saida > 0) {
        b.py -= b.saida * 40;
      }
      if (alfa <= 0.01) { continue; }
      var pulso = 1;
      if (b.estado == "certo") {
        pulso = 1 + Math.min(0.3, A.tEstado * 1.2);
      }
      if (i == A.alvo && A.estado == "disparando" && A.proj == null && A.tEstado < 0.2) {
        pulso = 1.0;
      }
      g.save();
      g.globalAlpha = alfa;
      desenharBicho(g, b.tipo, b.px, b.py, b.esc * b.escala * pulso * (A.hover == i && A.estado == "jogando" ? 1.08 : 1), t, b.hue, {
        fase: b.fase, cinza: b.estado == "errado", vermelho: b.vermelho,
        aura: (A.hover == i && A.estado == "jogando") ? 0.6 : 0.3, espelho: -1
      });
      g.restore();
    }

    // bola de luz
    if (A.proj) {
      desenharBrilho(g, A.proj.x, A.proj.y, 46, "255,226,140", 0.95);
      desenharBrilho(g, A.proj.x, A.proj.y, 20, "255,255,235", 1);
    }
  }

  function desenharPlacas(g) {
    for (var i = 0; i < A.bichos.length; i++) {
      var b = A.bichos[i];
      if (b.sumiu || b.escala <= 0.02 || b.saida >= 0.99) {
        b.rect = null;
        continue;
      }
      var estado = b.estado == "errado" ? "errado" : (b.estado == "certo" ? "certo" : (A.hover == i && A.estado == "jogando" ? "hover" : "normal"));
      var alfa = Math.min(1, b.escala) * (1 - b.saida);
      var sobe = (1 - Math.min(1, b.escala)) * 20;
      b.rect = desenharPlaquinha(g, b.px, b.py - 50 * b.esc * b.escala - 8 - sobe, b.texto, A.u, i + 1, estado, alfa);
    }
  }

  function desenharFala(g) {
    if (!A.fala || A.relogio > A.fala.ate || !A.ativo) {
      return;
    }
    var f = A.fala;
    var u = limitar(A.w / 700, 0.85, 1.15);
    var vida = Math.min(1, (A.relogio - f.ini) * 6, (f.ate - A.relogio) * 3);
    g.save();
    g.globalAlpha = Math.max(0, vida);
    g.font = "bold " + Math.round(14 * u) + "px 'Trebuchet MS', Verdana, sans-serif";
    var maxL = Math.min(250 * u, A.w * 0.55);
    var palavrasF = f.txt.split(" ");
    var linhas = [], atual = "";
    for (var i = 0; i < palavrasF.length; i++) {
      var teste = atual ? atual + " " + palavrasF[i] : palavrasF[i];
      if (g.measureText(teste).width > maxL && atual) {
        linhas.push(atual);
        atual = palavrasF[i];
      } else {
        atual = teste;
      }
    }
    linhas.push(atual);
    var altL = 18 * u;
    var larg = 0;
    for (var j = 0; j < linhas.length; j++) {
      larg = Math.max(larg, g.measureText(linhas[j]).width);
    }
    larg += 24 * u;
    var alt = linhas.length * altL + 16 * u;
    var x = limitar(A.lumia.x + 10, larg / 2 + 8, A.w - larg / 2 - 8);
    var y = A.chao - 175 * A.lumia.esc - alt - 6 * (1 - vida);
    g.fillStyle = "rgba(255,246,222,0.96)";
    g.strokeStyle = "#d8a84a";
    g.lineWidth = 2;
    g.beginPath();
    g.roundRect(x - larg / 2, y, larg, alt, 12 * u);
    g.fill();
    g.stroke();
    g.beginPath();
    g.moveTo(A.lumia.x - 6, y + alt - 1);
    g.lineTo(A.lumia.x + 8, y + alt - 1);
    g.lineTo(A.lumia.x + 2, y + alt + 12 * u);
    g.closePath();
    g.fill();
    g.fillStyle = "#3a2410";
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (var k = 0; k < linhas.length; k++) {
      g.fillText(linhas[k], x, y + 8 * u + altL * (k + 0.5));
    }
    g.restore();
  }

  // ---------- entrada ----------
  function acharBicho(x, y) {
    for (var i = A.bichos.length - 1; i >= 0; i--) {
      var b = A.bichos[i];
      if (b.sumiu || b.escala < 0.8 || b.saida > 0) { continue; }
      var dx = x - b.px, dy = y - b.py;
      var raio = 58 * b.esc;
      var naPlaca = b.rect && x >= b.rect.x && x <= b.rect.x + b.rect.w && y >= b.rect.y && y <= b.rect.y + b.rect.h;
      if (naPlaca || dx * dx + dy * dy < raio * raio) {
        return i;
      }
    }
    return -1;
  }

  function toque(x, y) {
    if (!A.ativo || UI.algumAberto()) { return; }
    var i = acharBicho(x, y);
    if (i >= 0) {
      escolher(i);
    }
  }

  function mover(x, y) {
    if (!A.ativo) { A.hover = -1; return -1; }
    A.hover = acharBicho(x, y);
    return A.hover;
  }

  function tecla(ev) {
    var k = ev.key;
    if (k == "Escape") {
      if (UI.aberto("modal-pausa")) {
        UI.fechar("modal-pausa");
      } else if (A.ativo && !UI.algumAberto() && !A.terminou) {
        UI.abrir("modal-pausa");
      }
      return;
    }
    if (!A.ativo || UI.algumAberto()) { return; }
    if (k >= "1" && k <= "5") {
      escolher(parseInt(k, 10) - 1);
    } else if (k == "h" || k == "H") {
      pedirDica();
    }
  }

  // ---------- botões ----------
  function ligar() {
    $("btn-dica").onclick = function () { pedirDica(); };
    $("btn-conferir").onclick = function () { somTocar("abrir"); UI.diario(A.estados); };
    $("btn-reiniciar").onclick = function () {
      somTocar("clique");
      UI.confirmar("Reiniciar a partida?", "Você volta para a primeira onda. Seus cristais e XP continuam salvos.", function () {
        iniciar(A.modo);
      });
    };
    $("btn-pausa").onclick = function () { somTocar("abrir"); UI.abrir("modal-pausa"); };

    $("pausa-continuar").onclick = function () { somTocar("fechar"); UI.fechar("modal-pausa"); };
    $("pausa-conferir").onclick = function () { UI.fechar("modal-pausa"); UI.diario(A.estados); };
    $("pausa-grimorio").onclick = function () { UI.fechar("modal-pausa"); irParaTela("grimorio", "arena"); };
    $("pausa-reiniciar").onclick = function () {
      UI.fechar("modal-pausa");
      UI.confirmar("Reiniciar a partida?", "Você volta para a primeira onda. Seus cristais e XP continuam salvos.", function () {
        iniciar(A.modo);
      });
    };
    $("pausa-menu").onclick = function () { UI.fechar("modal-pausa"); A.ativo = false; irParaTela("titulo"); };

    $("ondafim-ok").onclick = function () { somTocar("clique"); UI.fechar("modal-ondafim"); Fx.limpar(); proximaOnda(); };
    $("derrota-repetir").onclick = function () { somTocar("clique"); UI.fechar("modal-derrota"); repetirOnda(); };
    $("derrota-grimorio").onclick = function () {
      UI.fechar("modal-derrota");
      irParaTela("grimorio", "derrota");
    };

    $("fim-jogar").onclick = function () { UI.fechar("modal-fim"); Fx.limpar(); iniciar(A.modo); };
    $("fim-grimorio").onclick = function () { UI.fechar("modal-fim"); A.ativo = false; irParaTela("grimorio"); };
    $("fim-selo").onclick = function () { UI.fechar("modal-fim"); A.ativo = false; irParaTela("selo"); };
    $("fim-menu").onclick = function () { UI.fechar("modal-fim"); A.ativo = false; irParaTela("titulo"); };

    $("modo-aprendiz").onclick = function () { comecarComModo("aprendiz"); };
    $("modo-guardia").onclick = function () { comecarComModo("guardia"); };
    $("modo-cancelar").onclick = function () { somTocar("fechar"); UI.fechar("modal-modo"); };
  }

  function comecarComModo(modo) {
    somTocar("clique");
    UI.fechar("modal-modo");
    irParaTela("arena");
    iniciar(modo);
    if (!Perfil.dados.tutorial) {
      UI.abrir("modal-como");
    }
  }

  // depois que a derrota manda para o Grimório e a pessoa volta, a onda recomeça
  function retomar(origem) {
    if (origem == "derrota" && A.estado == "derrota") {
      repetirOnda();
    }
  }

  return {
    A: A, iniciar: iniciar, atualizar: atualizar, desenharTinta: desenharTinta, desenharMundo: desenharMundo,
    desenharPlacas: desenharPlacas, desenharFala: desenharFala, toque: toque, mover: mover, tecla: tecla,
    ligar: ligar, retomar: retomar, redimensionar: function (w, h) { A.w = w; A.h = h; layout(); },
    layout: layout, falar: falar
  };
})();
