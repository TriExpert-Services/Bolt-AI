<?php
include 'includes/auth.php';

if (isset($_SESSION['user_id'])) {
    if (is_admin()) {
        header("Location: admin/dashboard.php");
    } else {
        header("Location: client/dashboard.php");
    }
    exit();
} else {
    header("Location: login.php");
    exit();
}
?>
