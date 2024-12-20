import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import config from './config'; // Import your config file

const { width, height } = Dimensions.get('window');

const DoctorProfile = ({ route }) => {
  const { dId } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [localImageUri, setLocalImageUri] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/doctorprofile.php?d_id=${dId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log('Fetched profile data:', result);

        if (result.status && result.profile) {
          setProfileData(result.profile);
          const imageUrl = result.profile.image;
          console.log('Fetched image URL:', imageUrl);
          setProfileImage(imageUrl);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();

    // Request media library permissions for Android
    const requestMediaLibraryPermissions = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Media Library Permission',
          message: 'App needs access to your media library to select photos',
          buttonPositive: 'OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      }
    };

    requestMediaLibraryPermissions();
  }, [dId]);

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: 800,
        maxHeight: 800,
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0].uri;
          console.log('Image URI: ', selectedImage);
          setLocalImageUri(selectedImage);
        }
      }
    );
  };

  const generateUniqueId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleSave = async () => {
    try {
      let newImageName = `profile_${generateUniqueId()}.jpg`;

      if (localImageUri) {
        const formData = new FormData();
        formData.append('image', {
          uri: localImageUri,
          name: newImageName,
          type: 'image/jpeg',
        });
        formData.append('d_id', dId);

        const imageUploadResponse = await fetch(`${config.baseUrl}/doctorprofile.php`, {
          method: 'POST',
          body: formData,
        });

        if (!imageUploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadResult = await imageUploadResponse.json();
        if (!uploadResult.status) {
          Alert.alert('Upload Error', uploadResult.message || 'Image upload failed. Please try again.');
          return;
        }

        setProfileImage(uploadResult.imageUrl);
      }

      const response = await fetch(`${config.baseUrl}/doctorprofile.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          d_id: dId,
          doctor_name: profileData.doctor_name,
          speciality: profileData.speciality,
          gender: profileData.gender,
          contactNo: profileData.contactNo,
        }),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const result = await response.json();
      if (result.status) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Update Error', result.message || 'Profile update failed.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred. Please try again.');
      console.error('Error updating profile:', error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Your Profile</Text>
      </View>
      {profileData ? (
        <View style={styles.elevatedContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={isEditing ? handleImagePick : null}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                <Image
                    source={{ uri: localImageUri || `${config.baseUrl}/${profileImage}` }}
                    style={styles.profileImage}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {isEditing ? (
            <View style={styles.textContainer}>
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.doctor_name}
                  onChangeText={(text) => setProfileData({ ...profileData, doctor_name: text })}
                  placeholder="Name"
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons name="local-hospital" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.speciality}
                  onChangeText={(text) => setProfileData({ ...profileData, speciality: text })}
                  placeholder="Speciality"
                />
              </View>
              <View style={styles.inputContainer}>
                <FontAwesome name="transgender" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.gender}
                  onChangeText={(text) => setProfileData({ ...profileData, gender: text })}
                  placeholder="Gender"
                />
              </View>
              <View style={styles.inputContainer}>
                <FontAwesome name="phone" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.contactNo}
                  onChangeText={(text) => setProfileData({ ...profileData, contactNo: text })}
                  placeholder="Contact No"
                />
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.textContainer}>
              <Text style={styles.profileText}>Doctor ID: {profileData.d_id}</Text>
              <Text style={styles.profileText}>Name: {profileData.doctor_name}</Text>
              <Text style={styles.profileText}>Gender: {profileData.gender}</Text>
              <Text style={styles.profileText}>Contact: {profileData.contactNo}</Text>
              <Text style={styles.profileText}>Speciality: {profileData.speciality}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.profileText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: width * 0.05, // 5% of the screen width
  },
  topBar: {
    width: width , // 110% of the screen width
    height: height * 0.15, // 15% of the screen height
    marginTop: height * -0.025, // -2.5% of the screen height
    left: width * -0.05, // -5% of the screen width
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.15, // 18.75% of the screen height
    borderRadius: width * 0.075, // 7.5% of the screen width
  },
  topBarTitle: {
    fontSize: width * 0.05, // 5% of the screen width
    fontWeight: 'bold',
    color: 'black',
    bottom: height * -0.025, // -2.5% of the screen height
    alignItems: 'center',
    justifyContent: 'center',
  },
  elevatedContainer: {
    backgroundColor: '#fff',
    padding: width * 0.05, // 5% of the screen width
    borderRadius: width * 0.025, // 2.5% of the screen width
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.025, // 2.5% of the screen height
    bottom: height * 0.075, // 7.5% of the screen height
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.025, // 2.5% of the screen height
  },
  outerCircle: {
    width: width * 0.625, // 62.5% of the screen width
    height: width * 0.625, // 62.5% of the screen width
    borderRadius: width * 0.3125, // 31.25% of the screen width
    borderWidth: width * 0.0075, // 0.75% of the screen width
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: width * 0.575, // 57.5% of the screen width
    height: width * 0.575, // 57.5% of the screen width
    borderRadius: width * 0.2875, // 28.75% of the screen width
    borderWidth: width * 0.0075, // 0.75% of the screen width
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: width * 0.55, // 55% of the screen width
    height: width * 0.55, // 55% of the screen width
    borderRadius: width * 0.275, // 27.5% of the screen width
  },
  textContainer: {
    width: '100%',
    marginBottom: height * 0.01, // 2.5% of the screen height
  },
  profileText: {
    fontSize: width * 0.045, // 4.5% of the screen width
    fontWeight: 'bold',
    marginBottom: height * 0.0125, // 1.25% of the screen height
  },
  profileTextInput: {
    fontSize: width * 0.04, // 4.5% of the screen width
    marginBottom: height * 0.0125, // 1.25% of the screen height
    borderWidth: width * 0.005, // 0.5% of the screen width
    height: height * 0.05, // 5% of the screen height
    borderColor: '#ccc',
    borderRadius: width * 0.0125, // 1.25% of the screen width
    paddingLeft: width * 0.125, // 12.5% of the screen width (Create space for the icon)
    paddingVertical: height * 0.0125, // 1.25% of the screen height
    paddingHorizontal: width * 0.0375, // 3.75% of the screen width
    width: '95%',
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01, // 1.875% of the screen height
    width: '100%',
  },
  icon: {
    position: 'absolute',
    left: width * 0.025, // 2.5% of the screen width
    top: height * 0.025, // 2.5% of the screen height
    transform: [{ translateY: -height * 0.015 }], // -1.5% of the screen height
  },
  editButton: {
    color: '#007bff',
    fontSize: width * 0.045, // 4.5% of the screen width
    fontWeight: 'bold',
    marginTop: height * 0.025, // 2.5% of the screen height
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.0125, // 1.25% of the screen height
    paddingHorizontal: width * 0.025, // 2.5% of the screen width
    borderRadius: width * 0.0125, // 1.25% of the screen width
    alignItems: 'center',
    marginTop: height * 0.01, // 2.5% of the screen height
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.045, // 4.5% of the screen width
    fontWeight: 'bold',
  },
});


export default DoctorProfile;
