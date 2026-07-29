<?php
// Indicamos al navegador que este archivo siempre devolverá JSON
header('Content-Type: application/json; charset=utf-8');

// Incluimos nuestro archivo de conexión
include 'conexion.php';

// Leemos los datos en formato JSON que nos envía JavaScript desde la petición fetch()
$input = json_decode(file_get_contents('php://input'), true);

// Extraemos el usuario y la clave (o asignamos vacío si no llegaron)
$usuario = $input['usuario'] ?? '';
$password = $input['password'] ?? '';

// Validamos que los campos no vengan vacíos
if (empty($usuario) || empty($password)) {
    echo json_encode(["error" => "Por favor completa todos los campos."]);
    exit;
}

try {
    // Consulta SQL con marcadores de posición (:usuario y :password) para prevenir Inyección SQL
    $sql = "SELECT id_usuario, nombres, apellidos, cedula, login 
            FROM usuario 
            WHERE login = :usuario AND clave = :password AND estado = 'ACTIVO'";

    // Preparamos la consulta en PDO
    $stmt = $conn->prepare($sql);

    // Ejecutamos la consulta pasando los valores reales de forma segura
    $stmt->execute([
        ':usuario'  => $usuario,
        ':password' => $password
    ]);

    // Obtenemos el registro encontrado como un array asociativo
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Si se encontró una coincidencia válida
    if ($result) {
        echo json_encode([
            "success" => true,
            "message" => "Login exitoso",
            "data" => $result
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Usuario o contraseña incorrectos."
        ]);
    }

} catch(PDOException $e) {
    echo json_encode(["error" => "Error en el servidor: " . $e->getMessage()]);
}

$conn = null;
?>