<?php
include '../includes/auth.php';
check_login();
if (!is_admin()) {
    header("Location: ../client/dashboard.php");
    exit();
}
include '../includes/db.php';

$sql = "SELECT id, username, email, role FROM users";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Manage Users</title>
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
</head>
<body>
    <ul>
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><a href="users.php" class="active">Manage Users</a></li>
        <li><a href="kyc-review.php">KYC Review</a></li>
        <li><a href="settings.php">Settings</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
    <div class="container">
        <h2>Manage Users</h2>
        <table>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr><td>" . $row["id"]. "</td><td>" . $row["username"]. "</td><td>" . $row["email"]. "</td><td>" . $row["role"]. "</td></tr>";
            }
        } else {
            echo "0 results";
        }
        ?>
    </table>
</body>
</html>
