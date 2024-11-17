import { View, Text, YStack, Button, Card } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useStudy } from '@/context/StudyContext';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TagStudyScreen() {
  const { name } = useLocalSearchParams();
  const { getCardsByTag, markCardAsStudied } = useStudy();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadCards();
  }, [name]);

  const loadCards = async () => {
    const tagCards = await getCardsByTag(String(name));
    setCards(tagCards);
  };

  // ... rest of the code is similar to [id].tsx
  // Copy the same card display and study logic
} 