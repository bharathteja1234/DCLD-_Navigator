import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Animated, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import config from './config';

const { width, height } = Dimensions.get('window');

const PatientLogin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);

  const handleLogin = async () => {
    if (!username || !password) {
      showAlert('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(config.patientLoginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Login Response:', data);

      if (data.status) {
        const { p_id } = data;
        navigation.navigate('PatientDashboard', { p_id, profile: data.profile });
      } else {
        showAlert('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      showAlert('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message) => {
    Alert.alert('Status', message);
  };


  return (
    <View style={styles.container}>
      <Animated.View style={[styles.colorBox, { transform: [{ translateY }] }]} />
      <Image
        source={{ uri: 'https://img.freepik.com/free-vector/doctor-examining-patient-clinic_23-2148853674.jpg' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Patient Login</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={width * 0.05} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="gray"
            onChangeText={text => setUsername(text)}
            value={username}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={width * 0.05} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Feather name={passwordVisible ? "eye-off" : "eye"} size={width * 0.05} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.signupText}>Don't have an account? Contact Doctor.</Text>
      <Animated.View style={[styles.colorBox1, { transform: [{ translateY }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'static',
  },
  colorBox: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.5,
    backgroundColor: '#007bff',
    position: 'absolute',
    top: -width * 0.15,
    right: -width * 0.15,
    zIndex: 1,
  },
  colorBox1: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.5,
    backgroundColor: '#007bff',
    position: 'absolute',
    bottom: -width * 0.15,
    left: -width * 0.15,
    zIndex: 1,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.27,
    marginBottom: height * 0.02,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  inputContainer: {
    width: '70%',
    marginVertical: height * 0.005,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: height * 0.013,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.003,
  },
  input: {
    flex: 1,
    height: height * 0.05,
    fontSize: width * 0.045,
    color:'black',
  },
  icon: {
    marginRight: width * 0.02,
  },
  eyeIcon: {
    marginLeft: width * 0.02,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
    alignItems: 'center',
    width: '55%',
    marginVertical: height * 0.022,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    color: '#777777',
  },
});

export default PatientLogin;
