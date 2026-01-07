(() => {
  const KEY = "cookie_consent_v1";
  const banner = document.getElementById("cookieBanner");
  const btnAccept = document.getElementById("cookieAccept");
  const btnReject = document.getElementById("cookieReject");

  if (!banner || !btnAccept || !btnReject) return;

  const getConsent = () => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  };

  const setConsent = (value) => {
    try { localStorage.setItem(KEY, value); } catch {}
  };

  const show = () => {
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add("is-visible"));
  };

  const hide = () => {
    banner.classList.remove("is-visible");
    // espera a la transición para ocultar
    setTimeout(() => { banner.hidden = true; }, 250);
  };

  // Si ya eligió, no mostramos
  if (!getConsent()) show();

  btnAccept.addEventListener("click", () => {
    setConsent("accepted");
    hide();
    // Aquí podrías activar analytics si lo usas
  });

  btnReject.addEventListener("click", () => {
    setConsent("rejected");
    hide();
    // Aquí aseguras que analytics NO se cargue
  });
})();
