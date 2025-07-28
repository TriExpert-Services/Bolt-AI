<?php
include '../includes/auth.php';
check_login();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Client Dashboard</title>
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
</head>
<body>
    <ul>
        <li><a href="dashboard.php" class="active">Dashboard</a></li>
        <li><a href="deposit.php">Deposit</a></li>
        <li><a href="withdraw.php">Withdraw</a></li>
        <li><a href="transactions.php">Transactions</a></li>
        <li><a href="kyc.php">KYC</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
    <div class="container">
        <h2>Client Dashboard</h2>
        <p>Welcome, Client!</p>
    </div>
</body>
</html>
