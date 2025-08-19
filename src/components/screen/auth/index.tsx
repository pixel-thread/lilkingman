import { View, Image, ScrollView, RefreshControl, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { H1, H2, P } from '~/src/components/ui/Typography';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import Constants from 'expo-constants';
import { SocialLogin } from './SocialLogin';

const { height } = Dimensions.get('window');

export const AuthScreen = () => {
  const { isAuthLoading, refresh } = useAuthContext();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linearGradient}
      />

      <ScrollView
        refreshControl={<RefreshControl refreshing={isAuthLoading} onRefresh={refresh} />}
        className="flex-1"
        contentContainerStyle={{ minHeight: height }}
        showsVerticalScrollIndicator={false}>
        {/* Main Content Container */}
        <View className="flex-1 justify-between gap-y-8">
          {/* Top Section */}
          <View className="flex-1 items-center justify-center px-8 pt-16">
            {/* Logo with modern styling */}
            <View className="mb-12 items-center">
              <View className="mb-8 rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
                <Image
                  source={require('~/src/assets/images/login/login.jpg')}
                  className="h-24 w-24 rounded-2xl"
                  resizeMode="cover"
                />
              </View>

              <H1 className="mb-4 text-center text-4xl font-bold text-white">
                {Constants.expoConfig?.name || 'Lilkingman'}
              </H1>
              <P className="text-center text-lg text-white/80">Premium photo events made simple</P>
            </View>

            {/* Feature Cards */}
            <View className="w-full gap-y-4">
              {[
                {
                  icon: '🎪',
                  title: 'Event Hosting',
                  description: 'Exclusive photo events',
                },
                {
                  icon: '💰',
                  title: 'PPV Photography',
                  description: 'Premium content with pay-per-view access',
                },
              ].map((feature, index) => (
                <View key={index} className="mx-4 rounded-2xl bg-white/10 p-6 backdrop-blur-md">
                  <View className="flex-row items-center">
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-white/20">
                      <P className="text-2xl">{feature.icon}</P>
                    </View>
                    <View className="flex-1">
                      <P className="mb-1 text-lg font-semibold text-white">{feature.title}</P>
                      <P className="text-sm text-white/70">{feature.description}</P>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Section - CTA */}
          <View className="px-8 pb-12">
            {/* Glass morphism container */}
            <View className="rounded-3xl bg-white/10 p-8 backdrop-blur-md">
              <H2 className="mb-2 text-center text-2xl font-bold text-white">Ready to Join?</H2>
              <P className="mb-8 text-center text-white/80">
                Join event creators earning from exclusive photo content
              </P>

              {/* Social Login Button */}
              <SocialLogin />
              {/* Legal text */}
              <P className="mt-6 text-center text-xs text-white/50">
                By continuing, you agree to our <P className="text-white/70 underline">Terms</P> and{' '}
                <P className="text-white/70 underline">Privacy Policy</P>
              </P>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  linearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    zIndex: -1,
  },
});
