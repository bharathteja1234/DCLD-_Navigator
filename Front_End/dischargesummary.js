import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';

const { width, height } = Dimensions.get('window');

const DischargeSummary = ({ route }) => {
    const { p_id } = route.params;
    const [dischargeSummaries, setDischargeSummaries] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchDischargeSummaries();
    }, []);

    const fetchDischargeSummaries = async () => {
        try {
            const response = await fetch(`${config.baseUrl}/dischargesummary.php?p_id=${p_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch discharge summaries');
            }
            const data = await response.json();
            const filteredSummaries = data.filter(summary => summary.date !== null);
            setDischargeSummaries(filteredSummaries);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summaries');
        }
    };

    const handleAddDischargeSummary = async () => {
        try {
            const currentDate = new Date().toISOString().split('T')[0]; 
            const newSummary = { discharge_summary: `Discharge Summary ${dischargeSummaries.length + 1}`, date: currentDate };

            const response = await fetch(`${config.baseUrl}/dischargesummary.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, ...newSummary }),
            });

            if (!response.ok) {
                throw new Error('Failed to add new discharge summary');
            }

            const data = await response.json();
            if (data.date !== null) {
                setDischargeSummaries([...dischargeSummaries, data]);
            } else {
                Alert.alert('Error', 'Failed to add new discharge summary: Invalid date');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteDischargeSummary = async (summary) => {
        try {
            const response = await fetch(`${config.baseUrl}/dischargesummary.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ p_id, discharge_summary: summary }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete discharge summary');
            }

            setDischargeSummaries(dischargeSummaries.filter(ds => ds.discharge_summary !== summary));
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete discharge summary');
        }
    };

    const navigateToSummaryDetails = (summary) => {
        const params = {
            p_id,
            discharge_summary: summary.discharge_summary,
            date: summary.date,
        };
        console.log('Navigating with params:', params);
        navigation.navigate('Summary', params);
    };

    if (!dischargeSummaries || !Array.isArray(dischargeSummaries)) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Discharge Summaries</Text>
            <ScrollView contentContainerStyle={styles.summaryList}>
                {dischargeSummaries.map((summary, index) => (
                    <View key={index} style={index % 2 === 0 ? styles.summaryItemLeft : styles.summaryItemRight}>
                        <TouchableOpacity
                            style={styles.summaryDetailsButton}
                            onPress={() => navigateToSummaryDetails(summary)}
                        >
                            <Text style={styles.summaryText}>{summary.discharge_summary}</Text>
                            <Text style={styles.dateText}>{`Date: ${summary.date}`}</Text>
                            <TouchableOpacity
                            onPress={() => handleDeleteDischargeSummary(summary.discharge_summary)}
                        >
                            <Feather name="trash-2" size={20} color="red" style={styles.icon}/>
                        </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleAddDischargeSummary}>
                <Text style={styles.buttonText}>Add New Discharge Summary</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: height * 0.03,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginTop: height * 0.12,
        marginBottom: height * 0.03,
        left: width * 0.25,
    },
    icon:
    {
        left:width*0.35,
        top:height*0.015,
    },
    summaryList: {
        width: '100%',
        paddingBottom: height * 0.03,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.03,
    },
    summaryDetailsButton: {
        padding: height * 0.015,
        borderWidth: 2,
        borderColor: '#90c1F9',
        borderRadius: width * 0.025,
        marginBottom: height * 0.015,
        backgroundColor: '#90c1F9',
        shadowColor: 'black',
        shadowOffset: { width: width * 0.008, height: height * 0.01 },
        shadowOpacity: 1,
        shadowRadius: width * 0.025,
        elevation: 10,
        width: '100%',
        height: height * 0.11,
    },
    summaryItemLeft: {
        width: '48%',
        marginBottom: height * 0.015,
    },
    summaryItemRight: {
        width: '48%',
        marginBottom: height * 0.015,
        alignSelf: 'flex-end',
    },
    deleteButton: {
        marginTop: height * 0.015,
        width: width * 0.15,
        alignItems: 'baseline',
        top: -height * 0.14,
        left: width * 0.4,
        marginBottom: height * 0.06,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderRadius: width * 0.025,
        marginBottom: height * 0.045,
        width: width * 0.7,
        alignItems: 'center',
        left: width * 0.15,
    },
    buttonText: {
        fontSize: width * 0.04,
        color: '#ffffff',
    },
    summaryText: {
        fontSize: width * 0.039,
        textAlign: 'center',
    },
    dateText: {
        fontSize: width * 0.035,
        marginTop: height * 0.007,
        textAlign: 'center',
        color: '#666',
    },
});

export default DischargeSummary;
