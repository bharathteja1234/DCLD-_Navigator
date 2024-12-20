<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'dbh.php';

$postData = json_decode(file_get_contents("php://input"), true);

if (!isset($postData['p_id']) || !isset($postData['responses']) || !is_array($postData['responses'])) {
    echo json_encode(["success" => false, "message" => "Invalid data: p_id or responses missing or not an array"]);
    exit;
}

$p_id = $postData['p_id'];
$responses = $postData['responses'];
$notificationDate = isset($postData['notificationDate']) ? $postData['notificationDate'] : '';

error_log("p_id: " . $p_id);
error_log("responses: " . json_encode($responses));
error_log("notificationDate: " . $notificationDate);

$tableName = "questionresponses";
$notification = '';

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("INSERT INTO $tableName (p_id, Questions_No, questions, type, response, response_time) VALUES (:p_id, :Questions_No, :questions, :type, :response, :response_time)");

    foreach ($responses as $response) {
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':Questions_No', $response['Questions_No']);
        $stmt->bindParam(':questions', $response['questions']);
        $stmt->bindParam(':type', $response['type']);
        $stmt->bindParam(':response', $response['response']);
        $stmt->bindParam(':response_time', $response['response_time']);
        $stmt->execute();
    }

    $dangerSymptoms = [];
    foreach ($responses as $response) {
        if ($response['type'] === 'Danger Symptoms' && $response['response'] === 'Yes') {
            if (isset($response['questions']) && is_string($response['questions'])) {
                $dangerSymptoms[] = $response['questions'];
            }
        }
    }

    if (!empty($dangerSymptoms)) {
        $notificationString = implode(" and ", $dangerSymptoms) . "!!!";

        $nameStmt = $conn->prepare("SELECT name FROM patientlogin WHERE p_id = :p_id");
        $nameStmt->bindParam(':p_id', $p_id);
        $nameStmt->execute();
        $nameResult = $nameStmt->fetch(PDO::FETCH_ASSOC);

        if ($nameResult && isset($nameResult['name'])) {
            $patientName = $nameResult['name'];
            $notification = "$patientName has $notificationString";

            $notificationStmt = $conn->prepare("INSERT INTO notification_table (p_id, Notification, NotificationDate) VALUES (:p_id, :notification, :notificationDate)");
            $notificationStmt->bindParam(':p_id', $p_id);
            $notificationStmt->bindParam(':notification', $notification);
            $notificationStmt->bindParam(':notificationDate', $notificationDate);
            $notificationStmt->execute();
        }
    }

    $conn->commit();

    echo json_encode(["success" => true, "message" => "Data processed successfully", "notification" => $notification]);
} catch (PDOException $e) {
    $conn->rollBack();
    error_log("PDOException: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
} finally {
    $conn = null;
}
?>
