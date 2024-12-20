<?php
require_once('dbh.php');

// Set the content type to JSON
header('Content-Type: application/json');

function addQuestion($question, $type) {
    global $conn;
    try {
        $stmt = $conn->prepare("INSERT INTO doctor_questions (question, type) VALUES (:question, :type)");
        $stmt->bindParam(':question', $question);
        $stmt->bindParam(':type', $type);
        $stmt->execute();
        return array('success' => true, 'message' => 'Question added successfully');
    } catch(PDOException $e) {
        $errorMessage = 'Error adding question: ' . $e->getMessage();
        error_log($errorMessage);
        return array('success' => false, 'message' => $errorMessage);
    }
}

function fetchQuestions() {
    global $conn;
    $questions = array();
    try {
        $stmt = $conn->query("SELECT id, question, type FROM doctor_questions");
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        $errorMessage = 'Error fetching questions: ' . $e->getMessage();
        error_log($errorMessage);
    }
    return $questions;
}

function updateQuestion($id, $question, $type) {
    global $conn;
    try {
        $stmt = $conn->prepare("UPDATE doctor_questions SET question=:question, type=:type WHERE id=:id");
        $stmt->bindParam(':question', $question);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return array('success' => true, 'message' => 'Question updated successfully');
    } catch(PDOException $e) {
        $errorMessage = 'Error updating question: ' . $e->getMessage();
        error_log($errorMessage);
        return array('success' => false, 'message' => $errorMessage);
    }
}

function deleteQuestion($id) {
    global $conn;
    try {
        $stmt = $conn->prepare("DELETE FROM doctor_questions WHERE id=:id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return array('success' => true, 'message' => 'Question deleted successfully');
    } catch(PDOException $e) {
        $errorMessage = 'Error deleting question: ' . $e->getMessage();
        error_log($errorMessage);
        return array('success' => false, 'message' => $errorMessage);
    }
}

// Ensure no output before JSON response
ob_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Add a new question
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['question']) && isset($data['type'])) {
        $question = $data['question'];
        $type = $data['type'];
        $result = addQuestion($question, $type);
        echo json_encode($result);
    } else {
        echo json_encode(array('error' => 'Missing question or type in request body'));
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    $questions = fetchQuestions();
    echo json_encode(array('questions' => $questions));
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id']) && isset($data['question']) && isset($data['type'])) {
        $id = $data['id'];
        $question = $data['question'];
        $type = $data['type'];
        $result = updateQuestion($id, $question, $type);
        echo json_encode($result);
    } else {
        echo json_encode(array('error' => 'Missing ID, question, or type in request body'));
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id'])) {
        $id = $data['id'];
        $result = deleteQuestion($id);
        echo json_encode($result);
    } else {
        echo json_encode(array('error' => 'Missing question ID in request body'));
    }
} else {
    echo json_encode(array('error' => 'Invalid request.'));
}

ob_end_flush();
?>
