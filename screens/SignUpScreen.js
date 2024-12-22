import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome to Flashify</Text>
      <Text style={styles.subHeading}>explore a world of possibilities.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#B6BBC4"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#B6BBC4"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#B6BBC4"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.passwordIconContainer}
        >
          <Ionicons
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={24}
            color="#7E9FFD"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text
        style={styles.signInText}
        onPress={() => navigation.navigate('SignIn')}
      >
        Already have an account? <Text style={styles.signInLink}>Sign In</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Primary color as background
    padding: 20,
  },
  heading: {
    fontSize: 26,
    color: '#7E9FFD', // Secondary color
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: '#B6BBC4',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#F5F5F5', // Subtle contrast from the primary background
    borderRadius: 12,
    paddingLeft: 12,
    marginBottom: 20,
    color: '#333333',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light border for modern look
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordIconContainer: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  button: {
    backgroundColor: '#7E9FFD', // Secondary color for call-to-action
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF', // Primary color for contrast
    fontSize: 18,
    fontWeight: '600',
  },
  signInText: {
    color: '#333333',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  signInLink: {
    color: '#7E9FFD', // Secondary color for link
    fontWeight: '600',
  },
});

export default SignUpScreen;
