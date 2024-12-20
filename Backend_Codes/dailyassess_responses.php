<?php
header('Content-Type: application/json');
include 'dbh.php';

// Retrieve and sanitize the patient ID
$p_id = filter_input(INPUT_GET, 'p_id', FILTER_SANITIZE_NUMBER_INT);
if (!$p_id) {
    echo json_encode(["error" => "Invalid patient ID"]);
    exit();
}

// Set the table name to 'dailyassessments'
$tableName = "dailyassessment";

try {
    // Prepare the SQL statement with WHERE condition to filter by p_id
    $sql = "SELECT assessment_date, weight FROM $tableName WHERE p_id = :p_id ORDER BY assessment_date ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':p_id', $p_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $responses = [];
    $index = 1;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (!empty($row['assessment_date']) && $row['assessment_date'] !== '0000-00-00 00:00:00.000000' && !empty($row['weight'])) {
            $responses[] = ["response" => "Daily Assessment Response: $index Date: " . $row['assessment_date']];
            $index++;
        }
    }
    
    echo json_encode($responses);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

// Close the connection
$conn = null;
?>
