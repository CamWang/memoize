import { View, Text, YStack, Button, Card } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useStudy } from '@/context/StudyContext';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudyScreen() {
  const { id } = useLocalSearchParams();
  const { getCardsByCategory, markCardAsStudied } = useStudy();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadCards();
  }, [id]);

  const loadCards = async () => {
    const categoryCards = await getCardsByCategory(Number(id));
    setCards(categoryCards);
  };

  const handleStudyResult = async (success: boolean) => {
    const currentCard = cards[currentIndex];
    await markCardAsStudied(currentCard.id, success);
    setCurrentIndex(prev => prev + 1);
    setIsFlipped(false);
  };

  if (cards.length === 0) {
    return (
      <SafeAreaView>
        <View padding="$4">
          <Text>No cards available</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <SafeAreaView>
        <View padding="$4">
          <Text>All cards completed!</Text>
          <Button onPress={() => {
            setCurrentIndex(0);
            loadCards();
          }}>
            Start Over
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <SafeAreaView>
      <YStack padding="$4" space="$4">
        <Text>Card {currentIndex + 1} of {cards.length}</Text>
        
        <Card
          elevate
          bordered
          height={300}
          backgroundColor="$blue2"
          pressStyle={{ scale: 0.95 }}
          onPress={() => setIsFlipped(!isFlipped)}
        >
          <View padding="$4" flex={1} justifyContent="center" alignItems="center">
            <Text fontSize="$6" textAlign="center">
              {isFlipped ? currentCard.back : currentCard.front}
            </Text>
          </View>
        </Card>

        <XStack space="$4" justifyContent="center">
          <Button
            backgroundColor="$red8"
            onPress={() => handleStudyResult(false)}
          >
            Incorrect
          </Button>
          <Button
            backgroundColor="$green8"
            onPress={() => handleStudyResult(true)}
          >
            Correct
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
} 