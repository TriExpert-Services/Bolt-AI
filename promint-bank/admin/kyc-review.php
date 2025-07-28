<?php
include '../includes/auth.php';
check_login();
if (!is_admin()) {
    header("Location: ../client/dashboard.php");
    exit();
}
include '../includes/db.php';

// Handle KYC approval/rejection
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $kyc_id = $_POST['kyc_id'];
    $status = $_POST['status'];

    $sql = "UPDATE kyc_submissions SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $kyc_id);
    $stmt->execute();
}

$sql = "SELECT k.id, u.username, k.document_type, k.document_path, k.status FROM kyc_submissions k JOIN users u ON k.user_id = u.id WHERE k.status = 'pending'";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>KYC Review</title>
</head>
<body>
    <h2>KYC Review</h2>
    <table border="1">
        <tr>
            <th>Username</th>
            <th>Document Type</th>
            <th>Document</th>
            <th>Action</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["username"]. "</td>";
                echo "<td>" . $row["document_type"]. "</td>";
                echo "<td><a href='../" . $row["document_path"] . "' target='_blank'>View Document</a></td>";
                echo "<td>
                        <form method='post' action=''>
                            <input type='hidden' name='kyc_id' value='" . $row["id"] . "'>
                            <select name='status'>
                                <option value='approved'>Approve</option>
                                <option value='rejected'>Reject</option>
                            </select>
                            <input type='submit' value='Submit'>
                        </form>
                      </td>";
                echo "</tr>";
            }
        } else {
            echo "No pending KYC submissions.";
        }
        ?>
    </table>
</body>
</html>
