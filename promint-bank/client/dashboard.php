<?php
include '../includes/auth.php';
check_login();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Client Dashboard</title>
</head>
<body>
    <h2>Client Dashboard</h2>
    <p>Welcome, Client!</p>
    <ul>
        <li><a href="deposit.php">Deposit</a></li>
        <li><a href="withdraw.php">Withdraw</a></li>
        <li><a href="transactions.php">Transactions</a></li>
        <li><a href="kyc.php">KYC</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
</body>
</html>
