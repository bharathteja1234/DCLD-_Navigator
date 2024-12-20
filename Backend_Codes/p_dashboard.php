<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json');

include 'dbh.php'; // Include the database connection file

$postData = file_get_contents("php://input");
$request = json_decode($postData);

$p_id = isset($request->p_id) ? $request->p_id : null;

if ($p_id === null) {
    $response = array(
        "status" => false,
        "message" => "Patient ID is required"
    );
    echo json_encode($response);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM patientlogin WHERE p_id=:p_id");
    $stmt->bindParam(':p_id', $p_id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $profileData = array(
            "image" => $result['image'],
            "p_id" => $result['p_id'],
            "name" => $result['name'],
            "age" => $result['age'],
            "gender" => $result['gender'],
            "contactNo" => $result['contactNo']
        );

        $response = array(
            "status" => true,
            "message" => "Profile fetched successfully",
            "profile" => $profileData
        );
    } else {
        $response = array(
            "status" => false,
            "message" => "No profile found for the given Patient ID"
        );
    }

    echo json_encode($response);
} catch (Exception $e) {
    $response = array(
        "status" => false,
        "message" => "An error occurred: " . $e->getMessage()
    );
    echo json_encode($response);
}

$conn = null;
?>
