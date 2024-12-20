<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'dbh.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (empty($_POST['p_id'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $p_id = $_POST['p_id'];

    $uploadFileDir = 'upload_files/';
    if (!is_dir($uploadFileDir)) {
        mkdir($uploadFileDir, 0755, true); 
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageTmpPath = $_FILES['image']['tmp_name'];
        $imageName = $_FILES['image']['name'];
        $imageExt = pathinfo($imageName, PATHINFO_EXTENSION);
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($imageExt, $allowedExtensions)) {
            $destPath = $uploadFileDir . $imageName;

            if (move_uploaded_file($imageTmpPath, $destPath)) {
                $imageUrl = $destPath;

                $sql = "UPDATE patientlogin SET image = :imageUrl WHERE p_id = :p_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':imageUrl', $imageUrl);
                $stmt->bindParam(':p_id', $p_id);

                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Image updated successfully']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error updating image in database']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Error moving the uploaded file']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid file extension']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Image file is required']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn = null;
?>
