import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPills } from '@fortawesome/free-solid-svg-icons';
import config from './config';  // Importing config file

const { width, height } = Dimensions.get('window');

const PrescriptionScreen = ({ route }) => {
  const { p_id, course } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`${config.doctorPrescriptionUrl}?p_id=${p_id}&course=${course}`);  // Using config.doctorPrescriptionUrl
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch prescriptions');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription for Course {course}</Text>
      <ScrollView style={styles.prescriptionList}>
        {prescriptions
          .filter(prescription => prescription.medicine || prescription.medicine_duration || prescription.frequency || prescription.guidelines)
          .map((prescription, index) => (
            <View key={index} style={styles.prescriptionItem}>
              <FontAwesomeIcon icon={faPills} size={60} style={styles.icon} />
              <View style={styles.prescriptionTextContainer}>
                <Text style={styles.labelText}>Medicine:</Text>
                <Text style={styles.fetchedText}>{prescription.medicine}</Text>
                <Text style={styles.labelText}>Duration:</Text>
                <Text style={styles.fetchedText}>{prescription.medicine_duration}</Text>
                <Text style={styles.labelText}>Frequency:</Text>
                <Text style={styles.fetchedText}>{prescription.frequency}</Text>
                <Text style={styles.labelText}>Guidelines:</Text>
                <Text style={styles.fetchedText}>{prescription.guidelines}</Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: height * 0.02, // Responsive padding
  },
  title: {
    fontSize: width * 0.057, 
    marginTop: height * 0.1, // Responsive margin top
    fontWeight: 'bold',
    marginBottom: height * 0.03, 
  },
  prescriptionList: {
    width: '80%',
    flex: 1,
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03, // Responsive padding
    borderWidth: width * 0.005, // Responsive border width
    borderColor: '#ccc',
    borderRadius: width * 0.025, // Responsive border radius
    marginBottom: height * 0.02, 
    backgroundColor: '#90c1F9',
    shadowColor: '#000',
    shadowOffset: { width: width * 0.01, height: height * 0.02 }, // Responsive shadow offset
    shadowOpacity: 0.2,
    shadowRadius: width * 0.02, // Responsive shadow radius
    elevation: 5,
  },
  icon: {
    marginRight: width * 0.03, // Responsive margin right
    left: width * 0.55, // Adjusted to fit within container
  },
  prescriptionTextContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: width * 0.04, 
    fontWeight: 'bold',
    marginBottom: height * 0.01, 
    color: 'black',
    left: -width * 0.15, 
  },
  fetchedText: {
    fontSize: width * 0.04, 
    left: width * 0.074, 
    top: -height * 0.03, 
    color: '#555', 
  },
});

export default PrescriptionScreen;
