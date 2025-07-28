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
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
</head>
<body>
    <ul>
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><a href="users.php">Manage Users</a></li>
        <li><a href="kyc-review.php">KYC Review</a></li>
        <li><a href="settings.php" class="active">Settings</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
    <div class="container">
        <h2>Admin Settings</h2>
        <p>Settings page for the admin.</p>
    </div>
</body>
</html>
