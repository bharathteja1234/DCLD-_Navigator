import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./assets/pngwing.png')}
      />
      <Text style={styles.title}>Select Your Role</Text>
      <TouchableOpacity
        style={[styles.roleButton, selectedRole === 'doctor' && styles.selected]}
        onPress={() => {
          setSelectedRole('doctor');
          navigation.navigate('DoctorLogin');
        }}
      >
        <Text style={styles.buttonText}>Doctor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleButton, selectedRole === 'patient' && styles.selected]}
        onPress={() => {
          setSelectedRole('patient');
          navigation.navigate('PatientLogin');
        }}
      >
        <Text style={styles.buttonText}>Patient</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.4,
    height: height * 0.29,
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    marginBottom: height * 0.02,
  },
  roleButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.1,
    borderRadius: 20,
    marginVertical: height * 0.015,
    width: width * 0.5,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <RoleSelectionScreen />
    </NavigationContainer>
  );
};

export default RoleSelectionScreen;
