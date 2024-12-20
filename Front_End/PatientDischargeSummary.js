import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from './config';

const { width, height } = Dimensions.get('window');

const PatientDischargeSummary = ({ route }) => {
    const { p_id } = route.params;
    const [dischargeSummaries, setDischargeSummaries] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchDischargeSummaries();
    }, []);

    const fetchDischargeSummaries = async () => {
        try {
            const response = await fetch(`${config.dischargeSummaryUrl}?p_id=${p_id}`);  // Using config.dischargeSummaryUrl
            if (!response.ok) {
                throw new Error('Failed to fetch discharge summaries');
            }
            const data = await response.json();
            // Filter out summaries where date is not null
            const filteredSummaries = data.filter(summary => summary.date !== null);
            setDischargeSummaries(filteredSummaries);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summaries');
        }
    };

    const navigateToSummaryDetails = (summary) => {
        navigation.navigate('SummaryDetails', { p_id, summary });
    };

    const renderSummaryItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigateToSummaryDetails(item)}
            style={styles.summaryItem}
        >
            <FontAwesomeIcon icon={faNotesMedical} size={40} style={styles.icon} />
            <View style={styles.textContainer}>
                <Text style={styles.summaryText}>{item.discharge_summary}</Text>
                <Text style={styles.summaryText1}>{`Date: ${item.date}`}</Text>
            </View>
        </TouchableOpacity>
    );

    if (!dischargeSummaries || !Array.isArray(dischargeSummaries)) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
        <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack() }>
          <Ionicons name="chevron-back-outline" size={30} color="black" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Discharge Summaries</Text>
      </View>
            <FlatList
                data={dischargeSummaries}
                renderItem={renderSummaryItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.summaryList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingTop: height * 0.02,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.03,
        width: '100%',
        backgroundColor: '#9FCBFB',
        height: height * 0.15,
        marginTop: -height * 0.03,
        borderBottomWidth: 1,
        marginBottom: height * 0.05,
        borderRadius: width * 0.075,
        borderBottomColor: '#ccc',
    },
    backButton: {
        top: height * 0.03,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginTop: height * 0.05,
        left: width * 0.15,
    },
    summaryList: {
        width: '90%',
        justifyContent: 'space-between',
    },
    summaryItem: {
        padding: width * 0.03,
        borderWidth: 2,
        borderColor: '#90c1F9',
        borderRadius: width * 0.025,
        marginBottom: height * 0.03,
        backgroundColor: '#90c1F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: width * 0.05,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: height*0.19,
        marginHorizontal: '2.5%',
        height: height * 0.15,
    },
    icon: {
        marginTop: height * 0.05,
        marginRight: width * 0.03,
        right: -width * 0.1,
        top: -height * 0.05,
    },
    textContainer: {
        flex: 0,
        alignContent: 'center',
        justifyContent: 'center',
    },
    summaryText: {
        fontSize: width * 0.04,
        left: -width * 0.1,
        marginTop: height * 0.07,
    },
    summaryText1: {
        fontSize: width * 0.035,
        color: '#555',
        left: -width * 0.1,
    },
});

export default PatientDischargeSummary;
