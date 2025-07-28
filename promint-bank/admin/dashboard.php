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
    <title>Admin Dashboard</title>
</head>
<body>
    <h2>Admin Dashboard</h2>
    <p>Welcome, Admin!</p>
    <ul>
        <li><a href="users.php">Manage Users</a></li>
        <li><a href="kyc-review.php">KYC Review</a></li>
        <li><a href="settings.php">Settings</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
</body>
</html>
