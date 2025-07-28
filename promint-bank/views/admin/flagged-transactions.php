<?php
include '../../includes/auth.php';
check_login();
if (!is_admin()) {
    header("Location: ../client/dashboard.php");
    exit();
}
include '../../models/FlaggedTransaction.php';

$flaggedTransaction = new FlaggedTransaction();
$result = $flaggedTransaction->getAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Flagged Transactions</title>
    <link rel="stylesheet" type="text/css" href="../../assets/css/style.css">
</head>
<body>
    <ul>
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><a href="users.php">Manage Users</a></li>
        <li><a href="kyc-review.php">KYC Review</a></li>
        <li><a href="flagged-transactions.php" class="active">Flagged Transactions</a></li>
        <li><a href="settings.php">Settings</a></li>
        <li><a href="../../logout.php">Logout</a></li>
    </ul>
    <div class="container">
        <h2>Flagged Transactions</h2>
        <table>
        <tr>
            <th>Transaction ID</th>
            <th>Username</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Date</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr><td>" . $row["transaction_id"]. "</td><td>" . $row["username"]. "</td><td>" . $row["amount"]. "</td><td>" . $row["type"]. "</td><td>" . $row["reason"]. "</td><td>" . $row["created_at"]. "</td></tr>";
            }
        } else {
            echo "0 results";
        }
        ?>
    </table>
    </div>
</body>
</html>
