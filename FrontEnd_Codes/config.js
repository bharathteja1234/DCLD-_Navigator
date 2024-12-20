const ip = '180.235.121.245';
const baseUrl = `http://${ip}/med_project`;

const config = {
    ip,
    baseUrl,
    dBHUrl: `${baseUrl}/dbh.php`,
    doctorLoginUrl: `${baseUrl}/doctorlogin.php`,
    doctorSignUpUrl: `${baseUrl}/DoctorSignUp.php`,
    doctorProfileUrl: `${baseUrl}/doctorprofile.php`,
    doctorNotificationUrl: `${baseUrl}/DoctorNotification.php`,
    deleteNotificationUrl: `${baseUrl}/DeleteNotification.php`,
    addPatientDetailsUrl: `${baseUrl}/addpatientdetails.php`,
    searchUrl: `${baseUrl}/search.php`,
    doctorQuestionsUrl: `${baseUrl}/d_questions.php`,
    editUrl: `${baseUrl}/edit.php`,
    imageUploadUrl: `${baseUrl}/image_upload.php`,
    dischargeSummaryUrl: `${baseUrl}/dischargesummary.php`,
    summaryUrl: `${baseUrl}/summary.php`,
    patientNotesUrl: `${baseUrl}/Patient_Notes.php`,
    patientNotesDetailUrl: `${baseUrl}/PatientNotesDetail.php`,
    doctorMedicationUrl: `${baseUrl}/medication.php`,
    doctorPrescriptionUrl: `${baseUrl}/Prescription.php`,
    questionnaireResponsesUrl: `${baseUrl}/questionnaire_responses.php`,
    doctorQuestionaireResponsesUrl: `${baseUrl}/DoctorQuestionaireResponses.php`,
    dailyAssessmentResponsesUrl: `${baseUrl}/dailyassess_responses.php`,
    assessmentDetailUrl: `${baseUrl}/response_detail.php`,
    graphUrl: `${baseUrl}/graphs.php`,
    patientLoginUrl: `${baseUrl}/patientlogin.php`,
    patientProfileUrl: `${baseUrl}/p_dashboard.php`,
    patientQuestionsUrl: `${baseUrl}/p_qns.php`,
    dailyAssessmentUrl: `${baseUrl}/dailyassess.php`,
};

export default config;
