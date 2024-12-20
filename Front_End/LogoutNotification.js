import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

const LogoutNotification = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animatable.View animation="bounceIn" style={styles.container}>
        <Feather name="alert-circle" size={40} color="#ff6347" />
        <Text style={styles.title}>Logout</Text>
        <Text style={styles.message}>Are you sure you want to logout?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
            <Text style={[styles.buttonText, styles.confirmButtonText]}>OK</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#ff6347',
  },
  confirmButtonText: {
    color: '#fff',
  },
});

export default LogoutNotification;
