<?php
require_once __DIR__ . '/../includes/db.php';

class Transaction {
    public function getAllByUserId($user_id) {
        global $conn;
        $sql = "SELECT id, amount, type, created_at FROM transactions WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result;
    }

    public function getAll() {
        global $conn;
        $sql = "SELECT id, user_id, amount, type, created_at FROM transactions";
        $result = $conn->query($sql);
        return $result;
    }

    public function create($user_id, $amount, $type) {
        global $conn;

        if ($type == 'withdrawal') {
            // Check for sufficient balance
            $sql_balance = "SELECT balance FROM users WHERE id = ?";
            $stmt_balance = $conn->prepare($sql_balance);
            $stmt_balance->bind_param("i", $user_id);
            $stmt_balance->execute();
            $result_balance = $stmt_balance->get_result();
            $row_balance = $result_balance->fetch_assoc();

            if ($row_balance['balance'] < $amount) {
                return false; // Insufficient balance
            }
        }

        $sql = "INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ids", $user_id, $amount, $type);

        if ($stmt->execute()) {
            // Update user balance
            if ($type == 'deposit') {
                $sql_update = "UPDATE users SET balance = balance + ? WHERE id = ?";
            } else {
                $sql_update = "UPDATE users SET balance = balance - ? WHERE id = ?";
            }
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param("di", $amount, $user_id);
            $stmt_update->execute();
            return true;
        } else {
            return false;
        }
    }
}
?>
