import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [folders, setFolders] = useState([
    { id: '1', name: 'Math' },
    { id: '2', name: 'Science' },
    { id: '3', name: 'History' },
  ]);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleAddFolder = () => {
    if (newFolderName.trim() !== '') {
      const newFolder = { id: Date.now().toString(), name: newFolderName };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const renderFolder = ({ item }) => (
    <Animated.View style={styles.folderContainer}>
      <Ionicons name="folder" size={40} color="#FFFFFF" style={styles.folderIcon} />
      <Text style={styles.folderText}>{item.name}</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Flashify</Text>

      <View style={styles.foldersHeader}>
        <Text style={styles.sectionTitle}>Your Folders</Text>
        <TouchableOpacity
          style={styles.createFolderButton}
          onPress={() => setIsCreatingFolder(!isCreatingFolder)}
        >
          <Ionicons name="add-circle" size={24} color="#D8C4B6" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        renderItem={renderFolder}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.foldersList}
      />

      {isCreatingFolder && (
        <View style={styles.newFolderContainer}>
          <TextInput
            style={styles.newFolderInput}
            placeholder="Enter folder name"
            placeholderTextColor="#B6BBC4"
            value={newFolderName}
            onChangeText={setNewFolderName}
          />
          <TouchableOpacity style={styles.addFolderButton} onPress={handleAddFolder}>
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.flashcardContainer}>
        <Text style={styles.sectionTitle}>Create Flashcard</Text>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.textContainer}>
            <TextInput style={styles.input} placeholder="Enter by Topic" placeholderTextColor="#B6BBC4" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.textContainer}>
            <TextInput style={styles.input} placeholder="Enter by Text" placeholderTextColor="#B6BBC4" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.goButton}>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#213555',
      padding: 20,
      alignItems: 'center',
    },
    heading: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#F5EFE7',
      textAlign: 'center',
      marginVertical: 20,
    },
    sectionTitle: {
      fontSize: 18,
      color: '#D8C4B6',
      marginTop: 20,
      textAlign: 'center',
    },
    foldersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        paddingHorizontal: 20, 
        marginBottom: 10,
      },
    createFolderButton: {
        padding: 10, 
        marginLeft: 10, 
    },
    foldersList: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 15, 
        marginTop: 20, 
        width: '100%', 
    },
    folderContainer: {
        width: 100,
        height: 120,
        marginHorizontal: 10, 
        marginVertical: 10, 
        backgroundColor: '#3E5879',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    folderIcon: {
      marginBottom: 10,
    },
    folderText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    newFolderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      width: '100%',
    },
    newFolderInput: {
      flex: 1,
      backgroundColor: '#3E5879',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 12,
      color: '#FFFFFF',
      fontSize: 16,
    },
    addFolderButton: {
      marginLeft: 10,
      backgroundColor: '#D8C4B6',
      padding: 10,
      borderRadius: 12,
    },
    flashcardContainer: {
      marginTop: 40,
      alignItems: 'center',
      width: '100%',
    },
    inputWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    textContainer: {
      flex: 1,
      marginHorizontal: 5,
    },
    input: {
      backgroundColor: '#3E5879',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 12,
      color: '#FFFFFF',
      textAlign: 'center',
      fontSize: 16,
    },
    goButton: {
      backgroundColor: '#D8C4B6',
      padding: 15,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
  });
  

export default HomeScreen;
