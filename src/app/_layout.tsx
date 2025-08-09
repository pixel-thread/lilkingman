import '@styles/global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { AuthContextProvider } from '@components/provider/auth';
import { TQueryProvider } from '@components/provider/query';
import { Redirect } from '@components/common/Redirect';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { EventContextProvider } from '../components/provider/event';
import { Loading } from '../components/common/Loading';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useScannerStore } from '../lib/store/useScannerStore';
import { InviteScanner } from '../components/common/InviteScanner';
import ErrorBoundary from '../components/common/ErrorBoundary';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const [isMounted, setIsMounted] = React.useState(false);
  const { open, onValueChange: onClose } = useScannerStore();

  React.useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#000" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <SafeAreaProvider>
            <TQueryProvider>
              <AuthContextProvider>
                <Loading>
                  <Redirect>
                    <EventContextProvider>
                      <Stack>
                        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                        <Stack.Screen name="modal" options={{ headerShown: false }} />
                      </Stack>
                    </EventContextProvider>
                  </Redirect>
                </Loading>
                <InviteScanner open={open} onClose={() => onClose(false)} />
              </AuthContextProvider>
            </TQueryProvider>
          </SafeAreaProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
