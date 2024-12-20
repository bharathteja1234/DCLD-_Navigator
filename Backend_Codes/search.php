<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'dbh.php';

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "GET" && (isset($_GET['p_id']) || isset($_GET['name']))) {
    $p_id = isset($_GET['p_id']) ? $_GET['p_id'] : '';
    $name = isset($_GET['name']) ? $_GET['name'] : '';

    $sql = "SELECT p_id, username, name, age, contactNo, disease, gender, admittedOn, dischargeOn, Treatment_Given, Course_in_Hospital, image 
            FROM patientlogin 
            WHERE (p_id = :p_id OR name LIKE :name)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':p_id', $p_id);
    $stmt->bindParam(':name', $name);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($result && count($result) > 0) {
        echo json_encode($result);
    } else {
        echo json_encode([]);
    }
} else {
    echo json_encode(["error" => "Invalid request method or missing parameters"]);
}
?>
