<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
// ... el resto de tu código ...
// NOTA DE SEGURIDAD: En entornos de producción reales, considera
// leer estas credenciales desde variables de entorno (.env)
// o un almacén de secretos (Secret Vault) en lugar de hardcodearlas.
$db_host = 'localhost';
$db_name = 'TU_DB_NAME'; // Nombre de DB de la imagen
$db_user = 'TU_DB_USER'; // Usuario de DB de la imagen
$db_pass = 'TU_DB_PASS'; // Reemplazar con la contraseña FUERTE REAL

// --- CONFIGURACIÓN DE RESPUESTA Y SEGURIDAD ---
// Previene errores de CORS. En un entorno de producción, es mejor
// limitar esto a tu dominio específico (e.g., tu_dominio.com)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha pasada para evitar cache
// Cabeceras de seguridad adicionales
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Content-Security-Policy: frame-ancestors 'none'"); // Alternativa más moderna a X-Frame-Options

// --- LÓGICA DE CONEXIÓN ---
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    // Configuración para que PDO lance excepciones en caso de error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Configuración para que los resultados sean asociados por nombre
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Registro de error para el administrador (no para el usuario)
    error_log("Database connection error: " . $e->getMessage());
    http_response_code(503); // Servicio no disponible
    echo json_encode(['error' => 'Error de conexión. Inténtalo más tarde.']);
    exit;
}

// --- LÓGICA DEL SCRIPT ---
// Usamos REQUEST para ser más flexibles (GET o POST) aunque GET es común para APIs simples
$action = $_REQUEST['action'] ?? null;

// Definimos la ID de la fila a actualizar, ya que siempre es '1'
$stats_id = 1;

switch ($action) {
    case 'get_stats':
        // Uso de prepared statements (aunque no son necesarios aquí, son una buena práctica)
        $stmt = $pdo->prepare("SELECT passwords_generated, users_served, passwords_scanned FROM stats WHERE id = :id");
        $stmt->bindParam(':id', $stats_id, PDO::PARAM_INT);
        $stmt->execute();
        $stats = $stmt->fetch();
        
        if ($stats) {
            echo json_encode($stats);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Estadísticas no encontradas.']);
        }
        break;

    case 'increment_password':
    case 'increment_user':
    case 'increment_scan':
        // Bloque unificado para incremento. Más DRY (Don't Repeat Yourself)
        $columnMap = [
            'increment_password' => 'passwords_generated',
            'increment_user'     => 'users_served',
            'increment_scan'     => 'passwords_scanned',
        ];
        $column = $columnMap[$action] ?? null;

        if (!$column) {
            http_response_code(400);
            echo json_encode(['error' => 'Acción de incremento no válida.']);
            exit;
        }
        
        $stmt = $pdo->prepare("UPDATE stats SET `$column` = `$column` + 1 WHERE id = :id");
        $stmt->bindParam(':id', $stats_id, PDO::PARAM_INT);
        
        // Transacción para asegurar la atomicidad de la operación (opcional pero recomendado)
        $pdo->beginTransaction();
        try {
            $stmt->execute();
            $pdo->commit();
            echo json_encode(['success' => true, 'action' => $action]);
        } catch (PDOException $e) {
            $pdo->rollBack();
            error_log("Update error for $column: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Fallo al actualizar el contador.']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Acción no válida o faltante.']);
        break;
}
?>