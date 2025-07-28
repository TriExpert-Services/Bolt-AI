<?php
include '../includes/auth.php';
check_login();
if (!is_admin()) {
    header("Location: ../client/dashboard.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Settings</title>
</head>
<body>
    <h2>Admin Settings</h2>
    <p>Settings page for the admin.</p>
</body>
</html>
