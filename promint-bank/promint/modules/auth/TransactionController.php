<?php
require_once __DIR__ . '/../models/Transaction.php';
require_once __DIR__ . '/../includes/auth.php';

class TransactionController {
    public function index() {
        $data = check_login();
        $transaction = new Transaction();
        $transactions = $transaction->getAllByUserId($data->id);
        require_once __DIR__ . '/../views/client/transactions.php';
    }

    public function deposit() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $data = check_login();
            $transaction = new Transaction();
            $amount = $_POST['amount'];
            $transaction->create($data->id, $amount, 'deposit');
            header("Location: deposit.php");
            exit();
        } else {
            require_once __DIR__ . '/../views/client/deposit.php';
        }
    }

    public function withdraw() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $data = check_login();
            $transaction = new Transaction();
            $amount = $_POST['amount'];
            $transaction->create($data->id, $amount, 'withdrawal');
            header("Location: withdraw.php");
            exit();
        } else {
            require_once __DIR__ . '/../views/client/withdraw.php';
        }
    }
}
?>
