<?php

include('../model/user.model.php');

$json = file_get_contents('php://input');
$data = json_decode($json);
$key = $_GET['key'];

session_start();
if ($key == "auth") {
    $user = $_SESSION['user'] ?? null;
    
    echo json_encode([
        "user" => $user
    ]);
} elseif ($key == "login") {
    $user = new UserModel();
    $_SESSION['user'] = $user->auth($data);
    echo true;
} elseif ($key == "logout") {
    session_unset();
    session_destroy();

    echo true;
}