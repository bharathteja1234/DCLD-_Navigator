import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import config from './config';

const { width, height } = Dimensions.get('window');

const AssessmentDetail = ({ route, navigation }) => {
  const { p_id, assessment_date } = route.params;
  const [assessment, setAssessment] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { title: 'General Information', fields: ['weight', 'stomachAche', 'stomachAcheLocation', 'stomachAcheIntensity'] },
    { title: 'Physical Symptoms', fields: ['yellowSkinEyes', 'swelling', 'swellingLocation', 'tiredness', 'confusion'] },
    { title: 'Medications', fields: ['medsTaken', 'missedMeds', 'missedMedsReason'] },
    { title: 'Diet', fields: ['highSaltFood', 'enoughProtein', 'proteinFoods'] },
    { title: 'Bowel Movements', fields: ['bowelMovements', 'bloodInStool', 'bowelConsistency', 'bowelFrequency'] },
    { title: 'Vital Signs', fields: ['bpMorning', 'bpEvening', 'heartRateMorning', 'heartRateEvening'] },
    { title: 'Fluid Intake', fields: ['fluidIntake', 'fluidList'] },
    { title: 'Other Information', fields: ['abdominalCircumference', 'activityDetails', 'urineOutput', 'physicalActivity'] },
  ];

  const fieldLabels = {
    weight: 'Weight',
    stomachAche: 'Stomach Ache',
    stomachAcheLocation: 'Stomach Ache Location',
    stomachAcheIntensity: 'Stomach Ache Intensity',
    yellowSkinEyes: 'Yellow Skin/Eyes',
    swelling: 'Swelling',
    swellingLocation: 'Swelling Location',
    tiredness: 'Tiredness',
    confusion: 'Confusion',
    medsTaken: 'Medications Taken',
    missedMeds: 'Missed Medications',
    missedMedsReason: 'Reason for Missed Medications',
    highSaltFood: 'High Salt Food',
    enoughProtein: 'Enough Protein',
    proteinFoods: 'Protein Foods',
    bowelMovements: 'Bowel Movements',
    bloodInStool: 'Blood in Stool',
    bowelConsistency: 'Bowel Consistency',
    bowelFrequency: 'Bowel Frequency',
    bpMorning: 'Blood Pressure (Morning)',
    bpEvening: 'Blood Pressure (Evening)',
    heartRateMorning: 'Heart Rate (Morning)',
    heartRateEvening: 'Heart Rate (Evening)',
    fluidIntake: 'Fluid Intake',
    fluidList: 'List of Fluids',
    abdominalCircumference: 'Abdominal Circumference',
    activityDetails: 'Activity Details',
    urineOutput: 'Urine Output',
    physicalActivity: 'Physical Activity',
  };

  useEffect(() => {
    console.log('Received ', p_id, assessment_date);
  }, [p_id]);

  useEffect(() => {
    const fetchAssessmentDetail = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/response_detail.php?p_id=${p_id}&assessment_date=${assessment_date}`);
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setAssessment(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch assessment details');
      }
    };

    fetchAssessmentDetail();
  }, [p_id, assessment_date]);

  if (!assessment) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderSection = () => {
    const section = sections[currentSection];
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.fields.map((field) => (
          <View key={field} style={styles.detailBox}>
            <Text style={styles.label}>{fieldLabels[field]}:</Text>
            <Text style={styles.value}>{assessment[field]}</Text>
          </View>
        ))}
      </View>
    );
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={30} color="black" style={styles.back} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Assessment Detail</Text>
      {renderSection()}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePrevious} style={styles.navButton} disabled={currentSection === 0}>
          <Text style={[styles.navButtonText, currentSection === 0 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.navButton} disabled={currentSection === sections.length - 1}>
          <Text style={[styles.navButtonText, currentSection === sections.length - 1 && styles.disabledText]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    backgroundColor: '#9FCBFB',
    height: height * 0.14, // 14% of the screen height
    width: '100%',
    borderRadius: width * 0.075, // 7.5% of the screen width
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.025, // 2.5% of the screen width
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  back: {
    top: height * 0.025, // 2.5% of the screen height
  },
  title: {
    fontSize: width * 0.06, // 6% of the screen width
    fontWeight: 'bold',
    marginBottom: height * 0.075, // 7.5% of the screen height
    textAlign: 'center',
    marginTop: -height * 0.05, // -5% of the screen height
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of the screen width
  },
  sectionTitle: {
    fontSize: width * 0.05, // 5% of the screen width
    fontWeight: 'bold',
    marginBottom: height * 0.0125, // 1.25% of the screen height
    textAlign: 'center',
  },
  detailBox: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: width * 0.0375, // 3.75% of the screen width
    borderRadius: width * 0.025, // 2.5% of the screen width
    marginBottom: height * 0.0125, // 1.25% of the screen height
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.0025 }, // 0.25% of the screen height
    shadowOpacity: 0.1,
    shadowRadius: height * 0.00125, // 0.125% of the screen height
  },
  label: {
    fontSize: width * 0.04, // 4% of the screen width
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.00625, // 0.625% of the screen height
  },
  value: {
    fontSize: width * 0.04, // 4% of the screen width
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05, // 5% of the screen width
    marginTop: height * 0.025, // 2.5% of the screen height
    marginBottom: height * 0.25, // 37.5% of the screen height
  },
  navButton: {
    backgroundColor: '#9FCBFB',
    paddingVertical: height * 0.0125, // 1.25% of the screen height
    paddingHorizontal: width * 0.05, // 5% of the screen width
    borderRadius: width * 0.025, // 2.5% of the screen width
  },
  navButtonText: {
    fontSize: width * 0.04, // 4% of the screen width
    fontWeight: 'bold',
    color: 'black',
  },
  disabledText: {
    color: '#aaa',
  },
});

export default AssessmentDetail;
