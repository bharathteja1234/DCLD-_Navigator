import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config'; // Import your config file

const { width, height } = Dimensions.get('window');

const DoctorQuestionaireResponses = ({ route, navigation }) => {
  const { p_id, response_time, Questions_No } = route.params;
  const [responses, setResponses] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/DoctorQuestionaireResponses.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id, response_time, Questions_No }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to fetch responses');
      }
      setResponses(responseData.responses);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setFetchError('Failed to fetch responses. Please try again.');
    }
  };

  const renderResponses = (type) => {
    return responses
      .filter((response) => response.type === type)
      .map((response, index) => (
        <View key={index} style={styles.responseContainer}>
          <Text style={styles.questionText}>{response.questions}</Text>
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response.response}</Text>
          </View>
        </View>
      ));
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.sectionHeading}>General Symptoms</Text>
            <View style={styles.questionBox}>{renderResponses('General Symptoms')}</View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.sectionHeading}>Danger Symptoms</Text>
            <View style={styles.questionBox1}>{renderResponses('Danger Symptoms')}</View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.sectionHeading}>Regular Monitoring</Text>
            <View style={styles.questionBox}>{renderResponses('Regular Monitoring')}</View>
          </>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (fetchError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{fetchError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Questionnaire Responses</Text>
      </View>
      <View style={styles.centerContent}>
        <ScrollView contentContainerStyle={styles.content}>
          {renderContent()}
        </ScrollView>
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentStep === 1} style={[styles.navButton, currentStep === 1 && styles.disabledButton]}>
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} disabled={currentStep === 3} style={[styles.navButton, currentStep === 3 && styles.disabledButton]}>
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    width: '100%',
    height: height * 0.14,  // 15% of the screen height
    backgroundColor: '#90C1F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.025,  // 2.5% of the screen width
    borderBottomLeftRadius: width * 0.075,  // 7.5% of the screen width
    borderBottomRightRadius: width * 0.075,  // 7.5% of the screen width
  },
  backButton: {
    position: 'absolute',
    left: width * 0.04,  // 4% of the screen width
    top: height * 0.09,  // 8.75% of the screen height
  },
  topBarTitle: {
    fontSize: width * 0.05,  // 5% of the screen width
    top: height * 0.0375,  // 3.75% of the screen height
    fontWeight: 'bold',
    color: 'black',
  },
  centerContent: {
    flex: 1,
    paddingHorizontal: width * 0.05,  // 5% of the screen width
  },
  content: {
    paddingVertical: height * 0.025,  // 2.5% of the screen height
  },
  sectionHeading: {
    fontWeight: 'bold',
    fontSize: width * 0.05,  // 5% of the screen width
    marginTop: height * 0.0125,  // 1.25% of the screen height
    marginBottom: height * 0.0125,  // 1.25% of the screen height
    textAlign: 'center',
  },
  questionBox: {
    borderWidth: 3,
    borderColor: '#80BBFA',
    borderRadius: width * 0.025,  // 2.5% of the screen width
    padding: width * 0.025,  // 2.5% of the screen width
    marginBottom: height * 0.025,  // 2.5% of the screen height
  },
  questionBox1: {
    borderWidth: 3,
    borderColor: 'red',
    borderRadius: width * 0.025,  // 2.5% of the screen width
    padding: width * 0.025,  // 2.5% of the screen width
    marginBottom: height * 0.025,  // 2.5% of the screen height
  },
  responseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.025,  // 2.5% of the screen height
    padding: width * 0.025,  // 2.5% of the screen width
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: width * 0.0125,  // 1.25% of the screen width
  },
  questionText: {
    fontWeight: 'bold',
    fontSize: width * 0.045,  // 4.5% of the screen width
    flex: 1,
  },
  responseBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: width * 0.0125,  // 1.25% of the screen width
    width: width * 0.1,  // 10% of the screen width
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    padding: width * 0.0125,  // 1.25% of the screen width
    marginLeft: width * 0.025,  // 2.5% of the screen width
  },
  responseText: {
    fontSize: width * 0.04,  // 4% of the screen width
    color: 'black',
  },
  errorText: {
    color: 'red',
    marginTop: height * 0.0125,  // 1.25% of the screen height
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,  // 5% of the screen width
    paddingVertical: height * 0.0125,  // 1.25% of the screen height
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  navButton: {
    backgroundColor: '#007bff',
    padding: height * 0.01875,  // 1.875% of the screen height
    borderRadius: width * 0.025,  // 2.5% of the screen width
    flex: 1,
    marginHorizontal: width * 0.025,  // 2.5% of the screen width
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default DoctorQuestionaireResponses;
