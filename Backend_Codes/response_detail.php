<?php
header('Content-Type: application/json');

if (isset($_GET['assessment_date']) && isset($_GET['p_id'])) {
    $assessment_date = $_GET['assessment_date'];
    $p_id = $_GET['p_id'];

    // Set the table name to 'dailyassessments'
    $tableName = "dailyassessment";

    // Include database connection
    require_once 'dbh.php';

    // Query to fetch assessment details by date and p_id
    $query = $conn->prepare("SELECT assessment_date,
        weight,
        stomachAche,
        stomachAcheLocation,
        stomachAcheIntensity,
        yellowSkinEyes,
        swelling,
        swellingLocation,
        tiredness,
        confusion,
        medsTaken,
        missedMeds,
        highSaltFood,
        enoughProtein,
        bowelMovements,
        bpMorning,
        bpEvening,
        heartRateMorning,
        heartRateEvening,
        fluidIntake,
        fluidList,
        abdominalCircumference,
        activityDetails,
        bloodInStool,
        bowelConsistency,
        bowelFrequency,
        urineOutput,
        physicalActivity,
        proteinFoods,
        missedMedsReason
    FROM $tableName WHERE assessment_date = :assessment_date AND p_id = :p_id");

    $query->bindParam(':assessment_date', $assessment_date, PDO::PARAM_STR);
    $query->bindParam(':p_id', $p_id, PDO::PARAM_INT);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'No assessment found for the given date and patient ID']);
    }

} else {
    echo json_encode(['error' => 'Missing or invalid parameters']);
}
?>
