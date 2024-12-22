import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View
      style={styles.folderContainer}
    >
      <Ionicons name="folder" size={80} color="#7B83EB" style={styles.folderIcon} />
      <Text style={styles.folderText}>{item.name}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#E0E7FF', '#F1F5FF']}
      style={styles.container}
    >
      <View style={styles.spacer} />

      <View style={styles.foldersHeader}>
        <Text style={styles.sectionTitle}>Your Folders</Text>
        <TouchableOpacity
          style={styles.createFolderButton}
          onPress={() => setIsCreatingFolder(!isCreatingFolder)}
        >
          <FontAwesome5 name="folder-plus" size={35} color="#7B83EB" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        renderItem={renderFolder}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.foldersList}
      />

      {isCreatingFolder && (
        <View style={styles.newFolderContainer}>
          <TextInput
            style={styles.newFolderInput}
            placeholder="Enter folder name"
            placeholderTextColor="#7B83EB"
            value={newFolderName}
            onChangeText={setNewFolderName}
          />
          <TouchableOpacity style={styles.addFolderButton} onPress={handleAddFolder}>
            <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.flashcardContainer}>
        <View style={styles.singleLineWrapper}>
          <TouchableOpacity style={styles.textContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter by Topic"
              placeholderTextColor="#7B83EB"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.textContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter by Text"
              placeholderTextColor="#7B83EB"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.goButton}>
            <LinearGradient
              colors={['#7B83EB', '#ADA9FF']}
              style={styles.gradientButton}
            >
              <Ionicons name="arrow-forward" size={32} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.spacer} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  spacer: {
    height: 40,
  },
  sectionTitle: {
    fontSize: 26,
    color: '#4D4D9A',
    fontWeight: '700',
    textAlign: 'center',
  },
  foldersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  createFolderButton: {
    padding: 10,
  },
  foldersList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderContainer: {
    width: 100,
    height: 120,
    marginHorizontal: 10,
    marginVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  folderIcon: {
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 4,
  },
  folderText: {
    color: '#4D4D9A',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 9,
  },
  newFolderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  newFolderInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    color: '#333333',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  addFolderButton: {
    marginLeft: 10,
    backgroundColor: '#7B83EB',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  flashcardContainer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  singleLineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    color: '#333333',
    textAlign: 'center',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
});

export default HomeScreen;
