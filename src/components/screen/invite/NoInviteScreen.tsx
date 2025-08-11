import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '~/src/components/ui/Text';
import { Button } from '~/src/components/ui/Button';

export const NoInviteScreen = () => {
  const router = useRouter();

  const navigateToHome = () => {
    router.navigate('/');
  };

  return (
    <View
      className="flex-1 items-center justify-center space-y-6 bg-background p-6"
      style={{ paddingTop: 0 }}>
      <View className="mb-2 items-center justify-center rounded-full bg-gray-100 p-6">
        <Ionicons name="mail-outline" size={48} color="#6b7280" />
      </View>
      <Text className="mb-2 text-2xl font-medium text-foreground">No Active Invite</Text>
      <Text className="mb-4 text-center text-base text-muted-foreground">
        You need to be part of an event to send invites.
      </Text>
      <Text className="mb-4 text-center text-base text-muted-foreground">Join an event first.</Text>
      <View className="w-full gap-y-3">
        <Button
          variant="secondary"
          onPress={navigateToHome}
          className="h-16 w-full flex-row gap-x-2 rounded-full">
          <Ionicons name="home-outline" size={20} color="#6b7280" className="mr-2" />
          <Text className="text-muted-foreground">Go to Home</Text>
        </Button>
      </View>
    </View>
  );
};
