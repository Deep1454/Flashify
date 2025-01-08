import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Easing,
  Dimensions,
  TextInput,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Storage from '../services/AsyncStorage';
import FlashCardService from '../services/FlashCardService'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import CustomeAlert from '../components/CustomeAlert';
import AIService from '../services/AIService';
const { width, height } = Dimensions.get('window');

const FlashCardScreen = ({ route, navigation }) => {
  const { folderName } = route.params;
  const { folderId } = route.params;
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [flashcards, setFlashcards] = useState([]);
  const [isAddFlashCardModalVisible, setIsAddFlashCardModalVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const [isFlipped, setIsFlipped] = useState(false);
  const [prompts, setPrompts] = useState([])
  const [responses, setResponses] = useState([])
  const [prompt, setPrompt] = useState('')
  const [isChatModalVisible, setIsChatModalVisible] = useState(false)

  useEffect(()=>{
    const getFlashcards = async () => {
      try {
        const token = await Storage.getItem('token');
        const response = await FlashCardService.getFlashCards(folderId, token);
  
        setFlashcards(response.data.flashcards); 
      } catch (err) {
        CustomeAlert('Error', `${err.message}`);
      }
    };

    getFlashcards();
  }, [folderId])

  const flipCard = () => {
    if (!isFlipped) {
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setIsFlipped(true));
    } else {
      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setIsFlipped(false));
    }
  };
  
  const frontRotateY = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const closePopup = () => {
    setSelectedIndex(null);
    setIsFlipped(false);
    rotateAnimation.setValue(0);
  };

  const handleAddFlashCard = async () => {
    const payload = {
      question: question,
      answer: answer
    }
      await FlashCardService.createFlashCard(folderId, payload, await Storage.getItem('token'))
      .then((res)=>{
        setFlashcards([...flashcards, res.data.flashcard]);
        CustomeAlert('Success', "Flashcard added", ()=>{setIsAddFlashCardModalVisible(false);})
      }).catch((e)=>{
        CustomeAlert('Unsuccessful', e.message, ()=>{setIsAddFlashCardModalVisible(false);})
      })
  };

  const renderChats = ({ item, index }) => (
    <View style={styles.chatContainer}>
      {index % 2 === 0 ? (
        <Text style={styles.promptText}>👤 {item}</Text>
      ) : (
        <Text style={styles.responseText}>🤖 {item}</Text>
      )}
    </View>
  );

  const handleSend = async() => {
    if (prompt.trim() === '') return;
    console.log(prompt)

    let chat = ""
    for(let i = 0; i < prompts.length; i++){
      chat += "User prompt: " + prompts[i] + "\n"
      chat += "Assistant resposnse: " + responses[i] + "\n"
    }
    chat += "User prompt: " + prompt
    let payload = {
      "prompt":chat
    }

    await AIService.interact_flashcards(folderId, payload, await Storage.getItem('token'))
    .then((res)=>{
      let chat_res = res.data.response;
      setResponses([...responses, chat_res]);
      setPrompts([...prompts, prompt]);
    }).catch((e)=>{
      CustomeAlert('Error', 'Try again later', ()=>{setIsChatModalVisible(false)})
    })

    setPrompt('');
  };
  return (
    <View style={styles.container}>

      {/* Navigation Bar */}
      <View style={styles.topContainer}>
        <LinearGradient colors={['#7B83EB', '#4D4D9A']} style={styles.gradientTopContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>{folderName}</Text>
          <TouchableOpacity
            style={styles.createFolderButton}
            onPress={() => setIsAddFlashCardModalVisible(true)}
          >
            <FontAwesome5 name="plus" size={25} color="#FFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* FLashcards flat list */}
      <View style={styles.flashcardGrid}>
      <FlatList
        data={flashcards}
        renderItem={({ item, index }) => (
        <TouchableOpacity
          key={item.id}
          style={styles.flashcardCard}
          onPress={() => {
            setSelectedIndex(index);
            setIsFlipped(false);
            rotateAnimation.setValue(0);
          }}
        >
            
          <LinearGradient colors={['#7B83EB', '#4D4D9A']} style={styles.flashcardCardGradient}>
            <Text style={styles.flashcardCardText}>{item.question}</Text>
          </LinearGradient>
        </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />

      </View>

      {/* Flash Card flipping */}
      {selectedIndex !== null && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={selectedIndex !== null}
          onRequestClose={closePopup}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalOverlay} onPress={closePopup} />
            <TouchableOpacity
              style={styles.cardWrapper}
              activeOpacity={1} 
              onPress={flipCard}
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
                  <Text style={styles.flashcardText}>{flashcards[selectedIndex].question}</Text>
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
                  <Text style={styles.flashcardText}>{flashcards[selectedIndex].answer}</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {/* Add flashcard modal */}
      <Modal
        visible={isAddFlashCardModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddFlashCardModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={()=>{setIsAddFlashCardModalVisible(false)}}>
          <View style={styles.addFlashModalOverlay}>
            <View style={styles.addFlashModalContent}>
              <Text style={styles.addFlashModalTitle}>Create New Flashcard</Text>
              <TextInput
                style={styles.addFlashInput}
                placeholder="Enter Question"
                placeholderTextColor="#A4A9F1"
                value={question}
                onChangeText={setQuestion}
              />
              <TextInput
                style={[styles.addFlashInput, styles.multilineInput]}
                placeholder="Enter Answer"
                placeholderTextColor="#A4A9F1"
                value={answer}
                onChangeText={setAnswer}
                multiline={true}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.addButton]}
                  onPress={handleAddFlashCard}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsAddFlashCardModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

{/* Chat Modal */}
<Modal
        visible={isChatModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsChatModalVisible(false)}
      >
        <View style={styles.chatModalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Chatify</Text>
            <TouchableOpacity
              onPress={() => setIsChatModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Chat List */}
          <FlatList
            data={[...prompts, ...responses]}
            renderItem={renderChats}
            keyExtractor={(item, index) => index.toString()}
            style={styles.chatList}
          />

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me something..."
              placeholderTextColor="#7B83EB"
              value={prompt}
              onChangeText={setPrompt}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* chat bot button */}
      <View style={styles.chatButtonContainer}>
        <TouchableOpacity
          onPress={() => setIsChatModalVisible(true)}
        >
          <FontAwesome5 name="comment-dots" size={25} color="#000" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E7FF',
  },
  
  topContainer: {
    width: '100%',
    height: 140,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
  },
  
  gradientTopContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 59,
  },
  
  sectionTitle: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  
  backButton: {
    padding: 10,
  },
  
  createFolderButton: {
    padding: 10,
  },
  

  flashcardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 22,
  },

  flashcardCard: {
    width: width / 2.6,
    height: 150,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  
  flashcardCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  
  flashcardCardText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  addFlashModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  addFlashModalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  addFlashModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4D4D9A',
    marginBottom: 20,
    textAlign: 'center',
  },
  addFlashInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F2FA',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#A4A9F1',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#7B83EB',
  },
  cancelButton: {
    backgroundColor: '#E63946',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },  
  chatButtonContainer:{
    width: 40,
    position: 'absolute',
    top: height - 100,
    left: width - 100,
    right: 0,
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 5,
    borderRadius: 15,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  chatModalContainer: {
    position: 'absolute',
    bottom: 0,            
    width: '100%',        
    height: '80%',       
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',    
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,          
    padding: 20,   
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4D4D9A',
  },
  closeButton: {
    backgroundColor: '#4D4D9A',
    borderRadius: 15,
  },
  chatList: {
    flex: 1,
    marginVertical: 10,
  },
  chatContainer: {
    marginVertical: 5,
  },
  promptText: {
    fontSize: 16,
    color: '#4D4D9A',
    marginBottom: 5,
  },
  responseText: {
    fontSize: 16,
    color: '#7B83EB',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#7B83EB',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4D4D9A',
    padding: 8,
    borderRadius: 5,
  },
});

export default FlashCardScreen;
