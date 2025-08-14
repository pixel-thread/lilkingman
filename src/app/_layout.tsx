import '@styles/global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname } from 'expo-router';
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
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';
import { Loader } from '../components/common/Loader';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const { open, onValueChange: onClose } = useScannerStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 1000);
  }, []);

  if (!isReady) {
    return <Loader />;
  }

  return (
    <SafeAreaProvider>
      <ScreenCapturePrevent>
        <ClerkProvider
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}>
          <TQueryProvider>
            <Loading>
              <AuthContextProvider>
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
              </AuthContextProvider>
            </Loading>
          </TQueryProvider>
        </ClerkProvider>
      </ScreenCapturePrevent>
    </SafeAreaProvider>
  );
}
