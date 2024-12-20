import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import config from './config';

const { width, height } = Dimensions.get('window');

const Pqns = () => {
  const route = useRoute();
  const { p_id } = route.params;

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(config.doctorQuestionsUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format');
      }
      setQuestions(data.questions);
      const defaultResponses = data.questions.map((question) => ({
        questions: question.question,
        type: question.type,
        response: '',
        response_time: new Date().toISOString(),
      }));
      setResponses(defaultResponses);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setFetchError('Failed to fetch questions. Please try again.');
    }
  };

  const handleResponseChange = useCallback((questionText, value) => {
    const updatedResponses = responses.map((response) =>
      response.questions === questionText ? { ...response, response: value } : response
    );
    setResponses(updatedResponses);
  }, [responses]);

  const generateQuestionsNo = () => {
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${randomNumber}`;
  };

  const handleSubmit = async () => {
    const allFilled = responses.every((response) => response.response !== '');
    if (!allFilled) {
      setModalMessage('Please fill out all required fields.');
      setModalVisible(true);
      return;
    }

    const questionsNo = generateQuestionsNo();
    const updatedResponses = responses.map(r => ({ ...r, Questions_No: questionsNo }));

    const notificationDate = new Date().toISOString();

    const dangerSymptoms = updatedResponses
      .filter((response) => response.type === 'Danger Symptoms' && response.response === 'Yes')
      .map((response) => {
        const match = response.questions.match(/(.+?)\?/);
        return match ? match[1] : response.questions;
      });

    const notification = dangerSymptoms.length > 0 ? dangerSymptoms.join(' and ') + '!!!' : '';

    try {
      const response = await fetch(config.patientQuestionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id, responses: updatedResponses, notification, notificationDate }),
      });
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (responseText.startsWith('success')) {
        setModalMessage('Form submitted successfully!');
        setResponses(responses.map((response) => ({ ...response, response: '' })));
      } else {
        setModalMessage('Form submitted successfully!');
      }
      setModalVisible(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setModalMessage('Error submitting responses. Please try again.');
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const renderQuestions = (type) => {
    return questions.filter((question) => question.type === type).map((question) => (
      <View key={question.id} style={styles.questionItem}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.radioButtonsContainer}>
          <TouchableOpacity
            style={[styles.radioButton, responses.find((r) => r.questions === question.question)?.response === 'Yes' && styles.radioButtonSelected]}
            onPress={() => handleResponseChange(question.question, 'Yes')}
          >
            <Text style={styles.radioButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, responses.find((r) => r.questions === question.question)?.response === 'No' && styles.radioButtonSelected]}
            onPress={() => handleResponseChange(question.question, 'No')}
          >
            <Text style={styles.radioButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: height * 0.1 }}>
      {fetchError && <Text style={styles.errorText}>{fetchError}</Text>}

      <Text style={styles.sectionHeading1}>General Symptoms</Text>
      <View style={styles.questionBox}>{renderQuestions('General Symptoms')}</View>

      <Text style={styles.sectionHeadingDanger}>Danger Symptoms</Text>
      <View style={styles.questionBox1}>{renderQuestions('Danger Symptoms')}</View>

      <Text style={styles.sectionHeading}>Regular Monitoring</Text>
      <View style={styles.questionBox}>{renderQuestions('Regular Monitoring')}</View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
  },
  sectionHeading: {
    fontWeight: 'bold',
    fontSize: width * 0.05,
    marginTop: height * 0.015,
    marginBottom: height * 0.015,
  },
  sectionHeading1: {
    fontWeight: 'bold',
    fontSize: width * 0.05,
    marginTop: height * 0.08,
    marginBottom: height * 0.015,
  },
  sectionHeadingDanger: {
    fontWeight: 'bold',
    fontSize: width * 0.05,
    color: 'red',
    marginTop: height * 0.015,
    marginBottom: height * 0.015,
  },
  questionBox: {
    borderWidth: width * 0.0075,
    borderColor: '#80BBFA',
    borderRadius: 10,
    padding: width * 0.035,
    marginBottom: height * 0.015,
  },
  questionBox1: {
    borderWidth: width * 0.0075,
    borderColor: '#DE5050',
    borderRadius: 10,
    padding: width * 0.035,
    marginBottom: height * 0.015,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  questionText: {
    flex: 1,
    fontSize: width * 0.04,
  },
  radioButtonsContainer: {
    flexDirection: 'row',
  },
  radioButton: {
    backgroundColor: '#D9D9D9',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderRadius: 5,
    marginLeft: width * 0.025,
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
  },
  radioButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: width * 0.1,
    paddingVertical: height * 0.015,
    borderRadius: 5,
    marginTop: height * 0.025,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: width * 0.075,
    borderRadius: 10,
    width: '80%',
  },
  modalMessage: {
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.015,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});

export default Pqns;
