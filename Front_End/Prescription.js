import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';

const { width, height } = Dimensions.get('window');

const PrescriptionScreen = ({ route }) => {
  const { p_id, course } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicine, setMedicine] = useState('');
  const [medicineDuration, setMedicineDuration] = useState('');
  const [frequency, setFrequency] = useState('');
  const [guidelines, setGuidelines] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/Prescription.php?p_id=${p_id}&course=${course}`);
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

  const handleSavePrescription = async () => {
    try {
      const newPrescription = { medicine, medicine_duration: medicineDuration, frequency, guidelines };

      const response = await fetch(`${config.baseUrl}/Prescription.php?p_id=${p_id}&course=${course}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrescription),
      });

      if (!response.ok) {
        throw new Error('Failed to save prescription');
      }

      const data = await response.json();
      setPrescriptions([...prescriptions, data]);
      setMedicine('');
      setMedicineDuration('');
      setFrequency('');
      setGuidelines('');
      Alert.alert('Success', 'Prescription saved successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save prescription');
    }
  };

  const handleDeletePrescription = async (id) => {
    try {
      const response = await fetch(`${config.baseUrl}/Prescription.php?p_id=${p_id}&course=${course}&id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete prescription');
      }

      setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
      Alert.alert('Success', 'Prescription deleted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete prescription');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription for Course {course}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Medicine"
          placeholderTextColor="gray"
          value={medicine}
          onChangeText={setMedicine}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration"
          placeholderTextColor="gray"
          value={medicineDuration}
          onChangeText={setMedicineDuration}
        />
        <TextInput
          style={styles.input}
          placeholder="Frequency"
          placeholderTextColor="gray"
          value={frequency}
          onChangeText={setFrequency}
        />
        <TextInput
          style={styles.input}
          placeholder="Guidelines"
          placeholderTextColor="gray"
          value={guidelines}
          onChangeText={setGuidelines}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePrescription}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <ScrollView style={styles.prescriptionList}>
        {prescriptions
          .filter(prescription => prescription.medicine || prescription.medicine_duration || prescription.frequency || prescription.guidelines)
          .map((prescription, index) => (
            <View key={index} style={styles.prescriptionItem}>
              <Text style={styles.prescriptionText}>{`Medicine   : ${prescription.medicine}`}</Text>
              <Text style={styles.prescriptionText}>{`Duration    : ${prescription.medicine_duration}`}</Text>
              <Text style={styles.prescriptionText}>{`Frequency : ${prescription.frequency}`}</Text>
              <Text style={styles.prescriptionText}>{`Guidelines : ${prescription.guidelines}`}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePrescription(prescription.id)}
              >
                <Feather name="trash-2" size={24} color="red" />
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
    backgroundColor: '#ffffff',
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    marginTop: height * 0.1,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  inputContainer: {
    width: width * 0.8,
    marginBottom: height * 0.02,
  },
  input: {
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: width * 0.008,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.03,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    marginBottom: height * 0.02,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: '#ffffff',
  },
  prescriptionList: {
    width: width * 0.8,
    flex: 1,
  },
  prescriptionItem: {
    padding: width * 0.03,
    borderWidth: width * 0.005,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    backgroundColor: '#90c1F9',
    shadowColor: '#000',
    shadowOffset: { width: width * 0.0075, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.01,
    elevation: 5,
  },
  prescriptionText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
  },
  deleteButton: {
    backgroundColor: '#90c1F9',
    paddingVertical: height * 0.0075,
    paddingHorizontal: width * 0.025,
    borderRadius: width * 0.02,
    position: 'absolute',
    right: width * 0.05,
    top: height * 0.05,
  },
});
export default PrescriptionScreen;
