import { Image, View } from 'react-native';
import { Text } from '../ui/Text';
import Constants from 'expo-constants';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';

export const CustomAvatar = () => {
  const appName = Constants.expoConfig?.name || '';
  const { user } = useAuthContext();
  return (
    <View className="items-center p-4">
      <Image
        source={require('../../assets/splash.png')}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text className="mt-5 text-xl font-bold uppercase text-black">{appName}</Text>
      <Text className="mt-5 text-lg  uppercase text-muted-foreground">{user?.auth.email}</Text>
    </View>
  );
};
