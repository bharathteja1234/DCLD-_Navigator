import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Feather from 'react-native-vector-icons/Feather';
import config from './config'; // Import your config file

const { width, height } = Dimensions.get('window');

const QuestionnaireResponses = ({ route, navigation }) => {
  const { p_id } = route.params; // Assuming p_id is passed via route params
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/questionnaire_responses.php?p_id=${p_id}`);
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        console.log('Fetched responses:', response.data); // Debug log
        setResponses(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch questionnaire assessment responses');
      }
    };

    fetchResponses();
  }, [p_id]);

  const extractDateFromResponse = (response) => {
    if (!response) {return 'No Date';}
    const dateMatch = response.match(/Date: (\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    console.log('Extracted date:', dateMatch ? dateMatch[1] : 'No Date'); // Debug log
    return dateMatch ? dateMatch[1] : 'No Date';
  };

  const removeDateFromResponse = (response) => {
    if (!response) return '';
    const cleanedResponse = response.replace(/Date: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/, '').trim();
    console.log('Cleaned response:', cleanedResponse); // Debug log
    return cleanedResponse;
  };

  const handleButtonClick = (response_time, Questions_No) => {
    console.log('Navigating with params:', { p_id, response_time, Questions_No }); // Debug log
    navigation.navigate('DoctorQuestionaireResponses', { p_id, response_time, Questions_No });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Questionnaire Responses</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {responses.map((responseObj, index) => {
          const response = responseObj.response;
          const response_time = extractDateFromResponse(response);
          const responseWithoutDate = `Questionnaire Response: ${index + 1}`;
          const Questions_No = responseObj.Questions_No; // Ensure this field is present in your data
          console.log('Response without date:', responseWithoutDate); // Debug log
          console.log('Formatted date:', response_time); // Debug log
          console.log('Questions_No:', Questions_No); // Debug log
          return (
            <View key={index} style={index % 2 === 0 ? styles.buttonItemLeft : styles.buttonItemRight}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleButtonClick(response_time, Questions_No)}
              >
                <Feather name="message-square" size={28} style={styles.icon} />
                <Text style={styles.buttonText}>{responseWithoutDate}</Text>
                <Text style={styles.dateText}>{response_time !== 'No Date' ? response_time : 'No Date'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    width: '100%',
    height: height * 0.15,  // 15% of the screen height
    backgroundColor: '#90C1F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.025,  // 2.5% of the screen width
    marginBottom: height * 0.025,  // 2.5% of the screen height
    borderRadius: width * 0.075,  // 7.5% of the screen width
  },
  backButton: {
    position: 'absolute',
    left: width * 0.04,  // 4% of the screen width
    top: height * 0.075,  // 7.5% of the screen height
  },
  topBarTitle: {
    fontSize: width * 0.05,  // 5% of the screen width
    fontWeight: 'bold',
    color: 'black',
    top: height * 0.025,  // 2.5% of the screen height
  },
  title: {
    fontSize: width * 0.06,  // 6% of the screen width
    fontWeight: 'bold',
    marginTop: height * 0.025,  // 2.5% of the screen height
    marginBottom: height * 0.025,  // 2.5% of the screen height
    color: '#333',
    textAlign: 'center',
  },
  scrollContainer: {
    width: '100%',
    paddingBottom: height * 0.025,  // 2.5% of the screen height
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.025,  // 2.5% of the screen width
  },
  buttonContainer: {
    padding: width * 0.025,  // 2.5% of the screen width
    borderWidth: 2,
    borderColor: '#90C1F9',
    borderRadius: width * 0.025,  // 2.5% of the screen width
    marginBottom: height * 0.005,  // 2.5% of the screen height
    backgroundColor: '#90C1F9',
    shadowColor: 'black',
    shadowOffset: { width: width * 0.0075, height: height * 0.00625 },  // Shadow with 0.75% width, 0.625% height
    shadowOpacity: 1,
    shadowRadius: width * 0.01,  // 1% of the screen width
    elevation: 10,
    alignItems: 'center',
    width: width * 0.45,  // 45% of the screen width
  },
  buttonItemLeft: {
    width: '48%',
    marginBottom: height * 0.025,  // 2.5% of the screen height
  },
  buttonItemRight: {
    width: '48%',
    marginBottom: height * 0.025,  // 2.5% of the screen height
    alignSelf: 'flex-end',
  },
  icon: {
    marginBottom: height * 0.01,  // 1% of the screen height
  },
  buttonText: {
    color: 'black',
    fontSize: width * 0.04,  // 4% of the screen width
    textAlign: 'center',
  },
  dateText: {
    color: '#555',
    fontSize: width * 0.035,  // 3% of the screen width
    marginTop: height * 0.005,  // 1.25% of the screen height
    textAlign: 'center',
  },
});

export default QuestionnaireResponses;
