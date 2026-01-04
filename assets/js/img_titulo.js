  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";
  
  function generateCode(width, height) {
    let out = "";
    for (let r = 0; r < height; r++) {
      let line = "";
      for (let c = 0; c < width; c++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      out += line + (r < height - 1 ? "\n" : "");
    }
    return out;
  }

  function startEncodingEffect() {
    const overlay = document.getElementById("codeOverlay");
    if (!overlay) return;

    // Ajusta estos valores para más/menos densidad
    const width = 96;   // caracteres por línea aprox
    const height = 26;  // cantidad de líneas

    // Genera al inicio
    overlay.textContent = generateCode(width, height);

    // Intervalo rápido para simular “compilación”
    const interval = setInterval(() => {
      overlay.textContent = generateCode(width, height);
    }, 80); // cada 80ms cambia

    // Después de 2s dejamos de “codificar” (sincronizado con la animación CSS)
    setTimeout(() => {
      clearInterval(interval);
      // opcional: última “pantalla” más ordenada
      overlay.textContent =
        "/* encoding complete */\n" +
        "const status = \"OK\";\n" +
        "renderImage();\n\n" +
        generateCode(width, height - 4);
    }, 2000);
  }

  document.addEventListener("DOMContentLoaded", startEncodingEffect);

