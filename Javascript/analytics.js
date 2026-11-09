// HR&PC Advogados · Medição de acessos (Google Analytics 4) com consentimento
// O GA4 só é carregado depois que o visitante clica em "Aceitar".
// Sem consentimento, nenhum cookie de medição é gravado.

(function () {
  // Código de medição do GA4 (Administrador > Fluxos de dados > Web)
  var GA_ID = "G-DCGND9EXNQ";
  var CHAVE = "hrpc_consentimento_cookies"; // valores: "aceito" ou "recusado"

  function lerEscolha() {
    try {
      return window.localStorage.getItem(CHAVE);
    } catch (e) {
      return null;
    }
  }

  function gravarEscolha(valor) {
    try {
      window.localStorage.setItem(CHAVE, valor);
    } catch (e) {}
  }

  var gaCarregado = false;

  function carregarGA() {
    if (gaCarregado || !/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID === "G-XXXXXXXXXX") return;
    gaCarregado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function evento(nome, parametros) {
    if (gaCarregado && typeof window.gtag === "function") {
      window.gtag("event", nome, parametros || {});
    }
  }

  // Identifica de qual botão de WhatsApp veio o clique
  function rotuloWhatsApp(link) {
    var href = link.getAttribute("href") || "";
    var destino = "escritorio";
    if (href.indexOf("5541999256030") > -1) destino = "helanderson";
    else if (href.indexOf("5541988832414") > -1) destino = "paulo";
    var secao = link.closest("section, header, footer");
    var local = link.classList.contains("whatsapp-flutuante")
      ? "botao_flutuante"
      : secao && secao.id
      ? secao.id
      : secao
      ? secao.tagName.toLowerCase()
      : "pagina";
    return { destino: destino, local: local };
  }

  function rastrearCliques() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      var href = link.getAttribute("href") || "";
      if (href.indexOf("wa.me/") > -1) {
        var r = rotuloWhatsApp(link);
        // generate_lead é o evento recomendado do GA4 para contato; marque-o como evento-chave
        evento("generate_lead", { metodo: "whatsapp", destino: r.destino, local_do_botao: r.local });
      } else if (href.indexOf("mailto:") === 0) {
        evento("generate_lead", { metodo: "email", destino: "escritorio", local_do_botao: "contato" });
      } else if (href.indexOf("tel:") === 0) {
        evento("generate_lead", { metodo: "telefone", destino: "escritorio", local_do_botao: "contato" });
      }
    });
  }

  function montarAviso() {
    var aviso = document.createElement("div");
    aviso.className = "aviso-cookies";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.innerHTML =
      '<p>Usamos cookies de medição (Google Analytics) para saber quantas pessoas visitam o site e quais conteúdos são úteis. ' +
      'Você pode aceitar ou recusar. Saiba mais na <a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>' +
      '<div class="aviso-cookies-botoes">' +
      '<button type="button" class="botao botao-contorno botao-pequeno" data-escolha="recusado">Recusar</button>' +
      '<button type="button" class="botao botao-cobre botao-pequeno" data-escolha="aceito">Aceitar</button>' +
      "</div>";
    aviso.addEventListener("click", function (e) {
      var escolha = e.target.getAttribute && e.target.getAttribute("data-escolha");
      if (!escolha) return;
      gravarEscolha(escolha);
      aviso.remove();
      if (escolha === "aceito") carregarGA();
    });
    document.body.appendChild(aviso);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var escolha = lerEscolha();
    if (escolha === "aceito") carregarGA();
    else if (escolha !== "recusado") montarAviso();
    rastrearCliques();

    // Link "Preferências de cookies" no rodapé reabre o aviso
    document.querySelectorAll("[data-preferencias-cookies]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        try {
          window.localStorage.removeItem(CHAVE);
        } catch (err) {}
        if (!document.querySelector(".aviso-cookies")) montarAviso();
      });
    });
  });
})();
