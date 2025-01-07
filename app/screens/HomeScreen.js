import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FolderService from '../services/FolderService'
import Storage from '../services/AsyncStorage';
import CustomeAlert from '../components/CustomeAlert';
import AIService from '../services/AIService';
const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [folders, setFolders] = useState([]);

  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
  const [isGenFlashCModalVisible, setIsGenFlashCModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isAddGenFlashCardModalVisible, setIsAddGenFlashCardModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isTopicSelected, setIsTopicSelected] = useState(false);
  const [togglePosition] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const getFolders = async () => {
      try {
        setUsername(await Storage.getItem('username'))
        setEmail(await Storage.getItem('email'))
        await FolderService.getFolders(await Storage.getItem('user_id'), await Storage.getItem('token'))
        .then((res)=>{
          setFolders(res.data.folders)
          
        }).catch((e)=>{ 
          CustomeAlert('Error')
        })
      } catch (err) {
        CustomeAlert('Error')
      }
    };

    getFolders();
  }, [])

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const onButtonLayout = (event) => {
    const layout = event.nativeEvent.layout;
    setButtonPosition({
      x: layout.x,
      y: layout.y + layout.height,
    });
  };

  const handleToggle = () => {
    const toValue = isTopicSelected ? 0 : 1;
    Animated.timing(togglePosition, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
    setIsTopicSelected(!isTopicSelected);
  };

  const handleAddFolder = async () => {
    if (newFolderName.trim() !== '') {
      const payload = {
        "name": newFolderName,
        "description": newFolderDescription
      }
      await FolderService.createFolder(await Storage.getItem('user_id'), payload, await Storage.getItem('token'))
      .then((res)=>{
        const newFolder = {
          name: res.data.folder.name,
          description: res.data.folder.description
        }
        setFolders([...folders, newFolder]);
        setNewFolderName('');
        setIsFolderModalVisible(false);  
      }).catch((e)=>{
        CustomeAlert('Unsuccessful', e.message, ()=>{setIsFolderModalVisible(true);})
      })
    }
  };

  const logout = async()=>{
    await Storage.removeItem('token')
    navigation.navigate('SignUp')
  }

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFolder = ({ item }) => (
    <TouchableOpacity
      style={styles.folderContainer}
      onPress={() => navigation.navigate('FlashCardScreen', { folderName: item.name, folderId: item.id })}
    >
      <Ionicons name="folder" size={80} color="#7B83EB" style={styles.folderIcon} />
      <Text style={styles.folderText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const generate_flashcards = async () => {
    setIsLoading(true);

    let payload = {};
    
    if (!isTopicSelected) {
      payload = {
        topic: `${inputValue}`,
      };
    } else {
      payload = {
        text: `${inputValue}`,
      };
    }
  
    try {  
      const token = await Storage.getItem('token');
      AIService.generate_flashcards(payload, token)
      .then((res)=>{
        setFlashcards(res.data.flashcards);
        setIsLoading(false);
        setIsGenFlashCModalVisible(true)
      }).catch((e)=>{
      setIsLoading(false);
      CustomeAlert('Error', 'Cannot generate flashcard at the moment.');
      })
    } catch (e) {
      CustomeAlert('Error', e.message || 'Error Generating Flashcards');
    } finally {
    }
  };
  
  const renderGenFlashcards = ({ item }) => (
    <TouchableOpacity
    style={styles.flashcardCon}
      onPress={() => console.log(item.question)}
    >
      <Text style={styles.genFlashcardText}>{item.question}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topContainer}>
        <LinearGradient colors={['#7B83EB', '#4D4D9A']} style={styles.gradientTopContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionTitle}>Flashify</Text>
            <TouchableOpacity
                style={styles.createFolderButton}
                onPress={toggleDropdown}
                onLayout={onButtonLayout}
              >
                <FontAwesome5 name="user" size={25} color="#FFF" />
            </TouchableOpacity>
            {dropdownVisible && buttonPosition && (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={dropdownVisible}
                  onRequestClose={toggleDropdown}
                >
                  <TouchableWithoutFeedback onPress={toggleDropdown}>
                    <View style={styles.modalBackground}>
                      <View
                        style={[
                          styles.dropdownContainer,
                          {
                            top: buttonPosition.y,
                            left: buttonPosition.x,
                            zIndex: 1000,
                          },
                        ]}
                      >
                        <TouchableOpacity style={styles.dropdownItem} onPress={()=>{
                          setDropdownVisible(false);
                          setTimeout(() => setIsProfileModalVisible(true), 300);
                          }}>
                          <Text style={styles.dropdownText}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={()=>{
                          setDropdownVisible(false)
                          logout()
                          }}>
                          <Text style={styles.dropdownText}>Logout</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
            )}
          </View>
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
              onPress={() => setIsFolderModalVisible(true)}
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
    <View style={{ flex: 1 }} pointerEvents={isLoading ? 'none' : 'auto'}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7B83EB" />
        </View>
      )}
    </View>

    <View style={styles.bottomContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={isTopicSelected ? 'Enter Topic' : 'Enter Text'}
          placeholderTextColor="#7B83EB"
          value={inputValue}
          onChangeText={setInputValue}
          multiline
          maxLength={200}
        />
        <Text style={styles.charCount}>
        {inputValue.length} / 200
      </Text>
      </View>
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
                        outputRange: [-12, 40],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={[styles.toggleText, isTopicSelected]}>Topic</Text>
            <Text style={[styles.toggleText, !isTopicSelected]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goButton} onPress={generate_flashcards}>
            <Ionicons name="arrow-forward" size={32} color="#4D4D9A" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Profile model */}
      <Modal
        visible={isProfileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
          <TouchableWithoutFeedback onPress={() => setIsProfileModalVisible(false)}>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile</Text>
            <Text
              style={styles.newFolderInput}
              >Username: {username}</Text>
            <Text
              style={styles.newFolderInput}
              >Email: {email}</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsProfileModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>

      </Modal>
      {/* Add folder model */}
      <Modal
        visible={isFolderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFolderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Folder</Text>
            <TextInput
              style={styles.newFolderInput}
              placeholder="Calculus"
              placeholderTextColor="#7B83EB"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <TextInput
              style={[styles.newFolderInput, { height: 100, textAlignVertical: 'top'  }]}
              placeholder="chapter 11 from class 11 in maths.."
              placeholderTextColor="#7B83EB"
              value={newFolderDescription}
              onChangeText={setNewFolderDescription}
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
                onPress={() => setIsFolderModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Generated flashcard model */}
      <Modal
        visible={isGenFlashCModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsGenFlashCModalVisible(false)}
      >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Generated Flashcards</Text>
        <FlatList
          data={flashcards}
          renderItem={renderGenFlashcards}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setIsGenFlashCModalVisible(false)}
        >
          <Text style={styles.cancelButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
      </Modal>
      {/* Add gen flashcards */}
      <Modal
        visible={isAddGenFlashCardModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddGenFlashCardModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Folder</Text>
            <TextInput
              style={styles.newFolderInput}
              placeholder="Calculus"
              placeholderTextColor="#7B83EB"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <TextInput
              style={[styles.newFolderInput, { height: 100, textAlignVertical: 'top'  }]}
              placeholder="chapter 11 from class 11 in maths.."
              placeholderTextColor="#7B83EB"
              value={newFolderDescription}
              onChangeText={setNewFolderDescription}
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
                onPress={() => setIsFolderModalVisible(false)}
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: '#EEE',
    position: 'relative',
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    flex: 1,
    textAlign: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 200,
    paddingVertical: 10,
    elevation: 5,
    position: 'absolute',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1E1E1E',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    padding: 10,
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
  },
  folderText: {
    color: '#4D4D9A',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 9,
  },
  genFlashCon:{
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  
  },
  flashcardCon:{
    width: width / 2.5,
    height: height/10,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    paddingTop: 20,
    height: '75%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  genFlashcardText: {
    width: '95%',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 9,
  },
  newFolderInput: {
    width: '100%',
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#7B83EB',
    textAlignVertical: 'top',
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
    padding: 2,
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    marginBottom: 15,
    width: '50%'
  },
  cancelButtonText: {
    color: '#7B83EB',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    width: '90%',
    padding: 5,
    borderRadius: 20,
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  inputContainer: {
    maxHeight: 150,
    flexGrow: 1,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
    minHeight: 40,
    maxHeight: 150,
    textAlignVertical: 'top',
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
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
    fontSize: 11,
    fontWeight: '600',
    zIndex: 2,
    color: '#7B83EB',
  },
  charCount: {
    fontSize: 12,
    color: '#7B83EB',
    marginTop: 5,
    textAlign: 'right',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default HomeScreen;
