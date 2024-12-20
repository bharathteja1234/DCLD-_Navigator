import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, Easing, Animated, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const FollowUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { p_id } = route.params;

  const animatedValues = useRef([
    new Animated.Value(0.5),
    new Animated.Value(-300),
    new Animated.Value(-200),
    new Animated.Value(-100),
  ]).current;

  const animateButtons = () => {
    const animations = animatedValues.map((value, index) =>
      Animated.timing(value, {
        toValue: index === 0 ? 1 : 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  };

  useEffect(() => {
    animateButtons();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.button, { transform: [{ scale: animatedValues[0] }] }]}>
        <TouchableHighlight onPress={() => navigation.navigate('Pqns', { p_id })} underlayColor="#0056b3">
          <Text style={styles.buttonText}>   Questionnaires   </Text>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View style={[styles.button, { transform: [{ translateY: animatedValues[1] }] }]}>
        <TouchableHighlight onPress={() => navigation.navigate('DailyAssessment', { p_id })} underlayColor="#0056b3">
          <Text style={styles.buttonText}>  Daily Assessment  </Text>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View style={[styles.button, { transform: [{ translateY: animatedValues[2] }] }]}>
        <TouchableHighlight onPress={() => navigation.navigate('DietInfo', { p_id })} underlayColor="#0056b3">
          <Text style={styles.buttonText}>   Diet Information   </Text>
        </TouchableHighlight>
      </Animated.View>
      <Animated.View style={[styles.button, { transform: [{ translateY: animatedValues[3] }] }]}>
        <TouchableHighlight onPress={() => navigation.navigate('PatientNotes', { p_id })} underlayColor="#0056b3">
          <Text style={styles.buttonText}>      Patient Notes      </Text>
        </TouchableHighlight>
      </Animated.View>
      <Image
        source={{ uri: 'https://media.istockphoto.com/id/1281066698/vector/the-magnifying-glass-detective-is-following-in-the-black-footsteps-vector-illustration.jpg?s=612x612&w=0&k=20&c=QB90D22BnFifLZCwzjPCULjYNXXkaYFsLfvn0CaV5_g=' }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.015, // Adjusted for screen height
    paddingHorizontal: width * 0.05, // Adjusted for screen width
    borderRadius: 10,
    marginBottom: height * 0.015, // Adjusted for screen height
  },
  buttonText: {
    color: '#ffffff',
    fontSize: width * 0.04, // Adjusted for screen width
    fontWeight: 'bold',
  },
  logo: {
    width: width * 1.5, // Adjusted for screen width
    height: height * 0.35, // Adjusted for screen height
    marginTop: height * 0.01, // Adjusted for screen height
    marginBottom: height * 0.005, // Adjusted for screen height
  },
});

export default FollowUp;
