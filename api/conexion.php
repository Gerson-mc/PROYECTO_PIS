<?php
$servername = "sql202.infinityfree.com";
$username   = "if0_42530801";
$password   = "ghh0aXqiyUIIay"; // La clave que copias al hacer clic en el ojito de MYSQL PASSWORD
$dbname     = "if0_42530801_db_ayudaya"; // <--- ESTE ES EL NOMBRE EXACTO DE TU CAPTURA

try {
  $conn = new PDO;("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
  header('Content-Type: application/json');
  echo json_encode(["error" => "Conexión Fallida: " . $e->getMessage()]);
  exit();
}
?>