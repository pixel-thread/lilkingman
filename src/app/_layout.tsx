import '@styles/global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { AuthContextProvider } from '@components/provider/auth';
import { TQueryProvider } from '@components/provider/query';
import { Redirect } from '@components/common/Redirect';
import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { EventContextProvider } from '../components/provider/event';
import { Loading } from '../components/common/Loading';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }
  return (
    <TQueryProvider>
      <AuthContextProvider>
        <EventContextProvider>
          <Loading>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar className="" />
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1">
                <Redirect>
                  <Stack>
                    <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                  </Stack>
                </Redirect>
              </KeyboardAvoidingView>
            </GestureHandlerRootView>
          </Loading>
        </EventContextProvider>
      </AuthContextProvider>
    </TQueryProvider>
  );
}
