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
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
</head>
<body>
    <ul>
        <li><a href="dashboard.php" class="active">Dashboard</a></li>
        <li><a href="users.php">Manage Users</a></li>
        <li><a href="kyc-review.php">KYC Review</a></li>
        <li><a href="settings.php">Settings</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
    <div class="container">
        <h2>Admin Dashboard</h2>
        <p>Welcome, Admin!</p>
    </div>
</body>
</html>
