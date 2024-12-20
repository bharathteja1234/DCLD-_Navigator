<?php
// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set CORS headers to allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection file
include 'dbh.php'; // Assuming dbh.php handles the PDO connection setup

$response = array();

try {
    // Read JSON input
    $postData = file_get_contents("php://input");
    $request = json_decode($postData);

    // Validate input
    if (isset($request->doctorName) && isset($request->doctorId) && isset($request->username) && isset($request->password)) {
        $doctor_name = $request->doctorName;
        $gender = $request->gender;
        $speciality = $request->speciality;
        $contactNo = $request->contactNo;
        $doctor_id = $request->doctorId;
        $username = $request->username;
        $password = $request->password;

        // Prepare SQL statement to prevent SQL injection
        $stmt = $conn->prepare("INSERT INTO doctorlogin (d_id, doctor_name, gender, speciality, contactNo, username, password) VALUES (:doctor_id, :doctor_name, :gender, :speciality, :contactNo, :username, :password)");
        $stmt->bindParam(':doctor_id', $doctor_id);
        $stmt->bindParam(':doctor_name', $doctor_name);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':speciality', $speciality);
        $stmt->bindParam(':contactNo', $contactNo);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);

        // Execute the statement
        if ($stmt->execute()) {
            $response = array(
                'status' => true,
                'message' => 'Doctor Data Inserted Successfully',
                'data' => array(
                    'doctorId' => $doctor_id,
                    'doctorName' => $doctor_name,
                    'gender' => $gender,
                    'speciality' => $speciality,
                    'contactNo' => $contactNo,
                    'username' => $username
                )
            );
        } else {
            $response = array(
                'status' => false,
                'message' => 'Insert query failed'
            );
        }
    } else {
        $response = array(
            'status' => false,
            'message' => 'Missing required fields'
        );
    }
} catch (PDOException $e) {
    // Handle connection errors
    $response = array(
        'status' => false,
        'message' => 'Connection failed: ' . $e->getMessage()
    );
}

// Send JSON response
echo json_encode($response, JSON_PRETTY_PRINT);
?>
