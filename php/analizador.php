<?php
$activePage = 'generador';
$pageScript = 'script.js';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../assets/logo.png">
    <title>Generador de Contraseñas - Password Generation</title>
    <?php include __DIR__ . '/../templates/common_head.php'; ?>
</head>
<body class="flex flex-col min-h-screen">

    <?php include __DIR__ . '/../templates/header.php'; ?>

    <main class="flex-grow flex items-center justify-center p-4 sm:p-6 flex-col">
        <div class="card w-full max-w-lg p-6 sm:p-8 space-y-6 sm:space-y-8 card-enter">
            <h1 class="text-2xl sm:text-3xl font-semibold text-center text-1d1d1f">
                Generador de Contraseñas
            </h1>

            <div class="space-y-4">
                <!-- Longitud de la Contraseña -->
            <div class="input-group">
                <label for="length" class="flex justify-between text-sm text-gray-500 mb-2 cursor-pointer">
                    <span class="text-gray-500">Longitud</span>
                    <span id="length-display" class="font-semibold text-1d1d1f">12</span>
                </label>
                <input type="range" id="length" min="8" max="32" value="12" class="w-full range-slider">
            </div>
    
                <!-- Opciones de Caracteres -->
            <div class="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 text-gray-600">
                <div class="flex items-center">
                    <input type="checkbox" id="lowercase" checked class="h-5 w-5 rounded custom-checkbox bg-gray-200 border-gray-300 focus:ring-offset-0 focus:ring-2 focus:ring-gray-400">
                    <label for="lowercase" class="ml-2 text-sm">Minúsculas (a-z)</label>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="uppercase" checked class="h-5 w-5 rounded custom-checkbox bg-gray-200 border-gray-300 focus:ring-offset-0 focus:ring-2 focus:ring-gray-400">
                    <label for="uppercase" class="ml-2 text-sm">Mayúsculas (A-Z)</label>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="numbers" checked class="h-5 w-5 rounded custom-checkbox bg-gray-200 border-gray-300 focus:ring-offset-0 focus:ring-2 focus:ring-gray-400">
                    <label for="numbers" class="ml-2 text-sm">Números (0-9)</label>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="symbols" checked class="h-5 w-5 rounded custom-checkbox bg-gray-200 border-gray-300 focus:ring-offset-0 focus:ring-2 focus:ring-gray-400">
                    <label for="symbols" class="ml-2 text-sm">Símbolos (!@#$)</label>
                </div>
            </div>
    
                <!-- Opción para excluir caracteres ambiguos -->
            <div class="flex items-center pt-2">
                <input type="checkbox" id="exclude-ambiguous" class="h-5 w-5 rounded custom-checkbox bg-gray-200 border-gray-300 focus:ring-offset-0 focus:ring-2 focus:ring-gray-400">
                <label for="exclude-ambiguous" class="ml-2 text-sm text-gray-600">Excluir ambiguos (I, l, 1, O, 0)</label>
            </div>
    
                <!-- Salida de Contraseña -->
            <div class="pt-4 relative">
                <input type="text" id="password-output" placeholder="Presiona 'Generar'"
                       class="input-field w-full p-3 rounded-lg bg-gray-100 text-base sm:text-lg font-mono text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                <button id="copy-btn" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 transition-colors" aria-label="Copiar contraseña" style="top: calc(50% + 8px);">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <title>Copiar</title>
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                </button>
            </div>
    
                <!-- Barra de fuerza -->
            <div class="mt-4">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Fuerza</span>
                    <span id="strength-display" aria-live="polite" class="font-medium text-gray-800">Débil</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full overflow-hidden">
                    <div id="strength-bar" class="strength-bar" style="width: 0%;"></div>
                </div>
            </div>
                
                <!-- Tiempo estimado de crackeo -->
            <div id="time-to-crack-section" class="text-center pt-4 space-y-2">
                <div>
                    <p class="text-sm text-gray-600">Tiempo estimado para crackear:</p>
                    <p id="time-to-crack-display" class="break-words text-base sm:text-lg font-semibold text-gray-800 mt-1">Calculando...</p>
                    <p class="text-xs text-gray-400">(Asumiendo 10 mil millones de intentos/seg)</p>
                </div>
                <div class="text-xs text-gray-500 pt-2">
                    <strong class="text-gray-700">Seguridad Exponencial (O(c<sup>n</sup>)):</strong>
                    Cada carácter (<strong class="font-mono">n</strong>) multiplica la dificultad por el tamaño del alfabeto (<strong class="font-mono">c</strong>).
                </div>
            </div>
            <div id="copy-message" class="copy-message text-center text-sm text-gray-500 pt-2">
                ¡Contraseña copiada al portapapeles!
            </div>
            </div>
    
            <button id="generate-btn"
                    class="w-full py-3 rounded-lg main-btn text-base">
                Generar Contraseña
            </button>
    
            <div class="text-center mt-2">
                <a href="guia.html" class="text-sm text-gray-500 hover:text-gray-800 transition-colors hover:underline">
                    ¿Cómo funciona? Guía y explicación
                </a>
            </div>
        </div>
        
        <!-- Sección de Historial -->
        <div id="history-section" class="card w-full max-w-lg p-6 mt-6 space-y-4" style="display: none; opacity: 0; transition: opacity 0.5s ease;">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">Historial</h2>
                <button id="clear-history-btn" class="text-sm text-gray-500 hover:text-gray-800 transition-colors hover:underline">
                    Limpiar Historial
                </button>
            </div>
            <p class="text-xs text-gray-500 italic -mt-2">
                Tu privacidad es nuestra prioridad. El historial se guarda únicamente en tu navegador y nunca se envía a nuestros servidores.
            </p>
            <ul id="history-list" class="space-y-2 max-h-48 overflow-y-auto pr-2">
                <!-- El historial se llenará con JavaScript -->
                <li class="text-center text-gray-500 text-sm">No hay contraseñas en el historial.</li>
            </ul>
        </div>
        
     <!-- Sección de Estadísticas -->
        <div class="card w-full max-w-lg p-6 mt-6">
            <div class="text-center grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                    <p id="passwords-generated-stat" class="stat-number text-4xl sm:text-5xl font-bold text-gray-800"></p>
                    <p class="text-sm text-gray-500 mt-1">Contraseñas generadas</p>
                </div>
                <div>
                    <p id="users-served-stat" class="stat-number text-4xl sm:text-5xl font-bold text-gray-800"></p>
                    <p class="text-sm text-gray-500 mt-1">Usuarios protegidos</p>
                </div>
            </div>
        </div>
    </main>

<?php include __DIR__ . '/../templates/footer.php'; ?>
