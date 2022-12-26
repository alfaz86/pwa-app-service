<?php

include('../connection.php');

class ServiceModel extends Connection
{
    public $userSession;
    public function __construct()
    {
        session_start();
        $this->userSession = $_SESSION['user'] ?? null;
    }

    public function serviceType()
    {
        $sql = "SELECT * FROM service_types";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $service_type[] = $data;
            }
            return $service_type;
        }
        return [];
    }

    public function getServiceType($id)
    {
        $sql = "SELECT * FROM service_types WHERE id = $id";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $service_type = $data;
            }
            return $service_type;
        }
        return null;
    }

    public function createService($data)
    {
        $generate         = "S/" . rand(1000, 9999);
        $qno_service      = "no_service = '$generate',";
        $quser_id         = "user_id = '$data->user_id',";
        $qservice_type_id = "service_type_id  = '$data->service_type_id',";
        $qdate            = "date  = '$data->date $data->time',";
        $qstatus          = "status   = 'pending'";
        $sql              = "INSERT INTO services SET $qno_service $quser_id $qservice_type_id $qdate $qstatus";
        $result           = $this->connect()->query($sql);
        return $result;
    }

    public function getDataService()
    {
        if ($this->userSession == null) return [];
        $quser_id = $this->userSession['role'] != 'admin' ? "WHERE user_id = ".$this->userSession['id'] : "";
        $sql = "SELECT * FROM services $quser_id ORDER BY id DESC";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $data["user"] = $this->getUser($data['user_id']);
                $data["service_type"] = $this->getServiceType($data['user_id']);
                $sevice[] = $data;
            }
            return $sevice;
        }
        return [];
    }

    public function getUser($id)
    {
        $sql    = "SELECT * FROM users WHERE id = $id";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $user = $data;
            }
            return $user;
        }
        return null;
    }
}