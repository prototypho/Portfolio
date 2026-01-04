/* === ANIMACIÓN SCROLL REVEAL (REPETIBLE) === */

const revealItems = document.querySelectorAll(".tech-item");

const observerTech = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // entra en viewport → anima
        entry.target.classList.add("show");
      } else {
        // sale del viewport → resetea
        entry.target.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

// animación escalonada (se mantiene)
revealItems.forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.07}s`;
  observerTech.observe(item);
});

/* === ACORDEÓN "VER MÁS" EN TECNOLOGÍAS === */

  const btn = document.getElementById("toggleMore");
  const acc = document.getElementById("accordionMore");

  btn.addEventListener("click", () => {
    const isOpen = acc.classList.toggle("open");
    btn.classList.toggle("open");

    if (isOpen) {
      // auto contenido (sin cortes)
      acc.style.maxHeight = acc.scrollHeight + 200 + "px";
      btn.innerHTML = 'SEE LESS <span class="arrow">▸</span>';
    } else {
      acc.style.maxHeight = 0;
      btn.innerHTML = 'SEE MORE  <span class="arrow">▸</span>';
    }
  });
