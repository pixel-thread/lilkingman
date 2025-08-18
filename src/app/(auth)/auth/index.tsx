import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthScreen } from '~/src/components/screen/auth';

export default function page() {
  return (
    <>
      <StatusBar translucent style="dark" />
      <Stack.Screen options={{ title: 'Auth', headerShown: false }} />
      <AuthScreen />
    </>
  );
}
