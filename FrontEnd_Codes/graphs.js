import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import config from './config';

const screenWidth = Dimensions.get('window').width - 20;
const { width, height } = Dimensions.get('window');

const Graph = ({ route, navigation }) => {
    const { p_id } = route.params;
    const [parameter, setParameter] = useState('BP');
    const [timeRange, setTimeRange] = useState('1 month');
    const [labels, setLabels] = useState([]);
    const [systolicValues, setSystolicValues] = useState([]);
    const [diastolicValues, setDiastolicValues] = useState([]);
    const [parameterModalVisible, setParameterModalVisible] = useState(false);
    const [timeRangeModalVisible, setTimeRangeModalVisible] = useState(false);

    const parameterMapping = {
        'BP': 'bp',
        'Sugar': 'sugar',
        'Hemoglobin': 'cbc_hemoglobin',
        'Platelet Count': 'cbc_platelet_count',
        'TLC Count': 'cbc_tlc_count',
        'Urea': 'rft_urea',
        'Creatinine': 'rft_creatinine',
        'Total Bilirubin': 'lft_total_bilirubin',
        'Direct Bilirubin': 'lft_direct_bilirubin',
        'Total Protein': 'lft_total_protein',
        'AST': 'lft_ast',
        'ALT': 'lft_alt',
        'ALP': 'lft_alp',
        'Albumin': 'lft_albumin',
        'Sodium': 'electrolytes_sodium',
        'Potassium': 'electrolytes_potassium',
        'Bicarbonate': 'electrolytes_bicarbonate',
        'PT/INR': 'pt_inr',
        'APTT': 'aptt'
    };

    useEffect(() => {
        fetchData();
    }, [parameter, timeRange]);

    const fetchData = async () => {
        try {
            const columnParam = parameterMapping[parameter];
            const response = await fetch(`${config.baseUrl}/graphs.php?p_id=${p_id}&parameter=${columnParam}&time_range=${timeRange}`);
            const result = await response.json();

            console.log('Fetched data:', result);

            if (result.error) {
                Alert.alert('Error', result.error);
                setLabels([]);
                setSystolicValues([]);
                setDiastolicValues([]);
            } else {
                transformDataForChart(result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data');
            setLabels([]);
            setSystolicValues([]);
            setDiastolicValues([]);
        }
    };

    const transformDataForChart = (data) => {
        const transformedLabels = data.map(item => new Date(item.date).toLocaleDateString() || 'N/A');

        if (parameter === 'BP') {
            const systolic = data.map(item => {
                const bp = item.bp ? item.bp.split('/') : ['0', '0'];
                return parseFloat(bp[0]) || 0;
            });
            const diastolic = data.map(item => {
                const bp = item.bp ? item.bp.split('/') : ['0', '0'];
                return parseFloat(bp[1]) || 0;
            });
            setSystolicValues(systolic);
            setDiastolicValues(diastolic);
        } else {
            const values = data.map(item => parseFloat(item[parameterMapping[parameter]]) || 0);
            setSystolicValues(values);
        }

        setLabels(transformedLabels);
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={28} color="black" style={styles.backButton}/>
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Graph Reports</Text>
            </View>
            <ScrollView>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Select Parameter</Text>
                    <TouchableOpacity onPress={() => setParameterModalVisible(true)} style={styles.pickerWrapper}>
                        <Text style={styles.pickerText}>{parameter}</Text>
                    </TouchableOpacity>
                    <Modal visible={parameterModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Picker
                                    selectedValue={parameter}
                                    onValueChange={(itemValue) => {
                                        setParameter(itemValue);
                                        setParameterModalVisible(false);
                                    }}
                                >
                                    {Object.keys(parameterMapping).map(label => (
                                        <Picker.Item key={label} label={label} value={label} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Select Time Range</Text>
                    <TouchableOpacity onPress={() => setTimeRangeModalVisible(true)} style={styles.pickerWrapper}>
                        <Text style={styles.pickerText}>{timeRange}</Text>
                    </TouchableOpacity>
                    <Modal visible={timeRangeModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Picker
                                    selectedValue={timeRange}
                                    onValueChange={(itemValue) => {
                                        setTimeRange(itemValue);
                                        setTimeRangeModalVisible(false);
                                    }}
                                >
                                    <Picker.Item label="Last 7 Days" value="7 days" />
                                    <Picker.Item label="This Month" value="1 month" />
                                    <Picker.Item label="Last 3 Months" value="3 months" />
                                    <Picker.Item label="Last 6 Months" value="6 months" />
                                </Picker>
                            </View>
                        </View>
                    </Modal>
                </View>
                {labels.length && (systolicValues.length || diastolicValues.length) ? (
                    <ScrollView horizontal>
                        <LineChart
                            data={{
                                labels: labels,
                                datasets: parameter === 'BP' ? [
                                    {
                                        data: systolicValues,
                                        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, 
                                        label: 'Systolic',
                                    },
                                    {
                                        data: diastolicValues,
                                        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, 
                                        label: 'Diastolic',
                                    }
                                ] : [
                                    {
                                        data: systolicValues,
                                    }
                                ],
                            }}
                            width={labels.length * 110} 
                            height={250}
                            chartConfig={{
                                backgroundColor: '#90c1F9',
                                backgroundGradientFrom: '#90c1F9',
                                backgroundGradientTo: '#90c1F9',
                                decimalPlaces: 2, 
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 20,
                                },
                                propsForDots: {
                                    r: '6',
                                    strokeWidth: '3',
                                    stroke: '#ffa726',
                                },
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft:20,
                            }}
                        />
                    </ScrollView>
                ) : (
                    <Text>                       No data available for the selected range.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        width: width,
        height: height * 0.15, 
        backgroundColor: '#9FCBFB',
        borderRadius: width * 0.1, 
        marginBottom: height * 0.05, 
    },
    topBarTitle: {
        fontSize: width * 0.055, 
        fontWeight: 'bold',
        color: 'black',
        top: height * 0.07, 
        marginLeft: width * 0.32, 
    },
    backButton: {
        top: height * 0.1, 
        left: width * 0.05, 
    },
    pickerContainer: {
        marginBottom: height * 0.02, 
        paddingHorizontal: width * 0.05, 
    },
    label: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        marginBottom: height * 0.01,
    },
    pickerWrapper: {
        borderWidth: 2,
        height: height * 0.06, 
        borderColor: '#90c1F9',
        borderRadius: width * 0.02, 
        paddingVertical: height * 0.012, 
        justifyContent: 'center',
        paddingHorizontal: width * 0.04, 
    },
    pickerText: {
        fontSize: width * 0.04, 
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `rgba(0, 0, 0, 0.5)`,
    },
    modalContent: {
        width: width * 0.8, 
        backgroundColor: 'white',
        borderRadius: width * 0.025, 
        padding: width * 0.05, 
    },
});

export default Graph;
