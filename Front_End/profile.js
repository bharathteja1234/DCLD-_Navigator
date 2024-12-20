import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import config from './config';  // Import the config file

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ route }) => {
  const { p_id } = route.params;
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${config.patientProfileUrl}?p_id=${p_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ p_id }),
        });

        const result = await response.json();
        console.log('Fetched profile data:', result);

        if (result.status) {
          console.log('Full Image URL:', `${config.baseUrl}/${result.profile.image}`);
          setProfileData(result.profile);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [p_id]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Your Profile</Text>
      </View>
      {profileData ? (
        <View style={styles.elevatedContainer}>
          <View style={styles.imageContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
              <Image
  source={{ uri: `${config.baseUrl}/${profileData.image}` }}
  style={styles.profileImage}
/>
              </View>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.profileText}>Patient ID: {profileData.p_id}</Text>
            <Text style={styles.profileText}>Name: {profileData.name}</Text>
            <Text style={styles.profileText}>Age: {profileData.age}</Text>
            <Text style={styles.profileText}>Gender: {profileData.gender}</Text>
            <Text style={styles.profileText}>Contact: {profileData.contactNo}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.profileText}>Loading...</Text>
      )}
      <ImageBackground 
        source={{ uri: 'https://png.pngtree.com/background/20210711/original/pngtree-nurse-s-day-blue-cartoon-medical-doctor-banner-picture-image_1129257.jpg' }} 
        style={styles.backgroundImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: width * 0.05,
  },
  topBar: {
    width: width * 1, 
    height: height * 0.15, 
    marginTop: -height * 0.025, 
    left: -width * 0.05, 
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.07, 
    borderRadius: width * 0.075, 
  },
  topBarTitle: {
    fontSize: width * 0.05, 
    fontWeight: 'bold',
    color: 'black',
    bottom: -height * 0.025, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  elevatedContainer: {
    backgroundColor: '#fff',
    padding: width * 0.05, 
    borderRadius: width * 0.025, 
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.025,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.025, 
  },
  outerCircle: {
    width: width * 0.625, 
    height: width * 0.625, 
    borderRadius: (width * 0.625) / 2, 
    borderWidth: 5,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: width * 0.575, 
    height: width * 0.575, 
    borderRadius: (width * 0.575) / 2, 
    borderWidth: 5,
    borderColor: '#90c1F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: width * 0.55, 
    height: width * 0.55, 
    borderRadius: (width * 0.55) / 2, 
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: width * 0.05, 
  },
  profileText: {
    fontSize: width * 0.045, 
    marginBottom: height * 0.0125, 
    color: '#333',
  },
  backgroundImage: {
    width: width * 1.07, 
    height: height * 0.25, 
    position: 'absolute',
    bottom: -height * 0.02,
    left: -width * 0.05,
  },
});

export default ProfileScreen;