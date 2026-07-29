<?php
header('Content-Type: application/json; charset=utf-8');
include 'conexion.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($method) {

        // 1. OBTENER LISTA DE MASCOTAS (GET)
        case 'GET':
            $sql = "SELECT m.*, CONCAT(u.nombres, ' ', u.apellidos) AS reportado_por 
                    FROM mascota m 
                    LEFT JOIN usuario u ON m.id_usuario = u.id_usuario 
                    ORDER BY m.id_mascota DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
            break;

        // 2. REGISTRAR NUEVA MASCOTA (POST)
        case 'POST':
            $nombre     = $input['nombre'] ?? '';
            $especie    = $input['especie'] ?? 'Perro';
            $raza       = $input['raza'] ?? 'Desconocida';
            $color      = $input['color'] ?? '';
            $estado     = $input['estado'] ?? 'PERDIDO';
            $lugar      = $input['lugar'] ?? '';
            $id_usuario = $input['id_usuario'] ?? null;

            if (empty($nombre) || empty($color) || empty($lugar)) {
                echo json_encode(["success" => false, "error" => "Campos obligatorios incompletos"]);
                exit;
            }

            $sql = "INSERT INTO mascota (nombre, especie, raza, color, estado, lugar, id_usuario) 
                    VALUES (:nombre, :especie, :raza, :color, :estado, :lugar, :id_usuario)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':nombre'     => $nombre,
                ':especie'    => $especie,
                ':raza'       => $raza,
                ':color'      => $color,
                ':estado'     => $estado,
                ':lugar'      => $lugar,
                ':id_usuario' => $id_usuario
            ]);

            echo json_encode(["success" => true, "message" => "Mascota registrada correctamente"]);
            break;

        // 3. CAMBIAR ESTADO A REUNIFICADO (PUT)
        case 'PUT':
            $id_mascota = $input['id_mascota'] ?? '';
            $nuevo_estado = $input['estado'] ?? 'REUNIFICADO';

            if (empty($id_mascota)) {
                echo json_encode(["success" => false, "error" => "ID de mascota requerido"]);
                exit;
            }

            $sql = "UPDATE mascota SET estado = :estado WHERE id_mascota = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':estado' => $nuevo_estado, ':id' => $id_mascota]);

            echo json_encode(["success" => true, "message" => "Estado de la mascota actualizado"]);
            break;

        // 4. ELIMINAR MASCOTA (DELETE)
        case 'DELETE':
            $id_mascota = $_GET['id_mascota'] ?? $input['id_mascota'] ?? '';

            if (empty($id_mascota)) {
                echo json_encode(["success" => false, "error" => "ID de mascota requerido"]);
                exit;
            }

            $sql = "DELETE FROM mascota WHERE id_mascota = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([':id' => $id_mascota]);

            echo json_encode(["success" => true, "message" => "Registro eliminado exitosamente"]);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Método no permitido"]);
            break;
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Error BD: " . $e->getMessage()]);
}

$conn = null;
?>