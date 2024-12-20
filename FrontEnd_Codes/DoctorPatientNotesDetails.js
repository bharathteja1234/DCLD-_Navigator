import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';

const { width, height } = Dimensions.get('window');

const DoctorPatientNoteDetails = ({ route }) => {
    const { p_id, note } = route.params;
    const [noteContent, setNoteContent] = useState('');
    const [isNoteFound, setIsNoteFound] = useState(null); // null as initial state to indicate loading
    const navigation = useNavigation();

    useEffect(() => {
        fetchPatientNote();
    }, []);

    const fetchPatientNote = async () => {
        try {
            const response = await fetch(`${config.baseUrl}/PatientNotesDetail.php?p_id=${p_id}&Notes_Index=${note.Notes_Index}&notes_date=${note.notes_date}`);
            const data = await response.json();

            if (data && data.Notes) {
                setNoteContent(data.Notes);
                setIsNoteFound(true);
            } else {
                setIsNoteFound(false);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'Failed to fetch patient note');
            setIsNoteFound(false);
        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Feather name="edit-3" size={24} color="black" style={styles.titleIcon} />
                <Text style={styles.title}>Patient Note Details</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {isNoteFound === true ? (
                    <Text style={styles.noteText}>{noteContent}</Text>
                ) : isNoteFound === false ? (
                    <Text style={styles.noNoteText}>No notes found</Text>
                ) : (
                    <Text>Loading...</Text>
                )}
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
        backgroundColor: '#ffffff',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.0875,
        marginBottom: height * 0.025,
    },
    titleIcon: {
        marginRight: width * 0.025,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    noteText: {
        fontSize: width * 0.045,
        lineHeight: height * 0.03,
        textAlign: 'justify',
    },
    noNoteText: {
        fontSize: width * 0.045,
        color: 'red',
        textAlign: 'center',
        marginTop: height * 0.02,
    },
    textArea: {
        height: height * 0.4,
        borderColor: '#cccccc',
        borderWidth: 2,
        padding: width * 0.025,
        fontSize: width * 0.045,
        textAlign: 'justify',
        marginBottom: height * 0.025,
    },
    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: height * 0.015,
        borderRadius: height * 0.0125,
        alignItems: 'center',
        alignSelf: 'center',
        width: width * 0.4,
    },
    buttonText: {
        fontSize: width * 0.045,
        color: '#ffffff',
    },
});


export default DoctorPatientNoteDetails;
