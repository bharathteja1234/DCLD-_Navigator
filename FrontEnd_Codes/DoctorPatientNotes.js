import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import config from './config';

const { width, height } = Dimensions.get('window');

const DoctorPatientNotes = ({ route }) => {
  const { p_id } = route.params;
  const [patientNotes, setPatientNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPatientNotes();
  }, []);

  const fetchPatientNotes = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/Patient_Notes.php?p_id=${p_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient notes');
      }
      const data = await response.json();
      const filteredNotes = data.filter(note => note.Notes_Index && note.notes_date);
      setPatientNotes(filteredNotes);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch patient notes');
    } finally {
      setLoading(false);
    }
  };

  const navigateToNoteDetails = (note) => {
    navigation.navigate('DoctorPatientNotesDetails', { p_id, note });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#90c1F9" />
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  if (patientNotes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noNotesText}>No notes available</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Notes</Text>
      <ScrollView contentContainerStyle={styles.notesList}>
        {patientNotes.map((note, index) => (
          <View key={index} style={index % 2 === 0 ? styles.noteItemLeft : styles.noteItemRight}>
            <TouchableOpacity
              style={styles.noteDetailsButton}
              onPress={() => navigateToNoteDetails(note)}
            >
              <FontAwesomeIcon icon={faNoteSticky} size={26} style={styles.icon} />
              <Text style={styles.noteText}>{note.Notes_Index}</Text>
              <Text style={styles.dateText}>{`Date: ${note.notes_date}`}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    paddingTop: height * 0.025,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginTop: height * 0.11,
    marginBottom: height * 0.025,
  },
  notesList: {
    width: '100%',
    paddingBottom: height * 0.025,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.025,
  },
  noteDetailsButton: {
    padding: height * 0.0125,
    borderWidth: 2,
    borderColor: '#90c1F9',
    borderRadius: height * 0.0125,
    marginBottom: height * 0.0125,
    backgroundColor: '#90c1F9',
    shadowColor: 'black',
    shadowOffset: { width: width * 0.0075, height: height * 0.00625 },
    shadowOpacity: 1,
    shadowRadius: height * 0.005,
    elevation: 10,
    width: '100%',
    alignItems: 'center',
  },
  noteItemLeft: {
    width: '48%',
    marginBottom: height * 0.0125,
  },
  noteItemRight: {
    width: '48%',
    marginBottom: height * 0.0125,
    alignSelf: 'flex-end',
  },
  icon: {
    marginBottom: height * 0.00625,
  },
  noteText: {
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  dateText: {
    fontSize: width * 0.03,
    marginTop: height * 0.00625,
    textAlign: 'center',
    color:'#555',
  },
});

export default DoctorPatientNotes;
