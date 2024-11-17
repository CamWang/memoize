import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { Button, Input, YStack, Text, XStack, Form, Label } from 'tamagui';
import { authApi, userApi } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { ArrowLeft } from '@tamagui/lucide-icons';

export default function Login(): JSX.Element {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError('Username and password are required to sign you in');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await authApi.login(formData.username, formData.password);
      login({
        access_token: response.access_token,
        user: response.user
      });
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4169E1', '#6495ED', '#E6E6FA']}
        style={styles.gradientTop}
        start={[0, 0]}
        end={[1, 1]}
      >
        <Button
          size="$5"
          icon={ArrowLeft}
          color="$white1"
          backgroundColor="transparent"
          onPress={() => router.back()}
          pressStyle={{ backgroundColor: '$blue10', borderWidth: 0 }}
          style={styles.backButton}
        >
          Back
        </Button>
        
        {/* Decorative Circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
      </LinearGradient>

      <YStack
        gap="$4"
        padding="$4"
        backgroundColor="white"
        borderTopLeftRadius={30}
        borderTopRightRadius={30}
        style={styles.formContainer}
      >
        <Text fontSize={32} fontWeight="bold" color="$blue10">
          Welcome Back
        </Text>

        <Form onSubmit={handleLogin} gap>
          <YStack gap="$4">
            <YStack>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                size="$5"
                borderWidth={0}
                placeholder="Enter your username"
                keyboardType="default"
                autoCapitalize="none"
                value={formData.username}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, username: text }));
                  setError('');
                }}
              />
            </YStack>

            <YStack>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                size="$5"
                borderWidth={0}
                placeholder="Enter your password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, password: text }));
                  setError('');
                }}
              />
            </YStack>

            {error && (
              <Text color="$red10" textAlign="center">
                {error}
              </Text>
            )}

            <Button
              size="$5"
              theme="active"
              backgroundColor={isLoading? "$gray10": "$blue10"}
              color="$white1"
              marginTop="$4"
              onPress={handleLogin}
              disabled={isLoading}
            >
              Sign in
            </Button>

            <XStack justifyContent="center" space="$2">
              <Text>Don't have an account?</Text>
              <Text
                color={isLoading? "$gray10": "$blue10"}
                onPress={() => router.replace('/register')}
              >
                Sign up
              </Text>
            </XStack>
          </YStack>
        </Form>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gradientTop: {
    height: '30%',
    position: 'relative',
  },
  formContainer: {
    flex: 1,
    marginTop: -30,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    zIndex: 1,
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
    right: -50,
    backgroundColor: 'rgba(0, 0, 139, 0.3)',
  },
  circle2: {
    width: 150,
    height: 150,
    top: 50,
    left: -30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}); 