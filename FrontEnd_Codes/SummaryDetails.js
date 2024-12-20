import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import config from './config';  // Importing config file

const { width, height } = Dimensions.get('window');

const SummaryDetails = ({ route }) => {
    const { p_id, summary } = route.params;
    const [dischargeSummary, setDischargeSummary] = useState('');
    const [isSummaryFound, setIsSummaryFound] = useState(false);

    useEffect(() => {
        fetchDischargeSummary();
    }, []);

    const fetchDischargeSummary = async () => {
        try {
            const response = await fetch(`${config.summaryUrl}?p_id=${p_id}&discharge_summary=${summary.discharge_summary}&date=${summary.date}`);
            if (!response.ok) {
                throw new Error('Failed to fetch discharge summary');
            }
            const data = await response.json();
            if (data && data.summary) {
                setDischargeSummary(data.summary);
                setIsSummaryFound(true);
            } else {
                setIsSummaryFound(false);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summary');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Discharge Summary</Text>
            <ScrollView style={styles.scrollView}>
                {isSummaryFound ? (
                    <Text style={styles.summaryText}>{dischargeSummary}</Text>
                ) : (
                    <Text style={styles.noticeText}>No discharge summary found.</Text>
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
    title: {
        fontSize: width * 0.055,
        fontWeight: 'bold',
        marginTop: height * 0.1,
        marginBottom: height * 0.03,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    summaryText: {
        fontSize: width * 0.043,
        lineHeight: width * 0.07,
        textAlign: 'justify',
        padding: width * 0.03,
        borderColor: '#007bff',
        borderWidth: width * 0.007,
        borderRadius: width * 0.025,
    },
    noticeText: {
        fontSize: width * 0.05,
        color: '#ff0000',
        textAlign: 'center',
    },
});
export default SummaryDetails;
