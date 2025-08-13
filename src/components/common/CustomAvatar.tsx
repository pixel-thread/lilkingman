import { Image, View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import Constants from 'expo-constants';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';

export const CustomAvatar = () => {
  const appName = Constants.expoConfig?.name || '';
  const { user } = useAuthContext();

  return (
    <View className="items-center border-b border-gray-100 px-6 py-6">
      {/* Simple Avatar Circle */}
      <TouchableOpacity className="mb-4" activeOpacity={0.7}>
        <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-indigo-200 bg-indigo-100">
          <Image
            source={{
              uri: user?.hasImage ? user.imageUrl : 'https://avatar.iran.liara.run/public',
            }}
            className="h-20 w-20 rounded-full"
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      {/* App Name */}
      <Text className="mb-1 text-lg font-semibold capitalize text-gray-800">{appName}</Text>

      {/* User Email */}
      <Text className="text-center text-xs text-gray-500" numberOfLines={1} ellipsizeMode="middle">
        {user?.email}
      </Text>
    </View>
  );
};
