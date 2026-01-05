(() => {
  const btn = document.getElementById("btn-top");
  if (!btn) return;

  const progressCircle = btn.querySelector(".btn-top__ring-progress");
  const r = 18; // igual que el r del SVG
  const C = 2 * Math.PI * r; // circunferencia

  // set base
  progressCircle.style.strokeDasharray = `${C}`;
  progressCircle.style.strokeDashoffset = `${C}`;

  let ticking = false;

  const update = () => {
    ticking = false;

    const y = window.scrollY || document.documentElement.scrollTop;
    const doc = document.documentElement;
    const max = (doc.scrollHeight - doc.clientHeight) || 1;

    // show/hide
    btn.classList.toggle("is-visible", y > 320);
    btn.classList.toggle("is-near-top", y < 600);

    // progress
    const p = Math.min(Math.max(y / max, 0), 1);
    const offset = C - (p * C);
    progressCircle.style.strokeDashoffset = `${offset}`;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // click to top
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // initial paint
  update();
})();
