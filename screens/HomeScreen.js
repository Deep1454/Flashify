import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [folders, setFolders] = useState([
    { id: '1', name: 'Math' },
    { id: '2', name: 'Science' },
    { id: '3', name: 'History' },
    { id: '4', name: 'Math' },
    { id: '5', name: 'Science' },
    { id: '6', name: 'History' },
    { id: '7', name: 'Math' },
    { id: '8', name: 'Science' },
    { id: '9', name: 'History' },
    { id: '10', name: 'Math' },
    { id: '11', name: 'Science' },
    { id: '12', name: 'History' },
    { id: '13', name: 'Math' },
    { id: '14', name: 'Science' },
    { id: '15', name: 'History' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isTopicSelected, setIsTopicSelected] = useState(false);
  const [togglePosition] = useState(new Animated.Value(0)); // Animation for the toggle

  const handleToggle = () => {
    const toValue = isTopicSelected ? 0 : 1; // 0 = Text, 1 = Topic
    Animated.timing(togglePosition, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
    setIsTopicSelected(!isTopicSelected);
  };

  const handleAddFolder = () => {
    if (newFolderName.trim() !== '') {
      const newFolder = { id: Date.now().toString(), name: newFolderName };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsModalVisible(false);
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFolder = ({ item }) => (
    <TouchableOpacity
      style={styles.folderContainer}
      onPress={() => navigation.navigate('FlashCardScreen', { folderName: item.name })}
    >
      <Ionicons name="folder" size={80} color="#7B83EB" style={styles.folderIcon} />
      <Text style={styles.folderText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topContainer}>
        <LinearGradient colors={['#7B83EB', '#4D4D9A']} style={styles.gradientTopContainer}>
          <Text style={styles.sectionTitle}>Flashify</Text>
          <View style={styles.searchHeader}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={20} color="#7B83EB" style={styles.searchIcon} />
              <TextInput
                style={styles.searchBar}
                placeholder="Search folders"
                placeholderTextColor="#7B83EB"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.createFolderButton}
              onPress={() => setIsModalVisible(true)}
            >
              <FontAwesome5 name="folder-plus" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={filteredFolders}
        renderItem={renderFolder}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.foldersList}
      />

      <View style={styles.bottomContainer}>
        <TextInput
          style={styles.input}
          placeholder={isTopicSelected ? 'Enter Topic' : 'Enter Text'}
          placeholderTextColor="#7B83EB"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.toggleWrapper} onPress={handleToggle}>
            <Animated.View
              style={[
                styles.toggleIndicator,
                {
                  transform: [
                    {
                      translateX: togglePosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-7, 42],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={[styles.toggleText, isTopicSelected]}>Topic</Text>
            <Text style={[styles.toggleText, !isTopicSelected]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goButton}>
            <Ionicons name="arrow-forward" size={32} color="#4D4D9A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for creating a new folder */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Folder</Text>
            <TextInput
              style={styles.newFolderInput}
              placeholder="Enter folder name"
              placeholderTextColor="#7B83EB"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.addFolderButton}
                onPress={handleAddFolder}
              >
                <Text style={styles.addFolderButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
  },
  topContainer: {
    width: '100%',
    height: 190,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
  },
  gradientTopContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 59,
  },
  sectionTitle: {
    fontSize: 26,
    color: '#FFF',
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  createFolderButton: {
    padding: 10,
  },
  foldersList: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  folderContainer: {
    width: 100,
    height: 120,
    margin: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#7B83EB',
  },
  newFolderInput: {
    width: '100%',
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#7B83EB',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addFolderButton: {
    backgroundColor: '#7B83EB',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  addFolderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#7B83EB',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    width: '90%',
    height: 90,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  gradientBottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomRightRadius: 10,
    fontSize: 16,
    elevation: 2,
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  toggleWrapper: {
    width: 100,
    height: 35,
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'relative',
  },
  toggleIndicator: {
    position: 'absolute',
    width: 40,
    height: 25,
    backgroundColor: '#7B83EB',
    borderRadius: 15,
    zIndex: 1,
    top: 5,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    zIndex: 2,
    color: '#7B83EB',
  },
});

export default HomeScreen;
