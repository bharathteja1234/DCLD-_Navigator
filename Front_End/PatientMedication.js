import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPrescriptionBottle } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from './config';  // Importing config file

const { width, height } = Dimensions.get('window');

const MedicationScreen = ({ route }) => {
  const { p_id } = route.params; 
  const [medications, setMedications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await fetch(`${config.doctorMedicationUrl}?p_id=${p_id}`);  // Using config.doctorMedicationUrl
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      const data = await response.json();
      const filteredData = data.filter(
        (medication) => medication.duration !== null && medication.duration !== ''
      );
      setMedications(filteredData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch medications');
    }
  };

  if (!medications || !Array.isArray(medications)) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack() }>
          <Ionicons name="chevron-back-outline" size={30} color="black" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Medication Courses</Text>
      </View>
      <ScrollView contentContainerStyle={styles.medicationList}>
        {medications.map((medication, index) => (
          <View key={index} style={index % 2 === 0 ? styles.medicationItemLeft : styles.medicationItemRight}>
            <TouchableOpacity
              style={styles.medicationItem}
              onPress={() => navigation.navigate('MedicationDetails', { p_id, course: medication.course })}
            >
              <View style={styles.medicationText}>
                <FontAwesomeIcon icon={faPrescriptionBottle} size={26} style={styles.icon} />
                <Text style={styles.courseText}>{`Course ${medication.course}`}</Text>
              </View>
              <Text style={styles.durationText}>{`Duration: ${medication.duration}`}</Text>
            </TouchableOpacity>
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
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    paddingTop: height * 0.02, 
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03, 
    width: width*1,
    marginTop: -height * 0.03, 
    marginBottom: height * 0.07, 
    backgroundColor: '#9FCBFB',
    height: height * 0.15, 
    borderBottomWidth: width * 0.01, 
    borderRadius: width * 0.075, 
    borderBottomColor: '#ccc',
  },
  backButton: {
    top: height * 0.04, 
  },
  topBarTitle: {
    marginTop: height * 0.08, 
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    left: width * 0.15, 
  },
  medicationList: {
    width: '100%',
    paddingBottom: height * 0.03, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03, 
  },
  medicationItem: {
    padding: width * 0.03, 
    borderWidth: width * 0.005, 
    borderColor: '#90c1F9',
    borderRadius: width * 0.025, 
    marginBottom: height * 0.02, 
    backgroundColor: '#90c1F9',
    shadowColor: 'black',
    shadowOffset: { width: width * 0.007, height: height * 0.01 }, 
    shadowOpacity: 1,
    shadowRadius: width * 0.02, 
    elevation: 10,
    width: width*0.46, 
  },
  medicationItemLeft: {
    width: '48%', 
    marginBottom: height * 0.02, 
  },
  medicationItemRight: {
    width: '48%', 
    marginBottom: height * 0.02, 
    alignSelf: 'flex-end',
  },
  medicationText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.005, 
  },
  icon: {
    marginRight: width * 0.03, 
    top: height * 0.01, 
  },
  courseText: {
    fontSize: width * 0.04, 
  },
  durationText: {
    fontSize: width * 0.035, 
    color: '#555',
    left: width * 0.09, 
  },
});

export default MedicationScreen;
