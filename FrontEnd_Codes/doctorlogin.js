import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Animated, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import config from './config';

const { width, height } = Dimensions.get('window');

const DoctorLogin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [dId, setDId] = useState(null);

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

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      showAlert('Please enter both username and password.');
      return;
    }

    fetch(config.doctorLoginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login Response:', data);
        if (data.status) {
          setDId(data.d_id);
          console.log('Logged in with d_id:', data.d_id);
          setUsername('');
          setPassword('');
          navigation.navigate('DoctorDashboard', { dId: data.d_id });
        } else {
          showAlert('Invalid username or password. Please try again.');
        }
      })
      .catch(error => {
        console.error('Login Error:', error);
        showAlert('Login failed. Please try again later.');
      });
  };

  const showAlert = (message) => {
    Alert.alert('Status', message);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.colorBox, { transform: [{ translateY }] }]} />
      <Image
        source={{ uri: 'https://img.freepik.com/premium-vector/flat-illustration-with-liver-white-background-medical-design-characters-cartoon-style_194782-1327.jpg?w=2000' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Doctor Login</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={width * 0.05} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="gray"
            onChangeText={text => setUsername(text)}
            value={username}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={width * 0.05} color="grey" style={styles.icon} />
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
            <Feather name={passwordVisible ? 'eye-off' : 'eye'} size={width * 0.05} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DoctorSignUp')}>
          <Text style={styles.signupTextLink}>Sign up.</Text>
        </TouchableOpacity>
      </View>
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
    width: width * 0.7,
    height: height * 0.29,
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
    width: '53%',
    marginVertical: height * 0.02,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  signupText: {
    fontSize: width * 0.04,
    color: '#777777',
  },
  signupTextLink: {
    fontSize: width * 0.045,
    color: '#007bff',
    marginLeft: 5,
  },
});

export default DoctorLogin;
