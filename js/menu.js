'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const menuContainer = document.getElementById('menu-container');
    const menuButton = document.getElementById('menu-button');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const copyrightEl = document.getElementById('copyright');

    // 1. Efecto del header al hacer scroll
    const handleScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Lógica del menú (móvil y escritorio)
    const toggleMenu = (event) => {
        event.stopPropagation();
        const isOpen = menuButton.classList.toggle('is-open');
        mobileMenu.classList.toggle('is-open');
        // En móvil, el overlay se muestra. En escritorio, no.
        if (window.innerWidth < 640) {
            menuOverlay.classList.toggle('hidden', !isOpen);
        }
    };
    menuButton.addEventListener('click', toggleMenu);

    // Cierra el menú si se hace clic fuera (en el overlay o en cualquier otro lugar)
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !menuContainer.contains(event.target) && menuButton.classList.contains('is-open')) {
            toggleMenu(event); // Reutilizamos la función para cerrar todo
        }
    });

    // 3. Copyright dinámico
    if (copyrightEl) {
        copyrightEl.textContent = `© ${new Date().getFullYear()} Password Generation. Todos los derechos reservados.`;
    }
});