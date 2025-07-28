<?php
$host = "localhost";
$db   = "promint";
$user = "root";
$pass = "";

$conn = new mysqli($host, $db, $user, $pass);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
