'use strict';

// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const lengthInput = document.getElementById('length');
    const lengthDisplay = document.getElementById('length-display');
    const passwordOutput = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copy-message');
    const strengthBar = document.getElementById('strength-bar');
    const strengthDisplay = document.getElementById('strength-display');
    const generateBtn = document.getElementById('generate-btn');
    const historySection = document.getElementById('history-section');
    const timeToCrackDisplay = document.getElementById('time-to-crack-display');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const passwordsGeneratedStat = document.getElementById('passwords-generated-stat');
    const usersServedStat = document.getElementById('users-served-stat');

    const options = {
        lowercase: document.getElementById('lowercase'),
        uppercase: document.getElementById('uppercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols'),
        excludeAmbiguous: document.getElementById('exclude-ambiguous'),
    };

    const charsets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:",.<>?',
        ambiguous: 'Il1O0',
    };

    // --- CONSTANTES DE CONFIGURACIÓN ---
    const HISTORY_KEY = 'passwordGeneratorHistory';
    const MAX_HISTORY_ITEMS = 10;

    // --- ESTADO DE LA APLICACIÓN ---
    let isGenerating = false; // Flag para prevenir dobles clics/toques

    // --- FUNCIONES ---

    /**
     * Genera un número aleatorio criptográficamente seguro dentro de un rango.
     * @param {number} max - El límite superior (exclusivo).
     * @returns {number} Un número aleatorio entre 0 y max-1.
     */
    function getRandomInt(max) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        return randomBuffer[0] % max;
    }

    /**
     * Baraja los caracteres de una cadena de forma segura (algoritmo Fisher-Yates).
     * @param {string} str - La cadena a barajar.
     * @returns {string} La cadena con sus caracteres en orden aleatorio.
     */
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = getRandomInt(i + 1);
            [array[i], array[j]] = [array[j], array[i]]; // Intercambio de elementos
        }
        return array.join('');
    }


    /**
     * Genera la contraseña basándose en las opciones seleccionadas.
     */
    function generatePassword() {
        let allChars = '';
        let password = '';
        const length = parseInt(lengthInput.value, 10);

        // Crea una copia de los charsets para no modificar los originales
        let currentCharsets = { ...charsets };

        // Si se deben excluir los ambiguos, filtramos cada charset
        if (options.excludeAmbiguous.checked) {
            const ambiguousRegex = new RegExp(`[${charsets.ambiguous}]`, 'g');
            currentCharsets.lowercase = charsets.lowercase.replace(ambiguousRegex, '');
            currentCharsets.uppercase = charsets.uppercase.replace(ambiguousRegex, '');
            currentCharsets.numbers = charsets.numbers.replace(ambiguousRegex, '');
            // Los símbolos no suelen tener caracteres ambiguos, pero se podría añadir si fuera necesario
        }

        // Construir el conjunto de caracteres y garantizar al menos uno de cada tipo seleccionado
        for (const [key, checkbox] of Object.entries(options)) {
            if (key !== 'excludeAmbiguous' && checkbox.checked) {
                allChars += currentCharsets[key];
                password += currentCharsets[key][getRandomInt(currentCharsets[key].length)];
            }
        }

        // Rellenar el resto de la contraseña
        for (let i = password.length; i < length && allChars.length > 0; i++) {
            password += allChars[getRandomInt(allChars.length)];
        }

        // Barajar la contraseña para que los caracteres garantizados no estén siempre al principio
        passwordOutput.value = shuffleString(password);
        // Llama a la función para incrementar el contador
        incrementGeneratedCount();
        calculateStrength();
        addToHistory(passwordOutput.value);
    }

    /**
     * Calcula y muestra la fuerza de la contraseña generada.
     */
    function calculateStrength() {
        const password = passwordOutput.value;

        if (!password) {
            strengthDisplay.textContent = "N/A";
            strengthBar.style.width = "0%";
            strengthBar.className = 'strength-bar bg-transparent';
            timeToCrackDisplay.textContent = "Presiona 'Generar' para analizar.";
            return;
        }

        // Usamos el módulo compartido, pasando las opciones del generador
        const strength = STRENGTH_MODULE.calculate(password, options);

        strengthDisplay.textContent = `${strength.strengthText} (${strength.entropy} bits)`;
        strengthBar.style.width = strength.barWidth;

        const colorClasses = ['bg-red-600', 'bg-orange-500', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'];
        strengthBar.classList.remove(...colorClasses);
        strengthBar.classList.add(strength.barColorClass);

        timeToCrackDisplay.textContent = formatTime(strength.timeToCrack);
    }

    /**
     * Copia la contraseña al portapapeles y muestra un mensaje de confirmación.
     */
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(passwordOutput.value);
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 1500);
        } catch (err) {
            console.error('Error al copiar la contraseña: ', err);
            alert('No se pudo copiar la contraseña.');
        }
    }

    async function incrementGeneratedCount() {
    try {
        // Ejecución inmediata: La función no espera la respuesta de fetch.
        // fetch devuelve una Promesa que se maneja 'en segundo plano'.
        fetch('api.php?action=increment_password', { cache: 'no-store' })
            .then(response => {
                // Si necesitas hacer algo una vez que la respuesta llega (ej. logs),
                // lo haces aquí, pero la función principal ya ha terminado.
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                // Este catch maneja errores de red O errores HTTP
                console.error('Error durante la solicitud de incremento:', error);
            });

        // La función continúa y finaliza inmediatamente después de llamar a fetch(),
        // sin esperar la resolución de la Promesa.
        console.log("Solicitud de incremento iniciada. La función ya terminó.");

    } catch (error) {
        // Este catch solo atraparía errores síncronos dentro del try (muy raros aquí).
        console.error('Error síncrono al iniciar la solicitud:', error);
    }
}

    // --- FUNCIONES DE HISTORIAL ---

    /**
     * Obtiene el historial desde localStorage.
     * @returns {string[]} Un array de contraseñas.
     */
    function getHistory() {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    }

    /**
     * Guarda el historial en localStorage.
     * @param {string[]} history - El array de contraseñas a guardar.
     */
    function saveHistory(history) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    /**
     * Añade una nueva contraseña al historial.
     * @param {string} password - La contraseña a añadir.
     */
    function addToHistory(password) {
        if (!password) return;
        const history = getHistory();
        // Evita añadir duplicados consecutivos
        if (history[0] === password) return;

        history.unshift(password);
        // Limita el tamaño del historial
        if (history.length > MAX_HISTORY_ITEMS) {
            history.pop();
        }
        saveHistory(history);

        renderHistory();
    }

    /**
     * Renderiza la lista del historial en el DOM.
     */
    function renderHistory() {
        const history = getHistory();
        historyList.innerHTML = ''; // Limpia la lista antes de volver a renderizar

        // Si no hay historial, muestra el mensaje correspondiente
        history.forEach(password => {
            const li = document.createElement('li');
            // Estilos de tema claro y animación de entrada
            li.className = 'flex items-center justify-between bg-gray-100 p-2 rounded-lg text-sm';
            li.style.opacity = '0';
            li.style.transform = 'translateY(10px)';
            li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            li.innerHTML = `
                <span class="font-mono text-gray-700 truncate pr-4">${password}</span>
                <button class="copy-history-btn p-1 rounded-md hover:bg-gray-200 transition-colors" aria-label="Copiar esta contraseña">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><title>Copiar contraseña del historial</title><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" /></svg>
                </button>
            `;
            li.querySelector('.copy-history-btn').addEventListener('click', () => navigator.clipboard.writeText(password));
            historyList.appendChild(li);
            // Dispara la animación de entrada
            setTimeout(() => {
                li.style.opacity = '1';
                li.style.transform = 'translateY(0)';
            }, 10);
        });

        if (history.length === 0) {
            historyList.innerHTML = '<li class="text-center text-gray-500 text-sm">No hay contraseñas en el historial.</li>';
        }
    }

    // --- EVENT LISTENERS ---

    // Actualiza la longitud y genera una nueva contraseña
    lengthInput.addEventListener('input', () => {
        lengthDisplay.textContent = lengthInput.value;
        calculateStrength(); // Solo recalcula la fuerza, no genera contraseña
    });

    // Genera una nueva contraseña cuando cambian las opciones
    Object.entries(options).forEach(([key, checkbox]) => {
        checkbox.addEventListener('change', () => {
            // Asegura que al menos una casilla esté marcada
            const checkedCount = Object.values(options).filter(c => c.id !== 'exclude-ambiguous' && c.checked).length;
            if (checkedCount === 0 && key !== 'excludeAmbiguous') {
                checkbox.checked = true;
            }
            calculateStrength(); // Solo recalcula la fuerza, no genera contraseña
        });
    });

    // Calcula la fuerza al escribir o pegar en el campo de contraseña
    passwordOutput.addEventListener('input', calculateStrength);

    // Asigna los eventos a los botones
    generateBtn.addEventListener('click', () => {
        if (isGenerating) return; // Previene la ejecución si ya se está generando
        isGenerating = true; // Bloquea el botón

        // 1. Reinicia los campos de análisis para dar feedback visual inmediato.
        strengthDisplay.textContent = "Generando...";
        timeToCrackDisplay.textContent = "Calculando...";
        strengthBar.style.width = "0%";
        // Elimina cualquier clase de color anterior de la barra.
        strengthBar.className = 'strength-bar bg-transparent';

        // 2. Usa un pequeño timeout para permitir que el navegador renderice los cambios
        // antes de ejecutar la función de generación, que puede ser intensiva.
        setTimeout(() => {
            generatePassword();
            isGenerating = false; // Desbloquea el botón después de generar
        }, 50); // 50ms es suficiente para el renderizado y es imperceptible para el usuario.
    });
    copyBtn.addEventListener('click', copyToClipboard);

    // Limpia el historial
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
            // Añade una animación de desvanecimiento antes de borrar
            historySection.style.opacity = '0';
            setTimeout(() => {
                saveHistory([]);
                renderHistory();
            }, 500); // Coincide con la duración de la transición en el CSS
        }
    });

    // --- INICIALIZACIÓN ---
    const initializePage = async () => {
        // Inicializa el sistema de estadísticas para esta página
        initializeStats('hasVisitedGenerator', {
            generated: passwordsGeneratedStat,
            users: usersServedStat
        });

        // Muestra el historial si no está vacío al cargar la página
        if (getHistory().length > 0) {
            historySection.style.display = 'block';
            // Forzar un reflow para que la animación de opacidad funcione
            void historySection.offsetWidth; 
            historySection.style.opacity = '1';
        }

        renderHistory();
        calculateStrength();
    };

    initializePage();
});