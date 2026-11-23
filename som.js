// =====================================================
// SOM - efeitos e música feitos direto no navegador (sem arquivos de áudio)
// Usamos o WebAudio: criamos sons com osciladores e ruído.
// =====================================================

var somLigado = true;
var contextoAudio = null;
var mestreAudio = null;     // volume geral
var reverbAudio = null;     // eco que deixa os sons "mágicos"
var musicaTocando = false;
var musicaTimer = null;

// O navegador só deixa tocar som depois que a pessoa clica em algo.
function somIniciar() {
  try {
    if (contextoAudio == null) {
      var Classe = window.AudioContext || window.webkitAudioContext;
      if (Classe) {
        contextoAudio = new Classe();
        mestreAudio = contextoAudio.createGain();
        mestreAudio.gain.value = 0.9;
        mestreAudio.connect(contextoAudio.destination);

        // eco: um "impulso" de ruído que some devagar
        var tamanho = Math.floor(contextoAudio.sampleRate * 1.8);
        var buffer = contextoAudio.createBuffer(2, tamanho, contextoAudio.sampleRate);
        for (var canal = 0; canal < 2; canal++) {
          var dados = buffer.getChannelData(canal);
          for (var i = 0; i < tamanho; i++) {
            dados[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / tamanho, 2.6);
          }
        }
        reverbAudio = contextoAudio.createConvolver();
        reverbAudio.buffer = buffer;
        var ganhoEco = contextoAudio.createGain();
        ganhoEco.gain.value = 0.35;
        reverbAudio.connect(ganhoEco);
        ganhoEco.connect(mestreAudio);
      }
    }
    if (contextoAudio != null && contextoAudio.state == "suspended") {
      contextoAudio.resume();
    }
  } catch (erro) {
    contextoAudio = null;
  }
}

// Toca um tom: frequência, duração, tipo de onda, volume, atraso, "deslize" de frequência e eco (0 a 1)
function tom(freq, duracao, tipo, volume, atraso, deslize, eco) {
  if (!somLigado || contextoAudio == null) {
    return;
  }
  try {
    var agora = contextoAudio.currentTime + (atraso || 0);
    var osc = contextoAudio.createOscillator();
    var ganho = contextoAudio.createGain();
    osc.type = tipo || "sine";
    osc.frequency.setValueAtTime(freq, agora);
    if (deslize) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * deslize), agora + duracao);
    }
    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(volume || 0.15, agora + 0.015);
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);
    osc.connect(ganho);
    ganho.connect(mestreAudio);
    if (eco && reverbAudio) {
      var envio = contextoAudio.createGain();
      envio.gain.value = eco;
      ganho.connect(envio);
      envio.connect(reverbAudio);
    }
    osc.start(agora);
    osc.stop(agora + duracao + 0.05);
  } catch (erro) {
    // se der erro no som, o jogo continua normalmente
  }
}

// Ruído (vento, estouro, "tshhh"), com filtro para ficar grave ou agudo
function ruido(duracao, volume, filtro, atraso) {
  if (!somLigado || contextoAudio == null) {
    return;
  }
  try {
    var agora = contextoAudio.currentTime + (atraso || 0);
    var tamanho = Math.floor(contextoAudio.sampleRate * duracao);
    var buffer = contextoAudio.createBuffer(1, tamanho, contextoAudio.sampleRate);
    var dados = buffer.getChannelData(0);
    for (var i = 0; i < tamanho; i++) {
      dados[i] = (Math.random() * 2 - 1) * (1 - i / tamanho);
    }
    var fonte = contextoAudio.createBufferSource();
    fonte.buffer = buffer;
    var passa = contextoAudio.createBiquadFilter();
    passa.type = "bandpass";
    passa.frequency.value = filtro || 1200;
    var ganho = contextoAudio.createGain();
    ganho.gain.value = volume || 0.1;
    fonte.connect(passa);
    passa.connect(ganho);
    ganho.connect(mestreAudio);
    fonte.start(agora);
  } catch (erro) {
    // segue o jogo
  }
}

// Efeitos prontos
function somTocar(nome) {
  if (!somLigado) {
    return;
  }
  somIniciar();

  if (nome == "clique") {
    tom(520, 0.08, "triangle", 0.1);
  } else if (nome == "abrir") {
    tom(392, 0.12, "triangle", 0.09, 0, 1.5, 0.3);
    tom(587, 0.2, "triangle", 0.08, 0.07, 1, 0.3);
  } else if (nome == "fechar") {
    tom(587, 0.1, "triangle", 0.08);
    tom(392, 0.16, "triangle", 0.08, 0.06);
  } else if (nome == "tecla") {
    tom(700 + Math.random() * 120, 0.05, "square", 0.04);
  } else if (nome == "tiro") {
    tom(300, 0.25, "sawtooth", 0.06, 0, 4, 0.2);
    tom(900, 0.3, "sine", 0.08, 0.02, 2.4, 0.4);
  } else if (nome == "impacto") {
    ruido(0.18, 0.18, 900);
    tom(180, 0.2, "square", 0.1, 0, 0.4);
  } else if (nome == "acerto") {
    tom(523, 0.14, "triangle", 0.14, 0, 0, 0.4);
    tom(659, 0.14, "triangle", 0.14, 0.09, 0, 0.4);
    tom(784, 0.14, "triangle", 0.14, 0.18, 0, 0.4);
    tom(1046, 0.35, "triangle", 0.14, 0.27, 0, 0.5);
    ruido(0.25, 0.08, 4000, 0.02);
  } else if (nome == "erro") {
    tom(220, 0.35, "sawtooth", 0.1, 0, 0.5);
    tom(160, 0.4, "square", 0.06, 0.08, 0.5);
  } else if (nome == "dano") {
    ruido(0.2, 0.15, 400);
    tom(120, 0.3, "square", 0.13, 0, 0.4);
  } else if (nome == "dica") {
    tom(880, 0.1, "sine", 0.09, 0, 0, 0.5);
    tom(1175, 0.22, "sine", 0.08, 0.08, 0, 0.6);
  } else if (nome == "cristal") {
    tom(1318 + Math.random() * 200, 0.12, "sine", 0.09, 0, 0, 0.5);
    tom(1760, 0.18, "sine", 0.06, 0.06, 0, 0.5);
  } else if (nome == "combo") {
    tom(784, 0.1, "triangle", 0.1, 0, 0, 0.4);
    tom(988, 0.1, "triangle", 0.1, 0.07, 0, 0.4);
    tom(1318, 0.25, "triangle", 0.11, 0.14, 0, 0.5);
  } else if (nome == "passos") {
    tom(90, 0.05, "square", 0.03);
  } else if (nome == "surge") {
    tom(260, 0.22, "sine", 0.05, 0, 2.4, 0.5);
  } else if (nome == "carta") {
    tom(659, 0.12, "triangle", 0.09, 0, 0, 0.5);
    tom(880, 0.12, "triangle", 0.09, 0.08, 0, 0.5);
    tom(1175, 0.3, "triangle", 0.09, 0.16, 0, 0.6);
  } else if (nome == "onda") {
    tom(196, 0.5, "sawtooth", 0.05, 0, 1.5, 0.6);
    tom(392, 0.6, "triangle", 0.08, 0.1, 1.5, 0.6);
    tom(588, 0.8, "sine", 0.08, 0.25, 1, 0.7);
  } else if (nome == "vitoria") {
    var notas = [523, 659, 784, 1046, 784, 1046, 1318];
    for (var n = 0; n < notas.length; n++) {
      tom(notas[n], n == notas.length - 1 ? 0.8 : 0.2, "triangle", 0.14, n * 0.16, 0, 0.5);
    }
  } else if (nome == "derrota") {
    tom(392, 0.3, "sawtooth", 0.1, 0, 0.8, 0.3);
    tom(330, 0.3, "sawtooth", 0.1, 0.25, 0.8, 0.3);
    tom(262, 0.6, "sawtooth", 0.1, 0.5, 0.6, 0.3);
  } else if (nome == "runa") {
    tom(880, 0.1, "sine", 0.08, 0, 0, 0.4);
    tom(1100, 0.16, "sine", 0.08, 0.06, 0, 0.4);
  }
}

// ---------- Música ambiente (gerada na hora, bem calminha) ----------
// Escala "pentatônica": todas as notas combinam entre si, então nunca fica feio.
var escalaMusica = [220, 261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3, 784];
var passoMusica = 0;

function musicaPasso() {
  if (!somLigado || contextoAudio == null || !musicaTocando) {
    return;
  }
  // a cada 4 passos toca um "acorde" suave de fundo
  if (passoMusica % 4 == 0) {
    var base = [110, 98, 130.8, 98][Math.floor(passoMusica / 4) % 4];
    tom(base, 3.4, "sine", 0.05, 0, 0, 0.6);
    tom(base * 1.5, 3.4, "sine", 0.03, 0.05, 0, 0.6);
  }
  // notinha de "sininho" aleatória
  if (Math.random() < 0.7) {
    var nota = escalaMusica[Math.floor(Math.random() * escalaMusica.length)];
    tom(nota, 1.4, "triangle", 0.035, Math.random() * 0.4, 0, 0.9);
  }
  passoMusica++;
}

function musicaLigar() {
  if (musicaTocando) {
    return;
  }
  somIniciar();
  musicaTocando = true;
  musicaPasso();
  musicaTimer = setInterval(musicaPasso, 850);
}

function musicaDesligar() {
  musicaTocando = false;
  if (musicaTimer != null) {
    clearInterval(musicaTimer);
    musicaTimer = null;
  }
}

function somAlternar() {
  somLigado = !somLigado;
  if (somLigado) {
    somIniciar();
    tom(660, 0.12, "triangle", 0.1, 0, 0, 0.3);
  }
  return somLigado;
}
