import { Button } from '../../ui/Button';
import { Text } from '../../ui/Text';
import * as WebBrowser from 'expo-web-browser';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
WebBrowser.maybeCompleteAuthSession();

export const SocialLogin = () => {
  const { googleLogin, isAuthLoading } = useAuthContext();
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      googleLogin();
    } catch (err) {
      console.error('OAuth error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="h-14 w-full flex-row items-center justify-center gap-x-3 rounded-2xl border-2 border-white/30 bg-white/20 backdrop-blur-md"
      onPress={handleGoogleLogin}
      disabled={loading || isSignedIn || isAuthLoading}>
      {/* Google Icon */}
      <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
        <Text className="text-sm">G</Text>
      </View>

      <Text className="text-lg font-semibold text-white">
        {loading || isAuthLoading
          ? 'Signing  in...'
          : isSignedIn
            ? 'Signing In...'
            : 'Continue with Google'}
      </Text>
    </Button>
  );
};
