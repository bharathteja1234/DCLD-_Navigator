import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorLogin from './screens/doctorlogin';
import DoctorSignUp from './screens/DoctorSignUp';
import RoleSelectionScreen from './screens/select';
import PatientLogin from './screens/patientlogin';
import DoctorDashboard from './screens/d_homescreen';
import PatientDashboard from './screens/p_dashboard';
import AddPatientDetails from './screens/addpatientdetails';
import PatientSearch from './screens/search';
import EditPatientDetailsScreen from './screens/edit';
import DischargeSummary from './screens/dischargesummary';
import Medication from './screens/medication';
import FollowUp from './screens/followup';
import DailyAssessment from './screens/dailyassess';
import QuestionScreen from './screens/d_questions';
import Pqns from './screens/p_qns';
import PrescriptionScreen from './screens/Prescription';
import Summary from './screens/summary';
import DailyAssessResponses from './screens/dailyassess_responses';
import AssessmentDetail from './screens/AssessmentDetail';
import PatientMedication from './screens/PatientMedication';
import MedicationDetails from './screens/PatientMedicationDetails';
import PatientDischargeSummary from './screens/PatientDischargeSummary';
import SummaryDetails from './screens/SummaryDetails';
import PatientNotes from './screens/Patient_Notes';
import PatientNoteDetails from './screens/PatientNotesDetail';
import DoctorPatientNotes from './screens/DoctorPatientNotes';
import DoctorPatientNotesDetails from './screens/DoctorPatientNotesDetails';
import DoctorNotification from './screens/DoctorNotification';
import DietInfo from './screens/DietInfo';
import ProfileScreen from './screens/profile';
import DoctorProfile from './screens/doctorprofile';
import QuestionnaireResponses from './screens/questionnaireresponses';
import DoctorQuestionaireResponses from './screens/DoctorQuestionaireResponses';
import Graph from './screens/graphs';
import GetStarted from './screens/getstart';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetStarted">
      <Stack.Screen name="GetStarted" component={GetStarted}  options={{ headerShown: false }} />
      <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="DoctorSignUp" component={DoctorSignUp} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorLogin" component={DoctorLogin} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientLogin" component={PatientLogin} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} options={{ headerShown: false }}/>
        <Stack.Screen name="AddPatientDetails" component={AddPatientDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientSearch" component={PatientSearch} options={{ headerShown: false }}/>
        <Stack.Screen name="EditPatientDetailsScreen" component={EditPatientDetailsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DischargeSummary" component={DischargeSummary} options={{ headerShown: false }}/>
        <Stack.Screen name="Medication" component={Medication} options={{ headerShown: false }}/>
        <Stack.Screen name="FollowUp" component={FollowUp} options={{ headerShown: false }}/>
        <Stack.Screen name="DailyAssessment" component={DailyAssessment} options={{ headerShown: false }}/>
        <Stack.Screen name="QuestionScreen" component={QuestionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Pqns" component={Pqns} options={{ headerShown: false }}/>
        <Stack.Screen name="PrescriptionScreen" component={PrescriptionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Summary" component={Summary} options={{ headerShown: false }}/>
        <Stack.Screen name="DailyAssessResponses" component={DailyAssessResponses} options={{ headerShown: false }}/>
        <Stack.Screen name="AssessmentDetail" component={AssessmentDetail} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientMedication" component={PatientMedication} options={{ headerShown: false }}/>
        <Stack.Screen name="MedicationDetails" component={MedicationDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientDischargeSummary" component={PatientDischargeSummary} options={{ headerShown: false }}/>
        <Stack.Screen name="SummaryDetails" component={SummaryDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientNotes" component={PatientNotes} options={{ headerShown: false }}/>
        <Stack.Screen name="PatientNoteDetails" component={PatientNoteDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorPatientNotes" component={DoctorPatientNotes} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorPatientNotesDetails" component={DoctorPatientNotesDetails} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorNotification" component={DoctorNotification} options={{ headerShown: false }}/>
        <Stack.Screen name="DietInfo" component={DietInfo} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ headerShown: false }}/>
        <Stack.Screen name="QuestionnaireResponses" component={QuestionnaireResponses} options={{ headerShown: false }}/>
        <Stack.Screen name="DoctorQuestionaireResponses" component={DoctorQuestionaireResponses} options={{ headerShown: false }}/>
        <Stack.Screen name="Graph" component={Graph} options={{ headerShown: false }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
