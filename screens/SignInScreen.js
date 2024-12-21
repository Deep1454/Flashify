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
      <Text style={styles.heading}>Sign In</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#B6BBC4"  
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B6BBC4"  
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.passwordIconContainer}>
          <Ionicons
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={24}
            color="#B6BBC4"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161A30',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    color: '#FFFFFF', 
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#FFFFFF', 
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 12,
    marginBottom: 20,
    color: '#FFFFFF', 
    fontSize: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    backgroundColor: '#0A3D6A', 
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: '600',
  },
  signUpText: {
    color: '#B6BBC4',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 16,
    borderRadius: 12, 
  },
});

export default SignInScreen;
