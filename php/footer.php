<?php
// Variable para saber qué página está activa. Se debe definir ANTES de incluir este archivo.
// Ejemplo: $activePage = 'generador';
if (!isset($activePage)) {
    $activePage = ''; // Valor por defecto para evitar errores
}
?>
<!-- Overlay para el menú móvil -->
<div id="menu-overlay" class="fixed inset-0 bg-black/20 z-20 hidden"></div>

<header id="main-header" class="border-b border-transparent sticky top-0 z-20 transition-all duration-300">
    <nav class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex-shrink-0">
                <a href="herramientas.php" class="flex items-center space-x-2">
                    <img src="assets/logo.png" alt="Password Generation Logo" class="h-8 w-auto">
                    <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">Password Generation</span>
                </a>
            </div>

            <!-- Navegación de Escritorio -->
            <div class="hidden sm:flex sm:items-center sm:space-x-8 desktop-nav">
                <a href="herramientas.php" title="Herramientas" class="<?php echo ($activePage === 'herramientas') ? 'active' : ''; ?>">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                </a>
                <a href="index.php" class="<?php echo ($activePage === 'generador') ? 'active' : ''; ?>">Generador</a>
                <a href="analizador.php" class="<?php echo ($activePage === 'analizador') ? 'active' : ''; ?>">Analizador</a>
            </div>

            <!-- Botón de Menú Móvil -->
            <div class="sm:hidden" id="menu-container">
                <button id="menu-button" class="menu-button flex items-center justify-center text-gray-600 hover:text-gray-900 p-2 rounded-md transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path class="hamburger-line top" d="M4 6h16"></path>
                        <path class="hamburger-line middle" d="M4 12h16"></path>
                        <path class="hamburger-line bottom" d="M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- Panel de Menú Móvil -->
    <div class="menu-dropdown" id="mobile-menu">
        <a href="herramientas.php" style="--stagger-index: 1;" class="<?php echo ($activePage === 'herramientas') ? 'font-semibold' : ''; ?>">Inicio</a>
        <a href="index.php" style="--stagger-index: 2;" class="<?php echo ($activePage === 'generador') ? 'font-semibold' : ''; ?>">Generador</a>
        <a href="analizador.php" style="--stagger-index: 3;" class="<?php echo ($activePage === 'analizador') ? 'font-semibold' : ''; ?>">Analizador</a>
    </div>
</header>