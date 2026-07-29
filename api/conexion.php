<?php
$servername = "localhost";
$username = "root";
$password = ""; // Contraseña vacía por defecto en XAMPP
$dbname = "pweb_3c"; // Nombre de tu base de datos

try {
    // Intentamos crear la conexión usando PDO
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    
    // Configuramos el modo de error de PDO para que lance excepciones si algo falla
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e) {
    // Si la conexión falla, detenemos el script y mostramos el error en formato JSON
    header('Content-Type: application/json');
    echo json_encode(["error" => "Conexión Fallida: " . $e->getMessage()]);
    exit();
}
?>