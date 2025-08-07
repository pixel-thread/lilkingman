import { View, Image, ScrollView } from 'react-native';
import { Text } from '~/src/components/ui/Text';
import { H1, P } from '~/src/components/ui/Typography';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { SocialLogin } from './SocialLogin';
import { RefreshControl } from 'react-native';
import { LoginForm } from './LoginForm';

export const AuthScreen = () => {
  const { refresh, isAuthLoading } = useAuthContext();

  const isLoading = isAuthLoading;
  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        {/* Logo/Image */}
        <View className="mb-8 mt-10 w-full items-center">
          <Image
            source={require('~/src/assets/images/login/login.jpg')}
            className="mb-4 h-72 w-32 rounded-xl"
            resizeMode="contain"
          />
          <H1 className="mb-2 text-center">Welcome Back</H1>
          <P className="text-center text-muted-foreground">Sign in to continue to your account</P>
        </View>

        {/* OTP Login Form */}
        <View className="w-full space-y-4">
          <LoginForm />
        </View>

        {/* Divider */}
        <View className="my-8 w-full flex-row items-center">
          <View className="h-[1px] flex-1 bg-border" />
          <Text className="mx-4 text-muted-foreground">OR</Text>
          <View className="h-[1px] flex-1 bg-border" />
        </View>

        {/* Social Login */}
        <SocialLogin />
      </View>
    </ScrollView>
  );
};
