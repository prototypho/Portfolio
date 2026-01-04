(() => {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("nav-panel");

  if (!nav || !toggle || !panel) return;

  const openMenu = () => {
    nav.classList.add("is-open");
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // evita scroll detrás
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar al hacer click en links del panel
  panel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeMenu();
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Cerrar si pasas a desktop (por ejemplo rotación de pantalla)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();
