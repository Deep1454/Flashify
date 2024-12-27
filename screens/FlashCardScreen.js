import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FlashCardScreen = ({ route }) => {
  const { folderName } = route.params;

  const [flashcards] = useState([
    { id: '1', question: 'What is React?', answer: 'A JavaScript library for building user interfaces.' },
    { id: '2', question: 'What is a component?', answer: 'A reusable piece of UI.' },
    { id: '3', question: 'What is state?', answer: 'A way to store data in a component.' },
  ]);

  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const rotateAnimation = useState(new Animated.Value(0))[0];

  const flipCard = () => {
    Animated.timing(rotateAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
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
    setSelectedFlashcard(null);
    setIsFlipped(false);
    rotateAnimation.setValue(0);
  };

  const renderFlashcard = ({ item }) => (
    <TouchableOpacity
      style={styles.flashcardItem}
      onPress={() => setSelectedFlashcard(item)}
    >
      <Text style={styles.flashcardText}>{item.question}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <LinearGradient colors={['#7B83EB', '#4D4D9A']} style={styles.gradientTopContainer}>
          <Text style={styles.sectionTitle}>{folderName}</Text>
        </LinearGradient>
      </View>

      <FlatList
        data={flashcards}
        renderItem={renderFlashcard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flashcardList}
      />

      {selectedFlashcard && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!!selectedFlashcard}
          onRequestClose={closePopup}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalOverlay} onPress={closePopup} />
            <View style={styles.cardWrapper}>
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
                  <Text style={styles.flashcardText}>{selectedFlashcard.question}</Text>
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
                  <Text style={styles.flashcardText}>{selectedFlashcard.answer}</Text>
                </View>
              </Animated.View>
            </View>
            <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
              <Text style={styles.flipButtonText}>Flip</Text>
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
    height: 190,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
  },
  gradientTopContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 59,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 26,
    color: '#FFF',
    fontWeight: '700',
  },
  flashcardList: {
    padding: 20,
  },
  flashcardItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  flashcardText: {
    fontSize: 16,
    color: '#4D4D9A',
    textAlign: 'center',
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
    width: 300,
    height: 200,
    position: 'relative',
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
  flipButton: {
    marginTop: 20,
    backgroundColor: '#7B83EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FlashCardScreen;
