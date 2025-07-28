<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../config.php';

class AuthController {
    public function login() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            global $conn;
            $username = sanitize_input($_POST['username']);
            $password = sanitize_input($_POST['password']);

            $sql = "SELECT id, password, role FROM users WHERE username = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();
                if (password_verify($password, $row['password'])) {
                    $payload = [
                        'iss' => "http://promint.com",
                        'aud' => "http://promint.com",
                        'iat' => time(),
                        'exp' => time() + 3600,
                        'data' => [
                            'id' => $row['id'],
                            'role' => $row['role']
                        ]
                    ];

                    $jwt = JWT::encode($payload, JWT_SECRET, 'HS256');
                    setcookie("jwt", $jwt, time() + 3600, "/");
                    header("Location: index.php");
                    exit();
                } else {
                    $error = "Invalid password.";
                    require_once __DIR__ . '/../views/login.php';
                }
            } else {
                $error = "No user found with that username.";
                require_once __DIR__ . '/../views/login.php';
            }
        } else {
            require_once __DIR__ . '/../views/login.php';
        }
    }

    public function register() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            global $conn;
            // Create uploads directory if it doesn't exist
            if (!file_exists('uploads')) {
                mkdir('uploads', 0777, true);
            }

            $username = sanitize_input($_POST['username']);
            $email = sanitize_input($_POST['email']);
            $password = sanitize_input($_POST['password']);
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $role = 'client'; // Default role

            $sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $username, $email, $hashed_password, $role);

            if ($stmt->execute()) {
                header("Location: login.php");
                exit();
            } else {
                $error = "Error: " . $sql . "<br>" . $conn->error;
                require_once __DIR__ . '/../views/register.php';
            }
        } else {
            require_once __DIR__ . '/../views/register.php';
        }
    }

    public function logout() {
        setcookie("jwt", "", time() - 3600, "/");
        header("Location: login.php");
        exit();
    }
}
?>
