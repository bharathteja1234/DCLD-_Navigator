import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import config from './config';

const { width, height } = Dimensions.get('window');

const Summary = ({ route }) => {
    const { p_id, discharge_summary, date } = route.params;
    const [formData, setFormData] = useState({
        summary: '',
        bp: '',
        sugar: '',
        cbc_hemoglobin: '',
        cbc_platelet_count: '',
        cbc_tlc_count: '',
        rft_urea: '',
        rft_creatinine: '',
        lft_total_bilirubin: '',
        lft_direct_bilirubin: '',
        lft_total_protein: '',
        lft_ast: '',
        lft_alt: '',
        lft_alp: '',
        lft_albumin: '',
        electrolytes_sodium: '',
        electrolytes_potassium: '',
        electrolytes_bicarbonate: '',
        pt_inr: '',
        aptt: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Received Parameters:', { p_id, discharge_summary, date });
        fetchDischargeSummary();
    }, []);

    const fetchDischargeSummary = async () => {
        try {
            const response = await fetch(`${config.baseUrl}/summary.php?p_id=${p_id}&date=${encodeURIComponent(date)}&discharge_summary=${encodeURIComponent(discharge_summary)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch discharge summary');
            }

            const data = await response.json();
            if (data) {
                setFormData({
                    summary: data.summary || '',
                    bp: data.bp || '',
                    sugar: data.sugar || '',
                    cbc_hemoglobin: data.cbc_hemoglobin || '',
                    cbc_platelet_count: data.cbc_platelet_count || '',
                    cbc_tlc_count: data.cbc_tlc_count || '',
                    rft_urea: data.rft_urea || '',
                    rft_creatinine: data.rft_creatinine || '',
                    lft_total_bilirubin: data.lft_total_bilirubin || '',
                    lft_direct_bilirubin: data.lft_direct_bilirubin || '',
                    lft_total_protein: data.lft_total_protein || '',
                    lft_ast: data.lft_ast || '',
                    lft_alt: data.lft_alt || '',
                    lft_alp: data.lft_alp || '',
                    lft_albumin: data.lft_albumin || '',
                    electrolytes_sodium: data.electrolytes_sodium || '',
                    electrolytes_potassium: data.electrolytes_potassium || '',
                    electrolytes_bicarbonate: data.electrolytes_bicarbonate || '',
                    pt_inr: data.pt_inr || '',
                    aptt: data.aptt || ''
                });
            } else {
                Alert.alert('Notice', 'Discharge summary not found. Please add a summary.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch discharge summary');
        }
    };

    const handleSave = async () => {
        try {
            const formattedData = {
                p_id,
                date,
                discharge_summary,
                summary: formData.summary,
                bp: formData.bp,
                sugar: formData.sugar,
                cbc: {
                    hemoglobin: formData.cbc_hemoglobin,
                    plateletCount: formData.cbc_platelet_count,
                    tlcCount: formData.cbc_tlc_count
                },
                rft: {
                    urea: formData.rft_urea,
                    creatinine: formData.rft_creatinine
                },
                lft: {
                    totalBilirubin: formData.lft_total_bilirubin,
                    directBilirubin: formData.lft_direct_bilirubin,
                    totalProtein: formData.lft_total_protein,
                    AST: formData.lft_ast,
                    ALT: formData.lft_alt,
                    ALP: formData.lft_alp,
                    albumin: formData.lft_albumin
                },
                electrolytes: {
                    sodium: formData.electrolytes_sodium,
                    potassium: formData.electrolytes_potassium,
                    bicarbonate: formData.electrolytes_bicarbonate,
                },
                ptInr: formData.pt_inr,
                aptt: formData.aptt
            };

            console.log('Formatted Data:', JSON.stringify(formattedData, null, 2));

            // Corrected the fetch URL
            const response = await fetch(`${config.baseUrl}/summary.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            console.log('Server Response:', response);

            const data = await response.json();
            console.log('Response Data:', data);

            if (data.success) {
                Alert.alert('Success', 'Data saved successfully');
            } else {
                Alert.alert('Error', 'Failed to save data');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to save data');
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const renderPageContent = () => {
        switch (currentPage) {
            case 1:
                return (
                    <View>
                        <Text style={styles.label}>BP</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.bp}
                            onChangeText={(value) => handleInputChange('bp', value)}
                            placeholder="Enter BP"
                            placeholderTextColor="gray"
                        />
                        <Text style={styles.label}>Sugar</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.sugar}
                            onChangeText={(value) => handleInputChange('sugar', value)}
                            placeholder="Enter Sugar"
                            placeholderTextColor="gray"
                        />

                        <Text style={styles.label}>Complete Blood Count (CBC)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.cbc_hemoglobin}
                            onChangeText={(value) => handleInputChange('cbc_hemoglobin', value)}
                            placeholder="Hemoglobin"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.cbc_platelet_count}
                            onChangeText={(value) => handleInputChange('cbc_platelet_count', value)}
                            placeholder="Platelet Count"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.cbc_tlc_count}
                            onChangeText={(value) => handleInputChange('cbc_tlc_count', value)}
                            placeholder="TLC Count"
                            placeholderTextColor="gray"
                        />

                        <Text style={styles.label}>Renal Function Test (RFT)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.rft_urea}
                            onChangeText={(value) => handleInputChange('rft_urea', value)}
                            placeholder="Urea"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.rft_creatinine}
                            onChangeText={(value) => handleInputChange('rft_creatinine', value)}
                            placeholder="Creatinine"
                            placeholderTextColor="gray"
                        />

                        <Text style={styles.label}>Liver Function Test (LFT)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.lft_total_bilirubin}
                            onChangeText={(value) => handleInputChange('lft_total_bilirubin', value)}
                            placeholder="Total Bilirubin"
                            placeholderTextColor="gray"
                        />

                    </View>
                );
            case 2:
                return (
                    <View>
                    <TextInput
                            style={styles.input}
                            value={formData.lft_direct_bilirubin}
                            onChangeText={(value) => handleInputChange('lft_direct_bilirubin', value)}
                            placeholder="Direct Bilirubin"
                            placeholderTextColor="gray"
                        />
                    <TextInput
                            style={styles.input}
                            value={formData.lft_total_protein}
                            onChangeText={(value) => handleInputChange('lft_total_protein', value)}
                            placeholder="Total Protein"
                            placeholderTextColor="gray"
                        />
                    <TextInput
                            style={styles.input}
                            value={formData.lft_ast}
                            onChangeText={(value) => handleInputChange('lft_ast', value)}
                            placeholder="AST"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.lft_alt}
                            onChangeText={(value) => handleInputChange('lft_alt', value)}
                            placeholder="ALT"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.lft_alp}
                            onChangeText={(value) => handleInputChange('lft_alp', value)}
                            placeholder="ALP"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.lft_albumin}
                            onChangeText={(value) => handleInputChange('lft_albumin', value)}
                            placeholder="Albumin"
                            placeholderTextColor="gray"
                        />

                        <Text style={styles.label}>Electrolytes</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.electrolytes_sodium}
                            onChangeText={(value) => handleInputChange('electrolytes_sodium', value)}
                            placeholder="Sodium"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.electrolytes_potassium}
                            onChangeText={(value) => handleInputChange('electrolytes_potassium', value)}
                            placeholder="Potassium"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.electrolytes_bicarbonate}
                            onChangeText={(value) => handleInputChange('electrolytes_bicarbonate', value)}
                            placeholder="Bicarbonate"
                            placeholderTextColor="gray"
                        />

                    </View>
                );
            case 3:
                return (
                    <View>
                    <Text style={styles.label}>Coagulation Profile</Text>
                    <TextInput
                            style={styles.input}
                            value={formData.pt_inr}
                            onChangeText={(value) => handleInputChange('pt_inr', value)}
                            placeholder="PT/INR"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.aptt}
                            onChangeText={(value) => handleInputChange('aptt', value)}
                            placeholder="APTT"
                            placeholderTextColor="gray"
                        />
                        <Text style={styles.label}>Discharge Summary</Text>
                        <TextInput
                            style={styles.textArea}
                            value={formData.summary}
                            onChangeText={(value) => handleInputChange('summary', value)}
                            placeholder="Enter Discharge Summary......"
                            placeholderTextColor="gray"
                            multiline
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={30} color="black" style={styles.back} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Discharge Summary</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {renderPageContent()}
                <View style={styles.buttonContainer}>
                    {currentPage > 1 && (
                        <TouchableOpacity onPress={() => setCurrentPage(currentPage - 1)} style={styles.button}>
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>
                    )}
                    {currentPage < 3 && (
                        <TouchableOpacity onPress={() => setCurrentPage(currentPage + 1)} style={styles.button}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    )}
                    {currentPage === 3 && (
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: width * 0.05,
        backgroundColor: '#fff',
    },
    topBar: {
        backgroundColor: '#9FCBFB',
        height: height * 0.14,
        flexDirection: 'row',
        borderRadius: height * 0.04,
        alignItems: 'center',
        paddingHorizontal: width * 0.025,
    },
    back: {
        top: height * 0.025,
    },
    titleIcon: {
        top: height * 0.04,
    },
    topBarTitle: {
        color: 'black',
        fontSize: width * 0.05,
        marginLeft: width * 0.025,
        left: width * 0.18,
        top: height * 0.025,
        fontWeight: 'bold',
    },
    label: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginBottom: height * 0.025,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: height * 0.06,
        borderColor: '#ccc',
        borderWidth: 2,
        marginBottom: height * 0.025,
        paddingHorizontal: width * 0.025,
        borderRadius: height * 0.0125,
    },
    textArea: {
        height: height * 0.26,
        borderColor: '#ccc',
        borderWidth: 2,
        marginBottom: height * 0.025,
        paddingHorizontal: width * 0.025,
        borderRadius: height * 0.0125,
        textAlignVertical: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.025,
    },
    button: {
        backgroundColor: '#9FCBFB',
        padding: height * 0.015,
        borderRadius: height * 0.0125,
        width: width * 0.23,
        marginHorizontal: width * 0.025,
    },
    buttonText: {
        color: 'black',
        fontSize: width * 0.04,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: height * 0.015,
        width: width * 0.18,
        borderRadius: height * 0.0125,
        marginHorizontal: width * 0.025,
        alignSelf: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: width * 0.04,
        textAlign: 'center',
    },
});

export default Summary;
