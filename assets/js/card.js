/* ==========================================================================
   DIGITAL BUSINESS CARD & QR SCRIPT - JR DEVELOPER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initQRCode();
});

// vCard Generator & Downloader
function downloadVCard() {
  const vcardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Rodriguez;Jonathan;;;',
    'FN:Jonathan Rodriguez',
    'ORG:JR Developer',
    'TITLE:Web & Software Entwickler',
    'TEL;TYPE=CELL,VOICE:+491607532093',
    'EMAIL;TYPE=PREF,INTERNET:info@jr-developer.de',
    'URL:https://jr-developer.de/',
    'ADR;TYPE=WORK:;;Sarresdorfer Str. 51;Gerolstein;Rheinland-Pfalz;54568;Germany',
    'NOTE:JR Developer - Webentwicklung & Softwarelösungen in Rheinland-Pfalz',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Jonathan_Rodriguez_JR_Developer.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('✓ Contacto guardado / Visitenkarte heruntergeladen');
}

// QR Code Initializer & Renderer
function initQRCode() {
  const qrContainer = document.getElementById('qrcode');
  if (!qrContainer) return;

  // Clear previous content
  qrContainer.innerHTML = '';

  // Get current card URL or fallback live URL
  const currentUrl = window.location.href.includes('http') 
    ? window.location.href 
    : 'https://jr-developer.de/card.html';

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: currentUrl,
      width: 152,
      height: 152,
      colorDark: '#050509',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    // Fallback QR code generator via standard API if local library fails to load
    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=152x152&data=${encodeURIComponent(currentUrl)}`;
    img.alt = 'QR Code JR Developer';
    img.width = 152;
    img.height = 152;
    qrContainer.appendChild(img);
  }
}

// High-Resolution PNG QR Code Download
function downloadQRCode() {
  const qrContainer = document.getElementById('qrcode');
  if (!qrContainer) return;

  let qrImgSrc = '';
  const canvas = qrContainer.querySelector('canvas');
  const img = qrContainer.querySelector('img');

  if (canvas) {
    qrImgSrc = canvas.toDataURL('image/png');
  } else if (img) {
    qrImgSrc = img.src;
  }

  if (!qrImgSrc) {
    showToast('❌ Error al generar QR');
    return;
  }

  // Create high-res canvas for download with stylish card framing
  const exportCanvas = document.createElement('canvas');
  const size = 1000;
  exportCanvas.width = size;
  exportCanvas.height = size;
  const ctx = exportCanvas.getContext('2d');

  // Background
  ctx.fillStyle = '#050509';
  ctx.fillRect(0, 0, size, size);

  // Border & Glow
  ctx.strokeStyle = '#f5c14b';
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, size - 60, size - 60);

  // Header Title
  ctx.fillStyle = '#f5c14b';
  ctx.font = 'bold 46px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('JR DEVELOPER', size / 2, 110);

  ctx.fillStyle = '#ffffff';
  ctx.font = '30px Inter, sans-serif';
  ctx.fillText('Jonathan Rodriguez | Web & Software', size / 2, 160);

  // Draw QR Image in Center
  const qrImage = new Image();
  qrImage.crossOrigin = 'anonymous';
  qrImage.onload = () => {
    // White background box for QR code
    const boxSize = 640;
    const boxX = (size - boxSize) / 2;
    const boxY = 210;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(boxX, boxY, boxSize, boxSize, 30) : ctx.fillRect(boxX, boxY, boxSize, boxSize);
    ctx.fill();

    // Draw QR image centered
    const qrDrawSize = 560;
    const qrDrawX = (size - qrDrawSize) / 2;
    const qrDrawY = boxY + 40;
    ctx.drawImage(qrImage, qrDrawX, qrDrawY, qrDrawSize, qrDrawSize);

    // Footer
    ctx.fillStyle = '#9a9daa';
    ctx.font = '26px Inter, sans-serif';
    ctx.fillText('https://jr-developer.de/', size / 2, 920);

    // Download PNG
    const a = document.createElement('a');
    a.href = exportCanvas.toDataURL('image/png');
    a.download = 'JR_Developer_QR_Code.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('✓ Código QR descargado (PNG)');
  };

  qrImage.src = qrImgSrc;
}

// Copy to Clipboard Helper
function copyText(text, label) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`✓ ${label} copiado`);
    });
  } else {
    showToast(`✓ ${text}`);
  }
}

// Toast Display Function
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
