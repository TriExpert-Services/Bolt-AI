<?php
include '../includes/auth.php';
check_login();
include '../includes/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $amount = $_POST['amount'];
    $type = 'deposit';

    $sql = "INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ids", $user_id, $amount, $type);

    if ($stmt->execute()) {
        // Update user balance
        $sql_update = "UPDATE users SET balance = balance + ? WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("di", $amount, $user_id);
        $stmt_update->execute();

        $success = "Deposit successful!";
    } else {
        $error = "Error: " . $sql . "<br>" . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Deposit</title>
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
</head>
<body>
    <ul>
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><a href="deposit.php" class="active">Deposit</a></li>
        <li><a href="withdraw.php">Withdraw</a></li>
        <li><a href="transactions.php">Transactions</a></li>
        <li><a href="kyc.php">KYC</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
    <div class="container">
        <h2>Deposit</h2>
    <?php if (isset($success)) { echo "<p>$success</p>"; } ?>
    <?php if (isset($error)) { echo "<p>$error</p>"; } ?>
    <form method="post" action="">
        <label>Amount:</label><br>
        <input type="number" name="amount" step="0.01" required><br><br>
        <input type="submit" value="Deposit">
    </form>
</body>
</html>
