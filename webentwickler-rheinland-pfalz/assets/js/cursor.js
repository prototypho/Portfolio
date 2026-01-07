(() => {
  const isTouch =
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || reduceMotion) return;

  const dot = document.createElement("div");
  dot.className = "cy-cursor";
  const ring = document.createElement("div");
  ring.className = "cy-cursor-ring";

  document.body.appendChild(ring);
  document.body.appendChild(dot);

  document.documentElement.classList.add("has-custom-cursor");

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let dx = mx, dy = my;
  let rx = mx, ry = my;

  let visible = false;
  let lastEventTime = 0;

  const speedDot = 0.35;
  const speedRing = 0.14;

  const hoverSelector = [
    "a", "button", "[role='button']",
    "input", "textarea", "select",
    ".btn-cyberpunk", ".nav__link", ".lang-pill"
  ].join(",");

  const setHoverState = (on) => {
    document.body.classList.toggle("cy-hover", on);
  };

  const showCursor = () => {
    visible = true;
    document.body.classList.remove("cy-hidden");
  };

  const hideCursor = () => {
    document.body.classList.add("cy-hidden");
  };

  // Coloca cursor inmediatamente en la última posición conocida (sin lag)
  const snapToLast = () => {
    dx = mx; dy = my; rx = mx; ry = my;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  };

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    lastEventTime = Date.now();

    if (!visible) {
      showCursor();
      snapToLast();
    }

    const target = e.target;
    setHoverState(!!target.closest?.(hoverSelector));
  }, { passive: true });

  document.addEventListener("mousedown", () => {
    document.body.classList.add("cy-down");
    showCursor();
  });

  document.addEventListener("mouseup", () => {
    document.body.classList.remove("cy-down");
  });

  // Cuando sales de la pestaña
  window.addEventListener("blur", () => {
    hideCursor();
  });

  // Cuando vuelves a la pestaña
  window.addEventListener("focus", () => {
    // Si vuelves y el mouse estaba ya dentro, que reaparezca
    showCursor();
    snapToLast();
  });

  // Caso clave: volver desde otra pestaña (algunos navegadores no disparan focus como esperas)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      showCursor();
      snapToLast();
    } else {
      hideCursor();
    }
  });

  // Mouse sale/entra del viewport
  document.addEventListener("mouseleave", () => hideCursor());
  document.addEventListener("mouseenter", () => {
    showCursor();
    // si no hubo movimiento reciente, igual lo mostramos donde quedó
    if (Date.now() - lastEventTime > 200) snapToLast();
  });

  const loop = () => {
    dx += (mx - dx) * speedDot;
    dy += (my - dy) * speedDot;

    rx += (mx - rx) * speedRing;
    ry += (my - ry) * speedRing;

    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
