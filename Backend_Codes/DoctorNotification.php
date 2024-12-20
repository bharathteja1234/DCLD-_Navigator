<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'dbh.php';

try {
    $stmt = $conn->prepare("
        SELECT p_id, Notification, NotificationDate 
        FROM notification_table 
        WHERE NotificationDate >= DATE_SUB(NOW(), INTERVAL 2 DAY)
    ");
    $stmt->execute();
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($notifications) {
        echo json_encode(array("success" => true, "notifications" => $notifications));
    } else {
        echo json_encode(array("success" => false, "message" => "No notifications found"));
    }
} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
} finally {
    $conn = null;
}
?>
