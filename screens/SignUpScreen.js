import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FloatingInput = ({ label, value, onChangeText, secureTextEntry, keyboardType }) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = new Animated.Value(value ? 1 : 0);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelPosition, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute',
    left: 12,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? '#7B83EB' : '#A1A1A1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
  };

  return (
    <View style={styles.inputContainer}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const FlipCardScreen = ({ navigation }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotateAnimation = useState(new Animated.Value(0))[0];

  const flipCard = () => {
    Animated.timing(rotateAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontRotateY = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <LinearGradient
      colors={['#7B83EB', '#ADA9FF', '#EDEDF2']}
      style={styles.container}
    >
      {/* Front Side - Sign Up */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { perspective: 1000 },
              { rotateY: frontRotateY },
            ],
          },
          !isFlipped && styles.cardVisible,
        ]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F3F4F9']}
          style={styles.cardContent}
        >
          <Text style={styles.heading}>Welcome to Flashify</Text>
          <Text style={styles.subHeading}>Unlock the future of possibilities.</Text>
          <FloatingInput label="Username" value="" onChangeText={() => { }} />
          <FloatingInput label="Email" value="" onChangeText={() => { }} keyboardType="email-address" />
          <FloatingInput label="Password" value="" onChangeText={() => { }} secureTextEntry />
          <TouchableOpacity style={styles.button} onPress={flipCard}>
            <LinearGradient
              colors={['#7B83EB', '#ADA9FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonInner}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={flipCard}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Back Side - Sign In */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          {
            transform: [
              { perspective: 1000 },
              { rotateY: backRotateY },
            ],
          },
          isFlipped && styles.cardVisible,
        ]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F3F4F9']}
          style={styles.cardContent}
        >
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.subHeading}>Let's get you signed in.</Text>
          <FloatingInput label="Email" value="" onChangeText={() => { }} keyboardType="email-address" />
          <FloatingInput label="Password" value="" onChangeText={() => { }} secureTextEntry />
          <TouchableOpacity style={styles.button} onPress={navigateToHome}>
            <LinearGradient
              colors={['#7B83EB', '#ADA9FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonInner}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={flipCard}>
            <Text style={styles.linkText}>
              Create a new account? <Text style={styles.linkHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 350,
    height: 500,
    borderRadius: 15,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardVisible: {
    zIndex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4D4E8C',
    marginBottom: 15,
  },
  subHeading: {
    fontSize: 16,
    color: '#7A7B9E',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E1E1E1',
    backgroundColor: '#FDFDFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#333333',
  },
  button: {
    marginTop: 20,
    width: '100%',
    borderRadius: 8,
  },
  buttonInner: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 20,
    fontSize: 14,
    color: '#7A7B9E',
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#7B83EB',
    fontWeight: '600',
  },
});

export default FlipCardScreen;
