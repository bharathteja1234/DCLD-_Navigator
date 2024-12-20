import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';  // Import the config file

const { width, height } = Dimensions.get('window');

const PatientSearch = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noDetailsFound, setNoDetailsFound] = useState(false);

  const handleEnter = async () => {
    if (!searchQuery.trim()) return; // Prevent empty search

    setLoading(true);
    setNoDetailsFound(false);
    setUserDetails([]); // Clear previous user details

    try {
      const response = await fetch(`${config.searchUrl}?p_id=${searchQuery}&name=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const filteredData = data.filter(record => record.p_id || record.name);
        setUserDetails(filteredData);
        if (filteredData.length === 0) { setNoDetailsFound(true); }
      } else {
        setNoDetailsFound(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = (p_id) => {
    if (p_id) {
      console.log(`Navigating to EditPatientDetailsScreen with p_id: ${p_id}`);
      navigation.navigate('EditPatientDetailsScreen', { p_id });
    } else {
      console.log('p_id is not available.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.leftButton} onPress={handleBack}>
          <Feather name="chevron-left" size={height * 0.04} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Patient Search</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search by Patient ID or Name"
        placeholderTextColor="gray"
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      <TouchableOpacity style={styles.button} onPress={handleEnter} disabled={loading}>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {noDetailsFound && <Text style={styles.noDetailsFound}>No details found</Text>}
      <View style={styles.scrollViewContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {userDetails.length > 0 && userDetails.map((user, index) => {
            const imageUrl = `${config.baseUrl}/${user.image}`;
            console.log('Image URL:', imageUrl);

            return (
              <View key={index} style={styles.userDetailsContainer}>
                <View style={styles.detailsAndImageContainer}>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.userDetailsTitle}>Patient Details:</Text>
                    {user.name && (
                      <View style={styles.userDetailsItem}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.detailText}>{user.name}</Text>
                      </View>
                    )}
                    {user.age && (
                      <View style={styles.userDetailsItem}>
                        <Text style={styles.label}>Age:</Text>
                        <Text style={styles.detailText}>{user.age}</Text>
                      </View>
                    )}
                    {user.disease && (
                      <View style={styles.userDetailsItem}>
                        <Text style={styles.label}>Disease:</Text>
                        <Text style={styles.detailText}>{user.disease}</Text>
                      </View>
                    )}
                    {user.gender && (
                      <View style={styles.userDetailsItem}>
                        <Text style={styles.label}>Gender:</Text>
                        <Text style={styles.detailText}>{user.gender}</Text>
                      </View>
                    )}
                    {user.admittedOn && (
                      <View style={styles.userDetailsItem}>
                        <Text style={styles.label}>Admitted On:</Text>
                        <Text style={styles.detailText}>{user.admittedOn}</Text>
                      </View>
                    )}
                    {user.dischargeOn && (
                      <View style={styles.userDetailsItem}>
                        <Text style={styles.label}>Discharged On:</Text>
                        <Text style={styles.detailText}>{user.dischargeOn}</Text>
                      </View>
                    )}
                    {user.contactNo && (
                      <View style={styles.userDetailsItem}>
                        <Text style={styles.label}>Phone No:</Text>
                        <Text style={styles.detailText}>{user.contactNo}</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => handleNext(user.p_id)}
                    >
                      <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.patientImage}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
          </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    width: width,
    height: height * 0.14,
    top:-height * 0.02,
    backgroundColor: '#9FCBFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    borderRadius: height * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: height * 0.06,
  },
  leftButton: {
    width: height * 0.04,
    height: height * 0.04,
  },
  topBarTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'black',
    right: width * 0.25,
  },
  input: {
    width: '80%',
    height: height * 0.06,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: height * 0.02,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.02,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: height * 0.015,
    borderRadius: height * 0.02,
    alignItems: 'center',
    marginVertical: height * 0.01,
    width: width * 0.25,
    alignSelf: 'center',
  },
  button1: {
    backgroundColor: '#007bff',
    padding: height * 0.015,
    borderRadius: height * 0.02,
    alignItems: 'center',
    marginVertical: height * 0.01,
    width: width * 0.25,
    left: width * 0.18,
    alignSelf: 'center',
    marginTop: height * 0.01,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: height * 0.1,
  },
  userDetailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: height * 0.015,
    marginVertical: height * 0.01,
    width: width * 0.9,
    padding: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsAndImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  userDetailsTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
  },
  userDetailsItem: {
    flexDirection: 'row',
    marginBottom: height * 0.015,
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.035,
    marginRight: width * 0.02,
  },
  detailText: {
    flex: 1,
    fontSize: width * 0.032,
  },
  noDetailsFound: {
    fontSize: width * 0.04,
    color: 'red',
    marginTop: height * 0.02,
    textAlign: 'center',
  },
  patientImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.4 / 2,
    borderWidth: 3,
    top: -height * 0.05,
    right: width * 0.0045,
    borderColor: '#007bff',
  },
});

export default PatientSearch;
