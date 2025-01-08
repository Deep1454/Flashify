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
import { Dropdown } from 'react-native-element-dropdown';
import FlashCardService from '../services/FlashCardService'
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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dropDown, setDropDown] = useState([]);
  const [isFolderFocus, setIsFolderFocus] = useState(false);
  const [baseFolder, setBaseFolder] = useState('Select Folder');
  const [isBaseFolderFocus, setIsBaseFolderFocus] = useState(false);
  const [flashcard, setFlashcard] = useState({ answer:"", question:""})
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const [isFlipped, setIsFlipped] = useState(false);

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
    populateDropDown();
  }, [])

  const populateDropDown = ()=>{
    let temp_fol_val = {label: '', value: ''};
    let folder_list = []
    folders.forEach(element => {
      temp_fol_val = {label: `${element.name}`, value: `${element.id}`};
      folder_list.push(temp_fol_val)
    });
    setDropDown(folder_list)
  }

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
  
  const handleAddFlashCard = async () => {
    const payload = {
      question: flashcard.question,
      answer: flashcard.answer
    }
      await FlashCardService.createFlashCard(baseFolder, payload, await Storage.getItem('token'))
      .then((res)=>{
        CustomeAlert('Success', "Flashcard added", ()=>{setIsAddGenFlashCardModalVisible(false); setIsGenFlashCModalVisible(true);})
      }).catch((e)=>{
        CustomeAlert('Unsuccessful', e.message, ()=>{setIsAddGenFlashCardModalVisible(false); setIsFolderModalVisible(true);})
      })
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
      onPress={() => {
        setIsGenFlashCModalVisible(false);
        setIsAddGenFlashCardModalVisible(true);
        setFlashcard({answer:item.answer, question:item.question})
        setIsGenFlashCModalVisible(false);
      }}
    >
      <Text style={styles.genFlashcardText}>{item.question}</Text>
    </TouchableOpacity>
  );

  const closePopup = () => {
    setSelectedIndex(null);
    setIsFlipped(false);
    rotateAnimation.setValue(0);
  };

  const flipCard = async () => {
    Animated.timing(rotateAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const frontRotateY = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

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

        <View style={styles.profilemodalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile</Text>
            <Text
              style={styles.modalText}
              >Username: {username}</Text>
            <Text
              style={styles.modalText}
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
        <View style={styles.addFolderModalContainer}>
          <View style={styles.addFolderModalContent}>
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
    <View style={styles.genFlashModalContainer}>
      <View style={styles.genFlashModalContent}>
        <Text style={styles.genFlashModalTitle}>Generated Flashcards</Text>
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
          <TouchableOpacity
            style={styles.cardWrapper}
            activeOpacity={1} // Prevent double-tap
            onPress={flipCard} // Flip the card on touch
          >
            <Animated.View
              style={[
                styles.flashcard,
                {
                  transform: [
                    { perspective: 1200 },
                    { rotateY: frontRotateY },
                  ],
                },
              ]}
            >
              <View style={styles.flashcardFront}>
                <Text style={styles.flashcardText}>{flashcard.question}</Text>
              </View>
            </Animated.View>
            <Animated.View
              style={[
                styles.flashcard,
                styles.cardBack,
                {
                  transform: [
                    { perspective: 1200 },
                    { rotateY: backRotateY },
                  ],
                },
              ]}
            >
              <View style={styles.flashcardBack}>
                <Text style={styles.flashcardText}>{flashcard.answer}</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
            <Dropdown
            style={[styles.dropdown, isFolderFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dropDown}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFolderFocus ? 'Select item' : '...'}
            searchPlaceholder="Search..."
            value={baseFolder}
            onFocus={() => setIsBaseFolderFocus(true)}
            onBlur={() => setIsBaseFolderFocus(false)}
            onChange={item => {
              setBaseFolder(item.value);
              setIsBaseFolderFocus(false);
            }}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.addFolderButton}
                onPress={handleAddFlashCard}
              >
                <Text style={styles.addFolderButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsAddGenFlashCardModalVisible(false)
                  setIsGenFlashCModalVisible(true)
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
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
  profilemodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '60%',
    paddingTop: 20,
    height: '25%',
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
  },
  modalText:{
    width: '90%',
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#7B83EB',
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  addFolderModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addFolderModalContent: {
    width: '60%',
    paddingTop: 20,
    height: '30%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  genFlashModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  genFlashModalContent: {
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
  genFlashModalTitle: {
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
    justifyContent: 'space-around', 
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20, 
  },
  addFolderButton: {
    flex: 1, 
    backgroundColor: '#7B83EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5, 
  },
  addFolderButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1, 
    backgroundColor: '#E0E7FF', 
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5, 
  },
  cancelButtonText: {
    color: '#7B83EB', 
    fontWeight: 'bold',
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

  dropdown: {
    width: '75%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 15,
    backgroundColor: 'rgb(255, 255, 255)', 
  },

  placeholderStyle: {
    fontSize: 16,
  },

  selectedTextStyle: {
    fontSize: 16,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  cardWrapper: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
  },
  
  flashcard: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },

  flashcardFront: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  flashcardBack: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
