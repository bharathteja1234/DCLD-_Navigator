import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import config from './config';  // Import the config file

const { width, height } = Dimensions.get('window');

const EditPatientDetailsScreen = ({ route, navigation }) => {
  const { p_id } = route.params; 
  const [currentPage, setCurrentPage] = useState(1); 
  const [patientDetails, setPatientDetails] = useState({
    p_id: p_id,
    name: '',
    age: '',
    contactNo: '',
    disease: '',
    gender: '',
    admittedOn: '',
    dischargeOn: '',
    Treatment_Given: '', 
    Course_in_Hospital: '',
    image: '', 
  });
  const [imageUri, setImageUri] = useState(null); 

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/search.php?p_id=${p_id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        if (Array.isArray(data) && data.length > 0) {
          const patientData = data[0]; 
          setPatientDetails({
            ...patientDetails,
            name: patientData.name,
            age: patientData.age,
            contactNo: patientData.contactNo,
            disease: patientData.disease,
            gender: patientData.gender,
            admittedOn: patientData.admittedOn,
            dischargeOn: patientData.dischargeOn,
            Treatment_Given: patientData.Treatment_Given,
            Course_in_Hospital: patientData.Course_in_Hospital,
            image: patientData.image,
          });
        } else {
          console.error('No patient data found');
          Alert.alert('Error', 'No patient data found');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch patient details');
      }
    };

    fetchPatientDetails();
  }, [p_id]);

  const fetchAndUpdatePatientDetails = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/edit.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to update patient details');
      }

      const data = await response.json();
      setPatientDetails(data);
      Alert.alert('Success', 'Patient details updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update patient details');
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1, selectionLimit: 1 });

    if (result.didCancel) {
      console.log('Image selection canceled');
    } else if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    const formData = new FormData();
    formData.append('p_id', p_id);
    formData.append('image', { uri: imageUri, type: 'image/jpeg', name: `photo_${Date.now()}.jpg` });

    try {
      const response = await fetch(`${config.baseUrl}/image_upload.php`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <ScrollView>
          <View style={styles.pageContainer}>
            <Image
              source={{ uri: imageUri ? imageUri : `${config.baseUrl}/${patientDetails.image}` }}
              style={styles.image}
            />
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.linkText}>Pick an Image</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => uploadImage(uploadImage)}>
  <Text style={styles.linkText}>Upload Image</Text>
</TouchableOpacity>

            <View style={styles.elevatedContainer}>
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={patientDetails.name}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, name: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={patientDetails.age ? String(patientDetails.age) : ''}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, age: value })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="phone" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  value={patientDetails.contactNo ? String(patientDetails.contactNo) : ''}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, contactNo: value })}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="activity" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Disease Diagnosed On"
                  value={patientDetails.disease}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, disease: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="user-check" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Gender"
                  value={patientDetails.gender}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, gender: value })}
                />
              </View>
              <View style={styles.navigationButtonsContainer}>
                <TouchableOpacity style={styles.navigationButton1} onPress={() => setCurrentPage(2)}>
                  <Feather name="chevrons-right" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView>
          <View style={styles.pageContainer}>
            <View style={styles.elevatedContainer}>
              <View style={styles.inputContainer}>
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Admitted On"
                  value={patientDetails.admittedOn}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, admittedOn: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Discharged On"
                  value={patientDetails.dischargeOn}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, dischargeOn: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="briefcase" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input1}
                  placeholder="Treatment Given in Hospital"
                  value={patientDetails.Treatment_Given}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, Treatment_Given: value })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="file-text" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input1}
                  placeholder="Previous Medical History"
                  value={patientDetails.Course_in_Hospital}
                  onChangeText={(value) => setPatientDetails({ ...patientDetails, Course_in_Hospital: value })}
                />
              </View>
              <View style={styles.navigationButtonsContainer}>
                <TouchableOpacity style={styles.navigationButton3} onPress={() => setCurrentPage(1)}>
                  <Feather name="chevrons-left" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.navigationButton2} onPress={fetchAndUpdatePatientDetails}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('DischargeSummary', { p_id });
            }}>
              <Feather name="file-text" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Discharge Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('Medication', { p_id });
            }}>
              <Feather name="plus-circle" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Add Medication</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('QuestionnaireResponses', { p_id });
            }}>
              <Feather name="message-square" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Questionnaire Responses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton4} onPress={() => {
              navigation.navigate('DailyAssessResponses', { p_id });
            }}>
              <Feather name="activity" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Daily Assessment Responses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton4} onPress={() => {
              navigation.navigate('Graph', { p_id });
            }}>
              <Feather name="bar-chart-2" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Patient Report Graphs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => {
              navigation.navigate('DoctorPatientNotes', { p_id });
            }}>
              <Feather name="clipboard" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Patient Notes</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Patient Details</Text>
      </View>
      {renderPage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  linkText: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize:17,
    marginBottom: 10,
    height: height * 0.04,
    color: 'white',
    textAlign: 'center',
    textAlignVertical:'center',
    justifyContent: 'center',
    width: width * 0.4,
    alignItems:'center',
    alignContent:'center',
  },
  topBar: {
    width: width * 1.1,
    height: height * 0.16,
    marginTop: -20,
    left: -20,
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 60,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.07,
    top: height * 0.09,
  },
  topBarTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    top: height * 0.03,
    color: 'black',
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 1, 
    paddingHorizontal: 15,
  },
  image: {
    width: width * 0.4,
    height: height * 0.2,
    borderRadius: 150,
    marginBottom: 20,
    marginTop: 10,
  },
  elevatedContainer: {
    width: width * 0.9,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    height: height * 0.06,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: height * 0.06,
  },
input1: {
    flex: 1,
    height: height * 0.2,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 1,
    marginTop: 20,
  },
  navigationButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height:height * 0.05,
    width: width * 0.7,
    marginBottom: 10,
  },
  navigationButton4: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: width * 0.7,
    marginBottom: 10,
  },
  navigationButton3: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: width * 0.15,
    left: -width * 0.4,
    marginBottom: 5,
  },
navigationButton1: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    left: width * 0.2,
    marginBottom: 5,
    marginTop: height * 0.001,
  },
  navigationButton2: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems:'center',
    borderRadius: 10,
    marginBottom: height * 0.005,
    top: -height * 0.02,
    width: width * 0.3,
  },
  buttonText: {
    fontSize: 17,
    color: '#ffffff',
    marginLeft:5,
  },

  },
);


export default EditPatientDetailsScreen;
