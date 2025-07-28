<?php
require_once __DIR__ . '/../includes/db.php';

class FlaggedTransaction {
    public function getAll() {
        global $conn;
        $sql = "SELECT ft.id, t.id as transaction_id, u.username, t.amount, t.type, ft.reason, ft.created_at
                FROM flagged_transactions ft
                JOIN transactions t ON ft.transaction_id = t.id
                JOIN users u ON t.user_id = u.id";
        $result = $conn->query($sql);
        return $result;
    }

    public function create($transaction_id, $reason) {
        global $conn;
        $sql = "INSERT INTO flagged_transactions (transaction_id, reason) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $transaction_id, $reason);
        $stmt->execute();
    }
}
?>
