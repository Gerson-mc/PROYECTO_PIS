<?php
// Indicamos que la respuesta siempre será en formato JSON
header('Content-Type: application/json; charset=utf-8');

// Incluimos la conexión a la base de datos
include 'conexion.php';

// Detectamos el método de la petición (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

// Leemos el cuerpo de la petición si viene en formato JSON desde JS
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($method) {

        // 1. OBTENER LISTA DE USUARIOS (GET)
        case 'GET':
            // Seleccionamos los campos necesarios de la tabla usuario
            $sql = "SELECT id_usuario, nombres, apellidos, cedula, login, estado FROM usuario ORDER BY id_usuario DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Devolvemos el array de usuarios codificado en JSON
            echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
            break;

        // 2. CREAR UN NUEVO USUARIO (POST)
        case 'POST':
            $nombres   = $input['nombres'] ?? '';
            $apellidos = $input['apellidos'] ?? '';
            $cedula    = $input['cedula'] ?? '';
            $login     = $input['login'] ?? '';
            $clave     = $input['clave'] ?? '';
            $estado    = $input['estado'] ?? 'ACTIVO';

            if (empty($nombres) || empty($apellidos) || empty($cedula) || empty($login) || empty($clave)) {
                echo json_encode(["success" => false, "error" => "Todos los campos son obligatorios"]);
                exit;
            }

            $sql = "INSERT INTO usuario (nombres, apellidos, cedula, login, clave, estado) 
                    VALUES (:nombres, :apellidos, :cedula, :login, :clave, :estado)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':nombres'   => $nombres,
                ':apellidos' => $apellidos,
                ':cedula'    => $cedula,
                ':login'     => $login,
                ':clave'     => $clave,
                ':estado'    => $estado
            ]);

            echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
            break;

        // 3. CAMBIAR ESTADO A INACTIVO / BORRADO LÓGICO (PUT)
        case 'PUT':
            $id_usuario = $input['id_usuario'] ?? '';

            if (empty($id_usuario)) {
                echo json_encode(["success" => false, "error" => "El ID del usuario es obligatorio"]);
                exit;
            }

            $sql = "UPDATE usuario SET estado = 'INACTIVO' WHERE id_usuario = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':id' => $id_usuario]);

            echo json_encode(["success" => true, "message" => "Usuario inactivado correctamente"]);
            break;

        // 4. ELIMINACIÓN FÍSICA (DELETE)
        case 'DELETE':
            $id_usuario = $_GET['id_usuario'] ?? $input['id_usuario'] ?? '';

            if (empty($id_usuario)) {
                echo json_encode(["success" => false, "error" => "El ID del usuario es obligatorio"]);
                exit;
            }

            $sql = "DELETE FROM usuario WHERE id_usuario = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':id' => $id_usuario]);

            echo json_encode(["success" => true, "message" => "Usuario eliminado definitivamente"]);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Método no permitido"]);
            break;
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Error en la base de datos: " . $e->getMessage()]);
}

$conn = null;
?>