import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const videos = [
  {
    title: 'Know About Liver',
    image: require('./assets/te4G7d6wFWE-HD.jpg'),
    link: 'https://youtube.com/playlist?list=PLyBdFdoZ2XWL0tvRxsCR89dJzyhR17T7Z&si=lpneCLnBXRWaBAmi', 
  },
  {
    title: 'Diets for Decompensated Patients',
    image: require('./assets/pxwZ2PsN8ko-HD.jpg'), 
    link: 'https://youtube.com/shorts/pxwZ2PsN8ko?si=a1RrcY1ikg9Ne2s1', 
  },
  {
    title: 'Can You Survive with Liver Cirrhosis',
    image: require('./assets/DrdH04QZijo-HD.jpg'), 
    link: 'https://youtube.com/shorts/DrdH04QZijo?si=jcGNTdrWi-cetmg9', 
  },
  {
    title: 'Foods For Liver Cirrhosis Patients',
    image: require('./assets/ukgrM3HRumg-HD.jpg'), 
    link: 'https://youtube.com/shorts/ukgrM3HRumg?si=u3UZiYqKNwJ2RVV3',
  },
  {
    title: 'What is Compensated VS Decompensated Liver ',
    image: require('./assets/f50vu0j7FKs-HD.jpg'), 
    link: 'https://youtube.com/watch?v=f50vu0j7FKs', 
  },
];

const openYouTubeLink = (link) => {
  Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
};

const VideoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={width * 0.08} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Diet Information</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.elevatedContainer}>
          {videos.map((video, index) => (
            <View key={index} style={styles.videoContainer}>
              <Text style={styles.heading}>{video.title}</Text>
              <TouchableOpacity onPress={() => openYouTubeLink(video.link)}>
                <Image source={video.image} style={styles.image} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    width: '100%',
    height: height * 0.15,
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.025,
    marginBottom: height * 0.0125,
    borderBottomLeftRadius: width * 0.075,
    borderBottomRightRadius: width * 0.075,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.0025 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.05,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.0375,
    top: height * 0.08,
  },
  topBarTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'black',
    top: height * 0.025,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: height * 0.025,
  },
  elevatedContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: width * 0.025,
    padding: width * 0.05,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.0025 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.05,
    width: '95%',
    alignItems: 'center',
  },
  videoContainer: {
    marginBottom: height * 0.025,
    alignItems: 'center',
  },
  heading: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.0125,
    textAlign: 'center',
  },
  image: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: width * 0.025,
  },
});

export default VideoScreen;
