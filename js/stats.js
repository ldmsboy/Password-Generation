'use strict';

/**
 * Convierte segundos a un formato de tiempo legible por humanos.
 * @param {number} seconds - El número de segundos a formatear.
 * @returns {string} El tiempo formateado.
 */
function formatTime(seconds) {
    if (seconds < 1) return "Instantáneo";
    
    const timeUnits = [
        { unit: 'segundos', limit: 60 },
        { unit: 'minutos', limit: 60 },
        { unit: 'horas', limit: 24 },
        { unit: 'días', limit: 365 },
        { unit: 'años', limit: 1000 },
        { unit: 'mil años', limit: 1000 },
        { unit: 'millón de años', limit: 1000 },
        { unit: 'mil millones de años', limit: 1000 },
        { unit: 'trillón de años', limit: Infinity }
    ];

    let value = seconds;
    for (const { unit, limit } of timeUnits) {
        if (value < limit || limit === Infinity) {
            return `${Math.floor(value).toLocaleString('es')} ${unit}`;
        }
        value /= limit;
    }
    
    return "Eones"; // Para números extremadamente grandes
}

/**
 * Anima un contador numérico desde un valor inicial a uno final.
 * @param {HTMLElement} element - El elemento del DOM a actualizar.
 * @param {number} start - El valor inicial.
 * @param {number} end - El valor final.
 * @param {number} duration - La duración de la animación en milisegundos.
 */
function animateCounter(element, start, end, duration) {
    if (start === end) {
        element.textContent = end.toLocaleString('es') + '+';
        return;
    }

    let startTime = null;

    const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        
        element.textContent = currentValue.toLocaleString('es') + '+';

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Asegura que el valor final sea exacto
            element.textContent = end.toLocaleString('es') + '+';
        }
    };

    window.requestAnimationFrame(step);
}


/**
 * Carga y muestra las estadísticas de uso desde la API.
 * @param {object} elements - Un objeto con los elementos del DOM para las estadísticas.
 * @param {boolean} isInitialLoad - Verdadero si es la primera carga de la página.
 */
async function loadStats(elements, isInitialLoad = false) {
    try {
        const response = await fetch('api.php?action=get_stats', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Error de red o servidor: ${response.status}`);
        const stats = await response.json();
        
        // Mapea las claves de la API a los elementos del DOM
        const statMapping = {
            passwords_generated: elements.generated,
            passwords_scanned: elements.scanned,
            users_served: elements.users,
        };

        for (const [key, element] of Object.entries(statMapping)) {
            if (element && stats[key] !== undefined) {
                const count = parseInt(stats[key], 10);
                const currentCount = parseInt(element.textContent.replace(/\D/g, ''), 10) || 0;
                if (isInitialLoad) {
                    element.textContent = count.toLocaleString('es') + '+';
                } else {
                    animateCounter(element, currentCount, count, 500); // Anima durante 500ms
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        // Muestra error en todos los elementos de estadísticas proporcionados
        for (const element of Object.values(elements)) {
            if (element) {
                element.innerHTML = '<span class="text-sm text-red-500">Error al cargar</span>';
            }
        }
    }
}

/**
 * Maneja el registro de la primera visita de un usuario para incrementar el contador.
 * @param {string} visitKey - La clave de localStorage para esta página (e.g., 'hasVisitedGenerator').
 */
async function handleFirstVisit(visitKey) {
    if (!localStorage.getItem(visitKey)) {
        try {
            const response = await fetch('api.php?action=increment_user', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            await response.json();
            localStorage.setItem(visitKey, 'true');
        } catch (error) {
            console.error('No se pudo registrar al nuevo usuario:', error);
        }
    }
}

/**
 * Inicializa el sistema de estadísticas en una página.
 * @param {string} visitKey - La clave de localStorage para la página actual.
 * @param {object} statElements - Un objeto que contiene los elementos del DOM para las estadísticas.
 */
async function initializeStats(visitKey, statElements) {
    // Asegura que los contadores no muestren nada al inicio
    Object.values(statElements).forEach(el => { if (el) el.innerHTML = '&nbsp;'; });

    await handleFirstVisit(visitKey);
    await loadStats(statElements, true); // Carga inicial
    setInterval(() => loadStats(statElements, false), 3000); // Actualizaciones periódicas
}