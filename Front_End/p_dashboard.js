import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LogoutNotification from './LogoutNotification';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

const Dashboard = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { p_id } = route.params;

  useEffect(() => {
    console.log('Received in dash p_id:', p_id);
  }, [p_id]);

  const images = [
    { uri: 'https://i.pinimg.com/originals/e2/af/94/e2af94b7d5d4892c2343f34905019a8a.gif', isGif: true },
    { uri: 'https://media.istockphoto.com/id/475964404/photo/realistic-human-liver-illustration.jpg?s=612x612&w=0&k=20&c=7wYX0KeuMEIM-mqd9N0x6vLmH0gnS_tcFbhqidnY0jg=' },
    { uri: 'https://media.istockphoto.com/id/621271062/photo/realistic-illustration-of-cirrhosis-of-human-liver.jpg?s=612x612&w=0&k=20&c=MxYWKDbV81yNR7jYPEzxtQBeXuIFknmKK7jelVsdOEw=' },
    { uri: 'https://relamshospital.com/wp-content/uploads/2022/06/img_v2_8057db7d5d4892c2343f34905019a8a.webp' },
  ];

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(offsetX / width);
    setCurrentIndex(newIndex);
  };

  const handleLogout = () => {
    setLogoutVisible(true);
  };

  const confirmLogout = () => {
    setLogoutVisible(false);
    navigation.navigate('PatientLogin');
  };

  const cancelLogout = () => {
    setLogoutVisible(false);
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen', { p_id });
  }

  return (
    <View style={styles.container}>
      <View style={styles.colorBox} />
      <Text style={styles.heading}>Dashboard</Text>
      <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
        <Feather name="user" size={width * 0.08} color="black" />
      </TouchableOpacity>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.imageContainer}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageFrame}>
            <FastImage
              source={{ uri: image.uri }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View key={index} style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]} />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PatientDischargeSummary', { p_id })}>
          <Text style={styles.buttonText}>Discharge Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PatientMedication', { p_id })}>
          <Text style={styles.buttonText}>Medication</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FollowUp', { p_id })}>
          <Text style={styles.buttonText}>Follow-Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Feather name="home" size={width * 0.08} color='black' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Graph', { p_id })}>
          <FontAwesome name="line-chart" size={width * 0.08} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={width * 0.08} color="black" />
        </TouchableOpacity>
      </View>
      <LogoutNotification visible={logoutVisible} onConfirm={confirmLogout} onCancel={cancelLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  colorBox: {
    width: '100%',
    height: height * 0.15,
    backgroundColor: '#9FCBFB',
    borderRadius: 40,
    marginBottom: -50,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileIcon: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.05,
  },
  imageContainer: {
    width: '100%',
  },
  imageFrame: {
    width: width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: height * 0.35,
    borderRadius:10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.2,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  dot: {
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: width * 0.0125,
    marginHorizontal: width * 0.0125,
  },
  activeDot: {
    backgroundColor: '#007bff',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  buttonsContainer: {
    alignItems: 'center',
    marginBottom: height * 0.2,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderRadius: 10,
    height: height * 0.058,
    marginTop: 10,
    width: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: '90%',
    padding: width * 0.04,
    height: height * 0.08,
    borderRadius: 20,
    backgroundColor: '#9FCBFB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    position: 'absolute',
    bottom: height * 0.02,
  },
});

export default Dashboard;
