<?php
include '../includes/auth.php';
check_login();
include '../includes/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $document_type = $_POST['document_type'];

    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["document"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    $check = getimagesize($_FILES["document"]["tmp_name"]);
    if($check !== false) {
        $uploadOk = 1;
    } else {
        $error = "File is not an image.";
        $uploadOk = 0;
    }

    // Check file size
    if ($_FILES["document"]["size"] > 500000) {
        $error = "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" ) {
        $error = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $uploadOk = 0;
    }

    if ($uploadOk == 1) {
        if (move_uploaded_file($_FILES["document"]["tmp_name"], $target_file)) {
            $sql = "INSERT INTO kyc_submissions (user_id, document_type, document_path) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("iss", $user_id, $document_type, $target_file);
            $stmt->execute();
            $success = "The file ". htmlspecialchars( basename( $_FILES["document"]["name"])). " has been uploaded.";
        } else {
            $error = "Sorry, there was an error uploading your file.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>KYC</title>
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
</head>
<body>
    <ul>
        <li><a href="dashboard.php">Dashboard</a></li>
        <li><a href="deposit.php">Deposit</a></li>
        <li><a href="withdraw.php">Withdraw</a></li>
        <li><a href="transactions.php">Transactions</a></li>
        <li><a href="kyc.php" class="active">KYC</a></li>
        <li><a href="../logout.php">Logout</a></li>
    </ul>
    <div class="container">
        <h2>KYC Submission</h2>
    <?php if (isset($success)) { echo "<p>$success</p>"; } ?>
    <?php if (isset($error)) { echo "<p>$error</p>"; } ?>
    <form method="post" action="" enctype="multipart/form-data">
        <label>Document Type:</label><br>
        <input type="text" name="document_type" required><br><br>
        <label>Select document to upload:</label><br>
        <input type="file" name="document" id="document" required><br><br>
        <input type="submit" value="Upload Document" name="submit">
    </form>
</body>
</html>
