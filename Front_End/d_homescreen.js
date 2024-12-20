import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Dimensions, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import LogoutNotification from './LogoutNotification';
import RNFS from "react-native-fs";
import axios from "axios";
import config from './config';

const { width, height } = Dimensions.get('window');

const downloadCSV = async () => {
  const url = `${config.baseUrl}/data.php`;

  const timestamp = new Date().toISOString().replace(/[-T:.]/g, "_");
  const fileName = `patient_data_${timestamp}.csv`;
  const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "text", 
    });

    console.log(response.data);
    await RNFS.writeFile(filePath, response.data, "utf8");
    Alert.alert("Download Complete", `File saved to ${filePath}`);
  } catch (error) {
    Alert.alert("Error", "Failed to download the file.");
    console.error(error);
  }
};

const DoctorDashboard = ({ navigation, route }) => {
  const { dId } = route.params;
  const [isQuestionnaireVisible, setIsQuestionnaireVisible] = useState(false);
  const [isLogoutNotificationVisible, setIsLogoutNotificationVisible] = useState(false);
  const slideAnimation = new Animated.Value(0);

  const toggleQuestionnaire = () => {
    setIsQuestionnaireVisible(!isQuestionnaireVisible);
    Animated.timing(slideAnimation, {
      toValue: isQuestionnaireVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleAddPatient = () => {
    navigation.navigate('AddPatientDetails', { dId });
  };

  const handleViewModifyPatient = () => {
    navigation.navigate('PatientSearch', { dId });
  };

  const handleLogout = () => {
    setIsLogoutNotificationVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutNotificationVisible(false);
    navigation.navigate('DoctorLogin');
  };

  const handleCancelLogout = () => {
    setIsLogoutNotificationVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.colorBox} />
      <FastImage
        source={{ uri: 'https://cdn.prod.website-files.com/611ed5a217b32b056e5477ec/644988ded773ee3739f6691a_Online%20Medical%20Checkup%20(1).gif' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Dashboard</Text>
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => {
          navigation.navigate('DoctorProfile', { dId });
        }}
      >
        <Feather name="user" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
          <Feather name="user-plus" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add New Patient Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleViewModifyPatient}>
          <Feather name="edit" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View/Modify Patient Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QuestionScreen', { dId })}>
          <Feather name="clipboard" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Questionnaires</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('DoctorNotification', { dId })}>
        <Feather name="bell" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('DoctorDashboard', { dId })}>
          <Feather name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PatientSearch', { dId })}>
          <Feather name="search" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={downloadCSV}>
          <Feather name="download-cloud" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {isLogoutNotificationVisible && (
        <View style={styles.modalOverlay}>
          <Modal transparent={true} visible={isLogoutNotificationVisible} animationType="fade">
            <LogoutNotification
              visible={isLogoutNotificationVisible}
              onConfirm={handleConfirmLogout}
              onCancel={handleCancelLogout}
            />
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.1,
  },
  colorBox: {
    width: '115%',
    height: height * 0.14,
    backgroundColor: '#9FCBFB',
    borderRadius: 40,
    marginBottom: -50,
    top: -height * 0.11,
  },
  logo: {
    width: width * 0.9,
    height: height * 0.4,
    marginTop: height * 0.01,
    marginBottom: -60,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    top: -height * 0.45,
  },
  profileIcon: {
    top: -height * 0.51,
    left: -width * 0.41,
  },
  buttonContainer: {
    width: '90%',
    padding: width * 0.04,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: height * 0.015,
  },
  buttonIcon: {
    marginRight: width * 0.025,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  notificationIcon: {
    position: 'absolute',
    top: -height * 0.021,
    right: width * 0.07,
  },
  iconContainer: {
    width: '100%',
    padding: width * 0.04,
    height: height * 0.08,
    borderRadius: 20,
    backgroundColor: '#9FCBFB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    position: 'absolute',
    bottom: height * 0.02,
    marginBottom: height * 0.01,
  },
  modalOverlay: {
    position: 'absolute',
    top: -height * 0.75,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoctorDashboard;
