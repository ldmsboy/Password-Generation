'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const blobs = document.querySelectorAll('.parallax-blob');
    const sections = document.querySelectorAll('.section-full');

    // 1. Animación de Parallax para los blobs de fondo
    if (blobs.length > 0) {
        const handleParallaxScroll = () => {
            const scrollY = window.scrollY;
            blobs.forEach(blob => {
                const speed = parseFloat(blob.dataset.speed) || 0.5;
                const movement = -(scrollY * speed);
                blob.style.transform = `translateY(${movement}px)`;
            });
        };
        window.addEventListener('scroll', () => window.requestAnimationFrame(handleParallaxScroll), { passive: true });
    }

    // 2. Intersection Observer para animar las secciones al entrar en la vista
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.6 // La animación se dispara cuando el 60% de la sección es visible
        });
        sections.forEach(section => observer.observe(section));
    }
});