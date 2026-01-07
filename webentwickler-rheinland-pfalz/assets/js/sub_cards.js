 (() => {
    const grids = document.querySelectorAll('[data-stagger="services"]');
    if (!('IntersectionObserver' in window) || !grids.length) return;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // Entra -> anima / Sale -> resetea
        e.target.classList.toggle('is-in', e.isIntersecting);
      }
    }, {
      threshold: 0.22,
      rootMargin: "0px 0px -10% 0px"
    });

    grids.forEach(g => io.observe(g));
  })();

