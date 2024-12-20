<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'dbh.php'; // Include the database connection 

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['p_id'])) {
        $p_id = $_GET['p_id'];

        $sql = "SELECT Notes_Index, notes_date FROM patientnotes WHERE p_id = :p_id AND Notes_Index IS NOT NULL AND notes_date IS NOT NULL";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);

        if ($stmt->execute()) {
            $summaries = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($summaries);
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to fetch patient notes: " . $conn->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing p_id parameter"));
    }

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $Notes_Index = $data['Notes_Index'] ?? '';
    $notes_date = $data['notes_date'] ?? '';

    if ($p_id && $Notes_Index && $notes_date) {
        $sql = "INSERT INTO patientnotes (p_id, Notes_Index, notes_date) VALUES (:p_id, :Notes_Index, :notes_date)";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':Notes_Index', $Notes_Index);
        $stmt->bindParam(':notes_date', $notes_date);

        if ($stmt->execute()) {
            echo json_encode(array("p_id" => $p_id, "Notes_Index" => $Notes_Index, "notes_date" => $notes_date));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to add new patient note: " . $stmt->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, Notes_Index, notes_date)"));
    }

} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $Notes_Index = $data['Notes_Index'] ?? '';

    if ($p_id && $Notes_Index) {
        $sql = "DELETE FROM patientnotes WHERE p_id = :p_id AND Notes_Index = :Notes_Index";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':Notes_Index', $Notes_Index);

        if ($stmt->execute()) {
            echo json_encode(array("success" => "Patient note deleted successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to delete patient note: " . $stmt->errorInfo()[2]));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, Notes_Index)"));
    }

} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}

// Note: PDO connection doesn't require explicit closing
// $conn = null;
?>
