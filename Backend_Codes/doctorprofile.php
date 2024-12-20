<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json');

// Include the database connection file
include 'dbh.php'; // Assuming dbh.php handles the PDO connection setup

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'GET') {
    // Fetch profile based on doctor ID
    $d_id = isset($_GET['d_id']) ? $_GET['d_id'] : null;

    if ($d_id === null) {
        echo json_encode([
            "status" => false,
            "message" => "Doctor ID is required"
        ], JSON_PRETTY_PRINT);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT * FROM doctorlogin WHERE d_id=:d_id");
        $stmt->bindParam(':d_id', $d_id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $profileData = [
                "image" => $result['image'],
                "d_id" => $result['d_id'],
                "doctor_name" => $result['doctor_name'],
                "speciality" => $result['speciality'],
                "gender" => $result['gender'],
                "contactNo" => $result['contactNo']
            ];

            echo json_encode([
                "status" => true,
                "message" => "Profile fetched successfully",
                "profile" => $profileData
            ], JSON_PRETTY_PRINT);
        } else {
            echo json_encode([
                "status" => false,
                "message" => "No profile found for the given Doctor ID"
            ], JSON_PRETTY_PRINT);
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => false,
            "message" => "An error occurred: " . $e->getMessage()
        ], JSON_PRETTY_PRINT);
    }
} elseif ($requestMethod === 'POST') {
    // Check if a file upload is present
    if (isset($_FILES['image'])) {
        $image = $_FILES['image'];
        $d_id = isset($_POST['d_id']) ? $_POST['d_id'] : null;

        if ($d_id === null) {
            echo json_encode([
                "status" => false,
                "message" => "Doctor ID is required"
            ], JSON_PRETTY_PRINT);
            exit;
        }

        // Handle file upload
        $uploadDir = 'uploads/';
        $uploadFile = $uploadDir . basename($image['name']);

        if (move_uploaded_file($image['tmp_name'], $uploadFile)) {
            $imagePath = $uploadFile;

            try {
                $stmt = $conn->prepare("UPDATE doctorlogin SET image = :image WHERE d_id = :d_id");
                $stmt->bindParam(':image', $imagePath);
                $stmt->bindParam(':d_id', $d_id, PDO::PARAM_INT);
                $stmt->execute();

                echo json_encode([
                    "status" => true,
                    "message" => "Profile updated successfully",
                    "imageUrl" => $imagePath
                ], JSON_PRETTY_PRINT);
            } catch (Exception $e) {
                echo json_encode([
                    "status" => false,
                    "message" => "An error occurred: " . $e->getMessage()
                ], JSON_PRETTY_PRINT);
            }
        } else {
            echo json_encode([
                "status" => false,
                "message" => "File upload failed"
            ], JSON_PRETTY_PRINT);
        }
    } else {
        // Handle JSON data
        $postData = file_get_contents("php://input");
        $request = json_decode($postData);

        $d_id = isset($request->d_id) ? $request->d_id : null;
        $doctor_name = isset($request->doctor_name) ? $request->doctor_name : null;
        $speciality = isset($request->speciality) ? $request->speciality : null;
        $gender = isset($request->gender) ? $request->gender : null;
        $contactNo = isset($request->contactNo) ? $request->contactNo : null;

        if ($d_id === null) {
            echo json_encode([
                "status" => false,
                "message" => "Doctor ID is required"
            ], JSON_PRETTY_PRINT);
            exit;
        }

        try {
            $updateFields = [];
            $updateValues = [];

            if ($doctor_name !== null) {
                $updateFields[] = "doctor_name = :doctor_name";
                $updateValues[':doctor_name'] = $doctor_name;
            }

            if ($speciality !== null) {
                $updateFields[] = "speciality = :speciality";
                $updateValues[':speciality'] = $speciality;
            }

            if ($gender !== null) {
                $updateFields[] = "gender = :gender";
                $updateValues[':gender'] = $gender;
            }

            if ($contactNo !== null) {
                $updateFields[] = "contactNo = :contactNo";
                $updateValues[':contactNo'] = $contactNo;
            }

            if (!empty($updateFields)) {
                $sql = "UPDATE doctorlogin SET " . implode(", ", $updateFields) . " WHERE d_id = :d_id";
                $stmt = $conn->prepare($sql);
                $updateValues[':d_id'] = $d_id;
                $stmt->execute($updateValues);

                echo json_encode([
                    "status" => true,
                    "message" => "Profile updated successfully"
                ], JSON_PRETTY_PRINT);
            } else {
                echo json_encode([
                    "status" => false,
                    "message" => "No fields to update"
                ], JSON_PRETTY_PRINT);
            }
        } catch (Exception $e) {
            echo json_encode([
                "status" => false,
                "message" => "An error occurred: " . $e->getMessage()
            ], JSON_PRETTY_PRINT);
        }
    }
} else {
    echo json_encode([
        "status" => false,
        "message" => "Invalid request method"
    ], JSON_PRETTY_PRINT);
}

$conn = null;
?>
