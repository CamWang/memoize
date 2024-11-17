import { useRouter } from 'expo-router';
import { Button, Text, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient'
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#4169E1', '#6495ED', '#E6E6FA']}
        style={styles.gradient}
        start={[0, 0]}
        end={[1, 1]}
      >
        {/* Decorative Circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.circle, styles.circle4]} />

        {/* Content */}
        <YStack
          flex={1}
          justifyContent="space-between"
          padding="$4"
          paddingBottom="$8"
        >
          {/* Welcome Text */}
          <YStack gap="$2" marginTop="$8" flex={1} justifyContent="center">
            <Text
              color="$white1"
              fontSize="$10"
              fontWeight="bold"
              textAlign="center"
            >
              Memoize
            </Text>
            <Text
              color="$white1"
              fontSize="$5"
              textAlign="center"
              opacity={0.9}
            >
              Study smart, not hard
            </Text>
          </YStack>

          {/* Buttons */}
          <XStack space="$4" justifyContent="center" height={60}>
            <Button
              size="$4"
              width={150}
              backgroundColor="transparent"
              pressStyle={{ backgroundColor: '$blue6', borderWidth: 0 }}
              onPress={() => router.push('/login')}
            >
              <Text color="$white1">
                Sign in
              </Text>
            </Button>
            
            <Button
              size="$4"
              width={150}
              backgroundColor="white"
              onPress={() => router.push('/register')}
            >
              <Text color="$blue10">
                Sign up
              </Text>
            </Button>
          </XStack>
        </YStack>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    left: -50,
    backgroundColor: 'rgba(0, 0, 139, 0.3)',
  },
  circle2: {
    width: 150,
    height: 150,
    top: 100,
    right: -30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: 150,
    left: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  circle4: {
    width: 180,
    height: 180,
    bottom: -50,
    right: -50,
    backgroundColor: 'rgba(0, 0, 139, 0.2)',
  },
}); 