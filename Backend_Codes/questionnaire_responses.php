<?php
header('Content-Type: application/json');
include 'dbh.php';

$p_id = filter_input(INPUT_GET, 'p_id', FILTER_SANITIZE_NUMBER_INT);
if (!$p_id) {
    echo json_encode(["error" => "Invalid patient ID"]);
    exit();
}

$tableName = "questionresponses";

try {
    $sql = "SELECT Questions_No, MIN(response_time) AS earliest_response_time 
            FROM $tableName 
            WHERE p_id = :p_id 
            GROUP BY Questions_No 
            ORDER BY earliest_response_time ASC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':p_id', $p_id, PDO::PARAM_INT);
    $stmt->execute();

    $responses = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (!empty($row['earliest_response_time']) && $row['earliest_response_time'] !== '0000-00-00 00:00:00.000000') {
            $responses[] = [
                "response" => "Date: " . $row['earliest_response_time'],
                "Questions_No" => $row['Questions_No']
            ];
        }
    }

    echo json_encode($responses);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn = null;
?>
