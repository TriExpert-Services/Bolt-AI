<?php
include 'includes/auth.php';
check_login();

if (is_admin()) {
    header("Location: admin/dashboard.php");
} else {
    header("Location: client/dashboard.php");
}
exit();
?>
