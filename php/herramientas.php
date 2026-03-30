<?php
$activePage = 'analizador';
$pageScript = 'analizador.js';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="assets/logo.png">
    <title>Analizador de Contraseñas - Password Generation</title>
    <?php include 'templates/common_head.php'; ?>
</head>
<body class="flex flex-col min-h-screen">

    <?php include 'templates/header.php'; ?>

    <main class="flex-grow flex items-center justify-center p-4 sm:p-6 flex-col">
        <div class="card w-full max-w-lg p-6 sm:p-8 space-y-6 sm:space-y-8 card-enter">
            <h1 class="text-2xl sm:text-3xl font-semibold text-center text-1d1d1f">
                Analizador de Contraseñas
            </h1>

            <div class="space-y-6">
                <!-- Entrada de Contraseña -->
                <div class="relative">
                    <label for="password-input-analyzer" class="text-sm text-gray-500 mb-2 block">Escribe o pega una contraseña para analizar su fortaleza</label>
                    <input type="text" id="password-input-analyzer" placeholder="Tu contraseña aquí..." 
                           class="input-field w-full p-3 rounded-lg bg-gray-100 text-base sm:text-lg font-mono text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                </div>

                <!-- Barra de fuerza -->
                <div class="mt-4 result-item" id="strength-bar-container">
                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Fuerza</span>
                        <span id="strength-display" aria-live="polite" class="font-medium text-gray-800">N/A</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full overflow-hidden">
                        <div id="strength-bar" class="strength-bar" style="width: 0%;"></div>
                    </div>
                </div>
                
                <!-- Tiempo estimado de crackeo -->
                <div id="time-to-crack-section" class="text-center pt-4 space-y-2 result-item">
                    <div>
                        <p class="text-sm text-gray-600">Tiempo estimado para crackear:</p>
                        <p id="time-to-crack-display" class="break-words text-base sm:text-lg font-semibold text-gray-800 mt-1">Ingresa una contraseña para analizar.</p>
                        <p class="text-xs text-gray-400">(Asumiendo 10 mil millones de intentos/seg)</p>
                    </div>
                </div>

                <button id="analyze-btn"
                        class="w-full py-3 rounded-lg main-btn text-base hidden transition-all">
                    Analizar contraseña
                </button>
            </div>

            <div class="text-center mt-4 space-y-2">
                <div>
                    <a href="guia-analizador.php" class="text-sm text-gray-500 hover:text-gray-800 transition-colors hover:underline">¿Cómo funciona este análisis?</a>
                </div>
            </div>
        </div>

        <!-- Sección de Estadísticas -->
        <div class="card w-full max-w-lg p-6 mt-6">
            <div class="text-center grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                    <p id="passwords-scanned-stat" class="stat-number text-4xl sm:text-5xl font-bold text-gray-800"></p>
                    <p class="text-sm text-gray-500 mt-1">Contraseñas analizadas</p>
                </div>
                <div>
                    <p id="users-served-stat" class="stat-number text-4xl sm:text-5xl font-bold text-gray-800"></p>
                    <p class="text-sm text-gray-500 mt-1">Usuarios protegidos</p>
                </div>
            </div>
        </div>
    </main>

<?php include 'templates/footer.php'; ?>