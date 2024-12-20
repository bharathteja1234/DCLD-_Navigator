<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'dbh.php'; // Include the database connection

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['p_id'])) {
        $p_id = $_GET['p_id'];
        
        // Query to fetch discharge summaries for the given p_id
        $sql = "SELECT p_id, discharge_summary, date FROM dischargesummary WHERE p_id = :p_id AND discharge_summary IS NOT NULL AND date IS NOT NULL";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->execute();
        
        if ($stmt) {
            $summaries = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $summaries[] = $row;
            }
            echo json_encode($summaries);
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to fetch discharge summaries: " . $conn->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing p_id parameter"));
    }

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $discharge_summary = $data['discharge_summary'] ?? '';
    $date = $data['date'] ?? '';

    if ($p_id && $discharge_summary && $date) {
        // Insert into the dischargesummary table
        $sql = "INSERT INTO dischargesummary (p_id, discharge_summary, date) VALUES (:p_id, :discharge_summary, :date)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':discharge_summary', $discharge_summary);
        $stmt->bindParam(':date', $date);
        
        if ($stmt->execute()) {
            echo json_encode(array("p_id" => $p_id, "discharge_summary" => $discharge_summary, "date" => $date));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to add new discharge summary: " . $stmt->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, discharge_summary, date)"));
    }

} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $discharge_summary = $data['discharge_summary'] ?? '';

    if ($p_id && $discharge_summary) {
        // Delete from the dischargesummary table
        $sql = "DELETE FROM dischargesummary WHERE p_id = :p_id AND discharge_summary = :discharge_summary";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':discharge_summary', $discharge_summary);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => "Discharge summary deleted successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to delete discharge summary: " . $stmt->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, discharge_summary)"));
    }

} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}

// Note: PDO connection doesn't require explicit closing
// $conn = null;
?>
