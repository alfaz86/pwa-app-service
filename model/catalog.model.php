<?php

include('../connection.php');

class CatalogModel extends Connection
{
    public function catalogSearch($data)
    {
        $sql = "SELECT * FROM catalogs";
        if ($data->search->name && $data->search->type) {
            $sql .= " WHERE name LIKE '%{$data->search->name}%' AND type = '{$data->search->type}'";
        } elseif ($data->search->name) {
            $sql .= " WHERE name LIKE '%{$data->search->name}%'";
        } elseif ($data->search->type) {
            $sql .= " WHERE type = '{$data->search->type}'";
        }
        $sql .= " ORDER BY id DESC LIMIT {$data->limit} OFFSET {$data->start}";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $catalog[] = $data;
            }
            return $catalog;
        }
        return [];
    }

    public function catalogAllDAta($data)
    {
        $sql = "SELECT * FROM catalogs";
        if ($data->search->name && $data->search->type) {
            $sql .= " WHERE name LIKE '%{$data->search->name}%' AND type = '{$data->search->type}'";
        } elseif ($data->search->name) {
            $sql .= " WHERE name LIKE '%{$data->search->name}%'";
        } elseif ($data->search->type) {
            $sql .= " WHERE type = '{$data->search->type}'";
        }
        $result = $this->connect()->query($sql);
        return $result->num_rows;
    }

    public function createCatalog($data)
    {
        $qname  = "name  = '$data->name',";
        $qprice = "price = '$data->price',";
        $qtype  = "type  = '$data->type',";
        $qimg   = "img   = '$data->img'";
        $sql    = "INSERT INTO catalogs SET $qname $qprice $qtype $qimg";
        $result = $this->connect()->query($sql);
        return $result;
    }

    public function getCatalog($id)
    {
        $sql    = "SELECT * FROM catalogs WHERE id = $id";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $catalog = $data;
            }
            return $catalog;
        }
        return null;
    }

    public function updateCatalog($data)
    {
        $qid    = "id      = '$data->id'";
        $qname  = "name    = '$data->name'";
        $qprice = ", price = '$data->price'";
        $qtype  = ", type  = '$data->type'";
        $qimg   = $data->img ? ", img   = '$data->img'" : "";
        $sql    = "UPDATE catalogs SET $qname $qprice $qtype $qimg WHERE $qid";
        $result = $this->connect()->query($sql);
        return $result;
    }

    public function deleteCatalog($id)
    {
        $sql    = "DELETE FROM catalogs WHERE id = '$id'";
        $result = $this->connect()->query($sql);
        return $result;
    }

    public function getRecommended()
    {
        $sql = "SELECT * FROM catalogs";
        $sql .= " ORDER BY id DESC LIMIT 4";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $catalog[] = $data;
            }
            return $catalog;
        }
        return [];
    }
}