<?php
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/TransactionController.php';

header("Content-Type: application/json; charset=UTF-8");

$request = $_GET['request'];
$request_parts = explode('/', $request);

$resource = $request_parts[0];
$action = isset($request_parts[1]) ? $request_parts[1] : '';
$id = isset($request_parts[2]) ? $request_parts[2] : '';

switch ($resource) {
    case 'users':
        $userController = new UserController();
        if ($action == 'kyc' && $id) {
            // Handle KYC status update
            // This is just an example, you would need to implement this
        } else {
            $users = $userController->index();
            echo json_encode($users);
        }
        break;
    case 'transactions':
        $transactionController = new TransactionController();
        $transactions = $transactionController->index();
        echo json_encode($transactions);
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Resource not found."]);
        break;
}
?>
