<?php
require_once __DIR__ . '/../models/FlaggedTransaction.php';
require_once __DIR__ . '/../models/Transaction.php';

class AiController {
    public function monitorTransactions() {
        $transactionModel = new Transaction();
        $transactions = $transactionModel->getAll(); // This function needs to be created in the model

        foreach ($transactions as $transaction) {
            if ($transaction['amount'] > 1000) {
                $flaggedTransactionModel = new FlaggedTransaction();
                $flaggedTransactionModel->create($transaction['id'], 'Large transaction amount');
            }
        }
    }
}
?>
