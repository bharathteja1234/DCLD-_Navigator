<?php
// Include the database connection
include 'dbh.php';

// Validate required fields
$requiredFields = ['p_id', 'username', 'password', 'name', 'contactNo', 'age', 'gender', 'disease', 'admittedOn', 'dischargeOn', 'Treatment_Given', 'Course_in_Hospital'];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['status' => false, 'message' => 'All required fields must be provided']);
        exit;
    }
}

$p_id = $_POST['p_id'];
$username = $_POST['username'];
$password = $_POST['password'];
$name = $_POST['name'];
$contactNo = $_POST['contactNo'];
$age = $_POST['age'];
$gender = $_POST['gender'];
$disease = $_POST['disease'];
$admittedOn = date('Y-m-d', strtotime($_POST['admittedOn']));
$dischargeOn = date('Y-m-d', strtotime($_POST['dischargeOn']));
$Treatment_Given = $_POST['Treatment_Given'];
$Course_in_Hospital = $_POST['Course_in_Hospital'];

// Handling the image file upload
$uploadFileDir = 'upload_files/';
if (!is_dir($uploadFileDir)) {
    mkdir($uploadFileDir, 0755, true); 
}

$imageUrl = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageTmpPath = $_FILES['image']['tmp_name'];
    $imageName = $_FILES['image']['name'];
    $imageExt = pathinfo($imageName, PATHINFO_EXTENSION);
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (in_array($imageExt, $allowedExtensions)) {
        $destPath = $uploadFileDir . $imageName;

        if (move_uploaded_file($imageTmpPath, $destPath)) {
            $imageUrl = $destPath;
        } else {
            echo json_encode(['status' => false, 'message' => 'Error moving the uploaded file']);
            exit;
        }
    } else {
        echo json_encode(['status' => false, 'message' => 'Invalid file extension']);
        exit;
    }
} else {
    echo json_encode(['status' => false, 'message' => 'Image file is required']);
    exit;
}

// SQL query to insert data into the database
$sql = "INSERT INTO patientlogin (p_id, username, password, name, contactNo, age, gender, disease, admittedOn, dischargeOn, Treatment_Given, Course_in_Hospital, image) 
        VALUES (:p_id, :username, :password, :name, :contactNo, :age, :gender, :disease, :admittedOn, :dischargeOn, :Treatment_Given, :Course_in_Hospital, :imageUrl)";

$stmt = $conn->prepare($sql);

$stmt->bindParam(':p_id', $p_id);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':contactNo', $contactNo);
$stmt->bindParam(':age', $age);
$stmt->bindParam(':gender', $gender);
$stmt->bindParam(':disease', $disease);
$stmt->bindParam(':admittedOn', $admittedOn);
$stmt->bindParam(':dischargeOn', $dischargeOn);
$stmt->bindParam(':Treatment_Given', $Treatment_Given);
$stmt->bindParam(':Course_in_Hospital', $Course_in_Hospital);
$stmt->bindParam(':imageUrl', $imageUrl);

if ($stmt->execute()) {
    echo json_encode([
        'status' => true,
        'message' => 'Record added successfully',
        'data' => [
            'p_id' => $p_id,
            'username' => $username,
            'name' => $name,
            'contactNo' => $contactNo,
            'age' => $age,
            'gender' => $gender,
            'disease' => $disease,
            'admittedOn' => $admittedOn,
            'dischargeOn' => $dischargeOn,
            'Treatment_Given' => $Treatment_Given,
            'Course_in_Hospital' => $Course_in_Hospital,
            'imageUrl' => $imageUrl
        ]
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        'status' => false,
        'message' => 'Error inserting data'
    ], JSON_PRETTY_PRINT);
}

$conn = null;
?>
