<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'dbh.php'; 

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['p_id']) && isset($_GET['date']) && isset($_GET['discharge_summary'])) {
        $p_id = $_GET['p_id'];
        $date = $_GET['date'];
        $discharge_summary = $_GET['discharge_summary'];

        $sql = "SELECT 
                    `summary`,
                    `bp`,
                    `sugar`,
                    `cbc_hemoglobin`,
                    `cbc_platelet_count`,
                    `cbc_tlc_count`,
                    `rft_urea`,
                    `rft_creatinine`,
                    `lft_total_bilirubin`,
                    `lft_direct_bilirubin`,
                    `lft_total_protein`,
                    `lft_ast`,
                    `lft_alt`,
                    `lft_alp`,
                    `lft_albumin`,
                    `electrolytes_sodium`,
                    `electrolytes_potassium`,
                    `electrolytes_bicarbonate`,
                    `pt_inr`,
                    `aptt`
                FROM `dischargesummary`
                WHERE `p_id` = :p_id AND `date` = :date AND `discharge_summary` = :discharge_summary";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':discharge_summary', $discharge_summary);
        $stmt->execute();

        $summary = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($summary) {
            echo json_encode($summary, JSON_PARTIAL_OUTPUT_ON_ERROR);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "Record not found"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, date, discharge_summary)"));
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $p_id = $data['p_id'] ?? '';
    $date = $data['date'] ?? '';
    $discharge_summary = $data['discharge_summary'] ?? '';

    if ($p_id && $date && $discharge_summary) {
        $sql = "UPDATE `dischargesummary` SET 
                    `summary` = :summary,
                    `bp` = :bp,
                    `sugar` = :sugar,
                    `cbc_hemoglobin` = :cbc_hemoglobin,
                    `cbc_platelet_count` = :cbc_platelet_count,
                    `cbc_tlc_count` = :cbc_tlc_count,
                    `rft_urea` = :rft_urea,
                    `rft_creatinine` = :rft_creatinine,
                    `lft_total_bilirubin` = :lft_total_bilirubin,
                    `lft_direct_bilirubin` = :lft_direct_bilirubin,
                    `lft_total_protein` = :lft_total_protein,
                    `lft_ast` = :lft_ast,
                    `lft_alt` = :lft_alt,
                    `lft_alp` = :lft_alp,
                    `lft_albumin` = :lft_albumin,
                    `electrolytes_sodium` = :electrolytes_sodium,
                    `electrolytes_potassium` = :electrolytes_potassium,
                    `electrolytes_bicarbonate` = :electrolytes_bicarbonate,
                    `pt_inr` = :pt_inr,
                    `aptt` = :aptt
                WHERE `p_id` = :p_id AND `date` = :date AND `discharge_summary` = :discharge_summary";

        $stmt = $conn->prepare($sql);

        // Bind the parameters
        $stmt->bindParam(':p_id', $p_id);
        $stmt->bindParam(':summary', $data['summary']);
        $stmt->bindParam(':bp', $data['bp']);
        $stmt->bindParam(':sugar', $data['sugar']);
        $stmt->bindParam(':cbc_hemoglobin', $data['cbc']['hemoglobin']);
        $stmt->bindParam(':cbc_platelet_count', $data['cbc']['plateletCount']);
        $stmt->bindParam(':cbc_tlc_count', $data['cbc']['tlcCount']);
        $stmt->bindParam(':rft_urea', $data['rft']['urea']);
        $stmt->bindParam(':rft_creatinine', $data['rft']['creatinine']);
        $stmt->bindParam(':lft_total_bilirubin', $data['lft']['totalBilirubin']);
        $stmt->bindParam(':lft_direct_bilirubin', $data['lft']['directBilirubin']);
        $stmt->bindParam(':lft_total_protein', $data['lft']['totalProtein']);
        $stmt->bindParam(':lft_ast', $data['lft']['AST']);
        $stmt->bindParam(':lft_alt', $data['lft']['ALT']);
        $stmt->bindParam(':lft_alp', $data['lft']['ALP']);
        $stmt->bindParam(':lft_albumin', $data['lft']['albumin']);
        $stmt->bindParam(':electrolytes_sodium', $data['electrolytes']['sodium']);
        $stmt->bindParam(':electrolytes_potassium', $data['electrolytes']['potassium']);
        $stmt->bindParam(':electrolytes_bicarbonate', $data['electrolytes']['bicarbonate']);
        $stmt->bindParam(':pt_inr', $data['ptInr']);
        $stmt->bindParam(':aptt', $data['aptt']);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':discharge_summary', $discharge_summary);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(array("success" => "Record updated successfully"));
        } else {
            $errorInfo = $stmt->errorInfo();
            error_log("SQL error: " . print_r($errorInfo, true)); // Log the SQL error information
            http_response_code(500);
            echo json_encode(array("error" => "Failed to update record", "details" => $errorInfo));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Missing required parameters (p_id, date, discharge_summary)"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}
?>
