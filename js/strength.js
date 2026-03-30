'use strict';

/**
 * Módulo para calcular la fuerza de una contraseña.
 */

const STRENGTH_MODULE = (() => {
    const CHARSETS = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:",.<>?',
        ambiguous: 'Il1O0',
    };

    const GUESSES_PER_SECOND = 10_000_000_000; // 10 mil millones

    /**
     * Calcula la fuerza de una contraseña.
     * @param {string} password - La contraseña a analizar.
     * @param {object} [options] - Opciones del generador (opcional). Si se provee, se usa para el cálculo.
     * @returns {object} Un objeto con los detalles de la fuerza de la contraseña.
     */
    function calculatePasswordStrength(password, options = null) {
        const length = password.length;
        if (length === 0) {
            return { entropy: 0, strengthText: 'N/A', barWidth: '0%', barColorClass: 'bg-transparent', timeToCrack: 0 };
        }

        let alphabetSize = 0;

        if (options) {
            // --- Lógica para el GENERADOR (basado en checkboxes) ---
            const exclude = options.excludeAmbiguous.checked;
            const ambiguousRegex = new RegExp(`[${CHARSETS.ambiguous}]`, 'g');
            if (options.lowercase.checked) alphabetSize += (exclude ? CHARSETS.lowercase.replace(ambiguousRegex, '') : CHARSETS.lowercase).length;
            if (options.uppercase.checked) alphabetSize += (exclude ? CHARSETS.uppercase.replace(ambiguousRegex, '') : CHARSETS.uppercase).length;
            if (options.numbers.checked) alphabetSize += (exclude ? CHARSETS.numbers.replace(ambiguousRegex, '') : CHARSETS.numbers).length;
            if (options.symbols.checked) alphabetSize += CHARSETS.symbols.length;
        } else {
            // --- Lógica para el ANALIZADOR (basado en contenido) ---
            if (/[a-z]/.test(password)) alphabetSize += CHARSETS.lowercase.length;
            if (/[A-Z]/.test(password)) alphabetSize += CHARSETS.uppercase.length;
            if (/[0-9]/.test(password)) alphabetSize += CHARSETS.numbers.length;
            const symbolRegex = new RegExp(`[${CHARSETS.symbols.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]`);
            if (symbolRegex.test(password)) alphabetSize += CHARSETS.symbols.length;
        }

        const entropy = alphabetSize > 1 ? length * Math.log2(alphabetSize) : 0;

        let strengthText = "Muy Débil";
        let barColorClass = "bg-red-600";
        let barWidth = "25%";

        if (entropy > 128) { strengthText = "Excelente"; barColorClass = "bg-green-500"; barWidth = "100%"; } 
        else if (entropy > 80) { strengthText = "Fuerte"; barColorClass = "bg-green-400"; barWidth = "75%"; } 
        else if (entropy > 60) { strengthText = "Medio"; barColorClass = "bg-yellow-400"; barWidth = "50%"; } 
        else if (entropy > 40) { strengthText = "Débil"; barColorClass = "bg-orange-500"; barWidth = "25%"; }

        const combinations = Math.pow(2, entropy);
        const timeInSeconds = combinations / (2 * GUESSES_PER_SECOND);

        return {
            entropy: Math.round(entropy),
            strengthText,
            barWidth,
            barColorClass,
            timeToCrack: timeInSeconds
        };
    }

    // Exponer la función principal
    return {
        calculate: calculatePasswordStrength
    };
})();