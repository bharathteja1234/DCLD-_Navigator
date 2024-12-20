<?php
// Include the database handler
require_once 'dbh.php';

try {
    // Use the $pdo variable defined in dbh.php
    $query = "
        SELECT 
            pl.p_id, pl.username, pl.password, pl.name, pl.contactNo, pl.age, pl.disease, pl.gender, 
            pl.admittedOn, pl.dischargeOn, pl.Treatment_Given, pl.Course_in_Hospital, 
            da.assessment_date, da.weight, da.stomachAche, da.stomachAcheLocation, 
            da.stomachAcheIntensity, da.yellowSkinEyes, da.swelling, da.swellingLocation, 
            da.tiredness, da.confusion, da.medsTaken, da.missedMeds, da.highSaltFood, 
            da.enoughProtein, da.bowelMovements, da.bpMorning, da.bpEvening, 
            da.heartRateMorning, da.heartRateEvening, da.fluidIntake, da.fluidList, 
            da.abdominalCircumference, da.activityDetails, da.bloodInStool, 
            da.bowelConsistency, da.bowelFrequency, da.urineOutput, da.physicalActivity, 
            da.proteinFoods, da.missedMedsReason, 
            qr.Questions_No, qr.questions, qr.type, qr.response, qr.response_time, 
            pn.Notes_Index, pn.Notes, pn.notes_date, 
            m.course, m.duration, m.medicine, m.medicine_duration, m.frequency, m.guidelines, 
            ds.discharge_summary, ds.date, ds.summary, ds.bp, ds.sugar, ds.cbc_hemoglobin, 
            ds.cbc_platelet_count, ds.cbc_tlc_count, ds.rft_urea, ds.rft_creatinine, 
            ds.lft_total_bilirubin, ds.lft_direct_bilirubin, ds.lft_total_protein, 
            ds.lft_ast, ds.lft_alt, ds.lft_alp, ds.lft_albumin, 
            ds.electrolytes_sodium, ds.electrolytes_potassium, ds.electrolytes_bicarbonate, 
            ds.pt_inr, ds.aptt
        FROM patientlogin pl
        LEFT JOIN dailyassessment da ON pl.p_id = da.p_id
        LEFT JOIN questionresponses qr ON pl.p_id = qr.p_id
        LEFT JOIN patientnotes pn ON pl.p_id = pn.p_id
        LEFT JOIN medication m ON pl.p_id = m.p_id
        LEFT JOIN dischargesummary ds ON pl.p_id = ds.p_id
    ";

    $stmt = $conn->query($query);

    // CSV generation
    $filename = "patient_data.csv";
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment;filename=' . $filename);

    // Open the output stream
    $output = fopen('php://output', 'w');

    // Write headers to CSV
    $columns = array_keys($stmt->fetch(PDO::FETCH_ASSOC)); // Column names from database
    fputcsv($output, $columns); // Write headers to the first row

    // Fetch and write data rows
    $stmt->execute();  // Re-execute query after fetching column names
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Ensure proper escaping of CSV values
        $escapedRow = array_map(function($value) {
            // Escape quotes and handle potential issues with commas
            return '"' . str_replace('"', '""', $value) . '"';
        }, $row);

        fputcsv($output, $escapedRow);
    }

    fclose($output);  // Close the file stream
} catch (PDOException $e) {
    echo "Query error: " . $e->getMessage();
}
?>
