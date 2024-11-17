import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { Button, Input, YStack, Text, XStack, Form, Checkbox, Label } from 'tamagui';
import { authApi } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { ArrowLeft } from '@tamagui/lucide-icons';

export default function Register(): JSX.Element {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required to sign you up');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const loginResponse = await authApi.login(formData.username, formData.password);
      login({
        access_token: loginResponse.access_token,
        user: loginResponse.user
      });
      
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4169E1', '#6495ED', '#E6E6FA']}
        style={styles.gradientTop}
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
        space="$4"
        padding="$4"
        backgroundColor="white"
        borderTopLeftRadius={30}
        borderTopRightRadius={30}
        style={styles.formContainer}
      >
        <Text fontSize={32} fontWeight="bold" color="$blue10">
          Get Started
        </Text>

        <Form onSubmit={handleRegister} space>
          <YStack space="$4">
            <YStack>
              <Label htmlFor="fullName">Username</Label>
              <Input
                id="fullName"
                size="$5"
                borderWidth={0}
                placeholder="Get yourself a username"
                value={formData.username}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, username: text }));
                  setError('');
                }}
              />
            </YStack>

            <YStack>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                size="$5"
                borderWidth={0}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text }));
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
                placeholder="Set a strong password"
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
              onPress={handleRegister}
              disabled={isLoading}
            >
              Sign up
            </Button>
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