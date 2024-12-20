import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import SuccessModal from './custom';
import ErrorModal from './modal';
import Feather from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import config from './config';  // Importing config

const { width, height } = Dimensions.get('window');

const DailyAssessmentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { p_id } = route.params;

  useEffect(() => {
    console.log('Received p_id:', p_id);
  }, [p_id]);

  const [assessment, setAssessment] = useState({
    weight: '',
    fluidIntake: '',
    fluidList: '',
    urineOutput: '',
    bpMorning: '',
    bpEvening: '',
    heartRateMorning: '',
    heartRateEvening: '',
    abdominalCircumference: '',
    stomachAche: '',
    stomachAcheLocation: '',
    stomachAcheIntensity: '',
    yellowSkinEyes: '',
    swelling: '',
    swellingLocation: '',
    tiredness: '',
    confusion: '',
    medsTaken: '',
    missedMeds: '',
    missedMedsReason: '',
    highSaltFood: '',
    enoughProtein: '',
    proteinFoods: '',
    bowelMovements: '',
    bowelFrequency: '',
    bowelConsistency: '',
    bloodInStool: '',
    physicalActivity: '',
    activityDetails: '',
  });

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleYesNoChange = (field, value) => {
    setAssessment({ ...assessment, [field]: value });
  };

  const handleSubmit = async () => {
    const requiredFields = ['weight', 'fluidIntake', 'urineOutput', 'bpMorning', 'bpEvening', 'heartRateMorning', 'heartRateEvening', 'abdominalCircumference', 'stomachAche', 'yellowSkinEyes', 'swelling', 'tiredness', 'confusion', 'medsTaken', 'highSaltFood', 'enoughProtein', 'bowelMovements', 'physicalActivity'];
    const isValid = requiredFields.every(field => assessment[field]);
  
    if (isValid) {
      try {
        const body = { ...assessment, p_id };
  
        const response = await fetch(config.dailyAssessmentUrl, {  // Using config.dailyAssessmentUrl
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
  
        if (response.ok) {
          const responseText = await response.text();
          console.log('Response:', responseText);
          setSuccessModalVisible(true);
          resetForm();
        } else {
          const errorText = await response.text();
          console.error('Error submitting assessment:', errorText);
          setErrorModalVisible(true);
          resetForm();
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorModalVisible(true);
        resetForm();
      }
    } else {
      setErrorModalVisible(true);
    }
  };

  const resetForm = () => {
    setAssessment({
      weight: '',
      fluidIntake: '',
      urineOutput: '',
      bpMorning: '',
      bpEvening: '',
      heartRateMorning: '',
      heartRateEvening: '',
      abdominalCircumference: '',
      stomachAche: '',
      yellowSkinEyes: '',
      swelling: '',
      tiredness: '',
      confusion: '',
      medsTaken: '',
      highSaltFood: '',
      enoughProtein: '',
      bowelMovements: '',
      physicalActivity: ''
    });
  };

  const handleCloseModal = () => {
    setSuccessModalVisible(false);
    setErrorModalVisible(false);
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <FastImage
              source={{ uri: 'https://cdn.mos.cms.futurecdn.net/3vK6xb7Bw6KZW75298Vxh8.gif' }}
              style={styles.logo1}
              resizeMode="contain"
            />
            <Text style={styles.label}>Weight Monitoring</Text>
            <TextInput
              style={styles.input}
              placeholder="What is your weight today?"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={assessment.weight}
              onChangeText={(value) => setAssessment({ ...assessment, weight: value })}
            />
            <Text style={styles.note}>(Please measure in the morning before eating and after using the toilet)</Text>
          </>
        );
      case 2:
        return (
          <>
            <FastImage
              source={{ uri: 'https://media.istockphoto.com/id/1364441893/vector/young-man-drinking-water-from-bottle-with-water-drop-scale-of-hydration-concept-of-staying.jpg?s=612x612&w=0&k=20&c=pNV1Kxz0NOLwj2TKCZamuPuHTf4KmabpU0ctlGkxFuo=' }}
              style={styles.logo2}
              resizeMode="contain"
            />
            <Text style={styles.label}>Fluid Intake and Output</Text>
            <TextInput
              style={styles.input}
              placeholder="How much fluid did you drink today?"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={assessment.fluidIntake}
              onChangeText={(value) => setAssessment({ ...assessment, fluidIntake: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="Please list all liquids, eg, water, tea, soup, gravies..."
              placeholderTextColor="gray"
              value={assessment.fluidList}
              onChangeText={(value) => setAssessment({ ...assessment, fluidList: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="How much urine did you pass today?"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={assessment.urineOutput}
              onChangeText={(value) => setAssessment({ ...assessment, urineOutput: value })}
            />
          </>
        );
      case 3:
        return (
          <>
            <FastImage
              source={{ uri: 'https://cdn.shortpixel.ai/spai/w_898+q_lossless+ret_img/https://media.publit.io/file/gif2/BP_monitor.gif' }}
              style={styles.logo3}
              resizeMode="contain"
            />
            <Text style={styles.label}>Blood Pressure and Heart Rate</Text>
            <TextInput
              style={styles.input}
              placeholder="What is your blood pressure this morning? (eg, 120/80 mm Hg)"
              placeholderTextColor="gray"
              value={assessment.bpMorning}
              onChangeText={(value) => setAssessment({ ...assessment, bpMorning: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="What is your blood pressure this evening? (eg, 120/80 mm Hg)"
              placeholderTextColor="gray"
              value={assessment.bpEvening}
              onChangeText={(value) => setAssessment({ ...assessment, bpEvening: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="What is your heart rate this morning? (beats per minute)"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={assessment.heartRateMorning}
              onChangeText={(value) => setAssessment({ ...assessment, heartRateMorning: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="What is your heart rate this evening? (beats per minute)"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={assessment.heartRateEvening}
              onChangeText={(value) => setAssessment({ ...assessment, heartRateEvening: value })}
            />
          </>
        );
      case 4:
        return (
          <>
            <FastImage
              source={{ uri: 'https://www.thatbritishtweedcompany.co.uk/wp-content/uploads/2018/08/Measure-Yourself-Guide-Stomach.gif' }}
              style={styles.logo3}
              resizeMode="contain"
            />
            <Text style={styles.label}>Abdominal Circumference</Text>
            <TextInput
              style={styles.input}
              placeholder="What is your abdominal circumference today? (Measure in inches or centimeters at the same spot on the abdomen every day)"
              placeholderTextColor="gray"
              value={assessment.abdominalCircumference}
              onChangeText={(value) => setAssessment({ ...assessment, abdominalCircumference: value })}
            />
          </>
        );
      case 5:
        return (
          <>
            <Image
              source={{ uri: 'https://media.istockphoto.com/id/1471805288/vector/jaundice-disease-vector-concept.jpg?s=612x612&w=0&k=20&c=Ui2I15L-piKrpEI_7NcdpcnFfHWBQQ5Js5lhtXqr8e0=' }}
              style={styles.logo2}
              resizeMode="contain"
            />
            <Text style={styles.label}>Symptoms Monitoring</Text>
            <Text style={styles.label}>Stomach Ache</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.stomachAche === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('stomachAche', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.stomachAche === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('stomachAche', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            {assessment.stomachAche === 'Yes' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Where is the pain located?"
                  placeholderTextColor="gray"
                  value={assessment.stomachAcheLocation}
                  onChangeText={(value) => setAssessment({ ...assessment, stomachAcheLocation: value })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="What is the intensity of the pain? (1-10)"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={assessment.stomachAcheIntensity}
                  onChangeText={(value) => setAssessment({ ...assessment, stomachAcheIntensity: value })}
                />
              </>
            )}
            <Text style={styles.label}>Yellow Skin/Eyes</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.yellowSkinEyes === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('yellowSkinEyes', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.yellowSkinEyes === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('yellowSkinEyes', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Swelling</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.swelling === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('swelling', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.swelling === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('swelling', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            {assessment.swelling === 'Yes' && (
              <TextInput
                style={styles.input}
                placeholder="Where is the swelling located?"
                placeholderTextColor="gray"
                value={assessment.swellingLocation}
                onChangeText={(value) => setAssessment({ ...assessment, swellingLocation: value })}
              />
            )}
            <Text style={styles.label}>Tiredness</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.tiredness === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('tiredness', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.tiredness === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('tiredness', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Confusion</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.confusion === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('confusion', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.confusion === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('confusion', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 6:
        return (
          <>
            <FastImage
              source={{ uri: 'https://cdn.dribbble.com/users/4279575/screenshots/15172726/ezgif-5-e218fcce74d2.gif' }}
              style={styles.logo3}
              resizeMode="contain"
            />
            <Text style={styles.label}>Medication</Text>
            <Text style={styles.label}>Did you take all your medications today?</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.medsTaken === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('medsTaken', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.medsTaken === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('medsTaken', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            {assessment.medsTaken === 'No' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Which medications did you miss?"
                  placeholderTextColor="gray"
                  value={assessment.missedMeds}
                  onChangeText={(value) => setAssessment({ ...assessment, missedMeds: value })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Why did you miss them?"
                  placeholderTextColor="gray"
                  value={assessment.missedMedsReason}
                  onChangeText={(value) => setAssessment({ ...assessment, missedMedsReason: value })}
                />
              </>
            )}
          </>
        );
      case 7:
        return (
          <>
            <Image
              source={{ uri: 'https://www.kidneyfailed.in/blog/wp-content/uploads/2020/02/Diet-Plan-For-Weight-Gain.png' }}
              style={styles.logo3}
              resizeMode="contain"
            />
            <Text style={styles.label}>Diet Monitoring</Text>
            <Text style={styles.label}>Have you consumed any high salt foods today?</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.highSaltFood === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('highSaltFood', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.highSaltFood === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('highSaltFood', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Have you eaten enough protein today?</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.enoughProtein === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('enoughProtein', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.enoughProtein === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('enoughProtein', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            {assessment.enoughProtein === 'Yes' && (
              <TextInput
                style={styles.input}
                placeholder="What protein foods did you eat?"
                placeholderTextColor="gray"
                value={assessment.proteinFoods}
                onChangeText={(value) => setAssessment({ ...assessment, proteinFoods: value })}
              />
            )}
          </>
        );
      case 8:
        return (
          <>
            <Image
              source={{ uri: 'https://articles-1mg.gumlet.io/articles/wp-content/uploads/2023/09/Decoding-poop.jpg?compress=true&quality=80&w=640&dpr=2.6' }}
              style={styles.logo2}
              resizeMode="contain"
            />
            <Text style={styles.label}>Bowel Movements</Text>
            <Text style={styles.label}>Did you have any bowel movements today?</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.bowelMovements === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('bowelMovements', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.bowelMovements === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('bowelMovements', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            {assessment.bowelMovements === 'Yes' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="How often?"
                  placeholderTextColor="gray"
                  value={assessment.bowelFrequency}
                  onChangeText={(value) => setAssessment({ ...assessment, bowelFrequency: value })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="What is the consistency? (eg, soft, hard, loose)"
                  placeholderTextColor="gray"
                  value={assessment.bowelConsistency}
                  onChangeText={(value) => setAssessment({ ...assessment, bowelConsistency: value })}
                />
              </>
            )}
            <Text style={styles.label}>Was there any blood in your stool?</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.button, assessment.bloodInStool === 'Yes' && styles.selectedButton]}
                    onPress={() => handleYesNoChange('bloodInStool', 'Yes')}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, assessment.bloodInStool === 'No' && styles.selectedButton]}
                    onPress={() => handleYesNoChange('bloodInStool', 'No')}
                  >
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
          </>
        );
      case 9:
        return (
          <>
            <FastImage
              source={{ uri: 'https://cdn.dribbble.com/users/722563/screenshots/2928065/dribble_3.gif' }}
              style={styles.logo1}
              resizeMode="contain"
            />
            <Text style={styles.label}>Physical Activity</Text>
            <Text style={styles.label}>Did you do any physical activity today?</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, assessment.physicalActivity === 'Yes' && styles.selectedButton]}
                onPress={() => handleYesNoChange('physicalActivity', 'Yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, assessment.physicalActivity === 'No' && styles.selectedButton]}
                onPress={() => handleYesNoChange('physicalActivity', 'No')}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            {assessment.physicalActivity === 'Yes' && (
              <TextInput
                style={styles.input}
                placeholder="What activities did you do?"
                placeholderTextColor="gray"
                value={assessment.activityDetails}
                onChangeText={(value) => setAssessment({ ...assessment, activityDetails: value })}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Assessment</Text>
      </View>
      <View style={styles.container1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderPageContent()}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
            onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          {currentPage < 9 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentPage(currentPage + 1)}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleSubmit}
            >
              <Text style={styles.navButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
        <SuccessModal
          visible={successModalVisible}
          onClose={handleCloseModal}
          message="Submitted Successfully!"
        />
        <ErrorModal
          visible={errorModalVisible}
          onClose={handleCloseModal}
          message="There was an error submitting your assessment. Please try again."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  topBar: {
    width: '100%',
    height: height * 0.15, // Responsive height
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.04, // Responsive left
    top: height * 0.08, // Responsive top
    zIndex: 1,
  },
  headerTitle: {
    fontSize: width * 0.05, // Responsive font size
    top: height * 0.02, // Responsive top
    fontWeight: 'bold',
    color: 'black',
  },
  container1: {
    flex: 1,
    padding: width * 0.04, // Responsive padding
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: height * 0.25, // Responsive height
    marginBottom: height * 0.02, // Responsive margin bottom
  },
  logo1: {
    width: '120%',
    height: height * 0.35, // Responsive height
    marginBottom: height * 0.02, // Responsive margin bottom
    left: -width * 0.1, // Responsive left
  },
  logo2: {
    width: '120%',
    height: height * 0.35, // Responsive height
    marginBottom: height * 0.02, // Responsive margin bottom
    left: -width * 0.1, // Responsive left
  },
  logo3: {
    width: '130%',
    height: height * 0.375, // Responsive height
    marginBottom: height * 0.02, // Responsive margin bottom
    left: -width * 0.16, // Responsive left
  },
  label: {
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.01, // Responsive margin bottom
  },
  input: {
    height: height * 0.06, // Responsive height
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: width * 0.025, // Responsive padding horizontal
    marginBottom: height * 0.02, // Responsive margin bottom
  },
  note: {
    fontSize: width * 0.03, // Responsive font size
    color: '#888',
    marginBottom: height * 0.02, // Responsive margin bottom
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02, // Responsive margin bottom
  },
  button: {
    flex: 1,
    padding: height * 0.012, // Responsive padding
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: width * 0.0125, // Responsive margin horizontal
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#000',
  },
  navButton: {
    flex: 1,
    padding: height * 0.018, // Responsive padding
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: width * 0.0125, // Responsive margin horizontal
  },
  navButtonText: {
    color: '#fff',
    fontSize: width * 0.04, // Responsive font size
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02, // Responsive margin top
  },
});
export default DailyAssessmentScreen;
