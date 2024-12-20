import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import config from './config';  // Importing config

const { width, height } = Dimensions.get('window');

const PatientNoteDetails = ({ route }) => {
    const { p_id, note } = route.params;
    const [noteContent, setNoteContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isNoteFound, setIsNoteFound] = useState(false);
    const navigation = useNavigation();
 
    useEffect(() => {
        console.log('Received ', p_id, note);
        fetchPatientNote();
    }, [p_id, note]);

    const fetchPatientNote = async () => {
        try {
            console.log('Fetching note for:', p_id, note);
            const response = await fetch(`${config.patientNotesDetailUrl}?p_id=${p_id}&Notes_Index=${note.Notes_Index}&notes_date=${note.notes_date}`);
            console.log('Fetch response status:', response.status);
            const data = await response.json();
            console.log('Fetch response data:', data);

            if (data && data.Notes) {
                setNoteContent(data.Notes);
                setIsNoteFound(true);
            } else {
                setIsNoteFound(false);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'Failed to fetch patient note');
        }
    };

    const handleSave = async () => {
        try {
            console.log('Saving note for:', p_id, note, noteContent);
            const response = await fetch(config.patientNotesDetailUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, Notes_Index: note.Notes_Index, Notes: noteContent, notes_date: note.notes_date }),
            });

            console.log('Save response status:', response.status);
            const data = await response.json();
            console.log('Save response data:', data);

            if (data.success) {
                Alert.alert('Success', 'Patient note saved successfully');
                setIsEditing(false);
                setIsNoteFound(true);
            } else {
                Alert.alert('Error', 'Failed to save patient note');
            }
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save patient note');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Feather name="edit-3" size={24} color="black" style={styles.titleIcon} />
                <Text style={styles.title}>Patient Note Details</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {isEditing || !isNoteFound ? (
                    <TextInput
                        style={styles.textArea}
                        value={noteContent}
                        onChangeText={setNoteContent}
                        multiline
                        placeholder="Enter patient note"
                        placeholderTextColor="gray"
                    />
                ) : (
                    <Text style={styles.noteText}>{noteContent}</Text>
                )}
                {isNoteFound && !isEditing && (
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <FontAwesome name="pencil-square-o" size={30} color="white" beat />
                    </TouchableOpacity>
                )}
                {(isEditing || !isNoteFound) && (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05, // Responsive padding
        backgroundColor: '#ffffff',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.1, // Responsive margin top
        marginBottom: height * 0.03, // Responsive margin bottom
    },
    titleIcon: {
        marginRight: width * 0.03, // Responsive margin right
    },
    title: {
        fontSize: width * 0.06, // Responsive font size
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    noteText: {
        fontSize: width * 0.045, // Responsive font size
        lineHeight: width * 0.07, // Responsive line height
        textAlign: 'justify',
    },
    textArea: {
        height: height * 0.7, // Responsive height
        justifyContent: 'flex-start',
        textAlignVertical: 'top',
        borderColor: '#cccccc',
        borderWidth: 4,
        padding: width * 0.03, // Responsive padding
        fontSize: width * 0.05, // Responsive font size
        textAlign: 'justify',
        marginBottom: height * 0.03, // Responsive margin bottom
    },
    editButton: {
        backgroundColor: '#007bff',
        paddingVertical: height * 0.015, // Responsive padding vertical
        paddingHorizontal: width * 0.05, // Responsive padding horizontal
        borderRadius: width * 0.15, // Responsive border radius
        alignItems: 'center',
        marginTop: height * 0.03, // Responsive margin top
        justifyContent: 'center',
        marginVertical: height * 0.015, // Responsive margin vertical
        width: width * 0.2, // Responsive width
        height: width * 0.2, // Responsive height (circle button)
        left: width * 0.35, // Responsive left
    },
    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: height * 0.015, // Responsive padding vertical
        paddingHorizontal: width * 0.05, // Responsive padding horizontal
        borderRadius: 10,
        alignItems: 'center',
        width: width * 0.3,
        left: width * 0.29,
    },
    buttonText: {
        fontSize: width * 0.05,
        color: '#ffffff',
    },
});

export default PatientNoteDetails;
