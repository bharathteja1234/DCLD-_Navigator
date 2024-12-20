<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'dbh.php';

$postData = json_decode(file_get_contents("php://input"), true);

if (!isset($postData['p_id']) || !isset($postData['response_time']) || !isset($postData['Questions_No'])) {
    echo json_encode(array("success" => false, "message" => "Invalid data: missing parameters"));
    exit;
}

$p_id = $postData['p_id'];
$response_time = $postData['response_time'];
$Questions_No = $postData['Questions_No'];
$tableName = "questionresponses"; 

error_log("Received p_id: $p_id, response_time: $response_time, Questions_No: $Questions_No");

try {
    $stmt = $conn->prepare("SELECT questions, type, response FROM $tableName WHERE p_id = :p_id AND Questions_No = :Questions_No");
    $stmt->bindParam(':p_id', $p_id, PDO::PARAM_INT); 
    $stmt->bindParam(':Questions_No', $Questions_No, PDO::PARAM_INT); 
    $stmt->execute();
    $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log("Fetched responses: " . json_encode($responses));

    echo json_encode(array("success" => true, "responses" => $responses));
} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
} finally {
    $conn = null;
}
?>
