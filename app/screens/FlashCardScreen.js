import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Storage from '../services/AsyncStorage';
import FlashCardService from '../services/FlashCardService'
const { width } = Dimensions.get('window');

const FlashCardScreen = ({ route, navigation }) => {
  const { folderName } = route.params;
  const { folderId } = route.params;

  const [flashcards, setFlashcards] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(()=>{
    const getFlashcards = async () => {
      try {
        const token = await Storage.getItem('token');
        const response = await FlashCardService.getFlashCards(folderId, token);
  
        setFlashcards(response.data.flashcards); 
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        CustomeAlert('Error', `${err.message}`);
      }
    };
  
    getFlashcards();
  }, [folderId])

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

  const closePopup = () => {
    setSelectedIndex(null);
    setIsFlipped(false);
    rotateAnimation.setValue(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <LinearGradient colors={['#7B83EB', '#4D4D9A']} style={styles.gradientTopContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>{folderName}</Text>
        </LinearGradient>
      </View>

      <View style={styles.flashcardGrid}>
        {flashcards.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.flashcardCard}
            onPress={() => {
              setSelectedIndex(index);
              setIsFlipped(false);
              rotateAnimation.setValue(0);
            }}
          >
            <LinearGradient
              colors={['#7B83EB', '#4D4D9A']}
              style={styles.flashcardCardGradient}
            >
              <Text style={styles.flashcardCardText}>{item.question}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 20,
    paddingTop: 59,
  },
  
  backButton: {
    position: 'absolute',
    left: 30,
    top: 79,
  },

  sectionTitle: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 13,
  },

  flashcardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 22,
  },

  flashcardCard: {
    width: width / 2.5,
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
});

export default FlashCardScreen;
