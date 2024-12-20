import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const GetStarted = () => {
  const navigation = useNavigation();

  const imageUri = require('./assets/output-onlinegiftools.gif');

  const handleGetStarted = () => {
    navigation.navigate('RoleSelectionScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome to DCLD Navigator</Text>
      </View>
      <View style={styles.imageContainer}>
        <FastImage source={imageUri} style={styles.image} resizeMode={FastImage.resizeMode.contain} />
      </View>
      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginTop: height * 0.2,
  },
  header: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-thin',
    color: '#509FF3',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 1,
    height: width * 0.9,
    resizeMode: 'contain',
  },
  getStartedButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
    marginBottom: height * 0.1,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#fff',
    fontFamily: 'sans-serif-thin',
    fontWeight: 'bold',
  },
});

export default GetStarted;
