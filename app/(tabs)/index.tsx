import { Button, View } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  
  return (
    <SafeAreaView>
      <Button>Hello</Button>
      <Button onPress={logout}>Logout</Button>
    </SafeAreaView>
  );
}