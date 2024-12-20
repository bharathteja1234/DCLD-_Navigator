<?php
header('Content-Type: application/json');

// Include database connection
require_once 'dbh.php';

if (!isset($_GET['p_id']) || !isset($_GET['parameter']) || !isset($_GET['time_range'])) {
    echo json_encode(['error' => 'Missing required parameters']);
    exit();
}

$p_id = $_GET['p_id'];
$parameter = $_GET['parameter'];
$time_range = $_GET['time_range'];

// Table name is changed to 'dischargesummary'
$tableName = "dischargesummary";

// Validate the parameter
$validParameters = [
    'bp', 'sugar', 'cbc_hemoglobin', 'cbc_platelet_count', 'cbc_tlc_count',
    'rft_urea', 'rft_creatinine', 'lft_total_bilirubin', 'lft_direct_bilirubin',
    'lft_total_protein', 'lft_ast', 'lft_alt', 'lft_alp', 'lft_albumin',
    'electrolytes_sodium', 'electrolytes_potassium', 'electrolytes_bicarbonate',
    'pt_inr', 'aptt'
];

if (!in_array($parameter, $validParameters)) {
    echo json_encode(['error' => 'Invalid parameter']);
    exit();
}

// Determine the time range
switch ($time_range) {
    case '1 month':
        $interval = '1 MONTH';
        break;
    case '3 months':
        $interval = '3 MONTH';
        break;
    case '6 months':
        $interval = '6 MONTH';
        break;
    case '7 days':
        $interval = '7 DAY';
        break;
    default:
        echo json_encode(['error' => 'Invalid time range']);
        exit();
}

// Query to fetch data, including p_id in the WHERE condition
$sql = "SELECT `date`, `$parameter` FROM `$tableName` WHERE `p_id` = :p_id AND `date` >= NOW() - INTERVAL $interval ORDER BY `date` ASC";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':p_id', $p_id, PDO::PARAM_INT);
$stmt->execute();

$data = [];

if ($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }
} else {
    echo json_encode(['error' => 'No data found']);
    exit();
}

echo json_encode($data);

$conn = null;
?>
