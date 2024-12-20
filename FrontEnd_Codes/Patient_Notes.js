import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';  // Importing config

const { width, height } = Dimensions.get('window');

const PatientNotes = ({ route }) => {
    const { p_id } = route.params;
    const [patientNotes, setPatientNotes] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchPatientNotes();
    }, []);

    const fetchPatientNotes = async () => {
        try {
            const response = await fetch(`${config.patientNotesUrl}?p_id=${p_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch patient notes');
            }
            const data = await response.json();
            const filteredNotes = data.filter(note => note.Notes_Index && note.notes_date);
            setPatientNotes(filteredNotes);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddPatientNote = async () => {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const newNote = { Notes_Index: `Patient Note ${patientNotes.length + 1}`, notes_date: currentDate };

            const response = await fetch(config.patientNotesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, ...newNote }),
            });

            if (!response.ok) {
                throw new Error('Failed to add new patient note');
            }

            const data = await response.json();
            if (data.notes_date) {
                setPatientNotes([...patientNotes, data]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add new patient note');
        }
    };

    const handleDeletePatientNote = async (note) => {
        try {
            const response = await fetch(config.patientNotesUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, Notes_Index: note.Notes_Index }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete patient note');
            }

            setPatientNotes(patientNotes.filter(item => item.Notes_Index !== note.Notes_Index));
        } catch (error) {
            console.error(error);
        }
    };

    const navigateToNoteDetails = (note) => {
        navigation.navigate('PatientNoteDetails', { p_id, note });
    };

    if (!patientNotes || !Array.isArray(patientNotes)) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patient Notes</Text>
            <View style={styles.notesList}>
                {patientNotes.map((note, index) => (
                    <View key={index} style={styles.noteItem}>
                        <TouchableOpacity
                            onPress={() => navigateToNoteDetails(note)}
                            style={styles.noteTextContainer}
                        >
                            <Text style={styles.noteIndex}>{note.Notes_Index}</Text>
                            <Text style={styles.noteDate}>{`Date: ${note.notes_date}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeletePatientNote(note)}
                            style={styles.deleteButton}
                        >
                            <Feather name="trash-2" size={width * 0.045} color="#ff0000" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddPatientNote}>
                <Text style={styles.buttonText}>Add New Patient Note</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: width * 0.045,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.025,
    },
    notesList: {
        width: '100%',
        borderRadius: width * 0.025,
        marginBottom: height * 0.05,
    },
    noteItem: {
        padding: width * 0.025,
        borderWidth: 2,
        borderColor: '#90c1F9',
        borderRadius: width * 0.025,
        marginBottom: height * 0.0125,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#90c1F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: height * 0.0025 },
        shadowOpacity: 0.2,
        shadowRadius: width * 0.025,
        elevation: 5,
    },
    noteTextContainer: {
        flex: 1,
        marginRight: width * 0.025,
    },
    noteIndex: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    noteDate: {
        fontSize: width * 0.033,
        color: '#555',
    },
    deleteButton: {
        padding: width * 0.0125,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        borderRadius: width * 0.025,
    },
    buttonText: {
        fontSize: width * 0.04,
        color: '#ffffff',
    },
});

export default PatientNotes;
