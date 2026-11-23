// =====================================================
// GRIMÓRIO - 16 cartas de estudo. Toque na carta para virar.
// =====================================================

var Grimorio = (function () {
  var filtro = "todas";

  function montarFiltros() {
    var el = $("grim-filtros");
    el.innerHTML = "";
    var itens = [["todas", "Todas"]];
    for (var k in categorias) {
      itens.push([k, categorias[k].icone + " " + categorias[k].nome]);
    }
    for (var i = 0; i < itens.length; i++) {
      var b = document.createElement("button");
      b.className = "filtro" + (itens[i][0] == filtro ? " ativo" : "");
      b.textContent = itens[i][1];
      b.setAttribute("data-f", itens[i][0]);
      b.onclick = function () {
        somTocar("clique");
        filtro = this.getAttribute("data-f");
        abrir();
      };
      el.appendChild(b);
    }
  }

  function desenharBichinho(canvas, idx) {
    var c = canvas.getContext("2d");
    c.clearRect(0, 0, canvas.width, canvas.height);
    desenharBicho(c, idx % 4, canvas.width / 2, canvas.height / 2 + 6, 1.05, idx * 0.7, huesCategoria[palavras[idx].categoria], { fase: idx, aura: 0.4 });
  }

  function abrir() {
    montarFiltros();
    var grade = $("grim-grade");
    grade.innerHTML = "";
    var n = 0;
    for (var i = 0; i < palavras.length; i++) {
      var p = palavras[i];
      if (filtro != "todas" && p.categoria != filtro) {
        continue;
      }
      var cat = categorias[p.categoria];
      var carta = document.createElement("button");
      carta.className = "carta";
      carta.style.animationDelay = (n * 0.04) + "s";
      carta.style.setProperty("--cor", cat.cor);
      carta.setAttribute("data-i", i);
      carta.innerHTML =
        '<div class="carta-miolo">' +
        '<div class="face frente"><canvas width="260" height="220"></canvas><span class="cat">' + cat.nome + "</span><b>" + p.nome + "</b>" +
        '<span class="visto"></span></div>' +
        '<div class="face verso"><span class="cat">' + cat.nome + "</span><b>" + p.nome + "</b>" +
        '<p class="pista">“' + p.pistas[0] + "”</p><p>" + p.explicacao + "</p></div>" +
        "</div>";
      carta.onclick = function () {
        var id = parseInt(this.getAttribute("data-i"), 10);
        somTocar("carta");
        this.classList.toggle("virada");
        if (this.classList.contains("virada")) {
          Perfil.estudar(id);
          marcarVisto(this, id);
          atualizarProgresso();
        }
      };
      grade.appendChild(carta);
      desenharBichinho(carta.querySelector("canvas"), i);
      marcarVisto(carta, i);
      n++;
    }
    atualizarProgresso();
  }

  function marcarVisto(carta, id) {
    carta.querySelector(".visto").textContent = Perfil.dados.estudados.indexOf(id) >= 0 ? "✔" : "";
  }

  function atualizarProgresso() {
    $("grim-progresso").textContent = Perfil.dados.estudados.length + " de " + palavras.length + " estudados";
  }

  return { abrir: abrir };
})();
