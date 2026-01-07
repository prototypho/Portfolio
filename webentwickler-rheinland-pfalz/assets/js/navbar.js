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

(() => {
  const modal = document.getElementById("modal-contacto");
  if (!modal) return;

  const openButtons = [
    document.getElementById("btn-abrir-modal"),
    document.getElementById("btn-abrir-modal-mobile"), // si existe
  ].filter(Boolean);

  const closeBtn = modal.querySelector(".modal-cerrar");

  const openModal = () => {
    modal.classList.add("activo");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("activo");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openButtons.forEach(btn => btn.addEventListener("click", openModal));
  closeBtn?.addEventListener("click", closeModal);

  // Cerrar tocando fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();

