<?php

include('../controller/service.controller.php');

$json = file_get_contents('php://input');
$data = json_decode($json);

$service = new ServiceController();
$function = $_GET['f'];

try {
    $service->$function($data);
} catch (\Throwable $th) {
    throw $th;
}