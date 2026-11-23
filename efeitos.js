// =====================================================
// EFEITOS - partículas, brilhos, textos flutuantes, tremor e clarão de tela
// Tudo é desenhado no canvas por cima do cenário.
// =====================================================

var Fx = (function () {
  var ps = [];             // todas as partículas vivas
  var tremor = 0;          // força do tremor de tela (vai diminuindo sozinho)
  var clarao = 0;          // força do clarão colorido na tela
  var claraoCor = "255,255,255";

  function entre(a, b) {
    return a + Math.random() * (b - a);
  }

  function add(p) {
    p.t = 0;
    p.rot = p.rot || 0;
    ps.push(p);
    return p;
  }

  // Faíscas que saem em todas as direções (brilho aditivo)
  function faiscas(x, y, n, cor, vel, vida) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var v = entre(0.3, 1) * (vel || 200);
      add({ k: "faisca", x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120,
            vida: entre(0.4, 1) * (vida || 0.9), tam: entre(2, 5), cor: cor || "255,226,140" });
    }
  }

  // Cristais (a "moeda" do jogo). Se tiver alvo, depois de um tempinho eles voam até ele.
  function cristais(x, y, n, alvo, aoChegar) {
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + entre(-1.2, 1.2);
      var v = entre(120, 300);
      add({ k: "cristal", x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 520,
            vida: 3, atraso: entre(0.45, 0.8), alvo: alvo, aoChegar: aoChegar, tam: entre(7, 11),
            rot: entre(0, 6), vr: entre(-6, 6) });
    }
  }

  // Zeros e uns subindo (o "código" se desfazendo)
  function bits(x, y, n, cor) {
    for (var i = 0; i < n; i++) {
      add({ k: "bit", x: x + entre(-40, 40), y: y + entre(-30, 30), vx: entre(-30, 30), vy: entre(-140, -40),
            g: 0, vida: entre(0.7, 1.4), tam: entre(12, 20), cor: cor || "190,255,235",
            txt: Math.random() < 0.5 ? "0" : "1" });
    }
  }

  // Anel que se expande (onda de choque)
  function anel(x, y, cor, raio, largura) {
    add({ k: "anel", x: x, y: y, vida: 0.55, raio: raio || 120, cor: cor || "255,230,170", lar: largura || 4 });
  }

  // Texto que sobe e some ("+10", "COMBO x3", "Ai!")
  function texto(x, y, txt, cor, tam) {
    add({ k: "texto", x: x, y: y, vx: 0, vy: -50, g: 0, vida: 1.3, txt: txt, cor: cor || "#ffe9a8", tam: tam || 24 });
  }

  // Estrelinhas brilhando (4 pontas)
  function estrelas(x, y, n, raioArea) {
    for (var i = 0; i < n; i++) {
      add({ k: "estrela", x: x + entre(-raioArea, raioArea), y: y + entre(-raioArea, raioArea),
            vx: 0, vy: entre(-20, 10), g: 0, vida: entre(0.5, 1.1), tam: entre(8, 18) });
    }
  }

  // Chuva de confete (tela de vitória)
  function confete(largura, n) {
    var cores = ["#ffd98a", "#ff8aa0", "#8af0d8", "#b49bff", "#fff4dc"];
    for (var i = 0; i < n; i++) {
      add({ k: "confete", x: Math.random() * largura, y: entre(-200, -10), vx: entre(-40, 40), vy: entre(80, 220),
            g: 0, vida: entre(4, 7), tam: entre(6, 12), cor: cores[Math.floor(Math.random() * cores.length)],
            rot: entre(0, 6), vr: entre(-8, 8) });
    }
  }

  function atualizar(dt) {
    for (var i = ps.length - 1; i >= 0; i--) {
      var p = ps[i];
      p.t += dt;
      if (p.k == "cristal" && p.alvo && p.t > p.atraso) {
        // voa até o alvo, acelerando
        var dx = p.alvo.x - p.x;
        var dy = p.alvo.y - p.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var rapidez = 500 + (p.t - p.atraso) * 1800;
        var suave = Math.min(1, 9 * dt);
        p.vx += ((dx / d) * rapidez - p.vx) * suave;
        p.vy += ((dy / d) * rapidez - p.vy) * suave;
        p.g = 0;
        if (d < 24) {
          if (p.aoChegar) {
            p.aoChegar();
          }
          ps.splice(i, 1);
          continue;
        }
      }
      p.vy = (p.vy || 0) + (p.g || 0) * dt;
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
      if (p.vr) {
        p.rot += p.vr * dt;
      }
      if (p.t >= p.vida) {
        ps.splice(i, 1);
      }
    }
    tremor = Math.max(0, tremor - dt * 2.2);
    clarao = Math.max(0, clarao - dt * 1.8);
  }

  function desenhar(g) {
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      var vida = 1 - p.t / p.vida;
      if (p.k == "faisca") {
        g.save();
        g.globalCompositeOperation = "lighter";
        var gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.tam * 3);
        gr.addColorStop(0, "rgba(" + p.cor + "," + vida + ")");
        gr.addColorStop(1, "rgba(" + p.cor + ",0)");
        g.fillStyle = gr;
        g.fillRect(p.x - p.tam * 3, p.y - p.tam * 3, p.tam * 6, p.tam * 6);
        g.restore();
      } else if (p.k == "cristal") {
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.globalAlpha = Math.min(1, vida * 3);
        g.shadowColor = "rgba(120,240,255,0.9)";
        g.shadowBlur = 12;
        g.fillStyle = "#9af4ff";
        g.beginPath();
        g.moveTo(0, -p.tam);
        g.lineTo(p.tam * 0.7, 0);
        g.lineTo(0, p.tam);
        g.lineTo(-p.tam * 0.7, 0);
        g.closePath();
        g.fill();
        g.shadowBlur = 0;
        g.fillStyle = "rgba(255,255,255,0.8)";
        g.beginPath();
        g.moveTo(0, -p.tam);
        g.lineTo(p.tam * 0.3, -p.tam * 0.1);
        g.lineTo(-p.tam * 0.2, -p.tam * 0.1);
        g.closePath();
        g.fill();
        g.restore();
      } else if (p.k == "bit") {
        g.save();
        g.globalAlpha = Math.min(1, vida * 1.6);
        g.fillStyle = "rgba(" + p.cor + ",1)";
        g.shadowColor = "rgba(" + p.cor + ",0.9)";
        g.shadowBlur = 8;
        g.font = "bold " + Math.round(p.tam) + "px 'Courier New', monospace";
        g.textAlign = "center";
        g.fillText(p.txt, p.x, p.y);
        g.restore();
      } else if (p.k == "anel") {
        var prog = p.t / p.vida;
        g.save();
        g.globalCompositeOperation = "lighter";
        g.strokeStyle = "rgba(" + p.cor + "," + (1 - prog) * 0.9 + ")";
        g.lineWidth = p.lar * (1 - prog * 0.7);
        g.beginPath();
        g.arc(p.x, p.y, p.raio * (1 - Math.pow(1 - prog, 3)), 0, Math.PI * 2);
        g.stroke();
        g.restore();
      } else if (p.k == "texto") {
        g.save();
        g.globalAlpha = Math.min(1, vida * 2.5);
        var pulo = p.t < 0.15 ? 1 + (0.15 - p.t) * 4 : 1;
        g.font = "bold " + Math.round(p.tam * pulo) + "px Georgia, serif";
        g.textAlign = "center";
        g.lineWidth = 5;
        g.strokeStyle = "rgba(20,10,40,0.85)";
        g.strokeText(p.txt, p.x, p.y);
        g.fillStyle = p.cor;
        g.fillText(p.txt, p.x, p.y);
        g.restore();
      } else if (p.k == "estrela") {
        g.save();
        g.globalCompositeOperation = "lighter";
        g.translate(p.x, p.y);
        var s = p.tam * Math.sin(Math.min(1, p.t / p.vida) * Math.PI);
        g.fillStyle = "rgba(255,240,200,0.95)";
        g.beginPath();
        g.moveTo(0, -s);
        g.quadraticCurveTo(0, 0, s, 0);
        g.quadraticCurveTo(0, 0, 0, s);
        g.quadraticCurveTo(0, 0, -s, 0);
        g.quadraticCurveTo(0, 0, 0, -s);
        g.fill();
        g.restore();
      } else if (p.k == "confete") {
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.fillStyle = p.cor;
        g.fillRect(-p.tam / 2, -p.tam / 4, p.tam, p.tam / 2);
        g.restore();
      }
    }
  }

  // tremor de tela: devolve um deslocamento aleatório (usado antes de desenhar a cena)
  function deslocamento() {
    if (tremor <= 0) {
      return { x: 0, y: 0 };
    }
    var f = tremor * 14;
    return { x: (Math.random() - 0.5) * f, y: (Math.random() - 0.5) * f };
  }

  function desenharClarao(g, w, h) {
    if (clarao <= 0) {
      return;
    }
    g.save();
    g.fillStyle = "rgba(" + claraoCor + "," + Math.min(0.6, clarao * 0.6) + ")";
    g.fillRect(0, 0, w, h);
    g.restore();
  }

  return {
    faiscas: faiscas, cristais: cristais, bits: bits, anel: anel, texto: texto, estrelas: estrelas, confete: confete,
    atualizar: atualizar, desenhar: desenhar, deslocamento: deslocamento, desenharClarao: desenharClarao,
    tremer: function (v) { tremor = Math.max(tremor, v); },
    clarao: function (cor, v) { claraoCor = cor; clarao = Math.max(clarao, v || 0.6); },
    limpar: function () { ps.length = 0; tremor = 0; clarao = 0; },
    quantidade: function () { return ps.length; }
  };
})();
