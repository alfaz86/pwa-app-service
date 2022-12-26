<?php 

include('../model/service.model.php');

class ServiceController extends ServiceModel
{
    public function viewIndex()
    {
        echo json_encode([
            'view' => file_get_contents('../service/index.html'),
            'data' => $this->getDataService()
        ]);
    }

    public function viewCreate()
    {
        echo json_encode([
            'view' => file_get_contents('../service/create.html'),
            'data' => $this->serviceType()
        ]);
    }

    public function viewCost()
    {
        echo json_encode([
            'view' => file_get_contents('../cost.html'),
            'data' => $this->serviceType()
        ]);
    }

    public function create($data)
    {
        echo json_encode([
            'data' => $this->createService($data),
            'status' => true
        ]);
    }
}