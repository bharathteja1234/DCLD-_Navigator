import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal, Button, ActivityIndicator, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import config from './config';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPersonDress, faSuitcaseMedical, faPerson } from '@fortawesome/free-solid-svg-icons';
const { width, height } = Dimensions.get('window');

const AddPatientDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [patientDetails, setPatientDetails] = useState({
    p_id: '',
    username: '',
    password: '',
    name: '',
    contactNo: '',
    age: '',
    gender: '',
    disease: '',
    admittedOn: null,
    dischargeOn: null,
    Treatment_Given: '',
    Course_in_Hospital: '',
    imageUri: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [showAdmittedOnPicker, setShowAdmittedOnPicker] = useState(false);
  const [showDischargeOnPicker, setShowDischargeOnPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
      maxWidth: 800,
      maxHeight: 600,
      allowsEditing: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User canceled image selection.');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image. Please try again later.');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        handleInputChange('imageUri', uri);
      }
    });
  };

  const handleSubmit = async () => {
    const { p_id, username, password, name, contactNo, age, gender, disease, admittedOn, dischargeOn, Treatment_Given, Course_in_Hospital, imageUri } = patientDetails;

    if (!p_id || !username || !password || !name || !contactNo || !age || !gender || !disease || !admittedOn || !dischargeOn || !Treatment_Given || !Course_in_Hospital) {
      Alert.alert('All fields are required');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('p_id', p_id);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('contactNo', contactNo);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('disease', disease);
    formData.append('admittedOn', admittedOn.toISOString().split('T')[0]);
    formData.append('dischargeOn', dischargeOn.toISOString().split('T')[0]);
    formData.append('Treatment_Given', Treatment_Given);
    formData.append('Course_in_Hospital', Course_in_Hospital);

    if (imageUri) {
      const fileName = imageUri.split('/').pop();
      formData.append('image', { uri: imageUri, name: fileName, type: 'image/jpeg' });
    }

    try {
      const response = await fetch(config.addPatientDetailsUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status) {
        setModalVisible(true);
        setPatientDetails({
          p_id: '',
          username: '',
          password: '',
          name: '',
          contactNo: '',
          age: '',
          gender: '',
          disease: '',
          admittedOn: null,
          dischargeOn: null,
          Treatment_Given: '',
          Course_in_Hospital: '',
          imageUri: null,
        });
      } else {
        Alert.alert('Error', result.message || 'Failed to add patient details. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const hideModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Add Patient Details</Text>
      </View>
      <View style={styles.container}>
        {currentPage === 1 && (
          <View style={styles.frame}>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.input1}>
                {patientDetails.imageUri ? (
                  <Image source={{ uri: patientDetails.imageUri }} style={{ width: 200, height: 200, borderRadius: 100 }} />
                ) : (
                  <Text> + Upload image </Text>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Patient ID"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('p_id', text)}
                value={patientDetails.p_id}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('name', text)}
                value={patientDetails.name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="hash" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('age', text)}
                value={patientDetails.age}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender:</Text>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientDetails.gender === 'Male' && styles.genderButtonSelected,
                ]}
                onPress={() => handleInputChange('gender', 'Male')}
              >
                <FontAwesomeIcon
                  icon={faPerson}
                  size={20}
                  color={patientDetails.gender === 'Male' ? '#fff' : '#000'}
                />
                <Text style={[
                  styles.genderButtonText,
                  patientDetails.gender === 'Male' && styles.genderButtonTextSelected,
                ]}> Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientDetails.gender === 'Female' && styles.genderButtonSelected,
                ]}
                onPress={() => handleInputChange('gender', 'Female')}
              >
                <FontAwesomeIcon
                  icon={faPersonDress}
                  size={20}
                  color={patientDetails.gender === 'Female' ? '#fff' : '#000'}
                />
                <Text style={[
                  styles.genderButtonText,
                  patientDetails.gender === 'Female' && styles.genderButtonTextSelected
                ]}> Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientDetails.gender === 'Other' && styles.genderButtonSelected
                ]}
                onPress={() => handleInputChange('gender', 'Other')}
              >
                <MaterialIcons
                  name="transgender"
                  size={20}
                  color={patientDetails.gender === 'Other' ? '#fff' : '#000'}
                />
                <Text style={[
                  styles.genderButtonText,
                  patientDetails.gender === 'Other' && styles.genderButtonTextSelected
                ]}> Other</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Feather name="activity" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Disease Diagonized On"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('disease', text)}
                value={patientDetails.disease}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contact No"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('contactNo', text)}
                value={patientDetails.contactNo}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentPage(2)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage === 2 && (
          <View style={styles.frame}>
          <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setShowAdmittedOnPicker(true)}
              >
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <Text style={styles.datePickerText}>
                  {patientDetails.admittedOn
                    ? patientDetails.admittedOn.toDateString()
                    : 'Admitted On'}
                </Text>
              </TouchableOpacity>
              {showAdmittedOnPicker && (
                <DateTimePicker
                  value={patientDetails.admittedOn || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowAdmittedOnPicker(false);
                    handleInputChange('admittedOn', selectedDate || patientDetails.admittedOn);
                  }}
                />
              )}
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setShowDischargeOnPicker(true)}
              >
                <Feather name="calendar" size={20} color="gray" style={styles.icon} />
                <Text style={styles.datePickerText}>
                  {patientDetails.dischargeOn
                    ? patientDetails.dischargeOn.toDateString()
                    : 'Discharge On'}
                </Text>
              </TouchableOpacity>
              {showDischargeOnPicker && (
                <DateTimePicker
                  value={patientDetails.dischargeOn || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDischargeOnPicker(false);
                    handleInputChange('dischargeOn', selectedDate || patientDetails.dischargeOn);
                  }}
                />
              )}
            </View>
            <View style={styles.inputContainer1}>
            <FontAwesomeIcon
                  icon={faSuitcaseMedical} size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input4}
                placeholder="Treatment Given"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('Treatment_Given', text)}
                value={patientDetails.Treatment_Given}
              />
            </View>
            <View style={styles.inputContainer1}>
              <Feather name="file-text" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Previous Medical History"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('Course_in_Hospital', text)}
                value={patientDetails.Course_in_Hospital}
              />
            </View>
            <View style={styles.headerContainer}>
          <Text style={styles.portalText}>Create Patient Portal Credentials</Text>
           </View>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="gray"
                onChangeText={text => handleInputChange('username', text)}
                value={patientDetails.username}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry={!passwordVisible}
                onChangeText={text => handleInputChange('password', text)}
                value={patientDetails.password}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Feather
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button1, styles.backButton1]}
              onPress={() => setCurrentPage(1)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            </View>
        )}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Patient Details Added Successfully!</Text>
              <Button title="OK" onPress={hideModal} />
            </View>
          </View>
        </Modal>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01, // Dynamic margin
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: width * 0.03, // Dynamic padding
    flex: 1,
    marginRight: width * 0.01, // Dynamic margin
  },
  datePickerText: {
    marginLeft: width * 0.02, // Dynamic margin
  },
  headerContainer: {
    backgroundColor: '#007bff',
    padding: height * 0.02, // Dynamic padding
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: height * 0.02, // Dynamic margin
  },
  topBar: {
    width: width,
    top:-height * 0.02,
    height: height * 0.13,
    borderRadius: 35,
    backgroundColor: '#9FCBFB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    marginBottom:height * 0.0005,
  },
  backButton: {
    marginRight: width * 0.05,
    marginTop: height * 0.05,
    backgroundColor:'#9FCBFB',
    width:width * 0.2,
  },
  backButton1: {
    marginRight: width * 0.05,
    marginTop: height * 0.02,
    backgroundColor:'#9FCBFB',
    width:width * 0.2,
  },
  topBarText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'black',
    marginTop: height * 0.05,
    left: width * 0.02,
  },
  portalText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: 'white',
    marginTop: height * 0.03,
    marginBottom: height * 0.03,
    left: width * 0.02,
  },
  container: {
    flex: 1,
    width: width,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  frame: {
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop:-height * 0.04,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015, // Dynamic margin
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: width * 0.03, // Dynamic padding
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02, // Dynamic margin
    height: height * 0.1, // Dynamic height
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: width * 0.03, // Dynamic padding
  },
  input: {
    flex: 1,
    fontSize: width * 0.035,
    color:'#cc',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  genderLabel: {
    fontSize: width * 0.04, // Dynamic font size
    marginRight: width * 0.02, // Dynamic margin
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.02, // Dynamic padding
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: width * 0.01, // Dynamic margin
  },
  genderButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderButtonText: {
    color: '#000',
    marginLeft: width * 0.02, // Dynamic margin
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: height * 0.015,
    width:width * 0.4,
    marginLeft:width * 0.18,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.005, // Dynamic margin
  },
  button1: {
    backgroundColor: '#007AFF',
    padding: height * 0.01,
    width:width * 0.5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.005, // Dynamic margin
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045, // Dynamic font size
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: height * 0.05, // Dynamic padding
    borderRadius: 10,
    alignItems: 'center',
  },
  input1: {
    backgroundColor: '#D9D9D9',
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.03, 
    width: width * 0.49, 
    height: width * 0.5, 
    overflow: 'hidden',
    marginLeft: width * 0.15,
  },
  passwordInputContainer:{
    alignItems:'flex-start',
    width:'100%',
  },
  icon: {
    marginRight: 10,
  },

  passwordToggle: {
    marginLeft: 10,
  },
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddPatientDetails;
