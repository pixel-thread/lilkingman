import { Stack } from 'expo-router';
import { AuthScreen } from '~/src/components/screen/auth';

export default function page() {
  return (
    <>
      <Stack.Screen options={{ title: 'Auth', headerShown: false }} />
      <AuthScreen />
    </>
  );
}
