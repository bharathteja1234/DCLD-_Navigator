import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Notification = ({ message, onClose }) => {
  return (
    <View style={styles.notificationContainer}>
      <View style={styles.notification}>
        <Text style={styles.notificationText}>{message}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1000,
    alignItems: 'center',
  },
  notification: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    width: '90%',
  },
  notificationText: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
  },
  closeText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default Notification;
