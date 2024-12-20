import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';

const { width, height } = Dimensions.get('window');

const DailyAssessResponses = ({ route, navigation }) => {
  const { p_id } = route.params;
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/dailyassess_responses.php?p_id=${p_id}`);
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        console.log('Fetched responses:', response.data);
        setResponses(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch daily assessment responses');
      }
    };

    fetchResponses();
  }, [p_id]);

  const extractDateFromResponse = (response) => {
    if (!response) {return 'No Date';}
    const dateMatch = response.match(/Date: (\d{4}-\d{2}-\d{2})/);
    console.log('Extracted date:', dateMatch ? dateMatch[1] : 'No Date'); 
    return dateMatch ? dateMatch[1] : 'No Date';
  };

  const formatDate = (dateString) => {
    console.log('Formatting date:', dateString);
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toISOString().split('T')[0];
  };

  const removeDateFromResponse = (response) => {
    if (!response) {return '';}
    const cleanedResponse = response.replace(/Date: \d{4}-\d{2}-\d{2}/, '').trim();
    console.log('Cleaned response:', cleanedResponse);
    return cleanedResponse;
  };

  const handleButtonClick = (assessment_date) => {
    navigation.navigate('AssessmentDetail', { p_id, assessment_date });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Daily Assessment Responses</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {responses.map((responseObj, index) => {
          const response = responseObj.response;
          const assessment_date = extractDateFromResponse(response);
          const formattedDate = assessment_date !== 'No Date' ? formatDate(assessment_date) : 'No Date';
          const responseWithoutDate = removeDateFromResponse(response);
          console.log('Response without date:', responseWithoutDate);
          console.log('Formatted date:', formattedDate);
          return (
            <View key={index} style={index % 2 === 0 ? styles.buttonItemLeft : styles.buttonItemRight}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleButtonClick(assessment_date)}
              >
                <FontAwesomeIcon icon={faComment} size={30} style={styles.icon} />
                <Text style={styles.buttonText}>{responseWithoutDate}</Text>
                <Text style={styles.dateText}>Date: {formattedDate}</Text>
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
    height: height * 0.15,
    backgroundColor: '#90C1F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.025,
    marginBottom: height * 0.025,
    borderRadius: width * 0.075,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.04,
    top: height * 0.085,
  },
  topBarTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'black',
    top: height * 0.025,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginTop: height * 0.025,
    marginBottom: height * 0.025,
    color: '#333',
    textAlign: 'center',
  },
  scrollContainer: {
    width: '100%',
    paddingBottom: height * 0.025,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.025,
  },
  buttonContainer: {
    padding: width * 0.025,
    borderWidth: 2,
    borderColor: '#90C1F9',
    borderRadius: width * 0.025,
    marginBottom: height * 0.0125,
    backgroundColor: '#90C1F9',
    shadowColor: 'black',
    shadowOffset: { width: width * 0.0075, height: height * 0.00625 },
    shadowOpacity: 1,
    shadowRadius: height * 0.005,
    elevation: 10,
    alignItems: 'center',
    width: width * 0.45,
  },
  buttonItemLeft: {
    width: '48%',
    marginBottom: height * 0.0125,
  },
  buttonItemRight: {
    width: '48%',
    marginBottom: height * 0.0125,
    alignSelf: 'flex-end',
  },
  icon: {
    marginBottom: height * 0.00625,
  },
  buttonText: {
    color: 'black',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  dateText: {
    color: '#555',
    fontSize: width * 0.034,
    marginTop: height * 0.00625,
    textAlign: 'center',
  },
});


export default DailyAssessResponses;
