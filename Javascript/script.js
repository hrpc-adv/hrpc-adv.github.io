// HR&PC Advogados
// Os links de WhatsApp ficam fixos no HTML: este arquivo não altera nenhum link.

document.addEventListener("DOMContentLoaded", () => {
  // 1. Menu do celular
  const botaoMenu = document.querySelector(".menu-botao");
  const menu = document.getElementById("menu-principal");

  if (botaoMenu && menu) {
    const fecharMenu = () => {
      menu.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
    };

    botaoMenu.addEventListener("click", () => {
      const aberto = menu.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fecharMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fecharMenu();
    });
  }

  // 2. Fotos dos sócios: se o arquivo ainda não existir, mostra as iniciais
  document.querySelectorAll(".socio-foto img, .historia-foto img").forEach((img) => {
    const esconder = () => img.remove();
    if (img.complete && img.naturalWidth === 0) esconder();
    else img.addEventListener("error", esconder);
  });

  // 3. Revelação suave ao rolar (o conteúdo nunca fica preso invisível)
  const elementos = document.querySelectorAll(".revelar");

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("visivel"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elementos.forEach((el) => observador.observe(el));
});
