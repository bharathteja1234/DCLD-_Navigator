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
    if (isset($request->username) && isset($request->password)) {
        $username = $request->username;
        $password = $request->password;

        // Prepare SQL statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT * FROM doctorlogin WHERE username = :username AND password = :password");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        // Check if there is a matching user
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $d_id = $user['d_id'];

            $response = array(
                "status" => true,
                "message" => "Login successful",
                "d_id" => $d_id
            );
        } else {
            $response = array(
                "status" => false,
                "message" => "Invalid username or password"
            );
        }
    } else {
        $response = array(
            "status" => false,
            "message" => "Invalid input data"
        );
    }
} catch (PDOException $e) {
    // Handle connection errors
    $response = array(
        "status" => false,
        "message" => "Connection failed: " . $e->getMessage()
    );
}

// Send JSON response
echo json_encode($response);
?>
