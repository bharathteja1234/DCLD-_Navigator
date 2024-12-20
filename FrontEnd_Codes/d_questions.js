import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import Notification from './options';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from './config';

const { width, height } = Dimensions.get('window');

const QuestionScreen = () => {
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedType, setSelectedType] = useState('General Symptoms');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(config.doctorQuestionsUrl);
      const text = await response.text();
      console.log('Raw response:', text);
      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (!data || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format');
      }
      setQuestions(data.questions);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setFetchError('Failed to fetch questions. Please try again.');
    }
  };

  const handleAddQuestion = async () => {
    try {
      const response = await fetch(config.doctorQuestionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion, type: selectedType }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (responseData.success) {
        setNewQuestion('');
        fetchQuestions();
        setNotification('Question added successfully!');
      } else {
        throw new Error(responseData.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      setNotification('Error adding question.');
    }
  };

  const handleEditQuestion = (id) => {
    const index = questions.findIndex((question) => question.id === id);
    if (index !== -1) {
      setEditingIndex(index);
      setEditedQuestion(questions[index].question);
      setSelectedType(questions[index].type);
      setIsModalVisible(true);
    }
  };

  const saveEditedQuestion = async () => {
    try {
      const response = await fetch(config.doctorQuestionsUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: questions[editingIndex].id, question: editedQuestion, type: selectedType }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        fetchQuestions();
        setIsModalVisible(false);
        setNotification('Question edited successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error editing question:', error);
      setNotification('Error editing question.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch(config.doctorQuestionsUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        fetchQuestions();
        setNotification('Question deleted successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setNotification('Error deleting question.');
    }
  };

  const handlePickerDone = () => {
    setIsPickerModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack() }>
          <Ionicons name="chevron-back-outline" size={30} color="black"  style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Questions</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {notification ? <Notification message={notification} onClose={() => setNotification('')} /> : null}
        <View style={styles.box}>
          <View style={styles.box}>
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>Enter New Question</Text>
  </View>
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="Enter here....."
      placeholderTextColor="gray"
      value={newQuestion}
      onChangeText={(text) => setNewQuestion(text)}
    />
    <TouchableOpacity style={styles.pickerButton} onPress={() => setIsPickerModalVisible(true)}>
      <Text style={styles.pickerButtonText}>{selectedType}</Text>
    </TouchableOpacity>
  </View>
  <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
    <Text style={styles.addButtonText}>Add Question</Text>
  </TouchableOpacity>
</View>


        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.SCell}>S.No</Text>
            <Text style={styles.headerCell1}>Type</Text>
            <Text style={styles.headerCell}>Question</Text>
            <Text style={styles.headerCell2}>Actions</Text>
          </View>
          {questions.map((question, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cell1, { borderBottomWidth: questions.length === index + 1 ? 0 : 1 }]}>{index + 1}</Text>
              <Text style={[styles.cell2, { borderBottomWidth: questions.length === index + 1 ? 0 : 1 }]}>{question.type}</Text>
              <Text style={[styles.cell, { borderBottomWidth: questions.length === index + 1 ? 0 : 1 }]}>{question.question}</Text>
              <View style={styles.actionCell}>
                <TouchableOpacity onPress={() => handleEditQuestion(question.id)}>
                  <Feather name="edit-2" size={23} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteQuestion(question.id)}>
                  <Feather name="x-square" size={23} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.modalInput}
              value={editedQuestion}
              onChangeText={(text) => setEditedQuestion(text)}
            />
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
            >
              <Picker.Item label="General Symptoms" value="General Symptoms" />
              <Picker.Item label="Danger Symptoms" value="Danger Symptoms" />
              <Picker.Item label="Regular Monitoring" value="Regular Monitoring" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={saveEditedQuestion}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.back} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.backButtonText}>{'<< Back'}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal visible={isPickerModalVisible} transparent={true} animationType="fade">
          <View style={styles.pickerModalContainer}>
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(itemValue) => setSelectedType(itemValue)}
              >
                <Picker.Item label="General Symptoms" value="General Symptoms" />
                <Picker.Item label="Danger Symptoms" value="Danger Symptoms" />
                <Picker.Item label="Regular Monitoring" value="Regular Monitoring" />
              </Picker>
              <TouchableOpacity style={styles.pickerModalButton} onPress={handlePickerDone}>
                <Text style={styles.pickerModalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.025,
    backgroundColor: '#9FCBFB',
    height: height * 0.12,
    borderBottomWidth: 1,
    borderRadius: width * 0.08,
    borderBottomColor: '#ccc',
  },
  backButton: {
    top: height * 0.025,
  },
  topBarTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginLeft: width * 0.28,
    top: height * 0.025,
  },
  scrollViewContainer: {
    padding: width * 0.05,
  },
  box: {
    marginBottom: height * 0.025,
  },
  headerContainer: {
    backgroundColor: '#007bff',
    padding: width * 0.025,
    borderTopLeftRadius: width * 0.0125,
    borderTopRightRadius: width * 0.0125,
    marginTop: height * 0.03,
  },
  headerText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: width * 0.025,
    borderBottomLeftRadius: width * 0.0125,
    borderBottomRightRadius: width * 0.0125,
    borderWidth: 2,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.005,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: width * 0.025,
    borderRadius: width * 0.0125,
    marginTop: height * 0.025, 
    marginBottom: -height * 0.03, 
    alignSelf: 'center', // Center the button
  },
  input: {
    flex: 1,
    height: height * 0.05,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.0125,
    paddingHorizontal: width * 0.025,
  },
  pickerButton: {
    backgroundColor: '#007bff',
    padding: width * 0.025,
    borderRadius: width * 0.0125,
    marginLeft: width * 0.025,
  },
  pickerButtonText: {
    color: 'white',
  },
  
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: width * 0.0125,
    marginBottom: height * 0.025,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.005,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: width * 0.025,
  },
  headerCell: {
    flex: 1,
    paddingVertical: height * 0.015,
    fontWeight: 'bold',
    borderRightWidth: 2,
    justifyContent: 'center',
    borderColor: '#ccc',
  },
  headerCell2: {
    paddingVertical: height * 0.015,
    fontWeight: 'bold',
    borderRightWidth: 2,
    width: width * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
  },
  headerCell1: {
    paddingVertical: height * 0.015,
    justifyContent: 'center',
    width: width * 0.22,
    fontWeight: 'bold',
    borderRightWidth: 2,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    paddingHorizontal: width * 0.025,
    paddingVertical: 0,
  },
  cell: {
    flex: 1,
    paddingVertical: height * 0.015,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

  cell1: {
    paddingVertical: height * 0.015,
    borderRightWidth: 1,
    borderColor: '#ccc',
    width: width * 0.09,
    alignItems: 'center',
  },
  cell2: {
    paddingVertical: height * 0.015,
    borderRightWidth: 1,
    borderColor: '#ccc',
    width: width * 0.22,
    alignContent: 'center',
    alignItems: 'center',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: height * 0.01,
    width: width * 0.15,
  },
  editButton: {
    marginRight: width * 0.0125,
    marginLeft: width * 0.05,
    marginTop: height * 0.0375,
  },
  deleteButton: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  modalInput: {
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: width * 0.0125,
    height: height * 0.06,
    paddingHorizontal: width * 0.025,
    marginBottom: height * 0.0125,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: width * 0.025,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.0125,
    marginTop: height * 0.0125,
    height: height * 0.045,
    width: width * 0.15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  back: {
    marginTop: height * 0.025,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: width * 0.0425,
  },
  errorText: {
    color: 'red',
    marginTop: height * 0.0125,
  },
  SCell: {
    paddingVertical: height * 0.015,
    fontWeight: 'bold',
    borderRightWidth: 2,
    borderColor: '#ccc',
    width: width * 0.09,
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: width * 0.025,
    padding: width * 0.05,
  },
  pickerModalButton: {
    backgroundColor: '#007bff',
    padding: width * 0.025,
    borderRadius: width * 0.0125,
    alignItems: 'center',
    marginTop: height * 0.025,
  },
  pickerModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QuestionScreen;
