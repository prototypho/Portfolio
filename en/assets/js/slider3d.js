document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.banner .slider');
    if (!slider) return;

    // Selectores del panel de información (Drawer)
    const drawer = document.getElementById('info-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('close-drawer');
    const drawerImg = document.getElementById('drawer-img');
    const drawerTitle = document.getElementById('drawer-title');
    const drawerDesc = document.getElementById('drawer-desc');
    const drawerTech = document.getElementById('drawer-tech');
    const drawerLink = document.getElementById('drawer-link');
    const drawerFeedbackContainer = document.getElementById('drawer-feedback-container');
    const drawerFeedbackLink = document.getElementById('drawer-feedback-link');

    // Configuraciones de la animación
    const AUTO_ROTATION_SPEED = 18; // Grados por segundo (360 deg / 20s = 18 deg/s)
    const DRAG_SENSITIVITY = 0.15; // Multiplicador de velocidad al arrastrar
    const FRICTION = 0.95; // Factor de amortiguación (inercia) en cada frame

    let currentAngle = 0;
    let dragVelocity = 0;
    let isDragging = false;
    let isDrawerOpen = false; // Estado del panel lateral
    let startX = 0;
    let currentX = 0;
    let lastX = 0;
    let lastTime = 0;
    let isHovered = false;
    let hoverScale = 1.0; // Escala dinámica para pausar/reanudar suavemente la rotación en hover

    // Control de tiempo para independizar de los FPS del monitor
    let lastFrameTime = performance.now();

    // Eventos para detectar el hover y ralentizar el giro de forma suave
    const banner = document.querySelector('.banner');
    if (banner) {
        banner.addEventListener('mouseenter', () => {
            if (!isDrawerOpen) isHovered = true;
        });
        banner.addEventListener('mouseleave', () => {
            isHovered = false;
            isDragging = false; // Liberación de arrastre por seguridad al salir del contenedor
        });
    }

    // Iniciar arrastre (mouse/pantalla táctil)
    const handleStart = (clientX) => {
        if (isDrawerOpen) return; // Deshabilitar arrastre si el panel está abierto
        isDragging = true;
        startX = clientX;
        lastX = clientX;
        currentX = clientX;
        dragVelocity = 0;
        lastTime = performance.now();
        slider.style.cursor = 'grabbing';
    };

    // Mover durante arrastre
    const handleMove = (clientX) => {
        if (!isDragging || isDrawerOpen) return;
        currentX = clientX;
        const now = performance.now();
        const dt = Math.max(1, now - lastTime); // Evitar división por cero
        const deltaX = currentX - lastX;
        
        // Calcular velocidad en píxeles por milisegundo, mapeado a grados
        dragVelocity = (deltaX / dt) * DRAG_SENSITIVITY * 16.67; // normalizado a 60fps aproximado

        // Actualizar el ángulo de forma inmediata
        currentAngle += deltaX * DRAG_SENSITIVITY;
        slider.style.setProperty('--rotateY', `${currentAngle}deg`);

        lastX = currentX;
        lastTime = now;
    };

    // Finalizar arrastre
    const handleEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        if (!isDrawerOpen) {
            slider.style.cursor = 'grab';
        }
    };

    // Eventos de ratón (Mouse)
    slider.addEventListener('mousedown', (e) => {
        if (isDrawerOpen) return;
        
        // No iniciar arrastre si se hizo clic en el botón de información o en el enlace directo de la web
        if (e.target.closest('.info-btn') || e.target.closest('.slider-item-link')) return;

        e.preventDefault(); // Evitar selección de texto no deseada
        handleStart(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        handleMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        handleEnd();
    });

    // Eventos táctiles (Touch)
    slider.addEventListener('touchstart', (e) => {
        if (isDrawerOpen) return;
        if (e.target.closest('.info-btn') || e.target.closest('.slider-item-link')) return;

        if (e.touches.length > 0) {
            handleStart(e.touches[0].clientX);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length > 0) {
            handleMove(e.touches[0].clientX);
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        handleEnd();
    });

    // ==========================================
    // LÓGICA DE CONTROL DEL PANEL LATERAL
    // ==========================================

    // Función para abrir el panel con la información del item
    const openDrawerWithItem = (item) => {
        if (!item) return;

        // Extraer metadatos
        const title = item.getAttribute('data-title') || '';
        const desc = item.getAttribute('data-desc') || '';
        const tech = item.getAttribute('data-tech') || '';
        const image = item.getAttribute('data-image') || '';
        const link = item.getAttribute('data-link') || '';
        const linkText = item.getAttribute('data-link-text') || 'siehe Website';
        const customerName = item.getAttribute('data-customer-name') || '';
        const rating = item.getAttribute('data-rating') || '5';
        const feedback = item.getAttribute('data-feedback') || '';

        // Rellenar dinámicamente el panel lateral
        if (drawerTitle) drawerTitle.textContent = title;
        if (drawerDesc) drawerDesc.textContent = desc;
        if (drawerImg) {
            drawerImg.src = image;
            drawerImg.alt = title;
        }

        if (drawerTech) {
            drawerTech.innerHTML = '';
            if (tech) {
                tech.split(',').forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'tech-tag';
                    tagEl.textContent = tag.trim();
                    drawerTech.appendChild(tagEl);
                });
            }
        }

        // Rellenar enlace de la web
        if (drawerLink) {
            if (link) {
                drawerLink.href = link;
                drawerLink.textContent = linkText;
                drawerLink.style.display = 'inline-block';
            } else {
                drawerLink.style.display = 'none';
            }
        }

        // Rellenar feedback
        if (drawerFeedbackContainer && drawerFeedbackLink) {
            if (customerName && feedback) {
                drawerFeedbackLink.setAttribute('data-customer-name', customerName);
                drawerFeedbackLink.setAttribute('data-rating', rating);
                drawerFeedbackLink.setAttribute('data-feedback', feedback);
                drawerFeedbackContainer.style.display = 'block';
            } else {
                drawerFeedbackContainer.style.display = 'none';
            }
        }

        // Mostrar el panel y el fondo difuminado
        if (drawer) drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        
        isDrawerOpen = true;
        isDragging = false;
        slider.style.cursor = 'default';
    };

    // Vincular evento a los botones de información de cada item
    const infoButtons = document.querySelectorAll('.banner .slider .item .info-btn');
    infoButtons.forEach(btn => {
        // Usar pointerdown para una respuesta táctil y de clic instantánea
        btn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            e.preventDefault(); // Evita mousedown virtual y problemas de descalce por rotación
            const item = btn.closest('.item');
            openDrawerWithItem(item);
        });

        // Usar click para soporte de accesibilidad (navegación por teclado Tab + Enter)
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const item = btn.closest('.item');
            openDrawerWithItem(item);
        });
    });

    // Función para cerrar el panel
    const closeDrawer = () => {
        if (drawer) drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        isDrawerOpen = false;
        slider.style.cursor = 'grab';
        
        // Reiniciar el tiempo del último frame para evitar saltos en la animación al reanudar
        lastFrameTime = performance.now();
    };

    // Vincular cierre a clics y teclado
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isDrawerOpen) {
            closeDrawer();
        }
    });

    // Bucle de animación principal con requestAnimationFrame
    function update() {
        // Si el panel lateral está abierto, pausamos el bucle de animación para evitar rotación
        if (isDrawerOpen) {
            // Seguir actualizando el tiempo de referencia para cuando se reanude
            lastFrameTime = performance.now();
            requestAnimationFrame(update);
            return;
        }

        const now = performance.now();
        const dt = (now - lastFrameTime) / 1000; // Tiempo transcurrido en segundos
        lastFrameTime = now;

        // Transición suave (Lerp) para la velocidad de auto-rotación al hacer hover
        const targetHoverScale = isHovered ? 0.15 : 1.0;
        hoverScale += (targetHoverScale - hoverScale) * 0.1;

        if (!isDragging) {
            // Aplicar fricción/amortiguación a la velocidad del arrastre
            dragVelocity *= FRICTION;
            if (Math.abs(dragVelocity) < 0.01) {
                dragVelocity = 0;
            }

            // Calcular incremento de auto-rotación según el tiempo delta transcurrido
            const autoRotation = AUTO_ROTATION_SPEED * dt * hoverScale;

            // Actualizar ángulo acumulado
            currentAngle += dragVelocity + autoRotation;

            // Asignar propiedad personalizada de CSS
            slider.style.setProperty('--rotateY', `${currentAngle}deg`);
        } else {
            // Si el mouse se detiene pero sigue presionado, reducir gradualmente la velocidad
            const timeSinceLastMove = performance.now() - lastTime;
            if (timeSinceLastMove > 100) {
                dragVelocity = 0;
            }
        }

        requestAnimationFrame(update);
    }

    // Cursor por defecto
    slider.style.cursor = 'grab';

    // Iniciar loop
    requestAnimationFrame(update);
});
