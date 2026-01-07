 document.addEventListener("DOMContentLoaded", function () {
    const btnAbrir = document.getElementById("btn-abrir-modal");
    const modal = document.getElementById("modal-contacto");
    const btnsCerrar = modal.querySelectorAll(".modal-cerrar");
    const form = document.getElementById("form-contacto");

    function abrirModal() {
      modal.classList.add("activo");
      modal.setAttribute("aria-hidden", "false");
    }

    function cerrarModal() {
      modal.classList.remove("activo");
      modal.setAttribute("aria-hidden", "true");
    }

    btnAbrir.addEventListener("click", abrirModal);

    btnsCerrar.forEach((btn) => {
      btn.addEventListener("click", cerrarModal);
    });

    // Cerrar haciendo click fuera del contenido
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        cerrarModal();
      }
    });

    // Cerrar con tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("activo")) {
        cerrarModal();
      }
    });

    // Manejo básico del envío (aquí puedes conectar con tu backend)
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Aquí podrías hacer un fetch() o enviar por AJAX
      // De momento solo mostramos un alert y reseteamos
      alert("¡Solicitud enviada! Te contactaremos pronto.");
      form.reset();
      cerrarModal();
    });
  });

  const bloqueFechaHora = document.getElementById("bloque-fecha-hora");
const radiosPreferencia = document.querySelectorAll("input[name='preferencia_contacto']");

// función que controla visibilidad
function actualizarVisibilidad() {
  const valor = document.querySelector("input[name='preferencia_contacto']:checked").value;
  if (valor === "telefono") {
    bloqueFechaHora.style.display = "grid"; // se muestra
  } else {
    bloqueFechaHora.style.display = "none"; // se oculta
  }
}

// ejecutar al cargar y al cambiar la selección
actualizarVisibilidad();
radiosPreferencia.forEach(radio => {
  radio.addEventListener("change", actualizarVisibilidad);
});
