import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import config from './config';

const { width, height } = Dimensions.get('window');

const DoctorNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/DoctorNotification.php`);
      const responseData = await response.json();

      if (responseData.success) {
        setNotifications(responseData.notifications);
      } else {
        console.log('No notifications found');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <MaterialIcons name="notifications" size={26} color="#007bff" />
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationText}>{item.Notification}</Text>
          <Text style={styles.notificationText1}>
            Patient ID: {item.p_id} 
          </Text>
          <Text style={styles.notificationDate}>
            {new Date(item.NotificationDate).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
  

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.arrowContainer} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.p_id.toString()}
        ListEmptyComponent={<Text style={styles.noNotifications}>No notifications</Text>}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topBar: {
    width: width, // Adjusted for responsiveness
    height: height * 0.15, // Adjusted for responsiveness
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.05, // Adjusted for responsiveness
    marginBottom: height * 0.04, // Adjusted for responsiveness
    borderBottomLeftRadius: width * 0.075, // Adjusted for responsiveness
    borderBottomRightRadius: width * 0.075, // Adjusted for responsiveness
  },
  arrowContainer: {
    position: 'absolute',
    left: width * 0.05, // Adjusted for responsiveness
    top: height * 0.1, // Adjusted for responsiveness
  },
  topBarTitle: {
    color: 'black',
    fontSize: width * 0.055, // Adjusted for responsiveness
    top: height * 0.037, // Adjusted for responsiveness
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    padding: width * 0.03, // Adjusted for responsiveness
    marginVertical: height * 0.01, // Adjusted for responsiveness
    borderRadius: width * 0.025, // Adjusted for responsiveness
    width: width * 0.9, // Adjusted for responsiveness
    left: width * 0.05, // Adjusted for responsiveness
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: height * 0.0025, // Adjusted for responsiveness
    },
    shadowOpacity: 0.25,
    shadowRadius: width * 0.01, // Adjusted for responsiveness
    elevation: 5,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationTextContainer: {
    marginLeft: width * 0.025, // Adjusted for responsiveness
    flex: 1,
  },
  notificationText: {
    fontSize: width * 0.039, // Adjusted for responsiveness
    fontWeight: 'bold',
    marginBottom: height * 0.006, // Adjusted for responsiveness
    color: '#333',
    flexShrink: 1, // Ensures text wraps within the available space
  },
  notificationText1: {
    fontSize: width * 0.035, // Adjusted for responsiveness
    fontWeight: 'bold',
    marginBottom: height * 0.006, // Adjusted for responsiveness
    color: '#666',
  },
  notificationDate: {
    fontSize: width * 0.03, // Adjusted for responsiveness
    color: '#888',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotifications: {
    textAlign: 'center',
    marginTop: height * 0.025, // Adjusted for responsiveness
    fontSize: width * 0.04, // Adjusted for responsiveness
    color: '#888',
  },
});

export default DoctorNotification;
