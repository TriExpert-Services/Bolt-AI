<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

include_once __DIR__ . '/../config.php';

function check_login() {
    if (!isset($_COOKIE['jwt'])) {
        header("Location: login.php");
        exit();
    }

    try {
        $decoded = JWT::decode($_COOKIE['jwt'], new Key(JWT_SECRET, 'HS256'));
        return $decoded->data;
    } catch (Exception $e) {
        header("Location: login.php");
        exit();
    }
}

function is_admin() {
    $data = check_login();
    return $data->role === 'admin';
}
?>
