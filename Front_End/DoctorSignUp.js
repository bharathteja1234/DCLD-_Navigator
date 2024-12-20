import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import config from './config'; // Import your config file

const { width, height } = Dimensions.get('window');

const DoctorSignUp = () => {
  const navigation = useNavigation();
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    gender: '',
    speciality: '',
    contactNo: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [reenterPasswordVisible, setReenterPasswordVisible] = useState(false);

  const signUpApiUrl = `${config.baseUrl}/DoctorSignup.php`;

  const handleSignUp = () => {
    if (!doctorName || !doctorId || !username || !password || !passwordMatch) {
      showAlert('Please fill in all required fields and ensure passwords match.');
      return;
    }

    fetch(signUpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doctorName,
        doctorId,
        username,
        password,
        ...patientDetails,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Sign Up Response:', data);
        if (data.status) {
          setModalVisible(true);
        } else {
          showAlert('Sign up failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Sign Up Error:', error);
        showAlert('Sign up failed. Please try again later.');
      });
  };

  const showAlert = (message) => {
    Alert.alert('Status', message);
  };

  const handleReenterPasswordChange = (text) => {
    setReenterPassword(text);
    setPasswordMatch(password === text);
  };

  const handleInputChange = (field, value) => {
    setPatientDetails({
      ...patientDetails,
      [field]: value,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.arrowContainer} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Sign Up</Text>
      </View>
      <View style={styles.elevatedContainer}>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Doctor ID"
            placeholderTextColor="gray"
            onChangeText={text => setDoctorId(text)}
            value={doctorId}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Doctor Name"
            placeholderTextColor="gray"
            onChangeText={text => setDoctorName(text)}
            value={doctorName}
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
            <FontAwesome
              name="male"
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
            <FontAwesome
              name="female"
              size={20}
              color={patientDetails.gender === 'Female' ? '#fff' : '#000'}
            />
            <Text style={[
              styles.genderButtonText,
              patientDetails.gender === 'Female' && styles.genderButtonTextSelected,
            ]}> Female</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="medical-services" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Speciality"
            placeholderTextColor="gray"
            onChangeText={text => handleInputChange('speciality', text)}
            value={patientDetails.speciality}
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
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="gray"
            onChangeText={text => setUsername(text)}
            value={username}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Feather name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            placeholderTextColor="gray"
            onChangeText={handleReenterPasswordChange}
            value={reenterPassword}
            secureTextEntry={!reenterPasswordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setReenterPasswordVisible(!reenterPasswordVisible)}
          >
            <Feather name={reenterPasswordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        {!passwordMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sign up successful, please log in now</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate('DoctorLogin');
              }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    width: '100%',
    height: height * 0.15,
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.04,
  },
  arrowContainer: {
    position: 'absolute',
    left: width * 0.025,
    top: height * 0.077,
  },
  topBarTitle: {
    color: 'black',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    top: height * 0.02,
    flex: 1,
  },
  elevatedContainer: {
    flex: 1,
    margin: width * 0.05,
    padding: width * 0.05,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.025,
    paddingVertical: height * 0.007,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    marginLeft: width * 0.025,
    height: height * 0.045,
    color:'grey',
  },
  icon: {
    marginRight: width * 0.015,
  },
  eyeIcon: {
    marginLeft: width * 0.015,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  genderLabel: {
    fontSize: width * 0.04,
    marginRight: width * 0.025,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
    marginHorizontal: width * 0.0125,
  },
  genderButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  genderButtonText: {
    marginLeft: width * 0.0125,
    fontSize: width * 0.04,
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: height * 0.01,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  modalView: {
    margin: width * 0.05,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.08,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: height * 0.02,
    textAlign: 'center',
    fontSize: width * 0.04,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
});

export default DoctorSignUp;
