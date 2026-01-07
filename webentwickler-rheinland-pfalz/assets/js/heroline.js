document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("[data-build]");
  if (!el) return;

  const original = el.textContent.trim();

  const buildPieces = () => {
    el.textContent = "";
    el.classList.add("is-built");
    el.classList.remove("is-animating");

    // Divide por palabras (puedes cambiar a chunks 2 en 2 si quieres)
    const words = original.split(/\s+/);

    const dirs = [
      { tx: -18, ty:  0,  rot: -2 },
      { tx:  18, ty:  0,  rot:  2 },
      { tx:  0,  ty: -14, rot: -1 },
      { tx:  0,  ty:  14, rot:  1 },
      { tx: -14, ty: -10, rot:  2 },
      { tx:  14, ty:  10, rot: -2 }
    ];

    const frag = document.createDocumentFragment();

    words.forEach((w, i) => {
      const d = dirs[Math.floor(Math.random() * dirs.length)];

      const piece = document.createElement("span");
      piece.className = "piece";
      piece.style.setProperty("--tx", `${d.tx}px`);
      piece.style.setProperty("--ty", `${d.ty}px`);
      piece.style.setProperty("--rot", `${d.rot}deg`);

      // delays nuevos cada vez => se siente vivo en cada repetición
      const delay = i * 28 + Math.random() * 45;
      piece.style.transitionDelay = `${delay}ms`;

      const inner = document.createElement("span");
      inner.textContent = w;

      piece.appendChild(inner);
      frag.appendChild(piece);
      frag.appendChild(document.createTextNode(" "));
    });

    el.appendChild(frag);

    // fuerza reflow para que el navegador registre el estado "reset"
    void el.offsetWidth;
  };

  // construimos una vez al cargar
  buildPieces();

  // Repite al entrar/salir del viewport
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        // dispara animación
        el.classList.add("is-animating");
      } else {
        // reset cuando sale, para que al volver entre se repita
        buildPieces();
      }
    }
  }, { threshold: 0.55 });

  io.observe(el);
});
