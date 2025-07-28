<?php
require_once __DIR__ . '/../models/User.php';

class UserController {
    public function index() {
        $user = new User();
        $users = $user->getAll();
        require_once __DIR__ . '/../views/admin/users.php';
    }

    public function kycReview() {
        $user = new User();
        $submissions = $user->getPendingKycSubmissions();
        require_once __DIR__ . '/../views/admin/kyc-review.php';
    }

    public function updateKycStatus() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $user = new User();
            $kyc_id = $_POST['kyc_id'];
            $status = $_POST['status'];
            $user->updateKycStatus($kyc_id, $status);
            header("Location: kyc-review.php");
            exit();
        }
    }
}
?>
