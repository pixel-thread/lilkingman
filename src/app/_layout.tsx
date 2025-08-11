import '@styles/global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { AuthContextProvider } from '@components/provider/auth';
import { TQueryProvider } from '@components/provider/query';
import { Redirect } from '@components/common/Redirect';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { EventContextProvider } from '../components/provider/event';
import { Loading } from '../components/common/Loading';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useScannerStore } from '../lib/store/useScannerStore';
import { InviteScanner } from '../components/common/InviteScanner';
import { ScreenCapturePrevent } from '../components/common/ScreenCapturePrevent';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const { open, onValueChange: onClose } = useScannerStore();

  return (
    <SafeAreaProvider>
      <ScreenCapturePrevent>
        <TQueryProvider>
          <AuthContextProvider>
            <Loading>
              <Redirect>
                <EventContextProvider>
                  <StatusBar translucent style="dark" />
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      className="flex-1">
                      <Stack>
                        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                        <Stack.Screen
                          name="modal"
                          options={{ headerShown: false, presentation: 'modal' }}
                        />
                      </Stack>
                      <InviteScanner open={open} onClose={() => onClose(false)} />
                    </KeyboardAvoidingView>
                  </GestureHandlerRootView>
                </EventContextProvider>
              </Redirect>
            </Loading>
          </AuthContextProvider>
        </TQueryProvider>
      </ScreenCapturePrevent>
    </SafeAreaProvider>
  );
}
