import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { Button, Input, YStack } from 'tamagui';

export default function Login(): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login({ username });
    router.replace('/');
  };

  return (
    <YStack
      gap="$4"
      padding="$4"
      alignItems="center"
      justifyContent="center"
      flex={1}
    >
      <Input
        size="$4"
        width="100%"
        maxWidth={300}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Button
        size="$4"
        theme="active"
        width="100%"
        maxWidth={300}
        onPress={handleLogin}
      >
        Login
      </Button>
    </YStack>
  );
} 