<?php
include '../includes/auth.php';
check_login();
include '../includes/db.php';

$user_id = $_SESSION['user_id'];

$sql = "SELECT id, amount, type, created_at FROM transactions WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Transactions</title>
</head>
<body>
    <h2>Transactions</h2>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr><td>" . $row["id"]. "</td><td>" . $row["amount"]. "</td><td>" . $row["type"]. "</td><td>" . $row["created_at"]. "</td></tr>";
            }
        } else {
            echo "0 results";
        }
        ?>
    </table>
</body>
</html>
