// =====================================================
// PERSONAGENS - a Lumia e os bugs, desenhados com formas no canvas
// =====================================================

// Quando um bug está "bloqueado" (já errou), a saturação das cores cai para ficar cinza.
var satBicho = 1;

function hsl(h, s, l, a) {
  return "hsla(" + Math.round(h) + "," + Math.round(s * satBicho) + "%," + Math.round(l) + "%," + (a == null ? 1 : a) + ")";
}

// Converte uma cor HSL em "r,g,b" (para usar nos brilhos)
function hslParaRgb(h, s, l) {
  s = s / 100;
  l = l / 100;
  var k = function (n) { return (n + h / 30) % 12; };
  var a = s * Math.min(l, 1 - l);
  var f = function (n) { return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); };
  return Math.round(f(0) * 255) + "," + Math.round(f(8) * 255) + "," + Math.round(f(4) * 255);
}

// =====================================================
// LUMIA
// (x, y) = pés dela no chão. esc = tamanho. t = tempo em segundos.
// o = { estado: parado | andando | festa | dano, luz: 0..1, cast: 0..1,
//       olhos: normal | feliz | triste, virar: 1 ou -1, piscar: true/false }
// Retorna a posição da chama da lanterna (para a gente disparar a luz dali).
// =====================================================
function desenharLumia(g, x, y, esc, t, o) {
  o = o || {};
  var estado = o.estado || "parado";
  var luz = (o.luz == null) ? 0.4 : o.luz;
  var cast = o.cast || 0;
  var andar = (estado == "andando") ? Math.sin(t * 10) : 0;
  var pulo = (estado == "festa") ? -Math.abs(Math.sin(t * 6)) * 22 : 0;
  var recuo = (estado == "dano") ? -12 * (o.dano || 0) : 0;
  var respira = Math.sin(t * 2.2) * 1.3;
  var olhos = o.olhos || "normal";
  var dir = o.virar || 1;
  var sway = Math.sin(t * 2.0) * 2.5 + andar * 4 + (estado == "dano" ? -6 * (o.dano || 0) : 0);

  // sombra no chão
  g.save();
  g.translate(x, y);
  g.scale(esc * dir, esc);
  g.fillStyle = "rgba(8,10,30,0.34)";
  g.beginPath();
  g.ellipse(recuo, 1, 38 + pulo * 0.35, 9, 0, 0, Math.PI * 2);
  g.fill();

  g.translate(recuo, pulo);
  if (o.piscar && Math.floor(t * 18) % 2 == 0) {
    g.globalAlpha = 0.45;
  }

  // botinhas
  for (var lado = -1; lado <= 1; lado += 2) {
    var levanta = Math.max(0, andar * lado) * 7;
    g.fillStyle = "#2b1d3a";
    g.beginPath();
    g.ellipse(lado * 11, -5 - levanta, 9.5, 6, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.18)";
    g.beginPath();
    g.ellipse(lado * 11 - 2, -7 - levanta, 4, 2, 0, 0, Math.PI * 2);
    g.fill();
  }

  // capa (o corpo todo)
  var gc = g.createLinearGradient(0, -66, 0, -2);
  gc.addColorStop(0, "#e2495e");
  gc.addColorStop(0.55, "#b72640");
  gc.addColorStop(1, "#7c1530");
  g.fillStyle = gc;
  g.strokeStyle = "#2a0f1f";
  g.lineWidth = 3;
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(-17, -64);
  g.bezierCurveTo(-23, -46, -33 + sway * 0.3, -24, -37 + sway, -7);
  g.quadraticCurveTo(-18 + sway, -1 + andar * 1.5, 0 + sway * 0.6, -5);
  g.quadraticCurveTo(18 + sway, -10 - andar * 1.5, 37 + sway, -7);
  g.bezierCurveTo(33 + sway * 0.3, -24, 23, -46, 17, -64);
  g.closePath();
  g.fill();
  g.stroke();

  // dobras da capa
  g.strokeStyle = "rgba(60,10,30,0.35)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(-6, -56);
  g.quadraticCurveTo(-12 + sway * 0.3, -30, -14 + sway * 0.6, -8);
  g.moveTo(8, -56);
  g.quadraticCurveTo(14 + sway * 0.3, -30, 17 + sway * 0.6, -8);
  g.stroke();

  // barra dourada
  g.strokeStyle = "#f0c05c";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-35 + sway, -9);
  g.quadraticCurveTo(-18 + sway, -3 + andar * 1.5, 0 + sway * 0.6, -7);
  g.quadraticCurveTo(18 + sway, -12 - andar * 1.5, 35 + sway, -9);
  g.stroke();

  // joia no peito que brilha com a luz
  desenharBrilho(g, 0, -48 + respira, 18, "255,220,140", 0.2 + luz * 0.6);
  g.fillStyle = "#ffe9a8";
  g.strokeStyle = "#a8741c";
  g.lineWidth = 1.5;
  g.beginPath();
  g.moveTo(0, -55 + respira);
  g.lineTo(5, -48 + respira);
  g.lineTo(0, -41 + respira);
  g.lineTo(-5, -48 + respira);
  g.closePath();
  g.fill();
  g.stroke();

  // braço esquerdo (o que não segura o cajado)
  g.strokeStyle = "#8d1b34";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-17, -56);
  g.lineTo(-25, -42 + Math.sin(t * 2.2 + 1) * 1.5 - andar * 4);
  g.stroke();
  g.strokeStyle = "#2a0f1f";
  g.lineWidth = 2;
  g.beginPath();
  g.arc(-25, -41 + Math.sin(t * 2.2 + 1) * 1.5 - andar * 4, 4.2, 0, Math.PI * 2);
  g.fillStyle = "#d9b27a";
  g.fill();
  g.stroke();

  // cajado + lanterna
  var mx = 27 + 10 * cast;
  var my = -45 - 9 * cast + respira * 0.4;
  var ang = 0.65 * cast;
  // braço direito
  g.strokeStyle = "#8d1b34";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(17, -56);
  g.lineTo(mx, my);
  g.stroke();

  g.save();
  g.translate(mx, my);
  g.rotate(ang);
  // haste
  g.strokeStyle = "#4a2d22";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(0, 48);
  g.lineTo(0, -52);
  g.stroke();
  g.strokeStyle = "#f0c05c";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, -4);
  g.lineTo(0, 2);
  g.moveTo(0, 20);
  g.lineTo(0, 25);
  g.stroke();
  // mão
  g.fillStyle = "#d9b27a";
  g.strokeStyle = "#2a0f1f";
  g.lineWidth = 2;
  g.beginPath();
  g.arc(0, 0, 4.6, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  // lanterna: tampa, vidro, chama, base
  g.fillStyle = "#f0c05c";
  g.strokeStyle = "#7a5217";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(-10, -62);
  g.lineTo(0, -75);
  g.lineTo(10, -62);
  g.closePath();
  g.fill();
  g.stroke();
  g.beginPath();
  g.arc(0, -77, 2.8, 0, Math.PI * 2);
  g.fill();
  var vidro = g.createLinearGradient(-9, 0, 9, 0);
  vidro.addColorStop(0, "rgba(255,240,200,0.75)");
  vidro.addColorStop(1, "rgba(255,200,120,0.55)");
  g.fillStyle = vidro;
  g.beginPath();
  g.moveTo(-8, -62);
  g.lineTo(8, -62);
  g.lineTo(7, -42);
  g.lineTo(-7, -42);
  g.closePath();
  g.fill();
  g.stroke();
  g.fillStyle = "#f0c05c";
  g.fillRect(-9, -43, 18, 5);
  g.strokeRect(-9, -43, 18, 5);
  // chama tremendo
  var fl = 1 + Math.sin(t * 13) * 0.12 + cast * 0.5 + luz * 0.3;
  g.fillStyle = "#fff3c4";
  g.beginPath();
  g.moveTo(0, -46);
  g.quadraticCurveTo(-6 * fl, -54, 0, -64 * (0.9 + luz * 0.2 + cast * 0.2));
  g.quadraticCurveTo(6 * fl, -54, 0, -46);
  g.fill();
  g.fillStyle = "#ff9a3c";
  g.beginPath();
  g.moveTo(0, -46);
  g.quadraticCurveTo(-3.5 * fl, -52, 0, -58);
  g.quadraticCurveTo(3.5 * fl, -52, 0, -46);
  g.fill();
  g.restore();

  // posição da chama no mundo (para disparar a luz dali)
  var lx = mx + 54 * Math.sin(ang);
  var ly = my - 54 * Math.cos(ang);

  // brilho grande da lanterna
  g.save();
  g.globalCompositeOperation = "lighter";
  var raioLuz = 70 + luz * 90 + cast * 60;
  desenharBrilho(g, lx, ly, raioLuz, "255,214,140", 0.28 + luz * 0.3 + cast * 0.35);
  g.restore();

  // capuz
  var ponta = Math.sin(t * 2.6) * 3 + sway * 0.25 + andar * 3;
  var gh = g.createLinearGradient(0, -132, 0, -58);
  gh.addColorStop(0, "#e65468");
  gh.addColorStop(0.5, "#c02a45");
  gh.addColorStop(1, "#8a1832");
  g.fillStyle = gh;
  g.strokeStyle = "#2a0f1f";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(ponta, -133 + respira * 0.3);
  g.bezierCurveTo(14, -119, 29, -101, 27, -83);
  g.bezierCurveTo(27, -71, 21, -62, 14, -59);
  g.lineTo(-14, -59);
  g.bezierCurveTo(-21, -62, -27, -71, -27, -83);
  g.bezierCurveTo(-29, -101, -14, -119, ponta, -133 + respira * 0.3);
  g.closePath();
  g.fill();
  g.stroke();

  // rosto na sombra
  var gr = g.createRadialGradient(0, -90, 2, 0, -86, 22);
  gr.addColorStop(0, "#2f2347");
  gr.addColorStop(1, "#120c1c");
  g.fillStyle = gr;
  g.strokeStyle = "#e9b95a";
  g.lineWidth = 2.6;
  g.beginPath();
  g.ellipse(0, -86 + respira * 0.3, 19.5, 18.5, 0, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // olhos
  var piscou = (t % 4.3) > 4.18;
  var ey = -88 + respira * 0.3;
  g.fillStyle = "#ffe9a8";
  g.strokeStyle = "#ffe9a8";
  g.lineCap = "round";
  if (estado == "dano") {
    g.lineWidth = 2.6;
    g.beginPath();
    g.moveTo(-11, ey - 4); g.lineTo(-5, ey); g.lineTo(-11, ey + 4);
    g.moveTo(11, ey - 4); g.lineTo(5, ey); g.lineTo(11, ey + 4);
    g.stroke();
  } else if (olhos == "feliz") {
    g.lineWidth = 2.8;
    g.beginPath();
    g.arc(-7.5, ey + 2, 4.2, Math.PI * 1.1, Math.PI * 1.9);
    g.arc(7.5, ey + 2, 4.2, Math.PI * 1.1, Math.PI * 1.9);
    g.stroke();
    g.beginPath();
    g.moveTo(-4, -78);
    g.quadraticCurveTo(0, -73, 4, -78);
    g.stroke();
  } else if (piscou) {
    g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(-11, ey); g.lineTo(-4, ey);
    g.moveTo(4, ey); g.lineTo(11, ey);
    g.stroke();
  } else {
    var caido = (olhos == "triste") ? 2 : 0;
    g.beginPath();
    g.arc(-7.5, ey + caido, 3.8, 0, Math.PI * 2);
    g.arc(7.5, ey + caido, 3.8, 0, Math.PI * 2);
    g.fill();
    if (olhos == "triste") {
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(-12, ey - 6); g.lineTo(-4, ey - 3);
      g.moveTo(12, ey - 6); g.lineTo(4, ey - 3);
      g.stroke();
    }
  }
  // bochechas
  g.fillStyle = "rgba(230,80,100,0.28)";
  g.beginPath();
  g.arc(-12.5, -80, 3.6, 0, Math.PI * 2);
  g.arc(12.5, -80, 3.6, 0, Math.PI * 2);
  g.fill();

  // sininho dourado na ponta do capuz
  var sino = Math.sin(t * 3.2 + 1) * 2;
  g.fillStyle = "#f6cd6a";
  g.strokeStyle = "#7a5217";
  g.lineWidth = 2;
  g.beginPath();
  g.arc(ponta * 1.1 + sino, -131 + respira * 0.3, 5.2, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.beginPath();
  g.arc(ponta * 1.1 + sino - 1.6, -133 + respira * 0.3, 1.5, 0, Math.PI * 2);
  g.fill();

  g.restore();

  // posição da chama em coordenadas do canvas
  return { x: x + dir * esc * (lx + recuo), y: y + esc * (ly + pulo) };
}

// =====================================================
// BUGS (os monstros). Tipos: 0 mariposa, 1 besouro, 2 slime de bits, 3 espectro
// (x, y) = centro. hue = cor (0 a 360). o = { fase, cinza, vermelho, aura }
// =====================================================
function desenharBicho(g, tipo, x, y, esc, t, hue, o) {
  o = o || {};
  var fase = o.fase || 0;
  satBicho = o.cinza ? 0.08 : 1;
  var flutua = Math.sin(t * 2 + fase) * 5;

  g.save();
  g.translate(x, y + flutua * esc);
  g.scale(esc * (o.espelho || 1), esc);

  // aura brilhando atrás
  var rgb = hslParaRgb(hue, o.cinza ? 5 : 85, 62);
  desenharBrilho(g, 0, 0, 86, rgb, (o.aura == null ? 0.3 : o.aura) + Math.sin(t * 3 + fase) * 0.05);

  if (tipo == 0) {
    bichoMariposa(g, t, hue, fase);
  } else if (tipo == 1) {
    bichoBesouro(g, t, hue, fase);
  } else if (tipo == 2) {
    bichoSlime(g, t, hue, fase);
  } else {
    bichoEspectro(g, t, hue, fase);
  }

  // vermelho de "errei!" por cima
  if (o.vermelho) {
    desenharBrilho(g, 0, 0, 80, "255,40,60", 0.45 * o.vermelho);
  }
  g.restore();
  satBicho = 1;
}

// olho brilhante dos bugs
function olhoBicho(g, x, y, r, hue) {
  desenharBrilho(g, x, y, r * 3, hslParaRgb(hue + 40, 95, 70), 0.55);
  g.fillStyle = hsl(hue + 40, 100, 92);
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1a0f2a";
  g.beginPath();
  g.arc(x + r * 0.15, y + r * 0.1, r * 0.5, 0, Math.PI * 2);
  g.fill();
}

function bichoMariposa(g, t, hue, fase) {
  var bate = Math.sin(t * 8 + fase);
  var abertura = 0.72 + 0.28 * bate;

  for (var lado = -1; lado <= 1; lado += 2) {
    g.save();
    g.scale(lado * abertura, 1);
    // asa de cima
    var gw = g.createLinearGradient(0, 0, 80, -20);
    gw.addColorStop(0, hsl(hue, 80, 64, 0.95));
    gw.addColorStop(1, hsl(hue + 50, 88, 52, 0.8));
    g.fillStyle = gw;
    g.strokeStyle = hsl(hue, 90, 82, 0.9);
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(6, -8);
    g.bezierCurveTo(30, -74, 86, -58, 72, -12);
    g.bezierCurveTo(62, 4, 28, 4, 6, -2);
    g.closePath();
    g.fill();
    g.stroke();
    // asa de baixo
    g.beginPath();
    g.moveTo(6, 0);
    g.bezierCurveTo(48, -2, 62, 40, 36, 46);
    g.bezierCurveTo(14, 48, 6, 24, 6, 0);
    g.closePath();
    g.fill();
    g.stroke();
    // trilhas de circuito nas asas
    g.strokeStyle = hsl(hue + 150, 95, 82, 0.9);
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(12, -12); g.lineTo(30, -16); g.lineTo(38, -28); g.lineTo(54, -30);
    g.moveTo(12, -4); g.lineTo(34, -6); g.lineTo(44, 2); g.lineTo(60, 0);
    g.moveTo(14, 8); g.lineTo(26, 20); g.lineTo(36, 22);
    g.stroke();
    g.fillStyle = hsl(hue + 150, 95, 88);
    g.beginPath();
    g.arc(54, -30, 2.6, 0, Math.PI * 2);
    g.arc(60, 0, 2.6, 0, Math.PI * 2);
    g.arc(36, 22, 2.6, 0, Math.PI * 2);
    g.fill();
    // olhão na asa
    g.fillStyle = hsl(hue + 180, 90, 70, 0.9);
    g.beginPath();
    g.arc(52, -40, 8, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#24133a";
    g.beginPath();
    g.arc(52, -40, 3.8, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  // corpinho
  g.fillStyle = hsl(hue, 40, 24);
  g.beginPath();
  g.ellipse(0, 4, 9.5, 24, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = hsl(hue, 50, 40, 0.8);
  g.lineWidth = 2;
  for (var i = -1; i <= 2; i++) {
    g.beginPath();
    g.moveTo(-8, i * 8);
    g.lineTo(8, i * 8);
    g.stroke();
  }
  g.fillStyle = hsl(hue, 42, 30);
  g.beginPath();
  g.arc(0, -24, 11.5, 0, Math.PI * 2);
  g.fill();
  // antenas
  g.strokeStyle = hsl(hue, 60, 60);
  g.lineWidth = 2.2;
  g.lineCap = "round";
  for (var s = -1; s <= 1; s += 2) {
    g.beginPath();
    g.moveTo(s * 4, -33);
    g.quadraticCurveTo(s * 12, -52, s * 22, -56);
    g.stroke();
    desenharBrilho(g, s * 22, -56, 10, hslParaRgb(hue + 80, 95, 70), 0.7);
    g.fillStyle = hsl(hue + 80, 95, 85);
    g.beginPath();
    g.arc(s * 22, -56, 3, 0, Math.PI * 2);
    g.fill();
  }
  olhoBicho(g, -5, -25, 3.4, hue);
  olhoBicho(g, 5, -25, 3.4, hue);
}

function bichoBesouro(g, t, hue, fase) {
  var anda = Math.sin(t * 6 + fase);
  // perninhas
  g.strokeStyle = hsl(hue, 45, 20);
  g.lineWidth = 4.5;
  g.lineCap = "round";
  g.lineJoin = "round";
  for (var lado = -1; lado <= 1; lado += 2) {
    for (var i = 0; i < 3; i++) {
      var mexe = Math.sin(t * 6 + fase + i * 2.1) * 4;
      g.beginPath();
      g.moveTo(lado * 20, 8 + i * 9);
      g.lineTo(lado * 40, 14 + i * 10 + mexe);
      g.lineTo(lado * 46, 28 + i * 8 + mexe * 0.5);
      g.stroke();
    }
  }
  // casco
  var gs = g.createRadialGradient(-12, -12, 4, 0, 6, 46);
  gs.addColorStop(0, hsl(hue, 78, 66));
  gs.addColorStop(0.6, hsl(hue, 70, 42));
  gs.addColorStop(1, hsl(hue, 60, 24));
  g.fillStyle = gs;
  g.strokeStyle = hsl(hue, 50, 16);
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(0, 6, 38, 33, 0, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  // divisão do casco
  g.strokeStyle = hsl(hue, 50, 16);
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(0, -26);
  g.lineTo(0, 38);
  g.stroke();
  // circuitos no casco
  g.strokeStyle = hsl(hue + 150, 95, 78, 0.9);
  g.lineWidth = 1.8;
  g.beginPath();
  g.moveTo(-6, -14); g.lineTo(-18, -14); g.lineTo(-24, -4); g.lineTo(-24, 10); g.lineTo(-14, 18);
  g.moveTo(6, -14); g.lineTo(18, -14); g.lineTo(24, -4); g.lineTo(24, 10); g.lineTo(14, 18);
  g.moveTo(-6, 4); g.lineTo(-14, 4);
  g.moveTo(6, 4); g.lineTo(14, 4);
  g.stroke();
  g.fillStyle = hsl(hue + 150, 95, 88);
  g.beginPath();
  g.arc(-14, 18, 2.6, 0, Math.PI * 2);
  g.arc(14, 18, 2.6, 0, Math.PI * 2);
  g.arc(-14, 4, 2.2, 0, Math.PI * 2);
  g.arc(14, 4, 2.2, 0, Math.PI * 2);
  g.fill();
  // brilho no casco
  g.strokeStyle = "rgba(255,255,255,0.35)";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(0, 6, 28, Math.PI * 1.15, Math.PI * 1.45);
  g.stroke();
  // cabeça e chifre
  g.fillStyle = hsl(hue, 50, 26);
  g.strokeStyle = hsl(hue, 50, 14);
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(0, -30, 19, 13, 0, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = hsl(hue, 50, 28);
  g.beginPath();
  g.moveTo(-4, -38);
  g.quadraticCurveTo(-6 + anda, -56, -14, -64);
  g.quadraticCurveTo(-2, -60, 0, -48);
  g.quadraticCurveTo(2, -60, 14, -64);
  g.quadraticCurveTo(6 - anda, -56, 4, -38);
  g.closePath();
  g.fill();
  g.stroke();
  // mandíbulas
  g.strokeStyle = hsl(hue, 50, 20);
  g.lineWidth = 3.5;
  g.beginPath();
  g.moveTo(-7, -22); g.quadraticCurveTo(-13, -16, -7, -13);
  g.moveTo(7, -22); g.quadraticCurveTo(13, -16, 7, -13);
  g.stroke();
  olhoBicho(g, -8, -31, 3.8, hue);
  olhoBicho(g, 8, -31, 3.8, hue);
}

function bichoSlime(g, t, hue, fase) {
  var s = Math.sin(t * 3.4 + fase);
  g.scale(1 + s * 0.07, 1 - s * 0.07);
  g.translate(0, 6 + s * 2);

  // corpo gelatinoso
  var gs = g.createRadialGradient(-14, -22, 4, 0, -4, 54);
  gs.addColorStop(0, hsl(hue, 85, 76, 0.95));
  gs.addColorStop(0.6, hsl(hue, 80, 52, 0.9));
  gs.addColorStop(1, hsl(hue, 75, 34, 0.95));
  g.fillStyle = gs;
  g.strokeStyle = hsl(hue, 90, 84, 0.95);
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-44, 30);
  g.bezierCurveTo(-52, -10, -32, -46, 0, -46);
  g.bezierCurveTo(32, -46, 52, -10, 44, 30);
  g.quadraticCurveTo(0, 42, -44, 30);
  g.closePath();
  g.fill();
  g.stroke();

  // bitzinhos flutuando dentro
  var chars = ["0", "1", "1", "0", "1"];
  g.font = "bold 11px monospace";
  g.textAlign = "center";
  g.textBaseline = "middle";
  for (var i = 0; i < 5; i++) {
    var bx = -26 + i * 13 + Math.sin(t * 1.5 + i * 2 + fase) * 4;
    var by = 14 + Math.cos(t * 1.8 + i + fase) * 6 - (i % 2) * 8;
    g.fillStyle = hsl(hue + 160, 95, 80, 0.35);
    g.fillRect(bx - 6, by - 6, 12, 12);
    g.fillStyle = hsl(hue + 160, 100, 92, 0.95);
    g.fillText(chars[i], bx, by);
  }

  // brilho
  g.fillStyle = "rgba(255,255,255,0.5)";
  g.beginPath();
  g.ellipse(-22, -28, 9, 5, -0.7, 0, Math.PI * 2);
  g.fill();

  // olhos bravos
  for (var lado = -1; lado <= 1; lado += 2) {
    g.fillStyle = "#fff";
    g.beginPath();
    g.ellipse(lado * 14, -10, 8.5, 10.5, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1c0f2e";
    g.beginPath();
    g.arc(lado * 14 - lado * 2, -8, 4.6, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(lado * 14 - lado * 3.4, -10, 1.5, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = hsl(hue, 70, 22);
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(lado * 6, -26);
    g.lineTo(lado * 22, -20);
    g.stroke();
  }
  // boquinha
  g.strokeStyle = hsl(hue, 70, 20);
  g.lineWidth = 2.6;
  g.beginPath();
  g.moveTo(-8, 6); g.lineTo(-4, 10); g.lineTo(0, 6); g.lineTo(4, 10); g.lineTo(8, 6);
  g.stroke();
}

function bichoEspectro(g, t, hue, fase) {
  var onda = t * 3 + fase;
  // chama na cabeça
  var f = 1 + Math.sin(t * 12 + fase) * 0.14;
  desenharBrilho(g, 0, -56, 26, hslParaRgb(hue + 25, 95, 65), 0.65);
  g.fillStyle = hsl(hue + 25, 95, 62);
  g.beginPath();
  g.moveTo(0, -38);
  g.quadraticCurveTo(-11 * f, -52, 0, -74 * f);
  g.quadraticCurveTo(11 * f, -52, 0, -38);
  g.fill();
  g.fillStyle = hsl(hue + 25, 100, 90);
  g.beginPath();
  g.moveTo(0, -40);
  g.quadraticCurveTo(-5, -50, 0, -60);
  g.quadraticCurveTo(5, -50, 0, -40);
  g.fill();

  // bracinhos
  for (var lado = -1; lado <= 1; lado += 2) {
    g.fillStyle = hsl(hue, 55, 82, 0.8);
    g.beginPath();
    g.ellipse(lado * 36, 6 + Math.sin(onda + lado) * 4, 8, 11, lado * 0.5, 0, Math.PI * 2);
    g.fill();
  }

  // corpo fantasma
  var gs = g.createLinearGradient(0, -40, 0, 42);
  gs.addColorStop(0, hsl(hue, 75, 86, 0.97));
  gs.addColorStop(1, hsl(hue, 80, 52, 0.85));
  g.fillStyle = gs;
  g.strokeStyle = hsl(hue, 80, 92, 0.9);
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(-31, -10);
  g.arc(0, -10, 31, Math.PI, 0);
  g.lineTo(31, 34);
  for (var i = 0; i <= 5; i++) {
    var px = 31 - i * 12.4;
    var py = 34 + ((i % 2 == 0) ? 9 : -2) + Math.sin(onda + i) * 3;
    g.lineTo(px, py);
  }
  g.closePath();
  g.fill();
  g.stroke();

  // olhos vazados e boca
  for (var l = -1; l <= 1; l += 2) {
    g.fillStyle = "#1e1236";
    g.beginPath();
    g.ellipse(l * 12, -12, 7.5, 11, 0, 0, Math.PI * 2);
    g.fill();
    desenharBrilho(g, l * 12, -10, 9, hslParaRgb(hue + 30, 95, 70), 0.8);
    g.fillStyle = hsl(hue + 30, 100, 85);
    g.beginPath();
    g.arc(l * 12, -9, 2.6, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "#1e1236";
  g.beginPath();
  g.ellipse(0, 10, 7, 7 + Math.sin(onda * 2) * 1.5, 0, 0, Math.PI * 2);
  g.fill();
}

// =====================================================
// PLAQUINHA COM O NOME (igual no Minecraft!)
// estado: normal | hover | certo | errado
// Retorna o retângulo da plaquinha (para detectar clique).
// =====================================================
function desenharPlaquinha(g, x, y, texto, u, numero, estado, alfa) {
  g.save();
  g.globalAlpha = alfa == null ? 1 : alfa;
  var tamanhoFonte = Math.round(15 * u);
  g.font = "bold " + tamanhoFonte + "px 'Trebuchet MS', Verdana, sans-serif";
  g.textBaseline = "middle";
  g.textAlign = "left";
  var largTexto = g.measureText(texto).width;
  var pad = 10 * u;
  var badge = 22 * u;
  var larg = largTexto + pad * 2 + badge + 6 * u;
  var alt = 30 * u;
  var px = x - larg / 2;
  var py = y - alt;

  var corFundo = "rgba(24,14,44,0.86)";
  var corBorda = "rgba(255,230,180,0.55)";
  var corBadge = "#f0c05c";
  if (estado == "hover") {
    corBorda = "#ffe08a";
    corFundo = "rgba(60,32,92,0.92)";
  } else if (estado == "certo") {
    corBorda = "#7cf0a8";
    corFundo = "rgba(20,70,48,0.92)";
    corBadge = "#7cf0a8";
  } else if (estado == "errado") {
    corBorda = "#ff6b7d";
    corFundo = "rgba(80,20,34,0.92)";
    corBadge = "#ff6b7d";
  }

  // sombra
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 8 * u;
  g.fillStyle = corFundo;
  g.beginPath();
  g.roundRect(px, py, larg, alt, 8 * u);
  g.fill();
  g.shadowBlur = 0;
  g.strokeStyle = corBorda;
  g.lineWidth = 2 * u;
  g.stroke();
  // pontinha apontando para o bug
  g.fillStyle = corFundo;
  g.beginPath();
  g.moveTo(x - 6 * u, py + alt - 1);
  g.lineTo(x + 6 * u, py + alt - 1);
  g.lineTo(x, py + alt + 7 * u);
  g.closePath();
  g.fill();
  g.strokeStyle = corBorda;
  g.beginPath();
  g.moveTo(x - 6 * u, py + alt);
  g.lineTo(x, py + alt + 7 * u);
  g.lineTo(x + 6 * u, py + alt);
  g.stroke();

  // numerozinho (tecla de atalho)
  g.fillStyle = corBadge;
  g.beginPath();
  g.arc(px + pad + badge / 2 - 2 * u, py + alt / 2, badge / 2, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#2a1640";
  g.textAlign = "center";
  g.font = "bold " + Math.round(13 * u) + "px 'Trebuchet MS', Verdana, sans-serif";
  g.fillText(estado == "errado" ? "✖" : String(numero), px + pad + badge / 2 - 2 * u, py + alt / 2 + 1);

  // nome
  g.fillStyle = "#fff";
  g.textAlign = "left";
  g.font = "bold " + tamanhoFonte + "px 'Trebuchet MS', Verdana, sans-serif";
  g.fillText(texto, px + pad + badge + 4 * u, py + alt / 2 + 1);
  g.restore();

  return { x: px, y: py, w: larg, h: alt + 7 * u };
}
