<?php

class Connection
{
    private $hostname = 'localhost';

    private $username = 'root';

    private $password = '';

    private $database = 'application_service';

    public function connect()
    {
        return new mysqli($this->hostname, $this->username, $this->password, $this->database);
    }
}