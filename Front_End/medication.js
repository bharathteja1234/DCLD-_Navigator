import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';

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
      const response = await fetch(`${config.baseUrl}/medication.php?p_id=${p_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch medications');
    }
  };

  const handleAddCourse = async () => {
    try {
      const validMedications = medications.filter(medication => medication.duration && medication.duration.trim() !== '');
      const courseNumber = validMedications.length + 1;
      const startDay = (courseNumber - 1) * 15 + 1;
      const endDay = courseNumber * 15;
      const newCourse = { course: `${courseNumber}`, duration: `${startDay}-${endDay} days` };

      const response = await fetch(`${config.baseUrl}/medication.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id, ...newCourse }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new course');
      }

      const data = await response.json();
      setMedications([...medications, data]);
      Alert.alert('Success', 'New course added successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add new course');
    }
  };

  const handleDeleteCourse = async (course) => {
    try {
      const response = await fetch(`${config.baseUrl}/medication.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id, course }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setMedications(medications.filter(med => med.course !== course));
      Alert.alert('Success', 'Course deleted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete course');
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
  <Text style={styles.title}>Medication Courses</Text>
  <ScrollView contentContainerStyle={styles.medicationList}>
    {medications
      .filter(medication => medication.duration && medication.duration.trim() !== '')
      .map((medication, index) => (
        <View key={index} style={styles.medicationItem}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrescriptionScreen', { p_id, course: medication.course })}
            style={styles.courseButton}
          >
            <Text style={styles.text1}>{`Course ${medication.course}`}</Text>
            <Text style={styles.text2}>{`Duration: ${medication.duration}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteCourse(medication.course)}>
            <Feather name="trash-2" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}
  </ScrollView>
  <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
    <Text style={styles.buttonText}>Add New Course</Text>
  </TouchableOpacity>
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    paddingTop: height * 0.025,
  },
  title: {
    marginTop: height * 0.125,
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.025,
  },
  medicationList: {
    width: '80%',
    paddingBottom: height * 0.025,
  },
  medicationItem: {
    padding: width * 0.025,
    borderWidth: width * 0.01,
    marginTop: height * 0.0125,
    borderColor: '#90c1F9',
    borderRadius: width * 0.025,
    marginBottom: height * 0.0125,
    height: height * 0.075,
    width: width * 0.75,
    backgroundColor: '#90c1F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: width * 0.0075, height: height * 0.00625 },
    shadowOpacity: 1,
    shadowRadius: width * 0.01,
    elevation: 10,
  },
  courseButton: {
    flex: 1,
    paddingRight: width * 0.025,
  },
  text1:{
    fontSize:width * 0.04,
  },
  text2:{
    fontSize:width * 0.033,
    color:'#555',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.0125,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.025,
    position: 'absolute',
    bottom: height * 0.025,
  },
  buttonText: {
    fontSize: width * 0.045,
    color: '#ffffff',
  },
});

export default MedicationScreen;
