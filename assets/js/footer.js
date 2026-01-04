(function () {
    const footer = document.getElementById('footerReveal');
    if (!footer) return;

    function updateFooterReveal() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowH = window.innerHeight;
      const docH = doc.scrollHeight;

      const distanciaAbajo = docH - (scrollTop + windowH);

      const umbral = 300; // px desde el final donde empieza a revelarse
      let t = 0;

      if (distanciaAbajo < umbral) {
        // 0 (lejos) → 1 (muy cerca del final)
        t = 1 - (distanciaAbajo / umbral);
        t = Math.max(0, Math.min(1, t));
      }

      // 0 => oculto (100%) | 1 => visible (0%)
      const translate = (1 - t) * 100;
      footer.style.transform = `translateY(${translate}%)`;
    }

    window.addEventListener('scroll', updateFooterReveal);
    window.addEventListener('resize', updateFooterReveal);
    updateFooterReveal();
  })();