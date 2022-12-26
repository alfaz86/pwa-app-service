<?php

include('../connection.php');

class UserModel extends Connection
{
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

    public function auth($data)
    {
        $sql    = "SELECT * FROM users WHERE email = '$data->email' AND password = '$data->password'";
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