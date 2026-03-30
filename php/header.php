<?php
$activePage = 'herramientas';
$pageScripts = ['scrolling-animations.js']; // Array para múltiples scripts
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="assets/logo.png">
    <title>Herramientas de Seguridad - Password Generation</title>
    <?php include 'templates/common_head.php'; ?>
</head>
<body class="antialiased">

    <div class="parallax-bg-container">
        <div class="parallax-blob blob1" data-speed="0.4"></div>
        <div class="parallax-blob blob2" data-speed="0.6"></div>
        <div class="parallax-blob blob3" data-speed="0.3"></div>
    </div>

    <?php include 'templates/header.php'; ?>

    <main>
        <!-- Sección Generador -->
        <section class="section-full text-center">
            <div class="section-content">
                <h2 class="text-2xl md:text-3xl font-semibold text-gray-500" style="--stagger-index: 1;">Generador de Contraseñas</h2>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-1d1d1f mt-4 leading-tight" style="--stagger-index: 2;">
                    Seguridad impecable.<br>Al instante.
                </h1>
                <p class="mt-8 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600" style="--stagger-index: 3;">
                    Crea contraseñas robustas y únicas basadas en principios criptográficos. Control total sobre la longitud y los caracteres para una protección a tu medida.
                </p>
                <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style="--stagger-index: 4;">
                    <a href="index.php" class="py-2 px-6 main-btn">Usar la herramienta</a>
                    <a href="guia.php" class="secondary-btn">Ver la guía →</a>
                </div>
            </div>
        </section>

        <!-- Sección Analizador -->
        <section class="section-full text-center">
            <div class="section-content">
                <h2 class="text-2xl md:text-3xl font-semibold text-gray-500" style="--stagger-index: 1;">Analizador de Fortaleza</h2>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-1d1d1f mt-4 leading-tight" style="--stagger-index: 2;">
                    Conocimiento es poder.<br>Descifra tu seguridad.
                </h1>
                <p class="mt-8 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600" style="--stagger-index: 3;">
                    Evalúa la fortaleza de cualquier contraseña al instante. Mide su entropía y estima cuánto tiempo tomaría descifrarla, todo de forma segura en tu navegador.
                </p>
                <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style="--stagger-index: 4;">
                    <a href="analizador.php" class="py-2 px-6 main-btn">Usar la herramienta</a>
                    <a href="guia-analizador.php" class="secondary-btn">Ver la guía →</a>
                </div>
            </div>
        </section>
    </main>

<?php include 'templates/footer.php'; ?>
</body>
</html>