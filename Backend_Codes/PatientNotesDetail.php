<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'dbh.php'; // Include the database connection

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['p_id']) && isset($_GET['Notes_Index']) && isset($_GET['notes_date'])) {
        $p_id = $_GET['p_id'];
        $Notes_Index = $_GET['Notes_Index'];
        $notes_date = $_GET['notes_date'];

        $sql = "SELECT Notes FROM patientnotes WHERE p_id = :p_id AND Notes_Index = :Notes_Index AND notes_date = :notes_date";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':Notes_Index', $Notes_Index);
        $stmt->bindParam(':notes_date', $notes_date);

        try {
            $stmt->execute();
            $Notes = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($Notes) {
                echo json_encode($Notes);
            } else {
                http_response_code(404);
                echo json_encode(array("error" => "Discharge Notes not found"));
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to fetch discharge Notes: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, Notes_Index, notes_date)"));
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $Notes = $data['Notes'] ?? '';
    $notes_date = $data['notes_date'] ?? '';
    $Notes_Index = $data['Notes_Index'] ?? '';

    if ($p_id && $Notes && $notes_date && $Notes_Index) {
        $sql = "UPDATE patientnotes SET Notes = :Notes WHERE p_id = :p_id AND Notes_Index = :Notes_Index AND notes_date = :notes_date";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':Notes', $Notes);
        $stmt->bindParam(':Notes_Index', $Notes_Index);
        $stmt->bindParam(':notes_date', $notes_date);

        try {
            if ($stmt->execute()) {
                echo json_encode(array("success" => "Discharge Notes updated successfully"));
            } else {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to update discharge Notes: " . $stmt->errorInfo()[2]));
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to update discharge Notes: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, Notes, notes_date, Notes_Index)"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}
?>
