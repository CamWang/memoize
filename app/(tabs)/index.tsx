import { View, Text, YStack, XStack, Card, Button, Progress } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { CategorySummary, useStudy } from '@/context/StudyContext';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';

function ProgressCard({ totalCards, studiedCards }: { totalCards: number; studiedCards: number }) {
  const progress = totalCards > 0 ? (studiedCards / totalCards) * 100 : 0;

  return (
    <Card elevate bordered backgroundColor="$yellow2" padding="$4" marginVertical="$2">
      <YStack space="$2">
        <Text fontSize="$6" fontWeight="bold" color="$yellow12">PROGRESS</Text>
        <Progress value={progress} backgroundColor="$yellow5">
          <Progress.Indicator animation="bouncy" backgroundColor="$yellow8" />
        </Progress>
        <Text fontSize="$4" color="$gray11">
          {studiedCards} out of {totalCards} cards
        </Text>
      </YStack>
    </Card>
  );
}

function CategoryList({ categories }: { categories: CategorySummary[] }) {
  if (categories.length === 0) return (
    <>
      <Card elevate bordered backgroundColor="$orange2" padding="$4" marginVertical="$2">
        <YStack space="$2">
          <Text fontSize="$6" fontWeight="bold" color="$orange12">Create your first card deck</Text>
        </YStack>
      </Card>
    </>
  )
  return (
    <>
      {
        categories.map((category) => (
          <Card elevate bordered backgroundColor="$orange2" padding="$4" marginVertical="$2">
            <YStack space="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$6" fontWeight="bold" color="$orange12">{category.name}</Text>
                <Text fontSize="$3" color="$gray11" color="$orange12">
                  {category.studiedCount}/{category.cardCount} cards
                </Text>
              </XStack>
            </YStack>
          </Card>
        ))
      }
    </>
  );
}

function TagList({ tags }: { tags: any[] }) {
  if (tags.length === 0) return (
    <>
      <Card elevate bordered backgroundColor="$green2" padding="$4" marginVertical="$2">
        <YStack space="$2">
          <Text fontSize="$6" fontWeight="bold" color="$green12">Create your first tag</Text>
        </YStack>
      </Card>
    </>
  )
  return (
    <>
      {
        tags.map((tag) => (
          <Card elevate bordered backgroundColor="$green2" padding="$4" marginVertical="$2">
            <YStack space="$2">
              <Text fontSize="$6" fontWeight="bold" color="$green12">{tag.name}</Text>
            </YStack>
          </Card>
        ))
      }
    </>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { categories, tags, totalCards, studiedCards, isLoading } = useStudy();

  const welcomeMessage = () => {
    // welcome message based on time of day
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) {
      return "Morning";
    } else if (hours < 18) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <View padding="$4">
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <YStack padding="$4" space="$4">
          <Text fontSize="$8" fontWeight="bold" marginVertical="$4" color="$gray12">
            {welcomeMessage()}, {user?.username}
          </Text>

          <ProgressCard
            totalCards={totalCards}
            studiedCards={studiedCards}
          />

          <CategoryList categories={categories} />

          <TagList tags={tags} />

          <Button onPress={() => logout()} backgroundColor="$red4" color="$red12">Logout</Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}