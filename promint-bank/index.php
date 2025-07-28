<?php
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/TransactionController.php';

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
    case '/' :
        require __DIR__ . '/views/index.php';
        break;
    case '' :
        require __DIR__ . '/views/index.php';
        break;
    case '/login' :
        $authController = new AuthController();
        $authController->login();
        break;
    case '/register' :
        $authController = new AuthController();
        $authController->register();
        break;
    case '/logout' :
        $authController = new AuthController();
        $authController->logout();
        break;
    case '/admin/users' :
        $userController = new UserController();
        $userController->index();
        break;
    case '/admin/kyc-review' :
        $userController = new UserController();
        $userController->kycReview();
        break;
    case '/admin/kyc-review/update' :
        $userController = new UserController();
        $userController->updateKycStatus();
        break;
    case '/admin/flagged-transactions' :
        require __DIR__ . '/views/admin/flagged-transactions.php';
        break;
    case '/client/transactions' :
        $transactionController = new TransactionController();
        $transactionController->index();
        break;
    case '/client/deposit' :
        $transactionController = new TransactionController();
        $transactionController->deposit();
        break;
    case '/client/withdraw' :
        $transactionController = new TransactionController();
        $transactionController->withdraw();
        break;
    default:
        http_response_code(404);
        require __DIR__ . '/views/404.php';
        break;
}
?>
