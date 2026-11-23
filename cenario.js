// =====================================================
// CENÁRIO - o mundo do jogo, desenhado com código (canvas)
// As camadas são desenhadas UMA vez (pré-renderizadas) e depois só
// deslizamos elas em velocidades diferentes. Isso se chama "parallax":
// o que está longe anda devagar, o que está perto anda rápido.
// =====================================================

// Gerador de números "aleatórios" com semente: sempre gera o mesmo cenário bonito.
function semente(s) {
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cria uma tela (canvas) escondida para pré-desenhar uma camada
function criarTela(w, h) {
  var c = document.createElement("canvas");
  c.width = Math.max(1, Math.floor(w));
  c.height = Math.max(1, Math.floor(h));
  return c;
}

// Brilho redondo e suave (usado em luzes, cristais, vaga-lumes...)
function desenharBrilho(g, x, y, raio, cor, alfa) {
  var grad = g.createRadialGradient(x, y, 0, x, y, raio);
  grad.addColorStop(0, "rgba(" + cor + "," + alfa + ")");
  grad.addColorStop(0.4, "rgba(" + cor + "," + (alfa * 0.35) + ")");
  grad.addColorStop(1, "rgba(" + cor + ",0)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(x, y, raio, 0, Math.PI * 2);
  g.fill();
}

// ---------- CÉU ----------
function criarCeu(w, h, e, rnd) {
  var c = criarTela(w * e, h * e);
  var g = c.getContext("2d");
  g.scale(e, e);

  var grad = g.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#2f2a78");
  grad.addColorStop(0.3, "#6a4aa8");
  grad.addColorStop(0.55, "#c4609e");
  grad.addColorStop(0.75, "#f08a7e");
  grad.addColorStop(1, "#ffd9a0");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  // estrelas lá em cima
  for (var i = 0; i < 70; i++) {
    var sx = rnd() * w;
    var sy = rnd() * h * 0.42;
    var sr = 0.4 + rnd() * 1.1;
    g.fillStyle = "rgba(255,255,255," + (0.25 + rnd() * 0.6) + ")";
    g.beginPath();
    g.arc(sx, sy, sr, 0, Math.PI * 2);
    g.fill();
  }

  // faixas de aurora suaves
  for (var a = 0; a < 3; a++) {
    var ay = h * (0.12 + a * 0.09);
    var ag = g.createLinearGradient(0, ay - 30, 0, ay + 40);
    ag.addColorStop(0, "rgba(120,255,230,0)");
    ag.addColorStop(0.5, "rgba(120,255,230,0.10)");
    ag.addColorStop(1, "rgba(120,255,230,0)");
    g.fillStyle = ag;
    g.beginPath();
    g.moveTo(0, ay);
    for (var x = 0; x <= w; x += 12) {
      g.lineTo(x, ay + Math.sin(x / w * 6.28 * 2 + a) * 18 + Math.sin(x / w * 6.28 * 5 + a * 2) * 6);
    }
    g.lineTo(w, ay + 60);
    g.lineTo(0, ay + 60);
    g.closePath();
    g.fill();
  }
  return c;
}

// ---------- MONTANHAS (camadas ao fundo) ----------
function criarMontanhas(w, h, e, rnd, cfg) {
  var c = criarTela(w * e, h * e);
  var g = c.getContext("2d");
  g.scale(e, e);

  var fases = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
  var base = h * cfg.base;
  var amp = h * cfg.amp;

  // altura da montanha em cada x (as ondas repetem, então a camada "emenda" sozinha)
  function altura(x) {
    var a = x / w * 6.2832;
    return base - amp * (0.55 * Math.sin(a + fases[0]) + 0.32 * Math.sin(a * 2 + fases[1]) +
                         0.22 * Math.sin(a * 4 + fases[2]) + 0.1 * Math.sin(a * 9 + fases[3]) + 0.9);
  }

  var grad = g.createLinearGradient(0, base - amp * 2, 0, h * cfg.fundo);
  grad.addColorStop(0, cfg.c1);
  grad.addColorStop(1, cfg.c2);
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(0, h);
  for (var x = 0; x <= w; x += 3) {
    g.lineTo(x, altura(x));
  }
  g.lineTo(w, h);
  g.closePath();
  g.fill();

  // luz na crista das montanhas
  g.strokeStyle = cfg.crista;
  g.lineWidth = 2;
  g.beginPath();
  for (var k = 0; k <= w; k += 3) {
    if (k == 0) {
      g.moveTo(k, altura(k));
    } else {
      g.lineTo(k, altura(k));
    }
  }
  g.stroke();

  // torres com janelinhas acesas (só nas montanhas do meio)
  for (var t = 0; t < cfg.torres; t++) {
    var tx = (t + 0.3 + rnd() * 0.4) / cfg.torres * w;
    var ty = altura(tx) + 4;
    var th = h * (0.07 + rnd() * 0.05);
    var tw = h * 0.018;
    g.fillStyle = cfg.cTorre;
    g.fillRect(tx - tw, ty - th, tw * 2, th);
    g.beginPath();
    g.moveTo(tx - tw * 1.5, ty - th);
    g.lineTo(tx, ty - th - tw * 3.2);
    g.lineTo(tx + tw * 1.5, ty - th);
    g.closePath();
    g.fill();
    for (var j = 0; j < 3; j++) {
      g.fillStyle = "rgba(255,214,120,0.95)";
      g.fillRect(tx - 1.5, ty - th + 6 + j * (th / 4), 3, 5);
    }
    desenharBrilho(g, tx, ty - th * 0.6, tw * 6, "255,200,110", 0.25);
  }
  return c;
}

// ---------- FLORESTA DE CIRCUITOS ----------
function criarFloresta(w, h, e, rnd) {
  var c = criarTela(w * e, h * e);
  var g = c.getContext("2d");
  g.scale(e, e);

  var quantidade = Math.max(7, Math.round(w / 90));
  var baseY = h * 0.9;

  for (var i = 0; i < quantidade; i++) {
    var x = (i + 0.2 + rnd() * 0.6) / quantidade * w;
    var altura = h * (0.2 + rnd() * 0.2);
    var raio = altura * (0.28 + rnd() * 0.12);
    var bolas = [];
    for (var b = 0; b < 5; b++) {
      bolas.push({ dx: (rnd() - 0.5) * raio * 1.7, dy: (rnd() - 0.5) * raio * 0.9, r: raio * (0.55 + rnd() * 0.4) });
    }
    var leds = [];
    for (var l = 0; l < 7; l++) {
      leds.push({ dx: (rnd() - 0.5) * raio * 2.1, dy: (rnd() - 0.5) * raio * 1.3, cor: rnd() < 0.5 ? "130,255,230" : "255,210,120" });
    }

    // desenha a árvore e cópias nas bordas (para a camada emendar sem falhas)
    var copias = [x, x - w, x + w];
    for (var cp = 0; cp < copias.length; cp++) {
      var cx = copias[cp];
      if (cx < -raio * 2 || cx > w + raio * 2) {
        continue;
      }
      // tronco
      g.fillStyle = "#1d2350";
      g.beginPath();
      g.moveTo(cx - altura * 0.035, baseY);
      g.quadraticCurveTo(cx - altura * 0.02, baseY - altura * 0.5, cx - altura * 0.012, baseY - altura);
      g.lineTo(cx + altura * 0.012, baseY - altura);
      g.quadraticCurveTo(cx + altura * 0.02, baseY - altura * 0.5, cx + altura * 0.035, baseY);
      g.closePath();
      g.fill();
      // copa
      var gc = g.createLinearGradient(0, baseY - altura - raio, 0, baseY - altura + raio);
      gc.addColorStop(0, "#35418a");
      gc.addColorStop(1, "#1b2559");
      g.fillStyle = gc;
      for (var q = 0; q < bolas.length; q++) {
        g.beginPath();
        g.arc(cx + bolas[q].dx, baseY - altura + bolas[q].dy, bolas[q].r, 0, Math.PI * 2);
        g.fill();
      }
      // luzinhas (LEDs) nas folhas
      for (var m = 0; m < leds.length; m++) {
        var lx = cx + leds[m].dx;
        var ly = baseY - altura + leds[m].dy;
        desenharBrilho(g, lx, ly, 9, leds[m].cor, 0.55);
        g.fillStyle = "rgba(" + leds[m].cor + ",1)";
        g.beginPath();
        g.arc(lx, ly, 1.6, 0, Math.PI * 2);
        g.fill();
      }
    }
  }

  // névoa no pé das árvores
  var neblina = g.createLinearGradient(0, h * 0.7, 0, h);
  neblina.addColorStop(0, "rgba(255,190,200,0)");
  neblina.addColorStop(1, "rgba(255,190,200,0.28)");
  g.fillStyle = neblina;
  g.fillRect(0, h * 0.7, w, h * 0.3);
  return c;
}

// ---------- CHÃO (onde a Lumia pisa) ----------
function criarChao(w, h, e, rnd) {
  var c = criarTela(w * e, h * e);
  var g = c.getContext("2d");
  g.scale(e, e);

  var topo = h * 0.87;
  var fases = [rnd() * 6.28, rnd() * 6.28];
  function altura(x) {
    var a = x / w * 6.2832;
    return topo + Math.sin(a * 3 + fases[0]) * h * 0.006 + Math.sin(a * 7 + fases[1]) * h * 0.004;
  }

  // terra
  var grad = g.createLinearGradient(0, topo, 0, h);
  grad.addColorStop(0, "#27607a");
  grad.addColorStop(0.15, "#17405a");
  grad.addColorStop(1, "#0a1f33");
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(0, h);
  for (var x = 0; x <= w; x += 3) {
    g.lineTo(x, altura(x));
  }
  g.lineTo(w, h);
  g.closePath();
  g.fill();

  // faixa de luz no topo do chão
  g.strokeStyle = "rgba(160,255,225,0.55)";
  g.lineWidth = 2;
  g.beginPath();
  for (var k = 0; k <= w; k += 3) {
    if (k == 0) {
      g.moveTo(k, altura(k));
    } else {
      g.lineTo(k, altura(k));
    }
  }
  g.stroke();

  // trilhas de circuito brilhando dentro da terra
  g.lineWidth = 1.4;
  for (var t = 0; t < Math.max(4, Math.round(w / 140)); t++) {
    var tx = rnd() * w;
    var ty = topo + h * (0.03 + rnd() * 0.08);
    var tamanho = 40 + rnd() * 90;
    g.strokeStyle = "rgba(120,255,225," + (0.18 + rnd() * 0.2) + ")";
    g.beginPath();
    g.moveTo(tx, ty);
    g.lineTo(tx + tamanho * 0.5, ty);
    g.lineTo(tx + tamanho * 0.5 + 12, ty + 12);
    g.lineTo(tx + tamanho, ty + 12);
    g.stroke();
    g.fillStyle = "rgba(160,255,230,0.7)";
    g.beginPath();
    g.arc(tx + tamanho, ty + 12, 2.2, 0, Math.PI * 2);
    g.fill();
  }

  // capinhas de grama
  for (var gx = 0; gx <= w; gx += 5) {
    var gy = altura(gx);
    var gh = 4 + rnd() * 11;
    var lado = (rnd() - 0.5) * 6;
    g.fillStyle = rnd() < 0.5 ? "#3c8f86" : "#2a6c7c";
    g.beginPath();
    g.moveTo(gx - 2, gy + 1);
    g.quadraticCurveTo(gx, gy - gh * 0.6, gx + lado, gy - gh);
    g.quadraticCurveTo(gx + 1, gy - gh * 0.5, gx + 3, gy + 1);
    g.closePath();
    g.fill();
  }

  // cristais brilhantes
  var nCristais = Math.max(4, Math.round(w / 170));
  for (var i = 0; i < nCristais; i++) {
    var cx = (i + 0.2 + rnd() * 0.6) / nCristais * w;
    var cy = altura(cx) + 2;
    var hue = rnd() < 0.5 ? "110,240,255" : "255,130,220";
    var base = rnd() < 0.5 ? ["#7ff0ff", "#2aa6c9"] : ["#ff9be6", "#b53aa0"];
    desenharBrilho(g, cx, cy - 16, 50, hue, 0.4);
    var pontas = 3 + Math.floor(rnd() * 3);
    for (var p = 0; p < pontas; p++) {
      var px = cx + (p - pontas / 2) * 9 + (rnd() - 0.5) * 6;
      var ph = 16 + rnd() * 26;
      var inc = (p - pontas / 2) * 0.12;
      g.save();
      g.translate(px, cy);
      g.rotate(inc);
      var gcr = g.createLinearGradient(0, 0, 0, -ph);
      gcr.addColorStop(0, base[1]);
      gcr.addColorStop(1, base[0]);
      g.fillStyle = gcr;
      g.beginPath();
      g.moveTo(-5, 0);
      g.lineTo(-3.5, -ph * 0.7);
      g.lineTo(0, -ph);
      g.lineTo(3.5, -ph * 0.7);
      g.lineTo(5, 0);
      g.closePath();
      g.fill();
      g.fillStyle = "rgba(255,255,255,0.45)";
      g.beginPath();
      g.moveTo(-3, -2);
      g.lineTo(-2, -ph * 0.65);
      g.lineTo(0, -ph * 0.9);
      g.lineTo(-0.5, -2);
      g.closePath();
      g.fill();
      g.restore();
    }
  }

  // cogumelos brilhantes
  var nCog = Math.max(3, Math.round(w / 220));
  for (var m = 0; m < nCog; m++) {
    var mx = rnd() * w;
    var my = altura(mx) + 1;
    var mr = 6 + rnd() * 7;
    desenharBrilho(g, mx, my - mr, mr * 4, "255,200,130", 0.3);
    g.fillStyle = "#f6e9d4";
    g.fillRect(mx - mr * 0.25, my - mr, mr * 0.5, mr);
    g.fillStyle = "#e8566e";
    g.beginPath();
    g.ellipse(mx, my - mr, mr, mr * 0.7, 0, Math.PI, 0);
    g.fill();
    g.fillStyle = "rgba(255,240,220,0.9)";
    g.beginPath();
    g.arc(mx - mr * 0.3, my - mr * 1.25, mr * 0.12, 0, Math.PI * 2);
    g.arc(mx + mr * 0.35, my - mr * 1.1, mr * 0.1, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

// ---------- PRIMEIRO PLANO (folhas escuras na frente de tudo) ----------
function criarFrente(w, h, e, rnd) {
  var c = criarTela(w * e, h * e);
  var g = c.getContext("2d");
  g.scale(e, e);
  var qtd = Math.max(5, Math.round(w / 150));
  for (var i = 0; i < qtd; i++) {
    var x = (i + rnd()) / qtd * w;
    var folhas = 4 + Math.floor(rnd() * 3);
    var copias = [x, x - w, x + w];
    var tamanho = h * (0.035 + rnd() * 0.03);
    var abertura = [];
    for (var f = 0; f < folhas; f++) {
      abertura.push((f / (folhas - 1) - 0.5) * 2.2 + (rnd() - 0.5) * 0.2);
    }
    for (var cp = 0; cp < copias.length; cp++) {
      var cx = copias[cp];
      if (cx < -tamanho * 2 || cx > w + tamanho * 2) {
        continue;
      }
      for (var k = 0; k < folhas; k++) {
        g.save();
        g.translate(cx, h + 4);
        g.rotate(abertura[k]);
        var gf = g.createLinearGradient(0, 0, 0, -tamanho * 1.6);
        gf.addColorStop(0, "#071423");
        gf.addColorStop(1, "#14304a");
        g.fillStyle = gf;
        g.beginPath();
        g.moveTo(0, 0);
        g.quadraticCurveTo(tamanho * 0.28, -tamanho * 0.8, 0, -tamanho * 1.6);
        g.quadraticCurveTo(-tamanho * 0.28, -tamanho * 0.8, 0, 0);
        g.fill();
        g.strokeStyle = "rgba(120,230,210,0.25)";
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(0, -tamanho * 1.5);
        g.stroke();
        g.restore();
      }
    }
  }
  return c;
}

// ---------- MONTA O CENÁRIO COMPLETO ----------
// e = "escala da tela" (2 em telas retina) para ficar nítido
function cenarioCriar(w, h, e) {
  w = Math.floor(w);
  h = Math.floor(h);
  var rnd = semente(21);
  var cen = { w: w, h: h, e: e };

  cen.ceu = criarCeu(w, h, e, rnd);
  cen.longe = criarMontanhas(w, h, e, rnd, {
    base: 0.66, amp: 0.13, fundo: 1, c1: "#a98bd8", c2: "#e8a0bc",
    crista: "rgba(255,240,225,0.6)", torres: 0, cTorre: ""
  });
  cen.meio = criarMontanhas(w, h, e, rnd, {
    base: 0.74, amp: 0.11, fundo: 1, c1: "#6a55b4", c2: "#b4709f",
    crista: "rgba(255,220,200,0.4)", torres: Math.max(2, Math.round(w / 420)), cTorre: "#51408f"
  });
  cen.floresta = criarFloresta(w, h, e, rnd);
  cen.chao = criarChao(w, h, e, rnd);
  cen.frente = criarFrente(w, h, e, rnd);

  // nuvens, ilhas flutuantes e vaga-lumes (desenhados a cada quadro)
  cen.nuvens = [];
  for (var n = 0; n < 5; n++) {
    cen.nuvens.push({ x: rnd() * w, y: h * (0.1 + rnd() * 0.28), tam: 0.6 + rnd() * 0.8, vel: 6 + rnd() * 10 });
  }
  cen.ilhas = [
    { x: 0.16, y: 0.30, tam: 1.0, fase: 0 },
    { x: 0.52, y: 0.17, tam: 0.75, fase: 2 },
    { x: 0.86, y: 0.33, tam: 0.9, fase: 4 }
  ];
  cen.vagalumes = [];
  var qtd = w < 500 ? 16 : 30;
  for (var v = 0; v < qtd; v++) {
    cen.vagalumes.push({ x: rnd() * w, y: h * (0.3 + rnd() * 0.58), fase: rnd() * 6.28, vel: 0.4 + rnd() * 0.8, raio: 2 + rnd() * 3 });
  }
  return cen;
}

// Desenha uma camada pré-pronta deslizando (e emendando) na horizontal
function desenharCamada(g, cen, camada, deslocamento) {
  var x0 = -(deslocamento % cen.w);
  if (x0 > 0) {
    x0 -= cen.w;
  }
  g.drawImage(camada, x0, 0, cen.w, cen.h);
  g.drawImage(camada, x0 + cen.w, 0, cen.w, cen.h);
}

// Parte de trás: céu, sol, nuvens, ilhas, montanhas, floresta e chão
function cenarioDesenharFundo(g, cen, t, desloc) {
  var w = cen.w;
  var h = cen.h;

  g.drawImage(cen.ceu, 0, 0, w, h);

  // sol-chip com halo pulsando
  var sx = w * 0.66;
  var sy = h * 0.4;
  var sr = Math.min(w, h * 1.5) * 0.1;
  var pulso = 1 + Math.sin(t * 1.3) * 0.04;
  desenharBrilho(g, sx, sy, sr * 5.5 * pulso, "255,190,120", 0.45);
  desenharBrilho(g, sx, sy, sr * 2.6 * pulso, "255,230,170", 0.65);
  var sol = g.createRadialGradient(sx, sy, 0, sx, sy, sr);
  sol.addColorStop(0, "#fffbe6");
  sol.addColorStop(0.7, "#ffe4a1");
  sol.addColorStop(1, "#ffc46b");
  g.fillStyle = sol;
  g.beginPath();
  g.arc(sx, sy, sr, 0, Math.PI * 2);
  g.fill();
  // aro de "pinos" girando em volta do sol (lembra um chip)
  g.save();
  g.translate(sx, sy);
  g.rotate(t * 0.05);
  g.strokeStyle = "rgba(255,240,200,0.5)";
  g.lineWidth = 2;
  for (var p = 0; p < 24; p++) {
    var ang = p / 24 * Math.PI * 2;
    g.beginPath();
    g.moveTo(Math.cos(ang) * sr * 1.28, Math.sin(ang) * sr * 1.28);
    g.lineTo(Math.cos(ang) * sr * (p % 2 == 0 ? 1.52 : 1.42), Math.sin(ang) * sr * (p % 2 == 0 ? 1.52 : 1.42));
    g.stroke();
  }
  g.restore();

  // raios de luz
  g.save();
  g.globalCompositeOperation = "lighter";
  for (var r = 0; r < 4; r++) {
    var ang2 = 1.9 + r * 0.28 + Math.sin(t * 0.3 + r) * 0.04;
    var gr = g.createLinearGradient(sx, sy, sx + Math.cos(ang2) * h, sy + Math.sin(ang2) * h);
    gr.addColorStop(0, "rgba(255,230,170,0.16)");
    gr.addColorStop(1, "rgba(255,230,170,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(sx, sy);
    g.lineTo(sx + Math.cos(ang2 - 0.06) * h * 1.2, sy + Math.sin(ang2 - 0.06) * h * 1.2);
    g.lineTo(sx + Math.cos(ang2 + 0.06) * h * 1.2, sy + Math.sin(ang2 + 0.06) * h * 1.2);
    g.closePath();
    g.fill();
  }
  g.restore();

  // nuvens
  for (var n = 0; n < cen.nuvens.length; n++) {
    var nv = cen.nuvens[n];
    var nx = ((nv.x + t * nv.vel - desloc * 0.05) % (w + 300) + (w + 300)) % (w + 300) - 150;
    var s = nv.tam * Math.min(1, w / 700 + 0.4);
    g.fillStyle = "rgba(255,225,230,0.34)";
    g.beginPath();
    g.ellipse(nx, nv.y, 70 * s, 16 * s, 0, 0, Math.PI * 2);
    g.ellipse(nx - 34 * s, nv.y + 4 * s, 40 * s, 12 * s, 0, 0, Math.PI * 2);
    g.ellipse(nx + 38 * s, nv.y + 3 * s, 46 * s, 13 * s, 0, 0, Math.PI * 2);
    g.fill();
  }

  // ilhas flutuantes
  for (var i = 0; i < cen.ilhas.length; i++) {
    var il = cen.ilhas[i];
    var ix = ((il.x * w - desloc * 0.1) % (w + 200) + (w + 200)) % (w + 200) - 100;
    var iy = il.y * h + Math.sin(t * 0.8 + il.fase) * 6;
    var is = il.tam * Math.min(1, w / 760 + 0.35);
    desenharIlha(g, ix, iy, is, t);
  }

  desenharCamada(g, cen, cen.longe, desloc * 0.12);
  desenharCamada(g, cen, cen.meio, desloc * 0.25);
  desenharCamada(g, cen, cen.floresta, desloc * 0.5);
  desenharCamada(g, cen, cen.chao, desloc * 1.0);
}

function desenharIlha(g, x, y, s, t) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // pedra de baixo
  var gp = g.createLinearGradient(0, 0, 0, 60);
  gp.addColorStop(0, "#7b5aa6");
  gp.addColorStop(1, "#3d2c6e");
  g.fillStyle = gp;
  g.beginPath();
  g.moveTo(-62, 0);
  g.quadraticCurveTo(-40, 30, -12, 40);
  g.quadraticCurveTo(0, 62, 10, 40);
  g.quadraticCurveTo(40, 28, 62, 0);
  g.closePath();
  g.fill();
  // topo com grama
  g.fillStyle = "#5fc7a0";
  g.beginPath();
  g.ellipse(0, 0, 62, 13, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#8be6bf";
  g.beginPath();
  g.ellipse(0, -2, 56, 8, 0, 0, Math.PI * 2);
  g.fill();
  // arvorezinha
  g.fillStyle = "#4a3566";
  g.fillRect(-20, -26, 4, 22);
  g.fillStyle = "#e86fa0";
  g.beginPath();
  g.arc(-18, -32, 14, 0, Math.PI * 2);
  g.fill();
  // cristal brilhante
  desenharBrilho(g, 26, -14, 24, "120,240,255", 0.5);
  g.fillStyle = "#9af4ff";
  g.beginPath();
  g.moveTo(22, -3);
  g.lineTo(24, -22);
  g.lineTo(28, -3);
  g.closePath();
  g.fill();
  // cachoeirinha de luz
  var cor = 0.35 + Math.sin(t * 2) * 0.1;
  g.strokeStyle = "rgba(190,255,240," + cor + ")";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-6, 8);
  g.lineTo(-6, 62);
  g.stroke();
  g.restore();
}

// Parte da frente: folhas escuras, vaga-lumes e poeira de luz (por cima dos personagens)
function cenarioDesenharFrente(g, cen, t, desloc) {
  desenharCamada(g, cen, cen.frente, desloc * 1.5);

  g.save();
  g.globalCompositeOperation = "lighter";
  for (var i = 0; i < cen.vagalumes.length; i++) {
    var v = cen.vagalumes[i];
    var vx = ((v.x + Math.sin(t * v.vel + v.fase) * 26 - desloc * 0.8) % cen.w + cen.w) % cen.w;
    var vy = v.y + Math.cos(t * v.vel * 0.8 + v.fase) * 16;
    var piscar = 0.45 + 0.55 * Math.sin(t * 2.2 * v.vel + v.fase);
    desenharBrilho(g, vx, vy, v.raio * 5, "255,226,140", 0.55 * piscar);
    g.fillStyle = "rgba(255,248,210," + piscar + ")";
    g.beginPath();
    g.arc(vx, vy, v.raio * 0.35, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}
