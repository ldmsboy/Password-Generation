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
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    const options = {
        lowercase: document.getElementById('lowercase'),
        uppercase: document.getElementById('uppercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols'),
    };

    const charsets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:",.<>?',
    };

    // --- CONSTANTES DE CONFIGURACIÓN ---
    const HISTORY_KEY = 'passwordGeneratorHistory';
    const MAX_HISTORY_ITEMS = 10;

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
    function generatePassword(saveToHistory = false) {
        let allChars = '';
        let password = '';
        const length = parseInt(lengthInput.value, 10);

        // Construir el conjunto de caracteres y garantizar al menos uno de cada tipo seleccionado
        for (const [key, checkbox] of Object.entries(options)) {
            if (checkbox.checked) {
                allChars += charsets[key];
                password += charsets[key][getRandomInt(charsets[key].length)];
            }
        }

        // Rellenar el resto de la contraseña
        for (let i = password.length; i < length; i++) {
            password += allChars[getRandomInt(allChars.length)];
        }

        // Barajar la contraseña para que los caracteres garantizados no estén siempre al principio
        passwordOutput.value = shuffleString(password);
        calculateStrength();
        if (saveToHistory) {
            addToHistory(passwordOutput.value);
        }
    }

    /**
     * Calcula y muestra la fuerza de la contraseña (entropía en bits).
     */
    function calculateStrength() {
        const password = passwordOutput.value;
        if (!password) {
            strengthDisplay.textContent = "Muy Débil";
            strengthBar.style.width = "0%";
            strengthBar.className = 'strength-bar'; // Resetea colores
            return;
        }

        let alphabetSize = 0;
        if (/[a-z]/.test(password)) alphabetSize += charsets.lowercase.length;
        if (/[A-Z]/.test(password)) alphabetSize += charsets.uppercase.length;
        if (/[0-9]/.test(password)) alphabetSize += charsets.numbers.length;
        if (/[!@#$%^&*()_+-=[\]{}|;:",.<>?]/.test(password)) alphabetSize += charsets.symbols.length;

        const entropy = alphabetSize > 1 ? password.length * Math.log2(alphabetSize) : 0;

        let strengthText = "Muy Débil";
        let barColorClass = "bg-red-600";
        let barWidth = "10%";
        const colorClasses = ['bg-red-600', 'bg-orange-500', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'];

        if (entropy > 128) {
            strengthText = "Excelente";
            barColorClass = "bg-green-500";
            barWidth = "100%";
        } else if (entropy > 80) {
            strengthText = "Fuerte";
            barColorClass = "bg-green-400";
            barWidth = "75%";
        } else if (entropy > 60) {
            strengthText = "Medio";
            barColorClass = "bg-yellow-400";
            barWidth = "50%";
        } else if (entropy > 40) {
            strengthText = "Débil";
            barColorClass = "bg-orange-500";
            barWidth = "25%";
        }

        strengthDisplay.textContent = `${strengthText} (${Math.round(entropy)} bits)`;
        strengthBar.style.width = barWidth;
        strengthBar.classList.remove(...colorClasses);
        strengthBar.classList.add(barColorClass);
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
        historyList.innerHTML = ''; // Limpia la lista actual

        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }

        historySection.style.display = 'block';
        setTimeout(() => historySection.style.opacity = '1', 10); // Pequeño delay para la transición
        history.forEach(password => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between bg-gray-700/50 p-2 rounded-md text-sm';
            li.innerHTML = `
                <span class="font-mono text-gray-300 truncate pr-4">${password}</span>
                <button class="copy-history-btn p-1 rounded hover:bg-gray-600" aria-label="Copiar esta contraseña">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><title>Copiar</title><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" /></svg>
                </button>
            `;
            li.querySelector('.copy-history-btn').addEventListener('click', () => navigator.clipboard.writeText(password));
            historyList.appendChild(li);
        });
    }

    // --- EVENT LISTENERS ---

    // Actualiza la longitud y genera una nueva contraseña
    lengthInput.addEventListener('input', () => {
        lengthDisplay.textContent = lengthInput.value;
        generatePassword(false);
    });

    // Genera una nueva contraseña cuando cambian las opciones
    Object.values(options).forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Asegura que al menos una casilla esté marcada
            const checkedCount = Object.values(options).filter(c => c.checked).length;
            if (checkedCount === 0) {
                checkbox.checked = true;
            }
            generatePassword(false);
        });
    });

    // Calcula la fuerza al escribir o pegar en el campo de contraseña
    passwordOutput.addEventListener('input', calculateStrength);

    // Asigna los eventos a los botones
    generateBtn.addEventListener('click', () => generatePassword(true));
    copyBtn.addEventListener('click', copyToClipboard);

    // Limpia el historial
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
            saveHistory([]);
            renderHistory();
        }
    });

    // --- INICIALIZACIÓN ---
    renderHistory(); // Muestra el historial al cargar la página
    generatePassword(false); // Genera la primera contraseña sin guardarla
});