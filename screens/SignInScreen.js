import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome Back!</Text>

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
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>
        Don't have an account?{' '}
        <Text
          style={styles.signUpLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign Up
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Primary color
    padding: 20,
  },
  heading: {
    fontSize: 26,
    color: '#7E9FFD', // Secondary color
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#F5F5F5', // Light gray for input fields
    borderRadius: 12,
    paddingLeft: 12,
    marginBottom: 20,
    color: '#333333',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Subtle border for better definition
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
    backgroundColor: '#7E9FFD', // Secondary color
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
    color: '#FFFFFF', // White text for contrast
    fontSize: 18,
    fontWeight: '600',
  },
  signUpText: {
    color: '#333333',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  signUpLink: {
    color: '#7E9FFD', // Secondary color for link
    fontWeight: '600',
  },
});

export default SignInScreen;
