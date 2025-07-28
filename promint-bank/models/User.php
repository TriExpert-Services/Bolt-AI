<?php
require_once __DIR__ . '/../includes/db.php';

class User {
    public function getAll() {
        global $conn;
        $sql = "SELECT id, username, email, role FROM users";
        $result = $conn->query($sql);
        return $result;
    }

    public function getPendingKycSubmissions() {
        global $conn;
        $sql = "SELECT k.id, u.username, k.document_type, k.document_path, k.status FROM kyc_submissions k JOIN users u ON k.user_id = u.id WHERE k.status = 'pending'";
        $result = $conn->query($sql);
        return $result;
    }

    public function updateKycStatus($kyc_id, $status) {
        global $conn;
        $sql = "UPDATE kyc_submissions SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $kyc_id);
        $stmt->execute();
    }
}
?>
