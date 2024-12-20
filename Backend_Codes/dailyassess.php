<?php
include 'dbh.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

echo "<pre>";
print_r($data);
echo "</pre>";

$requiredFields = ['weight', 'stomachAche', 'yellowSkinEyes', 'swelling', 'tiredness', 'confusion', 'medsTaken', 'highSaltFood', 'enoughProtein', 'bowelMovements', 'bpMorning', 'bpEvening', 'heartRateMorning', 'heartRateEvening', 'fluidIntake', 'fluidList', 'abdominalCircumference', 'bloodInStool', 'urineOutput', 'physicalActivity'];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo "Error: Missing required field '$field'.";
        exit();
    }
}

$p_id = $data['p_id'];
$assessment_date = date('Y-m-d'); 
$weight = $data['weight'];
$stomachAche = $data['stomachAche'];
$stomachAcheLocation = isset($data['stomachAcheLocation']) ? $data['stomachAcheLocation'] : null;
$stomachAcheIntensity = isset($data['stomachAcheIntensity']) ? $data['stomachAcheIntensity'] : null;
$yellowSkinEyes = $data['yellowSkinEyes'];
$swelling = $data['swelling'];
$swellingLocation = isset($data['swellingLocation']) ? $data['swellingLocation'] : null;
$tiredness = $data['tiredness'];
$confusion = $data['confusion'];
$medsTaken = $data['medsTaken'];
$missedMeds = isset($data['missedMeds']) ? $data['missedMeds'] : null;
$highSaltFood = $data['highSaltFood'];
$enoughProtein = $data['enoughProtein'];
$bowelMovements = $data['bowelMovements'];
$bpMorning = $data['bpMorning'];
$bpEvening = $data['bpEvening'];
$heartRateMorning = $data['heartRateMorning'];
$heartRateEvening = $data['heartRateEvening'];
$fluidIntake = $data['fluidIntake'];
$fluidList = $data['fluidList'];
$abdominalCircumference = $data['abdominalCircumference'];
$activityDetails = $data['activityDetails'];
$bloodInStool = isset($data['bloodInStool']) ? $data['bloodInStool'] : null;
$bowelConsistency = $data['bowelConsistency'];
$bowelFrequency = $data['bowelFrequency'];
$urineOutput = $data['urineOutput'];
$physicalActivity = $data['physicalActivity'];
$proteinFoods = $data['proteinFoods'];
$missedMedsReason = isset($data['missedMedsReason']) ? $data['missedMedsReason'] : null;

$tableName = "dailyassessment";

$sql = "INSERT INTO $tableName (p_id, assessment_date, weight, stomachAche, stomachAcheLocation, stomachAcheIntensity, yellowSkinEyes, swelling, swellingLocation, tiredness, confusion, medsTaken, missedMeds, highSaltFood, enoughProtein, bowelMovements, bpMorning, bpEvening, heartRateMorning, heartRateEvening, fluidIntake, fluidList, abdominalCircumference, activityDetails, bloodInStool, bowelConsistency, bowelFrequency, urineOutput, physicalActivity, proteinFoods, missedMedsReason)
        VALUES (:p_id, :assessment_date, :weight, :stomachAche, :stomachAcheLocation, :stomachAcheIntensity, :yellowSkinEyes, :swelling, :swellingLocation, :tiredness, :confusion, :medsTaken, :missedMeds, :highSaltFood, :enoughProtein, :bowelMovements, :bpMorning, :bpEvening, :heartRateMorning, :heartRateEvening, :fluidIntake, :fluidList, :abdominalCircumference, :activityDetails, :bloodInStool, :bowelConsistency, :bowelFrequency, :urineOutput, :physicalActivity, :proteinFoods, :missedMedsReason)";

$stmt = $conn->prepare($sql);

$stmt->bindParam(':p_id', $p_id);
$stmt->bindParam(':assessment_date', $assessment_date);
$stmt->bindParam(':weight', $weight);
$stmt->bindParam(':stomachAche', $stomachAche);
$stmt->bindParam(':stomachAcheLocation', $stomachAcheLocation);
$stmt->bindParam(':stomachAcheIntensity', $stomachAcheIntensity);
$stmt->bindParam(':yellowSkinEyes', $yellowSkinEyes);
$stmt->bindParam(':swelling', $swelling);
$stmt->bindParam(':swellingLocation', $swellingLocation);
$stmt->bindParam(':tiredness', $tiredness);
$stmt->bindParam(':confusion', $confusion);
$stmt->bindParam(':medsTaken', $medsTaken);
$stmt->bindParam(':missedMeds', $missedMeds);
$stmt->bindParam(':highSaltFood', $highSaltFood);
$stmt->bindParam(':enoughProtein', $enoughProtein);
$stmt->bindParam(':bowelMovements', $bowelMovements);
$stmt->bindParam(':bpMorning', $bpMorning);
$stmt->bindParam(':bpEvening', $bpEvening);
$stmt->bindParam(':heartRateMorning', $heartRateMorning);
$stmt->bindParam(':heartRateEvening', $heartRateEvening);
$stmt->bindParam(':fluidIntake', $fluidIntake);
$stmt->bindParam(':fluidList', $fluidList);
$stmt->bindParam(':abdominalCircumference', $abdominalCircumference);
$stmt->bindParam(':activityDetails', $activityDetails);
$stmt->bindParam(':bloodInStool', $bloodInStool);
$stmt->bindParam(':bowelConsistency', $bowelConsistency);
$stmt->bindParam(':bowelFrequency', $bowelFrequency);
$stmt->bindParam(':urineOutput', $urineOutput);
$stmt->bindParam(':physicalActivity', $physicalActivity);
$stmt->bindParam(':proteinFoods', $proteinFoods);
$stmt->bindParam(':missedMedsReason', $missedMedsReason);

try {
    $stmt->execute();
    echo "New record created successfully";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$conn = null;
?>
